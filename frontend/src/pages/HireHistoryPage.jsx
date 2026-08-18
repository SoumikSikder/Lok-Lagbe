import { useEffect, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import LaborPhoto from "../components/LaborPhoto.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import RatingDisplay from "../components/RatingDisplay.jsx";
import { getBookingHistory } from "../services/bookingService.js";

/**
 * Get CSS badge styling classes based on booking status.
 *
 * @param {string} status Booking status e.g. "pending", "accepted", "completed", "rejected".
 * @returns {string} Tailwind CSS badge styling classes.
 */
function _getStatusBadge(status) {
    const s = (status || "").toLowerCase();
    switch (s) {
        case "accepted":
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800";
        case "completed":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800";
        case "rejected":
        case "cancelled":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800";
        case "pending":
        default:
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
    }
}

/**
 * Render the Hire History page displaying user's past and active service hires.
 *
 * @returns {JSX.Element} Interactive hire history list with status filtering.
 */
function HireHistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [activeTab, setActiveTab] = useState("all");

    const fetchHistory = async (statusFilter = "") => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const params = statusFilter && statusFilter !== "all" ? { status: statusFilter } : {};
            const data = await getBookingHistory(params);
            const list = Array.isArray(data) ? data : (data.results || []);
            setBookings(list);
        } catch (err) {
            console.error("Failed to load hire history:", err);
            setErrorMessage(
                err?.message || "Failed to load your hire history. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(activeTab);
    }, [activeTab]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>📋</span> View Hire History
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Track your past & active service hires across Bangladesh.
                    </p>
                </div>
                <Link
                    to="/labors"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors self-start md:self-auto"
                >
                    <span>➕</span> Hire New Laborer
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto pb-2">
                {[
                    { key: "all", label: "All Hires" },
                    { key: "pending", label: "Pending" },
                    { key: "accepted", label: "Accepted" },
                    { key: "completed", label: "Completed" },
                    { key: "rejected", label: "Rejected" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                            activeTab === tab.key
                                ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content States */}
            {isLoading ? (
                <div className="py-16 text-center">
                    <LoadingSpinner message="Loading your hire history..." />
                </div>
            ) : errorMessage ? (
                <ErrorState
                    title="Could Not Load Hire History"
                    message={errorMessage}
                    onRetry={() => fetchHistory(activeTab)}
                />
            ) : bookings.length === 0 ? (
                <EmptyState
                    title="No Hire Records Found"
                    message={
                        activeTab === "all"
                            ? "You haven't hired any local workers yet. Browse available professionals to book a service!"
                            : `No hires found with status "${activeTab}".`
                    }
                    actionLabel="Find Workers"
                    actionTo="/labors"
                />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking) => {
                        const hourlyWage = Number(booking.labor_hourly_wage || 0);
                        const durationHrs = Number(booking.duration || 1);
                        const totalCost = (hourlyWage * durationHrs).toFixed(2);
                        const laborObj = {
                            id: booking.labor,
                            name: booking.labor_name,
                            profession: booking.labor_profession,
                            photo: booking.labor_photo,
                            hourly_wage: booking.labor_hourly_wage,
                        };

                        return (
                            <div
                                key={booking.id}
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row gap-6 items-start justify-between"
                            >
                                {/* Left Info: Labor Details */}
                                <div className="flex gap-4 items-start">
                                    <LaborPhoto
                                        photoUrl={booking.labor_photo}
                                        name={booking.labor_name}
                                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-800 flex-shrink-0"
                                    />
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Link
                                                to={`/labors/${booking.labor}`}
                                                className="text-lg font-bold text-gray-900 dark:text-white hover:text-emerald-600 transition-colors"
                                            >
                                                {booking.labor_name || `Labor #${booking.labor}`}
                                            </Link>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${_getStatusBadge(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status_display || booking.status}
                                            </span>
                                        </div>

                                        {booking.labor_profession && (
                                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                {booking.labor_profession}
                                            </p>
                                        )}

                                        {booking.labor_rating && (
                                            <div className="mt-1">
                                                <RatingDisplay rating={Number(booking.labor_rating)} />
                                            </div>
                                        )}

                                        {/* Work Metadata */}
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
                                            <div>
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">📅 Work Date:</span>{" "}
                                                {booking.work_date}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">⏰ Start Time:</span>{" "}
                                                {booking.start_time}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">⏳ Duration:</span>{" "}
                                                {booking.duration} hrs
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">📍 Address:</span>{" "}
                                                {booking.address}
                                            </div>
                                        </div>

                                        {booking.notes && (
                                            <p className="mt-2 text-xs italic text-gray-500 bg-gray-50 dark:bg-gray-800/60 p-2 rounded border border-gray-100 dark:border-gray-800">
                                                "{booking.notes}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Info: Pricing & Actions */}
                                <div className="flex flex-col md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800 gap-4">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Est. Total Cost</p>
                                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                            ৳{totalCost}{" "}
                                            <span className="text-xs font-normal text-gray-400">
                                                (৳{hourlyWage}/hr)
                                            </span>
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Booked on {new Date(booking.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <FavoriteButton labor={laborObj} showLabel={false} />
                                        <Link
                                            to={`/labors/${booking.labor}`}
                                            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium rounded-lg transition-colors"
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            to={`/labors/${booking.labor}/hire`}
                                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                                        >
                                            Hire Again
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HireHistoryPage;
