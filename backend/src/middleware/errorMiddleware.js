/** CHECK FOR UPDATES ----------------------- */
export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A record with that unique value already exists",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Database validation failed",
    });
  }

  return res.status(500).json({
    message: "An unexpected server error occurred",
  });
}