import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="card p-8 text-center max-w-md w-full">
        <div className="text-2xl font-semibold">404</div>
        <div className="mt-2 text-slate-600">Halaman tidak ditemukan.</div>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
