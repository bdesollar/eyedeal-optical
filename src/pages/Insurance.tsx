const providers = [
  'VSP Vision Care',
  'EyeMed',
  'Davis Vision',
  'Superior Vision',
  'Spectera',
  'BlueCross BlueShield (vision)',
  'Aetna Vision',
  'Cigna Vision',
  'UnitedHealthcare Vision',
  'Humana Vision',
  'Medicare (Part B)',
  'Medicaid',
]

export default function Insurance() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Insurance & Payment</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          We accept most major vision insurance plans and offer flexible payment options.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Accepted Insurance Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <div key={p} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-sm text-gray-700">{p}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Don't see your plan? Call us — we work with many additional providers and can verify your benefits.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Cash & Check', desc: 'Accepted for all services' },
            { label: 'Credit & Debit', desc: 'Visa, Mastercard, Amex, Discover' },
            { label: 'FSA / HSA', desc: 'Flexible spending accounts welcome' },
            { label: 'CareCredit', desc: '0% financing available' },
          ].map(({ label, desc }) => (
            <div key={label} className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-gray-900">{label}</p>
              <p className="text-sm text-gray-600 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
