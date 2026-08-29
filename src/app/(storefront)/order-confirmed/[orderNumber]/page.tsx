import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Phone } from 'lucide-react'

interface OrderConfirmedPageProps {
  params: Promise<{ orderNumber: string }>
}

export default async function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const { orderNumber } = await params

  return (
    <section className="container mx-auto px-4 py-24 text-center max-w-2xl">
      <div className="space-y-8">
        <CheckCircle className="w-20 h-20 text-forest mx-auto" />

        <div className="space-y-3">
          <h1 className="font-serif text-4xl text-forest">Order Placed!</h1>
          <p className="text-charcoal/70 text-lg">
            Thank you for your order. We&apos;ve received it and will get it ready for delivery.
          </p>
        </div>

        <div className="bg-mist/50 rounded-sm p-8 space-y-4">
          <p className="text-sm text-charcoal/60">Order Number</p>
          <p className="font-serif text-3xl text-forest">{orderNumber}</p>
          <p className="text-sm text-charcoal/60">
            You will receive a call or WhatsApp message to confirm your order.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/collections/all">
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
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
