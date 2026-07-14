import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">
        404
      </p>
      <h1 className="mt-4 font-serif text-3xl text-gray-900 lg:text-4xl">
        This page has gone out of style.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        The collection, however, is right where you left it.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="border border-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="bg-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-700"
        >
          Shop
        </Link>
      </div>
    </main>
  )
}
