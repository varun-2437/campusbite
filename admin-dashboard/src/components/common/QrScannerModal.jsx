import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';

/**
 * QR Barcode Scanner modal simulator & camera stream component.
 * Allows instant scanning for tokens and order handover at Cashier & Serving Counter.
 */
export default function QrScannerModal({ isOpen, onClose, onScanSuccess, title = "Scan Order Token QR" }) {
  const [simulatedTokens] = useState(['TK-101', 'TK-102', 'TK-103', 'TK-104', 'TK-105']);
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');

  if (!isOpen) return null;

  const handleSimulateScan = (tok) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScanSuccess(tok);
      onClose();
    }, 400);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onScanSuccess(manualInput.trim().toUpperCase());
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--accent-primary)" />
            <h3 style={styles.title}>{title}</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div style={styles.viewfinder}>
          <div style={styles.scanReticle} />
          <div style={styles.laserLine} />
          <span style={styles.viewfinderText}>
            {isScanning ? 'Decoding QR barcode...' : 'Point camera at student’s digital token QR'}
          </span>
        </div>

        {/* Quick Simulation Options */}
        <div style={styles.simSection}>
          <span style={styles.simLabel}>Tap sample active token to simulate camera scan:</span>
          <div style={styles.simTokensRow}>
            {simulatedTokens.map((t) => (
              <button
                key={t}
                onClick={() => handleSimulateScan(t)}
                style={styles.simTokenBtn}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Fallback */}
        <form onSubmit={handleManualSubmit} style={styles.manualForm}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Or enter Token ID (e.g. TK-102)"
            style={styles.input}
          />
          <button type="submit" style={styles.confirmBtn}>
            <Check size={16} />
            <span>Verify</span>
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '440px',
    boxShadow: 'var(--shadow-lg)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  closeBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    padding: '4px',
    borderRadius: '4px'
  },
  viewfinder: {
    height: '200px',
    backgroundColor: '#0a0f1d',
    borderRadius: '12px',
    border: '2px dashed #475569',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: '1rem'
  },
  scanReticle: {
    width: '140px',
    height: '140px',
    border: '2px solid rgba(249, 115, 22, 0.5)',
    borderRadius: '12px'
  },
  laserLine: {
    position: 'absolute',
    width: '160px',
    height: '2px',
    backgroundColor: '#ef4444',
    boxShadow: '0 0 8px #ef4444',
    animation: 'pulse 1.5s infinite'
  },
  viewfinderText: {
    position: 'absolute',
    bottom: '10px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  simSection: {
    marginBottom: '1rem'
  },
  simLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    display: 'block',
    marginBottom: '0.4rem'
  },
  simTokensRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  simTokenBtn: {
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  manualForm: {
    display: 'flex',
    gap: '0.5rem'
  },
  input: {
    flex: 1,
    padding: '0.6rem 0.8rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none'
  },
  confirmBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem'
  }
};
