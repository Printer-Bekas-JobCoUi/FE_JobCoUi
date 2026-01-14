import React from 'react'

type BadgeProps = {
  tone?: 'slate' | 'blue' | 'green' | 'amber' | 'rose' | 'primary' | 'accent' | 'cyan'
  children: React.ReactNode
  icon?: React.ReactNode
}

const toneStyles: Record<string, string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  primary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  accent: 'bg-amber-50 text-amber-700 border-amber-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200'
}

export default function Badge({ tone = 'slate', children, icon }: BadgeProps) {
  return (
    <span className={`badge ${toneStyles[tone]}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
