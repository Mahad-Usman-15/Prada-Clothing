import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./cart-slice"

export const CART_STORAGE_KEY = "cart:v1"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})

// Persist cart items (never drawer state) to localStorage, debounced.
if (typeof window !== "undefined") {
  let timeout: ReturnType<typeof setTimeout> | null = null
  store.subscribe(() => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      try {
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(store.getState().cart.items)
        )
      } catch {
        // storage full or unavailable — cart just won't persist
      }
    }, 200)
  })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
