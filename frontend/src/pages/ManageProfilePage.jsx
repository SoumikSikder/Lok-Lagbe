import { useEffect, useState } from "react";

import ProfileForm from "../components/ProfileForm.jsx";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ProfileStats from "../components/ProfileStats.jsx";
import { _getProfile } from "../services/authService.js";

/**
 * Load and present the signed-in user's profile dashboard.
 *
 * The page chrome comes from AppShell, so this renders content only.
 *
 * @component
 * @returns {JSX.Element} The profile dashboard.
 */
function ManageProfilePage() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let isActive = true;

        const loadProfile = async () => {
            try {
                const response = await _getProfile();
                if (isActive) {
                    setProfile(response);
                }
            } catch (loadError) {
                if (isActive) {
                    setError(
                        loadError.message || "Unable to load your profile.",
                    );
                }
            }
        };

        loadProfile();

        return () => {
            isActive = false;
        };
    }, []);

    if (error) {
        return (
            <div className="page flex items-center justify-center">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="page flex items-center justify-center">
                <h1 className="text-xl text-text-primary">
                    Loading profile...
                </h1>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="section w-full max-w-3xl mx-auto">
                <ProfileHeader profile={profile} />
                <ProfileStats profile={profile} />
                <ProfileForm profile={profile} onUpdate={setProfile} />
            </div>
        </div>
    );
}

export default ManageProfilePage;
