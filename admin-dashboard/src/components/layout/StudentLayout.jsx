import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedNavbar from '../navigation/UnifiedNavbar';

export default function StudentLayout() {
  return (
    <div style={styles.container}>
      <UnifiedNavbar />
      <main style={styles.main}>
        <Outlet />
      </main>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <span>🍔</span>
            <span style={{ fontWeight: '800', color: '#fff' }}>CampusBite</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              • Smart Dining & Canteen Operations Ecosystem
            </span>
          </div>
          <div style={styles.footerLinks}>
            <span>⚡ Realtime Socket Sync</span>
            <span>💳 Razorpay Simulated Sandbox</span>
            <span>📱 Responsive Web & Mobile</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)'
  },
  main: {
    flex: 1
  },
  footer: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    padding: '1.25rem 1.5rem',
    marginTop: 'auto'
  },
  footerContent: {
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem'
  },
  footerLinks: {
    display: 'flex',
    gap: '1.25rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  }
};
