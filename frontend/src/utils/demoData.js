export const demoSubscriptions = [
  {
    id: "demo-netflix",
    name: "Netflix",
    price: 649,
    currency: "INR",
    billingCycle: "monthly",
    renewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    remindBeforeDays: 3,
  },
  {
    id: "demo-notion",
    name: "Notion AI",
    price: 999,
    currency: "INR",
    billingCycle: "monthly",
    renewalDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    remindBeforeDays: 4,
  },
  {
    id: "demo-spotify",
    name: "Spotify",
    price: 119,
    currency: "INR",
    billingCycle: "monthly",
    renewalDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    remindBeforeDays: 2,
  },
];

export const demoDashboard = {
  metrics: {
    totalMonthlySpend: 1767,
    totalYearlyCommitment: 21204,
    activeSubscriptions: 8,
    upcomingRenewals: 3,
  },
  reminders: demoSubscriptions,
  insights: {
    highestSubscription: {
      name: "Notion AI",
      price: 999,
      currency: "INR",
    },
  },
};
