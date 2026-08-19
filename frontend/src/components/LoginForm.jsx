/**
 * Login form component.
 *
 * Handles user authentication.
 *
 * @component
 */


import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";

import { saveToken } from "../utils/auth";





function LoginForm() {



    const navigate = useNavigate();



    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);








    const handleSubmit = async (event) => {


        event.preventDefault();


        setError("");

        setLoading(true);





        try {


            const response = await loginUser({

                username,

                password,

            });





            if (response.access) {


                saveToken(

                    response.access

                );


                navigate("/profile");



            } else {


                setError(

                    "Invalid username or password"

                );


            }







        } catch (error) {


            setError(

                "Unable to login. Please try again."

            );



        } finally {


            setLoading(false);


        }


    };









    return (



        <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4">






            <div className="w-full max-w-md bg-[#151b23] border border-[#263241] rounded-2xl p-8 shadow-xl">







                <div className="text-center mb-8">



                    <h1 className="text-4xl font-bold text-[#00c17c]">

                        LokLagbe

                    </h1>



                    <p className="text-gray-400 mt-2">

                        Find trusted workers easily

                    </p>



                </div>







                <h2 className="text-2xl font-semibold text-white mb-6">

                    Welcome Back

                </h2>








                <form onSubmit={handleSubmit}>


                    <label className="block text-sm text-gray-400 mb-2">

                        Username

                    </label>




                    <input


                        type="text"


                        value={username}


                        onChange={(event) =>

                            setUsername(

                                event.target.value

                            )

                        }


                        placeholder="Enter username"


                        className="
                        w-full
                        px-4
                        py-3
                        mb-5
                        rounded-xl
                        bg-[#0f141b]
                        border
                        border-[#263241]
                        text-white
                        placeholder-gray-500
                        focus:border-[#00c17c]
                        focus:ring-2
                        focus:ring-[#00c17c]/20
                        outline-none
                        "

                    />








                    <label className="block text-sm text-gray-400 mb-2">

                        Password

                    </label>





                    <input


                        type="password"


                        value={password}


                        onChange={(event) =>

                            setPassword(

                                event.target.value

                            )

                        }


                        placeholder="Enter password"


                        className="
                        w-full
                        px-4
                        py-3
                        mb-6
                        rounded-xl
                        bg-[#0f141b]
                        border
                        border-[#263241]
                        text-white
                        placeholder-gray-500
                        focus:border-[#00c17c]
                        focus:ring-2
                        focus:ring-[#00c17c]/20
                        outline-none
                        "

                    />









                    <button


                        type="submit"


                        disabled={loading}


                        className="
                        w-full
                        py-3
                        rounded-xl
                        bg-[#00c17c]
                        text-black
                        font-semibold
                        transition
                        duration-200
                        hover:bg-[#00a86b]
                        hover:scale-[1.02]
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        "

                    >


                        {loading ? "Logging in..." : "Login"}


                    </button>







                </form>









                {

                    error && (


                        <p className="text-red-400 text-center mt-5 text-sm">

                            {error}

                        </p>


                    )

                }







            </div>





        </div>


    );

}



export default LoginForm;