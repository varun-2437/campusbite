import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import FeedbackModal from '../../components/student/FeedbackModal';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  ShoppingBag,
  QrCode,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Star,
  RefreshCw,
  Utensils,
  ChevronDown
} from 'lucide-react';

export default function OrderTracking() {
  const {
    orders,
    currentActiveStudentOrder,
    activeStudentOrderId,
    setActiveStudentOrderId,
    studentOrderHistory,
    updateOrderStatus
  } = useStore();
  const navigate = useNavigate();

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const activeOrder = orders.find((o) => o.orderId === activeStudentOrderId) || currentActiveStudentOrder;

  if (!activeOrder) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIconWrap}>
            <Clock size={44} color="var(--accent-primary)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '1rem' }}>
            No Active Orders to Track
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
            When you place an order, its live kitchen status, countdown, and pickup QR token will appear here.
          </p>
          <button onClick={() => navigate('/')} style={styles.orderBtn}>
            <Utensils size={16} />
            <span>Order from Campus Menu</span>
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: activeOrder.paymentMethod === 'Cash' && activeOrder.paymentStatus !== 'Paid'
        ? 'Awaiting Cash at Counter'
        : 'Order Confirmed',
      sub: activeOrder.paymentMethod === 'Cash' && activeOrder.paymentStatus !== 'Paid'
        ? 'Please show token to Cashier'
        : 'Paid via Razorpay / Verified',
      statusKey: 'Pending',
      icon: ShoppingBag
    },
    {
      title: 'Kitchen Preparing',
      sub: 'Chefs are cooking your meal fresh',
      statusKey: 'Preparing',
      icon: ChefHat
    },
    {
      title: 'Ready for Pickup',
      sub: 'Show QR/Token at Serving Counter',
      statusKey: 'Ready',
      icon: Sparkles
    },
    {
      title: 'Order Collected',
      sub: 'Meal handed over. Enjoy!',
      statusKey: 'Collected',
      icon: CheckCircle2
    }
  ];

  // Helper to determine step index
  const statusHierarchy = ['Pending', 'Preparing', 'Ready', 'Collected'];
  const currentStepIdx = statusHierarchy.indexOf(activeOrder.status);

  return (
    <div style={styles.container}>
      {/* Header with Order Selector */}
      <div style={styles.header}>
        <div>
          <div style={styles.orderNumberLabel}>Tracking Active Order</div>
          <h1 style={styles.orderTitle}>
            Token <span style={{ color: 'var(--accent-primary)' }}>{activeOrder.tokenNumber}</span> ({activeOrder.orderId})
          </h1>
        </div>

        {/* Switch order dropdown if multiple orders exist */}
        {orders.length > 1 && (
          <div style={styles.selectorWrapper}>
            <label style={styles.selectorLabel}>Switch Order:</label>
            <select
              value={activeOrder.orderId}
              onChange={(e) => setActiveStudentOrderId(e.target.value)}
              style={styles.orderSelect}
            >
              {orders.slice(0, 10).map((o) => (
                <option key={o.orderId} value={o.orderId}>
                  {o.tokenNumber} - {o.status} (₹{o.totalAmount})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={styles.layout}>
        {/* Left Column: Live Progress Stepper */}
        <div style={styles.leftCol}>
          {/* Stepper Card */}
          <div style={styles.card}>
            <div style={styles.liveStatusHeader}>
              <div style={styles.pulsingDot} />
              <div style={styles.liveStatusText}>
                Status:{' '}
                <span
                  style={{
                    color:
                      activeOrder.status === 'Ready'
                        ? '#10b981'
                        : activeOrder.status === 'Preparing'
                        ? 'var(--accent-secondary)'
                        : activeOrder.status === 'Collected'
                        ? '#3b82f6'
                        : '#f59e0b',
                    fontWeight: '800'
                  }}
                >
                  {activeOrder.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stepper Visuals */}
            <div style={styles.stepperContainer}>
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isPassed = currentStepIdx > idx;
                const isCurrent = currentStepIdx === idx;
                const isUpcoming = currentStepIdx < idx;

                return (
                  <div key={st.statusKey} style={styles.stepRow}>
                    <div style={styles.stepIndicatorCol}>
                      <div
                        style={{
                          ...styles.stepCircle,
                          backgroundColor: isPassed
                            ? '#10b981'
                            : isCurrent
                            ? 'var(--accent-primary)'
                            : 'var(--bg-secondary)',
                          borderColor: isPassed
                            ? '#10b981'
                            : isCurrent
                            ? 'var(--accent-primary)'
                            : 'var(--border-color)',
                          color: isPassed || isCurrent ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        {isPassed ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          style={{
                            ...styles.stepLine,
                            backgroundColor: isPassed ? '#10b981' : 'var(--border-color)'
                          }}
                        />
                      )}
                    </div>

                    <div style={styles.stepContent}>
                      <div
                        style={{
                          ...styles.stepTitle,
                          color: isCurrent
                            ? 'var(--text-primary)'
                            : isPassed
                            ? 'var(--text-secondary)'
                            : 'var(--text-muted)',
                          fontWeight: isCurrent ? '700' : '600'
                        }}
                      >
                        {st.title}
                        {isCurrent && <span style={styles.inProgressBadge}>In Progress</span>}
                      </div>
                      <div style={styles.stepSub}>{st.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If collected, show review CTA */}
            {activeOrder.status === 'Collected' && (
              <div style={styles.reviewCta}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>
                    Order Completed! How was your food?
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Leave feedback to earn 15 bonus loyalty points.
                  </div>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  style={styles.reviewBtn}
                >
                  <Star size={16} />
                  <span>Rate Food & Service</span>
                </button>
              </div>
            )}
          </div>

          {/* Ordered Items Breakdown */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Items in this Order ({activeOrder.items?.length || 0})</h3>
            <div style={styles.itemsList}>
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} style={styles.itemRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                    <div>
                      <div style={styles.itemName}>
                        {item.quantity}x {item.name}
                      </div>
                      {item.customization?.addOns && (
                        <div style={styles.addonText}>
                          {item.customization.addOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={styles.itemPrice}>₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div style={styles.summaryBar}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Payment:</span>
                <span style={{ fontWeight: '600' }}>
                  {activeOrder.paymentMethod} ({activeOrder.paymentStatus})
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Total Paid:</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                  ₹{activeOrder.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Token & SVG QR Code */}
        <div style={styles.rightCol}>
          {/* Pickup Token Card */}
          <div style={styles.tokenCard}>
            <div style={styles.tokenCardHeader}>
              <QrCode size={20} color="var(--accent-primary)" />
              <span style={styles.tokenCardTitle}>Pickup Verification Pass</span>
            </div>

            <div style={styles.bigTokenBox}>
              <div style={styles.bigTokenLabel}>YOUR PICKUP TOKEN</div>
              <div style={styles.bigTokenNumber}>{activeOrder.tokenNumber}</div>
            </div>

            {/* Generated High-Contrast QR Code */}
            <div style={styles.qrCodeBox}>
              <svg
                width="160"
                height="160"
                viewBox="0 0 100 100"
                style={styles.qrSvg}
              >
                {/* Simulated High-Contrast QR Pattern */}
                <rect width="100" height="100" fill="#ffffff" rx="8" />
                {/* Corner Finder 1 */}
                <rect x="10" y="10" width="24" height="24" fill="#000" rx="3" />
                <rect x="14" y="14" width="16" height="16" fill="#fff" rx="2" />
                <rect x="18" y="18" width="8" height="8" fill="#000" />
                {/* Corner Finder 2 */}
                <rect x="66" y="10" width="24" height="24" fill="#000" rx="3" />
                <rect x="70" y="14" width="16" height="16" fill="#fff" rx="2" />
                <rect x="74" y="18" width="8" height="8" fill="#000" />
                {/* Corner Finder 3 */}
                <rect x="10" y="66" width="24" height="24" fill="#000" rx="3" />
                <rect x="14" y="70" width="16" height="16" fill="#fff" rx="2" />
                <rect x="18" y="74" width="8" height="8" fill="#000" />
                {/* Random Pattern Dots */}
                <rect x="42" y="14" width="6" height="6" fill="#000" />
                <rect x="52" y="14" width="6" height="6" fill="#000" />
                <rect x="42" y="26" width="6" height="6" fill="#000" />
                <rect x="42" y="42" width="16" height="16" fill="#000" />
                <rect x="64" y="42" width="8" height="8" fill="#000" />
                <rect x="42" y="66" width="8" height="8" fill="#000" />
                <rect x="56" y="66" width="8" height="8" fill="#000" />
                <rect x="70" y="66" width="16" height="6" fill="#000" />
                <rect x="66" y="78" width="8" height="8" fill="#000" />
                <rect x="80" y="78" width="6" height="6" fill="#000" />
              </svg>
              <div style={styles.qrHelperText}>
                Staff scans this QR at Serving Counter
              </div>
            </div>

            <div style={styles.pickupInstructions}>
              <div style={styles.instructionItem}>
                <span>1.</span>
                <span>Wait until token displays on the "Now Serving" board or turns Ready.</span>
              </div>
              <div style={styles.instructionItem}>
                <span>2.</span>
                <span>Present this token or QR pass to the Counter Handover staff.</span>
              </div>
              <div style={styles.instructionItem}>
                <span>3.</span>
                <span>Collect your fresh meal & verify your items!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          orderId={activeOrder.orderId}
          tokenNumber={activeOrder.tokenNumber}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
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
  orderNumberLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  orderTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  selectorWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  selectorLabel: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)'
  },
  orderSelect: {
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    fontSize: '0.85rem'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '1.5rem',
    alignItems: 'flex-start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)'
  },
  liveStatusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '1.5rem'
  },
  pulsingDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 10px #10b981',
    animation: 'pulse 1.8s infinite'
  },
  liveStatusText: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  stepperContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  stepRow: {
    display: 'flex',
    gap: '1.25rem'
  },
  stepIndicatorCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'all 0.3s ease'
  },
  stepLine: {
    width: '2px',
    flex: 1,
    minHeight: '36px',
    margin: '4px 0'
  },
  stepContent: {
    flex: 1,
    paddingBottom: '2rem'
  },
  stepTitle: {
    fontSize: '0.98rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  inProgressBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    color: 'var(--accent-primary)',
    fontSize: '0.68rem',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: '700'
  },
  stepSub: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '3px'
  },
  reviewCta: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  reviewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  cardTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '1rem'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.6rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  itemName: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  addonText: {
    fontSize: '0.72rem',
    color: 'var(--accent-secondary)'
  },
  itemPrice: {
    fontSize: '0.88rem',
    fontWeight: '700'
  },
  summaryBar: {
    marginTop: '1.25rem',
    paddingTop: '0.85rem',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem'
  },
  summaryLabel: {
    color: 'var(--text-muted)'
  },
  tokenCard: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '20px',
    padding: '1.75rem',
    border: '1px solid var(--border-color)',
    textAlign: 'center',
    boxShadow: 'var(--shadow-md)'
  },
  tokenCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  tokenCardTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  bigTokenBox: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px dashed var(--accent-primary)',
    marginBottom: '1.5rem'
  },
  bigTokenLabel: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  bigTokenNumber: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'var(--accent-primary)',
    letterSpacing: '1px',
    marginTop: '4px'
  },
  qrCodeBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  qrSvg: {
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
    padding: '8px',
    backgroundColor: '#fff'
  },
  qrHelperText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.75rem'
  },
  pickupInstructions: {
    textAlign: 'left',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '1rem',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    lineHeight: 1.4
  },
  instructionItem: {
    display: 'flex',
    gap: '0.5rem'
  },
  emptyContainer: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  emptyCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '3rem 2rem',
    textAlign: 'center',
    maxWidth: '440px'
  },
  emptyIconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  orderBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.9rem',
    marginTop: '1.5rem',
    cursor: 'pointer'
  }
};
