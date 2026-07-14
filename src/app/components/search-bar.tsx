"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import searchicon from "../images/searchicon.png"
import { RxCross2 } from "react-icons/rx"
import { Search, ShoppingBag } from "lucide-react"
import { formatPKR } from "@/lib/currency"

type SearchProduct = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  on_sale: boolean
  image: string | null
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [results, setResults] = useState<SearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) return

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data.products ?? [])
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`)
      setIsActive(false)
      setSearchQuery("")
    }
  }

  const toggleSearch = () => setIsActive(!isActive)
  const closeSearch = () => {
    setIsActive(false)
    setSearchQuery("")
  }

  return (
    <div className="w-full">
      <div className="relative group">
        <button type="button" onClick={toggleSearch} aria-label="Open search" className="hidden relative bg-[#F0F0F0] p-3 rounded-2xl lg:flex justify-between items-center gap-2">
          <span className="text-lg text-gray-800">Search here</span>
          <Image src={searchicon} alt="" />
        </button>
        <button type="button" className="lg:hidden" onClick={toggleSearch} aria-label="Open search">
          <Search />
        </button>

        <div className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-300 ease-in-out ${isActive ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
            onClick={toggleSearch}
          />
          <div className={`relative z-10 mx-auto w-full max-w-2xl px-4 transition-all duration-300 transform ${isActive ? "translate-y-0" : "-translate-y-8"}`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-16 px-6 pr-16 text-lg rounded-lg bg-white mt-5 border-2 border-gray-200 focus:border-gray-400 outline-none shadow-xl transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  aria-label="Close search"
                >
                  <RxCross2 className="h-6 w-6" />
                </button>
              </div>
            </form>

            {searchQuery.trim().length >= 2 && (
              <div className="mt-2 max-h-[70vh] overflow-y-auto rounded-lg bg-white shadow-xl">
                {isLoading ? (
                  <div className="divide-y divide-gray-100">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex animate-pulse items-center gap-3 p-3">
                        <div className="h-[60px] w-[48px] shrink-0 rounded bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 rounded bg-gray-200" />
                          <div className="h-3 w-1/4 rounded bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/shop/${product.slug}`}
                          onClick={closeSearch}
                          className="flex items-center gap-3 p-3 transition hover:bg-gray-50"
                        >
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={60}
                              className="h-[60px] w-[48px] shrink-0 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-[60px] w-[48px] shrink-0 items-center justify-center rounded bg-gray-100">
                              <ShoppingBag className="h-5 w-5 text-gray-300" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2 text-sm">
                              <span className="font-semibold">{formatPKR(product.price)}</span>
                              {product.on_sale && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPKR(product.regular_price)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-center text-sm text-gray-500">
                    No products found for &quot;{searchQuery.trim()}&quot;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
