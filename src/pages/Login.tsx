import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import api from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!email.endsWith("@wiu.edu")) {
      setError("Only WIU email addresses are allowed.");
      return;
    }

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.user.email);

      setError("");
      navigate("/home");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.error || "Login failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.endsWith("@wiu.edu")) {
      alert("Only WIU email addresses are allowed.");
      return;
    }
    console.log("Sending password reset email to:", forgotEmail);
    alert("If this email is registered, you will receive a reset link.");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your WIU email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>

        {/* Forgot Password Modal */}
        <Dialog>
          <DialogTrigger className="text-blue-500 mt-2 underline block text-center">
            Forgot Password?
          </DialogTrigger>
          <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <DialogTitle className="text-lg font-bold">
              Reset Password
            </DialogTitle>
            <input
              type="email"
              placeholder="Enter your WIU email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-3"
            >
              Submit
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Login;
