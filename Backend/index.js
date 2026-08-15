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

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Todo backend is running",
        status: "ok"
    });
});

// API routes
app.use("/api/auth", userRouter);
app.use("/api/todos", todoRouter);

// MongoDB connection
mongoose
    .connect(process.env.URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});