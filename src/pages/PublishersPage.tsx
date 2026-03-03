import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { BookOpen, Plus, Trash2, Loader2, Building2 } from "lucide-react";

export default function PublishersPage() {
  const [newPub, setNewPub] = useState("");
  const publishers = useLiveQuery(() => db_local.publishers.toArray());

  const addPublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPub.trim()) return;
    try {
      await db_local.publishers.add({ nama: newPub.toUpperCase() });
      setNewPub("");
    } catch {
      alert("Penerbit sudah terdaftar!");
    }
  };

  const deletePublisher = async (id: number) => {
    if (confirm("Hapus penerbit ini?")) await db_local.publishers.delete(id);
  };

  return (
    <div className="p-3 pb-24 max-w-2xl mx-auto space-y-6">
      <form onSubmit={addPublisher} className="flex gap-2">
        <div className="relative flex-1">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="NAMA PENERBIT BARU..."
            className="w-full p-4 pl-11 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-[11px] font-black uppercase shadow-sm"
            value={newPub} onChange={(e) => setNewPub(e.target.value.toUpperCase())} />
        </div>
        <button className="bg-orange-600 text-white px-5 rounded-xl shadow-lg shadow-orange-200 active:scale-90 transition-all flex items-center justify-center">
          <Plus size={20} strokeWidth={3} />
        </button>
      </form>
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2 mb-3">
          <div className="h-[1px] flex-1 bg-slate-100"></div>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total {publishers?.length || 0} Penerbit</span>
          <div className="h-[1px] flex-1 bg-slate-100"></div>
        </div>
        {publishers ? (
          <div className="grid grid-cols-1 gap-2">
            {publishers.map((pub) => (
              <div key={pub.id} className="bg-white p-3 rounded-xl border border-slate-50 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shrink-0"><BookOpen size={16} /></div>
                  <span className="font-black text-slate-700 text-[11px] uppercase tracking-tight">{pub.nama}</span>
                </div>
                <button onClick={() => deletePublisher(pub.id!)} className="p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={24} />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Mengambil Data...</span>
          </div>
        )}
        {publishers?.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
            <Building2 className="mx-auto text-slate-200 mb-2" size={32} />
            <p className="text-slate-400 font-bold text-[10px] uppercase">Belum ada penerbit terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}
