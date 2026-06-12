import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendJsonResponse } from '../config/Util.js';
import { ApiError, asyncHandler } from './Helper.js';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const passwordValidationMessage =
  'Password must be at least 8 characters long and include 1 uppercase letter, 1 digit, and 1 special character';
const passwordStrengthPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: '7d'
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const validateRegisterPayload = ({ name, email, password }) => {
  if (normalizeText(name).length < 2) {
    throw new ApiError(422, 'Name must be at least 2 characters long');
  }

  if (!emailPattern.test(normalizeText(email))) {
    throw new ApiError(422, 'Please provide a valid email');
  }

  if (!passwordStrengthPattern.test(password ?? '')) {
    throw new ApiError(422, passwordValidationMessage);
  }
};

const validateLoginPayload = ({ email, password }) => {
  if (!emailPattern.test(normalizeText(email))) {
    throw new ApiError(422, 'Please provide a valid email');
  }

  if (!normalizeText(password)) {
    throw new ApiError(422, 'Password is required');
  }
};

const validateProfilePayload = ({ name, email }) => {
  if (normalizeText(name).length < 2) {
    throw new ApiError(422, 'Name must be at least 2 characters long');
  }

  if (!emailPattern.test(normalizeText(email))) {
    throw new ApiError(422, 'Please provide a valid email');
  }
};

const validateChangePasswordPayload = ({ oldPassword, newPassword }) => {
  if (!normalizeText(oldPassword)) {
    throw new ApiError(422, 'Old password is required');
  }

  if (!passwordStrengthPattern.test(newPassword ?? '')) {
    throw new ApiError(422, passwordValidationMessage);
  }
};

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    validateRegisterPayload(req.body);

    const { name, email, password } = req.body;
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password
    });

    sendJsonResponse(
      req,
      res,
      {
        token: signToken(user._id),
        user: sanitizeUser(user)
      },
      'Account created successfully',
      201
    );
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    validateLoginPayload(req.body);

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    const isPasswordValid = user ? user.decryptPassword() === password : false;

    if (!user || !isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    sendJsonResponse(req, res, {
      token: signToken(user._id),
      user: sanitizeUser(user)
    }, 'Logged in successfully');
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    sendJsonResponse(req, res, sanitizeUser(user));
  })
);

router.patch(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    validateProfilePayload(req.body);

    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    user.name = name.trim();
    user.email = normalizedEmail;
    await user.save();

    sendJsonResponse(req, res, sanitizeUser(user), 'Profile updated successfully');
  })
);

router.patch(
  '/change-password',
  protect,
  asyncHandler(async (req, res) => {
    validateChangePasswordPayload(req.body);

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = user.decryptPassword() === oldPassword;

    if (!isPasswordValid) {
      throw new ApiError(400, 'Old password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    sendJsonResponse(req, res, null, 'Password changed successfully');
  })
);

export default router;
