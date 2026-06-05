import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { scoreLoanApplication, type LoanApplicationInput } from "@/lib/loans.functions";
import { applicationsStore, formatKES } from "@/lib/store";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a loan — Ujima SACCO" },
      { name: "description", content: "Submit a SACCO loan application and get an instant AI-powered decision." },
    ],
  }),
  component: ApplyPage,
});

const PURPOSES: LoanApplicationInput["loanPurpose"][] = [
  "business", "education", "agriculture", "emergency", "home-improvement", "asset-purchase", "personal",
];
const EMPLOYMENT: LoanApplicationInput["employmentStatus"][] = [
  "employed", "self-employed", "business-owner", "farmer", "retired",
];

const STRONG_SAMPLE: LoanApplicationInput = {
  fullName: "Amina Wanjiku", memberId: "UJ-10428", age: 36,
  employmentStatus: "employed", monthsAtJob: 72,
  monthlyIncomeKES: 95000, monthlyExpensesKES: 38000, existingDebtKES: 8000,
  savingsBalanceKES: 220000, monthsAsMember: 48, previousLoansRepaid: 3, previousDefaults: 0,
  loanAmountKES: 420000, loanTermMonths: 36, loanPurpose: "business",
  collateralValueKES: 350000, guarantors: 2,
};
const WEAK_SAMPLE: LoanApplicationInput = {
  fullName: "Brian Otieno", memberId: "UJ-20991", age: 24,
  employmentStatus: "self-employed", monthsAtJob: 6,
  monthlyIncomeKES: 28000, monthlyExpensesKES: 21000, existingDebtKES: 14000,
  savingsBalanceKES: 12000, monthsAsMember: 5, previousLoansRepaid: 0, previousDefaults: 1,
  loanAmountKES: 350000, loanTermMonths: 24, loanPurpose: "personal",
  collateralValueKES: 20000, guarantors: 0,
};

const EMPTY: LoanApplicationInput = {
  fullName: "", memberId: "", age: 30,
  employmentStatus: "employed", monthsAtJob: 12,
  monthlyIncomeKES: 50000, monthlyExpensesKES: 20000, existingDebtKES: 0,
  savingsBalanceKES: 50000, monthsAsMember: 12, previousLoansRepaid: 0, previousDefaults: 0,
  loanAmountKES: 100000, loanTermMonths: 24, loanPurpose: "business",
  collateralValueKES: 0, guarantors: 1,
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground/80">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ApplyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoanApplicationInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const score = useServerFn(scoreLoanApplication);

  const set = <K extends keyof LoanApplicationInput>(k: K, v: LoanApplicationInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const num = (k: keyof LoanApplicationInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    set(k, Number(e.target.value) as never);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.memberId.trim()) {
      toast.error("Please enter the applicant's name and member ID.");
      return;
    }
    setSubmitting(true);
    try {
      const decision = await score({ data: form });
      const id = `A-${Math.floor(1000 + Math.random() * 9000)}`;
      applicationsStore.add({
        id,
        submittedAt: new Date().toISOString(),
        application: form,
        decision,
      });
      toast.success(`Decision: ${decision.decision.toUpperCase()} — score ${decision.creditScore}`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not score this application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <Toaster richColors position="top-right" />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Member Application</p>
            <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Submit a loan request</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Your application is evaluated by Ujima's AI underwriter and queued for an officer's review.
              All figures are in Kenyan Shillings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setForm(STRONG_SAMPLE)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              <Wand2 className="h-3.5 w-3.5" /> Pre-fill: strong profile
            </button>
            <button
              type="button"
              onClick={() => setForm(WEAK_SAMPLE)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              <Wand2 className="h-3.5 w-3.5" /> Pre-fill: risky profile
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Applicant details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Field label="Full name">
                <input className={inputCls} value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)} required />
              </Field>
              <Field label="Member ID">
                <input className={inputCls} value={form.memberId}
                  onChange={(e) => set("memberId", e.target.value)} required />
              </Field>
              <Field label="Age">
                <input type="number" min={18} max={80} className={inputCls}
                  value={form.age} onChange={num("age")} />
              </Field>
              <Field label="Employment status">
                <select className={inputCls} value={form.employmentStatus}
                  onChange={(e) => set("employmentStatus", e.target.value as LoanApplicationInput["employmentStatus"])}>
                  {EMPLOYMENT.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Months at current job/business">
                <input type="number" min={0} className={inputCls} value={form.monthsAtJob} onChange={num("monthsAtJob")} />
              </Field>
              <Field label="Months as SACCO member">
                <input type="number" min={0} className={inputCls} value={form.monthsAsMember} onChange={num("monthsAsMember")} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Finances</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Field label="Monthly income (KES)" hint={formatKES(form.monthlyIncomeKES)}>
                <input type="number" min={0} className={inputCls} value={form.monthlyIncomeKES} onChange={num("monthlyIncomeKES")} />
              </Field>
              <Field label="Monthly expenses (KES)" hint={formatKES(form.monthlyExpensesKES)}>
                <input type="number" min={0} className={inputCls} value={form.monthlyExpensesKES} onChange={num("monthlyExpensesKES")} />
              </Field>
              <Field label="Existing monthly debt (KES)" hint={formatKES(form.existingDebtKES)}>
                <input type="number" min={0} className={inputCls} value={form.existingDebtKES} onChange={num("existingDebtKES")} />
              </Field>
              <Field label="Savings balance with SACCO (KES)" hint={formatKES(form.savingsBalanceKES)}>
                <input type="number" min={0} className={inputCls} value={form.savingsBalanceKES} onChange={num("savingsBalanceKES")} />
              </Field>
              <Field label="Previous loans repaid">
                <input type="number" min={0} className={inputCls} value={form.previousLoansRepaid} onChange={num("previousLoansRepaid")} />
              </Field>
              <Field label="Previous defaults">
                <input type="number" min={0} className={inputCls} value={form.previousDefaults} onChange={num("previousDefaults")} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Loan request</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Field label="Requested amount (KES)" hint={formatKES(form.loanAmountKES)}>
                <input type="number" min={1000} className={inputCls} value={form.loanAmountKES} onChange={num("loanAmountKES")} />
              </Field>
              <Field label="Term (months)">
                <input type="number" min={1} max={120} className={inputCls} value={form.loanTermMonths} onChange={num("loanTermMonths")} />
              </Field>
              <Field label="Purpose">
                <select className={inputCls} value={form.loanPurpose}
                  onChange={(e) => set("loanPurpose", e.target.value as LoanApplicationInput["loanPurpose"])}>
                  {PURPOSES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Collateral value (KES)" hint={formatKES(form.collateralValueKES)}>
                <input type="number" min={0} className={inputCls} value={form.collateralValueKES} onChange={num("collateralValueKES")} />
              </Field>
              <Field label="Guarantors">
                <input type="number" min={0} max={10} className={inputCls} value={form.guarantors} onChange={num("guarantors")} />
              </Field>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-accent/40 p-5">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-gold" />
              The AI underwriter typically responds in under 10 seconds.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {submitting ? "Scoring with AI…" : "Submit for AI decision"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
