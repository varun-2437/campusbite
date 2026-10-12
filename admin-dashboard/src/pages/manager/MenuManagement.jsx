import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Search,
  Clock,
  Sparkles
} from 'lucide-react';

export default function MenuManagement() {
  const { menu, toggleItemAvailability, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL' | 'Food' | 'Beverage' | 'Veg' | 'Non-Veg'

  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Food');
  const [prepTime, setPrepTime] = useState(10);
  const [isVeg, setIsVeg] = useState(true);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setPrice('');
    setCategory('Food');
    setPrepTime(10);
    setIsVeg(true);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setPrepTime(item.prepTime || 10);
    setIsVeg(item.isVeg);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    if (editingItem) {
      updateMenuItem(editingItem.itemId, {
        name,
        price: Number(price),
        category,
        prepTime: Number(prepTime),
        isVeg
      });
    } else {
      addMenuItem({
        name,
        price: Number(price),
        category,
        prepTime: Number(prepTime),
        isVeg,
        isAvailable: true
      });
    }
    setShowModal(false);
  };

  // Filtered menu list
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (filterCategory === 'Food') matchesCategory = item.category === 'Food';
    else if (filterCategory === 'Beverage') matchesCategory = item.category === 'Beverage';
    else if (filterCategory === 'Veg') matchesCategory = item.isVeg === true;
    else if (filterCategory === 'Non-Veg') matchesCategory = item.isVeg === false;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Menu Management</h1>
          <p className="text-sm text-fg-muted">
            Add, update, or toggle real-time availability of cafeteria food and beverages
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface border border-line rounded-xl p-3 shadow-sm">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or beverage name..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg placeholder:text-fg-subtle"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterCategory === 'ALL'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            All Items ({menu.length})
          </button>
          <button
            onClick={() => setFilterCategory('Food')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterCategory === 'Food'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            Food (KDS)
          </button>
          <button
            onClick={() => setFilterCategory('Beverage')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterCategory === 'Beverage'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            Beverage / Juice
          </button>
          <button
            onClick={() => setFilterCategory('Veg')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterCategory === 'Veg'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            ● Veg Only
          </button>
          <button
            onClick={() => setFilterCategory('Non-Veg')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              filterCategory === 'Non-Veg'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            ▲ Non-Veg Only
          </button>
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="card p-0 overflow-hidden border border-line rounded-xl shadow-sm bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2 border-b border-line text-xs font-semibold text-fg-muted uppercase tracking-wider">
                <th className="px-5 py-3.5">Item Name</th>
                <th className="px-4 py-3.5">Dietary</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Prep Time</th>
                <th className="px-4 py-3.5">Availability</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredMenu.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-fg-muted">
                    No menu items found matching the current search or category filter.
                  </td>
                </tr>
              ) : (
                filteredMenu.map((item) => (
                  <tr key={item.itemId} className="hover:bg-surface-2/60 transition group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xs ${item.isVeg ? 'text-emerald-500' : 'text-red-500'}`}>
                          {item.isVeg ? '●' : '▲'}
                        </span>
                        <div className="font-semibold text-fg text-sm">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-fg-muted">
                      {item.isVeg ? (
                        <span className="text-emerald-600 font-medium">Vegetarian</span>
                      ) : (
                        <span className="text-red-500 font-medium">Non-Veg</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-2 border border-line text-fg-muted">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-fg">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-fg-muted">
                      <div className="flex items-center gap-1 font-mono">
                        <Clock size={12} />
                        {item.prepTime || 10} mins
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleItemAvailability(item.itemId)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                          item.isAvailable
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        }`}
                      >
                        {item.isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-md text-fg-muted hover:text-fg hover:bg-surface-2 transition cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${item.name}?`)) {
                              deleteMenuItem(item.itemId);
                            }
                          }}
                          className="p-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="card bg-surface border border-line rounded-xl p-6 shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-fg mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-fg mb-1.5">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grilled Chicken Sandwich"
                  className="w-full h-10 px-3 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg placeholder:text-fg-subtle shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-fg mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg shadow-sm"
                  >
                    <option value="Food">Food (Kitchen KDS)</option>
                    <option value="Beverage">Beverage / Juice Bar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="90"
                    className="w-full h-10 px-3 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-fg mb-1.5">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-fg mb-1.5">Dietary</label>
                  <select
                    value={isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setIsVeg(e.target.value === 'veg')}
                    className="w-full h-10 px-3 text-sm bg-surface border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg shadow-sm"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-line bg-surface hover:bg-surface-2 text-fg text-xs font-medium transition cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
