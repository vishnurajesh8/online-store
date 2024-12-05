import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For displaying any error messages

  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before making request

    try {
      // Sending POST request to Django API
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle if response is not OK (failed login)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      // Handle successful login
      const data = await response.json();
      localStorage.setItem("token", data.access); 
      navigate('/')
    } catch (err) {
      setError(err.message); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 animate-fade-in">
          Login
        </h2>
        {error && (
          <div className="text-red-500 text-center mb-4">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="animate-slide-in">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="animate-slide-in">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 animate-bounce-once"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm text-gray-600 animate-fade-in">
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
          <a href="#" className="hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
