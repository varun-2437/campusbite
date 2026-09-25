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
  Layers,
  Users,
  MessageSquare
} from 'lucide-react';

export default function Sidebar() {
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
    { to: '/manager/inventory', label: 'Inventory', icon: Package, roles: ['manager'] },
    { to: '/manager/reports', label: 'Sales Reports', icon: BarChart3, roles: ['manager'] },
    { to: '/manager/staff', label: 'Staff Accounts', icon: Users, roles: ['manager'] },
    { to: '/manager/feedback', label: 'Feedback', icon: MessageSquare, roles: ['manager'] }
  ];

  const visibleItems = navItems.filter(
    (item) => !user || user.role === 'manager' || item.roles.includes(user.role)
  );

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logoIcon}>🍔</div>
        <div>
          <h2 style={styles.brandTitle}>CampusBite</h2>
          <span style={styles.brandSubtitle}>Staff & Admin Portal</span>
        </div>
      </div>

      <nav style={styles.nav}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)'
              })}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={styles.badge}>{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userProfile}>
          <div style={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={styles.userName}>{user?.name || 'Staff User'}</div>
            <div style={styles.userRole}>{user?.role?.toUpperCase()}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0
  },
  brand: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderBottom: '1px solid var(--border-color)'
  },
  logoIcon: {
    fontSize: '1.8rem',
    backgroundColor: '#334155',
    borderRadius: '10px',
    padding: '4px 8px'
  },
  brandTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: 1.2
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  nav: {
    flex: 1,
    padding: '1rem 0.75rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.15s ease'
  },
  badge: {
    backgroundColor: '#ef4444',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '0.75rem',
    padding: '2px 8px',
    fontWeight: '700'
  },
  footer: {
    padding: '1rem',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    overflow: 'hidden'
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem'
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  userRole: {
    fontSize: '0.7rem',
    color: 'var(--accent-secondary)',
    fontWeight: '600'
  },
  logoutBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
    cursor: 'pointer'
  }
};
