import React, { useState, useEffect } from 'react'
import { Briefcase, FileText, ShieldCheck, Users, Wallet, Blocks, ArrowRight } from 'lucide-react'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import Table from '../components/Table'
import { admin } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalEmployers: 0,
    activeJobs: 0,
    activeContracts: 0,
    pendingPayments: 0,
    recentActivities: [],
    verifiedWorkers: 0,
    verifiedEmployers: 0,
    disputes: 0,
    failedPayments: 0
  })
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await admin.getStats()
      if (res.data.success) {
        setStats({
          ...res.data.data,
          pendingChain: 0 // Will handle if blockchain data is separate or just use pending payments as proxy
        })
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section - Cleaned Up */}
      <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-8 text-white shadow-lg lg:p-10">
        <div className="relative z-10 grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-100 mb-4">
            </div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-white">
              Selamat Datang, Tim JobCoUi!
            </h1>
            <p className="mt-3 text-base text-blue-100 max-w-xl leading-relaxed">
              Pantau aktivitas platform, kelola kontrak, dan verifikasi pembayaran dalam satu antarmuka yang terintegrasi.
            </p>
            <div className="mt-8 flex gap-3">
              <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors">
                Lihat Laporan
              </button>
              <button className="bg-blue-700 text-white border border-blue-500 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                Pengumuman
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            {/* Abstract Decoration */}
            <div className="relative h-48 w-48 opacity-90">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-2xl transform translate-x-4 translate-y-4"></div>
              <div className="absolute inset-0 border border-white/20 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.totalWorkers}</div>
                  <div className="text-xs text-blue-200 uppercase tracking-widest mt-1">Total Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl"></div>
      </div>

      {/* Stats Grid - Cleaner spacing */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Buruh" value={String(stats.totalWorkers)} hint="Akun terdaftar" icon={<Users className="h-4 w-4" />} trend={{ value: '+6% minggu ini', positive: true }} tone="emerald" />
        <StatCard title="Total Pemberi Kerja" value={String(stats.totalEmployers)} hint="Akun terdaftar" icon={<Briefcase className="h-4 w-4" />} trend={{ value: '+2% minggu ini', positive: true }} tone="blue" />
        <StatCard title="Pekerjaan Aktif" value={String(stats.activeJobs)} hint="Lowongan terbuka" icon={<Briefcase className="h-4 w-4" />} trend={{ value: '-1% minggu ini', positive: false }} tone="purple" />
        <StatCard title="Kontrak Berjalan" value={String(stats.activeContracts)} hint="Kontrak aktif" icon={<FileText className="h-4 w-4" />} tone="amber" />
        <StatCard title="Pembayaran Menunggu" value={String(stats.pendingPayments)} hint="Butuh verifikasi" icon={<Wallet className="h-4 w-4" />} tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Feed - Clean Card */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800">Aktivitas Terbaru</h3>
              <p className="text-sm text-slate-500">Log transaksi dan kejadian sistem</p>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="p-0">
            <Table
              className="border-none shadow-none rounded-none"
              columns={[
                {
                  key: 'createdAt',
                  title: 'Waktu',
                  className: 'whitespace-nowrap pl-6',
                  render: (r: any) => new Date(r.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })
                },
                {
                  key: 'type',
                  title: 'Tipe',
                  className: 'whitespace-nowrap',
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.status === 'success'
                          ? 'green'
                          : r.status === 'pending'
                            ? 'amber'
                            : 'rose'
                      }
                    >
                      {r.type ? r.type.replace('_', ' ') : 'TRANSFER'}
                    </Badge>
                  )
                },
                {
                  key: 'ref',
                  title: 'Ref/Hash',
                  className: 'font-mono text-xs text-slate-500',
                  render: (r: any) => r.chainTxHash ? `${r.chainTxHash.substring(0, 10)}...` : `#${r.id}`
                },
                {
                  key: 'status',
                  title: 'Status',
                  className: 'pr-6 text-right',
                  render: (r: any) => <div className="flex justify-end"><Badge tone={r.status === 'success' ? 'green' : 'amber'}>{r.status}</Badge></div>
                }
              ]}
              rows={stats.recentActivities}
            />
          </div>
        </div>

        {/* Benefits Card - Clean */}
        <div className="card h-full">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Tujuan Platform</h3>
              <p className="text-sm text-slate-500">Manfaat utama</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-emerald-400"></div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">Transparansi</span> — Mempertemukan buruh & pemberi kerja dengan data yang valid dan terverifikasi.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">Kontrak Digital</span> — Pencatatan perjanjian kerja yang aman dan mudah diakses.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-amber-400"></div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">Jaminan Sosial</span> — Integrasi perlindungan buruh dalam setiap pekerjaan.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 leading-relaxed border border-slate-100">
                <strong>Catatan:</strong> Data di atas diambil secara real-time dari database JobCoUi.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Section */}
      <div className="card p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Kesehatan Platform</h2>
            <p className="text-sm text-slate-500">Metrik operasional sistem realtime</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Semua Sistem Normal
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Akurasi Buruh</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stats.verifiedWorkers}</span>
              <span className="text-sm text-slate-500">/ {stats.totalWorkers}</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(stats.verifiedWorkers / (stats.totalWorkers || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Akurasi Pemberi Kerja</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stats.verifiedEmployers}</span>
              <span className="text-sm text-slate-500">/ {stats.totalEmployers}</span>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(stats.verifiedEmployers / (stats.totalEmployers || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sengketa</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-600">{stats.disputes}</span>
              <span className="text-sm text-slate-500">kasus aktif</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Butuh perhatian segera</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pembayaran Gagal</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600">{stats.failedPayments}</span>
              <span className="text-sm text-slate-500">transaksi</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Total akumulasi</p>
          </div>
        </div>
      </div>
    </div>
  )
}
