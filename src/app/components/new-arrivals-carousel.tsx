"use client"
import ProductCard from "@/components/product/product-card"
import type { Product } from "@/lib/types"

export default function NewArrivalsCarousel({ products }: { products: Product[] }) {
  // Duplicated once so the track can translate exactly -50% and loop seamlessly.
  const track = [...products, ...products]

  return (
    <div className="overflow-hidden">
      <div
        className="flex w-max animate-marquee-scroll gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none lg:gap-6"
      >
        {track.map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="w-[45vw] shrink-0 sm:w-56 lg:w-64"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
