/**
 * Avatar component.
 *
 * Displays user avatar.
 *
 * @component
 */


function Avatar({ avatar }) {


    const avatarStyles = {
        1: "👨",
        2: "👩",
        3: "🧑",
        4: "👨‍💻",
        5: "👩‍💻",
    };



    return (

        <div className="w-24 h-24 rounded-full bg-[#242424] border-4 border-[#00c17c] flex items-center justify-center text-5xl">

            {avatarStyles[avatar] || "👤"}

        </div>

    );

}



export default Avatar;