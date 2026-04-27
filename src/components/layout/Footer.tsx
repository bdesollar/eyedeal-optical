import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-bold text-white">
              Eyedeal<span className="text-blue-400">Optical</span>
            </span>
            <p className="mt-3 text-sm text-gray-400">
              Clear vision for every moment. Quality eyewear and comprehensive eye care.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Eye Exams</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Contact Lens Fittings</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Frame Consultations</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Vision Therapy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/eyewear?category=frames" className="hover:text-white transition-colors">Frames</Link></li>
              <li><Link to="/eyewear?category=sunglasses" className="hover:text-white transition-colors">Sunglasses</Link></li>
              <li><Link to="/eyewear?category=contacts" className="hover:text-white transition-colors">Contact Lenses</Link></li>
              <li><Link to="/eyewear?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>123 Main Street</li>
              <li>Your City, ST 00000</li>
              <li className="mt-2">
                <a href="tel:+10000000000" className="hover:text-white transition-colors">(000) 000-0000</a>
              </li>
              <li>
                <a href="mailto:info@eyedealoptical.com" className="hover:text-white transition-colors">
                  info@eyedealoptical.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Eyedeal Optical. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
