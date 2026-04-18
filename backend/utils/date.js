const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const subtractDays = (date, days) => addDays(date, -days);

const startOfUtcDay = (date) => {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
};

const endOfUtcDay = (date) => {
  const normalized = new Date(date);
  normalized.setUTCHours(23, 59, 59, 999);
  return normalized;
};

const toUtcDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

const formatCurrency = (value, currency) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

module.exports = {
  addDays,
  subtractDays,
  startOfUtcDay,
  endOfUtcDay,
  toUtcDate,
  formatCurrency,
};
