/**
 * Display a consistent informational panel for a simple route.
 *
 * @param {object} props Component properties.
 * @param {string} props.eyebrow Short label displayed above the title.
 * @param {string} props.title Page heading.
 * @param {string} props.description Supporting explanation.
 * @param {React.ReactNode} [props.children] Optional route-specific content.
 * @returns {JSX.Element} A responsive informational panel.
 */
function PagePlaceholder({ eyebrow, title, description, children }) {
    return (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                    {eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                    {description}
                </p>
                {children && <div className="mt-6">{children}</div>}
            </div>
        </section>
    );
}


export default PagePlaceholder;
