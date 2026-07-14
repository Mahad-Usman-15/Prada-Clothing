import type { Metadata } from "next"
import Link from "next/link"
import { XCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Checkout Cancelled",
}

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <XCircle className="h-16 w-16 text-gray-400" />
      <h1 className="mt-6 font-serif text-3xl text-gray-900">Checkout cancelled</h1>
      <p className="mt-3 max-w-md text-gray-600">
        No payment was taken. Your cart is exactly as you left it — come back whenever
        you&apos;re ready.
      </p>
      <Link
        href="/shop"
        className="mt-8 border border-black px-8 py-3 text-sm font-semibold uppercase tracking-widest transition hover:bg-black hover:text-white"
      >
        Back to Shop
      </Link>
    </main>
  )
}
