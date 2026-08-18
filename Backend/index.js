require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/user.routes");
const todoRouter = require("./routes/todo.routes");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Todo backend is running",
        status: "ok"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "API is healthy"
    });
});

app.use("/api/auth", userRouter);
app.use("/api/todos", todoRouter);

const PORT = process.env.PORT || 3000;

if (!process.env.URL) {
    console.error("MongoDB URL is missing from .env");
    process.exit(1);
}

if (!process.env.JWT_KEY) {
    console.error("JWT_KEY is missing from .env");
    process.exit(1);
}

mongoose
    .connect(process.env.URL)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error.message
        );
        process.exit(1);
    });