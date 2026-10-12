import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../theme/ThemeProvider';
import AuthModal from '../auth/AuthModal';
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
  LogIn,
  LogOut,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export default function UnifiedNavbar({ onToggleMobileMenu }) {
  const {
    cartItemsCount,
    studentUser,
    currentActiveStudentOrder,
    studentNotifications,
    markNotificationsAsRead
  } = useStore();
  const { user, isGuest, logout, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isStaffRoute =
    location.pathname.startsWith('/cashier') ||
    location.pathname.startsWith('/kitchen') ||
    location.pathname.startsWith('/beverage') ||
    location.pathname.startsWith('/counter') ||
    location.pathname.startsWith('/manager');

  const isTVRoute = location.pathname.startsWith('/now-serving');
  const unreadNotifs = studentNotifications.filter((n) => !n.read).length;

  // Personas available for Manager oversight
  const managerPersonas = [
    {
      id: 'manager',
      label: 'Store Manager',
      path: '/manager/reports',
      icon: BarChart3,
      description: 'Analytics, inventory, menu, and approvals'
    },
    {
      id: 'cashier',
      label: 'Cashier POS',
      path: '/cashier',
      icon: ShoppingBag,
      description: 'Billing terminal and cash payments'
    },
    {
      id: 'kitchen',
      label: 'Kitchen KDS',
      path: '/kitchen',
      icon: ChefHat,
      description: 'Hot kitchen prep station'
    },
    {
      id: 'beverage',
      label: 'Juice Counter',
      path: '/beverage',
      icon: Coffee,
      description: 'Beverages, milkshakes & cold drinks'
    },
    {
      id: 'counter',
      label: 'Serving Counter',
      path: '/counter',
      icon: CheckCircle2,
      description: 'Handover & order dispatch'
    },
    {
      id: 'tv',
      label: 'Now Serving TV',
      path: '/now-serving',
      icon: Tv,
      description: 'Public canteen status board for pickups'
    }
  ];

  const handleSelectPersona = (p) => {
    setShowPersonaMenu(false);
    navigate(p.path);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'manager':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'cashier':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'kitchen':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'beverage':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'counter':
        return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'student':
        return 'bg-accent-soft text-accent border-accent/20';
      default:
        return 'bg-surface-2 text-fg-muted border-line';
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'manager':
        return '/manager/reports';
      case 'cashier':
        return '/cashier';
      case 'kitchen':
        return '/kitchen';
      case 'beverage':
        return '/beverage';
      case 'counter':
        return '/counter';
      default:
        return '/';
    }
  };

  return (
    <>
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

            {/* If Manager is logged in, provide portal switcher */}
            {user?.role === 'manager' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="btn-secondary h-8 text-[12px] px-2.5 gap-1.5"
                  aria-expanded={showPersonaMenu}
                  aria-haspopup="true"
                >
                  <Layers size={14} strokeWidth={1.75} className="text-accent" />
                  <span className="hidden sm:inline">Manager Switcher</span>
                  <ChevronDown size={13} strokeWidth={1.75} className="text-fg-muted" />
                </button>

                {showPersonaMenu && (
                  <div
                    className="absolute left-0 top-10 w-72 bg-surface border border-line rounded-lg shadow-pop p-1.5 z-50 animate-in fade-in duration-150"
                    role="menu"
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted border-b border-line mb-1">
                      Manager Oversight Switcher
                    </div>
                    <div className="space-y-0.5">
                      {managerPersonas.map((p) => {
                        const Icon = p.icon;
                        const isActive = location.pathname.startsWith(p.path);

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
            )}

            {/* Public TV Board link */}
            <NavLink
              to="/now-serving"
              className={({ isActive }) =>
                `text-xs px-2.5 py-1 rounded border hidden sm:inline-flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-accent-soft border-accent/30 text-accent font-semibold'
                    : 'bg-surface-2 border-line text-fg-muted hover:text-fg'
                }`
              }
            >
              <Tv size={13} />
              <span>TV Pickup Board</span>
            </NavLink>
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
              {!isGuest && user?.role === 'student' && (
                <NavLink
                  to="/loyalty"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  Rewards
                </NavLink>
              )}
            </nav>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {!isStaffRoute && !isTVRoute && (
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
              </>
            )}

            {/* Authentication Button & Profile Dropdown */}
            {isGuest ? (
              /* GUEST: Show Sign In Button */
              <button
                type="button"
                onClick={openAuthModal}
                className="btn-secondary h-9 px-3 gap-2 text-xs font-semibold"
              >
                <LogIn size={15} className="text-accent" />
                <span>Sign In</span>
              </button>
            ) : (
              /* LOGGED IN USER: Show User Avatar & Profile Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="btn-secondary h-9 px-2 gap-2"
                  aria-label="User account menu"
                >
                  <div className="w-6 h-6 rounded-full bg-surface-2 border border-line flex items-center justify-center text-[11px] font-semibold text-accent">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:flex flex-col text-left leading-tight">
                    <span className="text-xs font-semibold text-fg max-w-[110px] truncate">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-fg-muted uppercase font-bold tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown size={13} strokeWidth={1.75} className="text-fg-muted" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-11 w-64 bg-surface border border-line rounded-lg shadow-pop p-2 z-50 animate-in fade-in duration-150">
                    <div className="p-2 border-b border-line mb-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-semibold text-fg">{user?.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${getRoleBadgeColor(
                            user?.role
                          )}`}
                        >
                          {user?.role}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-fg-muted truncate">{user?.email}</div>
                      {user?.role === 'student' && (
                        <div className="text-[11px] text-accent mt-1">
                          Loyalty Balance: {user?.loyaltyPoints || 0} pts
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      {user?.role !== 'student' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate(getDashboardPath(user?.role));
                          }}
                          className="w-full text-left px-2 py-1.5 text-xs font-medium text-fg hover:bg-surface-2 rounded flex items-center justify-between"
                        >
                          <span>Go to My Dashboard</span>
                          <ArrowRight size={13} className="text-accent" />
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setShowProfileMenu(false);
                              navigate('/loyalty');
                            }}
                            className="w-full text-left px-2 py-1.5 text-xs text-fg hover:bg-surface-2 rounded"
                          >
                            Rewards & Perks
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowProfileMenu(false);
                              navigate('/history');
                            }}
                            className="w-full text-left px-2 py-1.5 text-xs text-fg hover:bg-surface-2 rounded"
                          >
                            Order Receipts
                          </button>
                        </>
                      )}

                      {/* If on staff route, quick jump back to menu */}
                      {isStaffRoute && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/');
                          }}
                          className="w-full text-left px-2 py-1.5 text-xs text-fg hover:bg-surface-2 rounded flex items-center gap-1.5"
                        >
                          <UtensilsCrossed size={13} />
                          <span>View Canteen Menu</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 rounded flex items-center gap-1.5 border-t border-line mt-1 pt-1.5"
                      >
                        <LogOut size={13} />
                        <span>Sign Out (Return to Guest)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}
