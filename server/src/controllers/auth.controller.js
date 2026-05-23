import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import config from "../config/config.js";
import { generateToken } from "../utils/generateJwtToken.js";
import ApiError from "../utils/ApiError.js";

export async function registerUser(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(
                400,
                "All fields are required"
            );
        }

        if (!validator.isEmail(email)) {
            throw new ApiError(
                400,
                "Invalid email"
            );
        }

        const isUserAlreadyExist = await userModel.findOne({ email });

        if (isUserAlreadyExist) {
            throw new ApiError(
                409,
                "User Already Exists!!"
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const token = generateToken(user._id);

        res.status(201).json({
            message: "User Created Successfully!",
            token,
            user: {
                name: user.name,
                email: user.email,
            }
        })

    } catch (error) {
        next(error);
    }

}

export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            throw new ApiError(
                401,
                "Invalid credentials"
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError(
                401,
                "Invalid credentials"
            );
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }

}

export async function logoutUser(req, res, next) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged out successfully" })
}

export function getCurrentUser(req, res) {
    res.status(200).json({
        success: true,
        user: req.user,
    });
}