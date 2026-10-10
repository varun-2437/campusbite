import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedNavbar from '../navigation/UnifiedNavbar';
import { UtensilsCrossed, ShieldCheck, Cpu } from 'lucide-react';

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-fg">
      <a
        href="#main-student"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 btn-primary"
      >
        Skip to main content
      </a>

      {/* Topbar */}
      <UnifiedNavbar />

      {/* Main Page Area */}
      <main id="main-student" tabIndex={-1} className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-7">
        <Outlet />
      </main>

      {/* Restrained Enterprise Footer */}
      <footer className="bg-surface border-t border-line py-4 px-4 md:px-6 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-fg-muted">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={14} strokeWidth={1.75} className="text-accent" />
            <span className="font-semibold text-fg">CampusBite</span>
            <span>• Canteen Ordering & Dining Management</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Realtime Sync Active
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} strokeWidth={1.75} className="text-accent" />
              Razorpay Sandbox Enabled
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
