import React, { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { blockchainEvents, Contract, contracts as seed } from '../data/mock'
import { Copy, ExternalLink } from 'lucide-react'

export default function Contracts() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Draft' | 'Aktif' | 'Selesai' | 'Sengketa'>('Semua')
  const [selected, setSelected] = useState<Contract | null>(null)
  const [openVerify, setOpenVerify] = useState(false)

  const rows = useMemo(() => {
    return seed
      .filter((c) => (status === 'Semua' ? true : c.status === status))
      .filter((c) => (q ? (c.id + c.jobTitle + c.worker + c.employer).toLowerCase().includes(q.toLowerCase()) : true))
  }, [q, status])

  const relatedEvents = useMemo(() => {
    if (!selected) return []
    return blockchainEvents.filter((e) => e.ref === selected.id)
  }, [selected])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Kontrak Digital"
        description="Kontrak sederhana yang terdokumentasi + bukti hash (simulasi keamanan)."
        actions={
          <>
            <button className="btn-secondary" type="button">
              Template Kontrak
            </button>
            <button className="btn-primary" type="button">
              Buat Kontrak
            </button>
          </>
        }
      />

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Cari</span>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ID / pekerjaan / buruh / pemberi kerja" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Status</span>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option>Semua</option>
              <option>Draft</option>
              <option>Aktif</option>
              <option>Selesai</option>
              <option>Sengketa</option>
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
            { key: 'jobTitle', title: 'Pekerjaan' },
            { key: 'worker', title: 'Buruh', className: 'whitespace-nowrap' },
            { key: 'employer', title: 'Pemberi Kerja', className: 'whitespace-nowrap' },
            { key: 'periode', title: 'Periode', className: 'whitespace-nowrap' },
            { key: 'upah', title: 'Upah', className: 'whitespace-nowrap' },
            {
              key: 'status',
              title: 'Status',
              className: 'whitespace-nowrap',
              render: (r) => (
                <Badge tone={r.status === 'Aktif' ? 'green' : r.status === 'Sengketa' ? 'rose' : r.status === 'Draft' ? 'amber' : 'slate'}>
                  {r.status}
                </Badge>
              )
            },
            { key: 'hash', title: 'Hash', className: 'whitespace-nowrap font-mono text-xs' },
            {
              key: 'actions',
              title: '',
              className: 'whitespace-nowrap text-right',
              render: (r) => (
                <div className="flex justify-end gap-2">
                  <button className="btn-secondary" type="button" onClick={() => setSelected(r)}>
                    Detail
                  </button>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => {
                      setSelected(r)
                      setOpenVerify(true)
                    }}
                  >
                    Verifikasi
                  </button>
                </div>
              )
            }
          ]}
          rows={rows}
        />
      </div>

      <Modal
        open={!!selected && !openVerify}
        title={selected ? `Detail Kontrak • ${selected.id}` : 'Detail'}
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
              <div className="text-xs text-slate-500">Pekerjaan</div>
              <div className="font-semibold">{selected.jobTitle}</div>
              <div className="mt-3 text-xs text-slate-500">Pihak</div>
              <div className="font-semibold">{selected.worker}</div>
              <div className="text-slate-600">↔ {selected.employer}</div>
              <div className="mt-3 text-xs text-slate-500">Periode</div>
              <div className="font-semibold">{selected.periode}</div>
              <div className="mt-3 text-xs text-slate-500">Upah</div>
              <div className="font-semibold">{selected.upah}</div>
              <div className="mt-3">
                <Badge tone={selected.status === 'Aktif' ? 'green' : selected.status === 'Sengketa' ? 'rose' : selected.status === 'Draft' ? 'amber' : 'slate'}>
                  {selected.status}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Contract Hash (simulasi)</div>
                <div className="mt-1 font-mono text-xs break-all">{selected.hash}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => navigator.clipboard.writeText(selected.hash)}
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </button>
                  <button className="btn-secondary" type="button" onClick={() => setOpenVerify(true)}>
                    <ExternalLink className="h-4 w-4" /> Lihat Proof
                  </button>
                </div>
              </div>

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-600">Catatan Kontrak</span>
                <textarea className="input min-h-[110px]" placeholder="Mis: jam kerja, alat kerja, ketentuan tambahan..." />
              </label>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={openVerify}
        title={selected ? `Verifikasi Blockchain • ${selected.id}` : 'Verifikasi Blockchain'}
        onClose={() => setOpenVerify(false)}
        footer={
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setOpenVerify(false)} type="button">
              Tutup
            </button>
            <button className="btn-primary" type="button" onClick={() => setOpenVerify(false)}>
              Tandai Terverifikasi (dummy)
            </button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold">Proof (Simulasi)</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-500">Kontrak</div>
                  <div className="font-semibold">{selected.id}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Hash</div>
                  <div className="font-mono text-xs break-all">{selected.hash}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600 leading-5">
                Di implementasi blockchain sungguhan, bagian ini biasanya memuat: chainId, blockNumber, txHash, dan/atau
                merkle proof untuk membuktikan data kontrak tidak diubah.
              </div>
            </div>

            <div className="card">
              <div className="px-4 py-3 border-b border-slate-200 font-semibold">Event terkait</div>
              <div className="p-0">
                <Table
                  columns={[
                    { key: 'time', title: 'Waktu', className: 'whitespace-nowrap' },
                    { key: 'summary', title: 'Ringkasan' },
                    { key: 'block', title: 'Block', className: 'whitespace-nowrap' },
                    {
                      key: 'status',
                      title: 'Status',
                      className: 'whitespace-nowrap',
                      render: (r) => <Badge tone={r.status === 'Confirmed' ? 'green' : 'amber'}>{r.status}</Badge>
                    }
                  ]}
                  rows={relatedEvents}
                  emptyText="Belum ada event pada audit log untuk kontrak ini."
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
