import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main className="w-full min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[120px]" />
      </div>
      <section className="w-full relative z-10 flex items-center justify-center p-4">
        <Outlet />
      </section>
      <div className="absolute bottom-6 w-full text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          Secure Authentication Portal
        </p>
      </div>
    </main>
  );
}
