---
name: Workspace link refresh
description: Local workspace package links may require a normal pnpm install after manifest or lockfile-only changes.
---

When adding a new workspace dependency, a lockfile-only refresh can update `pnpm-lock.yaml` without creating the local `node_modules` symlink. Run the normal workspace install before invoking scripts with `tsx`.

**Why:** The importer could not resolve an existing local package until the regular install materialized the workspace link.

**How to apply:** After changing a workspace package dependency, run `pnpm install` before typechecking or executing that package.