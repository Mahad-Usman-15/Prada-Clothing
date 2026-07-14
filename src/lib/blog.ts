import { client } from "@/sanity/lib/client"
import { blogpost } from "@/sanity/lib/query"
import { groq } from "next-sanity"
import type { Blog } from "./types"

export async function getAllBlogs(): Promise<Blog[]> {
  return client.fetch(blogpost)
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  return client.fetch(
    groq`*[_type=="blog" && slug.current == $slug][0]{
      blogTitle,
      blogDescription,
      slug,
      "image": image.asset->url
    }`,
    { slug }
  )
}
