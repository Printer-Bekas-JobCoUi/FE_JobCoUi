import React, { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { Job, jobs as seed } from '../data/mock'

export default function Jobs() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Aktif' | 'Selesai' | 'Draf'>('Semua')
  const [selected, setSelected] = useState<Job | null>(null)
  const [openCreate, setOpenCreate] = useState(false)

  const rows = useMemo(() => {
    return seed
      .filter((j) => (status === 'Semua' ? true : j.status === status))
      .filter((j) => (q ? (j.title + j.lokasi + j.id).toLowerCase().includes(q.toLowerCase()) : true))
  }, [q, status])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pekerjaan"
        description="Kelola lowongan/proyek: status, pelamar, dan histori."
        actions={
          <>
            <button className="btn-secondary" type="button">
              Ekspor
            </button>
            <button className="btn-primary" type="button" onClick={() => setOpenCreate(true)}>
              Buat Pekerjaan
            </button>
          </>
        }
      />

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Cari</span>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Judul / lokasi / ID" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Status</span>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option>Semua</option>
              <option>Aktif</option>
              <option>Selesai</option>
              <option>Draf</option>
            </select>
          </label>
          <div className="flex items-end">
            <button className="btn-secondary w-full" type="button">
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <Table
          columns={[
            { key: 'id', title: 'ID', className: 'whitespace-nowrap' },
            {
              key: 'title',
              title: 'Judul',
              render: (r) => (
                <button className="font-semibold hover:underline" onClick={() => setSelected(r)} type="button">
                  {r.title}
                </button>
              )
            },
            { key: 'lokasi', title: 'Lokasi', className: 'whitespace-nowrap' },
            { key: 'upah', title: 'Upah', className: 'whitespace-nowrap' },
            {
              key: 'status',
              title: 'Status',
              className: 'whitespace-nowrap',
              render: (r) => (
                <Badge tone={r.status === 'Aktif' ? 'green' : r.status === 'Draf' ? 'amber' : 'slate'}>{r.status}</Badge>
              )
            },
            { key: 'pelamar', title: 'Pelamar', className: 'whitespace-nowrap' },
            { key: 'dibuat', title: 'Dibuat', className: 'whitespace-nowrap' },
            {
              key: 'actions',
              title: '',
              className: 'whitespace-nowrap text-right',
              render: (r) => (
                <div className="flex justify-end gap-2">
                  <button className="btn-secondary" type="button" onClick={() => setSelected(r)}>
                    Detail
                  </button>
                  <button className="btn-secondary" type="button">
                    Edit
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
        title={selected ? `Detail Pekerjaan • ${selected.title}` : 'Detail'}
        onClose={() => setSelected(null)}
        footer={
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setSelected(null)} type="button">
              Tutup
            </button>
            <button className="btn-primary" type="button">
              Simpan
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
              <div className="font-semibold">{selected.lokasi}</div>
              <div className="mt-3 text-xs text-slate-500">Upah</div>
              <div className="font-semibold">{selected.upah}</div>
              <div className="mt-3">
                <Badge tone={selected.status === 'Aktif' ? 'green' : selected.status === 'Draf' ? 'amber' : 'slate'}>
                  {selected.status}
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
                <textarea className="input min-h-[140px]" defaultValue="Tuliskan kebutuhan pekerjaan, durasi, dan kriteria..." />
              </label>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={openCreate}
        title="Buat Pekerjaan Baru"
        onClose={() => setOpenCreate(false)}
        footer={
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setOpenCreate(false)} type="button">
              Batal
            </button>
            <button className="btn-primary" type="button" onClick={() => setOpenCreate(false)}>
              Simpan (dummy)
            </button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Judul</span>
            <input className="input" placeholder="Contoh: Angkut material proyek 3 hari" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Lokasi</span>
              <input className="input" placeholder="Contoh: Bekasi" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Upah</span>
              <input className="input" placeholder="Contoh: Rp 180.000/hari" />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Status</span>
            <select className="input" defaultValue="Draf">
              <option>Draf</option>
              <option>Aktif</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Deskripsi</span>
            <textarea className="input min-h-[140px]" placeholder="Tulis detail pekerjaan..." />
          </label>
        </div>
      </Modal>
    </div>
  )
}
