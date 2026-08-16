import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

/**
 * Root application component that sets up client side routing.
 * Defines all available routes for the application.
 * @component
 * @returns {JSX.Element} The root application with routing.
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
