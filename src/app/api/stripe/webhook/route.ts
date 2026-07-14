import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import {
  createOrder,
  findOrderByTransactionId,
  type WooOrderLineItem,
} from "@/lib/woocommerce"

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 })
  }
  const stripe = new Stripe(secretKey)

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    // Signature verification requires the raw request body.
    const rawBody = await req.text()
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Webhook signature verification failed:", message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object
  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? session.id

  try {
    // Stripe retries webhooks — skip if this payment already has an order.
    if (await findOrderByTransactionId(transactionId)) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    let cart: [number, number, string][] = []
    try {
      cart = JSON.parse(session.metadata?.cart ?? "[]")
    } catch {
      console.error("Webhook: unparseable cart metadata for session", session.id)
    }
    if (cart.length === 0) {
      console.error("Webhook: empty cart metadata for session", session.id)
      return NextResponse.json({ received: true, warning: "no line items" })
    }

    const line_items: WooOrderLineItem[] = cart.map(([product_id, quantity]) => ({
      product_id,
      quantity,
    }))
    const sizes = cart
      .filter(([, , size]) => size)
      .map(([id, , size]) => `${id}:${size}`)
      .join(",")

    const order = await createOrder({
      payment_method: "stripe",
      payment_method_title: "Stripe (Card)",
      set_paid: true,
      transaction_id: transactionId,
      billing: {
        first_name: session.customer_details?.name ?? "Guest",
        email: session.customer_details?.email ?? "",
      },
      line_items,
      meta_data: [
        { key: "stripe_session_id", value: session.id },
        ...(sizes ? [{ key: "sizes", value: sizes }] : []),
      ],
    })

    console.log(`Webhook: created WooCommerce order #${order.id} for session ${session.id}`)
    return NextResponse.json({ received: true, orderId: order.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Webhook: failed to create WooCommerce order:", message)
    // 500 so Stripe retries the event.
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 })
  }
}
