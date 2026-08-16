import { useNavigate } from "react-router-dom";

/**
 * List of job categories available on the platform.
 * @constant {Array<object>}
 */
const JOB_CATEGORIES = [
    { id: 1, name: "Electrician", available: 24 },
    { id: 2, name: "Plumber", available: 18 },
    { id: 3, name: "Painter", available: 31 },
    { id: 4, name: "Carpenter", available: 12 },
    { id: 5, name: "AC Technician", available: 9 },
    { id: 6, name: "General Labor", available: 47 },
];

/**
 * Platform statistics displayed on the homepage.
 * @constant {Array<object>}
 */
const PLATFORM_STATS = [
    { id: 1, value: "10,000+", label: "Jobs completed" },
    { id: 2, value: "500+", label: "Verified laborers" },
    { id: 3, value: "4.8 / 5", label: "Average rating" },
];

/**
 * Homepage component that displays the platform introduction,
 * job category cards and platform statistics.
 * This is the first page users see when they visit Lok Lagbe.
 * @component
 * @returns {JSX.Element} The homepage layout.
 */
function HomePage() {

    const navigate = useNavigate();

    /**
     * Navigates the user to the hiring page filtered by category.
     * @param {number} categoryId - The id of the selected job category.
     * @returns {void}
     */
    const _handleCategoryClick = (categoryId) => {
        navigate(`/hire?category=${categoryId}`);
    };

    /**
     * Navigates the user to the registration page.
     * @returns {void}
     */
    const _handleGetStarted = () => {
        navigate("/register");
    };

    return (
        <div className="min-h-screen bg-bg">

            {/* Navbar */}
            <nav className="navbar">
                <div className="text-lg font-medium text-text-primary">
                    Lok <span className="text-accent">Lagbe</span>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="/login"
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                        Log in
                    </a>
                    <button
                        onClick={_handleGetStarted}
                        className="btn-primary"
                    >
                        Get started
                    </button>
                </div>
            </nav>

            {/* Hero section */}
            <div className="section text-center pt-24">
                <div className="badge mb-6">
                    Trusted by 10,000+ households in Bangladesh
                </div>
                <h1 className="text-3xl font-medium text-text-primary leading-tight mb-4">
                    Hire skilled labor,
                    <br />
                    instantly.
                </h1>
                <p className="text-text-secondary text-base max-w-md mx-auto mb-8">
                    Find electricians, plumbers, painters and more &mdash; vetted,
                    rated and ready to work.
                </p>
                <button
                    onClick={_handleGetStarted}
                    className="btn-primary"
                >
                    Find a laborer
                </button>
            </div>

            {/* Job categories section */}
            <div className="section">
                <p className="text-text-muted text-sm mb-1">
                    What do you need?
                </p>
                <h2 className="text-xl font-medium text-text-primary mb-6">
                    Browse by job category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {JOB_CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => _handleCategoryClick(category.id)}
                            className="card border border-border hover:border-accent/40 hover:shadow-glow cursor-pointer transition-all duration-200"
                        >
                            <p className="text-text-primary font-medium text-sm mb-1">
                                {category.name}
                            </p>
                            <p className="text-text-muted text-xs">
                                {category.available} available
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats section */}
            <div className="section">
                <div className="grid grid-cols-3 gap-4">
                    {PLATFORM_STATS.map((stat) => (
                        <div
                            key={stat.id}
                            className="stat-card text-center"
                        >
                            <p className="text-2xl font-medium text-text-primary mb-1">
                                {stat.value}
                            </p>
                            <p className="text-text-secondary text-sm">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border mt-10 px-8 py-5 flex justify-between items-center">
                <span className="text-text-muted text-sm">
                    Lok Lagbe &copy; 2026
                </span>
                <span className="text-text-muted text-sm">
                    Made in Bangladesh
                </span>
            </div>

        </div>
    );
}

export default HomePage;