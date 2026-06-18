import { Link } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/apply", label: "Apply" },
  { to: "/dashboard", label: "Officer Dashboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/house", label: "3D House" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-gradient text-primary-foreground shadow-elevated">
              <Landmark className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
                Ujima SACCO
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                AI Loan Desk
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/apply"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elevated transition-opacity hover:opacity-95 md:inline-flex"
          >
            New application
          </Link>
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto max-w-7xl px-6 text-xs text-muted-foreground">
          Ujima SACCO · AI Loan Approval System (capstone demo). All applicant data stays in your browser.
        </div>
      </footer>
    </div>
  );
}
