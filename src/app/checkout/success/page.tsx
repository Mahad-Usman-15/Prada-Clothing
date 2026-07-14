import type { Metadata } from "next"
import Link from "next/link"
import Stripe from "stripe"
import { CheckCircle2, CircleAlert } from "lucide-react"
import ClearCart from "@/components/cart/clear-cart"
import { formatPKR } from "@/lib/currency"

export const metadata: Metadata = {
  title: "Order Confirmed",
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  // Only show the confirmation (and clear the cart) for a session Stripe
  // verifies as paid — a mistyped or fabricated URL must not fake an order.
  let paid = false
  let email: string | null = null
  let total: number | null = null
  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const session = await stripe.checkout.sessions.retrieve(session_id)
      if (session.payment_status === "paid") {
        paid = true
        email = session.customer_details?.email ?? null
        total = session.amount_total !== null ? session.amount_total / 100 : null
      }
    } catch {
      // Session lookup failed — treat as unverified below.
    }
  }

  if (!paid) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <CircleAlert className="h-16 w-16 text-amber-500" />
        <h1 className="mt-6 font-serif text-3xl text-gray-900">
          We couldn&apos;t confirm your payment
        </h1>
        <p className="mt-3 max-w-md text-gray-600">
          This order couldn&apos;t be verified. If you just completed a payment,
          check your email for a receipt — otherwise your cart is untouched and
          you can try again.
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

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <ClearCart />
      <CheckCircle2 className="h-16 w-16 text-emerald-600" />
      <h1 className="mt-6 font-serif text-3xl text-gray-900">Thank you for your order!</h1>
      <p className="mt-3 max-w-md text-gray-600">
        Your payment was successful and your order has been placed.
        {email && (
          <>
            {" "}
            A confirmation has been sent to <span className="font-medium">{email}</span>.
          </>
        )}
      </p>
      {total !== null && (
        <p className="mt-4 text-lg font-semibold">Total paid: {formatPKR(total)}</p>
      )}
      <Link
        href="/shop"
        className="mt-8 border border-black px-8 py-3 text-sm font-semibold uppercase tracking-widest transition hover:bg-black hover:text-white"
      >
        Continue Shopping
      </Link>
    </main>
  )
}
