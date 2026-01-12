import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { Worker, workers as seed } from "../data/mock";

export default function Workers() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"Semua" | "Aktif" | "Diblokir">("Semua");
  const [selected, setSelected] = useState<Worker | null>(null);
  const [modalMode, setModalMode] = useState<"detail" | "dokumen" | null>(null);
  const [selectedVerification, setSelectedVerification] =
    useState<string>("Terverifikasi");
  const [adminNote, setAdminNote] = useState("");

  const rows = useMemo(() => {
    return seed
      .filter((w) => (status === "Semua" ? true : w.status === status))
      .filter((w) =>
        q
          ? (w.name + w.skill + w.domisili + w.id)
              .toLowerCase()
              .includes(q.toLowerCase())
          : true
      );
  }, [q, status]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Buruh"
        description="Kelola proses verifikasi identitas pengguna, status, dan kepatuhan KYC."
        actions={
          <>
            <button className="btn-secondary" type="button">
              Impor Data
            </button>
            <button className="btn-primary" type="button">
              Tambah
            </button>
          </>
        }
      />

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Cari</span>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nama / ID / domisili / dokumen"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-600">Status</span>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option>Semua</option>
              <option>Aktif</option>
              <option>Diblokir</option>
            </select>
          </label>
          <div className="flex items-end">
            <button className="btn-secondary w-full" type="button">
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <Table
          columns={[
            { key: "id", title: "ID", className: "whitespace-nowrap" },
            {
              key: "name",
              title: "Nama",
              render: (r) => (
                <button
                  className="font-semibold hover:underline"
                  onClick={() => setSelected(r)}
                  type="button"
                >
                  {r.name}
                </button>
              ),
            },
            { key: "skill", title: "Skill", className: "whitespace-nowrap" },
            {
              key: "fotoUrl",
              title: "Foto",
              className: "whitespace-nowrap",
              render: (r) =>
                r.fotoUrl ? (
                  <img
                    src={r.fotoUrl}
                    alt={r.name}
                    className="h-10 w-10 object-cover rounded-full border"
                  />
                ) : (
                  "-"
                ),
            },
            {
              key: "email",
              title: "Email",
              className: "whitespace-nowrap",
              render: (r) => r.email || "-",
            },
            {
              className: "whitespace-nowrap",
              render: (r) =>
                r.fotoKtpUrl ? (
                  <img
                    src={r.fotoKtpUrl}
                    alt={r.name + " KTP"}
                    className="h-10 w-16 object-cover rounded border"
                  />
                ) : (
                  "-"
                ),
              key: "",
              title: undefined,
            },
            {
              key: "phone",
              title: "No. Telepon",
              className: "whitespace-nowrap",
              render: (r) => r.phone || "-",
            },
            {
              key: "domisili",
              title: "Domisili",
              className: "whitespace-nowrap",
            },
            {
              key: "verified",
              title: "Status",
              className: "whitespace-nowrap",
              render: (r) => (
                <Badge
                  tone={r.verified === "Terverifikasi" ? "green" : "amber"}
                >
                  {r.verified}
                </Badge>
              ),
            },
            {
              key: "tanggalVerifikasi",
              title: "Tanggal Verifikasi",
              className: "whitespace-nowrap",
              render: (r) => r.tanggalVerifikasi || "-",
            },
            {
              key: "rating",
              title: "Rating",
              className: "whitespace-nowrap",
              render: (r) => (
                <span className="font-semibold">{r.rating.toFixed(1)}</span>
              ),
            },
            {
              key: "lastActive",
              title: "Terakhir Aktif",
              className: "whitespace-nowrap",
            },
            {
              key: "status",
              title: "Status Akun",
              className: "whitespace-nowrap",
              render: (r) => (
                <Badge tone={r.status === "Aktif" ? "blue" : "rose"}>
                  {r.status}
                </Badge>
              ),
            },
            {
              key: "actions",
              title: <span className="flex justify-center w-full">AKSI</span>,
              className: "whitespace-nowrap text-center",
              render: (r) => (
                <div className="flex justify-center items-center gap-2 min-w-[220px]">
                  <button
                    className="btn-secondary text-xs h-7 px-3 leading-tight whitespace-nowrap flex-1"
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
                      className="btn-primary text-xs h-7 px-3 leading-tight whitespace-nowrap flex-1"
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
                      className="btn-secondary text-xs h-7 px-3 leading-tight whitespace-nowrap flex-1"
                      type="button"
                      onClick={() => {
                        setSelected(r);
                        setModalMode("dokumen");
                      }}
                    >
                      Lihat Dokumen
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
        title={selected ? `Detail Buruh • ${selected.name}` : "Detail"}
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
            <button
              className="btn-primary"
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
                <div className="text-xs text-slate-500">Skill</div>
                <div className="font-semibold">{selected.skill}</div>
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
                  placeholder="Mis: Dokumen KTP belum jelas..."
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
                  </span>{" "}
                  • Terakhir aktif:{" "}
                  <span className="font-semibold">{selected.lastActive}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!selected && modalMode === "dokumen"}
        title={selected ? `Dokumen • ${selected.name}` : "Dokumen"}
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
                  alt={selected.name}
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
                Foto KTP
              </div>
              {selected.fotoKtpUrl ? (
                <img
                  src={selected.fotoKtpUrl}
                  alt={selected.name + " KTP"}
                  className="w-full rounded border border-slate-200"
                />
              ) : (
                <div className="w-full bg-slate-100 rounded border border-slate-200 flex items-center justify-center h-64">
                  <span className="text-slate-500">Dokumen tidak tersedia</span>
                </div>
              )}
            </div>
            <div className="grid gap-2 text-sm">
              <div>
                <div className="text-xs text-slate-500">Nama</div>
                <div className="font-semibold">{selected.name}</div>
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
