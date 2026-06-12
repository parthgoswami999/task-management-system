import { Router } from 'express';
import { sendJsonResponse } from '../config/Util.js';
import { ApiError, asyncHandler } from './Helper.js';
import { Task } from '../models/Task.js';

const router = Router();

const buildTaskQuery = (user, filters) => {
  const query = {};
  query.userID = user._id;

  if (filters.status && filters.status !== 'all') {
    query.status = Number(filters.status);
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }

  return query;
};

const listTasks = async (user, filters) => {
  const query = buildTaskQuery(user, filters);

  return Task.find(query).sort({ status: 1, position: 1, createdAt: -1 }).populate('userID', 'name email');
};

const createTask = async (user, payload) => {
  const userID = user._id;
  const taskStatus = payload.status ?? 0;
  const lastTask = await Task.findOne({ userID, status: taskStatus }).sort({
    position: -1
  });

  const task = await Task.create({
    ...payload,
    status: taskStatus,
    userID,
    position: lastTask ? lastTask.position + 1 : 0
  });

  return task.populate('userID', 'name email');
};

const getTaskById = async (user, taskId) => {
  const task = await Task.findById(taskId).populate('userID', 'name email');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (String(task.userID._id) !== String(user._id)) {
    throw new ApiError(403, 'You do not have access to this task');
  }

  return task;
};

const updateTaskById = async (user, taskId, payload) => {
  const task = await getTaskById(user, taskId);

  Object.assign(task, payload);
  await task.save();

  return task.populate('userID', 'name email');
};

const deleteTaskById = async (user, taskId) => {
  const task = await getTaskById(user, taskId);
  await task.deleteOne();
  return { id: taskId };
};

const reorderTask = async (user, taskId, { status, position }) => {
  const task = await getTaskById(user, taskId);
  const currentUserID = task.userID._id || task.userID;
  const sourceStatus = task.status;
  const sourcePosition = task.position;

  if (sourceStatus === status) {
    if (position > sourcePosition) {
      await Task.updateMany(
        {
          userID: currentUserID,
          status,
          _id: { $ne: task._id },
          position: { $gt: sourcePosition, $lte: position }
        },
        { $inc: { position: -1 } }
      );
    } else {
      await Task.updateMany(
        {
          userID: currentUserID,
          status,
          _id: { $ne: task._id },
          position: { $gte: position, $lt: sourcePosition }
        },
        { $inc: { position: 1 } }
      );
    }
  } else {
    await Task.updateMany(
      {
        userID: currentUserID,
        status: sourceStatus,
        position: { $gt: sourcePosition }
      },
      { $inc: { position: -1 } }
    );

    await Task.updateMany(
      {
        userID: currentUserID,
        status,
        position: { $gte: position }
      },
      { $inc: { position: 1 } }
    );
  }

  task.status = status;
  task.position = position;
  await task.save();

  return task.populate('userID', 'name email');
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tasks = await listTasks(req.user, req.query);

    sendJsonResponse(req, res, tasks);
  })
);
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await getTaskById(req.user, req.params.id);

    sendJsonResponse(req, res, task);
  })
);
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const task = await createTask(req.user, req.body);

    sendJsonResponse(req, res, task, 'Task created successfully', 201);
  })
);
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const task = await updateTaskById(req.user, req.params.id, req.body);

    sendJsonResponse(req, res, task, 'Task updated successfully');
  })
);
router.patch(
  '/:id/reorder',
  asyncHandler(async (req, res) => {
    const task = await reorderTask(req.user, req.params.id, req.body);

    sendJsonResponse(req, res, task, 'Task moved successfully');
  })
);
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await deleteTaskById(req.user, req.params.id);

    sendJsonResponse(req, res, result, 'Task deleted successfully');
  })
);

export default router;
