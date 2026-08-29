import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string
  slug: string
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items
        if (!currentItems.find(i => i.productId === item.productId)) {
          set({ items: [...currentItems, item] })
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.productId !== productId) })
      },
      
      hasItem: (productId) => {
        return get().items.some(i => i.productId === productId)
      }
    }),
    {
      name: 'talal-garments-wishlist',
    }
  )
)
