import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
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
  Sparkles,
  ArrowRight,
  LogOut,
  Layers
} from 'lucide-react';

export default function UnifiedNavbar() {
  const {
    cartItemsCount,
    studentUser,
    toggleGuestMode,
    currentActiveStudentOrder,
    studentNotifications,
    markNotificationsAsRead
  } = useStore();
  const { user: staffUser, logout: staffLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifs = studentNotifications.filter((n) => !n.read).length;

  // Determine current active section
  const isStaffRoute = location.pathname.startsWith('/cashier') ||
    location.pathname.startsWith('/kitchen') ||
    location.pathname.startsWith('/beverage') ||
    location.pathname.startsWith('/counter') ||
    location.pathname.startsWith('/manager');
  const isTVRoute = location.pathname === '/now-serving';

  const personas = [
    {
      id: 'student',
      label: 'Student / Diner App',
      icon: '🎓',
      path: '/',
      description: 'Order food, customize, Razorpay/Cash checkout & live tracking'
    },
    {
      id: 'cashier',
      label: 'Cashier POS Portal',
      icon: '💵',
      path: '/cashier',
      description: 'Walk-in order entry, cash payment token verification & refunds'
    },
    {
      id: 'kitchen',
      label: 'Kitchen Display (KDS)',
      icon: '👨‍🍳',
      path: '/kitchen',
      description: 'Incoming food orders queue, preparation timer & status controls'
    },
    {
      id: 'beverage',
      label: 'Juice & Beverage Bar',
      icon: '🥤',
      path: '/beverage',
      description: 'Beverages, ice creams & shake order preparation queue'
    },
    {
      id: 'counter',
      label: 'Pickup / Serving Counter',
      icon: '🛎️',
      path: '/counter',
      description: 'Scan tokens, handover orders & mark collected'
    },
    {
      id: 'manager',
      label: 'Store Manager Portal',
      icon: '📊',
      path: '/manager/menu',
      description: 'Menu management, inventory stock, sales analytics & staff accounts'
    },
    {
      id: 'tv',
      label: 'Now Serving TV Board',
      icon: '📺',
      path: '/now-serving',
      description: 'Public TV screen for canteen pickup token announcements'
    }
  ];

  const handleSelectPersona = (p) => {
    setShowPersonaMenu(false);
    navigate(p.path);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Brand Section */}
        <div style={styles.brandGroup}>
          <div
            style={styles.logoBtn}
            onClick={() => navigate('/')}
            title="CampusBite Home"
          >
            <span style={styles.logoEmoji}>🍔</span>
            <div>
              <div style={styles.brandTitle}>
                Campus<span style={{ color: 'var(--accent-primary)' }}>Bite</span>
              </div>
              <div style={styles.brandBadge}>
                {isStaffRoute ? 'Staff Portal' : isTVRoute ? 'Public Display' : 'Campus Diner'}
              </div>
            </div>
          </div>

          {/* Unified Persona / Role Quick Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              style={styles.personaSwitchBtn}
              title="Switch Platform View / Role"
            >
              <Layers size={15} color="var(--accent-secondary)" />
              <span style={styles.personaText}>
                {isStaffRoute
                  ? 'Switch Portal'
                  : isTVRoute
                  ? 'TV Mode'
                  : 'Role: Student Diner'}
              </span>
              <ChevronDown size={14} />
            </button>

            {showPersonaMenu && (
              <div style={styles.dropdownModal}>
                <div style={styles.dropdownHeader}>
                  <Sparkles size={14} color="var(--accent-primary)" />
                  <span>Choose Platform Role / Mode</span>
                </div>
                <div style={styles.personaList}>
                  {personas.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPersona(p)}
                      style={{
                        ...styles.personaItem,
                        backgroundColor:
                          (p.path === '/' && !isStaffRoute && !isTVRoute) ||
                          (p.path !== '/' && location.pathname.startsWith(p.path))
                            ? 'rgba(249, 115, 22, 0.15)'
                            : 'transparent'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{p.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={styles.personaItemTitle}>{p.label}</div>
                        <div style={styles.personaItemDesc}>{p.description}</div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Navigation Links (Student Mode) */}
        {!isStaffRoute && !isTVRoute && (
          <nav style={styles.centerNav}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                ...styles.navLink,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500'
              })}
            >
              Menu
            </NavLink>
            <NavLink
              to="/track"
              style={({ isActive }) => ({
                ...styles.navLink,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500'
              })}
            >
              Track Order
              {currentActiveStudentOrder && currentActiveStudentOrder.status !== 'Collected' && (
                <span style={styles.liveOrderDot} />
              )}
            </NavLink>
            <NavLink
              to="/history"
              style={({ isActive }) => ({
                ...styles.navLink,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500'
              })}
            >
              Order History
            </NavLink>
            <NavLink
              to="/loyalty"
              style={({ isActive }) => ({
                ...styles.navLink,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500'
              })}
            >
              Rewards
              <span style={styles.pointsPill}>{studentUser.loyaltyPoints} pts</span>
            </NavLink>
          </nav>
        )}

        {/* Right Action Icons & Profile */}
        <div style={styles.rightGroup}>
          {!isStaffRoute && !isTVRoute ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    if (!showNotifMenu) markNotificationsAsRead();
                  }}
                  style={styles.iconBtn}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotifs > 0 && (
                    <span style={styles.notifBadge}>{unreadNotifs}</span>
                  )}
                </button>

                {showNotifMenu && (
                  <div style={styles.notifDropdown}>
                    <div style={styles.notifHeader}>
                      <span>Alerts & Updates</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {studentNotifications.length} updates
                      </span>
                    </div>
                    <div style={styles.notifList}>
                      {studentNotifications.map((n) => (
                        <div key={n.id} style={styles.notifItem}>
                          <div style={styles.notifTitle}>{n.title}</div>
                          <div style={styles.notifMsg}>{n.message}</div>
                          <div style={styles.notifTime}>{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button
                onClick={() => navigate('/cart')}
                style={styles.cartBtn}
                title="View Cart & Checkout"
              >
                <ShoppingBag size={18} />
                <span style={{ fontWeight: '600' }}>Cart</span>
                <span style={styles.cartBadge}>{cartItemsCount}</span>
              </button>

              {/* Student Profile Pill */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={styles.profileBtn}
                  title="Student Account"
                >
                  <div style={styles.avatar}>
                    {studentUser.name.charAt(0)}
                  </div>
                  <div style={styles.profileInfo} className="hide-on-mobile">
                    <div style={styles.profileName}>{studentUser.name}</div>
                    <div style={styles.profileSub}>
                      {studentUser.isGuest ? 'Guest Mode' : `${studentUser.loyaltyPoints} Pts`}
                    </div>
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {showProfileMenu && (
                  <div style={styles.profileDropdown}>
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{studentUser.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{studentUser.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '4px' }}>
                        ID: {studentUser.rollNo} • {studentUser.loyaltyPoints} Rewards Points
                      </div>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <button
                        onClick={() => {
                          toggleGuestMode(!studentUser.isGuest);
                          setShowProfileMenu(false);
                        }}
                        style={styles.dropdownActionBtn}
                      >
                        <User size={14} />
                        <span>{studentUser.isGuest ? 'Switch to Registered Student' : 'Switch to Guest Diner'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/loyalty');
                        }}
                        style={styles.dropdownActionBtn}
                      >
                        <Award size={14} />
                        <span>Redeem Rewards</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/history');
                        }}
                        style={styles.dropdownActionBtn}
                      >
                        <Clock size={14} />
                        <span>Order History</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Staff Mode Top Bar Actions */
            <div style={styles.staffHeaderActions}>
              <button
                onClick={() => navigate('/')}
                style={styles.backToStudentBtn}
              >
                <span>← Back to Student Diner</span>
              </button>
              <div style={styles.staffBadge}>
                {staffUser ? staffUser.name : 'Staff Portal'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)'
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0.75rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    cursor: 'pointer',
    userSelect: 'none'
  },
  logoEmoji: {
    fontSize: '1.8rem',
    backgroundColor: '#1e293b',
    padding: '4px 8px',
    borderRadius: '10px'
  },
  brandTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-0.3px',
    lineHeight: 1.1
  },
  brandBadge: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '500'
  },
  personaSwitchBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    backgroundColor: '#1e293b',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  personaText: {
    maxWidth: '140px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  dropdownModal: {
    position: 'absolute',
    top: '42px',
    left: 0,
    width: '320px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-lg)',
    padding: '0.5rem',
    zIndex: 1100,
    animation: 'fadeIn 0.15s ease-out'
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '0.35rem'
  },
  personaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    maxHeight: '380px',
    overflowY: 'auto'
  },
  personaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s'
  },
  personaItemTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  personaItemDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    lineHeight: 1.2
  },
  centerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  navLink: {
    fontSize: '0.9rem',
    padding: '6px 10px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    position: 'relative'
  },
  liveOrderDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981'
  },
  pointsPill: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    color: 'var(--accent-primary)',
    fontSize: '0.7rem',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: '700'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem'
  },
  iconBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: '#1e293b',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer'
  },
  notifBadge: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    backgroundColor: '#ef4444',
    color: '#fff',
    borderRadius: '10px',
    fontSize: '0.65rem',
    padding: '2px 5px',
    fontWeight: '700'
  },
  cartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '0.88rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)'
  },
  cartBadge: {
    backgroundColor: '#fff',
    color: 'var(--accent-primary)',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '800'
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#1e293b',
    border: '1px solid var(--border-color)',
    padding: '4px 10px',
    borderRadius: '24px',
    cursor: 'pointer'
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.8rem'
  },
  profileInfo: {
    textAlign: 'left'
  },
  profileName: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  profileSub: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)'
  },
  notifDropdown: {
    position: 'absolute',
    top: '46px',
    right: 0,
    width: '310px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-lg)',
    padding: '0.5rem',
    zIndex: 1100
  },
  notifHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0.75rem',
    fontWeight: '700',
    fontSize: '0.85rem',
    borderBottom: '1px solid var(--border-color)'
  },
  notifList: {
    maxHeight: '300px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    padding: '0.5rem 0'
  },
  notifItem: {
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
  },
  notifTitle: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  notifMsg: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    lineHeight: 1.3
  },
  notifTime: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    marginTop: '4px'
  },
  profileDropdown: {
    position: 'absolute',
    top: '46px',
    right: 0,
    width: '260px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 1100
  },
  dropdownActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    width: '100%',
    padding: '0.6rem 0.75rem',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    fontSize: '0.82rem',
    textAlign: 'left',
    cursor: 'pointer'
  },
  staffHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  backToStudentBtn: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    color: 'var(--accent-primary)',
    border: '1px solid rgba(249, 115, 22, 0.3)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  staffBadge: {
    backgroundColor: '#1e293b',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '600'
  }
};
