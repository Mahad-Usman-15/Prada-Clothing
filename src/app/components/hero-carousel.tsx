"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import landing1 from "../images/Landing.png"
import landing3 from "../images/landing3.png"
import landing4 from "../images/landing4.png"

const slides = [
  {
    image: landing1,
    eyebrow: "New Season",
    title: "The Summer Edit",
    subtitle: "Effortless silhouettes in breathable, premium fabric.",
  },
  {
    image: landing3,
    eyebrow: "Fashion Festival",
    title: "Up to 50% Off",
    subtitle: "Limited time — the pieces you've been waiting for.",
  },
  {
    image: landing4,
    eyebrow: "Signature Collection",
    title: "Made to Last",
    subtitle: "Tailored fits and timeless colour, season after season.",
  },
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      5000
    )
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-ink lg:h-[85vh]">
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          {slides[index].eyebrow}
        </p>
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
          {slides[index].title}
        </h1>
        <p className="mt-4 max-w-md text-sm text-white/85 sm:text-base">
          {slides[index].subtitle}
        </p>
        <Link
          href="/shop"
          className="mt-8 border border-white px-10 py-3 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-white hover:text-gray-900"
        >
          Shop Now
        </Link>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-white" : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
