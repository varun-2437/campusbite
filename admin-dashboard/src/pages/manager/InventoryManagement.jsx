import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, AlertTriangle, Edit3, Save, Check } from 'lucide-react';

export default function InventoryManagement() {
  const { inventory, updateInventoryStock } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [editThreshold, setEditThreshold] = useState('');

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditQty(item.quantity);
    setEditThreshold(item.threshold);
  };

  const handleSave = (id) => {
    updateInventoryStock(id, editQty, editThreshold);
    setEditingId(null);
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Inventory & Stock Control</h1>
          <p style={styles.pageSubtitle}>
            Monitor raw kitchen supplies, set minimum thresholds, and prevent stock-outs
          </p>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Min Threshold</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isLow = item.quantity <= item.threshold;
                const isOut = item.quantity === 0;
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.itemName}</strong>
                    </td>
                    <td>
                      <span style={styles.catBadge}>{item.category}</span>
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(e.target.value)}
                          style={styles.editInput}
                        />
                      ) : (
                        <span style={{ fontSize: '1rem', fontWeight: '700' }}>
                          {item.quantity}
                        </span>
                      )}
                    </td>
                    <td>{item.unit}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editThreshold}
                          onChange={(e) => setEditThreshold(e.target.value)}
                          style={styles.editInput}
                        />
                      ) : (
                        <span>{item.threshold}</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: isOut
                            ? 'rgba(239, 68, 68, 0.2)'
                            : isLow
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                          color: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#10b981'
                        }}
                      >
                        {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'ADEQUATE'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isEditing ? (
                        <button onClick={() => handleSave(item.id)} style={styles.saveBtn}>
                          <Check size={16} />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button onClick={() => startEdit(item)} style={styles.editBtn}>
                          <Edit3 size={15} />
                          <span>Update</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '1.5rem'
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
  catBadge: {
    backgroundColor: 'var(--bg-hover)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem'
  },
  editInput: {
    width: '70px',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem'
  },
  editBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: 'var(--accent-success)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600'
  }
};
