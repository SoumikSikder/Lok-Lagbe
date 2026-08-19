/**
 * Navigation bar component.
 *
 * @component
 */


import { useNavigate } from "react-router-dom";

import { removeToken } from "../utils/auth";



function Navbar() {


    const navigate = useNavigate();



    const handleLogout = () => {


        removeToken();


        navigate("/login");


    };





    return (


        <nav className="w-full bg-[#151b23]/80 backdrop-blur-lg border-b border-gray-800 px-6 py-4 flex items-center justify-between">



            <h1 className="text-2xl font-bold text-[#00c17c]">

                LokLagbe

            </h1>




            <div className="flex items-center gap-4">



                <button

                    className="text-gray-300 hover:text-white transition"

                >

                    Profile

                </button>





                <button

                    onClick={handleLogout}

                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"

                >

                    Logout

                </button>



            </div>



        </nav>


    );


}



export default Navbar;