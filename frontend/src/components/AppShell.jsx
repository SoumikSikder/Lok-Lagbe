import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useFavorites } from "../context/FavoritesContext.jsx";

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
    const { favoritesCount } = useFavorites();

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <header className="relative z-20 border-b border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 justify-self-start">
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

                        <div className="hidden md:flex items-center gap-1">
                            <NavLink to="/labors" className={({ isActive }) => `px-3 py-2 text-xs font-bold rounded-lg ${isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900'}`}>
                                Find Labor
                            </NavLink>
                            <NavLink to="/bookings/history" className={({ isActive }) => `px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 ${isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900'}`}>
                                <span>📋</span> Hire History
                            </NavLink>
                            <NavLink to="/favorites" className={({ isActive }) => `px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 ${isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900'}`}>
                                <span>❤️</span> Favorites {favoritesCount > 0 && <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{favoritesCount}</span>}
                            </NavLink>
                        </div>
                    </div>

                    <Link
                        to="/labors"
                        className="justify-self-center text-xl font-black uppercase tracking-[0.2em] text-slate-900 transition hover:text-brand-700 sm:text-2xl"
                    >
                        Lok Lagbe
                    </Link>

                    <div className="flex items-center gap-3 justify-self-end text-slate-600">
                        <Link
                            to="/favorites"
                            className="flex size-10 items-center justify-center rounded-full bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition relative"
                            title="My Favorites"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-rose-500">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                            {favoritesCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                                    {favoritesCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/bookings/history"
                            className="flex size-10 items-center justify-center rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition"
                            title="Hire History"
                        >
                            <span className="text-base">📋</span>
                        </Link>
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
                        className="absolute left-4 top-[calc(100%+0.5rem)] w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:left-6 lg:left-8 z-30"
                    >
                        <NavLink
                            to="/labors"
                            onClick={() => setIsMenuOpen(false)}
                            className={_getNavLinkClassName}
                        >
                            🔍 Find labor
                        </NavLink>
                        <NavLink
                            to="/bookings/history"
                            onClick={() => setIsMenuOpen(false)}
                            className={_getNavLinkClassName}
                        >
                            📋 View Hire History
                        </NavLink>
                        <NavLink
                            to="/favorites"
                            onClick={() => setIsMenuOpen(false)}
                            className={_getNavLinkClassName}
                        >
                            ❤️ Favorites {favoritesCount > 0 && `(${favoritesCount})`}
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
