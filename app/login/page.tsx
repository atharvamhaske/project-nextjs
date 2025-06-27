"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn("github", { callbackUrl: "/" });
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl px-4 py-12">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 text-blue-700 text-center">Sign In</h1>
          <p className="text-gray-500 mb-6 text-lg text-center">Welcome back! Please login to your account.</p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded w-full text-center">
              {error}
            </div>
          )}
          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-base font-semibold mb-1 text-blue-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border h-12 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-semibold mb-1 text-blue-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full h-12 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <p className="mt-6 text-m text-center text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-semibold transition-colors">
              Register
            </Link>
          </p>
        </div>
        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 justify-center items-center">
          <svg width="350" height="350" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="175" cy="300" rx="120" ry="30" fill="#ede9fe" />
            <path d="M110 220c-30 0-50-20-50-50 0-25 20-45 45-49 5-40 40-71 80-71 35 0 65 23 76 55 1-.1 2-.1 3-.1 28 0 51 23 51 51 0 28-23 51-51 51H110z" fill="#a5b4fc" />
            <rect x="150" y="140" width="50" height="80" rx="10" fill="#6366f1" />
            <rect x="170" y="120" width="10" height="60" rx="5" fill="#818cf8" />
            <path d="M175 120v-30m0 0l-15 15m15-15l15 15" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
