import React, { useState, useEffect } from "react";
import { db_cloud } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { UserPlus, ShieldCheck, Trash2, Mail, Loader2, X, CheckCircle2, Fingerprint } from "lucide-react";
import { getCookie } from "@/lib/auth";

interface Staff {
  id: string;
  nama: string;
  email: string;
  role: "admin" | "staff";
}

export default function AdminUsersPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newStaff, setNewStaff] = useState({ nama: "", email: "", password: "", role: "staff" as "admin" | "staff" });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db_cloud, "users"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Staff[];
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simpan kredensial admin yang sedang login
    const adminEmail = getCookie('_ae') || '';
    const adminPassword = prompt("Masukkan password Anda (admin) untuk konfirmasi:") || '';

    try {
      const auth = getAuth();
      // Buat user baru
      const userCredential = await createUserWithEmailAndPassword(auth, newStaff.email, newStaff.password);
      const newUser = userCredential.user;

      await setDoc(doc(db_cloud, "users", newUser.uid), {
        nama: newStaff.nama.toUpperCase(),
        email: newStaff.email,
        role: newStaff.role,
        createdAt: new Date().toISOString()
      });

      // Re-login sebagai admin agar sesi tidak tergantikan
      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      setIsModalOpen(false);
      setNewStaff({ nama: "", email: "", password: "", role: "staff" });
      fetchStaff();
      alert("Staff berhasil ditambahkan!");
    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "staff" : "admin";
    try {
      await updateDoc(doc(db_cloud, "users", id), { role: newRole });
      fetchStaff();
    } catch {
      alert("Gagal mengubah hak akses");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus akses staff ini secara permanen?")) {
      try {
        await deleteDoc(doc(db_cloud, "users", id));
        fetchStaff();
      } catch {
        alert("Gagal menghapus data");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <Fingerprint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={16} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Memuat Data...</p>
    </div>
  );

  return (
    <div className="p-2 pb-24 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">Staff</h1>
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Akses Kontrol</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md active:scale-95 transition-all">
          <UserPlus size={18} />
        </button>
      </div>
      <div className="space-y-2">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm ${staff.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                  {staff.nama.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs leading-none mb-1 uppercase">{staff.nama}</h3>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Mail size={10} />
                    <span className="text-[9px] font-medium">{staff.email}</span>
                  </div>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${staff.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {staff.role}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-3">
              <button onClick={() => toggleRole(staff.id, staff.role)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-bold uppercase">
                <ShieldCheck size={14} /> Role
              </button>
              <button onClick={() => handleDelete(staff.id)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 text-red-500 text-[10px] font-bold uppercase">
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />
          <form onSubmit={handleAddStaff} className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-black text-slate-800 uppercase italic">Tambah Staff</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 bg-slate-50 rounded-lg text-slate-300">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input required placeholder="NAMA LENGKAP"
                className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold uppercase"
                value={newStaff.nama} onChange={(e) => setNewStaff({ ...newStaff, nama: e.target.value })} />
              <input required type="email" placeholder="EMAIL"
                className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
              <input required type="password" placeholder="PASSWORD"
                className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold"
                value={newStaff.password} onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} />
              <select className="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-black uppercase"
                value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}>
                <option value="staff">STAFF</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>
            <button disabled={isSaving} className="w-full mt-5 bg-blue-600 text-white p-3.5 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2">
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
              {isSaving ? "PROSES..." : "SIMPAN STAFF"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
