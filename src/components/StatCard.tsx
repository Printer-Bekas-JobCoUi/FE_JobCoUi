import React, { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

type StatCardProps = {
  title: string
  value: string
  hint?: string
  trend?: { value: string; positive?: boolean }
  icon?: React.ReactNode
}

export default function StatCard({ title, value, hint, trend, icon }: StatCardProps) {
  const [count, setCount] = useState(0)
  const targetValue = parseInt(value.replace(/\D/g, '')) || 0

  // Animate counter on mount
  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = targetValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setCount(targetValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [targetValue])

  const displayValue = value.match(/\d/) ? count.toString() : value

  return (
    <div className="card p-6 group cursor-pointer relative">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-cyan/10" />
      
      <div className="flex items-start gap-4 relative z-10">
        {/* Animated icon with glow */}
        <div className="stat-icon group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </div>
          <div className="text-3xl font-bold text-white mt-2 group-hover:gradient-text transition-all">
            {displayValue}
          </div>
          {hint && (
            <div className="text-xs text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">
              {hint}
            </div>
          )}
        </div>
        
        <div className="ml-auto">
          {trend && (
            <span
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm transition-all duration-300 group-hover:scale-105',
                trend.positive
                  ? 'bg-success/20 text-success border border-success/30'
                  : 'bg-accent/20 text-accent border border-accent/30'
              ].join(' ')}
            >
              {trend.positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
