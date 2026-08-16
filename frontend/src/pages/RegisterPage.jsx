import { useState } from "react";
import { _registerUser } from "../services/authService";

/**
 * Array of avatar options available for the user to select.
 * @constant {number[]}
 */
const AVATAR_OPTIONS = [1, 2, 3, 4, 5];

/**
 * Avatar color styles for each avatar option.
 * @constant {object}
 */
const AVATAR_COLORS = {
    1: "bg-blue-500",
    2: "bg-green-500",
    3: "bg-yellow-500",
    4: "bg-pink-500",
    5: "bg-teal-500",
};

/**
 * Registration page component that allows a new user to create an account.
 * Collects username, email, password, phone number, address and avatar.
 * Submits the data to the Django backend via the authService.
 * @component
 * @returns {JSX.Element} The registration form page.
 */
function RegisterPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Handles the form submission.
     * Validates required fields then calls the register API.
     * Shows success or error message based on the result.
     * @param {React.FormEvent} e - The form submission event.
     * @returns {void}
     */
    const _handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!username || !email || !password) {
            setError("Username, email and password are required.");
            setLoading(false);
            return;
        }

        try {
            await _registerUser(
                username,
                email,
                password,
                phone_number,
                address,
                avatar
            );
            setSuccess("Account created successfully! You can now log in.");
        } catch (err) {
            const message =
                err.response?.data?.username?.[0] ||
                err.response?.data?.email?.[0] ||
                err.response?.data?.password?.[0] ||
                "Registration failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles avatar selection when user clicks an avatar option.
     * @param {number} avatarNumber - The avatar number selected by the user.
     * @returns {void}
     */
    const _handleAvatarSelect = (avatarNumber) => {
        setAvatar(avatarNumber);
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-medium text-text-primary">
                        Lok <span className="text-accent">Lagbe</span>
                    </h1>
                    <p className="text-text-secondary text-sm mt-2">
                        Create your account to get started.
                    </p>
                </div>

                {/* Card */}
                <div className="card border border-border">

                    {/* Avatar picker */}
                    <div className="mb-6">
                        <label className="field-label">
                            Choose a profile avatar
                        </label>
                        <div className="flex gap-3 mt-2">
                            {AVATAR_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => _handleAvatarSelect(option)}
                                    className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-medium text-sm transition-all duration-150 ${AVATAR_COLORS[option]} ${
                                        avatar === option
                                            ? "ring-2 ring-accent ring-offset-2 ring-offset-surface scale-110"
                                            : "opacity-50 hover:opacity-100"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={_handleSubmit}>

                        {/* Username */}
                        <div className="mb-4">
                            <label className="field-label">Username</label>
                            <input
                                className="field-input"
                                type="text"
                                placeholder="yourname123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="field-label">Email address</label>
                            <input
                                className="field-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="field-label">Password</label>
                            <input
                                className="field-input"
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Phone number */}
                        <div className="mb-4">
                            <label className="field-label">
                                Phone number{" "}
                                <span className="text-text-muted">(optional)</span>
                            </label>
                            <input
                                className="field-input"
                                type="tel"
                                placeholder="+880 1XXX XXXXXX"
                                value={phone_number}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-6">
                            <label className="field-label">
                                Address{" "}
                                <span className="text-text-muted">(optional)</span>
                            </label>
                            <input
                                className="field-input"
                                type="text"
                                placeholder="Dhaka, Bangladesh"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success message */}
                        {success && (
                            <div className="mb-4 text-accent text-sm">
                                {success}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                    </form>

                    {/* Login link */}
                    <p className="text-center text-text-secondary text-sm mt-6">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-accent hover:underline"
                        >
                            Log in
                        </a>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default RegisterPage;