import Avatar from "./Avatar.jsx";

/**
 * Show the signed-in user's identity above the profile form.
 *
 * @param {object} props Component properties.
 * @param {object} props.profile The user's profile fields.
 * @returns {JSX.Element} The profile header card.
 */
function ProfileHeader({ profile }) {
    return (
        <div className="card p-8 mb-6">
            <div className="flex flex-col items-center">
                <div className="transition-transform duration-300 hover:scale-110">
                    <Avatar avatar={profile.avatar} />
                </div>

                <h1 className="text-3xl font-bold mt-5 text-text-primary">
                    {profile.username}
                </h1>

                <p className="text-text-secondary mt-2">{profile.email}</p>

                <div className="badge mt-4">Active User</div>
            </div>
        </div>
    );
}

export default ProfileHeader;
