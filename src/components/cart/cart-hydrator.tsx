"use client"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { hydrate } from "@/store/cart-slice"
import { CART_STORAGE_KEY } from "@/store/store"
import type { CartItem } from "@/lib/types"

function parseItems(raw: string | null): CartItem[] | null {
  if (!raw) return null
  try {
    const items = JSON.parse(raw) as CartItem[]
    return Array.isArray(items) ? items : null
  } catch {
    return null
  }
}

export default function CartHydrator() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const items = parseItems(localStorage.getItem(CART_STORAGE_KEY))
      if (items && items.length > 0) {
        dispatch(hydrate(items))
      }
    } catch {
      // corrupted storage — start with an empty cart
    }
  }, [dispatch])

  // Keep this tab's cart in sync with changes made in other tabs — the
  // `storage` event only fires in tabs that did NOT perform the write, so
  // this never loops with the persistence subscriber in store.ts.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CART_STORAGE_KEY) return
      const items = parseItems(e.newValue)
      if (items) dispatch(hydrate(items))
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [dispatch])

  return null
}
