export type Worker = {
  id: string;
  name: string;
  skill: string;
  fotoUrl?: string;
  email?: string;
  domisili: string;
  verified: "Terverifikasi" | "Belum";
  tanggalVerifikasi?: string;
  fotoKtpUrl?: string;
  phone?: string;
  rating: number;
  lastActive: string;
  status: "Aktif" | "Diblokir";
};

export type Employer = {
  id: string;
  name: string;
  namaOrang?: string;
  bidang: string;
  fotoUrl?: string;
  ktpUrl?: string;
  email?: string;
  domisili: string;
  verified: "Terverifikasi" | "Belum";
  rating: number;
  status: "Aktif" | "Diblokir";
};

export type Job = {
  id: string;
  title: string;
  lokasi: string;
  upah: string;
  status: "Aktif" | "Selesai" | "Draf";
  pelamar: number;
  dibuat: string;
};

export type Contract = {
  id: string;
  jobTitle: string;
  worker: string;
  employer: string;
  periode: string;
  upah: string;
  status: "Draft" | "Aktif" | "Selesai" | "Sengketa";
  hash: string;
};

export type Payment = {
  id: string;
  contractId: string;
  payer: string;
  payee: string;
  amount: string;
  method: "Transfer" | "E-Wallet" | "Tunai" | "Escrow";
  status: "Menunggu" | "Berhasil" | "Gagal";
  txHash: string;
};

export type Training = {
  id: string;
  title: string;
  level: "Dasar" | "Menengah" | "Lanjutan";
  category: string;
  enrolled: number;
  completionRate: number;
  status: "Publik" | "Draft";
};

export type RatingEntry = {
  id: string;
  from: string;
  to: string;
  role: "Buruh" | "Pemberi Kerja";
  score: number;
  comment: string;
  status: "Tampil" | "Perlu Moderasi";
  createdAt: string;
};

export type FeedPost = {
  id: string;
  author: string;
  role: "Buruh" | "Pemberi Kerja";
  content: string;
  tags: string[];
  createdAt: string;
  likes: number;
};

export type BlockchainEvent = {
  id: string;
  time: string;
  type:
    | "CONTRACT_CREATED"
    | "WAGE_AGREED"
    | "PAYMENT_SETTLED"
    | "RATING_SUBMITTED";
  ref: string;
  summary: string;
  txHash: string;
  block: number;
  status: "Confirmed" | "Pending";
};

export const workers: Worker[] = [
  {
    id: "W-1001",
    name: "Siti Nur Aini",
    skill: "Kebersihan",
    domisili: "Jakarta Timur",
    email: "siti.nur@email.com",
    verified: "Terverifikasi",
    tanggalVerifikasi: "2026-01-05",
    fotoKtpUrl: "/ktp/siti.jpg",
    phone: "081234567890",
    rating: 4.8,
    lastActive: "2 jam lalu",
    status: "Aktif",
  },
  {
    id: "W-1002",
    name: "Rudi Hartono",
    skill: "Kuli Bangunan",
    domisili: "Bekasi",
    email: "rudi.hartono@email.com",
    verified: "Belum",
    fotoKtpUrl: "/ktp/rudi.jpg",
    phone: "081298765432",
    rating: 4.1,
    lastActive: "1 hari lalu",
    status: "Aktif",
  },
  {
    id: "W-1003",
    name: "Maya Putri",
    skill: "Katering",
    domisili: "Depok",
    email: "maya.putri@email.com",
    verified: "Terverifikasi",
    tanggalVerifikasi: "2026-01-03",
    fotoKtpUrl: "/ktp/maya.jpg",
    phone: "081212345678",
    rating: 4.6,
    lastActive: "5 jam lalu",
    status: "Aktif",
  },
  {
    id: "W-1004",
    name: "Agus Salim",
    skill: "Kurir",
    domisili: "Tangerang",
    email: "agus.salim@email.com",
    verified: "Terverifikasi",
    tanggalVerifikasi: "2026-01-01",
    fotoKtpUrl: "/ktp/agus.jpg",
    phone: "081223344556",
    rating: 4.3,
    lastActive: "3 hari lalu",
    status: "Diblokir",
  },
  {
    id: "W-1005",
    name: "Dewi Lestari",
    skill: "Administrasi",
    domisili: "Bandung",
    email: "dewi.lestari@email.com",
    verified: "Belum",
    fotoKtpUrl: "/ktp/dewi.jpg",
    phone: "081255443322",
    rating: 3.9,
    lastActive: "4 jam lalu",
    status: "Aktif",
  },
];

