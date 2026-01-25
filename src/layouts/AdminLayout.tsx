import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Clean background - removed animated blobs */}
      <div className="fixed inset-0 bg-slate-50 pointer-events-none -z-10" />

      {/* Desktop sidebar */}
      <Sidebar variant="desktop" />

      {/* Mobile sidebar (drawer) */}
      <Sidebar variant="mobile" open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-72 relative z-10">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} />
        <main className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <Outlet />
        </main>
        <footer className="px-4 sm:px-6 lg:px-8 pb-10 text-xs text-slate-500 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          © {new Date().getFullYear()} • Job Contract Unified Interface • JobCoUi
        </footer>
      </div>
    </div>
  )
}
