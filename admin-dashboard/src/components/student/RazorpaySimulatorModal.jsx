import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, CreditCard, Smartphone, Building, RefreshCw } from 'lucide-react';

export default function RazorpaySimulatorModal({ amount, orderDetails, onSuccess, onFailure, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSimulatePayment = (success = true) => {
    setProcessing(true);
    setStatusMessage('Contacting Razorpay Secure Gateway...');

    setTimeout(() => {
      setStatusMessage('Authorizing transaction with bank...');
    }, 800);

    setTimeout(() => {
      setProcessing(false);
      if (success) {
        const paymentId = `pay_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;
        onSuccess(paymentId);
      } else {
        onFailure('Payment failed or cancelled by user. Please try again.');
      }
    }, 1600);
  };

  return (
    <div style={styles.overlay} onClick={!processing ? onClose : undefined}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Razorpay Brand Bar */}
        <div style={styles.rzpHeader}>
          <div style={styles.rzpBrand}>
            <div style={styles.rzpLogo}>R</div>
            <div>
              <div style={styles.rzpTitle}>Razorpay Gateway</div>
              <div style={styles.rzpSubtitle}>CampusBite Secure Checkout [Sandbox]</div>
            </div>
          </div>
          {!processing && (
            <button onClick={onClose} style={styles.closeBtn}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Amount Display */}
        <div style={styles.amountBox}>
          <div>
            <div style={styles.amountLabel}>Total Payable Amount</div>
            <div style={styles.amountValue}>₹{amount.toFixed(2)}</div>
          </div>
          <div style={styles.secureBadge}>
            <ShieldCheck size={16} color="#10b981" />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        {/* Processing State */}
        {processing ? (
          <div style={styles.processingState}>
            <div style={styles.spinner} />
            <h4 style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>Processing Payment</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {statusMessage}
            </p>
          </div>
        ) : (
          <div style={styles.body}>
            {/* Method Tabs */}
            <div style={styles.methodTabs}>
              <button
                onClick={() => setSelectedMethod('upi')}
                style={{
                  ...styles.tabBtn,
                  borderBottomColor: selectedMethod === 'upi' ? 'var(--accent-info)' : 'transparent',
                  color: selectedMethod === 'upi' ? 'var(--accent-info)' : 'var(--text-muted)'
                }}
              >
                <Smartphone size={16} />
                <span>UPI / QR</span>
              </button>
              <button
                onClick={() => setSelectedMethod('card')}
                style={{
                  ...styles.tabBtn,
                  borderBottomColor: selectedMethod === 'card' ? 'var(--accent-info)' : 'transparent',
                  color: selectedMethod === 'card' ? 'var(--accent-info)' : 'var(--text-muted)'
                }}
              >
                <CreditCard size={16} />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setSelectedMethod('netbanking')}
                style={{
                  ...styles.tabBtn,
                  borderBottomColor: selectedMethod === 'netbanking' ? 'var(--accent-info)' : 'transparent',
                  color: selectedMethod === 'netbanking' ? 'var(--accent-info)' : 'var(--text-muted)'
                }}
              >
                <Building size={16} />
                <span>NetBanking</span>
              </button>
            </div>

            {/* UPI Option */}
            {selectedMethod === 'upi' && (
              <div style={styles.tabContent}>
                <div style={styles.upiGrid}>
                  <div
                    onClick={() => setSelectedUpiApp('gpay')}
                    style={{
                      ...styles.upiCard,
                      borderColor: selectedUpiApp === 'gpay' ? '#3b82f6' : 'var(--border-color)',
                      backgroundColor: selectedUpiApp === 'gpay' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🔵</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Google Pay</span>
                  </div>
                  <div
                    onClick={() => setSelectedUpiApp('phonepe')}
                    style={{
                      ...styles.upiCard,
                      borderColor: selectedUpiApp === 'phonepe' ? '#3b82f6' : 'var(--border-color)',
                      backgroundColor: selectedUpiApp === 'phonepe' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🟣</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>PhonePe</span>
                  </div>
                  <div
                    onClick={() => setSelectedUpiApp('paytm')}
                    style={{
                      ...styles.upiCard,
                      borderColor: selectedUpiApp === 'paytm' ? '#3b82f6' : 'var(--border-color)',
                      backgroundColor: selectedUpiApp === 'paytm' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🔷</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Paytm UPI</span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={styles.inputLabel}>UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={styles.inputField}
                  />
                </div>
              </div>
            )}

            {/* Cards Option */}
            {selectedMethod === 'card' && (
              <div style={styles.tabContent}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Card Number</label>
                  <input
                    type="text"
                    defaultValue="4111 2222 3333 4444 (Test Visa)"
                    style={styles.inputField}
                    disabled
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.inputLabel}>Valid Thru</label>
                    <input type="text" defaultValue="12/28" style={styles.inputField} disabled />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.inputLabel}>CVV</label>
                    <input type="password" defaultValue="123" style={styles.inputField} disabled />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking Option */}
            {selectedMethod === 'netbanking' && (
              <div style={styles.tabContent}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Popular Banks</label>
                  <select style={styles.inputField} defaultValue="sbi">
                    <option value="sbi">State Bank of India (SBI)</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                  </select>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                onClick={() => handleSimulatePayment(true)}
                style={styles.successBtn}
              >
                <CheckCircle2 size={16} />
                <span>Simulate Payment Success (₹{amount.toFixed(2)})</span>
              </button>

              <button
                onClick={() => handleSimulatePayment(false)}
                style={styles.failBtn}
              >
                <AlertTriangle size={15} />
                <span>Simulate Payment Decline / Cancel</span>
              </button>
            </div>
          </div>
        )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
    padding: '1rem',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    backgroundColor: '#0f172a',
    borderRadius: '16px',
    border: '1px solid #1e293b',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden'
  },
  rzpHeader: {
    backgroundColor: '#0c2340',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #1e3a5f'
  },
  rzpBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  rzpLogo: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#3395ff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '900',
    fontSize: '1.1rem'
  },
  rzpTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff'
  },
  rzpSubtitle: {
    fontSize: '0.7rem',
    color: '#93c5fd'
  },
  closeBtn: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  amountBox: {
    backgroundColor: '#131f37',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #1e293b'
  },
  amountLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  amountValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff'
  },
  secureBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.75rem',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: '4px 8px',
    borderRadius: '12px'
  },
  body: {
    padding: '1.25rem'
  },
  methodTabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '1rem'
  },
  tabBtn: {
    flex: 1,
    padding: '0.6rem',
    backgroundColor: 'transparent',
    borderBottom: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tabContent: {
    marginBottom: '1.25rem'
  },
  upiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem'
  },
  upiCard: {
    border: '1px solid',
    borderRadius: '8px',
    padding: '0.6rem 0.4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    cursor: 'pointer',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '0.75rem'
  },
  inputLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '4px',
    fontWeight: '500'
  },
  inputField: {
    width: '100%',
    padding: '0.65rem 0.8rem',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.85rem'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    paddingTop: '0.5rem'
  },
  successBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#3395ff',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(51, 149, 255, 0.35)'
  },
  failBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '0.6rem',
    borderRadius: '8px',
    fontSize: '0.78rem',
    cursor: 'pointer'
  },
  processingState: {
    padding: '3rem 1.5rem',
    textAlign: 'center'
  },
  spinner: {
    width: '42px',
    height: '42px',
    border: '4px solid rgba(51, 149, 255, 0.2)',
    borderTopColor: '#3395ff',
    borderRadius: '50%',
    margin: '0 auto',
    animation: 'pulse 1s infinite linear'
  }
};
