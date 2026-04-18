import { Github, Linkedin, Twitter } from "lucide-react";

const columns = {
  Product: ["Dashboard", "Reminders", "Analytics"],
  Resources: ["Documentation", "API Reference", "Support"],
  Company: ["About", "Security", "Careers"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div>
          <h3 className="text-lg font-semibold text-white">Subscription Overload Manager</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            Track recurring costs, surface renewal risk, and keep subscription chaos under control.
          </p>
          <div className="mt-6 flex items-center gap-3 text-slate-400">
            <span className="rounded-full border border-white/10 p-2 hover:text-white">
              <Twitter size={16} />
            </span>
            <span className="rounded-full border border-white/10 p-2 hover:text-white">
              <Github size={16} />
            </span>
            <span className="rounded-full border border-white/10 p-2 hover:text-white">
              <Linkedin size={16} />
            </span>
          </div>
        </div>
        {Object.entries(columns).map(([title, items]) => (
          <div key={title}>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {items.map((item) => (
                <li key={item} className="transition hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Subscription Overload Manager. All rights reserved.
      </div>
    </footer>
  );
}
