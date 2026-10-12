import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatTime } from '../../utils/formatters';
import {
  QrCode,
  CheckCircle,
  Clock,
  Tv,
  ExternalLink,
  Search,
  PackageCheck,
  Camera
} from 'lucide-react';
import QrScannerModal from '../../components/common/QrScannerModal';

export default function ServingCounter() {
  const { orders, updateOrderStatus } = useStore();
  const [tokenInput, setTokenInput] = useState('');
  const [handoverAlert, setHandoverAlert] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Ready orders waiting for customer pickup
  const readyOrders = orders.filter((o) => o.status === 'Ready');

  // Currently preparing orders
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');

  const handleHandover = (tokenOrOrderId) => {
    const raw = (tokenOrOrderId || '').trim().toUpperCase();
    const tokenMatch = raw.match(/TK-\d+/) || raw.match(/ORD-\d+/);
    const query = tokenMatch ? tokenMatch[0] : raw;

    const target = orders.find(
      (o) =>
        (o.tokenNumber.toUpperCase() === query ||
          o.orderId.toUpperCase() === query ||
          raw.includes(o.tokenNumber.toUpperCase()) ||
          raw.includes(o.orderId.toUpperCase())) &&
        o.status === 'Ready'
    );

    if (target) {
      updateOrderStatus(target.orderId, 'Collected');
      setHandoverAlert({
        type: 'success',
        msg: `Token ${target.tokenNumber} (${target.customerName}) handed over & marked Collected!`
      });
      setTokenInput('');
    } else {
      setHandoverAlert({
        type: 'error',
        msg: `Token ${tokenOrOrderId} not found or not yet in "Ready" status.`
      });
    }

    setTimeout(() => setHandoverAlert(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Food / Serving Counter</h1>
          <p className="text-sm text-fg-muted">
            Validate tokens, hand over prepared meals, and manage the pickup queue
          </p>
        </div>

        <Link
          to="/now-serving"
          target="_blank"
          className="inline-flex items-center gap-2 h-9 px-3.5 text-xs font-semibold rounded-lg border border-line bg-surface hover:bg-surface-2 text-accent shadow-sm transition"
        >
          <Tv size={16} />
          <span>Launch "Now Serving" TV Display</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* Handover Input Card */}
      <div className="card bg-surface border border-line rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-fg">Scan / Enter Token for Handover</h3>
        <p className="text-xs text-fg-muted mt-0.5 mb-4">
          Customer presents token QR or ticket number at pickup counter.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tokenInput) handleHandover(tokenInput);
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl"
        >
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Scan QR barcode or enter Token ID (e.g. TK-104)"
              className="w-full h-11 pl-10 pr-4 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-fg placeholder:text-fg-subtle transition shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="h-11 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg border border-line bg-surface hover:bg-surface-2 text-fg transition cursor-pointer shadow-sm shrink-0"
          >
            <Camera size={18} className="text-fg-muted" />
            <span>Scan QR</span>
          </button>
          <button
            type="submit"
            className="h-11 px-5 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm transition cursor-pointer shrink-0"
          >
            <PackageCheck size={18} />
            <span>Confirm Handover</span>
          </button>
        </form>

        <QrScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          title="Scan Handover Token QR"
          onScanSuccess={(scannedToken) => {
            setTokenInput(scannedToken);
            handleHandover(scannedToken);
          }}
        />

        {handoverAlert && (
          <div
            className={`mt-4 p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
              handoverAlert.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            {handoverAlert.msg}
          </div>
        )}
      </div>

      {/* Two-Column Queue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Ready for Pickup */}
        <div className="card p-5 bg-surface border border-line rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-600" />
              <h3 className="text-base font-semibold text-fg">Ready for Handover</h3>
            </div>
            <span className="badge-success text-xs font-semibold">
              {readyOrders.length} Ready
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {readyOrders.length === 0 ? (
              <div className="py-12 text-center text-fg-muted text-xs border border-dashed border-line rounded-lg">
                No orders currently waiting for pickup.
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="border border-line rounded-xl p-4 bg-surface hover:bg-surface-2/40 transition border-l-4 border-l-emerald-500 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-emerald-600 tracking-tight">
                      {order.tokenNumber}
                    </span>
                    <span className="text-xs font-medium text-fg-muted bg-surface-2 px-2.5 py-1 rounded-md border border-line">
                      {order.customerName}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {order.items.map((i, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-surface-2 border border-line text-fg"
                      >
                        {i.name} (x{i.quantity})
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-line/60">
                    <span className="text-xs text-fg-muted flex items-center gap-1">
                      <Clock size={12} />
                      Ready since {formatTime(order.createdAt)}
                    </span>
                    <button
                      onClick={() => handleHandover(order.tokenNumber)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-md shadow-sm transition cursor-pointer"
                    >
                      Hand Over
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Currently Preparing */}
        <div className="card p-5 bg-surface border border-line rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              <h3 className="text-base font-semibold text-fg">Currently in Kitchen</h3>
            </div>
            <span className="badge-warning text-xs font-semibold">
              {preparingOrders.length} In Progress
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {preparingOrders.length === 0 ? (
              <div className="py-12 text-center text-fg-muted text-xs border border-dashed border-line rounded-lg">
                No orders in preparation right now.
              </div>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="border border-line rounded-xl p-4 bg-surface hover:bg-surface-2/40 transition border-l-4 border-l-amber-500 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-amber-600 tracking-tight">
                      {order.tokenNumber}
                    </span>
                    <span className="text-xs font-medium text-fg-muted bg-surface-2 px-2.5 py-1 rounded-md border border-line">
                      {order.customerName}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {order.items.map((i, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-surface-2 border border-line text-fg"
                      >
                        {i.name} (x{i.quantity})
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-line/60">
                    <span className="text-xs text-fg-muted flex items-center gap-1">
                      <Clock size={12} />
                      Cooking started {formatTime(order.createdAt)}
                    </span>
                    <span className="badge-warning text-xs font-semibold">
                      Preparing
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
