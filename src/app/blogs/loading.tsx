export default function BlogsLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10 space-y-3">
        <div className="h-8 w-64 animate-pulse bg-gray-200" />
        <div className="h-4 w-96 max-w-full animate-pulse bg-gray-100" />
      </div>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] animate-pulse bg-gray-200" />
            <div className="h-5 w-3/4 animate-pulse bg-gray-200" />
            <div className="h-4 w-full animate-pulse bg-gray-100" />
          </div>
        ))}
      </div>
    </main>
  )
}
