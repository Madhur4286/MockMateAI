import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import config from "../config/config.js";

export async function protect(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized",
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}