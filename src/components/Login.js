"use client";

import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error("Login error:", error.message);
    } else {
      alert("Check your email for the login link!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-80">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition duration-200"
      >
        Send Login Link
      </button>
    </div>
  );
}
