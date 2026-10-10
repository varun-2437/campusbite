import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import RazorpaySimulatorModal from '../../components/student/RazorpaySimulatorModal';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Utensils
} from 'lucide-react';

export default function CartCheckout() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    placeStudentOrder,
    studentUser
  } = useStore();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('Online'); // 'Online' or 'Cash'
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponCodeInput;
    if (!code.trim()) return;

    setCouponError('');
    setCouponSuccess('');
    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponCodeInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'Online') {
      setShowRazorpayModal(true);
    } else {
      // Cash payment at counter
      const created = placeStudentOrder({
        paymentMethod: 'Cash',
        specialInstructions
      });
      if (created) {
        navigate('/track');
      }
    }
  };

  const handleRazorpaySuccess = (paymentId) => {
    setShowRazorpayModal(false);
    const created = placeStudentOrder({
      paymentMethod: 'Online',
      specialInstructions,
      simulatedPaymentId: paymentId
    });
    if (created) {
      navigate('/track');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIconWrap}>
            <ShoppingBag size={48} color="var(--accent-primary)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '1rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Looks like you haven't selected anything yet. Browse our campus menu and add something delicious!
          </p>
          <button onClick={() => navigate('/')} style={styles.exploreBtn}>
            <Utensils size={16} />
            <span>Explore Campus Menu</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Review Cart & Checkout</h1>
        <button onClick={clearCart} style={styles.clearCartBtn}>
          <Trash2 size={14} />
          <span>Clear All</span>
        </button>
      </div>

      <div style={styles.layout}>
        {/* Left Column: Cart Items & Instructions */}
        <div style={styles.leftCol}>
          {/* Cart Items List */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Selected Food Items ({cart.length})</h3>
            <div style={styles.itemsList}>
              {cart.map((item) => {
                let unitPrice = item.price;
                if (item.customization?.addOns) {
                  unitPrice += item.customization.addOns.reduce((a, b) => a + (b.price || 0), 0);
                }
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div key={item.cartItemId} style={styles.itemRow}>
                    <img src={item.imageUrl} alt={item.name} style={styles.itemImg} />
                    <div style={styles.itemInfo}>
                      <div style={styles.itemNameRow}>
                        <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                        <span style={styles.itemName}>{item.name}</span>
                      </div>

                      {/* Add-on breakdown */}
                      {item.customization?.addOns && item.customization.addOns.length > 0 && (
                        <div style={styles.addonTagList}>
                          {item.customization.addOns.map((a) => (
                            <span key={a.id} style={styles.addonTag}>
                              +{a.name} ({a.price > 0 ? `₹${a.price}` : 'Free'})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Note */}
                      {item.customization?.instructions && (
                        <div style={styles.itemNote}>
                          Note: "{item.customization.instructions}"
                        </div>
                      )}

                      <div style={styles.itemPriceDetail}>
                        ₹{unitPrice} each
                      </div>
                    </div>

                    {/* Quantity Picker & Total */}
                    <div style={styles.itemActions}>
                      <div style={styles.qtyPicker}>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          style={styles.qtyBtn}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={styles.qtyText}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          style={styles.qtyBtn}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={styles.itemTotal}>₹{itemTotal}</div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={styles.removeBtn}
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Instructions / Kitchen Note */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Kitchen Cooking Notes (Optional)</h3>
            <textarea
              placeholder="Any general instructions for this order? (e.g., packing separate, extra cutlery, quick preparation if in a rush)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              style={styles.textarea}
              rows={2}
            />
          </div>
        </div>

        {/* Right Column: Coupons, Payment Method & Summary */}
        <div style={styles.rightCol}>
          {/* Coupons Card */}
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <Tag size={16} color="var(--accent-primary)" />
              <h3 style={styles.cardTitle}>Apply Promo Code</h3>
            </div>

            {appliedCoupon ? (
              <div style={styles.appliedCouponBox}>
                <div>
                  <div style={{ fontWeight: '700', color: '#10b981', fontSize: '0.9rem' }}>
                    Code Applied: {appliedCoupon.code}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {appliedCoupon.description} (-₹{cartDiscount})
                  </div>
                </div>
                <button onClick={removeCoupon} style={styles.removeCouponBtn}>
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={styles.couponInputRow}>
                  <input
                    type="text"
                    placeholder="Enter code (e.g. CAMPUS50)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    style={styles.couponInput}
                  />
                  <button onClick={() => handleApplyCoupon()} style={styles.applyBtn}>
                    Apply
                  </button>
                </div>

                {couponError && <p style={styles.couponErrorText}>{couponError}</p>}
                {couponSuccess && <p style={styles.couponSuccessText}>{couponSuccess}</p>}

                {/* Quick Coupon Suggestions */}
                <div style={styles.quickCoupons}>
                  <button
                    onClick={() => handleApplyCoupon('CAMPUS50')}
                    style={styles.quickCouponPill}
                  >
                    🏷️ CAMPUS50 (₹50 off)
                  </button>
                  <button
                    onClick={() => handleApplyCoupon('CAMPUS20')}
                    style={styles.quickCouponPill}
                  >
                    🏷️ CAMPUS20 (20% off)
                  </button>
                  <button
                    onClick={() => handleApplyCoupon('STUDENT10')}
                    style={styles.quickCouponPill}
                  >
                    🏷️ STUDENT10 (10% off)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Choose Payment Method</h3>
            <div style={styles.paymentMethods}>
              <div
                onClick={() => setPaymentMethod('Online')}
                style={{
                  ...styles.paymentOption,
                  borderColor: paymentMethod === 'Online' ? 'var(--accent-primary)' : 'var(--border-color)',
                  backgroundColor: paymentMethod === 'Online' ? 'rgba(249, 115, 22, 0.08)' : 'transparent'
                }}
              >
                <div style={styles.paymentRadio}>
                  {paymentMethod === 'Online' && <div style={styles.radioInner} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.paymentOptionTitle}>
                    <CreditCard size={15} color="var(--accent-primary)" />
                    <span>Pay Online (Razorpay)</span>
                  </div>
                  <div style={styles.paymentOptionDesc}>
                    UPI (GPay, PhonePe), Cards or NetBanking. Preparation starts right away!
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('Cash')}
                style={{
                  ...styles.paymentOption,
                  borderColor: paymentMethod === 'Cash' ? 'var(--accent-primary)' : 'var(--border-color)',
                  backgroundColor: paymentMethod === 'Cash' ? 'rgba(249, 115, 22, 0.08)' : 'transparent'
                }}
              >
                <div style={styles.paymentRadio}>
                  {paymentMethod === 'Cash' && <div style={styles.radioInner} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.paymentOptionTitle}>
                    <Banknote size={15} color="var(--accent-success)" />
                    <span>Pay Cash at Counter</span>
                  </div>
                  <div style={styles.paymentOptionDesc}>
                    Instant QR token generated. Pay cash at the cashier to start cooking.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Bill Details</h3>
            <div style={styles.billRow}>
              <span style={styles.billLabel}>Items Subtotal</span>
              <span style={styles.billValue}>₹{cartSubtotal}</span>
            </div>

            {cartDiscount > 0 && (
              <div style={styles.billRow}>
                <span style={{ ...styles.billLabel, color: '#10b981' }}>
                  Coupon Discount ({appliedCoupon?.code})
                </span>
                <span style={{ ...styles.billValue, color: '#10b981' }}>
                  -₹{cartDiscount}
                </span>
              </div>
            )}

            <div style={styles.billRow}>
              <span style={styles.billLabel}>Campus Canteen Handling Fee</span>
              <span style={{ ...styles.billValue, color: '#10b981' }}>FREE (₹0)</span>
            </div>

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <div>
                <div style={styles.totalLabel}>Total Payable</div>
                <div style={styles.pointsEarnNote}>
                  +{Math.floor(cartTotal / 10)} rewards points with this order
                </div>
              </div>
              <div style={styles.totalAmount}>₹{cartTotal}</div>
            </div>

            <button onClick={handleCheckoutClick} style={styles.checkoutBtn}>
              <span>
                {paymentMethod === 'Online'
                  ? `Pay ₹${cartTotal} via Razorpay`
                  : 'Place Order & Get Cash Token'}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Razorpay Simulator Modal */}
      {showRazorpayModal && (
        <RazorpaySimulatorModal
          amount={cartTotal}
          onSuccess={handleRazorpaySuccess}
          onFailure={(err) => {
            setShowRazorpayModal(false);
            alert(err);
          }}
          onClose={() => setShowRazorpayModal(false)}
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
    marginBottom: '1.5rem'
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  clearCartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'transparent',
    color: '#ef4444',
    fontSize: '0.82rem',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    cursor: 'pointer'
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
    padding: '1.25rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)'
  },
  cardTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.85rem'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)'
  },
  itemImg: {
    width: '68px',
    height: '68px',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  itemInfo: {
    flex: 1
  },
  itemNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '4px'
  },
  itemName: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  addonTagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    marginTop: '2px'
  },
  addonTag: {
    fontSize: '0.7rem',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    color: 'var(--accent-secondary)',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  itemNote: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '2px'
  },
  itemPriceDetail: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  qtyPicker: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '2px'
  },
  qtyBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  qtyText: {
    padding: '0 0.5rem',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  itemTotal: {
    fontSize: '0.98rem',
    fontWeight: '700',
    minWidth: '55px',
    textAlign: 'right'
  },
  removeBtn: {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    resize: 'vertical'
  },
  appliedCouponBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '10px',
    padding: '0.75rem 1rem'
  },
  removeCouponBtn: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  couponInputRow: {
    display: 'flex',
    gap: '0.5rem'
  },
  couponInput: {
    flex: 1,
    padding: '0.65rem 0.85rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    textTransform: 'uppercase'
  },
  applyBtn: {
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  couponErrorText: {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: '6px'
  },
  couponSuccessText: {
    fontSize: '0.75rem',
    color: '#10b981',
    marginTop: '6px'
  },
  quickCoupons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginTop: '0.75rem'
  },
  quickCouponPill: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px dashed var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.72rem',
    padding: '4px 8px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.85rem',
    borderRadius: '12px',
    border: '1px solid',
    cursor: 'pointer',
    userSelect: 'none'
  },
  paymentRadio: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2px'
  },
  radioInner: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)'
  },
  paymentOptionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '700',
    fontSize: '0.88rem',
    color: 'var(--text-primary)'
  },
  paymentOptionDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
    lineHeight: 1.3
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    marginBottom: '0.6rem'
  },
  billLabel: {
    color: 'var(--text-secondary)'
  },
  billValue: {
    color: 'var(--text-primary)',
    fontWeight: '600'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '0.75rem 0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  totalLabel: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  pointsEarnNote: {
    fontSize: '0.72rem',
    color: 'var(--accent-primary)',
    fontWeight: '600'
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: 'var(--accent-primary)'
  },
  checkoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.85rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)'
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
  exploreBtn: {
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
