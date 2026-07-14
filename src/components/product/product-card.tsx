"use client"
import Image from "next/image"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { ShoppingBag } from "lucide-react"
import { addItem } from "@/store/cart-slice"
import { formatPKR } from "@/lib/currency"
import type { Product } from "@/lib/types"

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch()
  const primary = product.images?.[0]?.src
  const secondary = product.images?.[1]?.src
  const onSale = product.on_sale && product.regular_price && product.regular_price !== product.price
  const outOfStock = product.stock_status === "outofstock"

  const quickAdd = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        image: primary ?? null,
        size: null,
      })
    )
  }

  return (
    <div className="group relative">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {primary ? (
            <>
              <Image
                src={primary}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover object-center transition-all duration-500 ${
                  secondary ? "group-hover:opacity-0" : "group-hover:scale-105"
                }`}
              />
              {secondary && (
                <Image
                  src={secondary}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
          )}
          {onSale && (
            <span className="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              Sale
            </span>
          )}
          {outOfStock && (
            <span className="absolute left-3 top-3 bg-gray-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              Sold Out
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1 text-center">
          <h3 className="truncate text-sm font-medium text-gray-900">{product.name}</h3>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="font-semibold">{formatPKR(product.price)}</span>
            {onSale && (
              <span className="text-gray-400 line-through">{formatPKR(product.regular_price)}</span>
            )}
          </div>
        </div>
      </Link>
      {!outOfStock && (
        <button
          type="button"
          onClick={quickAdd}
          className="absolute inset-x-3 bottom-[72px] translate-y-2 bg-white/95 py-2.5 text-xs font-semibold uppercase tracking-widest opacity-0 shadow transition-all duration-300 hover:bg-black hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
        >
          Add to Cart
        </button>
      )}
    </div>
  )
}
