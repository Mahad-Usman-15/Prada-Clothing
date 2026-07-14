"use client"
import { useMemo, useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import ProductCard from "@/components/product/product-card"
import { formatPKR } from "@/lib/currency"
import type { Category, Product, Tag } from "@/lib/types"

type Props = {
  products: Product[]
  categories: Category[]
  tags: Tag[]
  initialQuery?: string
}

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

export default function ProductGridWithFilters({ products, categories, tags, initialQuery = "" }: Props) {
  const maxPrice = useMemo(
    () => Math.max(1000, ...products.map((p) => Math.ceil(Number(p.price) || 0))),
    [products]
  )
  const [query, setQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [priceCap, setPriceCap] = useState<number>(maxPrice)
  const [sort, setSort] = useState<SortOption>("featured")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggle = (list: number[], id: number) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

  const clearAll = () => {
    setQuery("")
    setSelectedCategories([])
    setSelectedTags([])
    setPriceCap(maxPrice)
    setSort("featured")
  }

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      if (query && !product.name.toLowerCase().includes(query.toLowerCase())) return false
      if (
        selectedCategories.length > 0 &&
        !product.categories?.some((c) => selectedCategories.includes(c.id))
      )
        return false
      if (selectedTags.length > 0 && !product.tags?.some((t) => selectedTags.includes(t.id)))
        return false
      if (Number(product.price) > priceCap) return false
      return true
    })
    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "price-desc":
        result = [...result].sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name))
        break
    }
    return result
  }, [products, query, selectedCategories, selectedTags, priceCap, sort])

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <label htmlFor="shop-search" className="text-xs font-semibold uppercase tracking-widest text-gray-900">
          Search
        </label>
        <input
          id="shop-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="mt-2 w-full border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
        />
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900">Categories</h3>
        <ul className="mt-3 space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => setSelectedCategories((prev) => toggle(prev, cat.id))}
                  className="h-4 w-4 accent-black"
                />
                {cat.name}
                <span className="ml-auto text-xs text-gray-400">{cat.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {tags.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900">Tags</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTags((prev) => toggle(prev, tag.id))}
                className={`border px-3 py-1 text-xs transition ${
                  selectedTags.includes(tag.id)
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-600 hover:border-black"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900">Max Price</h3>
        <input
          type="range"
          min={0}
          max={maxPrice}
          value={priceCap}
          onChange={(e) => setPriceCap(Number(e.target.value))}
          className="mt-3 w-full accent-black"
          aria-label="Maximum price"
        />
        <p className="mt-1 text-sm text-gray-600">{formatPKR(priceCap)}</p>
      </div>

      <button
        type="button"
        onClick={clearAll}
        className="text-xs font-semibold uppercase tracking-widest text-gray-500 underline-offset-4 hover:text-black hover:underline"
      >
        Clear all
      </button>
    </div>
  )

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-10 px-4 py-8 sm:px-6">
      {/* Desktop filters */}
      <aside className="hidden w-64 shrink-0 lg:block">{filterPanel}</aside>

      {/* Mobile filter sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <p className="hidden text-sm text-gray-500 lg:block">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort products"
            className="border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-medium text-gray-800">No products match your filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 text-sm text-gray-500 underline underline-offset-4 hover:text-black"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
