import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, RefreshCcw, FileSpreadsheet } from 'lucide-react';
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import { admin } from "../services/api";

export default function Workers() {
  const [q, setQ] = useState("");
  const [kycFilter, setKycFilter] = useState<any>("Semua");
  const [selected, setSelected] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"detail" | "dokumen" | null>(null);
  const [selectedVerification, setSelectedVerification] =
    useState<string>("verified");
  const [adminNote, setAdminNote] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await admin.getUsers({
        role: 'worker',
        kycStatus: kycFilter === "Semua" ? undefined : kycFilter,
        search: q || undefined
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch workers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [kycFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [kycFilter, q]);

  const rows = paginatedUsers;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buruh"
        description="Kelola proses verifikasi identitas, status akun, dan data pekerja."
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
              onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
              placeholder="Cari nama, email, atau wallet..."
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative min-w-[140px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <select
                className="input pl-9 bg-slate-50 border-slate-200"
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value as any)}
              >
                <option value="Semua">Semua KYC</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="unsubmitted">Unsubmitted</option>
              </select>
            </div>

            <button
              className="btn-secondary px-3"
              type="button"
              onClick={() => { setQ(""); setKycFilter("Semua"); fetchUsers(); }}
              title="Reset Filter"
            >
              <RefreshCcw className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden border-none shadow-none bg-transparent">
        <Table
          loading={loading}
          columns={[
            { key: "id", title: "Buruh ID", className: "whitespace-nowrap font-mono text-[11px] text-slate-400" },
            {
              key: "name",
              title: "Identitas Pekerja",
              render: (r: any) => (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <button
                      className="font-bold text-slate-800 hover:text-blue-600 transition-colors text-left"
                      onClick={() => setSelected(r)}
                      type="button"
                    >
                      {r.name}
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">{r.email}</span>
                  </div>
                </div>
              ),
            },
            {
              key: "walletAddress",
              title: "Blockchain Wallet",
              className: "whitespace-nowrap font-mono text-[11px] text-slate-500",
              render: (r: any) => r.walletAddress ? (
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  {`${r.walletAddress.substring(0, 6)}...${r.walletAddress.substring(38)}`}
                </div>
              ) : '-'
            },
            {
              key: "kycStatus",
              title: "Verifikasi KYC",
              className: "whitespace-nowrap",
              render: (r: any) => {
                let tone: any = "amber";
                if (r.kycStatus === 'verified') tone = "green";
                if (r.kycStatus === 'rejected') tone = "rose";
                if (r.kycStatus === 'pending') tone = "blue";
                return (
                  <Badge tone={tone}>
                    {r.kycStatus.toUpperCase()}
                  </Badge>
                );
              }
            },
            {
              key: "actions",
              title: "Opsi",
              className: "whitespace-nowrap text-center",
              render: (r: any) => (
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="btn-secondary text-[11px] h-7 px-3 border-slate-200"
                    type="button"
                    onClick={() => {
                      setSelected(r);
                      setModalMode("detail");
                      setSelectedVerification(r.kycStatus);
                    }}
                  >
                    Profil
                  </button>
                  <button
                    className="btn-primary text-[11px] h-7 px-3 shadow-sm"
                    type="button"
                    onClick={() => {
                      setSelected(r);
                      setModalMode("dokumen");
                    }}
                  >
                    Dokumen
                  </button>
                </div>
              ),
            },
          ]}
          rows={rows}
          emptyText="Tidak ada data buruh ditemukan."
        />
      </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      <Modal
        open={!!selected && modalMode === "detail"}
        title={selected ? `Detail Buruh • ${selected.name}` : "Detail"}
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
              onClick={async () => {
                if (selected) {
                  try {
                    await admin.verifyKyc(selected.id, selectedVerification);
                    fetchUsers();
                    setSelected(null);
                    setModalMode(null);
                  } catch (e) {
                    alert("Gagal memperbarui status KYC");
                  }
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
                <div className="text-xs text-slate-500">Email</div>
                <div className="font-semibold">{selected.email || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Wallet</div>
                <div className="font-semibold break-all text-xs font-mono">{selected.walletAddress}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    selected.kycStatus === "verified" ? "green" : (selected.kycStatus === 'pending' ? 'blue' : 'amber')
                  }
                >
                  {selected.kycStatus}
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
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                  <option value="unsubmitted">Unsubmitted</option>
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
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <div className="text-xs text-slate-600 mb-2 font-semibold">
                Foto Profil (Face)
              </div>
              {selected.kycFaceKey ? (
                <img
                  src={selected.kycFaceKey.startsWith('data:') ? selected.kycFaceKey : `data:image/jpeg;base64,${selected.kycFaceKey}`}
                  alt={selected.name}
                  className="w-full max-h-[400px] object-contain rounded border border-slate-200 bg-slate-50"
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
              {selected.kycKtpKey ? (
                <img
                  src={selected.kycKtpKey.startsWith('data:') ? selected.kycKtpKey : `data:image/jpeg;base64,${selected.kycKtpKey}`}
                  alt={selected.name + " KTP"}
                  className="w-full max-h-[400px] object-contain rounded border border-slate-200 bg-slate-50"
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
                <div className="text-xs text-slate-500">Status Verifikasi</div>
                <Badge
                  tone={
                    selected.kycStatus === "verified" ? "green" : (selected.kycStatus === 'pending' ? 'blue' : 'amber')
                  }
                >
                  {selected.kycStatus}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
