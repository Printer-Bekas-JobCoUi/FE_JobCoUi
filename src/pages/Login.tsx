import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../state/auth'

export default function Login() {
  const { isAuthed, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (isAuthed) return <Navigate to="/" replace />

  const handleLogin = () => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      setIsSuccess(true) // Trigger animation
      
      // Wait for animation to finish before navigating
      setTimeout(() => {
        login(email, password)
        navigate('/')
      }, 800)
    }, 800)
  }

  return (
    <div className="min-h-screen w-full flex bg-white relative overflow-hidden">
      {/* Left Side - Login Form */}
      <div 
        className={`flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 relative z-20 bg-white transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isSuccess ? 'w-full translate-x-0' : 'w-full lg:w-1/2'
        }`}
      >
        <div className={`w-full max-w-md space-y-8 transition-opacity duration-300 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center">
            <div className="animate-fade-in flex justify-center mb-6">
              <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center p-4 border-4 border-slate-100 shadow-xl shadow-blue-900/5 transition-transform hover:scale-105 duration-300">
                <img src="/jobcoui-logo.png" alt="JobCoUi Logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Selamat Datang Kembali
            </h1>
            <p className="mt-3 text-slate-500 text-lg">
              Masuk untuk mengelola platform <span className="font-semibold text-blue-600">JobCoUi</span>.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <input
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading || isSuccess}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <input
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                disabled={isLoading || isSuccess}
              />
            </div>

            <div className="pt-4">
              <button
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all duration-300 group ${
                  (isLoading || isSuccess) ? 'opacity-80 cursor-wait' : ''
                }`}
                type="button"
                onClick={handleLogin}
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="h-4 w-4 opacity-80 group-hover:scale-110 transition-transform" />
                    Masuk ke Dashboard
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            
             <div className="text-xs text-center text-slate-400 mt-8">
              © 2026 JobCoUi • Platform Digital Buruh Harian
            </div>
          </div>
        </div>
      </div>


      {/* Right Side - Visual Banner */}
      <div 
        className={`hidden lg:flex relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 overflow-hidden items-center justify-center p-12 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isSuccess ? 'w-0 opacity-0' : 'flex-1 w-1/2'
        }`}
      >
        {/* Content remains the same but wrapped to handle width transition gracefully */}
        <div className="w-full max-w-lg relative">
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 mix-blend-overlay" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 mix-blend-screen" />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

          {/* Feature Card */}
          <div className="relative z-10 w-full transform hover:scale-[1.01] transition-transform duration-500">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
               
               <div className="flex items-center gap-3 mb-8">
                  <div className="flex -space-x-3">
                    <div className="h-10 w-10 rounded-full border-2 border-indigo-900 bg-indigo-100" />
                    <div className="h-10 w-10 rounded-full border-2 border-indigo-900 bg-pink-100" />
                    <div className="h-10 w-10 rounded-full border-2 border-indigo-900 bg-blue-100" />
                    <div className="h-10 w-10 rounded-full border-2 border-indigo-900 bg-slate-800 text-white text-xs flex items-center justify-center font-medium">+1.5k</div>
                  </div>
                  <div className="text-blue-100 text-sm font-medium pl-2">
                     Komunitas terpercaya
                  </div>
               </div>
               
               <h2 className="text-3xl font-bold text-white leading-tight mb-6">
                 Transparansi & Keamanan bagi Pekerja Harian
               </h2>
               <p className="text-blue-100/80 leading-relaxed mb-10 text-lg">
                 Satu platform untuk mengelola kontrak digital, pembayaran instan, dan reputasi pekerja secara transparan menggunakan teknologi blockchain.
               </p>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-blue-950/40 rounded-2xl p-5 border border-white/5 hover:bg-blue-900/40 transition-colors">
                   <div className="text-3xl font-bold text-white mb-1">98%</div>
                   <div className="text-sm text-blue-200">Pembayaran Sukses</div>
                 </div>
                 <div className="bg-blue-950/40 rounded-2xl p-5 border border-white/5 hover:bg-blue-900/40 transition-colors">
                   <div className="text-3xl font-bold text-white mb-1">&lt;1m</div>
                   <div className="text-sm text-blue-200">Waktu Kontrak</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
