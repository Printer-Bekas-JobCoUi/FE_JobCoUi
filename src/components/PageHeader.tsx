import React from 'react'
import { Sparkles } from 'lucide-react'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          {title}
          <Sparkles className="h-5 w-5 text-cyan" />
        </h1>
        {description && (
          <p className="text-sm text-slate-300 mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
