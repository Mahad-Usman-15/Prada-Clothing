"use client"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { clearCart } from "@/store/cart-slice"

export default function ClearCart() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearCart())
  }, [dispatch])
  return null
}
