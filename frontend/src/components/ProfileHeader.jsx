/**
 * Profile header component.
 *
 * Shows user identity information.
 *
 * @component
 */


import Avatar from "./Avatar";



function ProfileHeader({ profile }) {



    return (


        <div className="dashboard-card p-8 mb-6 text-white">



            <div className="flex flex-col items-center">



                <div className="transition-transform duration-300 hover:scale-110">

                    <Avatar

                        avatar={profile.avatar}

                    />

                </div>





                <h1 className="text-3xl font-bold mt-5">

                    {profile.username}

                </h1>





                <p className="text-gray-400 mt-2">

                    {profile.email}

                </p>





                <div className="badge-success mt-4">

                    Active User

                </div>



            </div>



        </div>


    );


}



export default ProfileHeader;