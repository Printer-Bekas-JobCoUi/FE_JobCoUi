import React, { useMemo, useState, useEffect } from 'react'
import { Copy, Search, Filter, RefreshCcw, ExternalLink } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { admin } from '../services/api'

export default function Payments() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Menunggu' | 'Berhasil' | 'Gagal' | 'Batal'>('Semua')
  const [selected, setSelected] = useState<any | null>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredPayments.slice(startIndex, endIndex)
  }, [filteredPayments, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [status, q])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upah & Pembayaran"
        description="Transparansi upah, alur pembayaran, dan status penyelesaian."
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
              onKeyDown={(e) => e.key === 'Enter' && fetchPayments()}
              placeholder="ID / kontrak / pihak... (Tekan Enter)"
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
      </div>

      <div className="card overflow-hidden border-none shadow-none bg-transparent">
        <Table
          loading={loading}
          columns={[
              { key: 'id', title: 'ID Transaksi', className: 'whitespace-nowrap font-mono text-[11px] text-slate-400' },
              { key: 'contractId', title: 'Kontrak', className: 'whitespace-nowrap text-xs text-slate-500', render: (r) => r.contractId || '-' },
              {
                key: 'payer',
                title: 'Pengirim',
                render: (r) => (
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{r.sender?.name || 'System'}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tight">Payer</span>
                  </div>
                )
              },
              {
                key: 'payee',
                title: 'Penerima',
                render: (r) => (
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{r.receiver?.name || 'System'}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tight">Payee</span>
                  </div>
                )
              },
              {
                key: 'amount',
                title: 'Nominal',
                className: 'whitespace-nowrap font-bold text-blue-600',
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
                title: 'Opsi',
                className: 'whitespace-nowrap text-center',
                render: (r) => (
                  <div className="flex justify-center gap-2">
                  <button className="btn-primary text-[11px] h-7 px-5 shadow-sm shadow-blue-500/10" onClick={() => setSelected(r)} type="button">
                    Detail
                  </button>
                </div>
                )
              }
            ]}
          rows={paginatedPayments}
          emptyText="Tidak ada riwayat pembayaran yang ditemukan."
        />
      </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

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
