const mongoose = require("mongoose");
const Todo = require("../models/todo.model");


const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const todo = await Todo.create({
            title: title.trim(),
            user: req.user.id
        });

        res.status(201).json({
            message: "Todo created successfully",
            todo
        });

    } catch (error) {
        console.error("Create Todo error:", error);

        res.status(500).json({
            message: "Failed to create todo"
        });
    }
};


const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json(todos);

    } catch (error) {
        console.error("Get Todos error:", error);

        res.status(500).json({
            message: "Failed to get todos"
        });
    }
};


const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid todo ID"
            });
        }

        const updateData = {};

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    message: "Title cannot be empty"
                });
            }

            updateData.title = title.trim();
        }

        if (completed !== undefined) {
            updateData.completed = Boolean(completed);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Nothing to update"
            });
        }

        const todo = await Todo.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo
        });

    } catch (error) {
        console.error("Update Todo error:", error);

        res.status(500).json({
            message: "Failed to update todo"
        });
    }
};


const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid todo ID"
            });
        }

        const todo = await Todo.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully"
        });

    } catch (error) {
        console.error("Delete Todo error:", error);

        res.status(500).json({
            message: "Failed to delete todo"
        });
    }
};


module.exports = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
};