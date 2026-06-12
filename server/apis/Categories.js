import { Router } from 'express';
import { sendJsonResponse } from '../config/Util.js';
import { Category } from '../models/Category.js';

const Categories = Router();

Categories.get('/getAll', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    sendJsonResponse(req, res, categories, 'Categories retrieved successfully');
  } catch (_error) {
    sendJsonResponse(req, res, null, 'Failed to retrieve categories', 500, false);
  }
});

Categories.get('/getByUser', async (req, res) => {
  try {
    const categories = await Category.find({ userID: req.user._id }).sort({ createdAt: -1 });
    sendJsonResponse(req, res, categories, 'User categories retrieved successfully');
  } catch (_error) {
    sendJsonResponse(req, res, null, 'Failed to retrieve user categories', 500, false);
  }
});

Categories.get('/getById/:id', async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      return sendJsonResponse(req, res, null, 'Category not found', 404, false);
    }
    sendJsonResponse(req, res, category, 'Category retrieved successfully');
  } catch (_error) {
    sendJsonResponse(req, res, null, 'Failed to retrieve category', 500, false);
  }
});

Categories.post('/create', async (req, res) => {
  try {
    console.log('Creating category with data:', req.body, 'for user:', req.user);
    const { name, color, description } = req.body;
    if(!name || name.trim() === '' || color && color.trim() === '') {
      return sendJsonResponse(req, res, null, 'Invalid category data', 400, false);
    }
    const category = new Category({
      name,
      color,
      description,
      userID: req.user._id
    });
    await category.save();
    sendJsonResponse(req, res, category, 'Category created successfully', 201);
  } catch (_error) {
    sendJsonResponse(req, res, null, 'Failed to create category', 500, false);
  }
});

Categories.delete('/delete/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id });
    if (!category) {
      return sendJsonResponse(req, res, null, 'Category not found or unauthorized', 404, false);
    }
    sendJsonResponse(req, res, category, 'Category deleted successfully');
  } catch (_error) {
    sendJsonResponse(req, res, null, 'Failed to delete category', 500, false);
  }
});

Categories.patch('/update/:id', async (req, res) => {
  try {
    const { name, color, description } = req.body;
    if((name && name.trim() === '') || (color && color.trim() === '')) {
      return sendJsonResponse(req, res, null, 'Invalid category data', 400, false);
    }
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name, color, description },
      { new: true }
    );
    if (!category) {
      return sendJsonResponse(req, res, null, 'Category not found or unauthorized', 404, false);
    }
    sendJsonResponse(req, res, category, 'Category updated successfully');
  } catch (_error) {
    sendJsonResponse(req, res, null, 'Failed to update category', 500, false);
  }
});

export default Categories;
