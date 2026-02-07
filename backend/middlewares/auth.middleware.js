
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import logger from "../logger.js";


export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {

    let token = null;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
      logger.warn("JWT verification failed: token not provided");
      throw new ApiError(402, "User not authenticated, token not available");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      logger.warn({ userId: decodedToken._id }, "JWT verification failed: user not found");

      throw new ApiError(402, "User not authenticated, invalid token");
    }

    req.user = user;
    next();
  }
   catch (error) {
    logger.error({ err: error }, "JWT verification error");
    throw new ApiError(500, error.message);
  }
});
