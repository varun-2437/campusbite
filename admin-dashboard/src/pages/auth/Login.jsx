import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, SAMPLE_USERS } from '../../context/AuthContext';
import {
  UtensilsCrossed,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [shift, setShift] = useState('Morning');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pendingNotice, setPendingNotice] = useState(false);

  const resetForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setPendingNotice(false);
  };

  const handleSelectSample = (sample) => {
    setMode('login');
    setEmail(sample.email);
    setPassword(sample.password);
    setErrorMsg('');
    setSuccessMsg('');
    setPendingNotice(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const loggedUser = await login(email, password);
      setIsLoading(false);

      const redirects = {
        student: '/',
        cashier: '/cashier',
        kitchen: '/kitchen',
        beverage: '/beverage',
        counter: '/counter',
        manager: '/manager/reports'
      };
      navigate(redirects[loggedUser.role] || '/');
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await register({
        name,
        email,
        password,
        role,
        studentId: role === 'student' ? studentId : undefined,
        shift: role !== 'student' ? shift : undefined
      });

      setIsLoading(false);

      if (result.pendingApproval) {
        setPendingNotice(true);
        setSuccessMsg(
          'Registration Submitted! Your staff account is pending approval by the Store Manager. You will be able to log in once approved.'
        );
      } else {
        navigate('/');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Registration failed. Please check details.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4">
      {/* Top back link to Canteen home */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Canteen Menu</span>
        </Link>
        <span className="text-[11px] text-fg-subtle">CampusBite Portal</span>
      </div>

      <div className="w-full max-w-md bg-surface border border-line rounded-2xl shadow-pop overflow-hidden">
        {/* Brand Header */}
        <div className="p-6 border-b border-line bg-surface-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent-soft border border-line flex items-center justify-center text-accent mx-auto mb-3 shadow-sm">
            <UtensilsCrossed size={24} strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold text-fg tracking-tight">CampusBite</h1>
          <p className="text-xs text-fg-muted mt-0.5">
            Role-Based Access Control • Canteen Staff & Diners
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-line bg-surface">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              resetForm();
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-accent text-accent bg-accent-soft/20'
                : 'border-transparent text-fg-muted hover:text-fg'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              resetForm();
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-accent text-accent bg-accent-soft/20'
                : 'border-transparent text-fg-muted hover:text-fg'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Quick-Fill Sample Accounts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted flex items-center gap-1.5">
                <KeyRound size={12} className="text-accent" />
                Quick-Fill Demo Credentials (Click to Test)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SAMPLE_USERS.map((s) => (
                <button
                  key={s.email}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className={`text-left p-2 rounded-lg border text-xs transition-all ${
                    email === s.email
                      ? 'border-accent bg-accent-soft text-accent font-semibold shadow-sm'
                      : s.approvalStatus === 'pending'
                      ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-fg'
                      : 'border-line bg-surface-2 hover:bg-surface-3 text-fg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{s.roleLabel.split(' ')[0]}</span>
                    {s.approvalStatus === 'pending' ? (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-500 rounded font-bold">
                        PENDING
                      </span>
                    ) : (
                      <span className="text-[9px] px-1 py-0.2 bg-emerald-500/15 text-emerald-500 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-fg-muted truncate">{s.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-500">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Success / Pending Banner */}
          {successMsg && (
            <div
              className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
                pendingNotice
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
              }`}
            >
              {pendingNotice ? (
                <Clock size={16} className="shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              )}
              <div>
                <strong>{pendingNotice ? 'Store Manager Approval Required' : 'Success!'}</strong>
                <p className="mt-0.5 opacity-90">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. manager@campusbite.com"
                    required
                    className="input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your encrypted password"
                    required
                    className="input w-full pl-9 pr-9 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 text-xs font-semibold justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    className="input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@campusbite.com or student mail"
                    required
                    className="input w-full pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Account Role & Access Level
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input w-full text-xs"
                >
                  <option value="student">Student / Diner (Instant Activation - No Approval Needed)</option>
                  <option value="cashier">Cashier Staff (Requires Store Manager Approval)</option>
                  <option value="kitchen">Kitchen Chef (Requires Store Manager Approval)</option>
                  <option value="beverage">Juice & Beverage Counter (Requires Store Manager Approval)</option>
                  <option value="counter">Order Handover Counter (Requires Store Manager Approval)</option>
                  <option value="manager">Store Manager / Admin (Requires Existing Admin Approval)</option>
                </select>

                <div className="mt-2 p-2.5 rounded-lg border text-xs">
                  {role === 'student' ? (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border-emerald-500/20 p-2 rounded">
                      <Sparkles size={14} className="shrink-0" />
                      <span>
                        <strong>Instant Access:</strong> Students are automatically approved and logged in immediately!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 border-amber-500/20 p-2 rounded">
                      <Clock size={14} className="shrink-0" />
                      <span>
                        <strong>Approval Required:</strong> Staff accounts require authorization from the Store Manager before dashboard access is unlocked.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {role === 'student' ? (
                <div>
                  <label className="block text-xs font-medium text-fg-muted mb-1">
                    Student ID Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. CB-2026-981"
                    className="input w-full text-xs"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-fg-muted mb-1">
                    Operational Shift
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="input w-full text-xs"
                  >
                    <option value="Morning">Morning Shift (7:00 AM - 2:00 PM)</option>
                    <option value="Evening">Evening Shift (2:00 PM - 9:00 PM)</option>
                    <option value="All-Day">All-Day / General Admin</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-fg-muted mb-1">
                  Create Password (Encrypted with Salt + SHA-256)
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="input w-full pl-9 pr-9 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 text-xs font-semibold justify-center gap-2 mt-2"
              >
                <span>
                  {isLoading
                    ? 'Registering Account...'
                    : role === 'student'
                    ? 'Create Student Account'
                    : 'Submit Staff Application'}
                </span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-line bg-surface-2 text-center text-[11px] text-fg-muted flex items-center justify-center gap-1.5">
          <Shield size={12} className="text-accent" />
          <span>Passwords encrypted with SHA-256 & bcrypt salts. Role-protected access.</span>
        </div>
      </div>
    </div>
  );
}
