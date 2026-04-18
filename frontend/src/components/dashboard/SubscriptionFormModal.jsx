import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

const schema = z.object({
  name: z.string().min(2, "Enter a subscription name."),
  renewalDate: z.string().min(1, "Select a renewal date."),
  remindBeforeDays: z.coerce.number().min(0).max(30),
  price: z.coerce.number().min(0),
  currency: z.string().min(3).max(10),
  billingCycle: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
});

const defaults = {
  name: "",
  renewalDate: "",
  remindBeforeDays: 3,
  price: 0,
  currency: "INR",
  billingCycle: "monthly",
};

export default function SubscriptionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isSaving,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        renewalDate: initialValues.renewalDate?.slice(0, 10),
      });
    } else {
      reset(defaults);
    }
  }, [initialValues, reset]);

  const submitHandler = (values) =>
    onSubmit({
      ...values,
      renewalDate: new Date(values.renewalDate).toISOString(),
    });

  return (
    <Modal
      isOpen={isOpen}
      title={initialValues ? "Edit subscription" : "Add subscription"}
      onClose={onClose}
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(submitHandler)}>
        <div className="md:col-span-2">
          <Input label="Service name" placeholder="Netflix" error={errors.name?.message} {...register("name")} />
        </div>
        <Input
          label="Renewal date"
          type="date"
          error={errors.renewalDate?.message}
          {...register("renewalDate")}
        />
        <Input
          label="Reminder lead time (days)"
          type="number"
          min="0"
          max="30"
          error={errors.remindBeforeDays?.message}
          {...register("remindBeforeDays")}
        />
        <Input label="Price" type="number" min="0" step="0.01" error={errors.price?.message} {...register("price")} />
        <Input label="Currency" error={errors.currency?.message} {...register("currency")} />
        <label className="flex flex-col gap-2 text-sm text-slate-300 md:col-span-2">
          <span>Billing cycle</span>
          <select
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400/50 focus:ring-2 focus:ring-brand-500/40"
            {...register("billingCycle")}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : initialValues ? "Save changes" : "Create subscription"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
