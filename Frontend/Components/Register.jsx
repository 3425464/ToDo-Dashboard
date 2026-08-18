import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL =
    "https://todo-backend-ezav.onrender.com/api";

function Register() {
    const navigate = useNavigate();

    const submitData = async (e) => {
        e.preventDefault();

        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        try {
            await axios.post(
                `${API_URL}/auth/register`,
                {
                    name,
                    email,
                    password
                }
            );

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <h1>ToDo Dashboard</h1>

                    <p>
                        Organize your tasks and stay productive.
                    </p>
                </div>

                <div className="auth-tabs">

                    <button
                        type="button"
                        className="auth-tab"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="auth-tab active"
                    >
                        Register
                    </button>

                </div>

                <div className="auth-form">

                    <h2>Create Account</h2>

                    <p className="form-subtitle">
                        Register to start managing your tasks
                    </p>

                    <form onSubmit={submitData}>

                        <div className="form-group">

                            <label htmlFor="name">
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                minLength="6"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Create Account
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Register;