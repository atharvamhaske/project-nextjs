export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">MediaUploader</h3>
        <p className="text-gray-600 mb-6">
          The ultimate platform for sharing your media files
        </p>
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
        </div>
        <div className="text-sm text-gray-500">
          Made with ❤️ by{" "}
          <a 
            href="https://github.com/atharvamhaske" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Atharva Mhaske
          </a>
        </div>
      </div>
    </footer>
  );
} 