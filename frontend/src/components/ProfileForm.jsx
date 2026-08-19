/**
 * Profile form component.
 *
 * Displays and updates user profile information.
 *
 * @component
 */


import { useState } from "react";

import { updateProfile } from "../services/api";

import Avatar from "./Avatar";



function ProfileForm({ profile, token, onUpdate }) {


    const [phoneNumber, setPhoneNumber] = useState(
        profile.phone_number || ""
    );


    const [address, setAddress] = useState(
        profile.address || ""
    );


    const [avatar, setAvatar] = useState(
        profile.avatar || 1
    );


    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);





    /**
     * Handle profile update.
     *
     * @param {Event} event Form submit event
     */

    const handleSubmit = async (event) => {

        event.preventDefault();


        setLoading(true);

        setMessage("");

        setError("");



        try {


            const response = await updateProfile(
                token,
                {
                    phone_number: phoneNumber,
                    address: address,
                    avatar: avatar,
                }
            );



            if (response.message) {


                setMessage(
                    "Profile updated successfully"
                );


                onUpdate(
                    response.data
                );


            } else {


                setError(
                    "Profile update failed"
                );


            }



        } catch (error) {


            console.error(
                "Profile update error:",
                error
            );


            setError(
                "Something went wrong"
            );


        }

        finally {


            setLoading(false);


        }


    };





    return (


        <div className="bg-[#1a1a1a] text-white rounded-xl shadow-lg p-8 w-full border border-gray-800">


            <h2 className="text-2xl font-bold text-center mb-6">

                Manage Profile

            </h2>





            {/* Avatar Preview */}

            <div className="flex justify-center mb-6">


                <Avatar
                    avatar={avatar}
                />


            </div>







            {/* User Information */}


            <div className="mb-6 space-y-3">


                <div>

                    <span className="font-semibold text-gray-300">
                        Username:
                    </span>

                    <span className="ml-2">
                        {profile.username}
                    </span>

                </div>



                <div>

                    <span className="font-semibold text-gray-300">
                        Email:
                    </span>

                    <span className="ml-2">
                        {profile.email}
                    </span>

                </div>


            </div>







            <form onSubmit={handleSubmit}>





                {/* Avatar Selection */}


                <label className="block mb-2 font-medium text-gray-300">

                    Select Avatar

                </label>



                <select


                    value={avatar}


                    onChange={(event) =>
                        setAvatar(
                            Number(event.target.value)
                        )
                    }


                    className="w-full border border-gray-700 bg-[#242424] text-white rounded-lg p-3 mb-5"


                >


                    <option value={1}>
                        Avatar 1
                    </option>


                    <option value={2}>
                        Avatar 2
                    </option>


                    <option value={3}>
                        Avatar 3
                    </option>


                    <option value={4}>
                        Avatar 4
                    </option>


                    <option value={5}>
                        Avatar 5
                    </option>


                </select>









                {/* Phone Number */}


                <label className="block mb-2 font-medium text-gray-300">

                    Phone Number

                </label>



                <input


                    type="text"


                    value={phoneNumber}


                    onChange={(event) =>
                        setPhoneNumber(
                            event.target.value
                        )
                    }


                    placeholder="Enter phone number"


                    className="w-full border border-gray-700 bg-[#242424] text-white rounded-lg p-3 mb-5"


                />









                {/* Address */}


                <label className="block mb-2 font-medium text-gray-300">

                    Address

                </label>



                <textarea


                    value={address}


                    onChange={(event) =>
                        setAddress(
                            event.target.value
                        )
                    }


                    placeholder="Enter address"


                    rows="3"


                    className="w-full border border-gray-700 bg-[#242424] text-white rounded-lg p-3 mb-5"


                />









                <button


                    type="submit"


                    disabled={loading}


                    className="w-full bg-[#00c17c] text-black font-semibold py-3 rounded-lg hover:bg-[#00a86b] transition disabled:opacity-50"


                >


                    {
                        loading
                        ? "Updating..."
                        : "Update Profile"
                    }


                </button>




            </form>








            {
                message && (

                    <p className="text-green-400 text-center mt-4">

                        {message}

                    </p>

                )
            }






            {
                error && (

                    <p className="text-red-400 text-center mt-4">

                        {error}

                    </p>

                )
            }



        </div>


    );

}



export default ProfileForm;