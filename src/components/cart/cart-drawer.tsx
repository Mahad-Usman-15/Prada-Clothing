"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import {
  closeDrawer,
  removeItem,
  setQuantity,
  selectCartItems,
  selectIsDrawerOpen,
  selectSubtotal,
  MAX_LINE_QUANTITY,
} from "@/store/cart-slice"
import { formatPKR } from "@/lib/currency"

export default function CartDrawer() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const isOpen = useSelector(selectIsDrawerOpen)
  const subtotal = useSelector(selectSubtotal)
  const panelRef = useRef<HTMLDivElement>(null)
  const [checkoutState, setCheckoutState] = useState<"idle" | "loading" | "error">("idle")
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeDrawer())
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    panelRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, dispatch])

  const handleCheckout = async () => {
    setCheckoutState("loading")
    setCheckoutError(null)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((line) => ({
            id: line.id,
            quantity: line.quantity,
            size: line.size,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed")
      window.location.assign(data.url)
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : null)
      setCheckoutState("error")
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => dispatch(closeDrawer())}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl outline-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold tracking-wide uppercase">Your Cart</h2>
          <button
            type="button"
            onClick={() => dispatch(closeDrawer())}
            aria-label="Close cart"
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-800">Your cart is empty</p>
            <button
              type="button"
              onClick={() => dispatch(closeDrawer())}
              className="mt-2 border border-black px-6 py-2 text-sm font-medium uppercase tracking-wider transition hover:bg-black hover:text-white"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {items.map((line) => (
                <li key={`${line.id}:${line.size ?? ""}`} className="flex gap-4 py-4">
                  {line.image ? (
                    <Link href={`/shop/${line.slug}`} onClick={() => dispatch(closeDrawer())}>
                      <Image
                        src={line.image}
                        alt={line.name}
                        width={72}
                        height={90}
                        className="h-[90px] w-[72px] rounded object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="flex h-[90px] w-[72px] items-center justify-center rounded bg-gray-100">
                      <ShoppingBag className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="truncate text-sm font-medium text-gray-900">{line.name}</p>
                      {line.size && (
                        <p className="mt-0.5 text-xs text-gray-500">Size: {line.size}</p>
                      )}
                      <p className="mt-0.5 text-sm font-semibold">{formatPKR(line.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded border border-gray-300">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${line.name}`}
                          onClick={() =>
                            dispatch(
                              setQuantity({ id: line.id, size: line.size, quantity: line.quantity - 1 })
                            )
                          }
                          className="p-1.5 text-gray-600 transition hover:bg-gray-100"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${line.name}`}
                          disabled={line.quantity >= MAX_LINE_QUANTITY}
                          onClick={() =>
                            dispatch(
                              setQuantity({ id: line.id, size: line.size, quantity: line.quantity + 1 })
                            )
                          }
                          className="p-1.5 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch(removeItem({ id: line.id, size: line.size }))}
                        className="text-xs text-gray-500 underline-offset-2 transition hover:text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatPKR(line.price * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPKR(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              {checkoutState === "error" && (
                <p className="mb-2 text-sm text-red-600">
                  {checkoutError ?? "Checkout failed. Please try again."}
                </p>
              )}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutState === "loading"}
                className="w-full bg-black py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutState === "loading" ? "Redirecting…" : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
