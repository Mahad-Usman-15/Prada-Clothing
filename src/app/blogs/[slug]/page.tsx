import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllBlogs, getBlogBySlug } from "@/lib/blog"
import type { Blog } from "@/lib/types"

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const blogs = await getAllBlogs()
    return blogs.map((blog) => ({ slug: blog.slug.current }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug).catch(() => null)
  if (!blog) return { title: "Post not found" }
  return {
    title: blog.blogTitle,
    description: blog.blogDescription?.slice(0, 160),
    openGraph: {
      title: blog.blogTitle,
      description: blog.blogDescription?.slice(0, 160),
      images: blog.image ? [blog.image] : [],
    },
  }
}

function pickRelated(currentSlug: string, all: Blog[], count = 2): Blog[] {
  const others = all.filter((post) => post.slug.current !== currentSlug)
  const shuffled = [...others]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) notFound()

  const related = pickRelated(slug, await getAllBlogs().catch(() => []))

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:flex-row">
      <article className="min-w-0 flex-1 space-y-6">
        <h1 className="font-serif text-3xl text-gray-900 lg:text-4xl">{blog.blogTitle}</h1>
        {blog.image && (
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
            <Image
              src={blog.image}
              alt={blog.blogTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              className="object-cover object-center"
            />
          </div>
        )}
        <p className="text-lg leading-relaxed text-gray-700">{blog.blogDescription}</p>
      </article>

      {related.length > 0 && (
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80 lg:self-start">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-900">
            You May Also Like
          </h2>
          <div className="space-y-8">
            {related.map((item) => (
              <Link key={item.slug.current} href={`/blogs/${item.slug.current}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.blogTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-serif text-lg text-gray-900 group-hover:underline group-hover:underline-offset-4">
                  {item.blogTitle}
                </h3>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </main>
  )
}
