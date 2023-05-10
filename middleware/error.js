import { ErrorHandler } from "../utils/errorHandler.js";

const errors = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  // Wrong Mongodb Id error/cast error

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `user with ${Object.keys(err.keyValue)} ${Object.values(
      err.keyValue,
    )} already exists`;
    err = new ErrorHandler(message, 400);
  }
  //wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = "jwt is invalid please try later";
    err = new ErrorHandler(message, 400);
  }
  //jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = "jwt is expired";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errors;
