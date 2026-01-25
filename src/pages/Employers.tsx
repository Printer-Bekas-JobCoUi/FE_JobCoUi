import React, { useMemo, useState } from "react";
import { Search, Filter, RefreshCcw, FileSpreadsheet } from 'lucide-react';
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { Employer, employers as seed } from "../data/mock";

export default function Employers() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"Semua" | "Aktif" | "Diblokir">("Semua");
  const [selected, setSelected] = useState<Employer | null>(null);
  const [modalMode, setModalMode] = useState<"detail" | "dokumen" | null>(null);
  const [selectedVerification, setSelectedVerification] =
    useState<string>("Terverifikasi");
  const [adminNote, setAdminNote] = useState("");

  const rows = useMemo(() => {
    return seed
      .filter((e) => (status === "Semua" ? true : e.status === status))
      .filter((e) =>
        q
          ? ((e.namaOrang || "") + e.bidang + e.domisili + e.id)
              .toLowerCase()
              .includes(q.toLowerCase())
          : true
      );
  }, [q, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pemberi Kerja"
        description="Kelola akun pemberi kerja, proses verifikasi, dan status reputasi."
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
              className="input pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nama, bidang, atau domisili..."
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative min-w-[140px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <select
                  className="input pl-9 bg-slate-50 border-slate-200"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option>Semua</option>
                  <option>Aktif</option>
                  <option>Diblokir</option>
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
            { key: "id", title: "ID", className: "whitespace-nowrap font-mono text-xs text-slate-500" },
            {
              key: "namaOrang",
              title: "Nama",
              render: (r) => (
                <div className="flex items-center gap-3">
                   {r.fotoUrl ? (
                      <img src={r.fotoUrl} alt="" className="h-9 w-9 rounded-full object-cover bg-slate-100" />
                   ) : (
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                         {(r.namaOrang || "").charAt(0)}
                      </div>
                   )}
                   <div className="flex flex-col">
                      <button
                        className="font-semibold text-slate-900 hover:text-blue-600 hover:underline text-left"
                        onClick={() => {
                            setSelected(r);
                            setModalMode("detail");
                        }}
                        type="button"
                      >
                        {r.namaOrang || "-"}
                      </button>
                      <span className="text-xs text-slate-500">{r.verified}</span>
                   </div>
                </div>
              ),
            },
            {
               key: "ktpUrl",
               title: "KTP",
               className: "whitespace-nowrap",
               render: (r) => (
                  r.ktpUrl ? (
                     <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Ada
                     </div>
                  ) : (
                     <span className="text-xs text-slate-400">-</span>
                  )
               )
            },
            { key: "bidang", title: "Bidang", className: "whitespace-nowrap font-medium text-slate-700" },
            {
              key: "contact",
              title: "Kontak",
              className: "whitespace-nowrap text-xs",
              render: (r) => (
                 <div className="flex flex-col">
                    <span>{r.email  || "-"}</span>
                 </div>
              ),
            },
            {
              key: "domisili",
              title: "Domisili",
              className: "whitespace-nowrap",
            },
            {
              key: "rating",
              title: "Rating",
              className: "whitespace-nowrap",
              render: (r) => (
                <div className="flex items-center gap-1 font-semibold text-slate-700">
                   <span className="text-amber-400">★</span> {r.rating.toFixed(1)}
                </div>
              ),
            },
            {
              key: "status",
              title: "Status",
              className: "whitespace-nowrap",
              render: (r) => (
                <Badge tone={r.status === "Aktif" ? "blue" : "rose"}>
                  {r.status}
                </Badge>
              ),
            },
            {
              key: "actions",
              title: <span className="block text-right pr-4">Opsi</span>,
              className: "whitespace-nowrap text-right",
              render: (r) => (
                <div className="flex justify-end items-center gap-2">
                  <button
                    className="btn-secondary text-xs h-8 px-3"
                    type="button"
                    onClick={() => {
                      setSelected(r);
                      setModalMode("detail");
                    }}
                  >
                    Detail
                  </button>
                  {r.verified === "Belum" ? (
                    <button
                      className="btn-primary text-xs h-8 px-3"
                      type="button"
                      onClick={() => {
                        setSelected({ ...r, verified: "Terverifikasi" });
                        setSelectedVerification("Terverifikasi");
                        setModalMode("detail");
                      }}
                    >
                      Verifikasi
                    </button>
                  ) : (
                    <button
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2"
                      type="button"
                      onClick={() => {
                        setSelected(r);
                        setModalMode("dokumen");
                      }}
                    >
                      Dokumen
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          rows={rows}
        />
      </div>

      <Modal
        open={!!selected && modalMode === "detail"}
        title={selected ? `Detail Pemberi Kerja • ${selected.namaOrang || "-"}` : "Detail"}
        onClose={() => {
          setSelected(null);
          setModalMode(null);
        }}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <button
              className="btn-secondary border-slate-200 text-slate-600 px-6 font-bold"
              onClick={() => {
                setSelected(null);
                setModalMode(null);
              }}
              type="button"
            >
              Batalkan
            </button>
            <button
              className="btn-primary px-8 font-bold shadow-lg shadow-blue-500/20"
              type="button"
              onClick={() => {
                if (selected) {
                  setSelected({
                    ...selected,
                    verified: selectedVerification as any,
                  });
                }
              }}
            >
              Simpan Perubahan
            </button>
          </div>
        }
      >
        {selected && (
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="grid gap-2">
              <div>
                <div className="text-xs text-slate-500">ID</div>
                <div className="font-semibold">{selected.id}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Nama</div>
                <div className="font-semibold">{selected.namaOrang || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Bidang</div>
                <div className="font-semibold">{selected.bidang}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="font-semibold">{selected.email || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Domisili</div>
                <div className="font-semibold">{selected.domisili}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    selected.verified === "Terverifikasi" ? "green" : "amber"
                  }
                >
                  {selected.verified}
                </Badge>
                <Badge tone={selected.status === "Aktif" ? "blue" : "rose"}>
                  {selected.status}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-600">
                  Status Verifikasi
                </span>
                <select
                  className="input"
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                >
                  <option>Terverifikasi</option>
                  <option>Belum</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-600">
                  Catatan Admin
                </span>
                <textarea
                  className="input min-h-[90px]"
                  placeholder="Mis: perlu dokumen NPWP / NIB..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Reputasi</div>
                <div className="mt-1 text-sm">
                  Rating:{" "}
                  <span className="font-semibold">
                    {selected.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!selected && modalMode === "dokumen"}
        title={selected ? `Dokumen • ${selected.namaOrang || "-"}` : "Dokumen"}
        onClose={() => {
          setSelected(null);
          setModalMode(null);
        }}
        footer={
          <div className="flex gap-2 justify-end">
            <button
              className="btn-secondary"
              onClick={() => {
                setSelected(null);
                setModalMode(null);
              }}
              type="button"
            >
              Tutup
            </button>
          </div>
        }
      >
        {selected && (
          <div className="grid gap-4">
            <div>
              <div className="text-xs text-slate-600 mb-2 font-semibold">
                Foto Profil
              </div>
              {selected.fotoUrl ? (
                <img
                  src={selected.fotoUrl}
                  alt={selected.namaOrang || "-"}
                  className="w-full rounded border border-slate-200"
                />
              ) : (
                <div className="w-full bg-slate-100 rounded border border-slate-200 flex items-center justify-center h-64">
                  <span className="text-slate-500">Foto tidak tersedia</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-xs text-slate-600 mb-2 font-semibold">
                KTP
              </div>
              {selected.ktpUrl ? (
                <img
                  src={selected.ktpUrl}
                  alt={selected.namaOrang + " KTP"}
                  className="w-full rounded border border-slate-200"
                />
              ) : (
                <div className="w-full bg-slate-100 rounded border border-slate-200 flex items-center justify-center h-64">
                  <span className="text-slate-500">KTP tidak tersedia</span>
                </div>
              )}
            </div>
            <div className="grid gap-2 text-sm">

              <div>
                <div className="text-xs text-slate-500">
                  Nama
                </div>
                <div className="font-semibold">{selected.namaOrang || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">ID</div>
                <div className="font-semibold">{selected.id}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="font-semibold">{selected.email || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Bidang Usaha</div>
                <div className="font-semibold">{selected.bidang}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Status Verifikasi</div>
                <Badge
                  tone={
                    selected.verified === "Terverifikasi" ? "green" : "amber"
                  }
                >
                  {selected.verified}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
