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
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-white selection:bg-blue-500/30">
      {/* Header */}
      {/* Header */}
      <div className="h-24 flex items-center gap-4 px-6 border-b border-white/10 bg-slate-900/50">
        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0 ring-2 ring-white/10">
          <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
            <img src="/jobcoui-logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </div>
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <div className="text-xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent filter drop-shadow-sm">
            JobCoUi
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 overflow-y-auto flex-1 space-y-1 custom-scrollbar">
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
                <div className="px-3 pt-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  {item.section}
                </div>
              )}

              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={onNavigate}
                className={
                  isActive
                    ? "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold bg-white/5 text-blue-400 transition-all duration-300"
                    : "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
                }
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                )}
                <span
                  className={
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300 transition-colors"
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
      <div className="p-6 border-t border-white/5 bg-slate-950/20">
        <div className="flex items-center gap-3 mb-4">
           <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-400" />
           </div>
           <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">Administrator</div>
              <div className="text-[10px] text-slate-500 truncate">Sistem Aktif</div>
           </div>
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
