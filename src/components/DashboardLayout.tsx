import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import SyncManager from '@/components/SyncManager';

export default function DashboardLayout() {
  return (
    <>
      <SyncManager />
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Sidebar />
        <main className="flex-1 w-full min-h-screen relative overflow-x-hidden">
          <div className="max-w-5xl mx-auto p-2 md:p-6 lg:p-8">
            <section className="bg-white/70 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white min-h-[90vh] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
              <div className="relative z-10 p-1 md:p-2">
                <Outlet />
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
