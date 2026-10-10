import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../theme/ThemeProvider';
import {
  UtensilsCrossed,
  ShoppingBag,
  ChefHat,
  Coffee,
  CheckCircle2,
  BarChart3,
  Tv,
  Bell,
  Clock,
  Award,
  ChevronDown,
  User,
  ArrowRight,
  Menu,
  X,
  Layers,
  Search
} from 'lucide-react';

export default function UnifiedNavbar({ onToggleMobileMenu }) {
  const {
    cartItemsCount,
    studentUser,
    toggleGuestMode,
    currentActiveStudentOrder,
    studentNotifications,
    markNotificationsAsRead
  } = useStore();
  const { user: staffUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifs = studentNotifications.filter((n) => !n.read).length;

  const isStaffRoute = location.pathname.startsWith('/cashier') ||
    location.pathname.startsWith('/kitchen') ||
    location.pathname.startsWith('/beverage') ||
    location.pathname.startsWith('/counter') ||
    location.pathname.startsWith('/manager');
  const isTVRoute = location.pathname === '/now-serving';

  const personas = [
    {
      id: 'student',
      label: 'Student / Diner Portal',
      icon: UtensilsCrossed,
      path: '/',
      description: 'Menu browsing, custom orders, Razorpay/cash checkout & live tracking'
    },
    {
      id: 'cashier',
      label: 'Cashier POS',
      icon: ShoppingBag,
      path: '/cashier',
      description: 'Walk-in order entry, cash payment token verification & refunds'
    },
    {
      id: 'kitchen',
      label: 'Kitchen Display (KDS)',
      icon: ChefHat,
      path: '/kitchen',
      description: 'Incoming food queue, cooking timers & status transitions'
    },
    {
      id: 'beverage',
      label: 'Juice & Beverage Bar',
      icon: Coffee,
      path: '/beverage',
      description: 'Beverages, shakes and ice cream preparation queue'
    },
    {
      id: 'counter',
      label: 'Serving Counter',
      icon: CheckCircle2,
      path: '/counter',
      description: 'Token handover station & order completion'
    },
    {
      id: 'manager',
      label: 'Manager Portal',
      icon: BarChart3,
      path: '/manager/menu',
      description: 'Menu, inventory, reports, staff accounts & feedback'
    },
    {
      id: 'tv',
      label: 'Now Serving TV',
      icon: Tv,
      path: '/now-serving',
      description: 'Public canteen status board for pickups'
    }
  ];

  const handleSelectPersona = (p) => {
    setShowPersonaMenu(false);
    navigate(p.path);
  };

  return (
    <header className="h-14 bg-surface border-b border-line sticky top-0 z-40 transition-colors duration-150">
      <div className="max-w-[1440px] mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand & Portal Switcher */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden btn-ghost w-9 h-9 p-0 border border-line"
              aria-label="Open menu"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
          )}

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          >
            <div className="w-8 h-8 rounded-md bg-surface-2 border border-line flex items-center justify-center text-accent">
              <UtensilsCrossed size={16} strokeWidth={1.75} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-fg">
              CampusBite
            </span>
          </div>

          {/* Portal Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="btn-secondary h-8 text-[12px] px-2.5 gap-1.5"
              aria-expanded={showPersonaMenu}
              aria-haspopup="true"
            >
              <Layers size={14} strokeWidth={1.75} className="text-accent" />
              <span className="hidden sm:inline">
                {isStaffRoute ? 'Staff Portal' : isTVRoute ? 'TV Board' : 'Student Portal'}
              </span>
              <ChevronDown size={13} strokeWidth={1.75} className="text-fg-muted" />
            </button>

            {showPersonaMenu && (
              <div
                className="absolute left-0 top-10 w-72 bg-surface border border-line rounded-lg shadow-pop p-1.5 z-50 animate-in fade-in duration-150"
                role="menu"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted border-b border-line mb-1">
                  Switch Portal View
                </div>
                <div className="space-y-0.5">
                  {personas.map((p) => {
                    const Icon = p.icon;
                    const isActive = (p.path === '/' && !isStaffRoute && !isTVRoute) ||
                      (p.path !== '/' && location.pathname.startsWith(p.path));

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPersona(p)}
                        className={`w-full text-left p-2 rounded flex items-start gap-2.5 transition-colors duration-150 ${
                          isActive ? 'bg-accent-soft text-accent' : 'hover:bg-surface-2 text-fg'
                        }`}
                        role="menuitem"
                      >
                        <div className={`mt-0.5 ${isActive ? 'text-accent' : 'text-fg-muted'}`}>
                          <Icon size={16} strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium leading-snug truncate">
                            {p.label}
                          </div>
                          <div className="text-[11.5px] text-fg-muted leading-tight line-clamp-1">
                            {p.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Student Nav links (hidden on staff routes) */}
        {!isStaffRoute && !isTVRoute && (
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Menu
            </NavLink>
            <NavLink
              to="/track"
              className={({ isActive }) => `nav-link relative ${isActive ? 'nav-link-active' : ''}`}
            >
              Track Order
              {currentActiveStudentOrder && currentActiveStudentOrder.status !== 'Collected' && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-label="Active order in progress" />
              )}
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              History
            </NavLink>
            <NavLink
              to="/loyalty"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Rewards
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-2 text-fg-muted font-medium tabular-nums">
                {studentUser.loyaltyPoints} pts
              </span>
            </NavLink>
          </nav>
        )}

        {/* Right: Actions (Theme Toggle, Notifications, Cart, Profile) */}
        <div className="flex items-center gap-2">
          {!isStaffRoute && !isTVRoute ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    if (!showNotifMenu) markNotificationsAsRead();
                  }}
                  className="btn-ghost w-9 h-9 p-0 border border-line rounded-md relative"
                  aria-label="Notifications"
                >
                  <Bell size={16} strokeWidth={1.75} />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 top-11 w-80 bg-surface border border-line rounded-lg shadow-pop p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-line text-[12px]">
                      <span className="font-semibold text-fg">Notifications</span>
                      <span className="text-fg-muted">{studentNotifications.length} items</span>
                    </div>
                    <div className="divide-y divide-line max-h-64 overflow-y-auto mt-1">
                      {studentNotifications.map((n) => (
                        <div key={n.id} className="py-2 text-[12.5px]">
                          <div className="font-medium text-fg">{n.title}</div>
                          <div className="text-fg-muted text-[12px] mt-0.5">{n.message}</div>
                          <div className="text-fg-subtle text-[11px] mt-1">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="btn-primary h-9 text-[13px] px-3 gap-2"
                aria-label={`Cart with ${cartItemsCount} items`}
              >
                <ShoppingBag size={16} strokeWidth={1.75} />
                <span className="hidden sm:inline">Cart</span>
                <span className="w-5 h-5 rounded bg-accent-hover text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
                  {cartItemsCount}
                </span>
              </button>

              {/* Student Profile Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="btn-secondary h-9 px-2 gap-2"
                  aria-label="User account menu"
                >
                  <div className="w-6 h-6 rounded-full bg-surface-2 border border-line flex items-center justify-center text-[11px] font-medium text-fg">
                    {studentUser.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-[13px] text-fg font-medium max-w-[100px] truncate">
                    {studentUser.name}
                  </span>
                  <ChevronDown size={13} strokeWidth={1.75} className="text-fg-muted" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-11 w-64 bg-surface border border-line rounded-lg shadow-pop p-2 z-50">
                    <div className="p-2 border-b border-line mb-1">
                      <div className="text-[13px] font-semibold text-fg">{studentUser.name}</div>
                      <div className="text-[12px] text-fg-muted">{studentUser.email}</div>
                      <div className="text-[11.5px] text-accent mt-1">
                        {studentUser.rollNo} • {studentUser.loyaltyPoints} Points
                      </div>
                    </div>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          toggleGuestMode(!studentUser.isGuest);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-[12.5px] text-fg hover:bg-surface-2 rounded"
                      >
                        {studentUser.isGuest ? 'Switch to Registered Student' : 'Switch to Guest Diner'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/loyalty');
                        }}
                        className="w-full text-left px-2 py-1.5 text-[12.5px] text-fg hover:bg-surface-2 rounded"
                      >
                        Rewards & Perks
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/history');
                        }}
                        className="w-full text-left px-2 py-1.5 text-[12.5px] text-fg hover:bg-surface-2 rounded"
                      >
                        Order Receipts
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Staff Topbar Actions */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary h-8 text-[12.5px] px-3 gap-1.5"
              >
                <UtensilsCrossed size={14} strokeWidth={1.75} />
                <span>Student View</span>
              </button>
              <ThemeToggle />
              <div className="h-8 px-2.5 rounded-md bg-surface-2 border border-line text-[12.5px] font-medium text-fg flex items-center">
                {staffUser ? staffUser.name : 'Staff Portal'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
