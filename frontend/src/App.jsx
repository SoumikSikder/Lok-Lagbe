import { Navigate, Route, Routes } from "react-router";

import AppShell from "./components/AppShell.jsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import HireHistoryPage from "./pages/HireHistoryPage.jsx";
import HireLaborPage from "./pages/HireLaborPage.jsx";
import LaborDetailsPage from "./pages/LaborDetailsPage.jsx";
import LaborListPage from "./pages/LaborListPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";

/**
 * Render the root application component.
 *
 * @returns {JSX.Element} The initial Lok Lagbe interface.
 */
function App() {
    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<Navigate to="/labors" replace />} />
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
                <Route
                    path="/favorites"
                    element={<FavoritesPage />}
                />
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
