import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '@/lib/auth';
import {
  LayoutDashboard, Package, PlusCircle, Users,
  Settings, Menu, X, LogOut, Layers, BookOpen,
  MapPin, RefreshCw, ShieldCheck
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleHardReset = async () => {
    const confirmUpdate = confirm("💡 Perbarui sistem ke versi terbaru?");
    if (!confirmUpdate) return;

    if ('serviceWorker' in navigator) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) await reg.unregister();
        window.location.href = window.location.origin + '?reload=' + Date.now();
      } catch {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    const userRole = getCookie("user-role");
    setRole(userRole || 'staff');
  }, [location.pathname]);

  const handleLogout = () => {
    if (!confirm("Yakin ingin keluar?")) return;
    deleteCookie("user-role");
    navigate("/login");
  };

  const menuItems = [
    {
      group: "Utama",
      items: [
        { name: "Beranda", icon: LayoutDashboard, path: "/" },
        { name: "Daftar Barang", icon: Package, path: "/products" },
        { name: "Input Barang", icon: PlusCircle, path: "/products/add" },
      ]
    },
    ...(role === 'admin' ? [{
      group: "Master Data",
      items: [
        { name: "Kategori Produk", icon: Layers, path: "/categories" },
        { name: "Daftar Penerbit", icon: BookOpen, path: "/publishers" },
        { name: "Lokasi Rak", icon: MapPin, path: "/locations" },
      ]
    }] : []),
    ...(role === 'admin' ? [{
      group: "Sistem",
      items: [
        { name: "Manajemen Staff", icon: Users, path: "/admin/users" },
        { name: "Pengaturan", icon: Settings, path: "/settings" },
      ]
    }] : [])
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-100 p-4 flex items-center justify-between z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="p-2.5 bg-slate-50 rounded-xl text-slate-600 active:scale-90 transition-all">
            <Menu size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-tighter text-slate-800">Toko Mekkah</span>
            <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest leading-none">Inventory System</span>
          </div>
        </div>
        <button onClick={handleHardReset} className="p-2.5 text-slate-400 active:text-blue-600 transition-colors">
          <RefreshCw size={18} />
        </button>
      </header>

      {/* Spacer */}
      <div className="h-[65px] md:hidden w-full"></div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen bg-white md:bg-slate-50/50 border-r border-slate-200 z-[120]
        transition-all duration-300 w-[280px] flex flex-col
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <ShieldCheck size={24} />
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-slate-800 text-xl tracking-tighter uppercase leading-tight">Toko Mekkah</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {role} Access
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 mt-6 space-y-8">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{group.group}</p>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive
                          ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                          : "text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                        }
                      `}>
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-blue-400" : "group-hover:scale-110 transition-transform"} />
                      <span className={`text-[11px] uppercase tracking-wider ${isActive ? "font-black" : "font-bold"}`}>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto space-y-2">
          <button onClick={handleHardReset} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-bold uppercase tracking-widest group">
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
            Pembaruan Sistem
          </button>
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full p-4 text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-95">
            <LogOut size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
