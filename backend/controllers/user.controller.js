
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt"



const generateAccessRefreshTokens=async(userId)=>{
    try {
        // console.log("Inside generateaccessrefresh token function in user controller")
        const user=await User.findById(userId)
        // console.log(user)
        const accessToken=user.generateAccessToken()
        // console.log(accessToken)
        
        const refreshToken=user.generateRefreshToken()
        // console.log(refreshToken)
        //after generating store refresh token in db as well
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        // console.log("refresh token saved in db")



        return {accessToken,refreshToken}
        
        
    } catch (error) {
        throw new ApiError(500,error.message)
        
    }


}



const registerUser=asyncHandler(async(req,res)=>{
    // console.log("Inside register user")
    
    //extracting data
    const {userName,email,password} = req.body
    // console.log(userName)
    // console.log(email)
    // console.log(password)

    // console.log("Validation checks")
    //validation checks if any field is empty
   if( 
    [userName,email,password].some((field)=>
    field?.trim()==="")

   ){
    throw new ApiError(400,"Required field is missing")
   }

   
   //if user already exists
  const existingUser = await User.findOne({
    $or:[{userName},{email}]}
   )
//    console.log("Checking whether user exist or not?")
   if(existingUser){
    throw new ApiError(402,"User already exists")
   }

//    console.log("Creating a user")

   //creating user entry in database
   const user=await User.create({
    userName:userName.toLowerCase(),
    email:email,
    password:password
   })

//    console.log("Finding cretaed user")
   const createdUser=await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser)
   {
    throw new ApiError(500," User Registration failed")
   }

//    console.log("Sending response")
   res.status(200).json(
    new apiResponse(200,"User registered successfully",{createdUser})
   )












    
    
})


const login=asyncHandler(async(req,res)=>{
    
    const {email,password}=req.body;

    // console.log(email)
    // console.log(password)
    if(!email)
        throw new ApiError(400,"Email is required")

    if(!password)
        throw new ApiError(400,"Password is required")

    
    const existedUser=await User.findOne({email})

    // console.log("printing existed user,",existedUser)

    if(!existedUser)
        throw new ApiError(402,"User doesnot exist")

    // console.log("checking password valid")

    // console.log(existedUser.password)

    const passwordValid=await existedUser.isPasswordCorrect(password)

    // console.log(passwordValid)

    if(!passwordValid)
    {
        throw new ApiError(402,"Incorrect password")
    }

    // console.log("going in  generateAccessRefreshTokens function before")
    const {accessToken,refreshToken}=await generateAccessRefreshTokens(existedUser._id)
    // console.log("coming out of  generateAccessRefreshTokens function ")
    // console.log(accessToken)
    // console.log(refreshToken)

    const loggedInUser=await User.findById(existedUser._id).select("-password -refreshToken")

    

    // console.log(loggedInUser)

    const options={
        httpOnly:true,
        secure:false,
         sameSite: "lax"
        // secure:false
    }

    // console.log("sending repsonse after logging")

    return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new apiResponse(200, "User successfully loggedIn", {
      user: loggedInUser,
      accessToken,
      refreshToken
    })
  );





  

})


// const logOut=asyncHandler(async(req,res)=>{

//     console.log("Inside logout function")
//     await User.findById(
//         req.user._id,
//         {
//             $set:
//                 {
//                     refreshToken:undefined
//                 }
            
//         },
//         {
//             new:true
//         }
//     )

//     const options={
//         httpOnly:true,
//         secure:false
//     }


//     res.status(200).
//     clearCookie("accessToken",options).
//     clearCookie("refreshToken",options).
//     json(
//         new apiResponse(200,"User logged out successfully",options)
//     )

// })

const logOut = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


// const forgotPassword = asyncHandler(async (req, res) => {
//     console.log("Inside forgot password iin user controller")
//     const { email } = req.body;
//     console.log(email)
//     if (!email) throw new ApiError(400, "Email is required");

//     const user = await User.findOne({ email });
//     console.log(user)
//     if (!user) throw new ApiError(404, "User not found");

//     console.log("resetting password token")
//     const resetToken = user.generatePasswordResetToken();
//     await user.save({ validateBeforeSave: false });

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//       console.log("sending mail reset")
//     await sendEmail({
//         to: user.email,
//         subject: "Reset your password",
//         html: `
//             <p>You requested a password reset</p>
//             <p>Click below to reset:</p>
//             <a href="${resetUrl}">${resetUrl}</a>
//             <p>This link expires in 15 minutes</p>
//         `,
//     });

//     res.status(200).json(
//         new apiResponse(200, "Password reset link sent to email")
//     );
// });

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();

    // Save ONLY token and expiry
    await user.save({ validateBeforeSave: false }); // DO NOT touch password

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
            <p>You requested a password reset</p>
            <p>Click below to reset:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link expires in 15 minutes</p>
        `,
    });

    res.status(200).json(
        new apiResponse(200, "Password reset link sent to email")
    );
});




// const resetPassword = asyncHandler(async (req, res) => {
//   console.log("Inside reset password")
//     const { token } = req.params;
//     const { password } = req.body;

//     console.log("token:", token)
//     console.log("password",password)

//     console.log("creating hashed token")

//     const hashedToken = crypto
//         .createHash("sha256")
//         .update(token)
//         .digest("hex");

//     const user = await User.findOne({
//         resetPasswordToken: hashedToken,
//         resetPasswordExpiry: { $gt: Date.now() },
//     });

//     if (!user) throw new ApiError(400, "Token invalid or expired");

//     user.password = password; // bcrypt hook will hash
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpiry = undefined;

//     await user.save();

//     res.status(200).json(
//         new apiResponse(200, "Password reset successful")
//     );
// });


const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, "Token invalid or expired");

    // Set new password — pre('save') hook will hash it automatically
    user.password = password;

    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save(); // triggers password hash

    res.status(200).json(
        new apiResponse(200, "Password reset successful")
    );
});




export  {registerUser,login,logOut,forgotPassword,resetPassword}