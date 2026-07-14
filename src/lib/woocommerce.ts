import "server-only"
import type { Category, Product, Tag } from "./types"

const FEATURED_CATEGORY_SLUGS = [
  "boy-clothing",
  "clothing",
  "girl-clothing",
  "men-clothing",
  "women-clothing",
] as const

const FEATURED_TAG_NAMES = [
  "Trendy Wear",
  "Best Seller",
  "Shop Now",
  "Fashion For All",
] as const

// The storefront is currently restricted to only this category's products —
// every product-reading function below filters down to it, so no other
// WooCommerce category is reachable via the site (shop, home, direct URL, or checkout).
const STORE_CATEGORY_SLUG = "clothing"

function inStoreCategory(product: Product): boolean {
  return product.categories?.some((c) => c.slug === STORE_CATEGORY_SLUG) ?? false
}

const WOO_URL =
  process.env.WOOCOMMERCE_URL ??
  "https://blanchedalmond-spider-395289.hostingersite.com"

function authHeader(): string {
  const key =
    process.env.WOOCOMMERCE_CONSUMER_KEY ??
    process.env.WORDPRESS_CONSUMERAPI_kEY
  const secret =
    process.env.WOOCOMMERCE_CONSUMER_SECRET ??
    process.env.WORDPRESS_SECRETAPI_kEY
  if (!key || !secret) {
    throw new Error(
      "WooCommerce credentials missing: set WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET"
    )
  }
  return `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`
}

async function wcFetch<T>(
  path: string,
  params: Record<string, string> = {},
  init?: RequestInit
): Promise<T> {
  const url = new URL(`/wp-json/wc/v3/${path}`, WOO_URL)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  // The WooCommerce host is occasionally slow to accept connections; retry
  // idempotent reads so builds and ISR revalidation survive transient failures.
  const isRead = !init?.method || init.method === "GET"
  const attempts = isRead ? 3 : 1
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        ...init,
        headers: {
          Authorization: authHeader(),
          "Content-Type": "application/json",
          ...init?.headers,
        },
      })
      if (!res.ok) {
        const body = await res.text().catch(() => "")
        const error = new Error(
          `WooCommerce ${path} failed (${res.status}): ${body.slice(0, 200)}`
        )
        if (isRead && res.status >= 500 && attempt < attempts) {
          lastError = error
        } else {
          throw error
        }
      } else {
        return (await res.json()) as T
      }
    } catch (error) {
      if (!isRead || attempt === attempts) throw error
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
  }
  throw lastError
}

async function getStoreCategoryId(): Promise<number | null> {
  const categories = await wcFetch<Category[]>("products/categories", {
    slug: STORE_CATEGORY_SLUG,
  })
  return categories[0]?.id ?? null
}

export async function getProducts(opts?: {
  category?: number
  perPage?: number
  page?: number
  search?: string
}): Promise<Product[]> {
  const params: Record<string, string> = {
    per_page: String(opts?.perPage ?? 100),
    status: "publish",
  }
  // Filter at the WooCommerce API level (not just client-side after fetch),
  // so a small `perPage` doesn't truncate the result before the category filter runs.
  const categoryId = opts?.category ?? (await getStoreCategoryId())
  if (categoryId) params.category = String(categoryId)
  if (opts?.page) params.page = String(opts.page)
  if (opts?.search) params.search = opts.search
  const products = await wcFetch<Product[]>("products", params)
  return products.filter(inStoreCategory)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await wcFetch<Product[]>("products", { slug })
  const product = products[0]
  return product && inStoreCategory(product) ? product : null
}

export async function getProductsByIds(
  ids: number[],
  opts?: { fresh?: boolean }
): Promise<Product[]> {
  if (ids.length === 0) return []
  const products = await wcFetch<Product[]>(
    "products",
    {
      include: ids.join(","),
      per_page: String(ids.length),
    },
    // Checkout re-verifies prices and stock; a 5-minute-stale cached read
    // would defeat that, so callers can force a fresh fetch.
    opts?.fresh ? { cache: "no-store", next: undefined } : undefined
  )
  return products.filter(inStoreCategory)
}

export async function getCategories(): Promise<Category[]> {
  const categories = await wcFetch<Category[]>("products/categories", {
    per_page: "50",
    hide_empty: "true",
  })
  return categories.filter((c) => (FEATURED_CATEGORY_SLUGS as readonly string[]).includes(c.slug))
}

export async function getTags(): Promise<Tag[]> {
  const tags = await wcFetch<Tag[]>("products/tags", { per_page: "50", hide_empty: "true" })
  return tags.filter((t) => (FEATURED_TAG_NAMES as readonly string[]).includes(t.name))
}

export type WooOrderLineItem = {
  product_id: number
  quantity: number
}

export type WooOrderPayload = {
  payment_method: string
  payment_method_title: string
  set_paid: boolean
  transaction_id: string
  billing: {
    first_name: string
    email: string
  }
  line_items: WooOrderLineItem[]
  meta_data: { key: string; value: string }[]
}

export async function createOrder(
  payload: WooOrderPayload
): Promise<{ id: number }> {
  return wcFetch<{ id: number }>(
    "orders",
    {},
    {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
      next: undefined,
    }
  )
}

export async function findOrderByTransactionId(
  transactionId: string
): Promise<boolean> {
  const orders = await wcFetch<{ id: number; transaction_id: string }[]>(
    "orders",
    { search: transactionId, per_page: "10" },
    { cache: "no-store", next: undefined }
  )
  return orders.some((o) => o.transaction_id === transactionId)
}
