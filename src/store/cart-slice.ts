import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "@/lib/types"

export interface CartState {
  items: CartItem[]
  isDrawerOpen: boolean
}

const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
}

// Must not exceed the checkout API's MAX_QUANTITY, or checkout rejects the cart.
export const MAX_LINE_QUANTITY = 20

const sameLine = (a: { id: number; size: string | null }, b: { id: number; size: string | null }) =>
  a.id === b.id && (a.size ?? null) === (b.size ?? null)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>
    ) {
      const { quantity = 1, ...item } = action.payload
      const existing = state.items.find((line) => sameLine(line, item))
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_LINE_QUANTITY)
      } else {
        state.items.push({ ...item, quantity: Math.min(quantity, MAX_LINE_QUANTITY) })
      }
      state.isDrawerOpen = true
    },
    removeItem(state, action: PayloadAction<{ id: number; size: string | null }>) {
      state.items = state.items.filter((line) => !sameLine(line, action.payload))
    },
    setQuantity(
      state,
      action: PayloadAction<{ id: number; size: string | null; quantity: number }>
    ) {
      const { quantity } = action.payload
      if (quantity < 1) {
        state.items = state.items.filter((line) => !sameLine(line, action.payload))
        return
      }
      const line = state.items.find((l) => sameLine(l, action.payload))
      if (line) line.quantity = Math.min(quantity, MAX_LINE_QUANTITY)
    },
    clearCart(state) {
      state.items = []
    },
    openDrawer(state) {
      state.isDrawerOpen = true
    },
    closeDrawer(state) {
      state.isDrawerOpen = false
    },
    hydrate(state, action: PayloadAction<CartItem[]>) {
      // localStorage is user-editable — clamp quantities so stale or tampered
      // values can't exceed what checkout accepts.
      state.items = action.payload
        .filter((line) => Number.isFinite(line.quantity) && line.quantity >= 1)
        .map((line) => ({
          ...line,
          quantity: Math.min(Math.floor(line.quantity), MAX_LINE_QUANTITY),
        }))
    },
  },
})

export const {
  addItem,
  removeItem,
  setQuantity,
  clearCart,
  openDrawer,
  closeDrawer,
  hydrate,
} = cartSlice.actions

export default cartSlice.reducer

type StateWithCart = { cart: CartState }

export const selectCartItems = (state: StateWithCart) => state.cart.items
export const selectIsDrawerOpen = (state: StateWithCart) => state.cart.isDrawerOpen
export const selectCartCount = (state: StateWithCart) =>
  state.cart.items.reduce((sum, line) => sum + line.quantity, 0)
export const selectSubtotal = (state: StateWithCart) =>
  state.cart.items.reduce((sum, line) => sum + line.price * line.quantity, 0)
