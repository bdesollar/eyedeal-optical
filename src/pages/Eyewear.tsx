import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../lib/api'
import type { Product } from '../types'

const categories: { value: Product['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'frames', label: 'Frames' },
  { value: 'sunglasses', label: 'Sunglasses' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'accessories', label: 'Accessories' },
]

export default function Eyewear() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = (searchParams.get('category') as Product['category'] | null) ?? 'all'
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getProducts(activeCategory === null || activeCategory === 'all' ? undefined : activeCategory)
      .then(setProducts)
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop Eyewear</h1>

      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSearchParams(value === 'all' ? {} : { category: value })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              (activeCategory ?? 'all') === value
                ? 'bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No products found in this category yet.</p>
          <p className="text-sm mt-2">Check back soon or browse another category.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100">
                {p.image_url && (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{p.brand}</p>
                <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                <p className="text-blue-700 font-bold">${p.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
