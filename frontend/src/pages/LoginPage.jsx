import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    setError("");
    try {
      await login(values);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign you in.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-16">
      <div className="glass-panel w-full max-w-md rounded-[32px] p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Welcome back</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Sign in to your workspace</h1>
        <p className="mt-3 text-sm text-slate-400">
          Manage reminders, control renewals, and keep subscription spend visible.
        </p>

        <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]">
          <Chrome size={18} />
          Sign in with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
          {error ? <div className="text-sm text-rose-400">{error}</div> : null}
          <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{" "}
          <Link to="/register" className="font-medium text-brand-300 hover:text-brand-200">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
