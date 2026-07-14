import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getProductsByIds } from "@/lib/woocommerce"

type CheckoutItem = { id: number; quantity: number; size: string | null }

const MAX_ITEMS = 50
const MAX_QUANTITY = 20

function parseItems(body: unknown): CheckoutItem[] | null {
  if (typeof body !== "object" || body === null) return null
  const items = (body as { items?: unknown }).items
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) return null
  const parsed: CheckoutItem[] = []
  for (const raw of items) {
    if (typeof raw !== "object" || raw === null) return null
    const { id, quantity, size } = raw as Record<string, unknown>
    if (!Number.isInteger(id) || (id as number) <= 0) return null
    if (!Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > MAX_QUANTITY)
      return null
    if (size !== null && typeof size !== "string") return null
    parsed.push({ id: id as number, quantity: quantity as number, size: (size as string | null) ?? null })
  }
  return parsed
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const items = parseItems(await req.json().catch(() => null))
    if (!items) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 })
    }

    // Server-side price verification: never trust prices from the client.
    const products = await getProductsByIds(
      items.map((item) => item.id),
      { fresh: true }
    )
    const productById = new Map(products.map((p) => [p.id, p]))

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    for (const item of items) {
      const product = productById.get(item.id)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 404 })
      }
      if (product.stock_status === "outofstock") {
        return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 409 })
      }
      // When WooCommerce tracks inventory for this product, don't sell more
      // than what's left — two carts racing for the last unit both pass the
      // stock_status check, but only one passes this one after Woo decrements.
      if (
        product.manage_stock &&
        typeof product.stock_quantity === "number" &&
        item.quantity > product.stock_quantity
      ) {
        return NextResponse.json(
          {
            error:
              product.stock_quantity <= 0
                ? `${product.name} is out of stock`
                : `Only ${product.stock_quantity} of ${product.name} left in stock`,
          },
          { status: 409 }
        )
      }
      const unitAmount = Math.round(Number(product.price) * 100)
      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        return NextResponse.json({ error: `${product.name} has no valid price` }, { status: 409 })
      }
      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.size ? `${product.name} — ${item.size}` : product.name,
            images: product.images?.[0]?.src ? [product.images[0].src] : [],
          },
          unit_amount: unitAmount,
        },
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    // Compact cart encoding for the webhook: [[id, qty, size], ...]
    const cartMeta = JSON.stringify(items.map((i) => [i.id, i.quantity, i.size ?? ""]))
    if (cartMeta.length > 500) {
      return NextResponse.json(
        { error: "Cart has too many distinct items for checkout" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: { cart: cartMeta },
    })

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 502 })
    }
    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Checkout error:", message)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
