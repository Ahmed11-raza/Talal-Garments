import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Phone } from 'lucide-react'

interface OrderConfirmedPageProps {
  params: Promise<{ orderNumber: string }>
}

export default async function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const { orderNumber } = await params

  return (
    <section className="min-h-[70vh] flex items-center justify-center container mx-auto px-4 py-24">
      <div className="text-center max-w-lg space-y-8">
        <CheckCircle className="w-20 h-20 text-success mx-auto" />

        <div className="space-y-3">
          <h1 className="font-serif text-4xl text-primary">Order Placed!</h1>
          <p className="text-muted text-lg">
            Thank you for your order. We&apos;ve received it and will get it ready for delivery.
          </p>
        </div>

        <div className="bg-ivory rounded-sm p-8 space-y-4">
          <p className="text-xs uppercase tracking-wider font-medium text-muted">Order Number</p>
          <p className="font-serif text-3xl text-accent">{orderNumber}</p>
          <p className="text-sm text-muted">
            You will receive a call or WhatsApp message to confirm your order.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-accent rounded-sm h-12 px-8 text-xs tracking-[0.15em] uppercase font-semibold">
            <Link href="/collections/all">
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-sm h-12 px-8 border-border text-xs tracking-[0.15em] uppercase font-semibold">
            <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank">
              <Phone className="w-5 h-5 mr-2" />
              WhatsApp Support
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
