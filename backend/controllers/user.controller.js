
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt"
import logger from "../logger.js";
import { log } from "console";



const generateAccessRefreshTokens = async (userId) => {
    try {

        const user = await User.findById(userId)

        if (!user) {
            logger.warn({ userId }, "User not found while generating tokens");
            throw new ApiError(404, "User not found");
        }

        logger.info({ userId }, "Generating Access and Refresh tokens")

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        logger.info({ userId }, "Tokens generated successfully");

        return { accessToken, refreshToken }


    } catch (error) {
        logger.error({ err: error, userId }, "Error generating access/refresh tokens");
        throw new ApiError(500, error.message)

    }


}



const registerUser = asyncHandler(async (req, res) => {

    const { userName, email, password } = req.body

    logger.info({ userName, email }, "User registration request")

    //validation checks if any field is empty
    if (
        [userName, email, password].some((field) =>
            field?.trim() === "")) {
        logger.warn({ email }, "Required fields missing")
        throw new ApiError(400, "Required field is missing")
    }


    //if user already exists
    const existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    }
    )


    if (existingUser) {
        logger.warn({ email, userName }, "User already exists, Registration failed!")
        throw new ApiError(402, "User already exists")
    }



    //creating user entry in database
    const user = await User.create({
        userName: userName.toLowerCase(),
        email: email,
        password: password
    })


    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    logger.info({ userId: user._id }, "User created")

    if (!createdUser) {
        logger.warn({ userId: user._id }, "Registration failed")
        throw new ApiError(500, " User Registration failed")
    }

    logger.info({ userId: user._id }, "User registered successfully");
    res.status(200).json(
        new apiResponse(200, "User registered successfully", { createdUser })
    )


})


const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    logger.info({ email }, "Login request received");

    if (!email) {
        logger.warn("Login failed: email missing");
        throw new ApiError(400, "Email is required")
    }

    if (!password) {
        logger.warn({ email }, "Login failed: password missing");
        throw new ApiError(400, "Password is required")
    }

    const existedUser = await User.findOne({ email })

    if (!existedUser) {
        logger.warn({ email }, "Login failed: user does not exist");
        throw new ApiError(402, "User doesnot exist")
    }


    const passwordValid = await existedUser.isPasswordCorrect(password)

    if (!passwordValid) {
        logger.warn({ email, userId: existedUser._id }, "Login failed: incorrect password");
        throw new ApiError(402, "Incorrect password")
    }

    logger.info({ userId: existedUser._id }, "Password verified");

    const { accessToken, refreshToken } = await generateAccessRefreshTokens(existedUser._id)
    const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
        // secure:false
    }

    logger.info({ userId: existedUser._id }, "User logged in successfully");

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

    logger.info("Tokens cleared, user logged out");

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});



const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    logger.info({ email }, "Forgot password request received");

    if (!email) {
        logger.warn("Forgot password failed: email missing");
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        logger.warn({ email }, "Forgot password failed: user not found");
        throw new ApiError(404, "User not found");
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();

    // Save ONLY token and expiry
    await user.save({ validateBeforeSave: false }); // DO NOT touch password

    logger.info({ userId: user._id }, "Password reset token generated and saved");

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

    logger.info({ userId: user._id }, "Password reset email sent");

    res.status(200).json(
        new apiResponse(200, "Password reset link sent to email")
    );
});






const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    logger.info("Password reset request received");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        logger.warn("Password reset failed: invalid or expired token");
        throw new ApiError(400, "Token invalid or expired");
    }

    logger.info({ userId: user._id }, "Valid reset token found, resetting password");

    // Set new password — pre('save') hook will hash it automatically
    user.password = password;

    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save(); // triggers password hash

    logger.info({ userId: user._id }, "Password reset successfully");
    res.status(200).json(
        new apiResponse(200, "Password reset successful")
    );
});




export { registerUser, login, logOut, forgotPassword, resetPassword }