import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-16">
      <div className="glass-panel max-w-lg rounded-[32px] p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">404</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-slate-400">
          The page you were looking for drifted out of your subscription stack.
        </p>
        <Link to="/" className="mt-8 inline-flex">
          <Button>Return home</Button>
        </Link>
      </div>
    </div>
  );
}

