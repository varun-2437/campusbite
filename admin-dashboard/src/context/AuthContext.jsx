import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { hashPassword, generateSalt, verifyPassword } from '../utils/crypto';

const AuthContext = createContext(null);

// Pre-configured official demo accounts for all dashboards
export const SAMPLE_USERS = [
  {
    name: 'Varun (Admin)',
    email: 'manager@campusbite.com',
    password: 'Manager@123',
    role: 'manager',
    roleLabel: 'Store Manager',
    approvalStatus: 'approved',
    active: true,
    description: 'Full oversight: Menu, Inventory, Financial Reports, Staff Approvals'
  },
  {
    name: 'Gokul (Cashier)',
    email: 'cashier@campusbite.com',
    password: 'Cashier@123',
    role: 'cashier',
    roleLabel: 'Cashier Staff',
    approvalStatus: 'approved',
    active: true,
    shift: 'Morning',
    description: 'POS Billing, Token Verification, Offline Cash Settlement'
  },
  {
    name: 'Chef Anthony',
    email: 'kitchen@campusbite.com',
    password: 'Kitchen@123',
    role: 'kitchen',
    roleLabel: 'Kitchen Head Chef',
    approvalStatus: 'approved',
    active: true,
    shift: 'All-Day',
    description: 'Kitchen Display System (KDS), Live Ticket Cooking & Prep'
  },
  {
    name: 'Ravi (Beverage)',
    email: 'juice@campusbite.com',
    password: 'Juice@123',
    role: 'beverage',
    roleLabel: 'Juice Bar Specialist',
    approvalStatus: 'approved',
    active: true,
    shift: 'Morning',
    description: 'Juice & Beverage Counter, Drink Queue Management'
  },
  {
    name: 'Divya (Counter)',
    email: 'counter@campusbite.com',
    password: 'Counter@123',
    role: 'counter',
    roleLabel: 'Serving Counter Staff',
    approvalStatus: 'approved',
    active: true,
    shift: 'Evening',
    description: 'Ready Order Handover, QR Token Scan, TV Board Dispatch'
  },
  {
    name: 'Krithik (Student)',
    email: 'student@campusbite.com',
    password: 'Student@123',
    role: 'student',
    roleLabel: 'Student Diner',
    approvalStatus: 'approved',
    active: true,
    studentId: 'CB-2026-STU',
    loyaltyPoints: 240,
    description: 'Instant Access Diner App, Cart Checkout, Live Order Tracker'
  },
  {
    name: 'Priya (New Applicant)',
    email: 'newstaff@campusbite.com',
    password: 'Staff@123',
    role: 'cashier',
    roleLabel: 'Pending Cashier Applicant',
    approvalStatus: 'pending',
    active: false,
    shift: 'Evening',
    description: 'Test Account: Pending Store Manager approval (blocked from login until approved)'
  }
];

