export type ProductImage = {
  id: number
  src: string
  alt: string
}

export type ProductAttribute = {
  id: number
  name: string
  options: string[]
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  images: ProductImage[]
  categories: { id: number; name: string; slug: string }[]
  tags: { id: number; name: string }[]
  attributes: ProductAttribute[]
  stock_status: "instock" | "outofstock" | "onbackorder"
  manage_stock: boolean
  stock_quantity: number | null
}

export type Category = {
  id: number
  name: string
  slug: string
  count: number
  image: { src: string } | null
}

export type Tag = {
  id: number
  name: string
}

export type Blog = {
  blogTitle: string
  blogDescription: string
  slug: {
    _type: "slug"
    current: string
  }
  image: string
}

export type CartItem = {
  id: number
  name: string
  slug: string
  price: number
  image: string | null
  size: string | null
  quantity: number
}
