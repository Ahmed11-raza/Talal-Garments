"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flame, Clock, ArrowRight } from 'lucide-react'

export function DealBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 24, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-primary via-stone-900 to-primary text-white py-4 px-4 border-y border-white/10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        {/* Deal Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/40">
            <Flame className="w-5 h-5 text-accent animate-bounce" />
          </div>
          <div>
            <span className="bg-accent text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs mr-2">
              LIMITED TIME DEAL
            </span>
            <span className="font-serif text-lg md:text-xl font-bold">
              Up to 40% OFF Season Sale
            </span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent shrink-0 hidden sm:block" />
          <span className="text-xs uppercase tracking-wider text-white/70 mr-1 hidden sm:inline">Ends In:</span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
            <div className="bg-white/10 px-2.5 py-1 rounded border border-white/10 text-accent">
              {String(timeLeft.hours).padStart(2, '0')}<span className="text-[10px] text-white/50 block font-sans text-center">HRS</span>
            </div>
            <span>:</span>
            <div className="bg-white/10 px-2.5 py-1 rounded border border-white/10 text-accent">
              {String(timeLeft.minutes).padStart(2, '0')}<span className="text-[10px] text-white/50 block font-sans text-center">MIN</span>
            </div>
            <span>:</span>
            <div className="bg-white/10 px-2.5 py-1 rounded border border-white/10 text-accent">
              {String(timeLeft.seconds).padStart(2, '0')}<span className="text-[10px] text-white/50 block font-sans text-center">SEC</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link 
          href="/collections/all" 
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors shrink-0"
        >
          Shop Deals <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
