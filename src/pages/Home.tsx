import { Link } from 'react-router-dom'

const services = [
  {
    icon: '👁️',
    title: 'Comprehensive Eye Exams',
    description: 'Thorough vision and health evaluations for all ages.',
  },
  {
    icon: '🕶️',
    title: 'Designer Frames',
    description: 'Hundreds of frames from top brands to fit every style and budget.',
  },
  {
    icon: '🔵',
    title: 'Contact Lens Fittings',
    description: 'Expert fittings for daily, weekly, and specialty contacts.',
  },
  {
    icon: '🛡️',
    title: 'Insurance Accepted',
    description: 'We work with most major vision insurance providers.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            See the World More Clearly
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Premium eye care and designer eyewear — all in one place. Book your exam today and find frames you'll love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg"
            >
              Book an Exam
            </Link>
            <Link
              to="/eyewear"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors text-lg"
            >
              Shop Eyewear
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Eyedeal Optical?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Eye Exam?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Appointments available 6 days a week. Most insurance accepted.
          </p>
          <Link
            to="/book"
            className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg inline-block"
          >
            Schedule Now
          </Link>
        </div>
      </section>
    </>
  )
}
