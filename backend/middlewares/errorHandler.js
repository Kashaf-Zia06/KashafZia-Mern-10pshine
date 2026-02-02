import { ApiError } from "../utils/apiError.js";

 const globalErrorHandler = (err, req, res, next) => {
  console.log("Global error handler:", err);

  // If error is instance of ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Fallback for any other errors
  return res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

export {globalErrorHandler}