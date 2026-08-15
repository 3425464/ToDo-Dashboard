import axios from "axios";

function Login({ onLogin }) {

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        try {

            const response = await axios.post(
                "https://todo-backend-ezav.onrender.com/api/auth/login",
                data
            );

            console.log(response.data);

            if (response.data.token) {

                localStorage.setItem(
                    "token",
                    response.data.token
                );

                alert("Login successful!");

                onLogin();
            } else {
                alert("Login successful, but token was not received.");
            }

        } catch (error) {

            console.log(error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Invalid email or password"
                );
            } else {
                alert("Unable to connect to the server.");
            }
        }
    };

    return (
        <div className="auth-form">

            <h2>Welcome Back</h2>

            <p className="form-subtitle">
                Login to manage your tasks
            </p>

            <form onSubmit={submitData}>

                <div className="input-group">
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
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
    );
}

export default Login;