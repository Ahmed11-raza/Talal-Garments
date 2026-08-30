"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/account')
      router.refresh()
    }
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center container mx-auto px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 space-y-3">
          <h1 className="font-serif text-4xl text-primary">Welcome Back</h1>
          <p className="text-muted">Sign in to your Talal Garments account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="h-12 rounded-sm border-border" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="h-12 rounded-sm border-border" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>

          <Button type="submit" size="lg" className="w-full h-14 bg-primary hover:bg-accent rounded-sm text-xs tracking-[0.15em] uppercase font-semibold" disabled={loading}>
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing In...</> : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link href="/account/register" className="text-accent font-medium hover:text-primary transition-colors">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
