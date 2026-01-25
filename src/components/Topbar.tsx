import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, UserCircle2, ChevronDown, Settings, Sparkles } from 'lucide-react'
import { useAuth } from '../state/auth'

export default function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-white via-blue-50/20 to-white backdrop-blur-xl border-b border-blue-100/50 shadow-md">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative group px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow"
          onClick={onOpenSidebar}
          aria-label="Buka menu"
          type="button"
        >
          <Menu className="h-4.5 w-4.5 text-slate-600 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Logo/Brand Area with Full Name */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="hidden xl:flex flex-col">
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm filter">
              Job Contract Unified Interface
            </h1>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-blue-400 to-transparent"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Admin Dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Quick Stats - System Status */}
        <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/80 border border-slate-200/80 shadow-sm">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Online</span>
        </div>

        {/* Notification Button */}
        <button 
          className="relative group px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 hover:border-rose-400 hover:bg-rose-50 transition-all duration-200 shadow-sm hover:shadow" 
          type="button" 
          aria-label="Notifikasi"
        >
          <Bell className="h-4.5 w-4.5 text-slate-600 group-hover:text-rose-600 transition-colors" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">3</span>
          </span>
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 animate-ping opacity-75" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            className="flex items-center gap-2.5 px-3 py-2 pr-4 rounded-xl bg-white/80 border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow group"
            type="button"
            onClick={() => setOpenMenu((v) => !v)}
            aria-label="Menu akun"
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white grid place-items-center text-sm font-bold shadow-md ring-2 ring-white">
                {(user?.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-blue-400 border-2 border-white shadow-sm" />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{user?.name ?? 'Admin'}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-all duration-200 ${openMenu ? 'rotate-180' : ''}`} />
          </button>

          {openMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(false)} />
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                {/* Gradient background decoration */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent" />
                
                <div className="relative">
                  {/* User Info */}
                  <div className="px-3 py-4 flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white grid place-items-center font-bold text-lg shadow-lg ring-4 ring-blue-100">
                        {(user?.name ?? 'A').charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-400 border-2 border-white shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{user?.name ?? 'Admin'}</div>
                      <div className="text-xs text-slate-500 truncate">{user?.email ?? 'admin@example.com'}</div>
                    </div>
                  </div>
                  
                  {/* Role Badge */}
                  <div className="px-3 pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                      <Sparkles className="h-3.5 w-3.5" />
                      {user?.role ?? 'Super Admin'}
                    </span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2" />
                  
                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 group"
                      onClick={() => {
                        setOpenMenu(false)
                        navigate('/pengaturan')
                      }}
                      type="button"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors">
                        <Settings className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      Pengaturan
                    </button>
                    
                    <div className="h-px bg-slate-100 my-2" />
                    
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group"
                      onClick={() => {
                        setOpenMenu(false)
                        logout()
                        navigate('/login')
                      }}
                      type="button"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-50 group-hover:bg-rose-100 transition-colors">
                        <LogOut className="h-4 w-4 text-rose-500 group-hover:text-rose-600 transition-colors" />
                      </div>
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
