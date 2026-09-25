import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getElapsedMinutes } from '../../utils/formatters';
import { Coffee, Clock, CheckCircle2, Flame } from 'lucide-react';

export default function BeverageDashboard() {
  const { orders, updateOrderStatus } = useStore();

  // Filter to beverage items only
  const beverageOrders = orders.filter((o) => {
    const hasBeverage = o.items.some((i) => i.category === 'Beverage') || o.category === 'Beverage';
    const isOngoing = o.status === 'Pending' || o.status === 'Preparing';
    return hasBeverage && isOngoing;
  });

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Juice & Beverage Counter</h1>
          <p style={styles.pageSubtitle}>
            Live drinks, shakes, mocktails & ice creams queue
          </p>
        </div>
        <div style={styles.beverageBadge}>
          <Coffee size={18} color="#38bdf8" />
          <span>Active Beverage Orders: {beverageOrders.length}</span>
        </div>
      </div>

      {beverageOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <Coffee size={56} color="var(--text-muted)" />
          <h3>All Drinks Prepared!</h3>
          <p>The juice & beverage counter queue is currently clear.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {beverageOrders.map((order) => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const isLate = elapsed > 10;

            return (
              <div key={order.orderId} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <span style={styles.token}>{order.tokenNumber}</span>
                    <div style={styles.orderId}>{order.orderId}</div>
                  </div>
                  <div
                    style={{
                      ...styles.timer,
                      color: isLate ? '#ef4444' : 'var(--text-secondary)'
                    }}
                  >
                    <Clock size={14} />
                    <span>{elapsed}m ago</span>
                  </div>
                </div>

                <div style={styles.itemsSection}>
                  {order.items
                    .filter((item) => item.category === 'Beverage')
                    .map((item, idx) => (
                      <div key={idx} style={styles.itemRow}>
                        <span style={styles.qty}>{item.quantity}x</span>
                        <div style={styles.itemInfo}>
                          <span style={styles.name}>{item.name}</span>
                          {item.customization && (
                            <span style={styles.notes}>Note: {item.customization}</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {order.specialInstructions && (
                  <div style={styles.specialInst}>
                    <span>"{order.specialInstructions}"</span>
                  </div>
                )}

                <div style={styles.actionRow}>
                  {order.status === 'Pending' ? (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Preparing')}
                      style={styles.prepBtn}
                    >
                      <Flame size={16} />
                      <span>Start Blending/Pouring</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Ready')}
                      style={styles.readyBtn}
                    >
                      <CheckCircle2 size={16} />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
  beverageBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    color: '#38bdf8',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  emptyState: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px dashed var(--border-color)',
    borderRadius: '16px',
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'var(--text-secondary)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem'
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '230px'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
    marginBottom: '0.75rem'
  },
  token: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  orderId: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    flex: 1
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
  },
  qty: {
    backgroundColor: 'var(--bg-hover)',
    color: '#38bdf8',
    fontWeight: '700',
    fontSize: '0.85rem',
    padding: '3px 6px',
    borderRadius: '4px'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  notes: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic'
  },
  specialInst: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    padding: '0.4rem 0.6rem',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem'
  },
  actionRow: {
    marginTop: 'auto'
  },
  prepBtn: {
    width: '100%',
    padding: '0.7rem',
    backgroundColor: '#0284c7',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem'
  },
  readyBtn: {
    width: '100%',
    padding: '0.7rem',
    backgroundColor: 'var(--accent-success)',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem'
  }
};
