import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import config from "../config/config.js";

const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email",
            });
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                { name },
                { email }
            ]
        })

        if (isUserAlreadyExist) {
            return res.status(409).json({ message: "User Already Exists!!" })
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
            user: {
                name: user.name,
                email: user.email,
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }

}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token)

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }



}

export async function logoutUser(req, res) {
    res.clearCookie("token")

    res.status(200).json({ message: "Logged out successfully" })
}