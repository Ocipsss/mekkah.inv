import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db_cloud } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setCookie } from "@/lib/auth";
import { LogIn, Mail, Lock, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db_cloud, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      let role = "staff";
      if (userDoc.exists()) {
        role = userDoc.data().role || "staff";
      }

      setCookie("user-role", role, 7);
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Akses Ditolak: Periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-white">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200 mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-[0.2em]">TokoMekkah</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Control System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="email"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
                placeholder="name@mekkah.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="password"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white p-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 active:scale-[0.96] transition-all disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-slate-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={18} />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Masuk <LogIn size={16} />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="h-[1px] w-12 bg-slate-100" />
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">System Version 2.0.0</p>
        </div>
      </div>

      <p className="mt-6 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
        Authorized personnel only.<br />Unauthorized access is strictly prohibited.
      </p>
    </div>
  );
}
