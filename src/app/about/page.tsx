import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import about from "../images/about.png"

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Prada — considered design, exceptional fabric, and clothing made to be lived in.",
}

const values = [
  {
    title: "Craftsmanship",
    description:
      "Every seam is finished by hand. We'd rather make fewer pieces well than many pieces quickly.",
  },
  {
    title: "Fabric First",
    description:
      "We select cloth for how it feels on the skin and how it holds its shape over years, not seasons.",
  },
  {
    title: "Honest Fit",
    description:
      "Cut for real bodies. Our patterns are tested across sizes before anything reaches the rail.",
  },
  {
    title: "Responsibility",
    description:
      "Sourced and stitched in Pakistan, supporting the mills and makers of our own communities.",
  },
]

const stats = [
  { value: "2019", label: "Founded in Karachi" },
  { value: "40+", label: "Cities delivered to" },
  { value: "100%", label: "Locally made" },
]

export default function AboutPage() {
  return (
    <main>
      <section className="bg-cream">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-maroon">
            Our Story
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-gray-900 lg:text-5xl">
            Clothing you keep, from a place we call home.
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-gray-600">
            Prada began with a simple frustration: clothes that looked good for a
            season and fell apart by the next. We set out to make the opposite —
            timeless pieces in exceptional fabric, designed and made in Pakistan.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <Image
            src={about}
            alt="Inside the Prada atelier"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="max-w-lg">
          <h2 className="font-serif text-3xl leading-snug text-gray-900 lg:text-4xl">
            From a single rail in Karachi to wardrobes across the country.
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-gray-600">
            <p>
              What started as a small studio with one tailor and a single rail of
              samples has grown into a full atelier — but the way we work
              hasn&apos;t changed. Fabric is still chosen by hand. Fits are
              still tested on real people. Nothing ships until we&apos;d wear
              it ourselves.
            </p>
            <p>
              Today we deliver to more than forty cities, working directly with
              local mills so that every rupee you spend supports the craft
              communities that make Pakistani textiles world-famous.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-center font-serif text-3xl lg:text-4xl">
            What We Stand For
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={value.title}>
                <p className="font-serif text-sm text-white/40">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-widest">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-24">
        <h2 className="font-serif text-3xl text-gray-900">
          See it for yourself
        </h2>
        <p className="mt-4 max-w-md leading-relaxed text-gray-600">
          The best way to understand the difference is to feel it. Explore the
          collection — and if anything isn&apos;t right, returns are on us.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block border border-gray-900 px-10 py-3 text-xs font-semibold uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
        >
          Shop the Collection
        </Link>
      </section>
    </main>
  )
}
