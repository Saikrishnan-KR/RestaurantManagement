import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    username: username,
                    password: password
                }
            );

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                setError(
                    "Invalid username or password."
                );

            } else {

                setError(
                    "Unable to connect to server."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <div className="restaurant-icon">
                        🍽️
                    </div>

                    <h1>
                        Restaurant Management
                    </h1>

                    <p>
                        Admin Login
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    {error && (

                        <p className="error-message">
                            {error}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;