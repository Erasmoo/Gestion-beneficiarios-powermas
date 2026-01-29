import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.15),_transparent_55%)]" />

      <div className="relative z-10">
        <header className="border-b border-slate-800/70 bg-slate-950/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-2.5 rounded-xl shadow-[0_0_40px_rgba(79,70,229,0.55)]">
                  <svg
                    className="w-8 h-8 text-slate-950"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                    Sistema de Gestión de Beneficiarios
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-[0.18em] mt-1">
                    PowerMas · Evaluación Técnica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>

        <footer className="mt-8 border-t border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-xs sm:text-sm text-slate-500 tracking-[0.22em] uppercase">
              © 2026 Erasmo FC · Gestión de Beneficiarios
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
