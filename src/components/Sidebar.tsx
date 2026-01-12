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
    <div className="h-full flex flex-col bg-gradient-to-b from-bg-primary to-bg-secondary border-r border-white/10">
      {/* Header with gradient */}
      <div className="h-20 flex items-center gap-3 px-5 border-b border-white/10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-2xl" />
        
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white grid place-items-center font-bold text-xl shadow-lg relative z-10 pulse-glow">
          BH
        </div>
        <div className="min-w-0 relative z-10">
          <div className="text-sm font-bold leading-4 truncate text-white">
            Buruh Harian Lepas
          </div>
          <div className="text-xs text-cyan truncate flex items-center gap-1.5 font-medium">
            <Sparkles className="h-3 w-3" />
            Admin Panel
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 overflow-y-auto flex-1">
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
                <div className="px-3 pt-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {item.section}
                </div>
              )}

              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={onNavigate}
                className={
                  isActive
                    ? "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white mb-1.5 transition-all duration-300 relative overflow-hidden"
                    : "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 mb-1.5 transition-all duration-300 hover:bg-white/5 hover:text-white"
                }
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)",
                        borderLeft: "3px solid rgb(102 126 234)",
                      }
                    : undefined
                }
              >
                {/* Glow effect on active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-xl -z-10" />
                )}
                
                <span
                  className={
                    isActive
                      ? "text-primary transition-colors"
                      : "text-slate-500 group-hover:text-cyan transition-colors"
                  }
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-cyan animate-pulse shadow-glow-cyan" />
                )}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>
      
      {/* Footer with gradient */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="text-[10px] text-slate-500 text-center">
          © 2026 • Modern Admin
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
