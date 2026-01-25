import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  footer?: React.ReactNode
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute inset-0 p-4 sm:p-8 grid place-items-center">
        <div className="card w-full max-w-2xl">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="font-semibold">{title}</div>
            <div className="flex-1" />
            <button className="btn-secondary px-2 py-2" onClick={onClose} type="button" aria-label="Tutup">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-4 sm:px-6 py-4">{children}</div>
          {footer && <div className="px-4 sm:px-6 py-4 border-t border-slate-200">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  )
}
