import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { PageHeader, StatusBadge, EmptyState } from '../../theme/ui';
import QRCodeView from '../../components/common/QRCodeView';
import {
  Clock,
  RotateCcw,
  Calendar,
  UtensilsCrossed,
  ArrowRight,
  QrCode,
  X
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
  const [qrModalOrder, setQrModalOrder] = useState(null);

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
    <div className="space-y-6">
      <PageHeader
        title="Order History"
        subtitle="Review past receipts, track active pickups and reorder previous favorites."
        actions={
          <div className="flex items-center gap-1.5" role="tablist">
            {['All', 'Active', 'Completed', 'Cancelled'].map((st) => {
              const isSelected = filterStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setFilterStatus(st)}
                  className={`h-8 px-2.5 rounded-md text-[12.5px] font-medium border transition-colors ${
                    isSelected
                      ? 'bg-accent-soft text-accent border-accent font-semibold'
                      : 'bg-surface text-fg-muted border-line hover:bg-surface-2 hover:text-fg'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        }
      />

      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No Orders Found"
          description="No previous orders match the selected status filter."
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
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="table-wrap hidden md:block">
            <table className="table min-w-[700px]">
              <thead>
                <tr>
                  <th scope="col">Token / ID</th>
                  <th scope="col">Date & Time</th>
                  <th scope="col">Items Ordered</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">Total</th>
                  <th scope="col" className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((order) => {
                  const isActive = order.status !== 'Collected' && order.status !== 'Cancelled';

                  return (
                    <tr key={order.orderId}>
                      <td className="font-semibold text-fg">
                        <div>{order.tokenNumber}</div>
                        <div className="text-[11.5px] font-normal text-fg-muted">{order.orderId}</div>
                      </td>
                      <td className="text-fg-muted whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })},{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="max-w-[240px]">
                        <div className="truncate text-fg">
                          {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="text-fg-muted">
                        <span className="text-[12px]">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="text-right font-semibold text-fg tabular-nums">
                        ₹{order.totalAmount}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQrModalOrder(order)}
                            className="btn-ghost btn-sm p-1.5 border border-line hover:border-accent hover:text-accent"
                            title="View Pickup QR Pass"
                          >
                            <QrCode size={14} />
                          </button>
                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => handleTrack(order)}
                              className="btn-primary btn-sm"
                            >
                              <span>Track</span>
                              <ArrowRight size={13} strokeWidth={1.75} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              className="btn-secondary btn-sm"
                            >
                              <RotateCcw size={13} strokeWidth={1.75} />
                              <span>Reorder</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredHistory.map((order) => {
              const isActive = order.status !== 'Collected' && order.status !== 'Cancelled';

              return (
                <div key={order.orderId} className="card p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[15px] font-semibold text-fg">{order.tokenNumber}</div>
                      <div className="text-[11.5px] text-fg-muted">{order.orderId}</div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="text-[13px] text-fg-muted py-2 border-y border-line space-y-1">
                    <div className="text-fg font-medium">
                      {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    <div className="text-[12px]">
                      {new Date(order.createdAt).toLocaleString()} • {order.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[16px] font-semibold text-fg tabular-nums">
                      ₹{order.totalAmount}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQrModalOrder(order)}
                        className="btn-ghost btn-sm p-1.5 border border-line"
                        title="View Pickup QR Pass"
                      >
                        <QrCode size={14} />
                      </button>
                      {isActive ? (
                        <button
                          type="button"
                          onClick={() => handleTrack(order)}
                          className="btn-primary btn-sm"
                        >
                          Track Stepper
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="btn-secondary btn-sm"
                        >
                          <RotateCcw size={13} strokeWidth={1.75} />
                          <span>Reorder</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QR Pass Inspection Modal */}
      {qrModalOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setQrModalOrder(null)}
        >
          <div
            className="w-full max-w-sm bg-surface border border-line rounded-2xl p-6 shadow-pop text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="text-left">
                <h3 className="text-sm font-bold text-fg">Digital Pickup Token</h3>
                <p className="text-[11px] text-fg-muted">{qrModalOrder.orderId}</p>
              </div>
              <button
                type="button"
                onClick={() => setQrModalOrder(null)}
                className="w-7 h-7 rounded-lg hover:bg-surface-2 flex items-center justify-center text-fg-muted hover:text-fg"
              >
                <X size={15} />
              </button>
            </div>

            <QRCodeView
              value={`CAMPUSBITE:${qrModalOrder.orderId}:${qrModalOrder.tokenNumber}`}
              tokenNumber={qrModalOrder.tokenNumber}
              size={160}
              caption="Present this QR code to counter staff when called"
              status={qrModalOrder.status}
            />

            <div className="p-3 bg-surface-2 border border-line rounded-xl text-left text-xs space-y-1">
              <div className="flex justify-between text-fg">
                <span className="text-fg-muted">Items:</span>
                <span className="font-semibold">{qrModalOrder.items?.length || 0} items</span>
              </div>
              <div className="flex justify-between text-fg">
                <span className="text-fg-muted">Amount:</span>
                <span className="font-semibold text-accent">₹{qrModalOrder.totalAmount}</span>
              </div>
              <div className="flex justify-between text-fg">
                <span className="text-fg-muted">Payment:</span>
                <span className="capitalize">{qrModalOrder.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
