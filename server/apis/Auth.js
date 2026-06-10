import { Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendJsonResponse } from '../config/Util.js';
import { ApiError, asyncHandler } from './Helper.js';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/error.js';

const router = Router();

const passwordValidationMessage =
  'Password must be at least 8 characters long and include 1 uppercase letter, 1 digit, and 1 special character';
const passwordStrengthPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const registerValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password')
    .matches(passwordStrengthPattern)
    .withMessage(passwordValidationMessage)
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').trim().isEmail().withMessage('Please provide a valid email')
];

const changePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .matches(passwordStrengthPattern)
    .withMessage(passwordValidationMessage)
];

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

router.post(
  '/register',
  registerValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const user = await User.create({
      name,
      email,
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
  loginValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

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
  updateProfileValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
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
  changePasswordValidator,
  validateRequest,
  asyncHandler(async (req, res) => {
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
