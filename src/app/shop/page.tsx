import type { Metadata } from "next"
import { getCategories, getProducts, getTags } from "@/lib/woocommerce"
import ProductGridWithFilters from "@/components/shop/product-grid-with-filters"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of premium clothing.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const [products, categories, tags] = await Promise.all([
    getProducts(),
    getCategories(),
    getTags(),
  ])

  return (
    <main>
      <section className="border-b border-gray-200 bg-[#FAF7F2] px-4 py-12 text-center">
        <h1 className="font-serif text-4xl tracking-wide text-gray-900">Shop</h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">
          The Full Collection
        </p>
      </section>
      <ProductGridWithFilters
        products={products}
        categories={categories}
        tags={tags}
        initialQuery={q ?? ""}
      />
    </main>
  )
}
