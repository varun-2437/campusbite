import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import RazorpaySimulatorModal from '../../components/student/RazorpaySimulatorModal';
import { PageHeader, EmptyState } from '../../theme/ui';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  CreditCard,
  Banknote,
  ArrowRight,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle
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
      <div className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="You haven't added any menu items yet. Explore the campus canteen catalog to begin."
          action={
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              <UtensilsCrossed size={16} strokeWidth={1.75} />
              <span>Browse Menu</span>
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cart & Checkout"
        subtitle="Review selected meals, apply promotional vouchers and confirm order."
        actions={
          <button
            type="button"
            onClick={clearCart}
            className="btn-secondary btn-sm text-danger hover:text-danger"
          >
            <Trash2 size={14} strokeWidth={1.75} />
            <span>Clear Cart</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Items & Notes) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="text-[14px] font-semibold text-fg pb-2 border-b border-line">
              Selected Food Items ({cart.length})
            </h2>

            <div className="divide-y divide-line">
              {cart.map((item) => {
                let unitPrice = item.price;
                if (item.customization?.addOns) {
                  unitPrice += item.customization.addOns.reduce((a, b) => a + (b.price || 0), 0);
                }
                const itemTotal = unitPrice * item.quantity;

                return (
                  <div key={item.cartItemId} className="py-3.5 flex items-start gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover bg-surface-2 border border-line shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            item.isVeg ? 'bg-success' : 'bg-danger'
                          }`}
                        />
                        <h3 className="text-[13.5px] font-semibold text-fg truncate">
                          {item.name}
                        </h3>
                      </div>

                      {item.customization?.addOns && item.customization.addOns.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.customization.addOns.map((a) => (
                            <span
                              key={a.id}
                              className="text-[11px] bg-surface-2 text-fg-muted px-1.5 py-0.5 rounded border border-line"
                            >
                              +{a.name} ({a.price > 0 ? `₹${a.price}` : 'Free'})
                            </span>
                          ))}
                        </div>
                      )}

                      {item.customization?.instructions && (
                        <p className="text-[12px] text-fg-muted italic mt-1">
                          Note: "{item.customization.instructions}"
                        </p>
                      )}

                      <div className="text-[12.5px] text-fg-muted mt-1 tabular-nums">
                        ₹{unitPrice} each
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-line-strong rounded-md overflow-hidden bg-surface">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-fg hover:bg-surface-2"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={1.75} />
                        </button>
                        <span className="w-8 text-center text-[12.5px] font-semibold text-fg tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-fg hover:bg-surface-2"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={1.75} />
                        </button>
                      </div>

                      <span className="text-[14px] font-semibold text-fg tabular-nums min-w-[55px] text-right">
                        ₹{itemTotal}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="btn-ghost w-7 h-7 p-0 text-fg-muted hover:text-danger"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={14} strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card space-y-2">
            <label htmlFor="kitchen-notes" className="label">
              General Kitchen Notes (Optional)
            </label>
            <textarea
              id="kitchen-notes"
              rows={2}
              placeholder="e.g. Packing separately, need disposable cutlery..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="input h-auto py-2 text-[14px] resize-y"
            />
          </div>
        </div>

        {/* Right Column (Vouchers, Payment, Summary) */}
        <div className="space-y-4">
          {/* Coupon Code Box */}
          <div className="card space-y-3">
            <h2 className="text-[14px] font-semibold text-fg pb-2 border-b border-line flex items-center gap-1.5">
              <Tag size={15} strokeWidth={1.75} className="text-accent" />
              <span>Promotional Voucher</span>
            </h2>

            {appliedCoupon ? (
              <div className="p-3 rounded-md bg-success/10 border border-success/30 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-success">
                    {appliedCoupon.code}
                  </div>
                  <div className="text-[12px] text-fg-muted">
                    {appliedCoupon.description} (-₹{cartDiscount})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[12px] font-medium text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (CAMPUS50)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="input uppercase text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="btn-secondary btn-sm h-9"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-[12px] text-danger flex items-center gap-1">
                    <AlertCircle size={12} strokeWidth={1.75} />
                    <span>{couponError}</span>
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-[12px] text-success flex items-center gap-1">
                    <CheckCircle2 size={12} strokeWidth={1.75} />
                    <span>{couponSuccess}</span>
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('CAMPUS50')}
                    className="text-[11.5px] px-2 py-1 rounded bg-surface-2 border border-line text-fg-muted hover:text-fg hover:border-line-strong transition-colors"
                  >
                    CAMPUS50 (₹50 off)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('CAMPUS20')}
                    className="text-[11.5px] px-2 py-1 rounded bg-surface-2 border border-line text-fg-muted hover:text-fg hover:border-line-strong transition-colors"
                  >
                    CAMPUS20 (20% off)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('STUDENT10')}
                    className="text-[11.5px] px-2 py-1 rounded bg-surface-2 border border-line text-fg-muted hover:text-fg hover:border-line-strong transition-colors"
                  >
                    STUDENT10 (10% off)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="card space-y-3">
            <h2 className="text-[14px] font-semibold text-fg pb-2 border-b border-line">
              Payment Method
            </h2>

            <div className="space-y-2">
              <div
                onClick={() => setPaymentMethod('Online')}
                className={`p-3 rounded-md border cursor-pointer select-none flex items-start gap-3 transition-colors duration-150 ${
                  paymentMethod === 'Online'
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-line bg-surface hover:bg-surface-2 text-fg'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'Online' ? 'border-accent' : 'border-line-strong'
                  }`}
                >
                  {paymentMethod === 'Online' && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium flex items-center gap-1.5">
                    <CreditCard size={15} strokeWidth={1.75} />
                    <span>Pay Online (Razorpay)</span>
                  </div>
                  <div className="text-[12px] text-fg-muted mt-0.5">
                    UPI, Cards or NetBanking. Cooking begins immediately.
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('Cash')}
                className={`p-3 rounded-md border cursor-pointer select-none flex items-start gap-3 transition-colors duration-150 ${
                  paymentMethod === 'Cash'
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-line bg-surface hover:bg-surface-2 text-fg'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'Cash' ? 'border-accent' : 'border-line-strong'
                  }`}
                >
                  {paymentMethod === 'Cash' && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium flex items-center gap-1.5">
                    <Banknote size={15} strokeWidth={1.75} />
                    <span>Pay Cash at Counter</span>
                  </div>
                  <div className="text-[12px] text-fg-muted mt-0.5">
                    Get digital token, pay cashier directly to start prep.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="card space-y-3">
            <h2 className="text-[14px] font-semibold text-fg pb-2 border-b border-line">
              Bill Summary
            </h2>

            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-fg-muted">Subtotal</span>
                <span className="font-medium text-fg tabular-nums">₹{cartSubtotal}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-medium tabular-nums">-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-[12px] text-fg-muted">
                <span>Campus Handling Fee</span>
                <span className="text-success font-medium">Free</span>
              </div>

              <div className="pt-2 border-t border-line flex items-baseline justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-fg">Total Payable</div>
                  <div className="text-[11px] text-fg-muted">
                    +{Math.floor(cartTotal / 10)} loyalty points on completion
                  </div>
                </div>
                <div className="text-[20px] font-semibold text-fg tabular-nums">
                  ₹{cartTotal}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckoutClick}
              className="btn-primary w-full h-10 mt-2 text-[14px]"
            >
              <span>
                {paymentMethod === 'Online'
                  ? `Pay ₹${cartTotal} via Razorpay`
                  : 'Place Cash Order & Get Token'}
              </span>
              <ArrowRight size={16} strokeWidth={1.75} />
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
