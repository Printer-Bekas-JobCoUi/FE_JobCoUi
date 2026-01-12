import React from 'react'

type BadgeProps = {
  tone?: 'slate' | 'blue' | 'green' | 'amber' | 'rose' | 'primary' | 'accent' | 'cyan'
  children: React.ReactNode
  icon?: React.ReactNode
}

const toneStyles: Record<string, string> = {
  slate: 'bg-slate-500/20 text-slate-200 border-slate-400/30',
  blue: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
  green: 'bg-success/20 text-success border-success/30',
  amber: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  rose: 'bg-accent/20 text-accent border-accent/30',
  primary: 'bg-primary/20 text-primary border-primary/30 shadow-glow-primary',
  accent: 'bg-accent/20 text-accent border-accent/30',
  cyan: 'bg-cyan/20 text-cyan border-cyan/30 shadow-glow-cyan'
}

export default function Badge({ tone = 'slate', children, icon }: BadgeProps) {
  return (
    <span className={`badge ${toneStyles[tone]}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
