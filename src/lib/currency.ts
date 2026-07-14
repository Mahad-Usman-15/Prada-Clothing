const formatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
})

export function formatPKR(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount
  if (!Number.isFinite(value)) return "Rs 0"
  return formatter.format(value)
}
