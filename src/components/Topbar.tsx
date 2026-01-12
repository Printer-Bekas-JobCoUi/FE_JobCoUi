import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Search, UserCircle2, ChevronDown, Settings, Sparkles } from 'lucide-react'
import { useAuth } from '../state/auth'

const titles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Ringkasan aktivitas platform' },
  '/buruh': { title: 'Buruh', subtitle: 'Manajemen akun buruh harian lepas' },
  '/pemberi-kerja': { title: 'Pemberi Kerja', subtitle: 'Manajemen akun pemberi kerja' },
  '/pekerjaan': { title: 'Pekerjaan', subtitle: 'Lowongan/Proyek aktif & arsip' },
  '/kontrak': { title: 'Kontrak Digital', subtitle: 'Pencatatan kontrak & bukti hash' },
  '/pembayaran': { title: 'Upah & Pembayaran', subtitle: 'Kesepakatan upah, escrow, dan penyelesaian' },
  '/pelatihan': { title: 'Pelatihan', subtitle: 'Konten pelatihan interaktif & progres' },
  '/rating': { title: 'Rating & Apresiasi', subtitle: 'Rating dua arah & moderasi ulasan' },
  '/feed': { title: 'Feed & Portofolio', subtitle: 'Aktivitas, portofolio, dan highlight kerja' },
  '/jaminan-sosial': { title: 'Jaminan Sosial', subtitle: 'Integrasi perlindungan & status kepesertaan' },
  '/blockchain': { title: 'Audit Blockchain', subtitle: 'Log transaksi: kontrak, upah, pembayaran' },
  '/pengaturan': { title: 'Pengaturan', subtitle: 'Role, akses, dan preferensi sistem' }
}

export default function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(false)

  const header = useMemo(() => {
    return titles[location.pathname] ?? { title: 'Admin', subtitle: 'Panel administrasi' }
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-30 bg-bg-secondary/95 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <button
          className="lg:hidden btn-secondary px-2.5 py-2.5"
          onClick={onOpenSidebar}
          aria-label="Buka menu"
          type="button"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <div className="text-base font-bold text-white leading-5 truncate">{header.title}</div>
          {header.subtitle && (
            <div className="text-xs text-slate-300 truncate mt-0.5">{header.subtitle}</div>
          )}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 w-[320px] max-w-[35vw]">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan transition-colors" />
            <input 
              className="input pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/15" 
              placeholder="Cari buruh, pekerjaan, kontrak..." 
            />
          </div>
        </div>

        {/* Notification */}
        <button 
          className="btn-secondary px-2.5 py-2.5 relative" 
          type="button" 
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            className="btn-secondary gap-2 pr-3"
            type="button"
            onClick={() => setOpenMenu((v) => !v)}
            aria-label="Menu akun"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 text-white grid place-items-center text-xs font-bold">
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium">{user?.name ?? 'Admin'}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${openMenu ? 'rotate-180' : ''}`} />
          </button>

          {openMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(false)} />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white grid place-items-center font-bold shadow-sm">
                    {(user?.name ?? 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{user?.name ?? 'Admin'}</div>
                    <div className="text-xs text-slate-500">{user?.email ?? 'admin@example.com'}</div>
                  </div>
                </div>
                <div className="px-3 pb-2">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="h-3 w-3" />
                    {user?.role ?? 'Super Admin'}
                  </span>
                </div>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => {
                    setOpenMenu(false)
                    navigate('/pengaturan')
                  }}
                  type="button"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Pengaturan
                </button>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  onClick={() => {
                    setOpenMenu(false)
                    logout()
                    navigate('/login')
                  }}
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
