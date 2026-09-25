import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatTime } from '../../utils/formatters';
import {
  QrCode,
  CheckCircle,
  Clock,
  Tv,
  ExternalLink,
  Search,
  PackageCheck
} from 'lucide-react';

export default function ServingCounter() {
  const { orders, updateOrderStatus } = useStore();
  const [tokenInput, setTokenInput] = useState('');
  const [handoverAlert, setHandoverAlert] = useState(null);

  // Ready orders waiting for customer pickup
  const readyOrders = orders.filter((o) => o.status === 'Ready');

  // Currently preparing orders
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');

  const handleHandover = (tokenOrOrderId) => {
    const target = orders.find(
      (o) =>
        (o.tokenNumber.toUpperCase() === tokenOrOrderId.trim().toUpperCase() ||
          o.orderId.toUpperCase() === tokenOrOrderId.trim().toUpperCase()) &&
        o.status === 'Ready'
    );

    if (target) {
      updateOrderStatus(target.orderId, 'Collected');
      setHandoverAlert({
        type: 'success',
        msg: `Token ${target.tokenNumber} (${target.customerName}) handed over & marked Collected!`
      });
      setTokenInput('');
    } else {
      setHandoverAlert({
        type: 'error',
        msg: `Token ${tokenOrOrderId} not found or not yet in "Ready" status.`
      });
    }

    setTimeout(() => setHandoverAlert(null), 4000);
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Food / Serving Counter</h1>
          <p style={styles.pageSubtitle}>
            Validate tokens, hand over prepared meals, and manage the pickup queue
          </p>
        </div>

        <Link to="/now-serving" target="_blank" style={styles.tvLinkBtn}>
          <Tv size={16} />
          <span>Launch "Now Serving" TV Display</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Handover Input Card */}
      <div style={styles.scanCard}>
        <h3 style={styles.cardHeading}>Scan / Enter Token for Handover</h3>
        <p style={styles.cardText}>
          Customer presents token QR or ticket number at pickup counter.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tokenInput) handleHandover(tokenInput);
          }}
          style={styles.scanForm}
        >
          <div style={styles.inputWrapper}>
            <Search size={18} color="var(--text-muted)" style={styles.inputIcon} />
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Scan QR barcode or enter Token ID (e.g. TK-104)"
              style={styles.scanInput}
            />
          </div>
          <button type="submit" style={styles.handoverSubmitBtn}>
            <PackageCheck size={18} />
            <span>Confirm Handover</span>
          </button>
        </form>

        {handoverAlert && (
          <div
            style={
              handoverAlert.type === 'success'
                ? styles.alertSuccess
                : styles.alertError
            }
          >
            {handoverAlert.msg}
          </div>
        )}
      </div>

      {/* Two-Column Queue Overview */}
      <div style={styles.queueGrid}>
        {/* Column 1: Ready for Pickup */}
        <div style={styles.queueCol}>
          <div style={styles.colHeaderReady}>
            <CheckCircle size={18} color="#10b981" />
            <h3 style={styles.colTitle}>Ready for Handover ({readyOrders.length})</h3>
          </div>

          <div style={styles.ordersList}>
            {readyOrders.length === 0 ? (
              <div style={styles.emptyColNotice}>No orders currently waiting for pickup.</div>
            ) : (
              readyOrders.map((order) => (
                <div key={order.orderId} style={styles.orderCardReady}>
                  <div style={styles.orderTop}>
                    <span style={styles.tokenHighlight}>{order.tokenNumber}</span>
                    <span style={styles.customerTag}>{order.customerName}</span>
                  </div>

                  <div style={styles.itemsSummary}>
                    {order.items.map((i, idx) => (
                      <span key={idx} style={styles.itemChip}>
                        {i.name} (x{i.quantity})
                      </span>
                    ))}
                  </div>

                  <div style={styles.orderBottom}>
                    <span style={styles.timeTag}>Ready since {formatTime(order.createdAt)}</span>
                    <button
                      onClick={() => handleHandover(order.tokenNumber)}
                      style={styles.quickHandoverBtn}
                    >
                      Hand Over
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Currently Preparing */}
        <div style={styles.queueCol}>
          <div style={styles.colHeaderPrep}>
            <Clock size={18} color="#f59e0b" />
            <h3 style={styles.colTitle}>Currently in Kitchen ({preparingOrders.length})</h3>
          </div>

          <div style={styles.ordersList}>
            {preparingOrders.length === 0 ? (
              <div style={styles.emptyColNotice}>No orders in preparation right now.</div>
            ) : (
              preparingOrders.map((order) => (
                <div key={order.orderId} style={styles.orderCardPrep}>
                  <div style={styles.orderTop}>
                    <span style={styles.tokenPrepHighlight}>{order.tokenNumber}</span>
                    <span style={styles.customerTag}>{order.customerName}</span>
                  </div>

                  <div style={styles.itemsSummary}>
                    {order.items.map((i, idx) => (
                      <span key={idx} style={styles.itemChip}>
                        {i.name} (x{i.quantity})
                      </span>
                    ))}
                  </div>

                  <div style={styles.orderBottom}>
                    <span style={styles.timeTag}>Cooking started {formatTime(order.createdAt)}</span>
                    <span style={styles.prepStatusPill}>Preparing</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  pageSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  tvLinkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--accent-primary)',
    padding: '0.6rem 1.1rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  scanCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  cardHeading: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  cardText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '1rem'
  },
  scanForm: {
    display: 'flex',
    gap: '1rem',
    maxWidth: '650px'
  },
  inputWrapper: {
    position: 'relative',
    flex: 1
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  scanInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.4rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  handoverSubmitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap'
  },
  alertSuccess: {
    marginTop: '1rem',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.85rem'
  },
  alertError: {
    marginTop: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.85rem'
  },
  queueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  queueCol: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.25rem'
  },
  colHeaderReady: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '1rem'
  },
  colHeaderPrep: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '1rem'
  },
  colTitle: {
    fontSize: '1.05rem',
    fontWeight: '600'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  emptyColNotice: {
    padding: '2rem 1rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.85rem'
  },
  orderCardReady: {
    backgroundColor: 'var(--bg-primary)',
    borderLeft: '4px solid #10b981',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  orderCardPrep: {
    backgroundColor: 'var(--bg-primary)',
    borderLeft: '4px solid #f59e0b',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  orderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tokenHighlight: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#10b981'
  },
  tokenPrepHighlight: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#f59e0b'
  },
  customerTag: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  itemsSummary: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem'
  },
  itemChip: {
    backgroundColor: 'var(--bg-hover)',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-primary)'
  },
  orderBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.25rem'
  },
  timeTag: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  quickHandoverBtn: {
    backgroundColor: 'var(--accent-success)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  prepStatusPill: {
    fontSize: '0.75rem',
    color: '#f59e0b',
    fontWeight: '600',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px'
  }
};
