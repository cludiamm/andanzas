---
name: OpenAPI integer compatibility
description: A workspace-specific compatibility constraint between Orval's Zod output and the installed Zod runtime.
---

When adding numeric fields to the OpenAPI contract, prefer `type: number` for identifiers and counts unless the Zod generation/runtime versions are upgraded together.

**Why:** The current Orval output can emit `zod.int()` for OpenAPI `integer`, but the installed Zod runtime does not expose that helper, which breaks the shared library typecheck after codegen.

**How to apply:** Keep the API response contract numeric and validate positive path parameters with `minimum`; rerun API codegen and `pnpm run typecheck:libs` after contract changes.