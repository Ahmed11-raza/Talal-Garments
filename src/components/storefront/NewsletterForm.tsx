"use client"

import { useState } from 'react'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("You're on the list — thanks for subscribing!")
    setEmail('')
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 h-12 px-4 border border-border bg-white text-sm focus:outline-none focus:border-accent rounded-none"
      />
      <button
        type="submit"
        className="h-12 px-6 bg-primary text-white text-[11px] tracking-[0.1em] uppercase font-semibold hover:bg-accent transition-colors shrink-0"
      >
        Subscribe
      </button>
    </form>
  )
}
