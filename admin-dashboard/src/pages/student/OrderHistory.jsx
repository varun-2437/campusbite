import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Filter,
  Calendar,
  Utensils
} from 'lucide-react';

export default function OrderHistory() {
  const {
    orders,
    studentOrderHistory,
    reorderPreviousOrder,
    setActiveStudentOrderId
  } = useStore();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState('All');

  const historyList = (studentOrderHistory.length > 0 ? studentOrderHistory : orders);

  const filteredHistory = historyList.filter((ord) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') return ord.status !== 'Collected' && ord.status !== 'Cancelled';
    if (filterStatus === 'Completed') return ord.status === 'Collected';
    if (filterStatus === 'Cancelled') return ord.status === 'Cancelled';
    return true;
  });

  const handleReorder = (order) => {
    reorderPreviousOrder(order);
    navigate('/cart');
  };

  const handleTrack = (order) => {
    setActiveStudentOrderId(order.orderId);
    navigate('/track');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Order History & Past Receipts</h1>
          <p style={styles.pageSubtitle}>
            Reorder your campus favorites in 1 click or track active tokens.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={styles.filterGroup}>
          {['All', 'Active', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                ...styles.filterBtn,
                backgroundColor: filterStatus === st ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: filterStatus === st ? '#fff' : 'var(--text-secondary)',
                borderColor: filterStatus === st ? 'var(--accent-primary)' : 'var(--border-color)'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div style={styles.emptyCard}>
          <Clock size={40} color="var(--text-muted)" />
          <h3 style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            No past orders match the selected filter.
          </p>
          <button onClick={() => navigate('/')} style={styles.menuBtn}>
            <Utensils size={15} />
            <span>Browse Campus Menu</span>
          </button>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {filteredHistory.map((order) => {
            const isActive = order.status !== 'Collected' && order.status !== 'Cancelled';

            return (
              <div key={order.orderId} style={styles.orderCard}>
                <div style={styles.orderCardHeader}>
                  <div style={styles.headerLeft}>
                    <div style={styles.tokenBadge}>{order.tokenNumber}</div>
                    <div>
                      <div style={styles.orderIdText}>{order.orderId}</div>
                      <div style={styles.orderDate}>
                        <Calendar size={12} />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.headerRight}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          order.status === 'Ready'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : order.status === 'Preparing'
                            ? 'rgba(251, 146, 60, 0.15)'
                            : order.status === 'Collected'
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          order.status === 'Ready'
                            ? '#10b981'
                            : order.status === 'Preparing'
                            ? 'var(--accent-secondary)'
                            : order.status === 'Collected'
                            ? '#3b82f6'
                            : '#f59e0b'
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={styles.orderTotal}>₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Items List */}
                <div style={styles.itemsBlock}>
                  {order.items?.map((itm, idx) => (
                    <div key={idx} style={styles.itemRow}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {itm.quantity}x {itm.name}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>₹{itm.price * itm.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Card Actions Footer */}
                <div style={styles.cardFooter}>
                  <div style={styles.paymentMethodText}>
                    Paid via <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                  </div>

                  <div style={styles.btnRow}>
                    {isActive ? (
                      <button
                        onClick={() => handleTrack(order)}
                        style={styles.trackBtn}
                      >
                        <Clock size={14} />
                        <span>Track Live Stepper</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReorder(order)}
                        style={styles.reorderBtn}
                      >
                        <RotateCcw size={14} />
                        <span>Reorder in 1-Click</span>
                      </button>
                    )}
                  </div>
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
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '1.5rem',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  pageSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  filterGroup: {
    display: 'flex',
    gap: '0.4rem'
  },
  filterBtn: {
    padding: '6px 12px',
    borderRadius: '16px',
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  orderCard: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '1.25rem',
    boxShadow: 'var(--shadow-sm)'
  },
  orderCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.85rem',
    borderBottom: '1px solid var(--border-color)',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  tokenBadge: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--accent-primary)',
    color: 'var(--accent-primary)',
    fontWeight: '800',
    fontSize: '1rem',
    padding: '6px 12px',
    borderRadius: '8px'
  },
  orderIdText: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  orderDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  orderTotal: {
    fontSize: '1.2rem',
    fontWeight: '900',
    color: 'var(--text-primary)'
  },
  itemsBlock: {
    padding: '0.85rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  cardFooter: {
    paddingTop: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  paymentMethodText: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)'
  },
  btnRow: {
    display: 'flex',
    gap: '0.5rem'
  },
  trackBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  reorderBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
  },
  emptyCard: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px dashed var(--border-color)',
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  menuBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.88rem',
    marginTop: '1.25rem',
    cursor: 'pointer'
  }
};
