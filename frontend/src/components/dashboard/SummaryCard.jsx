import { motion } from "framer-motion";

export default function SummaryCard({ title, value, hint, icon: Icon, tone = "indigo" }) {
  const toneClasses = {
    indigo: "from-brand-500/20 to-transparent text-brand-200",
    emerald: "from-emerald-500/20 to-transparent text-emerald-200",
    rose: "from-rose-500/20 to-transparent text-rose-200",
    amber: "from-amber-500/20 to-transparent text-amber-200",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel rounded-3xl p-5 shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[tone]}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}

