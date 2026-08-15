import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Todo() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [todos, setTodos] = useState([]);

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const token = localStorage.getItem("token");

    const API_URL = "http://localhost:3000/api/todos";

    // Get Todos
    const getTodo = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTodos(response.data);

        } catch (error) {
            console.log(error);

            if (error.response?.status === 400 ||
                error.response?.status === 401) {

                localStorage.removeItem("token");
                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load tasks"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        getTodo();
    }, []);

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // Add Todo
    const addTodo = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a task");
            return;
        }

        try {
            await axios.post(
                API_URL,
                {
                    title: title
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTitle("");

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add a task"
            );
        }
    };

    // Start Edit
    const startEdit = (todo) => {
        setEditId(todo._id);
        setEditTitle(todo.title);
    };

    // Update Todo
    const updateTask = async (id) => {
        if (!editTitle.trim()) {
            alert("Task title cannot be empty");
            return;
        }

        try {
            await axios.put(
                `${API_URL}/${id}`,
                {
                    title: editTitle
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEditId(null);
            setEditTitle("");

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    // Toggle Todo
    const toggleTodo = async (todo) => {
        try {
            await axios.put(
                `${API_URL}/${todo._id}`,
                {
                    title: todo.title,
                    completed: !todo.completed
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    // Delete Todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(
                `${API_URL}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            getTodo();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    return (
        <div className="todo-container">

            <div className="todo-header">
                <h1>Todo List</h1>

                <button
                    onClick={logout}
                    className="logout-btn"
                >
                    Logout
                </button>
            </div>

            <form onSubmit={addTodo}>

                <input
                    type="text"
                    placeholder="Enter a new task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <button type="submit">
                    Add
                </button>

            </form>

            {loading && (
                <p className="loading">
                    Loading todos....
                </p>
            )}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {!loading && todos.length === 0 && (
                <p>
                    No Todo yet. Add your First Task in it
                </p>
            )}

            <div>

                {todos.map((todo) => (
                    <div
                        className="todo-item"
                        key={todo._id}
                    >

                        {editId === todo._id ? (

                            <>
                                <input
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                />

                                <button
                                    onClick={() =>
                                        updateTask(todo._id)
                                    }
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() => {
                                        setEditId(null);
                                        setEditTitle("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </>

                        ) : (

                            <>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() =>
                                        toggleTodo(todo)
                                    }
                                />

                                <span
                                    className={
                                        todo.completed
                                            ? "completed"
                                            : ""
                                    }
                                >
                                    {todo.title}
                                </span>

                                <button
                                    onClick={() =>
                                        startEdit(todo)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteTodo(todo._id)
                                    }
                                >
                                    Delete
                                </button>
                            </>

                        )}

                    </div>
                ))}

            </div>

        </div>
    );
}

export default Todo;