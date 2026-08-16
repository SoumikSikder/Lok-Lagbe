import { useState } from "react";


/**
 * Build initials for a labor photo fallback.
 *
 * @param {string} name Laborer's full name.
 * @returns {string} Up to two uppercase initials.
 */
function _getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}


/**
 * Render a labor photo with a consistent initials fallback.
 *
 * @param {object} props Component properties.
 * @param {object} props.labor Labor profile containing name, photo, profession.
 * @param {string} [props.className=""] Additional image or fallback classes.
 * @returns {JSX.Element} Labor photo or initials fallback.
 */
function LaborPhoto({ labor, className = "" }) {
    const [imageFailed, setImageFailed] = useState(!labor.photo);

    function _handleImageError() {
        setImageFailed(true);
    }

    if (imageFailed) {
        return (
            <div
                className={`flex items-center justify-center bg-linear-to-br from-brand-100 to-brand-200 font-bold text-brand-700 ${className}`}
                role="img"
                aria-label={`${labor.name}, ${labor.profession}`}
            >
                {_getInitials(labor.name)}
            </div>
        );
    }

    return (
        <img
            src={labor.photo}
            alt={`${labor.name}, ${labor.profession}`}
            onError={_handleImageError}
            className={className}
        />
    );
}


export default LaborPhoto;
