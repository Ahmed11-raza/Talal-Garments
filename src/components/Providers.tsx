"use client"

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#1C3A2F',
            color: '#F9F7F4',
            border: '1px solid rgba(201, 168, 76, 0.3)',
          }
        }}
      />
    </SessionProvider>
  )
}
