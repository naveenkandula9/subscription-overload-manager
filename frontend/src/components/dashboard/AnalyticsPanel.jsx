import { Sparkles } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export default function AnalyticsPanel({ summary, subscriptions }) {
  const categories = subscriptions.slice(0, 4);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Spend analytics</h2>
          <p className="text-sm text-slate-400">
            Quick financial signal without leaving the dashboard.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-sm text-slate-400">Projected yearly spend</div>
          <div className="mt-3 text-3xl font-extrabold text-white">
            {formatCurrency(summary.metrics.totalYearlyCommitment, "INR")}
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Based on current active subscriptions and billing cycles.
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-sm text-slate-400">Highest current plan</div>
          <div className="mt-3 text-xl font-bold text-white">
            {summary.insights.highestSubscription?.name || "No active subscriptions"}
          </div>
          <div className="mt-2 text-sm text-slate-500">
            {summary.insights.highestSubscription
              ? formatCurrency(
                  summary.insights.highestSubscription.price,
                  summary.insights.highestSubscription.currency
                )
              : "Add a subscription to generate insights."}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {categories.map((subscription) => (
          <div key={subscription.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{subscription.name}</span>
              <span className="text-slate-500">
                {formatCurrency(subscription.price, subscription.currency)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-violet-400"
                style={{
                  width: `${Math.max(18, Math.min(100, (subscription.price / (categories[0]?.price || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

