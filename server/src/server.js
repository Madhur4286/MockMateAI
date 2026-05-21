import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import config from "./config/config.js";
import connectToDb from "./config/database.js";

connectToDb()

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = config.PORT || 5000 ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});