import { useEffect, useMemo, useState } from "react";
import { BellPlus, CreditCard, IndianRupee, RefreshCcw, WalletCards } from "lucide-react";
import SummaryCard from "../components/dashboard/SummaryCard";
import SubscriptionTable from "../components/dashboard/SubscriptionTable";
import UpcomingRemindersPanel from "../components/dashboard/UpcomingRemindersPanel";
import AnalyticsPanel from "../components/dashboard/AnalyticsPanel";
import SubscriptionFormModal from "../components/dashboard/SubscriptionFormModal";
import Button from "../components/ui/Button";
import { fetchDashboardSummary } from "../services/dashboardService";
import {
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  updateSubscription,
} from "../services/subscriptionService";
import { useAuth } from "../hooks/useAuth";
import { demoDashboard, demoSubscriptions } from "../utils/demoData";
import { formatCurrency } from "../utils/formatters";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryResponse, subscriptionsResponse] = await Promise.all([
        fetchDashboardSummary(),
        fetchSubscriptions(),
      ]);
      setSummary(summaryResponse);
      setSubscriptions(subscriptionsResponse);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const previewMode = !loading && subscriptions.length === 0;
  const displaySummary = useMemo(() => summary || demoDashboard, [summary]);
  const displaySubscriptions = useMemo(
    () => (previewMode ? demoSubscriptions : subscriptions),
    [previewMode, subscriptions]
  );
  const displayReminders = useMemo(
    () => (previewMode ? demoDashboard.reminders : summary?.reminders || []),
    [previewMode, summary]
  );

  const openCreateModal = () => {
    setEditingSubscription(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    setIsSaving(true);
    try {
      if (editingSubscription?.id?.startsWith("demo-")) {
        setIsModalOpen(false);
        return;
      }

      if (editingSubscription) {
        await updateSubscription(editingSubscription.id, values);
      } else {
        await createSubscription(values);
      }
      setIsModalOpen(false);
      setEditingSubscription(null);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save subscription.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (subscription) => {
    if (subscription.id.startsWith("demo-")) {
      return;
    }
    try {
      await deleteSubscription(subscription.id);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to cancel subscription.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || user?.email?.split("@")[0] || "there"}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Watch upcoming renewals, manage active plans, and keep recurring spend from slipping through the cracks.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="gap-2" onClick={loadDashboard}>
            <RefreshCcw size={16} />
            Refresh
          </Button>
          <Button className="gap-2" onClick={openCreateModal}>
            <BellPlus size={16} />
            Add Subscription
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {previewMode ? (
        <div className="mt-6 rounded-2xl border border-brand-400/20 bg-brand-500/10 px-4 py-3 text-sm text-brand-100">
          No real subscriptions yet. The dashboard is showing sample data so you can see the full experience before adding your first plan.
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 xl:grid-cols-4">
        <SummaryCard
          title="Total monthly spend"
          value={formatCurrency(displaySummary.metrics.totalMonthlySpend, "INR")}
          hint="Normalized across all billing cycles."
          icon={IndianRupee}
          tone="rose"
        />
        <SummaryCard
          title="Active subscriptions"
          value={displaySummary.metrics.activeSubscriptions}
          hint="Services still charging on their current cadence."
          icon={WalletCards}
          tone="emerald"
        />
        <SummaryCard
          title="Upcoming renewals"
          value={displaySummary.metrics.upcomingRenewals}
          hint="Renewals scheduled in the next seven days."
          icon={BellPlus}
          tone="amber"
        />
        <SummaryCard
          title="Yearly commitment"
          value={formatCurrency(displaySummary.metrics.totalYearlyCommitment, "INR")}
          hint="Projected annual recurring spend."
          icon={CreditCard}
          tone="indigo"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
        <SubscriptionTable
          subscriptions={displaySubscriptions}
          onEdit={openEditModal}
          onDelete={handleDelete}
          previewMode={previewMode}
        />
        <UpcomingRemindersPanel reminders={displayReminders} />
      </div>

      <div className="mt-6">
        <AnalyticsPanel summary={displaySummary} subscriptions={displaySubscriptions} />
      </div>

      <SubscriptionFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubscription(null);
        }}
        onSubmit={handleSave}
        initialValues={editingSubscription}
        isSaving={isSaving}
      />
    </div>
  );
}
