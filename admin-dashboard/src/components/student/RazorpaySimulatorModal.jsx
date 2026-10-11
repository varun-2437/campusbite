import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, CreditCard, Smartphone, Building, Loader2, QrCode } from 'lucide-react';
import QRCodeView from '../common/QRCodeView';

export default function RazorpaySimulatorModal({ amount, onSuccess, onFailure, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSimulatePayment = (success = true) => {
    setProcessing(true);
    setStatusMessage('Connecting to Razorpay Sandbox gateway...');

    setTimeout(() => {
      setStatusMessage('Authorizing transaction with issuing bank...');
    }, 700);

    setTimeout(() => {
      setProcessing(false);
      if (success) {
        const paymentId = `pay_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;
        onSuccess(paymentId);
      } else {
        onFailure('Payment declined or cancelled by customer.');
      }
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={!processing ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[460px] bg-surface border border-line rounded-xl shadow-pop overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-surface-2/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-accent text-accent-fg font-bold text-[14px] flex items-center justify-center">
              R
            </div>
            <div>
              <div className="text-[14px] font-semibold text-fg">
                Razorpay Checkout
              </div>
              <div className="text-[11px] text-fg-muted">
                CampusBite Sandbox Environment
              </div>
            </div>
          </div>
          {!processing && (
            <button
              onClick={onClose}
              className="btn-ghost w-8 h-8 p-0 rounded"
              aria-label="Close"
            >
              <X size={16} strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Amount Ribbon */}
        <div className="px-5 py-3.5 bg-surface border-b border-line flex items-center justify-between">
          <div>
            <div className="text-[11.5px] text-fg-muted uppercase tracking-wider">
              Total Amount
            </div>
            <div className="text-[20px] font-semibold text-fg tabular-nums">
              ₹{amount.toFixed(2)}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-success font-medium bg-success/10 border border-success/25 px-2.5 py-1 rounded">
            <ShieldCheck size={14} strokeWidth={1.75} />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        {/* Content */}
        {processing ? (
          <div className="py-12 px-6 text-center space-y-3">
            <Loader2 size={32} strokeWidth={1.75} className="animate-spin text-accent mx-auto" />
            <h3 className="text-[15px] font-semibold text-fg">
              Processing Payment
            </h3>
            <p className="text-[12.5px] text-fg-muted">
              {statusMessage}
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Payment Method Selector Tabs */}
            <div className="flex border-b border-line" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={selectedMethod === 'upi'}
                onClick={() => setSelectedMethod('upi')}
                className={`flex-1 pb-2.5 text-[12.5px] font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  selectedMethod === 'upi'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-fg-muted hover:text-fg'
                }`}
              >
                <Smartphone size={14} strokeWidth={1.75} />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedMethod === 'card'}
                onClick={() => setSelectedMethod('card')}
                className={`flex-1 pb-2.5 text-[12.5px] font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  selectedMethod === 'card'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-fg-muted hover:text-fg'
                }`}
              >
                <CreditCard size={14} strokeWidth={1.75} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={selectedMethod === 'netbanking'}
                onClick={() => setSelectedMethod('netbanking')}
                className={`flex-1 pb-2.5 text-[12.5px] font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  selectedMethod === 'netbanking'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-fg-muted hover:text-fg'
                }`}
              >
                <Building size={14} strokeWidth={1.75} />
                <span>NetBanking</span>
              </button>
            </div>

            {selectedMethod === 'upi' && (
              <div className="space-y-4">
                {/* Dynamic UPI Payment QR Code */}
                <div className="flex flex-col items-center p-3 rounded-xl bg-surface-2 border border-line">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted mb-2 flex items-center gap-1.5">
                    <QrCode size={13} className="text-accent" />
                    <span>Scan with Any UPI App to Pay ₹{amount}</span>
                  </span>

                  <QRCodeView
                    value={`upi://pay?pa=campusbite@okcanteen&pn=CampusBite%20Cafeteria&am=${amount}&cu=INR&tn=CampusBite%20Order`}
                    size={135}
                    caption="GPay • PhonePe • Paytm • BHIM"
                    showActions={false}
                  />

                  <div className="mt-2 text-center text-[11px] text-fg-muted">
                    Point your camera or UPI scanner at the QR code above
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-px bg-line flex-1" />
                  <span className="text-[11px] uppercase tracking-wider text-fg-muted font-medium">Or pay with UPI ID</span>
                  <div className="h-px bg-line flex-1" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => {
                        setSelectedUpiApp(app.toLowerCase());
                        setUpiId(`student@ok${app.toLowerCase().slice(0, 3)}`);
                      }}
                      className={`p-2 text-center rounded border text-[11.5px] font-medium transition-colors ${
                        selectedUpiApp === app.toLowerCase()
                          ? 'border-accent bg-accent-soft text-accent'
                          : 'border-line bg-surface hover:bg-surface-2 text-fg'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <div>
                  <label htmlFor="upi-vpa" className="label text-xs">
                    UPI ID / VPA
                  </label>
                  <input
                    id="upi-vpa"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input text-[12.5px] py-2"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="card-number" className="label">
                    Card Number
                  </label>
                  <input
                    id="card-number"
                    type="text"
                    value="4111 2222 3333 4444 (Test Visa)"
                    disabled
                    className="input text-[13px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="card-expiry" className="label">
                      Expiry
                    </label>
                    <input
                      id="card-expiry"
                      type="text"
                      value="12/28"
                      disabled
                      className="input text-[13px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvv" className="label">
                      CVV
                    </label>
                    <input
                      id="card-cvv"
                      type="password"
                      value="123"
                      disabled
                      className="input text-[13px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div>
                <label htmlFor="bank-select" className="label">
                  Select Bank
                </label>
                <select id="bank-select" className="input text-[13px]" defaultValue="sbi">
                  <option value="sbi">State Bank of India (SBI)</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                </select>
              </div>
            )}

            {/* Test Simulation Controls */}
            <div className="pt-2 border-t border-line space-y-2">
              <button
                type="button"
                onClick={() => handleSimulatePayment(true)}
                className="btn-primary w-full h-9 text-[13px]"
              >
                <CheckCircle2 size={16} strokeWidth={1.75} />
                <span>Simulate Payment Success (₹{amount.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulatePayment(false)}
                className="btn-ghost w-full h-8 text-[12.5px] text-danger hover:text-danger hover:bg-danger/10"
              >
                <AlertCircle size={14} strokeWidth={1.75} />
                <span>Simulate Payment Decline</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
