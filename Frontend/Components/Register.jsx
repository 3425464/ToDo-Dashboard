Register.jsx


import axios from "axios";

function Register({ onRegister }) {

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        };

        try {

            const response = await axios.post(
                "http://localhost:3000/api/auth/register",
                data
            );

            console.log(response.data);

            alert("Registration successful!");

            if (onRegister) {
                onRegister();
            }

        } catch (error) {

            console.log(error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Registration failed"
                );
            } else {
                alert("Unable to connect to the server.");
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