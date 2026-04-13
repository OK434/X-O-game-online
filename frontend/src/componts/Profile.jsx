import { useEffect, useState } from "react";
export default function Profile() {
    const [userIn, setUserIn] = useState(null);

 const token = localStorage.getItem("token");
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
    return (
        <>
        
            {userIn && (
                <div className="max-w-md mx-auto mt-10">

                    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-rose-100">

                        <div className="flex items-center gap-4 mb-6">
                            <div>
                                
                                <h2 className="text-lg font-bold text-gray-800">
                                    {userIn.userName}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {userIn.email}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
}