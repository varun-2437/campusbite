import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useStore } from '../../context/StoreContext';
import { Bell, AlertTriangle } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const { inventory } = useStore();

  const isFullscreenView = location.pathname === '/now-serving';
  if (isFullscreenView) {
    return <Outlet />;
  }

  // Check for critical low-stock items (quantity <= threshold)
  const lowStockItems = inventory.filter((item) => item.quantity <= item.threshold);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        {lowStockItems.length > 0 && (
          <div style={styles.banner}>
            <AlertTriangle size={18} color="#f59e0b" />
            <span>
              <strong>Inventory Alert:</strong> {lowStockItems.length} item(s) are low or out of stock (
              {lowStockItems.map((i) => `${i.itemName}: ${i.quantity} ${i.unit}`).join(', ')}).
            </span>
          </div>
        )}
        <div style={styles.pageBody}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden'
  },
  banner: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
    color: '#fbbf24',
    padding: '0.65rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem'
  },
  pageBody: {
    flex: 1,
    padding: '1.5rem 2rem',
    maxWidth: '1600px',
    width: '100%',
    boxSizing: 'border-box'
  }
};
