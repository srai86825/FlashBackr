import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

//middlewares
app.use(bodyParser.json({ limit: "30mb", extended: "true" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () =>
      console.log(`Server started at ${PORT} with mongodb`)
    );
  } catch (err) {
    console.log(err);
  }
};
startServer();
