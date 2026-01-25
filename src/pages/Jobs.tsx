import React, { useMemo, useState } from 'react'
import { Search, Filter, RefreshCcw, FileSpreadsheet } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { Job, jobs as seed } from '../data/mock'

export default function Jobs() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Aktif' | 'Selesai' | 'Draf'>('Semua')
  const [selected, setSelected] = useState<Job | null>(null)

  const rows = useMemo(() => {
    return seed
      .filter((j) => (status === 'Semua' ? true : j.status === status))
      .filter((j) => (q ? (j.title + j.lokasi + j.id).toLowerCase().includes(q.toLowerCase()) : true))
  }, [q, status])

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
              placeholder="Judul, lokasi, atau ID..." 
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
                  <option>Selesai</option>
                  <option>Draf</option>
                </select>
            </div>
            <button 
                className="btn-secondary px-3" 
                type="button" 
                onClick={() => { setQ(""); setStatus("Semua"); }}
                title="Reset Filter"
              >
               <RefreshCcw className="h-4 w-4 text-slate-500" />
             </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <Table
          columns={[
            { key: 'id', title: 'ID', className: 'whitespace-nowrap font-mono text-xs text-slate-500' },
            {
              key: 'title',
              title: 'Judul Pekerjaan',
              render: (r) => (
                <div className="flex flex-col">
                    <button 
                        className="font-semibold text-left hover:text-blue-600 hover:underline text-slate-900" 
                        onClick={() => setSelected(r)} 
                        type="button"
                    >
                      {r.title}
                    </button>
                    <span className="text-xs text-slate-500">{r.lokasi}</span>
                </div>
              )
            },
            { 
               key: 'upah', 
               title: 'Upah', 
               className: 'whitespace-nowrap font-medium text-slate-700' 
            },
            {
              key: 'status',
              title: 'Status',
              className: 'whitespace-nowrap',
              render: (r) => (
                <Badge tone={r.status === 'Aktif' ? 'green' : r.status === 'Draf' ? 'amber' : 'slate'}>{r.status}</Badge>
              )
            },
            { 
               key: 'pelamar', 
               title: 'Pelamar', 
               className: 'whitespace-nowrap text-center',
               render: (r) => (
                  <div className="text-center">
                     <span className="font-semibold">{r.pelamar}</span> <span className="text-xs text-slate-500">orang</span>
                  </div>
               )
            },
            { 
               key: 'dibuat', 
               title: 'Tanggal Dibuat', 
               className: 'whitespace-nowrap text-xs text-slate-500',
               render: (r) => r.dibuat
            },
            {
              key: 'actions',
              title: <span className="block text-right pr-4">Opsi</span>,
              className: 'whitespace-nowrap text-right',
              render: (r) => (
                <div className="flex justify-end gap-2">
                  <button className="btn-secondary text-xs h-8 px-3" type="button" onClick={() => setSelected(r)}>
                    Detail
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
    </div>
  )
}
