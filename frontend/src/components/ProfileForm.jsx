import { useState } from "react";

import { _updateProfile } from "../services/authService.js";
import Avatar from "./Avatar.jsx";

const AVATAR_OPTIONS = [1, 2, 3, 4, 5];

/**
 * Display and update the signed-in user's editable profile fields.
 *
 * @param {object} props Component properties.
 * @param {object} props.profile The user's current profile fields.
 * @param {Function} props.onUpdate Called with the updated profile on success.
 * @returns {JSX.Element} The profile form card.
 */
function ProfileForm({ profile, onUpdate }) {
    const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
    const [address, setAddress] = useState(profile.address || "");
    const [avatar, setAvatar] = useState(profile.avatar || 1);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Submit the edited fields to the profile endpoint.
     *
     * @param {Event} event Form submit event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await _updateProfile({
                phone_number: phoneNumber,
                address: address,
                avatar: avatar,
            });

            if (response.message) {
                setMessage("Profile updated successfully");
                onUpdate(response.data);
            } else {
                setError("Profile update failed");
            }
        } catch (submitError) {
            setError(submitError.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-8 w-full border border-border">
            <h2 className="text-2xl font-bold text-center mb-6 text-text-primary">
                Manage Profile
            </h2>

            <div className="flex justify-center mb-6">
                <Avatar avatar={avatar} />
            </div>

            <div className="mb-6 space-y-3">
                <div>
                    <span className="font-semibold text-text-secondary">
                        Username:
                    </span>
                    <span className="ml-2 text-text-primary">
                        {profile.username}
                    </span>
                </div>

                <div>
                    <span className="font-semibold text-text-secondary">
                        Email:
                    </span>
                    <span className="ml-2 text-text-primary">
                        {profile.email}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <label className="field-label" htmlFor="profile-avatar">
                    Select Avatar
                </label>
                <select
                    id="profile-avatar"
                    value={avatar}
                    onChange={(event) => setAvatar(Number(event.target.value))}
                    className="field-input mb-5"
                >
                    {AVATAR_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            Avatar {option}
                        </option>
                    ))}
                </select>

                <label className="field-label" htmlFor="profile-phone">
                    Phone Number
                </label>
                <input
                    id="profile-phone"
                    type="text"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="Enter phone number"
                    className="field-input mb-5"
                />

                <label className="field-label" htmlFor="profile-address">
                    Address
                </label>
                <textarea
                    id="profile-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Enter address"
                    rows="3"
                    className="field-input mb-5"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>

            {message && (
                <p className="text-accent text-center mt-4">{message}</p>
            )}

            {error && <p className="text-danger text-center mt-4">{error}</p>}
        </div>
    );
}

export default ProfileForm;
