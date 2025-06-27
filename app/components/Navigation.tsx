import Link from "next/link";

interface NavigationProps {
  isAuthenticated?: boolean;
  userEmail?: string | null;
  onLogout?: () => void;
}

export default function Navigation({ isAuthenticated = false, userEmail, onLogout }: NavigationProps) {
  return (
    <nav className={`${isAuthenticated ? 'bg-white shadow-sm border-b border-gray-200' : 'bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50'}`}>
      <div className=" max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediaUploader
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Welcome, {userEmail || 'User'}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 