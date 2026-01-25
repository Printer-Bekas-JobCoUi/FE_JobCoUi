import React, { useMemo, useState, useEffect } from 'react'
import { Search, Filter, RefreshCcw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { admin } from '../services/api'

export default function Ratings() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Tampil' | 'Perlu Moderasi'>('Semua')
  const [selected, setSelected] = useState<any | null>(null)
  const [ratings, setRatings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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
        <Table
          columns={[
            { key: 'id', title: 'ID', className: 'whitespace-nowrap font-mono text-xs text-slate-500' },
            {
              key: 'createdAt',
              title: 'Tanggal',
              className: 'whitespace-nowrap text-xs text-slate-500',
              render: (r) => new Date(r.createdAt).toLocaleDateString('id-ID')
            },
            { key: 'from', title: 'Dari', render: (r) => <span className="font-semibold">{r.fromUser?.name}</span> },
            { key: 'to', title: 'Untuk', render: (r) => <span className="font-semibold">{r.toUser?.name}</span> },
            { key: 'role', title: 'Tipe', className: 'whitespace-nowrap text-xs', render: (r) => <Badge tone="blue">{r.fromUser?.role === 'employer' ? 'Pemberi Kerja' : 'Buruh'}</Badge> },
            {
              key: 'score',
              title: 'Skor',
              className: 'whitespace-nowrap',
              render: (r) => (
                <div className="flex items-center gap-1">
                  <span className="text-amber-400">★</span> <span className="font-bold">{r.score}</span>
                </div>
              )
            },
            { key: 'comment', title: 'Komentar', className: 'italic text-slate-600' },
            {
              key: 'status',
              title: 'Status',
              className: 'whitespace-nowrap',
              render: (r) => <Badge tone="green">Tampil</Badge>
            },
            {
              key: 'actions',
              title: '',
              className: 'whitespace-nowrap text-right pr-4',
              render: (r) => (
                <div className="flex justify-end gap-2">
                  <button className="btn-secondary text-xs h-8 px-3" type="button" onClick={() => setSelected(r)}>
                    Review
                  </button>
                </div>
              )
            }
          ]}
          rows={ratings}
          emptyText={loading ? 'Memuat data...' : 'Tidak ada rating ditemukan.'}
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
