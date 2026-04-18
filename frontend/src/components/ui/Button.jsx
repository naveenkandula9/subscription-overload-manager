export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-brand-500 to-violet-500 text-white shadow-glow hover:scale-[1.02]",
    secondary:
      "border border-white/10 bg-white/5 text-slate-100 hover:border-brand-400/40 hover:bg-white/10",
    ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
    danger: "bg-rose-500/90 text-white hover:bg-rose-500",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

