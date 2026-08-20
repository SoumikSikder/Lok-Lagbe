import { Navigate } from "react-router";

import { getToken } from "../utils/auth.js";

/**
 * Gate a route behind a stored access token.
 *
 * @param {object} props Component properties.
 * @param {React.ReactNode} props.children The protected page.
 * @returns {JSX.Element} The page, or a redirect to the login route.
 */
function ProtectedRoute({ children }) {
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
