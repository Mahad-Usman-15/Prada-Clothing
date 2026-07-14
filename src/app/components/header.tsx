"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { CiFacebook, CiInstagram, CiLinkedin, CiTwitter } from "react-icons/ci"
import { FaPinterestP } from "react-icons/fa"
import headericon from "../images/headericons.png"
import Search from "./search-bar"
import CartButton from "@/components/cart/cart-button"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blogs", label: "Blogs" },
]

const socialicons = [
  { id: 0, label: "Facebook", icon: <CiFacebook className="h-8 w-8" /> },
  { id: 1, label: "Instagram", icon: <CiInstagram className="h-8 w-8" /> },
  { id: 2, label: "Twitter", icon: <CiTwitter className="h-8 w-8" /> },
  { id: 3, label: "LinkedIn", icon: <CiLinkedin className="h-8 w-8" /> },
  { id: 4, label: "Pinterest", icon: <FaPinterestP className="h-8 w-8" /> },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            className="p-2 lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Prada home">
            <Image src={headericon} alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-serif text-2xl font-bold uppercase tracking-widest text-gray-900">
              Prada
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm uppercase tracking-widest transition hover:text-black ${
                      pathname === link.href
                        ? "font-semibold text-black underline underline-offset-8"
                        : "text-gray-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Search />
            <CartButton />
          </div>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <span className="font-serif text-xl font-bold uppercase tracking-widest">Prada</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <motion.ul
          initial={{ opacity: 0, x: 0 }}
          animate={isMenuOpen ? { opacity: 1, x: 4 } : {}}
          transition={{ type: "keyframes", ease: "easeIn" }}
          className="flex flex-col gap-1 p-4"
        >
          {navLinks.map((link) => (
            <li key={link.href} className="border-b border-gray-100">
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 text-lg uppercase tracking-wider ${
                  pathname === link.href ? "font-semibold text-black" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </motion.ul>
        <div className="mt-10 grid grid-cols-5 gap-2 p-4">
          {socialicons.map((item) => (
            <span
              key={item.id}
              aria-label={item.label}
              className="flex justify-center border border-gray-200 p-1 text-gray-700"
            >
              {item.icon}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {isMenuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  )
}
