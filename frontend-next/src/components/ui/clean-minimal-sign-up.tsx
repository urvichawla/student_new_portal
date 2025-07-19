"use client";

import * as React from "react";
import { useState } from "react";
import { LogIn, Lock, Mail, User } from "lucide-react";

const SignUp2 = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

  // Only allow @gmail.com emails
  const validateEmail = (email: string) => {
    return /^[^@\s]+@gmail\.com$/.test(email);
  };

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      setError("Please enter username, email, and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid Gmail address (something@gmail.com).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        setError(data.error || data.message || "Registration failed.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white rounded-xl z-20 relative">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-opacity-5">
          <LogIn className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Create your account
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Register to access the Students Portal.
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-4 h-4" />
            </span>
            <input
              placeholder="Username"
              type="text"
              value={username}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xs select-none"></span>
          </div>
          <div className="w-full flex justify-end">
            {error && (
              <div className="text-sm text-red-500 text-left">{error}</div>
            )}
            {success && (
              <div className="text-sm text-green-600 text-left">Registration successful! Redirecting...</div>
            )}
          </div>
        </div>
        <button
          onClick={handleSignUp}
          className="w-full bg-gradient-to-b from-blue-600 to-blue-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Already have an account?</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <a
            href="/sign-in"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export { SignUp2 }; 