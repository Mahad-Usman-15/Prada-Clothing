import type { Metadata } from "next";
import { Geist, Geist_Mono, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import Header from "./components/header";
import Footer from "./components/footer";
import Mobilefooter from "./components/mobile-footer";
import CartProvider from "@/store/provider";
import CartDrawer from "@/components/cart/cart-drawer";
import CartHydrator from "@/components/cart/cart-hydrator";
import PromoPopup from "@/components/promo/promo-popup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prada — Premium Clothing",
    template: "%s | Prada",
  },
  description:
    "Premium clothing for men and women — timeless design, exceptional fabric, delivered across Pakistan.",
  keywords: ["clothing", "fashion", "men", "women", "Pakistan", "premium"],
  category: "Clothing",
  applicationName: "Prada",
  openGraph: {
    type: "website",
    siteName: "Prada",
    description:
      "Premium clothing for men and women — timeless design, exceptional fabric, delivered across Pakistan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} antialiased`}
      >
        <CartProvider>
          <CartHydrator />
          <Header />
          {children}
          <CartDrawer />
          <PromoPopup />
          <Footer />
          <Mobilefooter />
        </CartProvider>
      </body>
    </html>
  );
}
