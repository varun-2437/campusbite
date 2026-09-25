import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import {
  PlusCircle,
  Search,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Receipt,
  Trash2,
  DollarSign,
  TrendingUp,
  Download
} from 'lucide-react';

export default function CashierDashboard() {
  const {
    menu,
    orders,
    addWalkInOrder,
    verifyCashPayment,
    processRefund
  } = useStore();

  const [activeTab, setActiveTab] = useState('walkin'); // 'walkin' | 'verify' | 'refund' | 'transactions'

  // Walk-in order state
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [priority, setPriority] = useState('Normal');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(null);

  // Verification state
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(null);

  // Refund state
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundStatus, setRefundStatus] = useState(null);

  // Cart helper functions
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === item.itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const updateCartQty = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.itemId === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = addWalkInOrder({
      customerName: customerName.trim() || 'Walk-in Student',
      items: cart,
      totalAmount: cartTotal,
      paymentMethod,
      priority,
      specialInstructions,
      category: cart.some((i) => i.category === 'Food') ? 'Food' : 'Beverage'
    });

    setOrderSuccessMsg(`Order Created! Token: ${newOrder.tokenNumber} (Total: ${formatCurrency(cartTotal)})`);
    setCart([]);
    setCustomerName('');
    setSpecialInstructions('');
    setTimeout(() => setOrderSuccessMsg(null), 5000);
  };

  const handleVerifyPayment = (e) => {
    e.preventDefault();
    if (!verifyTokenInput.trim()) return;

    const success = verifyCashPayment(verifyTokenInput);
    if (success) {
      setVerifyStatus({ type: 'success', msg: `Cash payment verified for ${verifyTokenInput.toUpperCase()}!` });
      setVerifyTokenInput('');
    } else {
      setVerifyStatus({ type: 'error', msg: `Order/Token ${verifyTokenInput} not found or already verified.` });
    }
    setTimeout(() => setVerifyStatus(null), 4000);
  };

  const handleRefund = (e) => {
    e.preventDefault();
    if (!refundOrderId.trim()) return;

    const success = processRefund(refundOrderId.trim().toUpperCase(), refundReason);
    if (success) {
      setRefundStatus({ type: 'success', msg: `Refund processed successfully for ${refundOrderId.toUpperCase()}!` });
      setRefundOrderId('');
      setRefundReason('');
    } else {
      setRefundStatus({ type: 'error', msg: `Order ID ${refundOrderId} not found.` });
    }
    setTimeout(() => setRefundStatus(null), 4000);
  };

  // Transactions calculations
  const todayOrders = orders;
  const cashTotal = todayOrders
    .filter((o) => o.paymentMethod === 'Cash' && o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const onlineTotal = todayOrders
    .filter((o) => o.paymentMethod === 'Online' && o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Cashier POS & Counters</h1>
          <p style={styles.pageSubtitle}>Walk-in orders, cash payment validation, and refunds</p>
        </div>
        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('walkin')}
            style={{ ...styles.tabBtn, ...(activeTab === 'walkin' ? styles.tabBtnActive : {}) }}
          >
            Create Walk-in Order
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            style={{ ...styles.tabBtn, ...(activeTab === 'verify' ? styles.tabBtnActive : {}) }}
          >
            Verify Cash Payment
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            style={{ ...styles.tabBtn, ...(activeTab === 'refund' ? styles.tabBtnActive : {}) }}
          >
            Process Refund
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={{ ...styles.tabBtn, ...(activeTab === 'transactions' ? styles.tabBtnActive : {}) }}
          >
            Daily Transactions
          </button>
        </div>
      </div>

      {/* TAB 1: WALK-IN ORDER CREATION */}
      {activeTab === 'walkin' && (
        <div style={styles.walkinLayout}>
          {/* Menu Items Grid */}
          <div style={styles.menuColumn}>
            <h3 style={styles.sectionHeading}>Menu Catalog (Tap to add)</h3>
            <div style={styles.grid}>
              {menu.map((item) => (
                <div
                  key={item.itemId}
                  onClick={() => item.isAvailable && addToCart(item)}
                  style={{
                    ...styles.menuCard,
                    opacity: item.isAvailable ? 1 : 0.5,
                    cursor: item.isAvailable ? 'pointer' : 'not-allowed'
                  }}
                >
                  <div style={styles.cardHeader}>
                    <span style={item.isVeg ? styles.vegBadge : styles.nonVegBadge}>
                      {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                    </span>
                    <span style={styles.categoryBadge}>{item.category}</span>
                  </div>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>{formatCurrency(item.price)}</span>
                    <button disabled={!item.isAvailable} style={styles.addBtn}>
                      <PlusCircle size={16} />
                      <span>{item.isAvailable ? 'Add' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Billing Summary */}
          <div style={styles.cartColumn}>
            <div style={styles.cartCard}>
              <h3 style={styles.cartTitle}>Current Walk-in Order</h3>
              {orderSuccessMsg && <div style={styles.alertSuccess}>{orderSuccessMsg}</div>}

              {cart.length === 0 ? (
                <div style={styles.emptyCart}>
                  <Receipt size={40} color="var(--text-muted)" />
                  <p>Cart is empty. Select items from the menu.</p>
                </div>
              ) : (
                <div style={styles.cartItemsList}>
                  {cart.map((item) => (
                    <div key={item.itemId} style={styles.cartRow}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.cartItemName}>{item.name}</div>
                        <div style={styles.cartItemPrice}>{formatCurrency(item.price)} each</div>
                      </div>
                      <div style={styles.qtyControl}>
                        <button onClick={() => updateCartQty(item.itemId, -1)} style={styles.qtyBtn}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.itemId, 1)} style={styles.qtyBtn}>+</button>
                      </div>
                      <span style={styles.rowTotal}>{formatCurrency(item.price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(item.itemId)} style={styles.trashBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleCreateOrder} style={styles.checkoutForm}>
                <div style={styles.formGroup}>
                  <label>Customer Name / Student ID</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul / Cash Customer"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={{ flex: 1 }}>
                    <label>Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={styles.select}
                    >
                      <option value="Cash">Cash (Collect at Counter)</option>
                      <option value="Online">Online (Paid via QR)</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      style={styles.select}
                    >
                      <option value="Normal">Normal</option>
                      <option value="VIP">VIP</option>
                      <option value="Quick">Quick Snack</option>
                      <option value="Bulk">Bulk Order</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label>Special Instructions</label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, extra sauce"
                    style={styles.input}
                  />
                </div>

                <div style={styles.totalRow}>
                  <span>Total Payable:</span>
                  <span style={styles.totalAmount}>{formatCurrency(cartTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={cart.length === 0}
                  style={{
                    ...styles.checkoutBtn,
                    opacity: cart.length === 0 ? 0.5 : 1,
                    cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Generate Token & Submit Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFY CASH PAYMENT */}
      {activeTab === 'verify' && (
        <div style={styles.tabContentCard}>
          <h3 style={styles.sectionHeading}>Verify Cash Payment at Counter</h3>
          <p style={styles.tabDesc}>
            Enter the Token ID or Order ID generated by the student or staff to confirm cash collection.
          </p>

          <form onSubmit={handleVerifyPayment} style={styles.singleForm}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={verifyTokenInput}
                onChange={(e) => setVerifyTokenInput(e.target.value)}
                placeholder="Scan QR or enter Token ID (e.g. TK-102)"
                style={{ ...styles.input, flex: 1 }}
              />
              <button type="submit" style={styles.primaryActionBtn}>
                <CheckCircle size={18} />
                <span>Confirm Cash Received</span>
              </button>
            </div>
          </form>

          {verifyStatus && (
            <div
              style={
                verifyStatus.type === 'success'
                  ? styles.alertSuccess
                  : styles.alertError
              }
            >
              {verifyStatus.msg}
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h4 style={styles.subHeading}>Unpaid Cash Orders Waiting for Verification</h4>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Token #</th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Items</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((o) => o.paymentMethod === 'Cash' && o.paymentStatus === 'Pending')
                    .map((o) => (
                      <tr key={o.orderId}>
                        <td><strong>{o.tokenNumber}</strong></td>
                        <td>{o.orderId}</td>
                        <td>{o.customerName}</td>
                        <td style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                          {formatCurrency(o.totalAmount)}
                        </td>
                        <td>{o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}</td>
                        <td>
                          <button
                            onClick={() => verifyCashPayment(o.tokenNumber)}
                            style={styles.smallConfirmBtn}
                          >
                            Mark Paid
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REFUNDS */}
      {activeTab === 'refund' && (
        <div style={styles.tabContentCard}>
          <h3 style={styles.sectionHeading}>Process Customer Refund</h3>
          <p style={styles.tabDesc}>
            Cancel an order and mark payment as refunded with an official reason log.
          </p>

          <form onSubmit={handleRefund} style={styles.refundForm}>
            <div style={styles.formGroup}>
              <label>Order ID (e.g. ORD-101)</label>
              <input
                type="text"
                value={refundOrderId}
                onChange={(e) => setRefundOrderId(e.target.value)}
                placeholder="Enter Order ID"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Reason for Refund</label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Item unavailable / Order delayed / Customer left"
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.dangerBtn}>
              <RotateCcw size={18} />
              <span>Confirm & Process Refund</span>
            </button>
          </form>

          {refundStatus && (
            <div
              style={
                refundStatus.type === 'success'
                  ? styles.alertSuccess
                  : styles.alertError
              }
            >
              {refundStatus.msg}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TRANSACTIONS TABLE */}
      {activeTab === 'transactions' && (
        <div>
          <div style={styles.metricRow}>
            <div style={styles.metricCard}>
              <div style={styles.metricTitle}>Cash Collected Today</div>
              <div style={styles.metricValue}>{formatCurrency(cashTotal)}</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricTitle}>Online Revenue Today</div>
              <div style={styles.metricValue}>{formatCurrency(onlineTotal)}</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricTitle}>Total Today's Receipts</div>
              <div style={styles.metricValue}>{formatCurrency(cashTotal + onlineTotal)}</div>
            </div>
          </div>

          <div style={styles.tabContentCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={styles.sectionHeading}>Today's Transaction Log</h3>
              <button
                onClick={() => alert('Exporting CSV summary for today...')}
                style={styles.secondaryBtn}
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Order ID</th>
                    <th>Token #</th>
                    <th>Customer</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.orderId}>
                      <td>{formatTime(o.createdAt)}</td>
                      <td>{o.orderId}</td>
                      <td><strong>{o.tokenNumber}</strong></td>
                      <td>{o.customerName}</td>
                      <td>{o.paymentMethod}</td>
                      <td style={{ fontWeight: '600' }}>{formatCurrency(o.totalAmount)}</td>
                      <td>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor:
                              o.paymentStatus === 'Paid'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : o.paymentStatus === 'Refunded'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)',
                            color:
                              o.paymentStatus === 'Paid'
                                ? '#10b981'
                                : o.paymentStatus === 'Refunded'
                                ? '#ef4444'
                                : '#f59e0b'
                          }}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
  tabBar: {
    display: 'flex',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '10px',
    padding: '4px',
    border: '1px solid var(--border-color)',
    gap: '4px'
  },
  tabBtn: {
    padding: '0.55rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.15s ease'
  },
  tabBtnActive: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    fontWeight: '600'
  },
  walkinLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '1.5rem'
  },
  menuColumn: {
    flex: 1
  },
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'var(--text-primary)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1rem'
  },
  menuCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '130px',
    transition: 'transform 0.15s ease, border-color 0.15s ease'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  vegBadge: {
    fontSize: '0.7rem',
    color: '#10b981',
    fontWeight: '700'
  },
  nonVegBadge: {
    fontSize: '0.7rem',
    color: '#ef4444',
    fontWeight: '700'
  },
  categoryBadge: {
    fontSize: '0.7rem',
    backgroundColor: 'var(--bg-hover)',
    padding: '2px 6px',
    borderRadius: '4px',
    color: 'var(--text-secondary)'
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  price: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--accent-primary)'
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  cartColumn: {
    position: 'sticky',
    top: '1.5rem',
    height: 'fit-content'
  },
  cartCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.25rem'
  },
  cartTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'var(--text-primary)'
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    textAlign: 'center',
    gap: '0.75rem',
    color: 'var(--text-muted)',
    fontSize: '0.85rem'
  },
  cartItemsList: {
    maxHeight: '260px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
    paddingRight: '4px'
  },
  cartRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-primary)',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px'
  },
  cartItemName: {
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  cartItemPrice: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  qtyBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: 'var(--bg-hover)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowTotal: {
    fontSize: '0.85rem',
    fontWeight: '700',
    minWidth: '55px',
    textAlign: 'right'
  },
  trashBtn: {
    background: 'transparent',
    color: '#ef4444',
    padding: '4px'
  },
  checkoutForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  formRow: {
    display: 'flex',
    gap: '0.75rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  input: {
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none'
  },
  select: {
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    fontSize: '1rem',
    fontWeight: '600'
  },
  totalAmount: {
    fontSize: '1.25rem',
    color: 'var(--accent-primary)',
    fontWeight: '700'
  },
  checkoutBtn: {
    padding: '0.85rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.9rem'
  },
  alertSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.85rem',
    marginBottom: '1rem'
  },
  alertError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.85rem',
    marginTop: '1rem'
  },
  tabContentCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.75rem'
  },
  tabDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem'
  },
  singleForm: {
    maxWidth: '650px'
  },
  refundForm: {
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  primaryActionBtn: {
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
  dangerBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  subHeading: {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.75rem'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem'
  },
  smallConfirmBtn: {
    backgroundColor: 'var(--accent-success)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  metricRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  metricCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem'
  },
  metricTitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem'
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600'
  }
};
