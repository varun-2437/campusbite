import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  ChefHat,
  Coffee,
  CheckCircle2,
  BarChart3,
  LogOut,
  Tv,
  Package,
  Users,
  MessageSquare,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { activeOrdersCount } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/cashier', label: 'Cashier POS', icon: ShoppingBag, roles: ['cashier', 'manager'] },
    {
      to: '/kitchen',
      label: 'Kitchen KDS',
      icon: ChefHat,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
      roles: ['kitchen', 'manager']
    },
    { to: '/beverage', label: 'Juice Counter', icon: Coffee, roles: ['beverage', 'manager'] },
    { to: '/counter', label: 'Serving Counter', icon: CheckCircle2, roles: ['counter', 'manager'] },
    { to: '/now-serving', label: 'Now Serving TV', icon: Tv, roles: ['counter', 'cashier', 'manager'] },
    { to: '/manager/menu', label: 'Menu Management', icon: UtensilsCrossed, roles: ['manager'] },
    { to: '/manager/inventory', label: 'Inventory Stock', icon: Package, roles: ['manager'] },
    { to: '/manager/reports', label: 'Sales Reports', icon: BarChart3, roles: ['manager'] },
    { to: '/manager/staff', label: 'Staff Accounts', icon: Users, roles: ['manager'] },
    { to: '/manager/feedback', label: 'Feedback & Reviews', icon: MessageSquare, roles: ['manager'] }
  ];

  const visibleItems = navItems.filter(
    (item) => !user || user.role === 'manager' || item.roles.includes(user.role)
  );

  const sidebarContent = (
    <aside className="w-[232px] md:w-16 lg:w-[232px] h-screen bg-surface border-r border-line flex flex-col sticky top-0 transition-all duration-150 select-none z-30">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-surface-2 border border-line flex items-center justify-center text-accent shrink-0">
            <UtensilsCrossed size={16} strokeWidth={1.75} />
          </div>
          <div className="md:hidden lg:block min-w-0">
            <div className="text-[14px] font-semibold text-fg tracking-tight leading-tight truncate">
              CampusBite
            </div>
            <div className="text-[11px] text-fg-muted leading-tight truncate">
              Staff Portal
            </div>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden btn-ghost w-8 h-8 p-0"
            aria-label="Close navigation"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto" aria-label="Staff navigation">
        <div className="hidden lg:block px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
          Operations
        </div>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `nav-link justify-start md:justify-center lg:justify-start ${
                  isActive ? 'nav-link-active' : ''
                }`
              }
              title={item.label}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              <span className="md:hidden lg:inline flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="md:hidden lg:inline text-[11px] font-semibold px-1.5 py-0.5 rounded bg-danger text-white tabular-nums">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Mode Switcher & User Profile */}
      <div className="p-2 border-t border-line space-y-2">
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            navigate('/');
          }}
          className="btn-secondary w-full text-[12.5px] h-8 px-2 justify-center gap-1.5"
          title="Open Student Portal"
        >
          <UtensilsCrossed size={14} strokeWidth={1.75} />
          <span className="md:hidden lg:inline">Student Portal</span>
        </button>

        <div className="pt-2 border-t border-line flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-surface-2 border border-line text-[11.5px] font-medium text-fg flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="md:hidden lg:block min-w-0">
              <div className="text-[12.5px] font-medium text-fg truncate">
                {user?.name || 'Staff User'}
              </div>
              <div className="text-[11px] text-fg-muted uppercase tracking-wider">
                {user?.role || 'Staff'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost w-7 h-7 p-0 shrink-0"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:block shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-[2px] flex"
          onClick={onCloseMobile}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
