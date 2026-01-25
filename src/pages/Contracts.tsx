import React, { useMemo, useState, useEffect } from 'react'
import { Copy, ExternalLink, Search, Filter, RefreshCcw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { admin } from '../services/api'

export default function Contracts() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'Semua' | 'Draft' | 'Aktif' | 'Selesai' | 'Batal'>('Semua')
  const [selected, setSelected] = useState<any | null>(null)
  const [openVerify, setOpenVerify] = useState(false)
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const res = await admin.getContracts({
        search: q,
        status: status === 'Semua' ? undefined : status
      })
      if (res.data.success) {
        setContracts(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch contracts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [status])

  const mapStatus = (backendStatus: string) => {
    switch (backendStatus) {
      case 'draft': return 'Draft'
      case 'active':
      case 'funded':
      case 'in_progress':
        return 'Aktif'
      case 'completed':
      case 'approved':
        return 'Selesai'
      case 'cancelled':
        return 'Batal'
      default: return backendStatus
    }
  }

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  }

  const filteredContracts = useMemo(() => {
    if (!q) return contracts;
    return contracts.filter(c =>
      c.contractNumber?.toLowerCase().includes(q.toLowerCase()) ||
      c.job?.title?.toLowerCase().includes(q.toLowerCase()) ||
      c.worker?.name?.toLowerCase().includes(q.toLowerCase()) ||
      c.employer?.name?.toLowerCase().includes(q.toLowerCase())
    );
  }, [contracts, q]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kontrak Digital"
        description="Pencatatan perjanjian kerja, bukti hash, dan status legalitas digital."
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
              placeholder="ID, Pekerjaan, atau Nama..."
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
                <option>Draft</option>
                <option>Aktif</option>
                <option>Selesai</option>
                <option>Batal</option>
              </select>
            </div>
            <button
              className="btn-secondary px-3"
              type="button"
              onClick={() => { setQ(""); setStatus("Semua"); fetchContracts(); }}
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
            { key: 'id', title: 'ID', className: 'whitespace-nowrap font-mono text-xs text-slate-500', render: (r) => r.contractNumber || r.id },
            {
              key: 'jobTitle',
              title: 'Pekerjaan',
              render: (r) => <span className="font-semibold text-slate-700">{r.job?.title}</span>
            },
            { key: 'worker', title: 'Buruh', className: 'whitespace-nowrap text-sm text-slate-600', render: (r) => r.worker?.name },
            { key: 'employer', title: 'Pemberi Kerja', className: 'whitespace-nowrap text-sm text-slate-600', render: (r) => r.employer?.name },
            {
              key: 'periode',
              title: 'Periode',
              className: 'whitespace-nowrap text-xs',
              render: (r) => r.startedAt ? `${new Date(r.startedAt).toLocaleDateString('id-ID')} - ${r.finishedAt ? new Date(r.finishedAt).toLocaleDateString('id-ID') : '?'}` : '-'
            },
            {
              key: 'upah',
              title: 'Upah',
              className: 'whitespace-nowrap font-medium text-slate-900',
              render: (r) => formatCurrency(r.agreedWage)
            },
            {
              key: 'status',
              title: 'Status',
              className: 'whitespace-nowrap',
              render: (r) => {
                const s = mapStatus(r.status)
                return (
                  <Badge tone={s === 'Aktif' ? 'green' : s === 'Batal' ? 'rose' : s === 'Draft' ? 'amber' : 'slate'}>
                    {s}
                  </Badge>
                )
              }
            },
            { key: 'hash', title: 'Hash', className: 'whitespace-nowrap font-mono text-[10px] text-slate-400', render: (r) => r.chainTxHash ? `${r.chainTxHash.substring(0, 10)}...` : '-' },
            {
              key: 'actions',
              title: '',
              className: 'whitespace-nowrap text-right pr-4',
              render: (r) => (
                <div className="flex justify-end gap-2">
                  <button className="btn-secondary text-xs h-8 px-3" type="button" onClick={() => setSelected(r)}>
                    Detail
                  </button>
                </div>
              )
            }
          ]}
          rows={filteredContracts}
          emptyText={loading ? 'Memuat data...' : 'Tidak ada kontrak ditemukan.'}
        />
      </div>

      <Modal
        open={!!selected && !openVerify}
        title={selected ? `Detail Kontrak • ${selected.contractNumber || selected.id}` : 'Detail'}
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
              <div className="font-semibold">{selected.job?.title}</div>
              <div className="mt-3 text-xs text-slate-500">Pihak</div>
              <div className="font-semibold">{selected.worker?.name}</div>
              <div className="text-slate-600">↔ {selected.employer?.name}</div>
              <div className="mt-3 text-xs text-slate-500">Periode</div>
              <div className="font-semibold">
                {selected.startedAt ? `${new Date(selected.startedAt).toLocaleDateString('id-ID')} - ${selected.finishedAt ? new Date(selected.finishedAt).toLocaleDateString('id-ID') : '?'}` : '-'}
              </div>
              <div className="mt-3 text-xs text-slate-500">Upah</div>
              <div className="font-semibold">{formatCurrency(selected.agreedWage)}</div>
              <div className="mt-3">
                <Badge tone={mapStatus(selected.status) === 'Aktif' ? 'green' : mapStatus(selected.status) === 'Sengketa' ? 'rose' : mapStatus(selected.status) === 'Draft' ? 'amber' : 'slate'}>
                  {mapStatus(selected.status)}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Contract Hash</div>
                <div className="mt-1 font-mono text-xs break-all">{selected.chainTxHash || 'Belum terdaftar di blockchain'}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-secondary"
                    type="button"
                    disabled={!selected.chainTxHash}
                    onClick={() => selected.chainTxHash && navigator.clipboard.writeText(selected.chainTxHash)}
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </button>
                  {selected.chainTxHash && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${selected.chainTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" /> Explorer
                    </a>
                  )}
                </div>
                {!selected.chainTxHash && <div className="mt-1 text-[10px] text-slate-400 italic">Hash belum tersedia</div>}
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
              <div className="font-semibold">Proof</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-500">Kontrak</div>
                  <div className="font-semibold">{selected.contractNumber || selected.id}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Hash</div>
                  <div className="font-mono text-xs break-all">{selected.chainTxHash || '-'}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-600 leading-5">
                {selected.chainTxHash
                  ? "Data ini telah terverifikasi pada jaringan blockchain melalui transaksi terlampir."
                  : "Kontrak ini belum memiliki catatan transaksi di blockchain."}
              </div>
            </div>

            <div className="card">
              <div className="px-4 py-3 border-b border-slate-200 font-semibold">Status Transaksi</div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${selected.chainTxHash ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="font-medium text-slate-700">{selected.chainTxHash ? 'Terdaftar di Blockchain' : 'Belum Terdaftar'}</span>
                </div>
                {selected.chainTxHash && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs leading-5">
                    Daftar event audit log akan muncul di sini setelah integrasi lengkap dengan indexing service blockchain.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
