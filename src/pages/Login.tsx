import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck, Sparkles, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../state/auth'

export default function Login() {
  const { isAuthed, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthed) return <Navigate to="/" replace />

  const handleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      login(email, password)
      navigate('/')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-slate-100 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch relative z-10">
        {/* Login Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white grid place-items-center font-bold text-xl shadow-md">
              BH
            </div>
            <div className="min-w-0">
              <div className="text-sm text-emerald-600 flex items-center gap-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Admin Panel
              </div>
              <div className="text-xl font-bold leading-7 text-slate-900 mt-1">
                Platform Digital untuk Transparansi & Keamanan Kerja
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Email</span>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Password</span>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </label>

            <button
              className="btn-primary mt-2 group"
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Masuk ke Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-xs text-slate-500 leading-5 text-center mt-2">
              * Demo frontend-only. Klik "Masuk" untuk simulasi login.
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-slate-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Fitur Unggulan
          </div>

          <div className="mt-6 grid gap-4">
            {[
              {
                title: 'Transparansi Upah',
                desc: 'Audit Blockchain untuk jejak kesepakatan upah yang transparan.'
              },
              {
                title: 'Kontrak Digital',
                desc: 'Pencatatan kontrak dengan "proof hash" sebagai jaminan keamanan.'
              },
              {
                title: 'Pelatihan & Rating',
                desc: 'Modul pelatihan interaktif dan sistem rating dua arah.'
              },
              {
                title: 'Jaminan Sosial',
                desc: 'Integrasi BPJS dan program perlindungan untuk buruh.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-5 hover:bg-white hover:border-emerald-200 hover:shadow-sm transition-all duration-300 group cursor-default"
              >
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 text-white grid place-items-center flex-shrink-0 group-hover:shadow-md transition-shadow">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{feature.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{feature.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs text-slate-500 leading-5">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <Sparkles className="h-3 w-3" />
              Tip:
            </span>{' '}
            Jika kamu ingin desain kustom, kirim screenshot Figma untuk penyesuaian warna & spacing.
          </div>
        </div>
      </div>
    </div>
  )
}
