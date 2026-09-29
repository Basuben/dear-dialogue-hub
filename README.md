# dear-dialogue-hub

Source code for the Ujima SACCO AI Loan Approval capstone. The public write-up is in [ujima-sacco-ai-pride](https://github.com/Basuben/ujima-sacco-ai-pride).

## Run it locally

The project was set up with Bun (`bun.lock` is committed), so Bun is the safest choice.

```bash
bun install
LOVABLE_API_KEY=your_key_here bun run dev
```

`LOVABLE_API_KEY` is read on the server only, in `src/lib/ai-gateway.server.ts`. Without it, submitting an application fails with a clear error. Never commit the key.

Other scripts:

```bash
bun run build     # production build
bun run preview   # serve the build locally
bun run lint      # eslint
bun run format    # prettier
```

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page for the demo |
| `/apply` | Loan application form with two pre-filled sample applicants |
| `/dashboard` | Officer queue: filter by decision, read the AI rationale, override the decision |
| `/analytics` | Approval rate, risk distribution and amounts approved by purpose |
| `/house` | A separate 3D house specification viewer, unrelated to lending |

## Where things live

- `src/lib/loans.functions.ts`: the input and output schemas (Zod), the underwriting prompt, and the server function that scores an application.
- `src/lib/ai-gateway.server.ts`: the server-only call to the Lovable AI Gateway.
- `src/lib/store.ts`: browser storage for applications and officer overrides.
- `src/routes/`: one file per page.
- `src/components/`: shared layout and UI components.

## Things to know

- Applications are kept in `localStorage`, so they stay in one browser and disappear if the site data is cleared.
- The underwriting policy (3x savings limit, debt-to-income ceiling, default rules) lives in the prompt. It is not enforced by code yet.
- The figures on the landing page are illustrative, not measured.
- Age is currently passed to the model as an input. See the limitations section of the public README before using this for anything real.
