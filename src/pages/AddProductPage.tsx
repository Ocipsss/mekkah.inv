import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { PackagePlus, Barcode, MapPin, Wallet, Save, Layers } from "lucide-react";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchLoc, setSearchLoc] = useState("");
  const [showLocList, setShowLocList] = useState(false);

  const categories = useLiveQuery(() => db_local.categories.orderBy('nama').toArray());
  const publishers = useLiveQuery(() => db_local.publishers.orderBy('nama').toArray());
  const locations = useLiveQuery(() => db_local.locations.orderBy('nama').toArray());

  const filteredLocations = locations?.filter(l =>
    l.nama.toLowerCase().includes(searchLoc.toLowerCase())
  );

  const [formData, setFormData] = useState({
    nama: "", kode: "", penerbit: "", kategori: "",
    lokasi: "", hargaModal: "", hargaJual: "", stok: "", deskripsi: ""
  });

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const parseNumber = (value: string) => Number(value.replace(/\./g, ""));

  const generateSKU = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData(prev => ({ ...prev, kode: `TM-${randomNum}` }));
  };

  const resetForm = () => {
    setFormData({
      nama: "", kode: `TM-${Math.floor(100000 + Math.random() * 900000)}`,
      penerbit: "", kategori: "", lokasi: "",
      hargaModal: "", hargaJual: "", stok: "", deskripsi: ""
    });
    setSearchLoc("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { generateSKU(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kategori || !formData.penerbit || !formData.lokasi) {
      alert("Lengkapi kategori, penerbit, dan lokasi!");
      return;
    }
    setLoading(true);
    try {
      await db_local.products.add({
        nama: formData.nama.toUpperCase(),
        kode: formData.kode,
        penerbit: formData.penerbit.toUpperCase(),
        kategori: formData.kategori.toUpperCase(),
        lokasi: formData.lokasi.toUpperCase(),
        hargaModal: formData.hargaModal ? parseNumber(formData.hargaModal) : 0,
        hargaJual: formData.hargaJual ? parseNumber(formData.hargaJual) : 0,
        stok: Number(formData.stok) || 0,
        deskripsi: formData.deskripsi,
        updatedAt: Date.now()
      });
      alert("Berhasil disimpan!");
      resetForm();
    } catch {
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 pb-24 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 px-2">
              <PackagePlus size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Identitas Produk</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Nama Produk</label>
                <input required type="text" placeholder="NAMA BARANG..."
                  className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold uppercase"
                  value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">SKU / Kode (Auto)</label>
                <div className="relative mt-1">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input readOnly type="text" className="w-full p-3 pl-10 bg-slate-100 border-none rounded-xl text-xs font-mono font-bold text-blue-600 outline-none" value={formData.kode} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 px-2">
              <Layers size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Klasifikasi & Lokasi</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
                  <select required className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-[11px] font-bold uppercase"
                    value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}>
                    <option value="">PILIH...</option>
                    {categories?.map((cat) => <option key={cat.id} value={cat.nama}>{cat.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Penerbit</label>
                  <select required className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-[11px] font-bold uppercase"
                    value={formData.penerbit} onChange={(e) => setFormData({ ...formData, penerbit: e.target.value })}>
                    <option value="">PILIH...</option>
                    {publishers?.map((pub) => <option key={pub.id} value={pub.nama}>{pub.nama}</option>)}
                  </select>
                </div>
              </div>
              <div className="relative">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Titik Rak</label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                  <input type="text" placeholder={formData.lokasi || "CARI LOKASI RAK..."}
                    className="w-full p-3 pl-9 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold uppercase"
                    value={searchLoc}
                    onChange={(e) => { setSearchLoc(e.target.value); setShowLocList(e.target.value.length > 0); }} />
                </div>
                {formData.lokasi && (
                  <p className="text-[9px] font-black text-orange-600 mt-1 ml-1">✓ Dipilih: {formData.lokasi}</p>
                )}
                {showLocList && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden max-h-40 overflow-y-auto text-xs font-bold uppercase">
                    {filteredLocations?.map((loc) => (
                      <div key={loc.id} className="p-3 hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-none"
                        onClick={() => { setFormData({ ...formData, lokasi: loc.nama }); setSearchLoc(""); setShowLocList(false); }}>
                        {loc.nama}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-emerald-600 px-2">
              <Wallet size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Finansial & Stok</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 ml-1 uppercase">Jumlah Stok</label>
                <input required type="number" placeholder="0"
                  className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-black"
                  value={formData.stok} onChange={(e) => setFormData({ ...formData, stok: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 ml-1 uppercase">Harga Modal</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">Rp</span>
                  <input type="text" className="w-full p-3 pl-9 bg-slate-50 border-none rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0" value={formData.hargaModal} onChange={(e) => setFormData({ ...formData, hargaModal: formatNumber(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-emerald-600 ml-1 uppercase">Harga Jual Utama</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-300">Rp</span>
                  <input required type="text"
                    className="w-full p-3 pl-9 bg-slate-50 border-none rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-emerald-500 border-l-4 border-l-emerald-500"
                    placeholder="0" value={formData.hargaJual} onChange={(e) => setFormData({ ...formData, hargaJual: formatNumber(e.target.value) })} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button disabled={loading} className="w-full bg-slate-900 text-white p-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 mt-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          {loading ? "PROSES..." : "SIMPAN BARANG"}
        </button>
      </form>
    </div>
  );
}
