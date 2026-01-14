import React, { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

type StatCardProps = {
  title: string
  value: string
  hint?: string
  trend?: { value: string; positive?: boolean }
  icon?: React.ReactNode
  tone?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan'
}

const toneStyles = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-100', border: 'hover:border-emerald-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-100', border: 'hover:border-blue-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-100', border: 'hover:border-purple-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-100', border: 'hover:border-amber-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', hoverBg: 'group-hover:bg-rose-100', border: 'hover:border-rose-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hoverBg: 'group-hover:bg-cyan-100', border: 'hover:border-cyan-200' },
}

export default function StatCard({ title, value, hint, trend, icon, tone = 'emerald' }: StatCardProps) {
  const [count, setCount] = useState(0)
  const targetValue = parseInt(value.replace(/\D/g, '')) || 0

  const styles = toneStyles[tone]

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
    <div className={`card p-6 group cursor-pointer bg-white transition-colors duration-200 ${styles.border}`}>
      <div className="flex items-start gap-4">
        {/* Simple Icon Box */}
        <div className={`h-10 w-10 rounded-lg ${styles.bg} ${styles.text} grid place-items-center transition-colors ${styles.hoverBg}`}>
          {icon}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {title}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {displayValue}
          </div>
          {hint && (
            <div className="text-xs text-slate-400 mt-1">
              {hint}
            </div>
          )}
        </div>
        
        <div className="ml-auto">
          {trend && (
            <span
              className={[
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                trend.positive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              ].join(' ')}
            >
              {trend.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
