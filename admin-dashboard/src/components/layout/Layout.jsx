import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useStore } from '../../context/StoreContext';
import { ThemeToggle } from '../../theme/ThemeProvider';
import { AlertCircle, Menu, UtensilsCrossed } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const { inventory } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFullscreenView = location.pathname === '/now-serving';
  if (isFullscreenView) {
    return <Outlet />;
  }

  // Check for inventory items at or below threshold
  const lowStockItems = inventory.filter((item) => item.quantity <= item.threshold);

  return (
    <div className="flex min-h-screen bg-canvas text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 btn-primary"
      >
        Skip to main content
      </a>

      {/* Responsive Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <div className="md:hidden h-14 bg-surface border-b border-line px-4 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="btn-ghost w-9 h-9 p-0 border border-line"
            aria-label="Open staff navigation"
          >
            <Menu size={18} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} strokeWidth={1.75} className="text-accent" />
            <span className="text-[14px] font-semibold text-fg">Staff Portal</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Low Stock Warning Banner */}
        {lowStockItems.length > 0 && (
          <div className="bg-warning/10 border-b border-warning/25 text-warning px-4 md:px-6 py-2.5 flex items-center gap-2 text-[12.5px]">
            <AlertCircle size={15} strokeWidth={1.75} className="shrink-0" />
            <span>
              <strong>Inventory Notice:</strong> {lowStockItems.length} item(s) are low in stock (
              {lowStockItems.map((i) => `${i.itemName}: ${i.quantity} ${i.unit}`).join(', ')}).
            </span>
          </div>
        )}

        {/* Content Body */}
        <main id="main" tabIndex={-1} className="flex-1 p-4 md:p-6 lg:p-7 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
