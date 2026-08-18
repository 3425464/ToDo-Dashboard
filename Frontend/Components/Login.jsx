import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const submitData = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post(
                "https://todo-backend-ezav.onrender.com/api/auth/login",
                {
                    email,
                    password
                }
            );

            console.log("Login response:", response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);

                if (response.data.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.user)
                    );
                }

                navigate("/dashboard");
            } else {
                alert("Login successful, but token was not received.");
            }

        } catch (error) {
            console.error("Login error:", error);

            alert(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">
                    <h1>ToDo Dashboard</h1>
                    <p>
                        Organize your tasks and stay productive.
                    </p>
                </div>

                {/* Login / Register Tabs */}
                <div className="auth-tabs">

                    <button
                        type="button"
                        className="auth-tab active"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="auth-tab"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>

                </div>

                {/* Login Form */}
                <div className="auth-form">

                    <h2>Welcome Back</h2>

                    <p className="form-subtitle">
                        Login to manage your tasks
                    </p>

                    <form onSubmit={submitData}>

                        <div className="input-group">
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

                        <div className="input-group">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;