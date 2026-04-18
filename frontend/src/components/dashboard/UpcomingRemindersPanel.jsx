import { BellDot } from "lucide-react";
import { formatDate, formatRelativeDays } from "../../utils/formatters";

export default function UpcomingRemindersPanel({ reminders }) {
  return (
    <div className="glass-panel rounded-3xl p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-200">
          <BellDot size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Upcoming reminder timeline</h2>
          <p className="text-sm text-slate-400">The next charges that deserve attention.</p>
        </div>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <div key={reminder.id} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            {index !== reminders.length - 1 ? (
              <div className="absolute left-[27px] top-14 h-10 w-px bg-gradient-to-b from-brand-400/60 to-transparent" />
            ) : null}
            <div className="flex items-start gap-4">
              <div className="mt-1 h-4 w-4 rounded-full bg-brand-400 shadow-[0_0_20px_rgba(129,140,248,0.85)]" />
              <div>
                <div className="font-medium text-white">{reminder.name}</div>
                <div className="mt-1 text-sm text-slate-400">{formatDate(reminder.renewalDate)}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-brand-200">
                  {formatRelativeDays(reminder.renewalDate)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

