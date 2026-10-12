import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { getElapsedMinutes } from '../../utils/formatters';
import {
  ChefHat,
  Clock,
  AlertCircle,
  CheckCircle2,
  Flame,
  Filter
} from 'lucide-react';

export default function KitchenDashboard() {
  const { orders, updateOrderStatus } = useStore();
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Filter to Food items only
  const foodOrders = orders.filter((o) => {
    const hasFood = o.items.some((i) => i.category === 'Food') || o.category === 'Food';
    const isOngoing = o.status === 'Pending' || o.status === 'Preparing';
    const priorityMatch = filterPriority === 'ALL' || o.priority === filterPriority;
    return hasFood && isOngoing && priorityMatch;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'VIP':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', border: '#ef4444' };
      case 'Quick':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6', border: '#3b82f6' };
      case 'Bulk':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', border: '#f59e0b' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', border: '#475569' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Kitchen Display System (KDS)</h1>
          <p className="text-sm text-fg-muted">
            Live food queue feed • Real-time order progress & ticket management
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-surface border border-line rounded-lg p-1 shadow-sm">
          <div className="pl-2 pr-1 text-fg-muted">
            <Filter size={15} />
          </div>
          <button
            onClick={() => setFilterPriority('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterPriority === 'ALL'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            All Tickets ({foodOrders.length})
          </button>
          <button
            onClick={() => setFilterPriority('VIP')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterPriority === 'VIP'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            VIP
          </button>
          <button
            onClick={() => setFilterPriority('Quick')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterPriority === 'Quick'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            Quick Snack
          </button>
          <button
            onClick={() => setFilterPriority('Bulk')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterPriority === 'Bulk'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            Bulk
          </button>
        </div>
      </div>

      {/* Ticket Grid or Empty State */}
      {foodOrders.length === 0 ? (
        <div className="card text-center py-16 flex flex-col items-center justify-center gap-3 border-dashed border-2">
          <div className="p-3 bg-surface-2 rounded-full text-fg-subtle">
            <ChefHat size={48} />
          </div>
          <h3 className="text-lg font-semibold text-fg">All Food Orders Completed!</h3>
          <p className="text-sm text-fg-muted max-w-md">
            No pending food tickets right now. Waiting for incoming orders from the student portal and cashier POS.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {foodOrders.map((order) => {
            const elapsed = getElapsedMinutes(order.createdAt);
            const isLate = elapsed > 15;
            const isPreparing = order.status === 'Preparing';

            return (
              <div
                key={order.orderId}
                className={`bg-surface rounded-xl p-5 border flex flex-col justify-between shadow-sm transition hover:shadow-md ${
                  isLate
                    ? 'border-red-500/80 ring-1 ring-red-500/30'
                    : isPreparing
                    ? 'border-teal-500/80 ring-1 ring-teal-500/30'
                    : 'border-line hover:border-line-strong'
                }`}
                style={{ minHeight: '290px' }}
              >
                {/* Header with Token & Timer */}
                <div className="border-b border-line pb-3.5 mb-3.5 flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-black text-fg tracking-tight">{order.tokenNumber}</div>
                    <span className="text-xs font-mono text-fg-muted">{order.orderId}</span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        isLate
                          ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
                          : 'bg-surface-2 text-fg-muted border-line'
                      }`}
                    >
                      <Clock size={12} />
                      <span>{elapsed}m ago</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        order.priority === 'VIP'
                          ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400'
                          : order.priority === 'Quick'
                          ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400'
                          : order.priority === 'Bulk'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-surface-2 text-fg-muted border-line'
                      }`}
                    >
                      {order.priority}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2.5 flex-1 mb-4">
                  {order.items
                    .filter((item) => item.category === 'Food')
                    .map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold text-xs rounded border border-teal-200/50">
                          {item.quantity}x
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-fg leading-snug">{item.name}</p>
                          {item.customization && (
                            <p className="text-xs text-fg-muted italic mt-0.5">
                              Note: {item.customization}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs mb-3.5">
                    <AlertCircle size={15} className="shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="italic font-medium leading-tight">"{order.specialInstructions}"</span>
                  </div>
                )}

                {/* Action Buttons - High Contrast and Distinct */}
                <div className="pt-2 border-t border-line/60">
                  {order.status === 'Pending' ? (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Preparing')}
                      className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Flame size={17} />
                      <span>Start Preparing</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Ready')}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <CheckCircle2 size={17} />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
