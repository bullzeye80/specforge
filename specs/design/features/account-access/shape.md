---
version: "2"
feature: "account-access"
appetite: "small"
problem: "Sign-up is the last thing between a decided visitor and First Strike, and it runs against the seven-minute clock. Every field or step here is friction that pushes the clock over budget and hands the user back to the incumbent habit (prompting Claude directly, which is free and instant). Auth must be strong, but building it in-house is the wrong bet for a solo founder's product."
intended-outcome: "A founder creates an account — or returns — with the lightest possible credentials (email / magic-link), no card and no sales gate, and lands directly on the single onboarding step. Returning users open a session and go straight to the dashboard."
target-stage: "select"
target-milestone: "sign-up"
no-gos:
  - "In-house password auth as the only option — outsource strong-auth (Auth0/Clerk/Supabase Auth), per anti-patterns"
  - "Card capture, or company / role / use-case fields at sign-up — the Straight-Line collects only what's required to reach First Strike"
  - "Email verification that blocks product access, unless a real security/compliance reason is written down"
  - "Team-invite or workspace-naming steps pre-First-Strike — deferred off the line"
rabbit-holes:
  - "Rolling your own session/token handling instead of leaning on the outsourced provider — auth is not where this product earns its keep"
  - "Social-login sprawl (many providers) before one magic-link path is solid"
  - "Deferred-profile creep — 'just one field' leaking back into sign-up and re-inflating the step we deliberately kept thin"
---

## Solution sketch

Two utility surfaces — Sign up (`/signup`) and Sign in (`/signin`) — both backed by
an **outsourced strong-auth provider**, with **magic-link as the primary path** and
email as the credential. No password-only in-house auth, no card, no company / role
/ use-case fields: sign-up captures exactly what's needed to create
`object:identity.user` and reach First Strike, and nothing else.

The routing is the load-bearing decision. Sign-up **redirects straight to
`/start`** (the single onboarding step in `idea-intake`) on success — there is no
profile form, no workspace naming, no plan selection between account creation and
the fuzzy-idea step. Sign-in returns the user to the dashboard hub. This keeps the
Straight-Line to one on-line step after auth and protects the seven-minute clock
that the whole freemium bet depends on.

The account is single-role at v1 (a solo founder shaping their own products), but
the model is **RBAC-ready** rather than assuming an implicit owner — so that adding
roles later is additive, not a rewrite. Any richer identity concern (2FA on
destructive actions, org roles) is out of scope here and, where it belongs, is
handled in `account-settings`.

The point of this feature is restraint: it is deliberately thin because its whole
value is *not* getting in the way. The strongest version of this pitch is the one
that adds the fewest steps between the CTA and the aha.

## Open questions

1. **Magic-link vs. also offering one social provider.** Magic-link is the v1
   primary; whether to add a single OAuth provider (e.g. Google) as a convenience is
   a small decision owed to the owner — it must not become provider sprawl.
2. **Provider choice.** Which outsourced auth service (Auth0 / Clerk / Supabase
   Auth) is an implementation decision for the build phase, not this shape.
