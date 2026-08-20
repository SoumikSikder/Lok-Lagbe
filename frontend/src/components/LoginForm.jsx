import { useState } from "react";
import { useNavigate } from "react-router";

import { _loginUser } from "../services/authService.js";
import { saveToken } from "../utils/auth.js";

/**
 * Sign-in form that exchanges credentials for a JWT and stores it.
 *
 * @component
 * @returns {JSX.Element} The login form.
 */
function LoginForm() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Submit the credentials and redirect to the profile page on success.
     *
     * @param {Event} event Form submit event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await _loginUser({ username, password });

            if (response.access) {
                saveToken(response.access);
                navigate("/profile");
            } else {
                setError("Invalid username or password");
            }
        } catch (submitError) {
            setError(submitError.message || "Unable to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md card border border-border">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-accent">LokLagbe</h1>
                <p className="text-text-secondary mt-2">
                    Find trusted workers easily
                </p>
            </div>

            <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Welcome Back
            </h2>

            <form onSubmit={handleSubmit}>
                <label className="field-label" htmlFor="login-username">
                    Username
                </label>
                <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter username"
                    className="field-input mb-5"
                />

                <label className="field-label" htmlFor="login-password">
                    Password
                </label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    className="field-input mb-6"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {error && (
                <p className="text-danger text-center mt-5 text-sm">{error}</p>
            )}
        </div>
    );
}

export default LoginForm;
