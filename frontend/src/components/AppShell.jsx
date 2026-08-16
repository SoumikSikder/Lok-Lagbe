import { useState } from "react";
import { Link, NavLink } from "react-router";


/**
 * Build classes for primary navigation links.
 *
 * @param {object} state React Router navigation state.
 * @param {boolean} state.isActive Whether the link matches the current URL.
 * @returns {string} Tailwind CSS classes for the link.
 */
function _getNavLinkClassName({ isActive }) {
    const baseClasses =
        "block rounded-xl px-4 py-3 text-sm font-semibold transition";
    const activeClasses = "bg-brand-50 text-brand-700";
    const inactiveClasses =
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
}


/**
 * Provide the shared header, page background, navigation, and footer.
 *
 * @param {object} props Component properties.
 * @param {React.ReactNode} props.children Page content.
 * @returns {JSX.Element} The shared application shell.
 */
function AppShell({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <header className="relative z-20 border-b border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4 sm:px-6 lg:px-8">
                    <div className="justify-self-start">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                            aria-expanded={isMenuOpen}
                            aria-controls="primary-menu"
                            aria-label="Toggle navigation menu"
                            className="flex size-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                className="size-6"
                                aria-hidden="true"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <Link
                        to="/labors"
                        className="justify-self-center text-xl font-black uppercase tracking-[0.2em] text-slate-900 transition hover:text-brand-700 sm:text-2xl"
                    >
                        Lok Lagbe
                    </Link>

                    <div className="flex items-center gap-3 justify-self-end text-slate-600">
                        <span
                            className="hidden size-10 items-center justify-center rounded-full bg-slate-50 sm:flex"
                            role="img"
                            aria-label="Notifications"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="size-5"
                                aria-hidden="true"
                            >
                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                                <path d="M10 21h4" />
                            </svg>
                        </span>
                        <span
                            className="flex size-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 ring-1 ring-brand-200"
                            role="img"
                            aria-label="User profile"
                        >
                            U
                        </span>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav
                        id="primary-menu"
                        aria-label="Primary navigation"
                        className="absolute left-4 top-[calc(100%+0.5rem)] w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:left-6 lg:left-8"
                    >
                        <NavLink
                            to="/labors"
                            onClick={() => setIsMenuOpen(false)}
                            className={_getNavLinkClassName}
                        >
                            Find labor
                        </NavLink>
                    </nav>
                )}
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>Lok Lagbe © {new Date().getFullYear()}</p>
                    <p>Designed in Bangladesh</p>
                </div>
            </footer>
        </div>
    );
}


export default AppShell;
