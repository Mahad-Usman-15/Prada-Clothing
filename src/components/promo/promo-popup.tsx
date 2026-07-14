"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { useSelector } from "react-redux"
import { selectIsDrawerOpen } from "@/store/cart-slice"
import promoImage from "../../app/images/landing4.png"

const DISMISS_KEY = "promo-popup-dismissed"

export default function PromoPopup() {
  const [ready, setReady] = useState(false)
  const isDrawerOpen = useSelector(selectIsDrawerOpen)
  // Never cover the cart drawer — if the timer fires while the drawer is
  // open, the popup simply waits and appears once the drawer closes.
  const open = ready && !isDrawerOpen

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return
    const timer = setTimeout(() => setReady(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    setReady(false)
    sessionStorage.setItem(DISMISS_KEY, "1")
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className="fixed inset-0 z-[80] bg-black/60 transition-opacity duration-300"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Promotional offer"
        className="fixed left-1/2 top-1/2 z-[90] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1 text-gray-700 transition hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>
        <Link href="/shop" onClick={close} className="block">
          <div className="relative aspect-[4/3] w-full bg-gray-100">
            <Image src={promoImage} alt="" fill className="object-cover" />
          </div>
          <div className="p-6 text-center">
            <h2 className="font-serif text-2xl text-gray-900">50% OFF</h2>
            <p className="mt-2 text-sm text-gray-600">
              For a limited time — shop the sale now.
            </p>
            <span className="mt-4 inline-block bg-black px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </>
  )
}