export const employers: Employer[] = [
  {
    id: "E-2001",
    name: "Budi Santoso",
    namaOrang: "Budi Santoso",
    bidang: "Konstruksi",
    email: "cv.majujaya@email.com",
    ktpUrl: "/ktp/budi.jpg",
    domisili: "Bekasi",
    verified: "Terverifikasi",
    rating: 4.5,
    status: "Aktif",
  },
  {
    id: "E-2002",
    name: "Ani Wijaya",
    namaOrang: "Ani Wijaya",
    bidang: "F&B",
    email: "resto.sederhana@email.com",
    ktpUrl: "/ktp/ani.jpg",
    domisili: "Depok",
    verified: "Belum",
    rating: 4.0,
    status: "Aktif",
  },
  {
    id: "E-2003",
    name: "Suharto Rahmat",
    namaOrang: "Suharto Rahmat",
    bidang: "Jasa Kebersihan",
    email: "pt.bersihsejahtera@email.com",
    ktpUrl: "/ktp/suharto.jpg",
    domisili: "Jakarta Selatan",
    verified: "Terverifikasi",
    rating: 4.7,
    status: "Aktif",
  },
  {
    id: "E-2004",
    name: "Rini Kusuma",
    namaOrang: "Rini Kusuma",
    bidang: "Ritel",
    email: "toko.amanah@email.com",
    ktpUrl: "/ktp/rini.jpg",
    domisili: "Bandung",
    verified: "Terverifikasi",
    rating: 4.2,
    status: "Diblokir",
  },
];

export const jobs: Job[] = [
  {
    id: "J-3001",
    title: "Bersih-bersih kantor 1 hari",
    lokasi: "Jakarta Selatan",
    upah: "Rp 200.000/hari",
    status: "Aktif",
    pelamar: 12,
    dibuat: "2026-01-02",
  },
  {
    id: "J-3002",
    title: "Angkut material proyek",
    lokasi: "Bekasi",
    upah: "Rp 180.000/hari",
    status: "Aktif",
    pelamar: 8,
    dibuat: "2025-12-30",
  },
  {
    id: "J-3003",
    title: "Bantu dapur catering (shift)",
    lokasi: "Depok",
    upah: "Rp 150.000/shift",
    status: "Selesai",
    pelamar: 22,
    dibuat: "2025-12-20",
  },
  {
    id: "J-3004",
    title: "Input data stok gudang",
    lokasi: "Bandung",
    upah: "Rp 175.000/hari",
    status: "Draf",
    pelamar: 0,
    dibuat: "2026-01-05",
  },
];

export const contracts: Contract[] = [
  {
    id: "C-4001",
    jobTitle: "Bersih-bersih kantor 1 hari",
    worker: "Siti Nur Aini",
    employer: "Suharto Rahmat",
    periode: "2026-01-06",
    upah: "Rp 200.000",
    status: "Aktif",
    hash: "0x7a2f...c91d",
  },
  {
    id: "C-4002",
    jobTitle: "Angkut material proyek",
    worker: "Rudi Hartono",
    employer: "Budi Santoso",
    periode: "2026-01-04 → 2026-01-06",
    upah: "Rp 540.000",
    status: "Sengketa",
    hash: "0x19bd...2a10",
  },
  {
    id: "C-4003",
    jobTitle: "Bantu dapur catering (shift)",
    worker: "Maya Putri",
    employer: "Ani Wijaya",
    periode: "2025-12-21",
    upah: "Rp 150.000",
    status: "Selesai",
    hash: "0x5f00...9e3b",
  },
];

