// Canonical absolute site URL. Tolerates a schemeless value like
// "prada-clothing.vercel.app" (hosting dashboards make that mistake easy —
// `new URL()` on it crashes the whole build) and falls back to Vercel's own
// production-domain variable when NEXT_PUBLIC_SITE_URL isn't set at all.
function normalize(raw: string): string {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withScheme.replace(/\/+$/, "")
}

const raw =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()

export const SITE_URL = raw ? normalize(raw) : "http://localhost:3000"
