
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, "Name is required"]

        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, "Email is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiry: {
            type: Date,
        },




    }, { timestamps: true })


userSchema.pre("save", async function () {
  
    // `this` refers to the document being saved
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)

});


//using bcrypt to compare password as well , the plain text password given by user and hashed password in db
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)

}

//generate Access Token
userSchema.methods.generateAccessToken = function () {
   
    return jwt.sign({
        //payload
        _id: this._id,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//generate RefreshToken
userSchema.methods.generateRefreshToken = function () {
   
    return jwt.sign({
        //payload
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Only set token and expiry on the document, do NOT save yet
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

    return resetToken;
};
export const User = mongoose.model("User", userSchema)