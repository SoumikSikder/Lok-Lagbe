import { useNavigate } from "react-router-dom";

/**
 * Indicative fixed price ranges for each job category.
 * @constant {Array<object>}
 */
const CATEGORY_PRICING = [
    { id: 1, category: "Electrician", range: "500 to 900", note: "Wiring, lighting, panel work" },
    { id: 2, category: "Plumber", range: "400 to 800", note: "Leaks, fittings, drainage" },
    { id: 3, category: "Painter", range: "600 to 1200", note: "Priced per room or wall area" },
    { id: 4, category: "Carpenter", range: "500 to 1000", note: "Repairs, fittings, assembly" },
    { id: 5, category: "AC Technician", range: "700 to 1400", note: "Servicing, install, gas refill" },
    { id: 6, category: "General Labor", range: "350 to 700", note: "Lifting, moving, loading" },
];

/**
 * Payment methods supported through the payment gateway.
 * @constant {Array<object>}
 */
const PAYMENT_METHODS = [
    { id: 1, name: "bKash", type: "Mobile financial service" },
    { id: 2, name: "Nagad", type: "Mobile financial service" },
    { id: 3, name: "Rocket", type: "Mobile financial service" },
    { id: 4, name: "VISA", type: "Debit or credit card" },
    { id: 5, name: "Mastercard", type: "Debit or credit card" },
];

/**
 * Pricing rules that apply to every hire on the platform.
 * @constant {Array<object>}
 */
const PRICING_RULES = [
    {
        id: 1,
        title: "Fixed price per job",
        description:
            "Every laborer sets one fixed price for the job. Nothing is calculated by the hour, so the number on the listing is the number you pay.",
    },
    {
        id: 2,
        title: "Price shown before you commit",
        description:
            "The hiring fee appears on the laborer card and again on the confirmation screen. You review it before any payment is taken.",
    },
    {
        id: 3,
        title: "No hidden charges",
        description:
            "No service fee, booking fee or surcharge is added after you confirm. The final charged amount always matches what was displayed.",
    },
    {
        id: 4,
        title: "Tipping is optional",
        description:
            "You can add any tip amount on the payment page. Leave the field empty and only the base hiring fee is charged.",
    },
];

/**
 * Pricing page component that explains how job pricing works,
 * shows indicative price ranges per category and lists the
 * supported payment methods.
 * @component
 * @returns {JSX.Element} The pricing page layout.
 */
function PricingPage() {

    const navigate = useNavigate();

    /**
     * Navigates the user to the registration page.
     * @returns {void}
     */
    const _handleGetStarted = () => {
        navigate("/register");
    };

    /**
     * Navigates the user back to the homepage.
     * @returns {void}
     */
    const _handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-bg">

            {/* Navbar */}
            <nav className="navbar">
                <div
                    onClick={_handleGoHome}
                    className="text-lg font-medium text-text-primary cursor-pointer"
                >
                    Lok <span className="text-accent">Lagbe</span>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="/how-it-works"
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                        How it works
                    </a>
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

            {/* Page heading */}
            <div className="section pt-24">
                <p className="text-text-muted text-sm mb-1">
                    Pricing
                </p>
                <h1 className="text-3xl font-medium text-text-primary mb-4">
                    Fixed prices, paid your way.
                </h1>
                <p className="text-text-secondary text-base max-w-lg">
                    Lok Lagbe is free to browse and free to join. You only pay
                    the laborer for the job you hire them to do.
                </p>
            </div>

            {/* Pricing rules */}
            <div className="section">
                <h2 className="text-xl font-medium text-text-primary mb-6">
                    How pricing works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PRICING_RULES.map((rule) => (
                        <div
                            key={rule.id}
                            className="card border border-border"
                        >
                            <h3 className="text-text-primary font-medium text-base mb-2">
                                {rule.title}
                            </h3>
                            <p className="text-text-secondary text-sm">
                                {rule.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicative pricing by category */}
            <div className="section">
                <p className="text-text-muted text-sm mb-1">
                    Typical ranges
                </p>
                <h2 className="text-xl font-medium text-text-primary mb-2">
                    Pricing by job category
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                    These are indicative ranges in Bangladeshi Taka. Each
                    laborer sets their own price within or outside these ranges.
                </p>
                <div className="grid grid-cols-1 gap-3">
                    {CATEGORY_PRICING.map((item) => (
                        <div
                            key={item.id}
                            className="card-elevated border border-border flex justify-between items-center"
                        >
                            <div>
                                <p className="text-text-primary font-medium text-sm mb-1">
                                    {item.category}
                                </p>
                                <p className="text-text-muted text-xs">
                                    {item.note}
                                </p>
                            </div>
                            <p className="text-accent font-medium text-sm">
                                Tk {item.range}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment methods */}
            <div className="section">
                <p className="text-text-muted text-sm mb-1">
                    At checkout
                </p>
                <h2 className="text-xl font-medium text-text-primary mb-6">
                    Accepted payment methods
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                        <div
                            key={method.id}
                            className="card border border-border"
                        >
                            <p className="text-text-primary font-medium text-sm mb-1">
                                {method.name}
                            </p>
                            <p className="text-text-muted text-xs">
                                {method.type}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="text-text-muted text-xs mt-4">
                    Card and mobile banking details are handled entirely by the
                    payment gateway. Lok Lagbe never stores your card number.
                </p>
            </div>

            {/* Call to action */}
            <div className="section text-center">
                <h2 className="text-xl font-medium text-text-primary mb-3">
                    No cost to sign up.
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                    Create an account and only pay when you hire.
                </p>
                <button
                    onClick={_handleGetStarted}
                    className="btn-primary"
                >
                    Create an account
                </button>
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

export default PricingPage;