export const payments: Payment[] = [
  {
    id: "P-5001",
    contractId: "C-4001",
    payer: "Suharto Rahmat",
    payee: "Siti Nur Aini",
    amount: "Rp 200.000",
    method: "Escrow",
    status: "Menunggu",
    txHash: "0x8b11...aa20",
  },
  {
    id: "P-5002",
    contractId: "C-4003",
    payer: "Ani Wijaya",
    payee: "Maya Putri",
    amount: "Rp 150.000",
    method: "Transfer",
    status: "Berhasil",
    txHash: "0x0c44...ff12",
  },
  {
    id: "P-5003",
    contractId: "C-4002",
    payer: "Budi Santoso",
    payee: "Rudi Hartono",
    amount: "Rp 540.000",
    method: "Escrow",
    status: "Gagal",
    txHash: "0x3a9c...1b07",
  },
];

export const trainings: Training[] = [
  {
    id: "T-6001",
    title: "Keselamatan Kerja Dasar",
    level: "Dasar",
    category: "K3",
    enrolled: 312,
    completionRate: 0.64,
    status: "Publik",
  },
  {
    id: "T-6002",
    title: "Etika & Komunikasi Profesional",
    level: "Dasar",
    category: "Soft Skill",
    enrolled: 221,
    completionRate: 0.58,
    status: "Publik",
  },
  {
    id: "T-6003",
    title: "Teknik Kebersihan Area Komersial",
    level: "Menengah",
    category: "Kebersihan",
    enrolled: 97,
    completionRate: 0.41,
    status: "Draft",
  },
];

export const ratings: RatingEntry[] = [
  {
    id: "R-7001",
    from: "Suharto Rahmat",
    to: "Siti Nur Aini",
    role: "Buruh",
    score: 5,
    comment: "Kerja cepat & rapi.",
    status: "Tampil",
    createdAt: "2026-01-05",
  },
  {
    id: "R-7002",
    from: "Rudi Hartono",
    to: "Budi Santoso",
    role: "Pemberi Kerja",
    score: 2,
    comment: "Pembayaran terlambat, perlu klarifikasi.",
    status: "Perlu Moderasi",
    createdAt: "2026-01-04",
  },
  {
    id: "R-7003",
    from: "Ani Wijaya",
    to: "Maya Putri",
    role: "Buruh",
    score: 4,
    comment: "Datang tepat waktu.",
    status: "Tampil",
    createdAt: "2025-12-22",
  },
];

export const feed: FeedPost[] = [
  {
    id: "F-8001",
    author: "Siti Nur Aini",
    role: "Buruh",
    content: "Selesai bersih-bersih kantor. Alat lengkap, hasil memuaskan.",
    tags: ["kebersihan", "harian"],
    createdAt: "2026-01-06",
    likes: 18,
  },
  {
    id: "F-8002",
    author: "Budi Santoso",
    role: "Pemberi Kerja",
    content:
      "Butuh tambahan tenaga untuk proyek 3 hari. Prioritas yang punya pengalaman.",
    tags: ["konstruksi"],
    createdAt: "2026-01-03",
    likes: 5,
  },
  {
    id: "F-8003",
    author: "Maya Putri",
    role: "Buruh",
    content: "Update portofolio: katering 100 pax (shift).",
    tags: ["katering"],
    createdAt: "2025-12-21",
    likes: 12,
  },
];

export const blockchainEvents: BlockchainEvent[] = [
  {
    id: "B-9001",
    time: "2026-01-06 09:12",
    type: "CONTRACT_CREATED",
    ref: "C-4001",
    summary: "Kontrak dibuat & disetujui",
    txHash: "0x7a2f1d7b7c9a8d...c91d",
    block: 128443,
    status: "Confirmed",
  },
  {
    id: "B-9002",
    time: "2026-01-06 09:15",
    type: "WAGE_AGREED",
    ref: "C-4001",
    summary: "Kesepakatan upah terkunci",
    txHash: "0x10aa33b1c2d3e4...7711",
    block: 128444,
    status: "Confirmed",
  },
  {
    id: "B-9003",
    time: "2026-01-06 10:02",
    type: "PAYMENT_SETTLED",
    ref: "P-5001",
    summary: "Deposit escrow masuk",
    txHash: "0x8b11cc33dd44ee...aa20",
    block: 128452,
    status: "Pending",
  },
  {
    id: "B-9004",
    time: "2026-01-05 16:45",
    type: "RATING_SUBMITTED",
    ref: "R-7001",
    summary: "Rating dikirim",
    txHash: "0x9911aa22bb33cc...0d1e",
    block: 128310,
    status: "Confirmed",
  },
];
