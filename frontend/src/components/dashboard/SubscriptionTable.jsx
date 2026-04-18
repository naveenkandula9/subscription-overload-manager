import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Button from "../ui/Button";

const statusClasses = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-400/20",
};

export default function SubscriptionTable({
  subscriptions,
  onEdit,
  onDelete,
  previewMode = false,
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-3xl shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Subscriptions</h2>
          <p className="text-sm text-slate-400">
            Track price, billing cadence, renewal timing, and current account status.
          </p>
        </div>
        {previewMode ? (
          <div className="rounded-full border border-brand-400/20 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200">
            Preview data
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/[0.02] text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Billing Cycle</th>
              <th className="px-6 py-4">Next Renewal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="transition hover:bg-white/[0.03]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 text-sm font-bold text-white">
                      {subscription.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{subscription.name}</div>
                      <div className="text-sm text-slate-500">
                        Reminder {subscription.remindBeforeDays || 0} day(s) before
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-200">
                  {formatCurrency(subscription.price, subscription.currency)}
                </td>
                <td className="px-6 py-4 text-sm capitalize text-slate-300">
                  {subscription.billingCycle}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {formatDate(subscription.renewalDate)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClasses[subscription.status]}`}
                  >
                    {subscription.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" className="px-3 py-2" onClick={() => onEdit(subscription)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-3 py-2 text-rose-300 hover:bg-rose-500/10"
                      onClick={() => onDelete(subscription)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button variant="ghost" className="px-3 py-2">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

