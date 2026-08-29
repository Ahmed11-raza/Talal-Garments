import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // productId + size + color
  productId: string
  name: string
  price: number
  size: string
  color: string
  image: string
  quantity: number
  maxStock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const id = `${item.productId}-${item.size}-${item.color}`
        const currentItems = get().items
        const existingItem = currentItems.find(i => i.id === id)
        
        if (existingItem) {
          set({
            items: currentItems.map(i => 
              i.id === id 
                ? { ...i, quantity: Math.min(i.quantity + 1, i.maxStock) } 
                : i
            )
          })
        } else {
          set({ items: [...currentItems, { ...item, id, quantity: 1 }] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        
        set({
          items: get().items.map(i => 
            i.id === id 
              ? { ...i, quantity: Math.min(quantity, i.maxStock) } 
              : i
          )
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      
      getCartCount: () => get().items.reduce((count, item) => count + item.quantity, 0)
    }),
    {
      name: 'talal-garments-cart',
    }
  )
)
