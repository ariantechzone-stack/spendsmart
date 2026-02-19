import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] flex flex-col items-center justify-center text-[#1a1a2e]">
      <p className="font-display text-9xl text-green-500 mb-2">404</p>
      <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
      <p className="text-gray-400 mb-8 text-sm">This page doesn't exist.</p>
      <Link
        to="/dashboard"
        className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d2d4e] transition"
      >
        ← Back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
