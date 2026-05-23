import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import config from "./config/config.js";
import connectToDb from "./config/database.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

connectToDb()

const PORT = config.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});