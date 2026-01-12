import React, { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { payments as seed, Payment, blockchainEvents } from '../data/mock'
import { Copy } from 'lucide-react'

export default function Payments() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Menunggu' | 'Berhasil' | 'Gagal'>('Semua')
  const [selected, setSelected] = useState<Payment | null>(null)

  const rows = useMemo(() => {
    return seed
      .filter((p) => (status === 'Semua' ? true : p.status === status))
      .filter((p) => (q ? (p.id + p.contractId + p.payer + p.payee).toLowerCase().includes(q.toLowerCase()) : true))
  }, [q, status])

  const relatedChain = useMemo(() => {
    if (!selected) return []
    return blockchainEvents.filter((e) => e.ref === selected.id)
  }, [selected])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Upah & Pembayaran"
        description="Transparansi upah dan alur pembayaran. (UI demo dengan data contoh)"
        actions={
          <>
            <button className="btn-secondary" type="button">
              Rekonsiliasi
            </button>
            <button className="btn-primary" type="button">
              Buat Aturan Escrow
            </button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">Daftar Pembayaran</div>
            <Badge tone="blue">Kesepakatan digital</Badge>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 sm:col-span-2">
              <span className="text-xs font-semibold text-slate-600">Cari</span>
              <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ID / kontrak / pihak" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Status</span>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option>Semua</option>
                <option>Menunggu</option>
                <option>Berhasil</option>
                <option>Gagal</option>
              </select>
            </label>
          </div>

          <div className="mt-4 card">
            <Table
              columns={[
                { key: 'id', title: 'ID', className: 'whitespace-nowrap' },
                { key: 'contractId', title: 'Kontrak', className: 'whitespace-nowrap' },
                { key: 'payer', title: 'Dari' },
                { key: 'payee', title: 'Ke' },
                { key: 'amount', title: 'Jumlah', className: 'whitespace-nowrap' },
                { key: 'method', title: 'Metode', className: 'whitespace-nowrap' },
                {
                  key: 'status',
                  title: 'Status',
                  className: 'whitespace-nowrap',
                  render: (r) => (
                    <Badge tone={r.status === 'Berhasil' ? 'green' : r.status === 'Menunggu' ? 'amber' : 'rose'}>{r.status}</Badge>
                  )
                },
                {
                  key: 'actions',
                  title: '',
                  className: 'whitespace-nowrap text-right',
                  render: (r) => (
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary" onClick={() => setSelected(r)} type="button">
                        Detail
                      </button>
                      <button className="btn-primary" type="button">
                        Verifikasi
                      </button>
                    </div>
                  )
                }
              ]}
              rows={rows}
            />
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold">Aturan Transparansi (UI)</div>
          <div className="mt-3 text-sm text-slate-600 space-y-2 leading-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">1) Kesepakatan Upah</div>
              <div className="mt-1">
                Upah ditetapkan di awal (kontrak), lalu disimpan sebagai <span className="font-medium">record</span> yang
                bisa ditampilkan kembali.
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">2) Escrow (opsional)</div>
              <div className="mt-1">
                Dana dapat ditahan sementara untuk mengurangi risiko perselisihan pembayaran.
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">3) Audit Blockchain (simulasi)</div>
              <div className="mt-1">
                UI menampilkan <span className="font-medium">txHash</span> dan status konfirmasi untuk transparansi.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={!!selected}
        title={selected ? `Detail Pembayaran • ${selected.id}` : 'Detail'}
        onClose={() => setSelected(null)}
        footer={
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setSelected(null)} type="button">
              Tutup
            </button>
            <button className="btn-primary" type="button">
              Update Status (dummy)
            </button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Kontrak</div>
                <div className="font-semibold">{selected.contractId}</div>
                <div className="mt-3 text-xs text-slate-500">Dari</div>
                <div className="font-semibold">{selected.payer}</div>
                <div className="mt-3 text-xs text-slate-500">Ke</div>
                <div className="font-semibold">{selected.payee}</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Jumlah</div>
                <div className="text-lg font-semibold">{selected.amount}</div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge tone={selected.status === 'Berhasil' ? 'green' : selected.status === 'Menunggu' ? 'amber' : 'rose'}>{selected.status}</Badge>
                  <Badge tone="slate">{selected.method}</Badge>
                </div>

                <div className="mt-3 text-xs text-slate-500">Tx Hash (simulasi)</div>
                <div className="mt-1 font-mono text-xs break-all">{selected.txHash}</div>
                <div className="mt-3">
                  <button className="btn-secondary" type="button" onClick={() => navigator.clipboard.writeText(selected.txHash)}>
                    <Copy className="h-4 w-4" /> Copy TxHash
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="px-4 py-3 border-b border-slate-200 font-semibold">Audit Log terkait</div>
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
                rows={relatedChain}
                emptyText="Belum ada event pada audit log untuk pembayaran ini."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
