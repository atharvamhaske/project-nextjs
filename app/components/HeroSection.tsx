import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative min-h-[70vh] flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden justify-center">
      {/* Main Hero Content */}
      <main className="flex flex-1 flex-col-reverse md:flex-row items-center justify-between px-8 py-12 md:py-0 max-w-7xl mx-auto w-full">
        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-6">
          <span className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm mb-2">Your Media Journey Starts Here</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            <span>Your </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Personal</span>
            <span> Guide To </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Media</span>
          </h1>
          <p className="text-md text-gray-600 mb-6 max-w-xl">
            Upload, manage, and share your images and videos with ease. Fast, secure, and reliable file uploads for creators, teams, and businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-base font-semibold transition-colors shadow">
              Your Personal Media
            </Link>
            <Link href="/login" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg text-base font-semibold transition-colors shadow">
              Sign In
            </Link>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
          {/* SVG Illustration: Cloud Upload */}
          <svg width="450" height="450" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="175" cy="300" rx="120" ry="30" fill="#ede9fe" />
            <path d="M110 220c-30 0-50-20-50-50 0-25 20-45 45-49 5-40 40-71 80-71 35 0 65 23 76 55 1-.1 2-.1 3-.1 28 0 51 23 51 51 0 28-23 51-51 51H110z" fill="#a5b4fc" />
            <rect x="150" y="140" width="50" height="80" rx="10" fill="#6366f1" />
            <rect x="170" y="120" width="10" height="60" rx="5" fill="#818cf8" />
            <path d="M175 120v-30m0 0l-15 15m15-15l15 15" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </main>
    </div>
  );
} 