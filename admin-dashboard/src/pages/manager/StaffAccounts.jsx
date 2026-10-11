import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  Shield,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  Sparkles,
  UserCheck,
  UserX
} from 'lucide-react';

export default function StaffAccounts() {
  const {
    registeredUsers,
    approveStaffAccount,
    rejectStaffAccount,
    toggleStaffStatus,
    register
  } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Staff@123');
  const [role, setRole] = useState('cashier');
  const [shift, setShift] = useState('Morning');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filter staff users (exclude normal student diners)
  const staffOnly = registeredUsers.filter((u) => u.role !== 'student');
  const pendingStaff = staffOnly.filter((u) => u.approvalStatus === 'pending');
  const approvedStaff = staffOnly.filter((u) => u.approvalStatus === 'approved');

  const displayedList =
    activeTab === 'pending'
      ? pendingStaff
      : activeTab === 'approved'
      ? approvedStaff
      : staffOnly;

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      await register({
        name,
        email,
        password,
        role,
        shift
      });
      // Direct addition by manager is pre-approved
      await approveStaffAccount(email.toLowerCase());

      setName('');
      setEmail('');
      setPassword('Staff@123');
      setShowModal(false);
      setFeedbackMsg(`Staff account for ${name} created and activated!`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to add staff member');
    }
  };

  const handleApprove = async (user) => {
    await approveStaffAccount(user.id || user.email);
    setFeedbackMsg(`Approved ${user.name} for ${user.role.toUpperCase()} access!`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleReject = async (user) => {
    await rejectStaffAccount(user.id || user.email);
    setFeedbackMsg(`Declined application for ${user.name}.`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const getRoleBadgeColor = (r) => {
    switch (r) {
      case 'manager':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'cashier':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'kitchen':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'beverage':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'counter':
        return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-surface-2 text-fg-muted border-line';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="text-xl font-bold text-fg tracking-tight flex items-center gap-2">
            <Users size={22} className="text-accent" />
            <span>Staff Accounts & Access Management</span>
          </h1>
          <p className="text-xs text-fg-muted mt-0.5">
            Authorize staff registrations, assign operational roles, and manage permissions
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary h-9 px-3 text-xs font-semibold gap-1.5 self-start sm:self-auto"
        >
          <UserPlus size={15} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Pending Approvals Callout Banner */}
      {pendingStaff.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                {pendingStaff.length} Staff Application(s) Pending Review
              </h3>
              <p className="text-xs text-fg-muted">
                Workers who registered online cannot access their dashboards until you approve their accounts below.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('pending')}
            className="btn-secondary h-8 px-3 text-xs text-amber-500 border-amber-500/30 hover:bg-amber-500/15"
          >
            Review Pending Queue ({pendingStaff.length})
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-accent-soft text-accent border border-accent/20'
              : 'text-fg-muted hover:text-fg'
          }`}
        >
          All Staff ({staffOnly.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
              : 'text-fg-muted hover:text-fg'
          }`}
        >
          <span>Pending Approvals</span>
          {pendingStaff.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingStaff.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'approved'
              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
              : 'text-fg-muted hover:text-fg'
          }`}
        >
          Active Personnel ({approvedStaff.length})
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-surface border border-line rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-fg-muted uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Login Email</th>
                <th className="py-3 px-4">Role & Department</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-fg-muted">
                    No staff records found in this category.
                  </td>
                </tr>
              ) : (
                displayedList.map((staff) => (
                  <tr key={staff.id || staff.email} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-surface-2 border border-line flex items-center justify-center font-bold text-accent">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-fg">{staff.name}</div>
                          {staff.approvalStatus === 'pending' && (
                            <span className="text-[10px] text-amber-500 font-medium">
                              Applied via public portal
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-fg-muted">{staff.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold uppercase tracking-wider ${getRoleBadgeColor(
                          staff.role
                        )}`}
                      >
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-fg-muted">{staff.shift || 'General'}</td>
                    <td className="py-3 px-4">
                      {staff.approvalStatus === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20 font-bold text-[10px]">
                          <Clock size={10} />
                          <span>PENDING APPROVAL</span>
                        </span>
                      ) : staff.approvalStatus === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/20 font-bold text-[10px]">
                          <UserX size={10} />
                          <span>DECLINED</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            staff.active
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                              : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              staff.active ? 'bg-emerald-500' : 'bg-zinc-400'
                            }`}
                          />
                          <span>{staff.active ? 'ACTIVE' : 'DEACTIVATED'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {staff.approvalStatus === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(staff)}
                            className="btn-primary h-7 px-2.5 text-[11px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            title="Approve access"
                          >
                            <UserCheck size={12} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(staff)}
                            className="btn-secondary h-7 px-2 text-[11px] text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
                            title="Decline request"
                          >
                            <X size={12} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleStaffStatus(staff.id || staff.email)}
                          className={`h-7 px-2.5 rounded text-[11px] font-semibold border transition-colors ${
                            staff.active
                              ? 'border-rose-500/30 text-rose-500 hover:bg-rose-500/10'
                              : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                        >
                          {staff.active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface border border-line rounded-2xl p-6 shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <UserPlus size={18} className="text-accent" />
                <span>Add Pre-Approved Staff</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-surface-2 flex items-center justify-center text-fg-muted"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Login Email / Username
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.cashier@campusbite.com"
                  required
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Operational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input w-full text-xs"
                >
                  <option value="cashier">Cashier (POS & Billing)</option>
                  <option value="kitchen">Kitchen Staff (Food KDS)</option>
                  <option value="beverage">Juice & Beverage Counter</option>
                  <option value="counter">Food / Serving Counter</option>
                  <option value="manager">Manager / Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Shift Assignment
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="input w-full text-xs"
                >
                  <option value="Morning">Morning Shift (7:00 AM - 2:00 PM)</option>
                  <option value="Evening">Evening Shift (2:00 PM - 9:00 PM)</option>
                  <option value="All-Day">All-Day / General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Initial Password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input w-full text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary h-8 px-3 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary h-8 px-3.5 text-xs font-semibold">
                  Create & Activate Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
