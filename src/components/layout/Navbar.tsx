import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import CallOrContactLink from '../CallOrContactLink'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Eyewear', to: '/eyewear' },
  { label: 'Services', to: '/services' },
  { label: 'Visit info', to: '/#contact' },
  { label: 'Insurance', to: '/insurance' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-700 tracking-tight">
              Eyedeal<span className="text-gray-800">Optical</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <CallOrContactLink
              className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Call us
            </CallOrContactLink>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className="block text-sm font-medium text-gray-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <CallOrContactLink
            className="block w-full text-center bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Call us
          </CallOrContactLink>
        </div>
      )}
    </header>
  )
}
