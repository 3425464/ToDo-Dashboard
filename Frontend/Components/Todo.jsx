import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://todo-backend-ezav.onrender.com/api/todos";

function Todo() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [todos, setTodos] = useState([]);

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const getConfig = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    // =========================
    // GET TODOS
    // =========================

    const getTodo = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                API_URL,
                getConfig()
            );

            setTodos(response.data);

        } catch (error) {
            console.error("Get Todo Error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load todos"
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // CHECK LOGIN
    // =========================

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        getTodo();
    }, []);

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // =========================
    // ADD TODO
    // =========================

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
                    title: title.trim()
                },
                getConfig()
            );

            setTitle("");

            await getTodo();

        } catch (error) {
            console.error("Add Todo Error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                alert("Session expired. Please login again.");
                logout();
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to add task"
            );
        }
    };

    // =========================
    // START EDIT
    // =========================

    const startEdit = (todo) => {
        setEditId(todo._id);
        setEditTitle(todo.title);
    };

    // =========================
    // UPDATE TODO
    // =========================

    const updateTask = async (id) => {
        if (!editTitle.trim()) {
            alert("Please enter a task");
            return;
        }

        try {
            const todo = todos.find(
                (item) => item._id === id
            );

            await axios.put(
                `${API_URL}/${id}`,
                {
                    title: editTitle.trim(),
                    completed: todo?.completed || false
                },
                getConfig()
            );

            setEditId(null);
            setEditTitle("");

            await getTodo();

        } catch (error) {
            console.error("Update Todo Error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                alert("Session expired. Please login again.");
                logout();
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    // =========================
    // COMPLETE / UNCOMPLETE
    // =========================

    const toggleTodo = async (todo) => {
        try {
            await axios.put(
                `${API_URL}/${todo._id}`,
                {
                    title: todo.title,
                    completed: !todo.completed
                },
                getConfig()
            );

            await getTodo();

        } catch (error) {
            console.error("Toggle Todo Error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                alert("Session expired. Please login again.");
                logout();
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };

    // =========================
    // DELETE TODO
    // =========================

    const deleteTodo = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `${API_URL}/${id}`,
                getConfig()
            );

            await getTodo();

        } catch (error) {
            console.error("Delete Todo Error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                alert("Session expired. Please login again.");
                logout();
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    // =========================
    // COUNTS
    // =========================

    const totalTodos = todos.length;

    const completedTodos = todos.filter(
        (todo) => todo.completed
    ).length;

    const pendingTodos = totalTodos - completedTodos;

    // =========================
    // UI
    // =========================

    return (
        <div className="dashboard">

            {/* NAVBAR */}

            <nav className="navbar">

                <div className="brand">
                    <h2>Todo Dashboard</h2>
                </div>

                <button
                    onClick={logout}
                    className="logout-button"
                >
                    Logout
                </button>

            </nav>

            {/* MAIN */}

            <main className="dashboard-container">

                <div className="dashboard-heading">

                    <div>
                        <h1>Todo List</h1>

                        <p>
                            Manage your tasks and stay productive.
                        </p>
                    </div>

                </div>

                {/* STATS */}

                <div className="stats">

                    <div className="stat-card">
                        <h3>Total Tasks</h3>
                        <strong>{totalTodos}</strong>
                    </div>

                    <div className="stat-card">
                        <h3>Completed</h3>
                        <strong>{completedTodos}</strong>
                    </div>

                    <div className="stat-card">
                        <h3>Pending</h3>
                        <strong>{pendingTodos}</strong>
                    </div>

                </div>

                {/* TODO SECTION */}

                <div className="todo-section">

                    {/* ADD TODO */}

                    <div className="add-todo-card">

                        <h2>Add New Task</h2>

                        <form onSubmit={addTodo}>

                            <input
                                type="text"
                                placeholder="Enter a new task"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                            />

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Add Task
                            </button>

                        </form>

                    </div>

                    {/* TODO LIST */}

                    <div className="todo-list-card">

                        <h2>Your Tasks</h2>

                        {loading && (
                            <p className="empty-state">
                                Loading todos...
                            </p>
                        )}

                        {!loading && error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        {!loading &&
                            !error &&
                            todos.length === 0 && (
                                <p className="empty-state">
                                    No tasks yet. Add your first task!
                                </p>
                            )}

                        {!loading &&
                            !error &&
                            todos.length > 0 && (

                                <div>

                                    {todos.map((todo) => (

                                        <div
                                            className={
                                                todo.completed
                                                    ? "todo-item completed"
                                                    : "todo-item"
                                            }
                                            key={todo._id}
                                        >

                                            {editId === todo._id ? (

                                                <div className="todo-content">

                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) =>
                                                            setEditTitle(
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </div>

                                            ) : (

                                                <div className="todo-content">

                                                    <h3>
                                                        {todo.title}
                                                    </h3>

                                                    <p>
                                                        {todo.completed
                                                            ? "Completed"
                                                            : "Pending"}
                                                    </p>

                                                </div>

                                            )}

                                            <div className="todo-actions">

                                                {editId === todo._id ? (

                                                    <>
                                                        <button
                                                            className="complete-button"
                                                            onClick={() =>
                                                                updateTask(
                                                                    todo._id
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            className="delete-button"
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

                                                        <button
                                                            className="complete-button"
                                                            onClick={() =>
                                                                toggleTodo(todo)
                                                            }
                                                        >
                                                            {todo.completed
                                                                ? "Undo"
                                                                : "Complete"}
                                                        </button>

                                                        <button
                                                            className="complete-button"
                                                            onClick={() =>
                                                                startEdit(todo)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                deleteTodo(
                                                                    todo._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </>

                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Todo;