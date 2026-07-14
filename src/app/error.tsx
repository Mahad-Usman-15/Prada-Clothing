"use client"
import Link from "next/link"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">
        Something went wrong
      </p>
      <h1 className="mt-4 font-serif text-3xl text-gray-900 lg:text-4xl">
        We hit a loose thread.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
        An unexpected error occurred while loading this page. Try again — if it
        keeps happening, we&apos;d love to hear about it.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="border border-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
        >
          Try Again
        </button>
        <Link
          href="/contact"
          className="bg-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-700"
        >
          Contact Us
        </Link>
      </div>
    </main>
  )
}
