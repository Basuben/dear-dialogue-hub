import { useSyncExternalStore } from "react";

import type { LoanApplicationInput, LoanDecision } from "./loans.functions";

export interface StoredApplication {
  id: string;
  submittedAt: string;
  application: LoanApplicationInput;
  decision: LoanDecision;
  officerOverride?: "approve" | "review" | "reject";
}

const STORAGE_KEY = "ujima.sacco.applications.v1";
const listeners = new Set<() => void>();
let cache: StoredApplication[] | null = null;

function read(): StoredApplication[] {
  if (cache) return cache;
  if (typeof window === "undefined") return (cache = []);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as StoredApplication[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: StoredApplication[]) {
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

export const applicationsStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): StoredApplication[] {
    return read();
  },
  getServerSnapshot(): StoredApplication[] {
    return [];
  },
  add(entry: StoredApplication) {
    write([entry, ...read()]);
  },
  override(id: string, decision: "approve" | "review" | "reject") {
    write(read().map((a) => (a.id === id ? { ...a, officerOverride: decision } : a)));
  },
  clear() {
    write([]);
  },
};

export function useApplications() {
  return useSyncExternalStore(
    applicationsStore.subscribe,
    applicationsStore.getSnapshot,
    applicationsStore.getServerSnapshot,
  );
}

export function formatKES(n: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);
}
