import React, { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { RatingEntry, ratings as seed } from '../data/mock'

export default function Ratings() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Tampil' | 'Perlu Moderasi'>('Semua')
  const [selected, setSelected] = useState<RatingEntry | null>(null)

  const rows = useMemo(() => {
    return seed
      .filter((r) => (status === 'Semua' ? true : r.status === status))
      .filter((r) => (q ? (r.from + r.to + r.comment + r.id).toLowerCase().includes(q.toLowerCase()) : true))
  }, [q, status])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Rating & Apresiasi"
        description="Rating dua arah untuk membangun reputasi serta apresiasi kerja."
        actions={
          <>
            <button className="btn-secondary" type="button">
              Aturan Moderasi
            </button>
            <button className="btn-primary" type="button">
              Buat Badge Apresiasi
            </button>
          </>
        }
      />

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-600">Cari</span>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="From / To / komentar / ID" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Status</span>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option>Semua</option>
              <option>Tampil</option>
              <option>Perlu Moderasi</option>
            </select>
          </label>
        </div>
      </div>

      <div className="card">
        <Table
          columns={[
            { key: 'id', title: 'ID', className: 'whitespace-nowrap' },
            { key: 'createdAt', title: 'Tanggal', className: 'whitespace-nowrap' },
            { key: 'from', title: 'Dari' },
            { key: 'to', title: 'Untuk' },
            { key: 'role', title: 'Tipe', className: 'whitespace-nowrap' },
            {
              key: 'score',
              title: 'Skor',
              className: 'whitespace-nowrap',
              render: (r) => <span className="font-semibold">{r.score}/5</span>
            },
            { key: 'comment', title: 'Komentar' },
            {
              key: 'status',
              title: 'Status',
              className: 'whitespace-nowrap',
              render: (r) => <Badge tone={r.status === 'Tampil' ? 'green' : 'amber'}>{r.status}</Badge>
            },
            {
              key: 'actions',
              title: '',
              className: 'whitespace-nowrap text-right',
              render: (r) => (
                <div className="flex justify-end gap-2">
                  <button className="btn-secondary" type="button" onClick={() => setSelected(r)}>
                    Review
                  </button>
                  <button className="btn-primary" type="button">
                    Tampilkan
                  </button>
                </div>
              )
            }
          ]}
          rows={rows}
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
              <div className="font-semibold">{selected.from}</div>
              <div className="mt-3 text-xs text-slate-500">Untuk</div>
              <div className="font-semibold">{selected.to}</div>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone="blue">{selected.role}</Badge>
                <Badge tone={selected.status === 'Tampil' ? 'green' : 'amber'}>{selected.status}</Badge>
              </div>
              <div className="mt-3 text-xs text-slate-500">Skor</div>
              <div className="text-lg font-semibold">{selected.score}/5</div>
            </div>

            <div className="grid gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Komentar</div>
                <div className="mt-1">{selected.comment}</div>
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
