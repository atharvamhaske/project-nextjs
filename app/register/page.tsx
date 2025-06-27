"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";

const Register: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      if (!email || !password || !confirmPassword) {
        setErrorMessage("All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Registration failed.");
        }
        setSuccessMessage("Registration successful! Redirecting to login…");
        setTimeout(() => router.push("/login"), 1500);
      } catch (err: any) {
        setErrorMessage(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, confirmPassword, router]
  );

  return (
    <div className="min-h-screen flex flex-col  bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* <span className=" flex justify-start ml-20 mt-10 items-center  from-purple-400/40 to-blue-500/20 font-bold text-6xl max-w-md p-2 tracking-wide text-gray-900/90 ">Welcome To MediaBank</span> */}
      {/* Left: Registration Form */}
      <div className="w-full md:w-2/5 flex-row items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg  rounded-xl mt-5 h-screen p-8 md:p-10">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-2 text-blue-700">Create Account</h1>
          <p className="text-gray-500 mb-6 text-xl">Sign up to get started!</p>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xl font-semibold mb-1 text-blue-700">Email</label>
              <input
                id="email"
                type="email"
                className="mt-1 block w-full border h-12 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                placeholder="xyz@abc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xl font-semibold mb-1 text-blue-700">Password</label>
              <input
                id="password"
                type="password"
                className="mt-1 block w-full h-12 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2  focus:border-blue-400 transition placeholder-gray-400 "
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xl font-semibold mb-1 text-blue-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="mt-1 block w-full border h-12 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2  focus:border-blue-400 transition placeholder-gray-400"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {isLoading ? "Registering…" : "Register"}
            </button>
          </form>
          <p className="mt-6 text-m text-left text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-semibold transition-colors">
              Login
            </a>
          </p>
        </div>
      </div>
      {/* Right: Placeholder for images/text */}
      
    </div>
  );
};

export default Register;