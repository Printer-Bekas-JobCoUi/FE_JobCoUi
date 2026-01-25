import React from "react";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Table from "../components/Table";

export default function Settings() {
  const roles = [
    {
      id: "role-1",
      name: "Super Admin",
      desc: "Akses penuh semua modul",
      users: 1,
      status: "Aktif",
    },
    {
      id: "role-2",
      name: "Admin Operasional",
      desc: "Kelola buruh, pekerjaan, kontrak",
      users: 3,
      status: "Aktif",
    },
    {
      id: "role-3",
      name: "Admin Keuangan",
      desc: "Kelola upah & pembayaran",
      users: 2,
      status: "Aktif",
    },
    {
      id: "role-4",
      name: "Moderator",
      desc: "Moderasi rating",
      users: 2,
      status: "Aktif",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Role, akses, dan preferensi sistem (tampilan UI)."
        actions={
          <>
            <button className="btn-secondary" type="button">
              Audit Akses
            </button>
            <button className="btn-primary" type="button">
              Tambah Role
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="p-6 border-b border-slate-100 mb-4">
             <div className="text-sm font-bold text-slate-800">Role & Hak Akses</div>
             <p className="text-xs text-slate-500 mt-1">Kelola akses pengguna ke modul sistem.</p>
          </div>
          
          <div className="p-0">
            <Table
              className="border-none shadow-none rounded-none"
              columns={[
                {
                  key: "name",
                  title: "Role",
                  className: "whitespace-nowrap pl-6",
                  render: (r) => (
                    <span className="font-semibold text-slate-700">{r.name}</span>
                  ),
                },
                { key: "desc", title: "Deskripsi", className: "text-slate-600" },
                { key: "users", title: "User", className: "whitespace-nowrap text-center", render:r=> <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{r.users}</span> },
                {
                  key: "status",
                  title: "Status",
                  className: "whitespace-nowrap",
                  render: (r) => <Badge tone="green">{r.status}</Badge>,
                },
                {
                  key: "actions",
                  title: "",
                  className: "whitespace-nowrap text-right pr-6",
                  render: () => (
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary text-xs h-8 px-3" type="button">
                        Edit
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={roles}
            />
          </div>
        </div>

        <div className="card h-fit">
          <div className="p-6 border-b border-slate-100">
             <div className="text-sm font-bold text-slate-800">Preferensi UI</div>
             <p className="text-xs text-slate-500 mt-1">Pengaturan tampilan lokal.</p>
          </div>
          
          <div className="p-6 grid gap-5 text-sm">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Bahasa
              </span>
              <select className="input" defaultValue="id">
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Format Mata Uang
              </span>
              <select className="input" defaultValue="IDR">
                <option value="IDR">IDR (Rupiah)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
            
            <div className="pt-2">
                <button className="btn-primary w-full shadow-lg shadow-blue-500/20" type="button">
                Simpan Preferensi
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
