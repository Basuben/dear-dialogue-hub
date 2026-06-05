import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppShell } from "@/components/AppShell";
import { formatKES, useApplications } from "@/lib/store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Portfolio analytics — Ujima SACCO" },
      { name: "description", content: "Approval rate, risk distribution, and disbursed amounts." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const apps = useApplications();

  const stats = useMemo(() => {
    const total = apps.length;
    const finalDecision = (a: (typeof apps)[number]) => a.officerOverride ?? a.decision.decision;
    const approved = apps.filter((a) => finalDecision(a) === "approve");
    const review = apps.filter((a) => finalDecision(a) === "review");
    const rejected = apps.filter((a) => finalDecision(a) === "reject");
    const requested = apps.reduce((s, a) => s + a.application.loanAmountKES, 0);
    const disbursed = approved.reduce((s, a) => s + a.decision.approvedAmountKES, 0);
    const avgScore = total ? apps.reduce((s, a) => s + a.decision.creditScore, 0) / total : 0;
    return { total, approved: approved.length, review: review.length, rejected: rejected.length, requested, disbursed, avgScore };
  }, [apps]);

  const decisionData = [
    { name: "Approve", value: stats.approved, fill: "var(--success)" },
    { name: "Review", value: stats.review, fill: "var(--warning)" },
    { name: "Reject", value: stats.rejected, fill: "var(--destructive)" },
  ];
  const riskData = ["low", "medium", "high"].map((r) => ({
    name: r[0].toUpperCase() + r.slice(1),
    count: apps.filter((a) => a.decision.riskLevel === r).length,
  }));
  const purposeData = Object.entries(
    apps.reduce<Record<string, number>>((acc, a) => {
      acc[a.application.loanPurpose] = (acc[a.application.loanPurpose] ?? 0) + a.decision.approvedAmountKES;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Portfolio</p>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Analytics overview</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time view of how the AI is scoring this session's applications.
          </p>
        </header>

        {apps.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <h2 className="font-display text-lg font-semibold">No data yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Submit an application to populate analytics.</p>
            <Link
              to="/apply"
              className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elevated hover:opacity-95"
            >
              Start application
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <Kpi label="Applications" value={stats.total.toString()} />
              <Kpi label="Approval rate" value={`${stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}%`} />
              <Kpi label="Disbursed" value={formatKES(stats.disbursed)} />
              <Kpi label="Avg AI score" value={stats.avgScore.toFixed(1)} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <Card title="Decision mix">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={decisionData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                      {decisionData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <Legend items={decisionData.map((d) => ({ label: `${d.name} · ${d.value}`, color: d.fill }))} />
              </Card>

              <Card title="Risk distribution">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={riskData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "color-mix(in oklab, var(--secondary) 12%, transparent)" }} />
                    <Bar dataKey="count" fill="var(--secondary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="mt-6">
              <Card title="Disbursed by purpose">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={purposeData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false}
                      tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number) => formatKES(Number(v))}
                      cursor={{ fill: "color-mix(in oklab, var(--primary) 8%, transparent)" }}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: 12,
  color: "var(--popover-foreground)",
};

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums md:text-3xl">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
