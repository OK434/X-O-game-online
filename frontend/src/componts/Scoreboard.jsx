import { useEffect, useState } from "react";

export default function Scoreboard() {
    const [userIn, setUserIn] = useState(null);
    const [scoreboard, setScoreboard] = useState([]);
    const token = localStorage.getItem("token");
    const [top10, setTop10] = useState([]);
    useEffect(() => {
        if (!token) return;

        fetch(`/api/users/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            }
            )
            .then(data => setUserIn(data))
            .catch(err => console.error(err));


    }, [token]);


    useEffect(() => {
        if (!userIn?._id) return;

        fetch(`/api/scoreboard/rankings?userId=${userIn._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setScoreboard(data);
                setTop10(data.top10);
            })
            .catch((err) => console.error(err));

    }, [userIn]);



    const currentUserRank = scoreboard?.currentUser?.rank;

    return (
        <div className="min-h-screen flex items-center justify-center from-blue-400 to-purple-500 p-4">
            <div className="w-full max-w-md bg-[#e6c87a]/70 backdrop-blur-sm rounded-[30px] shadow-xl p-6 flex flex-col gap-6">


                <h2 className="text-3xl font-bold text-center text-rose-600 font-serif">
                    🏆 Scoreboard
                </h2>


                <div className="bg-white/80 p-4 rounded-2xl shadow text-center">
                    <p className="text-gray-600 text-sm">
                        {userIn?.userName}
                    </p>
                    <p className="font-bold text-gray-800">
                        Your Rank: #{currentUserRank}
                    </p>

                    <div className="flex justify-center gap-6 mt-2 font-semibold text-rose-600">
                        <span>W: {userIn?.scoreboard?.wins || 0}</span>
                        <span>L: {userIn?.scoreboard?.losses || 0}</span>
                        <span>D: {userIn?.scoreboard?.draws || 0}</span>
                    </div>
                </div>


                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">

                    {top10.map((player, index) => {
                        const isCurrentUser =
                            player.userId?._id === userIn?._id;

                        return (
                            <div
                                key={player._id}
                                className={`flex justify-between items-center p-3 rounded-xl shadow
                                ${isCurrentUser
                                        ? "bg-green-200 border border-green-400"
                                        : "bg-white/70"
                                    }`}
                            >

                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg text-gray-700">
                                        #{index + 1}
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        {player.userId?.userName || "Unknown"}
                                    </span>
                                </div>


                                <div className="text-sm font-medium text-gray-700 flex gap-3">
                                    <span>W:{player.wins}</span>
                                    <span>L:{player.losses}</span>
                                    <span>D:{player.draws}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>



            </div>
        </div>
    );
}