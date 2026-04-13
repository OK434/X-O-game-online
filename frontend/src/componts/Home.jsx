import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [userIn, setUserIn] = useState(null);
  const navigator = useNavigate();
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
     <div className="min-h-screen w-full flex items-center justify-center p-4">

  {/* 🟢 Card */}
  <div className="
    w-full max-w-md
    bg-[#e6c87a]/70
    backdrop-blur-sm
    rounded-[30px]
    shadow-[0_10px_40px_rgba(0,0,0,0.2)]
    p-6 sm:p-10
    flex flex-col gap-6
    
  ">

    {/* 🟢 Buttons */}
    <button
      onClick={() => navigator("/game")}
      className="
        w-full
        bg-[#ead39c]
        text-white
        py-4
        rounded-xl
        text-lg sm:text-xl
        transition
        hover:bg-[#e2c98f]
        hover:scale-[1.02]
        active:scale-95
      "
    >
      Play
    </button>
    <button className="
      w-full
      bg-[#ead39c]
      text-white
      py-4
      rounded-xl
      text-lg sm:text-xl
      transition
      hover:bg-[#e2c98f]
      hover:scale-[1.02]
      active:scale-95
    "
    onClick={() => navigator("/scoreboard")}
    >
      Scoreboard
    </button>

    {userIn ? (
      <button
        onClick={() => navigator("/profile")}
        className="
          w-full
          bg-[#ead39c]
          text-white
          py-4
          rounded-xl
          text-lg sm:text-xl
          transition
          hover:bg-[#e2c98f]
          hover:scale-[1.02]
          active:scale-95
        "
      >
        Profile
      </button>
    ) : (
      <button
        onClick={() => navigator("/login")}
        className="
          w-full
          bg-[#ead39c]
          text-white
          py-4
          rounded-xl
          text-lg sm:text-xl
          transition
          hover:bg-[#e2c98f]
          hover:scale-[1.02]
          active:scale-95
        "
      >
        Login
      </button>
    )}

  </div>
</div>
    </>
  )

}