require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/user.routes");
const todoRouter = require("./routes/todo.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/todos", todoRouter);

// MongoDB connection
mongoose
    .connect(process.env.URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });

// Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});