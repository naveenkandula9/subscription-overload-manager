import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be 50 characters or fewer."),
  email: z.string().email("Enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleRegisterSubmit = async (values) => {
    setError("");
    console.log("Register form submitted", {
      name: values.name,
      email: values.email,
      hasPassword: Boolean(values.password),
    });

    try {
      const response = await registerUser(values);
      console.log("Register form success", response);
      navigate("/dashboard");
    } catch (requestError) {
      console.error("Register form error", {
        message: requestError.message,
        status: requestError.response?.status,
        data: requestError.response?.data,
      });
      setError(requestError.response?.data?.message || "Unable to create your account.");
    }
  };

  const handleRegisterInvalid = (formErrors) => {
    console.warn("Register form validation failed", formErrors);
    setError("Please fix the highlighted fields and try again.");
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-16">
      <div className="glass-panel w-full max-w-md rounded-[32px] p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Get started</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-3 text-sm text-slate-400">
          Build a calmer relationship with recurring spend in under a minute.
        </p>

        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
        >
          <Chrome size={18} />
          Sign up with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form className="space-y-4" noValidate onSubmit={handleSubmit(handleRegisterSubmit, handleRegisterInvalid)}>
          <Input label="Name" placeholder="Your full name" error={errors.name?.message} {...register("name")} />
          <Input label="Email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input
            label="Password"
            type="password"
            placeholder="Choose a strong password"
            error={errors.password?.message}
            {...register("password")}
          />
          {error ? <div className="text-sm text-rose-400">{error}</div> : null}
          <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
