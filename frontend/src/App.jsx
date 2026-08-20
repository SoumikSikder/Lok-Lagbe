import { Navigate, Route, Routes } from "react-router";

import AppShell from "./components/AppShell.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminUI from "./Admin UI/AdminUI.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ManageProfilePage from "./pages/ManageProfilePage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import HireHistoryPage from "./pages/HireHistoryPage.jsx";
import HireLaborPage from "./pages/HireLaborPage.jsx";
import LaborDetailsPage from "./pages/LaborDetailsPage.jsx";
import LaborListPage from "./pages/LaborListPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";

/**
 * Root application component that sets up client side routing.
 * Defines all available routes for the application.
 * @component
 * @returns {JSX.Element} The root application with routing.
 */
function App() {
    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminUI />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ManageProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/labors" element={<LaborListPage />} />
                <Route
                    path="/labors/:laborId"
                    element={<LaborDetailsPage />}
                />
                <Route
                    path="/labors/:laborId/hire"
                    element={<HireLaborPage />}
                />
                <Route
                    path="/bookings/history"
                    element={<HireHistoryPage />}
                />
                <Route
                    path="/hire-history"
                    element={<Navigate to="/bookings/history" replace />}
                />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route
                    path="/bookings/:bookingId/success"
                    element={<BookingSuccessPage />}
                />
                <Route
                    path="/bookings/:bookingId/payment"
                    element={<PaymentPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AppShell>
    );
}

export default App;