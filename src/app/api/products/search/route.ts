import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/woocommerce"

const MAX_RESULTS = 6

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (q.length < 2) return NextResponse.json({ products: [] })
  try {
    const products = await getProducts({ search: q, perPage: MAX_RESULTS })
    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        regular_price: p.regular_price,
        on_sale: p.on_sale,
        image: p.images?.[0]?.src ?? null,
      })),
    })
  } catch (error) {
    console.error("Product search error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
