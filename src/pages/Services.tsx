import { Link } from 'react-router-dom'

const services = [
  {
    title: 'Comprehensive Eye Exams',
    description:
      'Our board-certified optometrists perform thorough evaluations of your vision and eye health, checking for conditions like glaucoma, macular degeneration, and diabetic eye disease.',
    details: ['Visual acuity testing', 'Refraction assessment', 'Eye pressure measurement', 'Retinal evaluation'],
    duration: '45–60 min',
    price: 'Starting at $99',
  },
  {
    title: 'Contact Lens Fittings',
    description:
      'We provide comprehensive contact lens fittings for first-time wearers and those looking to update their prescription or try a new lens type.',
    details: ['Corneal measurements', 'Trial lens fitting', 'Insertion/removal training', 'Follow-up care'],
    duration: '30–45 min',
    price: 'Starting at $75',
  },
  {
    title: 'Frame Consultations',
    description:
      "Work one-on-one with our expert opticians to find the perfect frames that complement your face shape, lifestyle, and prescription needs.",
    details: ['Face shape analysis', 'Prescription optimization', 'Lens type selection', 'Adjustments & repairs'],
    duration: '30 min',
    price: 'Complimentary',
  },
  {
    title: 'Pediatric Eye Care',
    description:
      'Early eye exams are essential for children\'s development. We specialize in making eye care a positive experience for kids of all ages.',
    details: ['Vision screening', 'Lazy eye detection', 'Color vision testing', 'Learning-related vision issues'],
    duration: '30–45 min',
    price: 'Starting at $89',
  },
]

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Comprehensive eye care for the whole family. We combine clinical excellence with a welcoming environment.
        </p>
      </div>

      <div className="space-y-8">
        {services.map((s) => (
          <div key={s.title} className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                <p className="text-gray-600 mb-4">{s.description}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {s.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-700 rounded-full flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:text-right flex-shrink-0">
                <p className="text-sm text-gray-400 mb-1">{s.duration}</p>
                <p className="text-blue-700 font-bold text-lg mb-4">{s.price}</p>
                <Link
                  to="/book"
                  className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors inline-block"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
