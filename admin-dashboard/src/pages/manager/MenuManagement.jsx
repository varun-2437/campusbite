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
  ToggleRight
} from 'lucide-react';

export default function MenuManagement() {
  const { menu, toggleItemAvailability, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Menu Management</h1>
          <p style={styles.pageSubtitle}>
            Add, update, or toggle real-time availability of cafeteria food and beverages
          </p>
        </div>

        <button onClick={openAddModal} style={styles.addBtn}>
          <Plus size={18} />
          <span>Add New Menu Item</span>
        </button>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th>In Stock / Available</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item.itemId}>
                  <td>
                    <div style={styles.itemNameWrapper}>
                      <span style={item.isVeg ? styles.vegDot : styles.nonVegDot}>●</span>
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</td>
                  <td>
                    <span style={styles.categoryPill}>{item.category}</span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{formatCurrency(item.price)}</td>
                  <td>{item.prepTime} mins</td>
                  <td>
                    <button
                      onClick={() => toggleItemAvailability(item.itemId)}
                      style={{
                        ...styles.toggleBtn,
                        color: item.isAvailable ? '#10b981' : '#ef4444'
                      }}
                    >
                      {item.isAvailable ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                      <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => openEditModal(item)} style={styles.actionIconBtn}>
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${item.name}?`)) {
                          deleteMenuItem(item.itemId);
                        }
                      }}
                      style={{ ...styles.actionIconBtn, color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label>Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grilled Chicken Sandwich"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.select}
                  >
                    <option value="Food">Food (Kitchen KDS)</option>
                    <option value="Beverage">Beverage / Juice Bar</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="90"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label>Prep Time (Minutes)</label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Dietary</label>
                  <select
                    value={isVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setIsVeg(e.target.value === 'veg')}
                    style={styles.select}
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
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
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    padding: '0.65rem 1.25rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  tableCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    overflow: 'hidden'
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
  itemNameWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  vegDot: {
    color: '#10b981',
    fontSize: '0.9rem'
  },
  nonVegDot: {
    color: '#ef4444',
    fontSize: '0.9rem'
  },
  categoryPill: {
    backgroundColor: 'var(--bg-hover)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem'
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: 'transparent',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  actionIconBtn: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '6px',
    borderRadius: '6px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.25rem'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
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
    gap: '1rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  input: {
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  select: {
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem'
  },
  cancelBtn: {
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  saveBtn: {
    padding: '0.65rem 1.25rem',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.85rem'
  }
};
