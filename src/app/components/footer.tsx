import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "New Arrivals", href: "/shop" },
  { label: "Sale", href: "/shop" },
]

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Journal", href: "/blogs" },
  { label: "Contact", href: "/contact" },
]

const helpLinks = [
  { label: "FAQs", href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
]

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-8">
        <div className="space-y-4">
          <p className="font-serif text-2xl uppercase tracking-[0.25em]">Prada</p>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Timeless clothing made with exceptional fabric — designed in Pakistan,
            delivered nationwide.
          </p>
          <div className="flex items-center gap-4 pt-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/60 transition-colors hover:text-white"
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Shop", links: shopLinks },
          { title: "Company", links: companyLinks },
          { title: "Help", links: helpLinks },
        ].map(({ title, links }) => (
          <div key={title}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/80">
              {title}
            </h2>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Prada. All rights reserved.</p>
          <p>Karachi · Lahore · Islamabad</p>
        </div>
      </div>
    </footer>
  )
}
