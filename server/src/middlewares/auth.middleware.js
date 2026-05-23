import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";

export async function protect(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            throw new ApiError(401, "Not authorized");
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(401, "Not authorized");
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}