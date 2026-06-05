import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown, CircleAlert, CircleCheck, CircleX, FileText, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { applicationsStore, formatKES, useApplications, type StoredApplication } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Officer dashboard — Ujima SACCO" },
      { name: "description", content: "Review and decide on AI-scored loan applications." },
    ],
  }),
  component: Dashboard,
});

type Filter = "all" | "approve" | "review" | "reject";

const DECISION_META: Record<
  "approve" | "review" | "reject",
  { label: string; icon: typeof CircleCheck; cls: string; chip: string }
> = {
  approve: { label: "Approve", icon: CircleCheck, cls: "text-success", chip: "bg-success/15 text-success" },
  review: { label: "Review", icon: CircleAlert, cls: "text-warning-foreground", chip: "bg-warning/25 text-warning-foreground" },
  reject: { label: "Reject", icon: CircleX, cls: "text-destructive", chip: "bg-destructive/15 text-destructive" },
};

function Dashboard() {
  const apps = useApplications();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? apps : apps.filter((a) => (a.officerOverride ?? a.decision.decision) === filter)),
    [apps, filter],
  );

  const counts = useMemo(() => {
    const c = { all: apps.length, approve: 0, review: 0, reject: 0 };
    apps.forEach((a) => {
      const d = a.officerOverride ?? a.decision.decision;
      c[d]++;
    });
    return c;
  }, [apps]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Loan officer</p>
            <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Application queue</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-scored applications awaiting your confirmation. Override decisions when your judgment differs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {apps.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Clear all demo applications?")) applicationsStore.clear();
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear queue
              </button>
            )}
            <Link
              to="/apply"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elevated hover:opacity-95"
            >
              New application
            </Link>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-1.5 rounded-lg border border-border bg-card p-1">
          {(["all", "approve", "review", "reject"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {f === "all" ? "All" : DECISION_META[f].label}
              <span className="ml-1.5 text-[10px] opacity-75">{counts[f]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Requested</th>
                  <th className="px-4 py-3">Approved</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Decision</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const dec = a.officerOverride ?? a.decision.decision;
                  const meta = DECISION_META[dec];
                  const Icon = meta.icon;
                  const open = expanded === a.id;
                  return (
                    <>
                      <tr key={a.id} className="border-t border-border transition-colors hover:bg-accent/40">
                        <td className="px-4 py-3">
                          <div className="font-medium">{a.application.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            {a.id} · {a.application.memberId} · {a.application.loanPurpose}
                          </div>
                        </td>
                        <td className="px-4 py-3 tabular-nums">{formatKES(a.application.loanAmountKES)}</td>
                        <td className="px-4 py-3 tabular-nums">{formatKES(a.decision.approvedAmountKES)}</td>
                        <td className="px-4 py-3">
                          <span className="font-display text-base font-semibold">{a.decision.creditScore}</span>
                          <span className="text-xs text-muted-foreground"> /100</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs capitalize text-muted-foreground">{a.decision.riskLevel}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.chip}`}>
                            <Icon className="h-3.5 w-3.5" /> {meta.label}
                            {a.officerOverride && <span className="ml-1 text-[10px] uppercase tracking-wider opacity-70">override</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setExpanded(open ? null : a.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent"
                          >
                            {open ? "Hide" : "Details"} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                          </button>
                        </td>
                      </tr>
                      {open && (
                        <tr key={`${a.id}-d`} className="border-t border-border bg-muted/30">
                          <td colSpan={7} className="px-6 py-6">
                            <DetailPanel app={a} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
        <FileText className="h-5 w-5" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold">No applications yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">Submit one from the application form to see it scored here.</p>
      <Link
        to="/apply"
        className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elevated hover:opacity-95"
      >
        Open application form
      </Link>
    </div>
  );
}

function DetailPanel({ app }: { app: StoredApplication }) {
  const d = app.decision;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h3 className="font-display text-base font-semibold">AI rationale</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{d.rationale}</p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <FactorList title="Positive factors" items={d.positiveFactors} tone="success" />
          <FactorList title="Risk factors" items={d.riskFactors} tone="warning" />
        </div>
        {d.recommendations.length > 0 && (
          <div className="mt-5">
            <FactorList title="Recommendations" items={d.recommendations} tone="muted" />
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Terms</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Approved</dt>
            <dd className="text-right font-medium tabular-nums">{formatKES(d.approvedAmountKES)}</dd>
            <dt className="text-muted-foreground">Term</dt>
            <dd className="text-right font-medium">{d.recommendedTermMonths} months</dd>
            <dt className="text-muted-foreground">Interest</dt>
            <dd className="text-right font-medium">{d.interestRatePct.toFixed(1)}% p.a.</dd>
            <dt className="text-muted-foreground">Monthly</dt>
            <dd className="text-right font-medium tabular-nums">{formatKES(d.estimatedMonthlyPaymentKES)}</dd>
            <dt className="text-muted-foreground">DTI</dt>
            <dd className="text-right font-medium">{(d.debtToIncomeRatio * 100).toFixed(1)}%</dd>
          </dl>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Officer override</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["approve", "review", "reject"] as const).map((d2) => {
              const active = (app.officerOverride ?? app.decision.decision) === d2;
              const meta = DECISION_META[d2];
              return (
                <button
                  key={d2}
                  onClick={() => applicationsStore.override(app.id, d2)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  {active ? <Check className="h-3.5 w-3.5" /> : <meta.icon className="h-3.5 w-3.5" />}
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

function FactorList({
  title, items, tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning" | "muted";
}) {
  const dotCls = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-secondary";
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <span className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${dotCls}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
