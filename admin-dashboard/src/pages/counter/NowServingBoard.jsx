import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Utensils, Clock, CheckCircle2, Volume2 } from 'lucide-react';

export default function NowServingBoard() {
  const { orders } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const readyTokens = orders
    .filter((o) => o.status === 'Ready')
    .map((o) => o.tokenNumber);

  const preparingTokens = orders
    .filter((o) => o.status === 'Preparing')
    .map((o) => o.tokenNumber);

  return (
    <div style={styles.tvScreen}>
      {/* Top Banner */}
      <header style={styles.topHeader}>
        <div style={styles.branding}>
          <span style={styles.logo}>🍔</span>
          <div>
            <h1 style={styles.title}>CampusBite Cafeteria</h1>
            <p style={styles.subtitle}>Order Pickup Display System</p>
          </div>
        </div>

        <div style={styles.clockBox}>
          <Clock size={22} color="var(--accent-primary)" />
          <span style={styles.clockText}>{currentTime}</span>
        </div>
      </header>

      {/* Main Two Column Display */}
      <div style={styles.grid}>
        {/* NOW READY COLUMN */}
        <div style={styles.columnReady}>
          <div style={styles.colBannerReady}>
            <CheckCircle2 size={32} color="#10b981" />
            <div>
              <h2 style={styles.colTitleReady}>NOW SERVING / READY</h2>
              <span style={styles.colSubReady}>Please proceed to counter for pickup</span>
            </div>
          </div>

          <div style={styles.tokensGrid}>
            {readyTokens.length === 0 ? (
              <div style={styles.noTokensText}>No orders currently awaiting pickup.</div>
            ) : (
              readyTokens.map((token, idx) => (
                <div key={idx} style={styles.tokenBoxReady}>
                  {token}
                </div>
              ))
            )}
          </div>
        </div>

        {/* PREPARING COLUMN */}
        <div style={styles.columnPrep}>
          <div style={styles.colBannerPrep}>
            <Clock size={32} color="#f59e0b" />
            <div>
              <h2 style={styles.colTitlePrep}>PREPARING IN KITCHEN</h2>
              <span style={styles.colSubPrep}>Your meal is being freshly cooked</span>
            </div>
          </div>

          <div style={styles.tokensGrid}>
            {preparingTokens.length === 0 ? (
              <div style={styles.noTokensText}>No orders currently in preparation.</div>
            ) : (
              preparingTokens.map((token, idx) => (
                <div key={idx} style={styles.tokenBoxPrep}>
                  {token}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Ticker */}
      <footer style={styles.footerTicker}>
        <Volume2 size={18} color="var(--accent-primary)" />
        <span>
          📢 Please have your digital token QR or printed slip ready when your number is called. Thank you for dining with CampusBite!
        </span>
      </footer>
    </div>
  );
}

const styles = {
  tvScreen: {
    minHeight: '100vh',
    backgroundColor: '#090d16',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-family)',
    padding: '1.5rem'
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#111827',
    borderRadius: '16px',
    border: '1px solid #1f2937',
    marginBottom: '1.5rem'
  },
  branding: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logo: {
    fontSize: '2.5rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#fff',
    margin: 0
  },
  subtitle: {
    fontSize: '1rem',
    color: '#9ca3af',
    margin: 0
  },
  clockBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: '#1f2937',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px'
  },
  clockText: {
    fontSize: '1.6rem',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  columnReady: {
    backgroundColor: '#0f291e',
    borderRadius: '20px',
    border: '2px solid #059669',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  colBannerReady: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: '#064e3b',
    padding: '1.25rem 2rem',
    borderBottom: '2px solid #059669'
  },
  colTitleReady: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#34d399',
    margin: 0
  },
  colSubReady: {
    fontSize: '0.9rem',
    color: '#a7f3d0'
  },
  columnPrep: {
    backgroundColor: '#261b0c',
    borderRadius: '20px',
    border: '2px solid #d97706',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  colBannerPrep: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: '#451a03',
    padding: '1.25rem 2rem',
    borderBottom: '2px solid #d97706'
  },
  colTitlePrep: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#fbbf24',
    margin: 0
  },
  colSubPrep: {
    fontSize: '0.9rem',
    color: '#fde68a'
  },
  tokensGrid: {
    padding: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1.25rem',
    alignContent: 'start',
    flex: 1
  },
  tokenBoxReady: {
    backgroundColor: '#059669',
    color: '#ffffff',
    fontSize: '2.5rem',
    fontWeight: '900',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem 1rem',
    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.4)',
    animation: 'pulse 2s infinite'
  },
  tokenBoxPrep: {
    backgroundColor: '#78350f',
    color: '#fef3c7',
    fontSize: '2.2rem',
    fontWeight: '800',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.25rem 1rem',
    border: '1px solid #d97706'
  },
  noTokensText: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem 1rem',
    fontSize: '1.2rem',
    color: '#6b7280'
  },
  footerTicker: {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '0.85rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1rem',
    color: '#d1d5db'
  }
};
