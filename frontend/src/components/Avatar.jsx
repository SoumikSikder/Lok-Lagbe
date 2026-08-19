const AVATAR_GLYPHS = {
    1: "👨",
    2: "👩",
    3: "🧑",
    4: "👨‍💻",
    5: "👩‍💻",
};

/**
 * Render the emoji glyph for a stored avatar choice.
 *
 * @param {object} props Component properties.
 * @param {number} props.avatar The avatar id between 1 and 5.
 * @returns {JSX.Element} The avatar badge.
 */
function Avatar({ avatar }) {
    return (
        <div className="w-24 h-24 rounded-full bg-elevated border-4 border-accent flex items-center justify-center text-5xl">
            {AVATAR_GLYPHS[avatar] || "👤"}
        </div>
    );
}

export default Avatar;
