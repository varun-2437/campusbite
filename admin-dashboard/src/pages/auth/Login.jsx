import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Utensils, Shield, ArrowRight } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(role, email);

    // Redirect directly based on role returned
    const redirects = {
      cashier: '/cashier',
      kitchen: '/kitchen',
      beverage: '/beverage',
      counter: '/counter',
      manager: '/manager/reports'
    };
    navigate(redirects[role] || '/cashier');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <Utensils size={28} color="var(--accent-primary)" />
          </div>
          <h1 style={styles.title}>CampusBite</h1>
          <p style={styles.subtitle}>Staff & Administration Access Portal</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Operational Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="cashier">Cashier (POS & Billing)</option>
              <option value="kitchen">Kitchen Staff (Food KDS)</option>
              <option value="beverage">Juice & Beverage Counter</option>
              <option value="counter">Food / Serving Counter</option>
              <option value="manager">Manager / Administrator</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Staff Email / ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`${role}@campusbite.com`}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            <span>Sign In to Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={styles.footerNotice}>
          <Shield size={14} color="var(--text-muted)" />
          <span>Role-based access control enabled. Authorized personnel only.</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-primary)',
    padding: '1.5rem'
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '16px',
    padding: '2.5rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.25rem'
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--text-secondary)'
  },
  select: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none'
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none'
  },
  submitBtn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    backgroundColor: 'var(--accent-primary)',
    color: '#fff',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background 0.2s',
    cursor: 'pointer'
  },
  footerNotice: {
    marginTop: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textAlign: 'center'
  }
};
