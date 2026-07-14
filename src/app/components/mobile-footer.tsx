"use client"
import Link from "next/link"
import { House, Store, ShoppingBag } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { openDrawer, selectCartCount } from "@/store/cart-slice"

const navItems = [
  { icon: House, label: "Home", href: "/" },
  { icon: Store, label: "Shop", href: "/shop" },
]

export default function Mobilefooter() {
  const dispatch = useDispatch()
  const count = useSelector(selectCartCount)

  return (
    <nav
      aria-label="Mobile navigation"
      className="sticky bottom-0 z-40 flex w-full items-center justify-around border-t border-gray-200 bg-white px-2 py-2 md:hidden"
    >
      {navItems.map(({ icon: Icon, label, href }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 transition-colors hover:text-gray-900"
        >
          <Icon className="h-5 w-5" aria-hidden />
          <span className="text-xs font-medium">{label}</span>
        </Link>
      ))}

      <button
        type="button"
        onClick={() => dispatch(openDrawer())}
        className="relative flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 transition-colors hover:text-gray-900"
      >
        <span className="relative">
          <ShoppingBag className="h-5 w-5" aria-hidden />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </span>
        <span className="text-xs font-medium">Cart</span>
      </button>
    </nav>
  )
}
