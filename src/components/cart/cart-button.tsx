"use client"
import { useDispatch, useSelector } from "react-redux"
import { ShoppingCart } from "lucide-react"
import { openDrawer, selectCartCount } from "@/store/cart-slice"

export default function CartButton() {
  const dispatch = useDispatch()
  const count = useSelector(selectCartCount)
  return (
    <button
      type="button"
      onClick={() => dispatch(openDrawer())}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative cursor-pointer p-1"
    >
      <ShoppingCart size={26} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  )
}
