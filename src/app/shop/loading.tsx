export default function ShopLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-10 h-24 animate-pulse rounded bg-gray-100" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] animate-pulse rounded bg-gray-100" />
            <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="mx-auto h-4 w-1/3 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </main>
  )
}
