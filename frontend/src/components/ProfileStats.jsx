/**
 * Profile statistics component.
 *
 * @component
 */


function ProfileStats({ profile }) {


    const cards = [

        {
            title: "Account Status",
            value: "Active",
        },

        {
            title: "Profile",
            value: "Completed",
        },

        {
            title: "Avatar",
            value: `#${profile.avatar}`,
        },

    ];




    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">


            {
                cards.map((card) => (


                    <div

                        key={card.title}

                        className="
                        dashboard-card
                        p-6
                        text-white
                        hover:-translate-y-1
                        transition-all
                        duration-300
                        "

                    >


                        <p className="text-gray-400 text-sm font-medium">

                            {card.title}

                        </p>



                        <h2 className="text-2xl font-bold mt-3 text-[#00c17c]">

                            {card.value}

                        </h2>



                    </div>


                ))
            }



        </div>

    );


}



export default ProfileStats;