
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";

export const verifyJwt=asyncHandler(async(req,res,next)=>{
   try {
    console.log('inside auth middleware')
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log("Token",token)
     if(!token){
         throw new ApiError(402,"User not authenticated,token not available")
     }
 
     const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     console.log(decodedToken)
     const user=await User.find(decodedToken._id).select("-password -refreshToken")
 
     if(!user)
         throw new ApiError(402,"User not authenticated,invalid token")
 
     req.user=user
     next()
   } catch (error) {
    throw new ApiError(500,error.message)
    
   }

    



})