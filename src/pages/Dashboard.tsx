import React, { useMemo } from 'react'
import { Briefcase, FileText, ShieldCheck, Users, Wallet, Blocks } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import Table from '../components/Table'
import { blockchainEvents, contracts, employers, jobs, payments, workers } from '../data/mock'

export default function Dashboard() {
  const stats = useMemo(() => {
    const totalWorkers = workers.length
    const totalEmployers = employers.length
    const activeJobs = jobs.filter((j) => j.status === 'Aktif').length
    const activeContracts = contracts.filter((c) => c.status === 'Aktif').length
    const pendingPayments = payments.filter((p) => p.status === 'Menunggu').length
    const pendingChain = blockchainEvents.filter((b) => b.status === 'Pending').length
    return { totalWorkers, totalEmployers, activeJobs, activeContracts, pendingPayments, pendingChain }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan platform: transparansi, keamanan, dan akses kerja buruh harian lepas."
        actions={
          <>
            <button className="btn-secondary" type="button">
              Ekspor Laporan
            </button>
            <button className="btn-primary" type="button">
              Buat Pengumuman
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Buruh" value={String(stats.totalWorkers)} hint="Akun terdaftar" icon={<Users className="h-4 w-4" />} trend={{ value: '+6% minggu ini', positive: true }} />
        <StatCard title="Total Pemberi Kerja" value={String(stats.totalEmployers)} hint="Akun perusahaan/individu" icon={<Briefcase className="h-4 w-4" />} trend={{ value: '+2% minggu ini', positive: true }} />
        <StatCard title="Pekerjaan Aktif" value={String(stats.activeJobs)} hint="Lowongan terbuka" icon={<Briefcase className="h-4 w-4" />} trend={{ value: '-1% minggu ini', positive: false }} />
        <StatCard title="Kontrak Berjalan" value={String(stats.activeContracts)} hint="Kontrak aktif" icon={<FileText className="h-4 w-4" />} />
        <StatCard title="Pembayaran Menunggu" value={String(stats.pendingPayments)} hint="Butuh verifikasi/settlement" icon={<Wallet className="h-4 w-4" />} />
        <StatCard title="Tx Blockchain Pending" value={String(stats.pendingChain)} hint="Simulasi status jaringan" icon={<Blocks className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">Aktivitas Terbaru</div>
            <Badge tone="blue">Realtime (dummy)</Badge>
            <div className="flex-1" />
            <button className="btn-secondary" type="button">
              Lihat Semua
            </button>
          </div>

          <div className="mt-4">
            <Table
              columns={[
                { key: 'time', title: 'Waktu', className: 'whitespace-nowrap' },
                {
                  key: 'type',
                  title: 'Tipe',
                  className: 'whitespace-nowrap',
                  render: (r) => (
                    <Badge
                      tone={
                        r.type === 'PAYMENT_SETTLED'
                          ? 'green'
                          : r.type === 'WAGE_AGREED'
                            ? 'blue'
                            : r.type === 'CONTRACT_CREATED'
                              ? 'amber'
                              : 'slate'
                      }
                    >
                      {r.type}
                    </Badge>
                  )
                },
                { key: 'ref', title: 'Ref', className: 'whitespace-nowrap' },
                { key: 'summary', title: 'Ringkasan' },
                {
                  key: 'status',
                  title: 'Status',
                  className: 'whitespace-nowrap',
                  render: (r) => <Badge tone={r.status === 'Confirmed' ? 'green' : 'amber'}>{r.status}</Badge>
                }
              ]}
              rows={blockchainEvents.slice(0, 6)}
            />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <div className="text-sm font-semibold">Tujuan & Manfaat</div>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold">Tujuan</div>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600">
                <li>Mempertemukan buruh & pemberi kerja secara cepat, mudah, transparan.</li>
                <li>Kontrak digital sederhana terdokumentasi.</li>
                <li>Transparansi upah melalui kesepakatan digital terintegrasi.</li>
                <li>Pelatihan interaktif untuk meningkatkan kompetensi.</li>
                <li>Profil sosial & rating dua arah (portofolio dan apresiasi).</li>
                <li>Integrasi program jaminan sosial untuk perlindungan buruh.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold">Catatan Implementasi (Frontend)</div>
              <div className="mt-1 text-slate-600 leading-5">
                Komponen “Audit Blockchain” di UI ini menampilkan <span className="font-medium">hash/txId</span> dan status konfirmasi sebagai simulasi (tanpa backend).
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold">Kesehatan Platform</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Akun buruh terverifikasi</div>
            <div className="mt-1 text-lg font-semibold">
              {workers.filter((w) => w.verified === 'Terverifikasi').length}/{workers.length}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Akun pemberi kerja terverifikasi</div>
            <div className="mt-1 text-lg font-semibold">
              {employers.filter((e) => e.verified === 'Terverifikasi').length}/{employers.length}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Kontrak sengketa</div>
            <div className="mt-1 text-lg font-semibold">{contracts.filter((c) => c.status === 'Sengketa').length}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Pembayaran gagal</div>
            <div className="mt-1 text-lg font-semibold">{payments.filter((p) => p.status === 'Gagal').length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
