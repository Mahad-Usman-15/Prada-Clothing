import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/woocommerce"
import { getAllBlogs } from "@/lib/blog"
import { SITE_URL as BASE_URL } from "@/lib/site-url"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs] = await Promise.all([
    getProducts().catch(() => []),
    getAllBlogs().catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/blogs",
    "/faqs",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/shop/${product.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.slug.current}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
