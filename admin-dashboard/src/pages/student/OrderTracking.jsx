import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import FeedbackModal from '../../components/student/FeedbackModal';
import QRCodeView from '../../components/common/QRCodeView';
import { PageHeader, StatusBadge, EmptyState } from '../../theme/ui';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  ShoppingBag,
  QrCode,
  ArrowRight,
  Star,
  UtensilsCrossed
} from 'lucide-react';

export default function OrderTracking() {
  const {
    orders,
    currentActiveStudentOrder,
    activeStudentOrderId,
    setActiveStudentOrderId
  } = useStore();
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const isStudent = !isGuest && user?.role === 'student';

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const activeOrder = orders.find((o) => o.orderId === activeStudentOrderId) || currentActiveStudentOrder;

  if (!activeOrder) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Clock}
          title="No Active Orders"
          description="You do not have any active orders in progress. Order from the campus menu to track live preparation."
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

  const steps = [
    {
      title: activeOrder.paymentMethod === 'Cash' && activeOrder.paymentStatus !== 'Paid'
        ? 'Awaiting Cash Verification'
        : 'Order Confirmed',
      sub: activeOrder.paymentMethod === 'Cash' && activeOrder.paymentStatus !== 'Paid'
        ? 'Please present token at Cashier'
        : 'Paid via Razorpay / Verified',
      statusKey: 'Pending',
      icon: ShoppingBag
    },
    {
      title: 'Kitchen Preparation',
      sub: 'Order queued and cooking in kitchen',
      statusKey: 'Preparing',
      icon: ChefHat
    },
    {
      title: 'Ready for Pickup',
      sub: 'Present token at Serving Counter',
      statusKey: 'Ready',
      icon: CheckCircle2
    },
    {
      title: 'Order Collected',
      sub: 'Handover complete',
      statusKey: 'Collected',
      icon: CheckCircle2
    }
  ];

  const statusHierarchy = ['Pending', 'Preparing', 'Ready', 'Collected'];
  const currentStepIdx = statusHierarchy.indexOf(activeOrder.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order Token: ${activeOrder.tokenNumber}`}
        subtitle={`Reference ID: ${activeOrder.orderId} • Placed on ${new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        actions={
          orders.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor="switch-order" className="text-[12px] text-fg-muted font-medium">
                Switch Order:
              </label>
              <select
                id="switch-order"
                value={activeOrder.orderId}
                onChange={(e) => setActiveStudentOrderId(e.target.value)}
                className="input h-8 text-[12.5px] py-0 px-2 w-auto"
              >
                {orders.slice(0, 10).map((o) => (
                  <option key={o.orderId} value={o.orderId}>
                    {o.tokenNumber} ({o.status}) - ₹{o.totalAmount}
                  </option>
                ))}
              </select>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Live Progress Stepper */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[13px] font-semibold text-fg">
                  Current Status:
                </span>
                <StatusBadge status={activeOrder.status} />
              </div>
              <span className="text-[12px] text-fg-muted">
                Method: {activeOrder.paymentMethod} ({activeOrder.paymentStatus})
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6 pl-1">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isPassed = currentStepIdx > idx;
                const isCurrent = currentStepIdx === idx;
                const isUpcoming = currentStepIdx < idx;

                return (
                  <div key={st.statusKey} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-150 ${
                          isPassed
                            ? 'border-success bg-success/15 text-success'
                            : isCurrent
                            ? 'border-accent bg-accent text-accent-fg'
                            : 'border-line bg-surface-2 text-fg-muted'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 size={16} strokeWidth={2} />
                        ) : (
                          <Icon size={15} strokeWidth={1.75} />
                        )}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 my-1 min-h-[32px] ${
                            isPassed ? 'bg-success' : 'bg-line'
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[13.5px] font-medium ${
                            isCurrent
                              ? 'text-fg font-semibold'
                              : isPassed
                              ? 'text-fg'
                              : 'text-fg-muted'
                          }`}
                        >
                          {st.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-accent-soft text-accent font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-fg-muted mt-0.5">
                        {st.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If collected, show review prompt */}
            {activeOrder.status === 'Collected' && (
              <div className="p-4 rounded-lg bg-surface-2 border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[13.5px] font-semibold text-fg">
                    Order Handover Completed
                  </div>
                  <div className="text-[12px] text-fg-muted mt-0.5">
                    {isStudent
                      ? 'Share your feedback to earn 15 bonus loyalty points.'
                      : 'Share your feedback to help the canteen improve food & service.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(true)}
                  className="btn-primary btn-sm shrink-0"
                >
                  <Star size={14} strokeWidth={1.75} />
                  <span>Rate Food & Service</span>
                </button>
              </div>
            )}
          </div>

          {/* Ordered items breakdown */}
          <div className="card space-y-3">
            <h2 className="text-[14px] font-semibold text-fg pb-2 border-b border-line">
              Items in this Order ({activeOrder.items?.length || 0})
            </h2>

            <div className="divide-y divide-line">
              {activeOrder.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.isVeg ? 'bg-success' : 'bg-danger'
                      }`}
                    />
                    <div>
                      <span className="font-medium text-fg">
                        {item.quantity}x {item.name}
                      </span>
                      {item.customization?.addOns && (
                        <div className="text-[11.5px] text-fg-muted">
                          {item.customization.addOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-fg tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-line flex justify-between items-center text-[13px]">
              <span className="text-fg-muted">Total Paid</span>
              <span className="text-[16px] font-semibold text-fg tabular-nums">
                ₹{activeOrder.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Token & SVG QR Pass */}
        <div className="space-y-4">
          <div className="card text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5 pb-2 border-b border-line text-[12px] font-semibold uppercase tracking-wider text-fg-muted">
              <QrCode size={15} strokeWidth={1.75} />
              <span>Counter Pickup Pass</span>
            </div>

            <div className="p-4 rounded-lg bg-surface-2 border border-line space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted block">
                Pickup Token
              </span>
              <span className="text-[32px] font-bold text-accent tracking-wide block tabular-nums leading-none py-1">
                {activeOrder.tokenNumber}
              </span>
              <span className="text-[12px] text-fg-muted block">
                Order ID: {activeOrder.orderId}
              </span>
            </div>

            {/* High-contrast Dynamic QR Pass */}
            <div className="py-2">
              <QRCodeView
                value={`CAMPUSBITE:${activeOrder.orderId}:${activeOrder.tokenNumber}`}
                tokenNumber={activeOrder.tokenNumber}
                size={148}
                caption="Staff scans QR at Serving Counter"
                status={activeOrder.status}
              />
            </div>

            <div className="text-left text-[12px] text-fg-muted bg-surface-2 p-3 rounded-md space-y-1.5 border border-line">
              <div className="flex gap-1.5">
                <span className="font-semibold text-fg">1.</span>
                <span>Wait until your token is called or displays Ready.</span>
              </div>
              <div className="flex gap-1.5">
                <span className="font-semibold text-fg">2.</span>
                <span>Show this QR code or token to Counter staff.</span>
              </div>
              <div className="flex gap-1.5">
                <span className="font-semibold text-fg">3.</span>
                <span>Collect order and verify items.</span>
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
