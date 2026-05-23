import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: "7d",
    });
};