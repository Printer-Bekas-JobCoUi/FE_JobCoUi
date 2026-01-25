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
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', iconBg: 'bg-emerald-500', shadow: 'shadow-emerald-200/50', border: 'border-emerald-100' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', iconBg: 'bg-blue-500', shadow: 'shadow-blue-200/50', border: 'border-blue-100' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', iconBg: 'bg-purple-500', shadow: 'shadow-purple-200/50', border: 'border-purple-100' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', iconBg: 'bg-amber-500', shadow: 'shadow-amber-200/50', border: 'border-amber-100' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600', iconBg: 'bg-rose-500', shadow: 'shadow-rose-200/50', border: 'border-rose-100' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', iconBg: 'bg-cyan-500', shadow: 'shadow-cyan-200/50', border: 'border-cyan-100' },
}

export default function StatCard({ title, value, hint, trend, icon, tone = 'emerald' }: StatCardProps) {
  const [count, setCount] = useState(0)
  const targetValue = parseInt(value.replace(/\D/g, '')) || 0

  const styles = toneStyles[tone]

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

  const displayValue = value.match(/\d/) ? count.toLocaleString() : value

  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${styles.border} bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50`}>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{displayValue}</h3>
            {hint && <span className="text-xs font-medium text-slate-400">/ {hint}</span>}
          </div>
        </div>

        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${styles.bg} ${styles.text}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            trend.positive 
              ? 'bg-emerald-50 text-emerald-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}
          </div>
          <span className="text-[10px] font-medium text-slate-400">vs bulan lalu</span>
        </div>
      )}
      
      {/* Subtle bottom accent */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 transition-all duration-500 group-hover:w-full ${styles.text}`} />
    </div>
  )
}
