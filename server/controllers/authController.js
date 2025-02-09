import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {response} from "express";
import userAuth from "../middleware/userAuth.js";
import authRouter from "../routers/authRoutes.js";
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from "../config/emailTemplate.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing details." });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome',
            text: `Your has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Registration successful! Welcome aboard." });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required." });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email address." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: "You're in! Successfully logged in." });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.json({ success: true, message: "Logout successful! See you soon." });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Your account is already verified." });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Check your email for the verification OTP." });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success: false, message: "Missing details."});
    }

    try{
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: "User is not found."});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP, Please enter a valid OTP."});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: "Email verified! You're all set."});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const isAuthenticated = async (req, res) => {
    try{
        return res.json({success: true});
    }catch (error){
        return res.json({success: false, message: error.message});
    }
}


export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required." });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: `Check your email for the password reset OTP.` });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.json({ success: false, message: "Email, OTP, and new password are required." });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        if (!user.resetOtp || user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired. Request a new one." });
        }

        if (user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP, Please enter a valid OTP." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Your password has been reset successfully!" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

