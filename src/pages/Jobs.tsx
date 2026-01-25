import React, { useMemo, useState, useEffect } from 'react'
import { Search, Filter, RefreshCcw, FileSpreadsheet } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { admin } from '../services/api'

export default function Jobs() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Aktif' | 'Selesai' | 'Draf' | 'Tutup' | 'Batal' | 'Dalam Kontrak'>('Semua')
  const [selected, setSelected] = useState<any | null>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await admin.getJobs({
        search: q,
        status: status === 'Semua' ? undefined : status
      })
      if (res.data.success) {
        setJobs(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [status]) // Fetch on status change. Search is debounced or manual triggered for better UX, but here let's do search on button or manual.

  const mapStatus = (backendStatus: string) => {
    switch (backendStatus) {
      case 'open': return 'Aktif'
      case 'in_contract': return 'Dalam Kontrak'
      case 'completed': return 'Selesai'
      case 'draft': return 'Draf'
      case 'closed': return 'Tutup'
      case 'cancelled': return 'Batal'
      default: return backendStatus
    }
  }

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  }

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / itemsPerPage)
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return jobs.slice(startIndex, endIndex)
  }, [jobs, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [status, q])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pekerjaan"
        description="Kelola lowongan, status proyek, dan pelacakan kontrak."
        actions={
          <>
            <button className="btn-primary flex items-center gap-2" type="button">
              <FileSpreadsheet className="h-4 w-4" />
              Ekspor Data (Excel)
            </button>
          </>
        }
      />

      <div className="card p-5">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <div className="relative flex-1 w-full text-slate-500 focus-within:text-blue-600 transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <input
              className="input pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all outline-none"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              placeholder="Judul, lokasi, atau ID... (Tekan Enter)"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative min-w-[140px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <select
                className="input pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option>Semua</option>
                <option>Aktif</option>
                <option>Dalam Kontrak</option>
                <option>Selesai</option>
                <option>Draf</option>
                <option>Tutup</option>
                <option>Batal</option>
              </select>
            </div>
            <button
              className="btn-secondary px-3"
              type="button"
              onClick={() => { setQ(""); setStatus("Semua"); fetchJobs(); }}
              title="Reset Filter"
            >
              <RefreshCcw className={`h-4 w-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden border-none shadow-none bg-transparent">
        <Table
          loading={loading}
          columns={[
            { key: 'id', title: 'Job ID', className: 'whitespace-nowrap font-mono text-[11px] text-slate-400' },
            {
              key: 'title',
              title: 'Posisi & Lokasi',
              render: (r) => (
                <div className="flex flex-col">
                  <button
                    className="font-bold text-left hover:text-blue-600 transition-colors text-slate-800"
                    onClick={() => setSelected(r)}
                    type="button"
                  >
                    {r.title}
                  </button>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-tight font-semibold mt-0.5">
                    <span className="text-blue-500">📍</span> {r.location}
                  </div>
                </div>
              )
            },
            {
              key: 'upah',
              title: 'Upah / Gaji',
              className: 'whitespace-nowrap font-bold text-slate-700',
              render: (r) => (
                <div className="flex flex-col">
                  <span className="text-emerald-600">{formatCurrency(r.wage)}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tight">Per Projek</span>
                </div>
              )
            },
            {
              key: 'status',
              title: 'SLA Status',
              className: 'whitespace-nowrap',
              render: (r) => {
                const s = mapStatus(r.status)
                const tones: Record<string, 'green' | 'blue' | 'amber' | 'slate' | 'rose'> = {
                  'Aktif': 'green',
                  'Dalam Kontrak': 'blue',
                  'Selesai': 'slate',
                  'Draf': 'amber',
                  'Tutup': 'slate',
                  'Batal': 'rose'
                }
                return <Badge tone={tones[s] || 'slate'}>{s}</Badge>
              }
            },
            {
              key: 'pelamar',
              title: 'Kandidat',
              className: 'whitespace-nowrap',
              render: (r) => (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-600">{r.applications?.length || 0}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium tracking-tight">Pelamar</span>
                </div>
              )
            },
            {
              key: 'dibuat',
              title: 'Publish Date',
              className: 'whitespace-nowrap text-[11px] text-slate-400 font-mono',
              render: (r) => new Date(r.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            },
            {
              key: 'actions',
              title: 'Opsi',
              className: 'whitespace-nowrap text-center',
              render: (r) => (
                <div className="flex justify-center gap-2">
                  <button className="btn-primary text-[10px] h-7 px-5 shadow-sm shadow-blue-500/10" type="button" onClick={() => setSelected(r)}>
                    Manage
                  </button>
                </div>
              )
            }
          ]}
          rows={paginatedJobs}
          emptyText="Tidak ada lowongan pekerjaan ditemukan."
        />
      </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      <Modal
        open={!!selected}
        title={selected ? `Detail Pekerjaan • ${selected.title}` : 'Detail'}
        onClose={() => setSelected(null)}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button className="btn-secondary border-slate-200 text-slate-600 px-6 font-bold" onClick={() => setSelected(null)} type="button">
              Tutup
            </button>
            <button className="btn-primary px-8 font-bold shadow-lg shadow-blue-500/20" type="button">
              Simpan Perubahan
            </button>
          </div>
        }
      >
        {selected && (
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">ID</div>
              <div className="font-semibold">{selected.id}</div>
              <div className="mt-3 text-xs text-slate-500">Lokasi</div>
              <div className="font-semibold">{selected.location}</div>
              <div className="mt-3 text-xs text-slate-500">Upah</div>
              <div className="font-semibold">{formatCurrency(selected.wage)}</div>
              <div className="mt-3">
                <Badge tone={mapStatus(selected.status) === 'Aktif' ? 'green' : mapStatus(selected.status) === 'Draf' ? 'amber' : 'slate'}>
                  {mapStatus(selected.status)}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-600">Judul</span>
                <input className="input" defaultValue={selected.title} />
              </label>
              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-600">Deskripsi</span>
                <textarea className="input min-h-[140px]" defaultValue={selected.description} />
              </label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
