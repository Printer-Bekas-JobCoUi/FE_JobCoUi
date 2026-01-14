import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Wallet,
  Star,
  Newspaper,
  Settings,
  Sparkles,
} from "lucide-react";

type SidebarProps =
  | { variant: "desktop" }
  | { variant: "mobile"; open: boolean; onClose: () => void };

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
};

const nav: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    section: "Utama",
  },
  { to: "/buruh", label: "Buruh", icon: <Users className="h-4 w-4" /> },
  {
    to: "/pemberi-kerja",
    label: "Pemberi Kerja",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    to: "/pekerjaan",
    label: "Pekerjaan",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    to: "/kontrak",
    label: "Kontrak Digital",
    icon: <FileText className="h-4 w-4" />,
    section: "Transaksi",
  },
  {
    to: "/pembayaran",
    label: "Upah & Pembayaran",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    to: "/rating",
    label: "Rating & Apresiasi",
    icon: <Star className="h-4 w-4" />,
    section: "Komunitas",
  },
  {
    to: "/feed",
    label: "Feed & Portofolio",
    icon: <Newspaper className="h-4 w-4" />,
  },
  {
    to: "/pengaturan",
    label: "Pengaturan",
    icon: <Settings className="h-4 w-4" />,
    section: "Sistem",
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-white">
      {/* Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-700/50 shadow-sm shrink-0">
          <img src="/jobcoui-logo.png" alt="Logo" className="h-7 w-auto object-contain" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold leading-4 truncate text-white">
            JobCoUi
          </div>
          <div className="text-xs text-slate-400 truncate font-medium">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 overflow-y-auto flex-1 space-y-1">
        {nav.map((item, idx) => {
          const prevSection = idx === 0 ? null : nav[idx - 1].section;
          const showSection = item.section && item.section !== prevSection;
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);

          return (
            <React.Fragment key={item.to}>
              {showSection && (
                <div className="px-3 pt-5 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.section}
                </div>
              )}

              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={onNavigate}
                className={
                  isActive
                    ? "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                }
              >
                <span
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-white transition-colors"
                  }
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-slate-950/30">
        <div className="text-[10px] text-slate-500 text-center">
          © 2026 • Village Edition
        </div>
      </div>
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  if (props.variant === "desktop") {
    return (
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-72 shadow-2xl z-40">
        <SidebarContent />
      </aside>
    );
  }

  // Mobile drawer
  const { open, onClose } = props;
  return (
    <div className={open ? "lg:hidden" : "hidden"}>
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 left-0 w-80 max-w-[85vw] shadow-2xl z-50 transform transition-transform duration-300">
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
