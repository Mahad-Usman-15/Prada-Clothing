import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getAllBlogs } from "@/lib/blog"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Blogs",
  description: "Style guides, fabric stories, and news from the studio.",
}

export default async function BlogsPage() {
  const blogs = await getAllBlogs()
  const [featured, ...rest] = blogs

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl text-gray-900">Journal</h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">
          Stories, Style &amp; Craft
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="py-24 text-center text-gray-500">No posts published yet — check back soon.</p>
      ) : (
        <>
          {/* Featured post */}
          <Link
            href={`/blogs/${featured.slug.current}`}
            className="group mb-16 grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <Image
                src={featured.image}
                alt={featured.blogTitle}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Featured
              </p>
              <h2 className="font-serif text-3xl text-gray-900 group-hover:underline group-hover:underline-offset-4">
                {featured.blogTitle}
              </h2>
              <p className="mt-4 line-clamp-3 leading-relaxed text-gray-600">
                {featured.blogDescription}
              </p>
              <span className="mt-6 text-sm font-semibold uppercase tracking-widest underline-offset-4 group-hover:underline">
                Read More
              </span>
            </div>
          </Link>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((blog) => (
              <Link
                key={blog.slug.current}
                href={`/blogs/${blog.slug.current}`}
                className="group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={blog.image}
                    alt={blog.blogTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-serif text-xl text-gray-900 group-hover:underline group-hover:underline-offset-4">
                  {blog.blogTitle}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                  {blog.blogDescription}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
