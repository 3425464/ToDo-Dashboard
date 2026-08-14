const Todo = require("../models/todo.model");

// Create Todo
const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const todo = new Todo({
            title,
            user: req.user.id
        });

        await todo.save();

        res.status(201).json({
            message: "Todo Created Successfully",
            todo
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get all Todos of logged-in user
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id
        });

        res.status(200).json(todos);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update Todo
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const todo = await Todo.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            {
                title,
                completed
            },
            {
                new: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo Updated Successfully",
            todo
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Todo
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

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
            message: "Todo Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
};