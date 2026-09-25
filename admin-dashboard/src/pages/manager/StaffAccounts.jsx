import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, UserPlus, Shield, Check, X } from 'lucide-react';

export default function StaffAccounts() {
  const { staffList, toggleStaffStatus, addStaffAccount } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('cashier');
  const [shift, setShift] = useState('Morning');

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    addStaffAccount({
      name,
      email,
      role,
      shift
    });

    setName('');
    setEmail('');
    setShowModal(false);
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Staff Accounts & Access Management</h1>
          <p style={styles.pageSubtitle}>
            Create, assign roles, and manage activation status for cafeteria personnel
          </p>
        </div>

        <button onClick={() => setShowModal(true)} style={styles.addBtn}>
          <UserPlus size={18} />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Email / Login ID</th>
                <th>Operational Role</th>
                <th>Shift</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div style={styles.nameCell}>
                      <div style={styles.avatar}>{staff.name.charAt(0)}</div>
                      <strong>{staff.name}</strong>
                    </div>
                  </td>
                  <td>{staff.email}</td>
                  <td>
                    <span style={styles.roleBadge}>{staff.role.toUpperCase()}</span>
                  </td>
                  <td>{staff.shift}</td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: staff.active
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                        color: staff.active ? '#10b981' : '#ef4444'
                      }}
                    >
                      {staff.active ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => toggleStaffStatus(staff.id)}
                      style={{
                        ...styles.toggleBtn,
                        backgroundColor: staff.active
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)',
                        color: staff.active ? '#ef4444' : '#10b981'
                      }}
                    >
                      {staff.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Add New Staff Member</h3>
            <form onSubmit={handleAddStaff} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.cashier@campusbite.com"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label>Assigned Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.select}
                  >
                    <option value="cashier">Cashier</option>
                    <option value="kitchen">Kitchen Staff</option>
                    <option value="beverage">Juice Bar Staff</option>
                    <option value="counter">Serving Counter</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Work Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    style={styles.select}
                  >
                    <option value="Morning">Morning (8am - 3pm)</option>
                    <option value="Evening">Evening (3pm - 10pm)</option>
                    <option value="All-Day">All-Day</option>
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
                <button type="submit" style={styles.submitBtn}>
                  Create Staff Account
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
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
    color: 'var(--accent-primary)'
  },
  roleBadge: {
    backgroundColor: 'var(--bg-hover)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  toggleBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer'
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
    maxWidth: '460px'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.25rem'
  },
  form: {
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
  submitBtn: {
    padding: '0.65rem 1.25rem',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.85rem'
  }
};
