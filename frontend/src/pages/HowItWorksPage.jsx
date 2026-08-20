import { useNavigate } from "react-router-dom";

/**
 * Ordered list of steps explaining how the platform works.
 * @constant {Array<object>}
 */
const HIRING_STEPS = [
    {
        id: 1,
        title: "Create an account",
        description:
            "Sign up with your name, email and password. Pick one of five profile avatars and add your phone number and address so laborers know where the job is.",
    },
    {
        id: 2,
        title: "Pick a job category",
        description:
            "Browse the homepage and choose what you need done. Electrician, plumber, painter, carpenter, AC technician or general labor for moving and lifting work.",
    },
    {
        id: 3,
        title: "Compare available laborers",
        description:
            "Every laborer listing shows their name, listed skills, fixed hiring price and average star rating from people who have actually hired them before.",
    },
    {
        id: 4,
        title: "Confirm the hire",
        description:
            "Review the laborer name, job type and total price on the confirmation screen. Nothing is charged until you confirm, and the price you see is the price you pay.",
    },
    {
        id: 5,
        title: "Pay securely",
        description:
            "Pay through the gateway using bKash, Nagad, Rocket or a debit or credit card. You can add an optional tip before confirming the payment.",
    },
    {
        id: 6,
        title: "Rate and review",
        description:
            "Once the job is paid for you can leave a star rating out of five and written feedback. Your review helps the next person hire with confidence.",
    },
];

/**
 * Short answers to common questions about the platform.
 * @constant {Array<object>}
 */
const COMMON_QUESTIONS = [
    {
        id: 1,
        question: "Do I need an account to browse?",
        answer:
            "No. Anyone can view the homepage and job categories. You only need an account to confirm a hire, pay or leave a review.",
    },
    {
        id: 2,
        question: "Can I review a laborer I did not hire?",
        answer:
            "No. Reviews are tied to a completed and paid hiring transaction, so every rating on the platform comes from a real job.",
    },
    {
        id: 3,
        question: "Are the prices fixed or hourly?",
        answer:
            "Prices are fixed per job and shown upfront on the laborer listing. No hidden charges are added after you confirm.",
    },
    {
        id: 4,
        question: "How do I find a past hire again?",
        answer:
            "Your hiring history page lists every past transaction with the laborer name, job category, date, amount paid and the rating you left.",
    },
];

/**
 * How It Works page component that explains the hiring process
 * end to end and answers common questions about the platform.
 * @component
 * @returns {JSX.Element} The how it works page layout.
 */
function HowItWorksPage() {

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
                        href="/pricing"
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                        Pricing
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
                    How it works
                </p>
                <h1 className="text-3xl font-medium text-text-primary mb-4">
                    Hiring in six steps.
                </h1>
                <p className="text-text-secondary text-base max-w-lg">
                    Lok Lagbe connects households and businesses in Bangladesh
                    with skilled and unskilled laborers. Here is exactly what
                    happens from signing up to leaving a review.
                </p>
            </div>

            {/* Steps */}
            <div className="section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HIRING_STEPS.map((step) => (
                        <div
                            key={step.id}
                            className="card border border-border"
                        >
                            <div className="avatar mb-4">
                                {step.id}
                            </div>
                            <h2 className="text-text-primary font-medium text-base mb-2">
                                {step.title}
                            </h2>
                            <p className="text-text-secondary text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Common questions */}
            <div className="section">
                <p className="text-text-muted text-sm mb-1">
                    Before you start
                </p>
                <h2 className="text-xl font-medium text-text-primary mb-6">
                    Common questions
                </h2>
                <div className="grid grid-cols-1 gap-3">
                    {COMMON_QUESTIONS.map((item) => (
                        <div
                            key={item.id}
                            className="card-elevated border border-border"
                        >
                            <h3 className="text-text-primary font-medium text-sm mb-2">
                                {item.question}
                            </h3>
                            <p className="text-text-secondary text-sm">
                                {item.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to action */}
            <div className="section text-center">
                <h2 className="text-xl font-medium text-text-primary mb-3">
                    Ready to hire?
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                    Create an account and find the right laborer in minutes.
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

export default HowItWorksPage;