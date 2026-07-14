"use client"
import { FormEvent, useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"

type FormData = { name: string; email: string; message: string }
type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string }

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<Status>({ state: "idle" })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ state: "loading" })
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus({ state: "success" })
        setForm({ name: "", email: "", message: "" })
      } else {
        const firstError =
          data.errors && typeof data.errors === "object"
            ? (Object.values(data.errors)[0] as string)
            : data.error ?? "Failed to send message. Please try again."
        setStatus({ state: "error", message: firstError })
      }
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." })
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl text-gray-900">Get in Touch</h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Questions about an order, sizing, or anything else — we&apos;d love to hear from
          you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        {/* Info column */}
        <div className="space-y-8 lg:col-span-2">
          <div className="flex items-start gap-4">
            <Mail className="mt-1 h-5 w-5 text-gray-900" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest">Email</h2>
              <p className="mt-1 text-gray-600">prada@clothing.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="mt-1 h-5 w-5 text-gray-900" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest">Phone</h2>
              <p className="mt-1 text-gray-600">Mon–Sat, 10am–7pm PKT</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-5 w-5 text-gray-900" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest">Store</h2>
              <p className="mt-1 text-gray-600">Lahore, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Form column */}
        <form className="space-y-5 lg:col-span-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-xs font-semibold uppercase tracking-widest">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1 block text-xs font-semibold uppercase tracking-widest">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1 block text-xs font-semibold uppercase tracking-widest">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={2000}
              rows={6}
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            disabled={status.state === "loading"}
            className="w-full bg-black py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.state === "loading" ? "Sending…" : "Send Message"}
          </button>

          {status.state === "success" && (
            <p role="status" className="text-center text-sm font-medium text-emerald-700">
              Message sent successfully! We&apos;ll get back to you soon.
            </p>
          )}
          {status.state === "error" && (
            <p role="alert" className="text-center text-sm font-medium text-red-600">
              {status.message}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
