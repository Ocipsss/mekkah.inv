import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db_local } from "@/lib/db";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";

export default function LocationsPage() {
  const [newLoc, setNewLoc] = useState("");
  const [search, setSearch] = useState("");
  const locations = useLiveQuery(() => db_local.locations.toArray());

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoc.trim()) return;
    try {
      await db_local.locations.add({ nama: newLoc.trim().toUpperCase() });
      setNewLoc("");
    } catch {
      alert("Nama lokasi sudah ada!");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus lokasi rak ini?")) await db_local.locations.delete(id);
  };

  const filteredData = locations?.filter(item =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 pb-24 max-w-full mx-auto space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input type="text" placeholder="CONTOH: RAK A-01"
          className="flex-1 bg-white border border-slate-100 p-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none uppercase placeholder:text-slate-300 shadow-sm"
          value={newLoc} onChange={(e) => setNewLoc(e.target.value)} />
        <button type="submit" className="bg-slate-900 text-white px-5 rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95">
          <Plus size={18} />
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {!locations ? (
          <div className="col-span-full flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" size={24} /></div>
        ) : filteredData?.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data tidak ditemukan</p>
          </div>
        ) : (
          filteredData?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 group hover:border-blue-200 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-black text-[10px] border border-slate-100">#</div>
                <span className="font-bold text-slate-700 text-xs uppercase">{item.nama}</span>
              </div>
              <button onClick={() => handleDelete(item.id!)} className="text-slate-200 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="pt-4 border-t border-slate-100">
        <div className="bg-slate-50 py-2 rounded-lg">
          <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-[0.2em]">
            {locations?.length || 0} Lokasi Terdaftar
          </p>
        </div>
      </div>
    </div>
  );
}
