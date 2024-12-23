// // Global error handler
// export const errorHandler = (err, req, res, next) => {
//   console.error(err);

//   const statusCode = err.statusCode || 500;

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
// };

// To handle unmatched path or routes
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Custom error handler
const errorHandler = (err, req, res, next) => {
  let statusCode;
  if (err.statusCode) {
    statusCode = err.statusCode;
  } else {
    statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  }
  let message = err.message;

  // send response
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
