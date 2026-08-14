const express = require("express");

const router = express.Router();

const {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
} = require("../controller/todo.controller");

const { auth } = require("../middleware/auth.middleware");

// Create Todo
router.post("/", auth, createTodo);

// Get Todos
router.get("/", auth, getTodos);

// Update Todo
router.put("/:id", auth, updateTodo);

// Delete Todo
router.delete("/:id", auth, deleteTodo);

module.exports = router;