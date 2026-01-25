import React, { useMemo, useState, useEffect } from 'react'
import { Copy, Search, Filter, RefreshCcw, ExternalLink } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { admin } from '../services/api'

export default function Payments() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Menunggu' | 'Berhasil' | 'Gagal' | 'Batal'>('Semua')
  const [selected, setSelected] = useState<any | null>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await admin.getPayments({
        search: q,
        status: status === 'Semua' ? undefined : status
      })
      if (res.data.success) {
        setPayments(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [status])

  const mapStatus = (backendStatus: string) => {
    switch (backendStatus) {
      case 'pending': return 'Menunggu'
      case 'success': return 'Berhasil'
      case 'failed': return 'Gagal'
      case 'cancelled': return 'Batal'
      default: return backendStatus
    }
  }

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  }

  const filteredPayments = useMemo(() => {
    if (!q) return payments;
    return payments.filter(p =>
      p.id.toString().includes(q) ||
      p.contractId?.toString().includes(q) ||
      p.sender?.name?.toLowerCase().includes(q.toLowerCase()) ||
      p.receiver?.name?.toLowerCase().includes(q.toLowerCase())
    );
  }, [payments, q]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upah & Pembayaran"
        description="Transparansi upah, alur pembayaran, dan status penyelesaian."
        actions={<></>}
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
                  <option>Batal</option>
                </select>
              </div>
              <button
                className="btn-secondary px-3"
                type="button"
                onClick={() => { setQ(""); setStatus("Semua"); fetchPayments(); }}
                title="Reset Filter"
              >
                <RefreshCcw className={`h-4 w-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-0">
            <Table
              className="border-none shadow-none rounded-none"
              columns={[
                { key: 'id', title: 'ID', className: 'whitespace-nowrap pl-6 font-mono text-xs text-slate-500' },
                { key: 'contractId', title: 'Kontrak', className: 'whitespace-nowrap text-xs text-slate-500', render: (r) => r.contractId || '-' },
                {
                  key: 'payer',
                  title: 'Dari',
                  render: (r) => <div className="font-semibold text-slate-700">{r.sender?.name || 'System'}</div>
                },
                {
                  key: 'payee',
                  title: 'Ke',
                  render: (r) => <div className="font-semibold text-slate-700">{r.receiver?.name || 'System'}</div>
                },
                {
                  key: 'amount',
                  title: 'Jumlah',
                  className: 'whitespace-nowrap font-medium text-slate-900',
                  render: (r) => formatCurrency(r.amount)
                },
                {
                  key: 'status',
                  title: 'Status',
                  className: 'whitespace-nowrap',
                  render: (r) => {
                    const s = mapStatus(r.status)
                    return <Badge tone={s === 'Berhasil' ? 'green' : s === 'Menunggu' ? 'amber' : 'rose'}>{s}</Badge>
                  }
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
              rows={filteredPayments}
              emptyText={loading ? 'Memuat data...' : 'Tidak ada transaksi ditemukan.'}
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
          </div>
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Kontrak</div>
                <div className="font-semibold">{selected.contractId || '-'}</div>
                <div className="mt-3 text-xs text-slate-500">Dari</div>
                <div className="font-semibold">{selected.sender?.name || 'System'}</div>
                <div className="mt-3 text-xs text-slate-500">Ke</div>
                <div className="font-semibold">{selected.receiver?.name || 'System'}</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Jumlah</div>
                <div className="text-lg font-semibold">{formatCurrency(selected.amount)}</div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge tone={mapStatus(selected.status) === 'Berhasil' ? 'green' : mapStatus(selected.status) === 'Menunggu' ? 'amber' : 'rose'}>{mapStatus(selected.status)}</Badge>
                  <Badge tone="slate">{selected.type}</Badge>
                </div>

                <div className="mt-3 text-xs text-slate-500">ID Referensi (External)</div>
                <div className="mt-1 font-mono text-xs break-all">{selected.externalRef || '-'}</div>
                <div className="mt-3 text-xs text-slate-500">Idempotency Key</div>
                <div className="mt-1 font-mono text-xs break-all text-slate-400">{selected.idempotencyKey}</div>
                <div className="mt-3 flex gap-2">
                  <button className="btn-secondary" type="button" disabled={!selected.externalRef} onClick={() => selected.externalRef && navigator.clipboard.writeText(selected.externalRef)}>
                    <Copy className="h-4 w-4" /> Copy Ref
                  </button>
                  {selected.externalRef && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${selected.externalRef}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" /> Explorer
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="px-4 py-3 border-b border-slate-200 font-semibold">Keterangan</div>
              <div className="p-4 text-slate-600 italic">
                {selected.description || 'Tidak ada deskripsi tambahan.'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
