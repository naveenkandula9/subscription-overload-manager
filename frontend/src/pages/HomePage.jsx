import { motion } from "framer-motion";
import { ArrowRight, BellRing, BarChart3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const features = [
  {
    icon: BellRing,
    title: "Automated reminders",
    description: "Stay ahead of every renewal with timely alerts before recurring charges hit.",
  },
  {
    icon: BarChart3,
    title: "Cost analytics",
    description: "Spot your biggest recurring expenses and understand your monthly commitment instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Easy cancellation tracking",
    description: "Mark subscriptions as cancelled and keep your dashboard clean and trustworthy.",
  },
];

const floatingCards = [
  { title: "Upcoming charge", value: "Netflix", meta: "Renews in 2 days" },
  { title: "Monthly spend", value: "₹1,767", meta: "Across 8 active subscriptions" },
  { title: "Alert window", value: "3 reminders", meta: "This week" },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-hero-radial">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-200">
              Never miss a renewal again
            </div>
            <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              Take control of your subscriptions before they control your budget.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Subscription Overload Manager gives you one place to monitor renewals, automate reminder emails,
              and cut down on surprise charges with confidence.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/register">
                <Button className="gap-2 px-6 py-3 text-base">
                  Start Managing for Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="px-6 py-3 text-base">
                  Explore the dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
              <span>Trusted reminder delivery</span>
              <span>UTC-safe renewal tracking</span>
              <span>Built for modern SaaS teams</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass-panel relative overflow-hidden rounded-[32px] border border-white/10 p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-violet-500/10" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Dashboard preview</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">Renewal command center</h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-brand-200">
                    Live alerts
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {floatingCards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="text-sm text-slate-500">{card.title}</div>
                      <div className="mt-3 text-xl font-bold text-white">{card.value}</div>
                      <div className="mt-2 text-sm text-slate-400">{card.meta}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Active subscriptions</span>
                    <span>Next 7 days</span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {[
                      { name: "Netflix", date: "Apr 07", accent: "from-brand-500 to-violet-500" },
                      { name: "Prime Video", date: "Apr 10", accent: "from-emerald-500 to-cyan-400" },
                      { name: "Notion AI", date: "Apr 13", accent: "from-amber-500 to-orange-400" },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${item.accent}`} />
                          <div>
                            <div className="font-medium text-white">{item.name}</div>
                            <div className="text-sm text-slate-500">Reminder armed</div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-300">{item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Features</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Designed for people who are tired of hidden recurring costs.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -6 }}
              className="glass-panel rounded-3xl p-6"
            >
              <div className="inline-flex rounded-2xl bg-brand-500/15 p-3 text-brand-200">
                <feature.icon size={22} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="glass-panel rounded-[32px] border border-white/10 p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Pricing</p>
          <h2 className="mt-4 text-4xl font-bold text-white">Start free. Stay in control.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Perfect for personal use, side projects, and finance-conscious teams that need visibility without clutter.
          </p>
          <div className="mt-10 inline-flex rounded-3xl border border-brand-400/20 bg-brand-500/10 px-8 py-6">
            <div>
              <div className="text-sm text-brand-200">Core plan</div>
              <div className="mt-2 text-5xl font-extrabold text-white">₹0</div>
              <div className="mt-2 text-sm text-slate-400">Track subscriptions, get reminders, and manage renewals.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
