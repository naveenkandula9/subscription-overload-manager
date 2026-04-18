import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { BellRing, ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow">
            <BellRing size={20} />
          </div>
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.24em] text-brand-300">
              SOM
            </div>
            <div className="text-sm font-semibold text-white">Subscription Overload Manager</div>
          </div>
        </Link>

        {!isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm text-slate-300 transition hover:text-white">
                Features
              </a>
              <a href="#pricing" className="text-sm text-slate-300 transition hover:text-white">
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <NavLink to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                Login
              </NavLink>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <NavLink
              to="/dashboard"
              className="hidden text-sm font-medium text-slate-300 transition hover:text-white md:block"
            >
              Dashboard
            </NavLink>
            <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{user?.name || user?.email}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
            <div className="md:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-semibold text-white">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
