import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        };

        try {

            const response = await axios.post(
                "https://todo-backend-ezav.onrender.com/api/auth/register",
                data
            );

            console.log("Register response:", response.data);

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {

            console.error("Registration error:", error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Registration failed"
                );

            } else {

                alert(
                    "Unable to connect to the server."
                );
            }
        }
    };

    return (
        <div className="auth-form">

            <h2>Create Account</h2>

            <p className="form-subtitle">
                Register to start managing your tasks
            </p>

            <form onSubmit={submitData}>

                <div className="input-group">

                    <label>Name</label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        required
                    />

                </div>

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
                        placeholder="Create a password"
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
    );
}

export default Register;