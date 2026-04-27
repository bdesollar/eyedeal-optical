import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-7xl font-extrabold text-blue-700 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8">Sorry, we couldn't find what you were looking for.</p>
      <Link to="/" className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">
        Go Home
      </Link>
    </div>
  )
}
