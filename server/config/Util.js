export const sendJsonResponse = (req, res, data = null, message = '', statusCode = 200, success = true) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};
