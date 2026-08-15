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

            console.log("Todos response:", response.data);

            if (Array.isArray(response.data)) {

                setTodos(response.data);

            } else if (Array.isArray(response.data.todos)) {

                setTodos(response.data.todos);

            } else if (Array.isArray(response.data.data)) {

                setTodos(response.data.data);

            } else {

                setTodos([]);
            }

        } catch (error) {

            console.error("Get Todo Error:", error);

            if (
                error.response?.status === 400 ||
                error.response?.status === 401
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
                error.response?.status === 400 ||
                error.response?.status === 401
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

            await axios.put(
                `${API_URL}/${id}`,
                {
                    title: editTitle.trim()
                },
                getConfig()
            );

            setEditId(null);
            setEditTitle("");

            await getTodo();

        } catch (error) {

            console.error("Update Todo Error:", error);

            if (
                error.response?.status === 400 ||
                error.response?.status === 401
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
                error.response?.status === 400 ||
                error.response?.status === 401
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
                error.response?.status === 400 ||
                error.response?.status === 401
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

            {/* Add Todo */}

            <form onSubmit={addTodo}>

                <input
                    type="text"
                    placeholder="Enter a new task"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                />

                <button type="submit">
                    Add
                </button>

            </form>

            {/* Loading */}

            {loading && (

                <p className="loading">
                    Loading todos...
                </p>

            )}

            {/* Error */}

            {!loading && error && (

                <p className="error">
                    {error}
                </p>

            )}

            {/* Empty */}

            {!loading &&
                !error &&
                todos.length === 0 && (

                    <p>
                        No Todo yet. Add your first task.
                    </p>

                )}

            {/* Todo List */}

            {!loading && (

                <div className="todo-list">

                    {todos.map((todo) => (

                        <div
                            className="todo-item"
                            key={todo._id}
                        >

                            {editId === todo._id ? (

                                <>

                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(
                                                e.target.value
                                            )
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
                                        checked={
                                            todo.completed || false
                                        }
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

            )}

        </div>
    );
}

export default Todo;