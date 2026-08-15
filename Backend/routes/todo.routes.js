const express = require("express");

const router = express.Router();

const {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
} = require("../controller/todo.controller");

const { auth } = require("../middleware/auth.middleware");

router.post("/", auth, createTodo);
router.get("/", auth, getTodos);
router.put("/:id", auth, updateTodo);
router.delete("/:id", auth, deleteTodo);

module.exports = router;