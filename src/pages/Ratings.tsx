import React, { useMemo, useState, useEffect } from 'react'
import { Search, Filter, RefreshCcw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { admin } from '../services/api'

export default function Ratings() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Tampil' | 'Perlu Moderasi'>('Semua')
  const [selected, setSelected] = useState<any | null>(null)
  const [ratings, setRatings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchRatings = async () => {
    setLoading(true)
    try {
      const res = await admin.getRatings({
        search: q
      })
      if (res.data.success) {
        setRatings(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch ratings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch on mount or manual refresh for now, 
    // or we could add q as dependency with debounce
    fetchRatings()
  }, [])

  // Removed client-side search logic as it's now handled by the server

  // Pagination calculations
  const totalPages = Math.ceil(ratings.length / itemsPerPage)
  const paginatedRatings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return ratings.slice(startIndex, endIndex)
  }, [ratings, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [status, q])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rating & Apresiasi"
        description="Rating dua arah untuk membangun reputasi serta apresiasi kerja."
        actions={<></>}
      />

      <div className="card p-5">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          <div className="relative flex-1 w-full text-slate-500 focus-within:text-blue-600 transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <input
              className="input pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all outline-none"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRatings()}
              placeholder="From / To / komentar / ID... (Tekan Enter)"
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
                <option>Tampil</option>
                <option>Perlu Moderasi</option>
              </select>
            </div>
            <button
              className="btn-secondary px-3"
              type="button"
              onClick={() => { setQ(""); setStatus("Semua"); fetchRatings(); }}
              title="Reset Filter"
            >
              <RefreshCcw className={`h-4 w-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div>
        <Table
          loading={loading}
          columns={[
            { key: 'id', title: 'Audit ID', className: 'whitespace-nowrap font-mono text-[11px] text-slate-400' },
            {
              key: 'createdAt',
              title: 'Tanggal',
              className: 'whitespace-nowrap text-[11px] text-slate-500',
              render: (r: any) => new Date(r.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            },
            {
              key: 'fromUser',
              title: 'Pemberi (Auditor)',
              render: (r: any) => (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                    {r.fromUser?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{r.fromUser?.name || 'System'}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tight">{r.fromUser?.role === 'employer' ? 'Employer' : 'Worker'}</span>
                  </div>
                </div>
              )
            },
            {
              key: 'toUser',
              title: 'Penerima (Auditee)',
              render: (r: any) => (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100">
                    {r.toUser?.name?.charAt(0) || 'B'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{r.toUser?.name || 'System'}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tight">{r.toUser?.role === 'worker' ? 'Worker' : 'Employer'}</span>
                  </div>
                </div>
              )
            },
            {
              key: 'score',
              title: 'Rating & Skor',
              className: 'whitespace-nowrap',
              render: (r: any) => (
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500 text-lg leading-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < r.score ? 'drop-shadow-sm' : 'opacity-10'}>★</span>
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded-md leading-none border border-amber-200">{r.score}.0</span>
                </div>
              )
            },
            {
              key: 'comment',
              title: 'Feedback Pesan',
              className: 'max-w-xs',
              render: (r: any) => (
                <p className="truncate text-xs text-slate-500 italic leading-relaxed" title={r.comment}>
                  "{r.comment || 'Tidak ada komentar terpilih.'}"
                </p>
              )
            },
            {
              key: 'actions',
              title: 'Opsi',
              className: 'whitespace-nowrap text-center',
              render: (r: any) => (
                <div className="flex justify-center gap-2">
                  <button className="btn-primary text-[11px] h-7 px-5 shadow-sm shadow-blue-500/10" type="button" onClick={() => setSelected(r)}>
                    Inspect
                  </button>
                </div>
              )
            }
          ]}
          rows={paginatedRatings}
          emptyText="Tidak ada riwayat rating dan audit ditemukan."
        />
      </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        open={!!selected}
        title={selected ? `Review Rating • ${selected.id}` : 'Review'}
        onClose={() => setSelected(null)}
        footer={
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setSelected(null)} type="button">
              Tutup
            </button>
            <button className="btn-danger" type="button">
              Sembunyikan
            </button>
            <button className="btn-primary" type="button">
              Tampilkan
            </button>
          </div>
        }
      >
        {selected && (
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Dari</div>
              <div className="font-semibold">{selected.fromUser?.name}</div>
              <div className="mt-3 text-xs text-slate-500">Untuk</div>
              <div className="font-semibold">{selected.toUser?.name}</div>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone="blue">{selected.fromUser?.role === 'employer' ? 'Pemberi Kerja' : 'Buruh'}</Badge>
                <Badge tone="green">Tampil</Badge>
              </div>
              <div className="mt-3 text-xs text-slate-500">Skor</div>
              <div className="text-lg font-semibold">{selected.score}/5</div>
            </div>

            <div className="grid gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Komentar</div>
                <div className="mt-1">{selected.comment || 'Tanpa komentar.'}</div>
              </div>

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-600">Catatan Moderasi</span>
                <textarea className="input min-h-[110px]" placeholder="Mis: mengandung SARA / kata kasar / tidak relevan..." />
              </label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
