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
      desc: "Moderasi rating & feed",
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

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="text-sm font-semibold">Role & Hak Akses</div>
          <div className="mt-4 card">
            <Table
              columns={[
                {
                  key: "name",
                  title: "Role",
                  className: "whitespace-nowrap",
                  render: (r) => (
                    <span className="font-semibold">{r.name}</span>
                  ),
                },
                { key: "desc", title: "Deskripsi" },
                { key: "users", title: "User", className: "whitespace-nowrap" },
                {
                  key: "status",
                  title: "Status",
                  className: "whitespace-nowrap",
                  render: (r) => <Badge tone="green">{r.status}</Badge>,
                },
                {
                  key: "actions",
                  title: "",
                  className: "whitespace-nowrap text-right",
                  render: () => (
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary" type="button">
                        Edit
                      </button>
                      <button className="btn-secondary" type="button">
                        Atur Permission
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={roles}
              keyField="id"
            />
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold">Preferensi UI</div>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">
                Bahasa
              </span>
              <select className="input" defaultValue="id">
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">
                Format Mata Uang
              </span>
              <select className="input" defaultValue="IDR">
                <option value="IDR">IDR (Rupiah)</option>
                <option value="USD">USD</option>
              </select>
            </label>

            <button className="btn-primary" type="button">
              Simpan Preferensi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
