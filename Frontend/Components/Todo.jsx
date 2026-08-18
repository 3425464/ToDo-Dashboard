import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

const API_URL =
    "https://todo-backend-ezav.onrender.com/api/todos";


function Todo() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");


    const getConfig = () => {

        const token =
            localStorage.getItem("token");

        return {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        };
    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    const handleAuthError = (error) => {

        if (
            error.response?.status === 401
        ) {
            logout();
            return true;
        }

        return false;
    };


    const getTodos = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    API_URL,
                    getConfig()
                );

            setTodos(response.data);

        } catch (error) {

            console.error(
                "Get todos error:",
                error
            );

            if (handleAuthError(error)) {
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

        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        getTodos();

    }, []);


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

            await getTodos();

        } catch (error) {

            console.error(
                "Add todo error:",
                error
            );

            if (handleAuthError(error)) {
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to add task"
            );
        }
    };


    const startEdit = (todo) => {

        setEditId(todo._id);
        setEditTitle(todo.title);
    };


    const cancelEdit = () => {

        setEditId(null);
        setEditTitle("");
    };


    const updateTask = async (todo) => {

        if (!editTitle.trim()) {
            alert("Task title cannot be empty");
            return;
        }

        try {

            await axios.put(
                `${API_URL}/${todo._id}`,
                {
                    title: editTitle.trim()
                },
                getConfig()
            );

            cancelEdit();

            await getTodos();

        } catch (error) {

            console.error(
                "Update todo error:",
                error
            );

            if (handleAuthError(error)) {
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };


    const toggleTodo = async (todo) => {

        try {

            await axios.put(
                `${API_URL}/${todo._id}`,
                {
                    completed:
                        !todo.completed
                },
                getConfig()
            );

            await getTodos();

        } catch (error) {

            console.error(
                "Toggle todo error:",
                error
            );

            if (handleAuthError(error)) {
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to update task"
            );
        }
    };


    const deleteTodo = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await axios.delete(
                `${API_URL}/${id}`,
                getConfig()
            );

            await getTodos();

        } catch (error) {

            console.error(
                "Delete todo error:",
                error
            );

            if (handleAuthError(error)) {
                return;
            }

            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };


    const totalTodos =
        todos.length;

    const completedTodos =
        todos.filter(
            todo => todo.completed
        ).length;

    const pendingTodos =
        totalTodos - completedTodos;


    return (

        <div className="dashboard">

            <nav className="navbar">

                <div className="brand">
                    <h2>Todo Dashboard</h2>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </nav>


            <main className="dashboard-container">

                <div className="dashboard-heading">

                    <div>
                        <h1>Todo List</h1>

                        <p>
                            Manage your tasks and stay productive.
                        </p>
                    </div>

                </div>


                <div className="stats">

                    <div className="stat-card">
                        <h3>Total Tasks</h3>
                        <strong>
                            {totalTodos}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <h3>Completed</h3>
                        <strong>
                            {completedTodos}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <h3>Pending</h3>
                        <strong>
                            {pendingTodos}
                        </strong>
                    </div>

                </div>


                <div className="todo-section">

                    <div className="add-todo-card">

                        <h2>Add New Task</h2>

                        <form onSubmit={addTodo}>

                            <input
                                type="text"
                                value={title}
                                placeholder="Enter a new task"
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
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


                    <div className="todo-list-card">

                        <h2>Your Tasks</h2>

                        {loading && (
                            <div className="empty-state">
                                Loading tasks...
                            </div>
                        )}


                        {!loading && error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}


                        {!loading &&
                            !error &&
                            todos.length === 0 && (
                                <div className="empty-state">
                                    No tasks yet.
                                    Add your first task!
                                </div>
                            )}


                        {!loading &&
                            !error &&
                            todos.map(todo => (

                                <div
                                    key={todo._id}
                                    className={
                                        todo.completed
                                            ? "todo-item completed"
                                            : "todo-item"
                                    }
                                >

                                    {editId === todo._id ? (

                                        <div className="todo-content">

                                            <input
                                                className="edit-input"
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
                                                        updateTask(todo)
                                                    }
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={
                                                        cancelEdit
                                                    }
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

                </div>

            </main>

        </div>
    );
}

export default Todo;