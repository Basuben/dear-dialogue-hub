import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, ShieldCheck, Sparkles, Timer, TrendingUp, Users } from "lucide-react";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ujima SACCO: AI Loan Approval System" },
      { name: "description", content: "Capstone demo: AI-assisted credit underwriting for the Ujima Savings & Credit Cooperative." },
      { property: "og:title", content: "Ujima SACCO: AI Loan Approval" },
      { property: "og:description", content: "AI-assisted credit underwriting demo for a Kenyan SACCO." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <AppShell>
      <section className="relative overflow-hidden border-b border-border/70 bg-navy-gradient text-primary-foreground">
        <div className="absolute inset-0 bg-grid-faint opacity-[0.18]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Capstone Project
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-balance md:text-6xl">
              Clearer, faster loan decisions for every <span className="text-gold">SACCO member</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base text-primary-foreground/75 md:text-lg">
              Ujima SACCO uses AI to give each loan application a first-pass review: scoring risk,
              suggesting limits, and giving loan officers a clear rationale they can check.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-elevated transition-transform hover:-translate-y-0.5"
              >
                Submit a loan application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/25 bg-primary-foreground/5 px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
              >
                Open officer dashboard
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6">
              {[
                { k: "3", v: "Possible outcomes" },
                { k: "0 to 100", v: "Credit score" },
                { k: "1 click", v: "Officer override" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-3xl font-semibold text-gold">{s.k}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/65">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 shadow-elevated backdrop-blur">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-primary-foreground/65">
                <span>Sample decision preview</span>
                <span className="inline-flex items-center gap-1.5 text-primary-foreground/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50" /> Sample data
                </span>
              </div>
              <div className="mt-5 rounded-xl bg-primary-foreground/95 p-5 text-foreground">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Application #A-2418</p>
                  <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">Approve</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold">KES 420,000</h3>
                <p className="text-sm text-muted-foreground">36-month term · Business expansion</p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    { k: "Score", v: "82" },
                    { k: "DTI", v: "0.31" },
                    { k: "Risk", v: "Low" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-lg bg-muted px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
                      <p className="font-display text-lg font-semibold text-foreground">{s.v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Strong savings history (4.2× requested amount), consistent income, and 3 prior loans repaid on time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-balance md:text-4xl">
            From application to decision, with the officer always in control.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Member applies",
              body: "Members complete a guided digital form with income, savings, collateral, and loan purpose.",
            },
            {
              icon: Brain,
              title: "AI underwrites",
              body: "An AI model scores the application against SACCO policy, computing DTI, risk, and a recommended limit.",
            },
            {
              icon: ShieldCheck,
              title: "Officer confirms",
              body: "Loan officers review the rationale, override when needed, and make the final call.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elevated"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border/70 bg-accent/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-balance">
              Built around how a Kenyan SACCO lends.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              The underwriting rules follow common cooperative practice: a 3× savings ceiling, a 40%
              debt-to-income target, a check on default history, and credit for long membership and
              loans repaid on time.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                { icon: Timer, label: "Structured decisions with a plain-language rationale" },
                { icon: TrendingUp, label: "Portfolio analytics and risk distribution" },
                { icon: ShieldCheck, label: "Officer override on every application" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Try the demo</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Submit a sample application</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No accounts, no setup. Pre-fill an applicant or enter your own numbers, and the AI returns a
              full decision and rationale you can inspect in the officer dashboard.
            </p>
            <Link
              to="/apply"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated hover:opacity-95"
            >
              Open application form <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
