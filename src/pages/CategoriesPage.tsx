import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [newCategory, setNewCategory] = useState("");
  const categories = useLiveQuery(() => db_local.categories.toArray());

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;
    try {
      await db_local.categories.add({ nama: newCategory.toUpperCase() });
      setNewCategory("");
    } catch {
      alert("Kategori sudah ada!");
    }
  };

  const deleteCategory = async (id: number) => {
    if (confirm("Hapus kategori ini?")) await db_local.categories.delete(id);
  };

  return (
    <div className="p-2 pb-24 max-w-full mx-auto">
      <form onSubmit={addCategory} className="mb-6 flex gap-2">
        <input type="text" placeholder="NAMA KATEGORI BARU..."
          className="flex-1 p-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold uppercase shadow-sm"
          value={newCategory} onChange={(e) => setNewCategory(e.target.value.toUpperCase())} />
        <button className="bg-blue-600 text-white px-5 rounded-xl shadow-md active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {categories ? (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0"><Tag size={16} /></div>
                <span className="font-bold text-slate-700 text-xs tracking-tight uppercase">{cat.nama}</span>
              </div>
              <button onClick={() => deleteCategory(cat.id!)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-10">
            <Loader2 className="animate-spin text-blue-600 mb-2" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sinkronisasi...</span>
          </div>
        )}
      </div>
      {categories?.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-xs uppercase">Belum ada kategori</p>
        </div>
      )}
    </div>
  );
}
