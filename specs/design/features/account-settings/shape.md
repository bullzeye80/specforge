---
version: "2"
feature: "account-settings"
owns-screens: ["screen:settings/profile"]
appetite: "small"
problem: "Profile was deliberately deferred off the Straight-Line at onboarding, so an account surface must exist to hold it — edited when the user actually chooses to, not forced on the seven-minute clock. That same surface owes the founder a symmetric-escape delete-account path, because the product's stance is that leaving is as easy as joining. The risk is the opposite failure: a settings screen that accretes toggles with clear right answers and becomes a config dumping ground."
intended-outcome: "A founder can edit their profile — a discrete entity, edited in a modal — when they choose, and delete their account as easily as they created it, with no config bloat and no buried destructive path."
target-stage: "setup"
target-milestone: "profile"
no-gos:
  - "A settings screen padded with toggles that have a clear right answer — config must earn its screen (decision-relief)"
  - "Inline editing of the profile — a discrete entity is modal-edited; inline is reserved for long-form document content"
  - "A hidden or multi-step account-deletion path — symmetric escape means delete is as reachable as sign-up was"
  - "2FA left opt-in for destructive or admin actions where it should be required"
rabbit-holes:
  - "Preferences / config creep — every toggle must justify not being a sensible default; when in doubt, ship the default"
  - "Building org / role management before multi-role RBAC is actually needed — the account is single-role at v1"
  - "Profile fields expanding back toward the sign-up form that account-access deliberately kept thin"
---

## Solution sketch

A lean utility surface — Settings (`/settings`) — that operates on the single
`object:identity.user` entity. Its whole reason to exist is to be the home for what
`idea-intake` and `account-access` deferred: the profile lives here, edited **in a
modal** because it is a discrete entity (per the inline-vs-modal rule in
anti-patterns), only when the founder chooses to — never forced on the activation
clock.

The load-bearing decision is **symmetry on exit**: a delete-account path that is as
reachable and as few-steps as sign-up was, with a real confirmation for the
destructive action but no buried support-contact detour, no are-you-sure maze. This
is the account-level expression of the same symmetry rule that governs
`upgrade-billing`'s cancel path.

The governing discipline is **decision-relief**: this screen has *fewer* toggles,
not more. Every configuration option must justify not being a sensible default; a
choice with a clear right answer stays a default and never surfaces here. At v1 the
account is single-role, so there is no org/role management — the model stays
RBAC-ready for later without building role UI now. Plan & usage is a distinct
feature (`upgrade-billing`) reached from the user menu and from here as a link; this
surface does not absorb billing.

The strongest version of this pitch is almost empty: profile in a modal, a clean
symmetric delete, and nothing else that hasn't earned its place.

## Open questions

1. **2FA scope.** Whether 2FA is offered at all at v1, and if so whether it is
   required for account deletion, is a security decision owed to the owner — the
   anti-pattern rule is only that if a destructive/admin action needs it, it must be
   required, not opt-in.
2. **What (if anything) beyond profile lives here.** Any preference genuinely
   without a right default (e.g. notification opt-ins for behaviour-triggered email)
   would land here — but each must clear the decision-relief bar before it earns the
   screen.
