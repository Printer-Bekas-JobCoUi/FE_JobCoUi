import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-cyan/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Decorative gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

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
          <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
          © {new Date().getFullYear()} • Platform Buruh Harian Lepas • Modern Edition
        </footer>
      </div>
    </div>
  )
}
