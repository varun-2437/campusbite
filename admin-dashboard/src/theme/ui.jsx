import React from 'react';
import { Loader2, X, AlertCircle } from 'lucide-react';

/**
 * Standard PageHeader component
 * Title 22px / 600, Subtitle 14px / 400 muted, right-aligned action buttons
 */
export function PageHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-line ${className}`}>
      <div>
        <h1 className="text-[22px] font-semibold text-fg tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-fg-muted mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * StatCard component
 * Enterprise look: neutral card, no gradients, clean icon square, value in tabular
 */
export function StatCard({ label, value, icon: Icon, delta, hint, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[12.5px] font-medium text-fg-muted uppercase tracking-wider block">
            {label}
          </span>
          <span className="text-[24px] font-semibold text-fg mt-1 block tabular-nums leading-tight">
            {value}
          </span>
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-md bg-surface-2 border border-line flex items-center justify-center text-fg-muted">
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
          </div>
        )}
      </div>
      {(delta !== undefined || hint) && (
        <div className="mt-3 pt-2 border-t border-line flex items-center gap-1.5 text-[12px] text-fg-muted">
          {delta !== undefined && (
            <span className={delta >= 0 ? 'text-success font-medium' : 'text-danger font-medium'}>
              {delta >= 0 ? `+${delta}%` : `${delta}%`}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      )}
    </div>
  );
}

/**
 * StatusBadge component
 * Follows strict semantic status badge pattern: dot + label
 */
export function StatusBadge({ status, label, className = '' }) {
  const norm = (status || '').toLowerCase();
  const displayLabel = label || status || 'Unknown';

  if (norm === 'ready' || norm === 'paid' || norm === 'completed' || norm === 'collected' || norm === 'active' || norm === 'success') {
    return (
      <span className={`badge-success ${className}`}>
        {displayLabel}
      </span>
    );
  }

  if (norm === 'preparing' || norm === 'pending' || norm === 'awaiting' || norm === 'warning') {
    return (
      <span className={`badge-warning ${className}`}>
        {displayLabel}
      </span>
    );
  }

  if (norm === 'cancelled' || norm === 'refunded' || norm === 'error' || norm === 'failed' || norm === 'danger') {
    return (
      <span className={`badge-danger ${className}`}>
        {displayLabel}
      </span>
    );
  }

  if (norm === 'info' || norm === 'in progress') {
    return (
      <span className={`badge-info ${className}`}>
        {displayLabel}
      </span>
    );
  }

  return (
    <span className={`badge-neutral ${className}`}>
      {displayLabel}
    </span>
  );
}

/**
 * Form Field Wrapper
 * Visible label with htmlFor, error message with aria-describedby
 */
export function Field({ label, error, required = false, children, hint, id, className = '' }) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="label flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-danger ml-0.5" aria-hidden="true">*</span>}
          </span>
          {hint && <span className="text-[12px] text-fg-muted font-normal">{hint}</span>}
        </label>
      )}
      {React.cloneElement(children, {
        id: fieldId,
        'aria-invalid': !!error,
        'aria-describedby': errorId,
        className: `${children.props.className || 'input'} ${error ? 'input-error' : ''}`
      })}
      {error && (
        <p id={errorId} className="field-error flex items-center gap-1">
          <AlertCircle size={12} strokeWidth={1.75} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * EmptyState component
 * Clean, restrained, neutral icon, no emojis
 */
export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`p-10 text-center flex flex-col items-center justify-center bg-surface border border-line rounded-lg ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-md bg-surface-2 border border-line flex items-center justify-center text-fg-muted mb-3">
          <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-fg">
        {title}
      </h3>
      {description && (
        <p className="text-[13px] text-fg-muted mt-1 max-w-[380px] leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton loading placeholder
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-surface-2 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Modal component
 * 480px / 640px, 10px radius, header + body + footer border, shadow-pop
 */
export function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-[480px]' }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${maxWidth} bg-surface border border-line rounded-xl shadow-pop overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface">
          <h2 className="text-[16px] font-semibold text-fg">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn-ghost w-8 h-8 p-0 rounded"
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="px-5 py-3 border-t border-line bg-surface-2/40 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
