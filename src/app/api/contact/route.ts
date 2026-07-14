import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service is not configured" }, { status: 500 })
  }

  const body = await req.json().catch(() => null)
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
  const { name, email, message } = body as Record<string, unknown>

  const errors: Record<string, string> = {}
  if (typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
    errors.name = "Name is required (max 100 characters)."
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    errors.email = "A valid email address is required."
  }
  if (typeof message !== "string" || message.trim().length === 0 || message.length > 2000) {
    errors.message = "Message is required (max 2000 characters)."
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.CONTACT_EMAIL_TO ?? "mahadusman2008@gmail.com",
    replyTo: email as string,
    subject: `Contact form: ${(name as string).trim()}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(name as string)}</p>
<p><strong>Email:</strong> ${escapeHtml(email as string)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message as string).replace(/\n/g, "<br/>")}</p>`,
  })

  if (error) {
    console.error("Resend error:", error.message)
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 })
  }
  return NextResponse.json({ ok: true, id: data?.id })
}
