import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db_local } from '@/lib/db';
import { PackagePlus, Barcode, MapPin, Wallet, ChevronLeft, Save, Layers, Loader2 } from "lucide-react";

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchLoc, setSearchLoc] = useState("");
  const [showLocList, setShowLocList] = useState(false);

  const categories = useLiveQuery(() => db_local.categories.toArray());
  const publishers = useLiveQuery(() => db_local.publishers.toArray());
  const locations = useLiveQuery(() => db_local.locations.orderBy('nama').toArray());

  const filteredLocations = locations?.filter(l =>
    l.nama.toLowerCase().includes(searchLoc.toLowerCase())
  );

  const [formData, setFormData] = useState({
    nama: "", kode: "", penerbit: "", kategori: "",
    lokasi: "", hargaModal: "", hargaJual: "", stok: "", deskripsi: ""
  });

  useEffect(() => {
    const loadData = async () => {
      const product = await db_local.products.get(productId);
      if (product) {
        setFormData({
          ...product,
          hargaModal: product.hargaModal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          hargaJual: product.hargaJual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          stok: product.stok.toString(),
          deskripsi: product.deskripsi || ""
        });
      }
      setFetching(false);
    };
    loadData();
  }, [productId]);

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const parseNumber = (value: string) => Number(value.replace(/\./g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db_local.products.update(productId, {
        ...formData,
        nama: formData.nama.toUpperCase(),
        penerbit: formData.penerbit.toUpperCase(),
        kategori: formData.kategori.toUpperCase(),
        lokasi: formData.lokasi.toUpperCase(),
        hargaModal: parseNumber(formData.hargaModal),
        hargaJual: parseNumber(formData.hargaJual),
        stok: Number(formData.stok),
        updatedAt: Date.now()
      });
      alert("Perubahan berhasil disimpan!");
      navigate(-1);
    } catch {
      alert("Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest mt-4 text-slate-400">Memuat Data...</span>
    </div>
  );

  return (
    <div className="p-2 pb-24 max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-md p-3 rounded-xl border border-slate-100 flex items-center gap-3 sticky top-2 z-30 shadow-sm mb-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-black text-slate-800 tracking-tight text-xs uppercase">Edit Produk</h1>
          <p className="text-[9px] font-bold text-blue-600 uppercase">Perbarui Informasi Barang</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 px-2">
              <PackagePlus size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Identitas</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Nama Produk</label>
                <input required type="text"
                  className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold uppercase"
                  value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Kode Produk (Fixed)</label>
                <div className="relative mt-1">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input readOnly type="text" className="w-full p-3 pl-10 bg-slate-100 border-none rounded-xl text-xs font-mono font-bold text-slate-400 outline-none" value={formData.kode} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 px-2">
              <Layers size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Klasifikasi</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
                  <select required className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-[11px] font-bold uppercase"
                    value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}>
                    {categories?.map((cat) => <option key={cat.id} value={cat.nama}>{cat.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Penerbit</label>
                  <select required className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-[11px] font-bold uppercase"
                    value={formData.penerbit} onChange={(e) => setFormData({ ...formData, penerbit: e.target.value })}>
                    {publishers?.map((pub) => <option key={pub.id} value={pub.nama}>{pub.nama}</option>)}
                  </select>
                </div>
              </div>
              {/* Perbaikan: lokasi di edit juga pakai searchable dropdown */}
              <div className="relative">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Lokasi Rak</label>
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
              <span className="text-[10px] font-black uppercase tracking-widest">Harga & Stok</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 ml-1 uppercase">Stok Tersedia</label>
                <input required type="number"
                  className="w-full mt-1 p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-black"
                  value={formData.stok} onChange={(e) => setFormData({ ...formData, stok: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 ml-1 uppercase">Harga Modal</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">Rp</span>
                  <input required type="text"
                    className="w-full p-3 pl-9 bg-slate-50 border-none rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.hargaModal} onChange={(e) => setFormData({ ...formData, hargaModal: formatNumber(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-emerald-600 ml-1 uppercase">Harga Jual</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-300">Rp</span>
                  <input required type="text"
                    className="w-full p-3 pl-9 bg-slate-50 border-none rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-emerald-500 border-l-4 border-l-emerald-500"
                    value={formData.hargaJual} onChange={(e) => setFormData({ ...formData, hargaJual: formatNumber(e.target.value) })} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button disabled={loading} className="w-full bg-slate-900 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}
