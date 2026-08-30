"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("You're on the list — thanks for subscribing!")
    setEmail('')
  }

  return (
    <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 h-12 px-4 border border-border bg-ivory focus:outline-none focus:border-accent rounded-sm text-sm"
        required
      />
      <Button type="submit" className="h-12 px-8 bg-primary text-white hover:bg-accent rounded-sm text-xs tracking-[0.1em] uppercase font-semibold">
        Subscribe
      </Button>
    </form>
  )
}
