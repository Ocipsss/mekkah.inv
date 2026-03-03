import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { useNavigate } from 'react-router-dom';
import {
  Package, Layers, AlertTriangle, TrendingUp,
  History, ArrowUpRight, ArrowDownRight, Loader2,
  Box, ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const products = useLiveQuery(() => db_local.products.toArray());
  const categories = useLiveQuery(() => db_local.categories.toArray());

  const totalStok = products?.reduce((acc, item) => acc + (Number(item.stok) || 0), 0) || 0;
  const totalVariasi = products?.length || 0;
  const totalCat = categories?.length || 0;
  const lowStockItems = products?.filter(item => Number(item.stok) <= 5) || [];
  const recentUpdates = products
    ? [...products].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 3)
    : [];

  if (!products || !categories) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300">
        <Loader2 className="animate-spin mb-3 text-blue-600" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sinkronisasi Sistem...</p>
      </div>
    );
  }

  return (
    <div className="p-3 pb-24 max-w-2xl mx-auto space-y-6">
      <header className="px-1 flex justify-between items-end">
        <div>
          <h1 className="font-black text-slate-800 tracking-tight text-xs uppercase italic">Control Panel</h1>
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Ringkasan Gudang Hari Ini</p>
        </div>
        <div className="text-right">
          <p className="text-[14px] font-black text-slate-800">100%</p>
          <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Online Mode</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 space-y-3">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Unit</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{totalStok.toLocaleString('id-ID')}</h2>
            </div>
            <div className="flex items-center text-emerald-500 text-[9px] font-black uppercase">
              <ArrowUpRight size={10} className="mr-1" />
              <span>{totalVariasi} SKU Terdaftar</span>
            </div>
          </div>
          <Box size={80} className="absolute -right-4 -bottom-4 text-slate-50 opacity-50 group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 space-y-3">
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Kategori</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{totalCat}</h2>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase">Aktif & Terjaga</p>
          </div>
          <Layers size={80} className="absolute -right-4 -bottom-4 text-slate-50 opacity-50 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1 text-slate-800">
          <AlertTriangle size={14} className="text-orange-500" />
          <h3 className="font-black text-[11px] uppercase tracking-wider">Perlu Perhatian</h3>
        </div>
        {lowStockItems.length > 0 ? (
          <div onClick={() => navigate('/products')} className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3 cursor-pointer active:scale-95 transition-all">
            <div className="bg-white p-2.5 rounded-lg text-red-500 shadow-sm border border-red-50">
              <AlertTriangle size={18} strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="font-black text-slate-800 text-[11px] leading-tight uppercase">Stok Kritis Terdeteksi!</p>
              <p className="text-[9px] text-red-600 mt-0.5 uppercase font-bold">Ada {lowStockItems.length} item hampir habis di gudang.</p>
            </div>
            <ChevronRight size={16} className="text-red-300" />
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Gudang dalam kondisi aman</p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History size={14} className="text-blue-600" />
            <h3 className="font-black text-[11px] uppercase tracking-wider">Update Terakhir</h3>
          </div>
          <button onClick={() => navigate('/products')} className="text-[9px] font-black text-blue-600 uppercase">Lihat Semua</button>
        </div>
        <div className="space-y-2">
          {recentUpdates.length > 0 ? recentUpdates.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-50 rounded-xl hover:border-blue-100 transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-slate-50 text-slate-400 p-2 rounded-lg">
                  <ArrowDownRight size={14} />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-800 text-[10px] uppercase truncate">{item.nama}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Lokasi: {item.lokasi || 'N/A'}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-[11px] font-black text-blue-600">{item.stok}</p>
                <p className="text-[7px] text-slate-300 font-black uppercase">Unit</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">Belum ada aktivitas</p>
            </div>
          )}
        </div>
      </section>

      <button className="w-full bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between group relative overflow-hidden active:scale-[0.98] transition-all shadow-xl shadow-slate-200">
        <div className="relative z-10 flex items-center gap-3 text-left">
          <div className="bg-white/10 p-2 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="font-black text-[11px] uppercase tracking-widest">Laporan Mutasi</p>
            <p className="text-[8px] opacity-50 uppercase font-bold">Segera Hadir</p>
          </div>
        </div>
        <ArrowUpRight className="relative z-10 opacity-50" size={20} />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
      </button>

      <div className="pt-6 pb-2 text-center">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">TokoMekkah V2.0 — Vite Edition</span>
      </div>
    </div>
  );
}