export const AuthProvider = ({ children }) => {
  // GUEST BY DEFAULT: Visitors start as unauthenticated guests
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cb_staff_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('cb_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize encrypted user store on first boot
  useEffect(() => {
    async function initSampleUsers() {
      const existing = localStorage.getItem('cb_registered_users');
      if (!existing || JSON.parse(existing).length === 0) {
        const encrypted = [];
        for (const u of SAMPLE_USERS) {
          const salt = generateSalt();
          const pHash = await hashPassword(u.password, salt);
          encrypted.push({
            id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: u.name,
            email: u.email.toLowerCase(),
            salt,
            passwordHash: pHash,
            role: u.role,
            shift: u.shift || 'Morning',
            studentId: u.studentId || null,
            loyaltyPoints: u.loyaltyPoints || 0,
            active: u.active,
            approvalStatus: u.approvalStatus,
            createdAt: new Date().toISOString()
          });
        }
        localStorage.setItem('cb_registered_users', JSON.stringify(encrypted));
        setRegisteredUsers(encrypted);
      }
    }
    initSampleUsers();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Authenticate user with password encryption & approval checking
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both email and password.');
    }

    // 1. Attempt Live Backend API first
    try {
      const apiResponse = await api.login(cleanEmail, cleanPassword);
      if (apiResponse && apiResponse.user) {
        if (apiResponse.token) api.setToken(apiResponse.token);
        const loggedUser = apiResponse.user;
        setUser(loggedUser);
        localStorage.setItem('cb_staff_user', JSON.stringify(loggedUser));
        return loggedUser;
      }
    } catch (apiErr) {
      // If server explicitly returned approval or credential errors, propagate them
      const errMsg = apiErr.message || '';
      if (
        errMsg.toLowerCase().includes('pending approval') ||
        errMsg.toLowerCase().includes('deactivated') ||
        errMsg.toLowerCase().includes('declined')
      ) {
        throw new Error(errMsg);
      }
      // If server error or offline, fallback to local encrypted accounts
    }

    // 2. Offline / Local Encrypted Verification Fallback
    const storedUsers = JSON.parse(localStorage.getItem('cb_registered_users') || '[]');
    const matched = storedUsers.find((u) => u.email === cleanEmail);

    if (!matched) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    const isValidPassword = await verifyPassword(cleanPassword, matched.salt, matched.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    // Strict Approval Checking
    if (matched.approvalStatus === 'pending') {
      throw new Error(
        'Your staff account is currently pending Store Manager approval. Please check back once approved.'
      );
    }

    if (matched.approvalStatus === 'rejected') {
      throw new Error('Your staff registration was declined by the Store Manager.');
    }

    if (!matched.active) {
      throw new Error('Account has been deactivated. Please contact the Store Manager.');
    }

    const authUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.role,
      studentId: matched.studentId,
      loyaltyPoints: matched.loyaltyPoints || 0,
      shift: matched.shift,
      token: `jwt_offline_${matched.role}_${Date.now()}`
    };

    setUser(authUser);
    localStorage.setItem('cb_staff_user', JSON.stringify(authUser));
    return authUser;
  };

  // Register new account with instant student activation vs staff approval workflow
  const register = async ({ name, email, password, role = 'student', studentId, shift = 'Morning' }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      throw new Error('All required fields must be filled out.');
    }

    const isStudent = role === 'student';
    const approvalStatus = isStudent ? 'approved' : 'pending';
    const active = isStudent; // Students activate instantly; staff require approval

    // Check if email already taken locally
    const storedUsers = JSON.parse(localStorage.getItem('cb_registered_users') || '[]');
    if (storedUsers.some((u) => u.email === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    // Encrypt password with Web Crypto salt + SHA-256
    const salt = generateSalt();
    const passwordHash = await hashPassword(cleanPassword, salt);

    const newUserRecord = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: cleanName,
      email: cleanEmail,
      salt,
      passwordHash,
      role,
      studentId: isStudent ? (studentId || `STU-${Date.now().toString().slice(-4)}`) : null,
      shift: !isStudent ? shift : undefined,
      loyaltyPoints: 0,
      active,
      approvalStatus,
      createdAt: new Date().toISOString()
    };

    // Attempt to register in backend API
    try {
      await api.register({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role,
        studentId: newUserRecord.studentId,
        shift
      });
    } catch (e) {
      // Offline fallback continues
    }

    // Persist in local store
    const updated = [newUserRecord, ...storedUsers];
    localStorage.setItem('cb_registered_users', JSON.stringify(updated));
    setRegisteredUsers(updated);

    // If student: automatically log in
    if (isStudent) {
      const loggedUser = {
        id: newUserRecord.id,
        name: newUserRecord.name,
        email: newUserRecord.email,
        role: 'student',
        studentId: newUserRecord.studentId,
        loyaltyPoints: 0
      };
      setUser(loggedUser);
      localStorage.setItem('cb_staff_user', JSON.stringify(loggedUser));
      return { success: true, pendingApproval: false, user: loggedUser };
    }

    // If staff: requires Store Manager approval
    return {
      success: true,
      pendingApproval: true,
      message: 'Staff account registered! A Store Manager must approve your account before you can sign in.'
    };
  };

  // Store Manager: Approve pending staff account
  const approveStaffAccount = async (userIdOrEmail) => {
    const storedUsers = JSON.parse(localStorage.getItem('cb_registered_users') || '[]');
    const updated = storedUsers.map((u) => {
      if (u.id === userIdOrEmail || u.email === userIdOrEmail) {
        return { ...u, approvalStatus: 'approved', active: true };
      }
      return u;
    });
    localStorage.setItem('cb_registered_users', JSON.stringify(updated));
    setRegisteredUsers(updated);

    // Sync with backend API
    try {
      const target = storedUsers.find((u) => u.id === userIdOrEmail || u.email === userIdOrEmail);
      if (target?.id) await api.approveStaff(target.id);
    } catch {}
  };

  // Store Manager: Reject pending staff account
  const rejectStaffAccount = async (userIdOrEmail) => {
    const storedUsers = JSON.parse(localStorage.getItem('cb_registered_users') || '[]');
    const updated = storedUsers.map((u) => {
      if (u.id === userIdOrEmail || u.email === userIdOrEmail) {
        return { ...u, approvalStatus: 'rejected', active: false };
      }
      return u;
    });
    localStorage.setItem('cb_registered_users', JSON.stringify(updated));
    setRegisteredUsers(updated);

    try {
      const target = storedUsers.find((u) => u.id === userIdOrEmail || u.email === userIdOrEmail);
      if (target?.id) await api.rejectStaff(target.id);
    } catch {}
  };

  // Store Manager: Toggle staff active / deactivated status
  const toggleStaffStatus = async (userIdOrEmail) => {
    const storedUsers = JSON.parse(localStorage.getItem('cb_registered_users') || '[]');
    const updated = storedUsers.map((u) => {
      if (u.id === userIdOrEmail || u.email === userIdOrEmail) {
        return { ...u, active: !u.active };
      }
      return u;
    });
    localStorage.setItem('cb_registered_users', JSON.stringify(updated));
    setRegisteredUsers(updated);

    try {
      const target = storedUsers.find((u) => u.id === userIdOrEmail || u.email === userIdOrEmail);
      if (target?.id) await api.toggleStaffStatus(target.id);
    } catch {}
  };

  // Update loyalty points for active logged-in student
  const updateLoyaltyPoints = (newPoints) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, loyaltyPoints: newPoints };
      try {
        localStorage.setItem('cb_staff_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (user && (u.id === user.id || u.email === user.email)) {
          return { ...u, loyaltyPoints: newPoints };
        }
        return u;
      });
      try {
        localStorage.setItem('cb_registered_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cb_staff_user');
    api.logout().catch(() => {});
  };

  const isGuest = !user || user.role === 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        login,
        register,
        logout,
        registeredUsers,
        approveStaffAccount,
        rejectStaffAccount,
        toggleStaffStatus,
        updateLoyaltyPoints,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
