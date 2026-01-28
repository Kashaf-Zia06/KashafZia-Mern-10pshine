import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {

    console.log("Inside sendEmail of utils helper")
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // App password
        },
    });

    await transporter.sendMail({
        from: `"Notes App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};
