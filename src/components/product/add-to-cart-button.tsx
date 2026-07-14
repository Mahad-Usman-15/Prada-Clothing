"use client"
import { useDispatch } from "react-redux"
import { addItem } from "@/store/cart-slice"
import type { Product } from "@/lib/types"

type Props = {
  product: Product
  size?: string | null
  requireSize?: boolean
  className?: string
}

export default function AddToCartButton({ product, size = null, requireSize = false, className }: Props) {
  const dispatch = useDispatch()
  const outOfStock = product.stock_status === "outofstock"
  const sizeMissing = requireSize && !size
  const disabled = outOfStock || sizeMissing

  const handleAdd = () => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        image: product.images?.[0]?.src ?? null,
        size,
      })
    )
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className={
        className ??
        "w-full bg-black py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      }
    >
      {outOfStock ? "Out of Stock" : sizeMissing ? "Select a Size" : "Add to Cart"}
    </button>
  )
}
