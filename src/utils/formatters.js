/**
 * GumiGenk Journal — Formatters
 * Number, date, and currency formatting utilities
 */

/**
 * Format currency value
 */
export const formatCurrency = (value, currency = 'USD', decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : value > 0 ? '+' : '';
  
  if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(2)}M`;
  }
  if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(2)}K`;
  }
  return `${sign}$${absValue.toFixed(decimals)}`;
};

/**
 * Format currency with sign color indicator
 */
export const formatPL = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  const sign = value >= 0 ? '+' : '';
  return `${sign}$${value.toFixed(decimals)}`;
};

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with commas
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format date
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  switch (format) {
    case 'full':
      return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    case 'medium':
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
      });
    case 'iso':
      return date.toISOString().split('T')[0];
    default:
      return dateString;
  }
};

/**
 * Format time
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

/**
 * Format RR ratio
 */
export const formatRR = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0R';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}R`;
};

/**
 * Get relative time string
 */
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateString, 'short');
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};
