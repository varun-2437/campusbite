export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount || 0);
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getElapsedMinutes = (dateString) => {
  if (!dateString) return 0;
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.max(0, Math.floor(diff / 60000));
};
