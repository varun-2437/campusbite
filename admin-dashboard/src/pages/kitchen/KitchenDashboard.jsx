import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { getElapsedMinutes } from '../../utils/formatters';
import {
  ChefHat,
  Clock,
  AlertCircle,
  CheckCircle2,
  Flame,
  Filter
} from 'lucide-react';

export default function KitchenDashboard() {
  const { orders, updateOrderStatus } = useStore();
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Filter to Food items only
  const foodOrders = orders.filter((o) => {
    const hasFood = o.items.some((i) => i.category === 'Food') || o.category === 'Food';
    const isOngoing = o.status === 'Pending' || o.status === 'Preparing';
    const priorityMatch = filterPriority === 'ALL' || o.priority === filterPriority;
    return hasFood && isOngoing && priorityMatch;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'VIP':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', border: '#ef4444' };
      case 'Quick':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', border: '#3b82f6' };
      case 'Bulk':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', border: '#f59e0b' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', border: '#475569' };
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Kitchen Display System (KDS)</h1>
          <p style={styles.pageSubtitle}>
            Live food queue feed • Real-time order progress & ticket management
          </p>
        </div>

        <div style={styles.filterBar}>
          <Filter size={16} color="var(--text-secondary)" />
          <button
            onClick={() => setFilterPriority('ALL')}
            style={{ ...styles.filterBtn, ...(filterPriority === 'ALL' ? styles.filterBtnActive : {}) }}
          >
            All Tickets ({foodOrders.length})
          </button>
          <button
            onClick={() => setFilterPriority('VIP')}
            style={{ ...styles.filterBtn, ...(filterPriority === 'VIP' ? styles.filterBtnActive : {}) }}
          >
            VIP
          </button>
          <button
            onClick={() => setFilterPriority('Quick')}
            style={{ ...styles.filterBtn, ...(filterPriority === 'Quick' ? styles.filterBtnActive : {}) }}
          >
            Quick Snack
          </button>
          <button
            onClick={() => setFilterPriority('Bulk')}
            style={{ ...styles.filterBtn, ...(filterPriority === 'Bulk' ? styles.filterBtnActive : {}) }}
          >
            Bulk
          </button>
        </div>
      </div>

      {foodOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <ChefHat size={56} color="var(--text-muted)" />
          <h3>All Food Orders Completed!</h3>
          <p>No pending food tickets right now. Waiting for new orders from app & cashier.</p>
        </div>
      ) : (
        <div style={styles.ticketsGrid}>
          {foodOrders.map((order) => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const pStyle = getPriorityStyle(order.priority);
            const isLate = elapsed > 15;

            return (
              <div
                key={order.orderId}
                style={{
                  ...styles.ticketCard,
                  borderColor: isLate ? '#ef4444' : order.status === 'Preparing' ? 'var(--accent-primary)' : 'var(--border-color)'
                }}
              >
                {/* Header with Token & Timer */}
                <div style={styles.ticketHeader}>
                  <div>
                    <div style={styles.tokenTag}>{order.tokenNumber}</div>
                    <span style={styles.orderIdText}>{order.orderId}</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        ...styles.timerBadge,
                        backgroundColor: isLate ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: isLate ? '#ef4444' : 'var(--text-secondary)'
                      }}
                    >
                      <Clock size={14} />
                      <span>{elapsed}m ago</span>
                    </div>
                    <span
                      style={{
                        ...styles.priorityTag,
                        backgroundColor: pStyle.bg,
                        color: pStyle.text,
                        borderColor: pStyle.border
                      }}
                    >
                      {order.priority}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div style={styles.itemsList}>
                  {order.items
                    .filter((item) => item.category === 'Food')
                    .map((item, idx) => (
                      <div key={idx} style={styles.itemRow}>
                        <div style={styles.itemQtyBadge}>{item.quantity}x</div>
                        <div style={styles.itemDetails}>
                          <span style={styles.itemTitle}>{item.name}</span>
                          {item.customization && (
                            <span style={styles.customizationText}>Note: {item.customization}</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div style={styles.instructionsBox}>
                    <AlertCircle size={14} color="#f59e0b" />
                    <span>"{order.specialInstructions}"</span>
                  </div>
                )}

                {/* Status Transition Action Buttons */}
                <div style={styles.ticketActions}>
                  {order.status === 'Pending' ? (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Preparing')}
                      style={styles.startPrepBtn}
                    >
                      <Flame size={16} />
                      <span>Start Preparing</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Ready')}
                      style={styles.markReadyBtn}
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
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-secondary)',
    padding: '4px 8px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)'
  },
  filterBtn: {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  filterBtnActive: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
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
  ticketsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  ticketCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '2px solid var(--border-color)',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '260px'
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
    marginBottom: '0.75rem'
  },
  tokenTag: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  orderIdText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  timerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  priorityTag: {
    fontSize: '0.7rem',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid',
    fontWeight: '700',
    display: 'inline-block'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    flex: 1,
    marginBottom: '1rem'
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  itemQtyBadge: {
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--accent-primary)',
    fontWeight: '800',
    fontSize: '0.9rem',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  customizationText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic'
  },
  instructionsBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    color: '#fbbf24',
    marginBottom: '1rem'
  },
  ticketActions: {
    marginTop: 'auto'
  },
  startPrepBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  markReadyBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'var(--accent-success)',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  }
};
