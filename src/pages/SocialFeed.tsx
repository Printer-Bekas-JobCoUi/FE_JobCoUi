import React, { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { FeedPost, feed as seed } from '../data/mock'

export default function SocialFeed() {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<FeedPost | null>(null)

  const rows = useMemo(() => {
    return seed.filter((p) => (q ? (p.author + p.content + p.tags.join(' ')).toLowerCase().includes(q.toLowerCase()) : true))
  }, [q])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Feed & Portofolio"
        description="Profil sosial: aktivitas kerja, portofolio, dan apresiasi."
        actions={
          <>
            <button className="btn-secondary" type="button">
              Filter Konten
            </button>
            <button className="btn-primary" type="button">
              Buat Highlight
            </button>
          </>
        }
      />

      <div className="card p-4">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-600">Cari postingan</span>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nama / isi / tag" />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((p) => (
          <button
            key={p.id}
            className="card p-5 text-left hover:bg-slate-50/60 transition"
            type="button"
            onClick={() => setSelected(p)}
          >
            <div className="flex items-start gap-2">
              <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold">
                {p.author.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold truncate">{p.author}</div>
                  <Badge tone={p.role === 'Buruh' ? 'blue' : 'amber'}>{p.role}</Badge>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{p.createdAt}</div>
              </div>
              <div className="text-xs text-slate-500">{p.likes} suka</div>
            </div>

            <div className="mt-3 text-sm text-slate-700 leading-6">{p.content}</div>

            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="badge border-slate-200 bg-white text-slate-700">
                  #{t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <Modal
        open={!!selected}
        title={selected ? `Detail Post • ${selected.id}` : 'Detail Post'}
        onClose={() => setSelected(null)}
        footer={
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setSelected(null)} type="button">
              Tutup
            </button>
            <button className="btn-danger" type="button">
              Hapus (dummy)
            </button>
            <button className="btn-primary" type="button">
              Jadikan Highlight
            </button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{selected.author}</div>
                <Badge tone={selected.role === 'Buruh' ? 'blue' : 'amber'}>{selected.role}</Badge>
                <div className="flex-1" />
                <div className="text-xs text-slate-500">{selected.createdAt}</div>
              </div>
              <div className="mt-3 leading-6">{selected.content}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.tags.map((t) => (
                  <span key={t} className="badge border-slate-200 bg-white text-slate-700">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-slate-500">{selected.likes} suka</div>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Catatan Moderasi</span>
              <textarea className="input min-h-[110px]" placeholder="Mis: spam / menyinggung / klaim palsu..." />
            </label>
          </div>
        )}
      </Modal>
    </div>
  )
}
