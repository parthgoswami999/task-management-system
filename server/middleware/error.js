import { validationResult } from 'express-validator';

export const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      statusCode: 422,
      message: 'Validation failed',
      details: errors.array().map(({ msg, path }) => ({ field: path, message: msg }))
    });
  }

  return next();
};

export const notFoundHandler = (req, _res, next) => {
  next({
    statusCode: 404,
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = async (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details || undefined
  });
};
