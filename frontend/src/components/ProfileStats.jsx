/**
 * Show a summary row of account status cards.
 *
 * @param {object} props Component properties.
 * @param {object} props.profile The user's profile fields.
 * @returns {JSX.Element} The statistics grid.
 */
function ProfileStats({ profile }) {
    const cards = [
        { title: "Account Status", value: "Active" },
        { title: "Profile", value: "Completed" },
        { title: "Avatar", value: `#${profile.avatar}` },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="stat-card hover:-translate-y-1 transition-all duration-300"
                >
                    <p className="text-text-secondary text-sm font-medium">
                        {card.title}
                    </p>
                    <h2 className="text-2xl font-bold mt-3 text-accent">
                        {card.value}
                    </h2>
                </div>
            ))}
        </div>
    );
}

export default ProfileStats;
