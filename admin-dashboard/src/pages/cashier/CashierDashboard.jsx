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
  Download,
  Camera
} from 'lucide-react';
import QrScannerModal from '../../components/common/QrScannerModal';

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
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Transactions filter state
  const [txnSearch, setTxnSearch] = useState('');
  const [txnMethodFilter, setTxnMethodFilter] = useState('ALL');

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Token #', 'Customer', 'Method', 'Amount', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.orderId,
      o.tokenNumber,
      `"${o.customerName}"`,
      o.paymentMethod,
      o.totalAmount,
      o.paymentStatus,
      `"${formatDate(o.createdAt)} ${formatTime(o.createdAt)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusBite_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6">
      {/* Header with High-Contrast Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Cashier POS & Counters</h1>
          <p className="text-sm text-fg-muted">Walk-in orders, cash payment validation, and refunds</p>
        </div>
        <div className="flex items-center gap-1.5 bg-surface border border-line rounded-xl p-1 shadow-sm flex-wrap">
          <button
            onClick={() => setActiveTab('walkin')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'walkin'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            Create Walk-in Order
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'verify'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            Verify Cash Payment
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            Process Refund
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
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
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '110px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '0.6rem'
                      }}
                    />
                  )}
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
        <div className="card bg-surface border border-line rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-fg">Verify Cash Payment at Counter</h3>
          <p className="text-xs text-fg-muted mt-0.5 mb-4">
            Enter the Token ID or Order ID generated by the student or staff to confirm cash collection.
          </p>

          <form onSubmit={handleVerifyPayment} className="max-w-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={verifyTokenInput}
                onChange={(e) => setVerifyTokenInput(e.target.value)}
                placeholder="Scan QR or enter Token ID (e.g. TK-102)"
                className="flex-1 h-11 px-4 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg placeholder:text-fg-subtle shadow-sm"
              />
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="h-11 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg border border-line bg-surface hover:bg-surface-2 text-fg shadow-sm transition cursor-pointer shrink-0"
              >
                <Camera size={18} className="text-fg-muted" />
                <span>Open QR Scanner</span>
              </button>
              <button
                type="submit"
                className="h-11 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm transition cursor-pointer shrink-0"
              >
                <CheckCircle size={18} />
                <span>Confirm Cash Received</span>
              </button>
            </div>
          </form>

          <QrScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanSuccess={(scannedToken) => {
              setVerifyTokenInput(scannedToken);
              const success = verifyCashPayment(scannedToken);
              if (success) {
                setVerifyStatus({ type: 'success', msg: `Cash payment verified for ${scannedToken} via Scanner!` });
              } else {
                setVerifyStatus({ type: 'error', msg: `Token ${scannedToken} not found or already verified.` });
              }
              setTimeout(() => setVerifyStatus(null), 4000);
            }}
          />

          {verifyStatus && (
            <div
              className={`mt-4 p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 max-w-2xl ${
                verifyStatus.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {verifyStatus.msg}
            </div>
          )}

          <div className="mt-8">
            <h4 className="text-sm font-semibold text-fg mb-3">Unpaid Cash Orders Waiting for Verification</h4>
            <div className="card p-0 overflow-hidden border border-line rounded-xl shadow-sm bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-2 border-b border-line text-xs font-semibold text-fg-muted uppercase tracking-wider">
                      <th className="px-4 py-3">Token #</th>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {orders.filter((o) => o.paymentMethod === 'Cash' && o.paymentStatus === 'Pending').length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-xs text-fg-muted">
                          No pending unpaid cash orders at the moment.
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter((o) => o.paymentMethod === 'Cash' && o.paymentStatus === 'Pending')
                        .map((o) => (
                          <tr key={o.orderId} className="hover:bg-surface-2/60 transition">
                            <td className="px-4 py-3 font-bold text-fg">{o.tokenNumber}</td>
                            <td className="px-4 py-3 font-mono text-xs text-fg-muted">{o.orderId}</td>
                            <td className="px-4 py-3 font-medium text-fg">{o.customerName}</td>
                            <td className="px-4 py-3 font-bold text-teal-600">
                              {formatCurrency(o.totalAmount)}
                            </td>
                            <td className="px-4 py-3 text-xs text-fg-muted">
                              {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => verifyCashPayment(o.tokenNumber)}
                                className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REFUNDS */}
      {activeTab === 'refund' && (
        <div className="card bg-surface border border-line rounded-xl p-6 shadow-sm max-w-xl">
          <h3 className="text-base font-semibold text-fg">Process Customer Refund</h3>
          <p className="text-xs text-fg-muted mt-0.5 mb-4">
            Cancel an order and mark payment as refunded with an official reason log.
          </p>

          <form onSubmit={handleRefund} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-fg mb-1.5">Order ID (e.g. ORD-101)</label>
              <input
                type="text"
                value={refundOrderId}
                onChange={(e) => setRefundOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className="w-full h-10 px-3 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg placeholder:text-fg-subtle shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-fg mb-1.5">Reason for Refund</label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Item unavailable / Order delayed / Customer left"
                className="w-full h-10 px-3 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg placeholder:text-fg-subtle shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm transition cursor-pointer"
            >
              <RotateCcw size={18} />
              <span>Confirm & Process Refund</span>
            </button>
          </form>

          {refundStatus && (
            <div
              className={`mt-4 p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                refundStatus.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {refundStatus.msg}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TRANSACTIONS TABLE */}
      {activeTab === 'transactions' && (() => {
        const filteredTxns = orders.filter((o) => {
          const matchQuery =
            o.tokenNumber.toLowerCase().includes(txnSearch.toLowerCase()) ||
            o.orderId.toLowerCase().includes(txnSearch.toLowerCase()) ||
            o.customerName.toLowerCase().includes(txnSearch.toLowerCase());
          const matchMethod =
            txnMethodFilter === 'ALL' || o.paymentMethod === txnMethodFilter;
          return matchQuery && matchMethod;
        });

        return (
          <div className="space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card bg-surface border border-line rounded-xl p-5 shadow-sm">
                <div className="text-xs font-medium text-fg-muted">Cash Collected Today</div>
                <div className="text-2xl font-bold text-fg mt-1">{formatCurrency(cashTotal)}</div>
                <div className="text-[11px] text-fg-muted mt-0.5">Counter validated cash</div>
              </div>
              <div className="card bg-surface border border-line rounded-xl p-5 shadow-sm">
                <div className="text-xs font-medium text-fg-muted">Online Revenue Today</div>
                <div className="text-2xl font-bold text-teal-600 mt-1">{formatCurrency(onlineTotal)}</div>
                <div className="text-[11px] text-fg-muted mt-0.5">UPI, Cards & Razorpay</div>
              </div>
              <div className="card bg-surface border border-line rounded-xl p-5 shadow-sm">
                <div className="text-xs font-medium text-fg-muted">Total Today's Receipts</div>
                <div className="text-2xl font-bold text-fg mt-1">{formatCurrency(cashTotal + onlineTotal)}</div>
                <div className="text-[11px] text-fg-muted mt-0.5">{orders.length} total orders logged</div>
              </div>
            </div>

            {/* Transaction Log Table Card */}
            <div className="card p-0 overflow-hidden border border-line rounded-xl shadow-sm bg-surface">
              {/* Table Header Action Bar */}
              <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
                  <div className="relative w-full">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
                    <input
                      type="text"
                      value={txnSearch}
                      onChange={(e) => setTxnSearch(e.target.value)}
                      placeholder="Search Token, Order ID, or Customer..."
                      className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg placeholder:text-fg-subtle"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-line">
                    <button
                      onClick={() => setTxnMethodFilter('ALL')}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition cursor-pointer ${
                        txnMethodFilter === 'ALL'
                          ? 'bg-accent text-white font-semibold shadow-sm'
                          : 'text-fg-muted hover:text-fg'
                      }`}
                    >
                      All ({orders.length})
                    </button>
                    <button
                      onClick={() => setTxnMethodFilter('Cash')}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition cursor-pointer ${
                        txnMethodFilter === 'Cash'
                          ? 'bg-accent text-white font-semibold shadow-sm'
                          : 'text-fg-muted hover:text-fg'
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => setTxnMethodFilter('Online')}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition cursor-pointer ${
                        txnMethodFilter === 'Online'
                          ? 'bg-accent text-white font-semibold shadow-sm'
                          : 'text-fg-muted hover:text-fg'
                      }`}
                    >
                      Online
                    </button>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-line bg-surface hover:bg-surface-2 text-fg text-xs font-semibold transition cursor-pointer shadow-sm"
                  >
                    <Download size={14} className="text-fg-muted" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-2 border-b border-line text-xs font-semibold text-fg-muted uppercase tracking-wider">
                      <th className="px-5 py-3.5">Time</th>
                      <th className="px-4 py-3.5">Order ID</th>
                      <th className="px-4 py-3.5">Token #</th>
                      <th className="px-4 py-3.5">Customer</th>
                      <th className="px-4 py-3.5">Method</th>
                      <th className="px-4 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredTxns.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-xs text-fg-muted">
                          No transactions found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTxns.map((o) => (
                        <tr key={o.orderId} className="hover:bg-surface-2/60 transition">
                          <td className="px-5 py-3.5 text-xs text-fg-muted whitespace-nowrap">
                            {formatTime(o.createdAt)}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs text-fg-muted whitespace-nowrap">
                            {o.orderId}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-fg whitespace-nowrap">
                            {o.tokenNumber}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-fg">
                            {o.customerName}
                          </td>
                          <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-2 border border-line text-fg">
                              {o.paymentMethod}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-fg whitespace-nowrap">
                            {formatCurrency(o.totalAmount)}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {o.paymentStatus === 'Paid' ? (
                              <span className="badge-success text-xs font-semibold">
                                Paid
                              </span>
                            ) : o.paymentStatus === 'Refunded' ? (
                              <span className="badge-danger text-xs font-semibold">
                                Refunded
                              </span>
                            ) : (
                              <span className="badge-warning text-xs font-semibold">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
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
    maxWidth: '750px'
  },
  scannerOpenBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem'
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
