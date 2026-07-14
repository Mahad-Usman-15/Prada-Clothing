import Image from "next/image"
import Link from "next/link"
import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react"
import HeroCarousel from "./components/hero-carousel"
import NewArrivalsCarousel from "./components/new-arrivals-carousel"
import { getCategories, getProducts } from "@/lib/woocommerce"
import { getAllBlogs } from "@/lib/blog"
import type { Blog, Category, Product } from "@/lib/types"
import editorial from "./images/bigbanner1.png"

export const revalidate = 300

const features = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast shipping to every city in Pakistan, on every order.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Changed your mind? Return or exchange within 14 days.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Your payment is encrypted and processed by Stripe.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description: "Questions about fit or fabric? We reply within a day.",
  },
]

export default async function Home() {
  const [products, categories, blogs] = await Promise.all([
    getProducts({ perPage: 12 }).catch((): Product[] => []),
    getCategories().catch((): Category[] => []),
    getAllBlogs().catch((): Blog[] => []),
  ])

  const newArrivals = products.slice(0, 6)
  const featuredCategories = categories.filter((c) => c.image?.src).slice(0, 3)
  const journal = blogs.slice(0, 3)

  return (
    <main>
      <HeroCarousel />

      {featuredCategories.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Find your fit across our signature collections.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href="/shop"
                className="group relative aspect-[4/5] overflow-hidden bg-gray-100"
              >
                {category.image?.src && (
                  <Image
                    src={category.image.src}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-2xl">{category.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/80">
                    {category.count} {category.count === 1 ? "style" : "styles"} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl">
                  New Arrivals
                </h2>
                <p className="mt-3 text-sm text-gray-500">
                  Fresh from the atelier — the latest additions to the collection.
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden text-xs font-semibold uppercase tracking-widest text-gray-900 underline-offset-4 hover:underline sm:block"
              >
                View All
              </Link>
            </div>
            <NewArrivalsCarousel products={newArrivals} />
            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/shop"
                className="inline-block border border-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <Image
            src={editorial}
            alt="Model wearing pieces from the signature collection"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon">
            Our Craft
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-snug text-gray-900 lg:text-4xl">
            Considered design. Exceptional fabric. Made to be lived in.
          </h2>
          <p className="mt-6 leading-relaxed text-gray-600">
            Every piece begins with fabric selected for how it feels on the skin
            and how it holds its shape over years, not seasons. We cut for real
            bodies and finish every seam by hand — because clothing you love is
            clothing you keep.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block border border-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            Our Story
          </Link>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <Icon className="h-6 w-6 text-gray-900" aria-hidden />
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-900">
                {title}
              </h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {journal.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl text-gray-900 lg:text-4xl">
                From the Journal
              </h2>
              <p className="mt-3 text-sm text-gray-500">
                Style notes, fabric guides, and stories from behind the seams.
              </p>
            </div>
            <Link
              href="/blogs"
              className="hidden text-xs font-semibold uppercase tracking-widest text-gray-900 underline-offset-4 hover:underline sm:block"
            >
              All Posts
            </Link>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {journal.map((post) => (
              <Link
                key={post.slug.current}
                href={`/blogs/${post.slug.current}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.blogTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-serif text-xl text-gray-900 group-hover:underline group-hover:underline-offset-4">
                  {post.blogTitle}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {post.blogDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-ink">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="font-serif text-3xl text-white">Join the List</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
            Early access to new drops, private sales, and stories from the
            studio — straight to your inbox.
          </p>
          <form action="/contact" className="mt-8 flex w-full max-w-md gap-0">
            <input
              type="email"
              name="email"
              required
              placeholder="Your email address"
              className="min-w-0 flex-1 border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
