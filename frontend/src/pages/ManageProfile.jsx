/**
 * Manage profile dashboard page.
 *
 * @component
 */


import { useEffect, useState } from "react";


import Navbar from "../components/Navbar";

import ProfileHeader from "../components/ProfileHeader";

import ProfileStats from "../components/ProfileStats";

import ProfileForm from "../components/ProfileForm";


import { getProfile } from "../services/api";


import { getToken } from "../utils/auth";





function ManageProfile() {


    const [profile, setProfile] = useState(null);


    const token = getToken();





    useEffect(() => {


        const loadProfile = async () => {


            const response = await getProfile(
                token
            );


            setProfile(
                response
            );


        };


        loadProfile();


    }, [token]);







    if (!profile) {


        return (

            <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">

                <h1 className="text-xl">

                    Loading profile...

                </h1>

            </div>

        );


    }







    return (



        <div className="min-h-screen bg-[#0f0f0f]">





            {/* Navbar */}

            <Navbar />







            <main className="px-4 py-10">



                <div className="w-full max-w-3xl mx-auto">





                    {/* Profile Header */}

                    <ProfileHeader

                        profile={profile}

                    />







                    {/* Statistics Cards */}

                    <ProfileStats

                        profile={profile}

                    />







                    {/* Profile Update Form */}

                    <ProfileForm


                        profile={profile}


                        token={token}


                        onUpdate={setProfile}


                    />





                </div>



            </main>





        </div>


    );


}



export default ManageProfile;