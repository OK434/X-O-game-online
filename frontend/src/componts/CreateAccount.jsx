import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [userName, setuserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    // تنظيف المدخلات
    const email = enteredEmail.trim();
    const password = enteredPassword.trim();
    const confirm = confirmPassword.trim();
    const name = userName.trim();

    // validation
    if (!email || !password || !confirm || !name) {
      return setError("Please fill all fields");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Invalid email format");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userName: name,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        // في حال السيرفر رجع response بدون JSON
      }

      if (!response.ok) {
        return setError(data.message || "Signup failed");
      }

      console.log("Signup success:", data);

      // انتقال بعد النجاح
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center from-blue-400 to-purple-500">

      <div className="bg-white/20 p-12 rounded-3xl shadow-2xl w-full max-w-xl border border-white/30 backdrop-blur-md">

        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setuserName(e.target.value)}
          className="w-full mb-7 px-5 py-3 text-lg bg-white/30 text-white placeholder-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={enteredEmail}
          onChange={(e) => setEnteredEmail(e.target.value)}
          className="w-full mb-5 px-5 py-3 text-lg bg-white/30 text-white placeholder-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
          className="w-full mb-5 px-5 py-3 text-lg bg-white/30 text-white placeholder-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-5 px-5 py-3 text-lg bg-white/30 text-white placeholder-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
        />

        {error && (
          <p className="text-red-300 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-1/2 bg-white text-black py-3 text-lg rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-1/2 bg-transparent border border-white text-white py-3 text-lg rounded-xl hover:bg-white/20 transition"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
} 