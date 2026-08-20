import LoginForm from "../components/LoginForm.jsx";

/**
 * Route wrapper that centres the sign-in form.
 *
 * @component
 * @returns {JSX.Element} The login page.
 */
function LoginPage() {
    return (
        <div className="page flex items-center justify-center">
            <LoginForm />
        </div>
    );
}

export default LoginPage;
