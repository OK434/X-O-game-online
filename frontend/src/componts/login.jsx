import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassWord] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }   

            
            localStorage.setItem("token", data.token);
            navigate("/");
        
        } catch (error) {
        console.error("Login error:", error);
    }
};

return (
    <>
        <div className="h-screen overflow-hidden flex items-center justify-center  from-blue-400 to-purple-500">

            <div className="bg-white/20 p-12 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl border border-white/30 backdrop-blur-md">

                <h1 className="text-4xl font-bold text-center mb-8 text-white">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-5 px-5 py-3 text-lg bg-white/30 text-black placeholder-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassWord(e.target.value)}
                    className="w-full mb-5 px-5 py-3 text-lg bg-white/30 text-black placeholder-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
                />


                <div className="flex gap-4">
                    <button className="w-1/2 bg-white text-black py-3 text-lg rounded-xl hover:bg-gray-200 transition" onClick={handleLogin}>
                        Login
                    </button>

                    <button
                        className="w-1/2 bg-transparent border border-white text-white py-3 text-lg rounded-xl hover:bg-white/20 transition"
                        onClick={() => navigate("/SingIn")}
                    >
                        Create Account
                    </button>
                </div>
            </div>

        </div>
    </>
)
} 