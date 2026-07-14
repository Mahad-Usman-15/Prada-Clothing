"use client"
import { useState } from "react"
import AddToCartButton from "./add-to-cart-button"
import type { Product } from "@/lib/types"

export default function ProductActions({ product }: { product: Product }) {
  const sizes =
    product.attributes?.find((attr) => attr.name.toLowerCase() === "size")?.options ?? []
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-900">
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                aria-pressed={size === selectedSize}
                className={`flex h-11 min-w-11 items-center justify-center border px-3 text-sm transition ${
                  size === selectedSize
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-800 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      <AddToCartButton
        product={product}
        size={selectedSize}
        requireSize={sizes.length > 0}
      />
    </div>
  )
}
