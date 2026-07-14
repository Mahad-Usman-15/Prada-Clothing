import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductBySlug, getProducts } from "@/lib/woocommerce"
import { formatPKR } from "@/lib/currency"
import ProductActions from "@/components/product/product-actions"
import ProductCard from "@/components/product/product-card"

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const products = await getProducts({ perPage: 24 })
    // Prerender only the first page of products to keep build-time load on the
    // WooCommerce host low; the rest are rendered on demand and cached by ISR.
    return products.map((product) => ({ slug: product.slug }))
  } catch {
    // WooCommerce unreachable at build time — render on demand instead
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
  if (!product) return { title: "Product not found" }
  const description = product.short_description
    .replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 160)
  return {
    title: product.name,
    description: description || `Buy ${product.name} online.`,
    openGraph: {
      title: product.name,
      description: description || `Buy ${product.name} online.`,
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = (await getProducts({ perPage: 8 }).catch(() => []))
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          {product.images.length > 0 ? (
            product.images.slice(0, 4).map((image, i) => (
              <div key={image.id} className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                  src={image.src}
                  alt={image.alt || product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={i === 0}
                  className="object-cover object-center"
                />
              </div>
            ))
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-gray-100 text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* Info */}
        <div className="self-start lg:sticky lg:top-24">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs uppercase tracking-widest text-gray-400">
            Shop {product.categories?.[0] ? `/ ${product.categories[0].name}` : ""}
          </nav>
          <h1 className="font-serif text-3xl text-gray-900 lg:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl font-semibold">{formatPKR(product.price)}</span>
            {product.on_sale && product.regular_price !== product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPKR(product.regular_price)}
              </span>
            )}
          </div>
          {product.stock_status === "instock" && (
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-emerald-700">
              In stock
            </p>
          )}

          <div className="mt-8">
            <ProductActions product={product} />
          </div>

          {(product.short_description || product.description) && (
            <div className="mt-10 border-t border-gray-200 pt-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-900">
                Details
              </h2>
              <div
                className="prose-sm max-w-none leading-relaxed text-gray-600 [&_p]:mb-3"
                dangerouslySetInnerHTML={{
                  __html: product.description || product.short_description,
                }}
              />
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-center font-serif text-2xl text-gray-900">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
