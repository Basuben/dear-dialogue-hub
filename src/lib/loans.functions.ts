import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { callLovableAI } from "./ai-gateway.server";

export const LoanApplicationInput = z.object({
  fullName: z.string().min(2).max(80),
  memberId: z.string().min(2).max(40),
  age: z.number().int().min(18).max(80),
  employmentStatus: z.enum(["employed", "self-employed", "business-owner", "farmer", "retired"]),
  monthsAtJob: z.number().int().min(0).max(600),
  monthlyIncomeKES: z.number().min(0).max(10_000_000),
  monthlyExpensesKES: z.number().min(0).max(10_000_000),
  existingDebtKES: z.number().min(0).max(50_000_000),
  savingsBalanceKES: z.number().min(0).max(50_000_000),
  monthsAsMember: z.number().int().min(0).max(600),
  previousLoansRepaid: z.number().int().min(0).max(50),
  previousDefaults: z.number().int().min(0).max(50),
  loanAmountKES: z.number().min(1000).max(20_000_000),
  loanTermMonths: z.number().int().min(1).max(120),
  loanPurpose: z.enum(["business", "education", "agriculture", "emergency", "home-improvement", "asset-purchase", "personal"]),
  collateralValueKES: z.number().min(0).max(100_000_000),
  guarantors: z.number().int().min(0).max(10),
});

export type LoanApplicationInput = z.infer<typeof LoanApplicationInput>;

export const LoanDecision = z.object({
  decision: z.enum(["approve", "review", "reject"]),
  riskLevel: z.enum(["low", "medium", "high"]),
  creditScore: z.number().min(0).max(100),
  approvedAmountKES: z.number().min(0),
  recommendedTermMonths: z.number().int().min(1).max(120),
  interestRatePct: z.number().min(0).max(60),
  estimatedMonthlyPaymentKES: z.number().min(0),
  debtToIncomeRatio: z.number().min(0).max(10),
  rationale: z.string().min(10),
  positiveFactors: z.array(z.string()).max(8),
  riskFactors: z.array(z.string()).max(8),
  recommendations: z.array(z.string()).max(8),
});
export type LoanDecision = z.infer<typeof LoanDecision>;

const SYSTEM_PROMPT = `You are the AI credit underwriter for Ujima SACCO, a Kenyan savings & credit cooperative.
Evaluate the applicant against SACCO best practices and return a strict JSON object — no prose, no markdown.

Schema:
{
  "decision": "approve" | "review" | "reject",
  "riskLevel": "low" | "medium" | "high",
  "creditScore": number 0-100,
  "approvedAmountKES": number,
  "recommendedTermMonths": integer 1-120,
  "interestRatePct": number (annual %, typical SACCO range 10-22),
  "estimatedMonthlyPaymentKES": number,
  "debtToIncomeRatio": number,
  "rationale": string (1-3 sentences, plain language),
  "positiveFactors": string[] (3-5 short bullets),
  "riskFactors": string[] (2-5 short bullets),
  "recommendations": string[] (2-4 actionable bullets)
}

Underwriting guidelines:
- SACCO standard: members can borrow up to 3x their savings deposit.
- Target DTI (new monthly payment + existing debt) / income ≤ 0.40.
- Defaults history is a strong negative; >0 defaults → at most "review", >1 → "reject".
- Reward long membership (>24 months) and repaid loans.
- Approve = strong fit; Review = needs officer attention; Reject = clear fail.
- Always compute estimatedMonthlyPaymentKES using simple amortization at the interestRatePct you set.`;

export const scoreLoanApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LoanApplicationInput.parse(input))
  .handler(async ({ data }) => {
    const userPrompt = `Applicant:\n${JSON.stringify(data, null, 2)}\n\nReturn JSON only.`;

    const raw = await callLovableAI({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      jsonMode: true,
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // sometimes models wrap JSON in fences
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned non-JSON output");
      parsed = JSON.parse(m[0]);
    }
    const decision = LoanDecision.parse(parsed);
    return decision;
  });
