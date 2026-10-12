import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, AlertTriangle, Edit3, Check, Search, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';

export default function InventoryManagement() {
  const { inventory, updateInventoryStock } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditQty(item.quantity);
    setEditThreshold(item.threshold);
  };

  const handleSave = (id) => {
    updateInventoryStock(id, editQty, editThreshold);
    setEditingId(null);
  };

  // Metrics
  const totalItems = inventory.length;
  const lowCount = inventory.filter((i) => i.quantity > 0 && i.quantity <= i.threshold).length;
  const outCount = inventory.filter((i) => i.quantity === 0).length;
  const adequateCount = totalItems - lowCount - outCount;

  // Categories
  const categories = ['ALL', ...new Set(inventory.map((i) => i.category))];

  // Filtered Items
  const filteredItems = inventory.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fg">Inventory & Stock Control</h1>
        <p className="text-sm text-fg-muted">
          Monitor raw kitchen supplies, set minimum thresholds, and prevent stock-outs
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-surface border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
            <Package size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-fg-muted">Total Supplies</div>
            <div className="text-xl font-bold text-fg">{totalItems} Items</div>
          </div>
        </div>

        <div className="card bg-surface border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-fg-muted">Optimal Stock</div>
            <div className="text-xl font-bold text-emerald-600">{adequateCount} Items</div>
          </div>
        </div>

        <div className="card bg-surface border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-fg-muted">Low Stock Alert</div>
            <div className="text-xl font-bold text-amber-600">{lowCount} Items</div>
          </div>
        </div>

        <div className="card bg-surface border border-line rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
            <XCircle size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-fg-muted">Out of Stock</div>
            <div className="text-xl font-bold text-red-600">{outCount} Items</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-line rounded-xl p-3 shadow-sm">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ingredient or item name..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg placeholder:text-fg-subtle"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedCat === cat
                  ? 'bg-accent text-white font-semibold shadow-sm'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-2'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="card p-0 overflow-hidden border border-line rounded-xl shadow-sm bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2 border-b border-line text-xs font-semibold text-fg-muted uppercase tracking-wider">
                <th className="px-5 py-3.5">Item Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Current Stock</th>
                <th className="px-4 py-3.5">Unit</th>
                <th className="px-4 py-3.5">Min Threshold</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-fg-muted">
                    No inventory items match the current search or category filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.quantity > 0 && item.quantity <= item.threshold;
                  const isOut = item.quantity === 0;
                  const isEditing = editingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-2/60 transition group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-fg text-sm">{item.itemName}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-2 border border-line text-fg-muted">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            className="w-20 h-8 px-2 text-sm font-semibold border border-line-strong rounded focus:outline-none focus:ring-1 focus:ring-accent bg-surface text-fg"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-fg text-base">{item.quantity}</span>
                            <span className="text-xs text-fg-muted">{item.unit}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-fg-muted">
                        {item.unit}
                      </td>
                      <td className="px-4 py-3.5">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editThreshold}
                            onChange={(e) => setEditThreshold(e.target.value)}
                            className="w-20 h-8 px-2 text-sm font-semibold border border-line-strong rounded focus:outline-none focus:ring-1 focus:ring-accent bg-surface text-fg"
                          />
                        ) : (
                          <span className="text-xs font-mono font-medium text-fg-muted">
                            {item.threshold} {item.unit}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {isOut ? (
                          <span className="badge-danger text-xs font-semibold">
                            OUT OF STOCK
                          </span>
                        ) : isLow ? (
                          <span className="badge-warning text-xs font-semibold">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="badge-success text-xs font-semibold">
                            ADEQUATE
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
                          >
                            <Check size={14} />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line bg-surface hover:bg-surface-2 text-fg text-xs font-medium transition cursor-pointer shadow-sm"
                          >
                            <Edit3 size={13} className="text-fg-muted" />
                            <span>Update</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
