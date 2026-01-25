import React, { useMemo, useState } from 'react'
import { Copy, Search, Filter, RefreshCcw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { payments as seed, Payment, blockchainEvents } from '../data/mock'

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
    <div className="space-y-6">
      <PageHeader
        title="Upah & Pembayaran"
        description="Transparansi upah, alur pembayaran, dan status penyelesaian."
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-end sm:items-center gap-4">
                <div className="relative flex-1 w-full text-slate-500 focus-within:text-blue-600 transition-colors">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                    <input 
                        className="input pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all outline-none" 
                        value={q} 
                        onChange={(e) => setQ(e.target.value)} 
                        placeholder="ID / kontrak / pihak..." 
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
                          <option>Menunggu</option>
                          <option>Berhasil</option>
                          <option>Gagal</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-0">
                <Table
                  className="border-none shadow-none rounded-none"
                  columns={[
                    { key: 'id', title: 'ID', className: 'whitespace-nowrap pl-6 font-mono text-xs text-slate-500' },
                    { key: 'contractId', title: 'Kontrak', className: 'whitespace-nowrap text-xs text-slate-500' },
                    { 
                        key: 'payer', 
                        title: 'Dari',
                        render: (r) => <div className="font-semibold text-slate-700">{r.payer}</div>
                    },
                    { 
                        key: 'payee', 
                        title: 'Ke',
                        render: (r) => <div className="font-semibold text-slate-700">{r.payee}</div>
                    },
                    { 
                        key: 'amount', 
                        title: 'Jumlah', 
                        className: 'whitespace-nowrap font-medium text-slate-900',
                    },
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
                      className: 'whitespace-nowrap text-right pr-6',
                      render: (r) => (
                        <div className="flex justify-end gap-2">
                          <button className="btn-secondary text-xs h-8 px-3" onClick={() => setSelected(r)} type="button">
                            Detail
                          </button>
                        </div>
                      )
                    }
                  ]}
                  rows={rows}
                />
            </div>
        </div>

        <div className="card h-fit">
            <div className="p-5 border-b border-slate-100">
                <div className="text-sm font-bold text-slate-800">Aturan Transparansi</div>
            </div>
            <div className="p-5 text-sm text-slate-600 space-y-4 leading-relaxed">
                <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <div>
                        <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-1">Kesepakatan Upah</div>
                        Upah ditetapkan di awal (kontrak) dan disimpan sebagai <span className="font-medium text-slate-800">immutable record</span>.
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <div>
                        <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-1">Escrow</div>
                        Dana dapat ditahan sementara (escrow) untuk mengurangi risiko sengketa.
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <div>
                        <div className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-1">Audit Trail</div>
                        Setiap transaksi memiliki <span className="font-mono text-xs bg-slate-100 px-1 rounded">txHash</span> unik untuk verifikasi publik.
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
