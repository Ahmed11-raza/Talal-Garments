"use client"

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <Button 
      variant="outline" 
      className="text-error border-error/20 hover:bg-error hover:text-white"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
}
