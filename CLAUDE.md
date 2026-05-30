# CLAUDE.md — Visual UI Loop (run → screenshot → audit → fix)

Standing instructions for Claude Code running in the VS Code extension. Whenever
you create or change any UI (React/Vue/HTML/CSS/etc.), do not stop at "the code
looks right." **First finish all the planned code changes. Then — once and only
once everything is implemented — render it in a real browser, screenshot it,
audit it, and fix what's wrong.** This is a verification pass after the work, not
a check after every keystroke.

You can see your own output. Use that.

> **Don't screenshot mid-implementation, and don't loop forever.** Capture and
> audit only after all changes for the task are complete, and stop after at most
> **3 fix passes** (see "Stop conditions").

---

## One-time setup (do this if it isn't already done)

This loop depends on a browser-automation MCP server so you can drive a real
browser and capture screenshots. **Playwright MCP** is the default.

1. **Claude Code in VS Code** — install the Claude Code extension and open the
   project folder. Run Claude from the integrated terminal so it shares the
   workspace.

2. **Add Playwright MCP** (project-scoped, persists for this folder):

   ```bash
   claude mcp add playwright -- npx @playwright/mcp@latest
   ```

3. **Verify** — start a Claude session and run `/mcp`. You should see `playwright`
   listed with tools like `browser_navigate`, `browser_take_screenshot`,
   `browser_snapshot`, `browser_click`, and `browser_resize`.

> First time in a session, say "use playwright mcp" explicitly so Claude routes
> browser actions through the MCP server instead of trying to shell out via bash.

Alternatives that work the same way: **Chrome DevTools MCP** or **Puppeteer MCP**.
Swap the server name above if the project standardizes on one of those.

---

## Step 0 — Detect the stack first (don't assume)

Before running anything, inspect the project and decide which framework, package
manager, dev command, and port apply. Never hardcode `npm run dev` — figure out
what this repo actually uses, then act accordingly.

**a. Package manager** — pick based on the lockfile present:
- `pnpm-lock.yaml` → `pnpm`
- `yarn.lock` → `yarn`
- `bun.lockb` → `bun`
- `package-lock.json` (or none of the above) → `npm`

**b. Framework / build tool** — read `package.json` `dependencies` + `scripts`,
and look for config files:

| Signal | Stack | Typical dev command | Default URL |
|---|---|---|---|
| `next` dep / `next.config.*` | Next.js | `<pm> run dev` | `http://localhost:3000` |
| `vite` dep / `vite.config.*` | Vite (React/Vue/Svelte) | `<pm> run dev` | `http://localhost:5173` |
| `react-scripts` dep | CRA | `<pm> start` | `http://localhost:3000` |
| `@angular/cli` / `angular.json` | Angular | `<pm> start` (`ng serve`) | `http://localhost:4200` |
| `nuxt` dep / `nuxt.config.*` | Nuxt | `<pm> run dev` | `http://localhost:3000` |
| `@sveltejs/kit` / `svelte.config.*` | SvelteKit | `<pm> run dev` | `http://localhost:5173` |
| `astro` dep / `astro.config.*` | Astro | `<pm> run dev` | `http://localhost:4321` |
| `vue` + `@vue/cli-service` | Vue CLI | `<pm> run serve` | `http://localhost:8080` |
| `remix` dep | Remix | `<pm> run dev` | `http://localhost:3000` |
| `expo` dep | Expo (web) | `<pm> run web` | `http://localhost:8081` |
| static `.html` files, no build tool | Plain HTML/CSS/JS | `npx serve .` or `python3 -m http.server` | `http://localhost:3000` / `:8000` |

**c. Always defer to the repo's own `scripts`.** If `package.json` defines a
`dev`, `start`, or `serve` script, run that exact script rather than a guessed
command. Read what the script does to learn the real port (check for `--port`,
`PORT=`, or framework config).

**d. Confirm the port.** After starting, read the dev server's own startup output
for the URL it printed instead of assuming — frameworks shift ports when one is
busy (e.g. 3000 → 3001).

**e. No web stack?** If it's a non-web UI (e.g. a native or terminal app), this
browser-screenshot loop doesn't apply — say so and skip it rather than forcing it.

---

## The loop (run once, after all changes for the task are done)

1. **Finish implementing first.** Make every code change the task requires —
   all components, styles, and states. Do **not** open a browser or screenshot
   while you're still mid-implementation. The visual pass begins only when you'd
   otherwise consider the task complete.

2. **Run it.** Using the stack detected in Step 0, start the dev server if it
   isn't already up (run the repo's own `dev`/`start`/`serve` script with the
   right package manager). Capture the URL it prints and keep it running in the
   background.

3. **Navigate.** Use Playwright MCP to open the exact route(s) you changed
   (`browser_navigate` to the localhost URL + path). Don't guess from memory —
   load the real page.

4. **Screenshot + capture state.**
   - `browser_take_screenshot` for the rendered view.
   - Capture **desktop and mobile** widths via `browser_resize`
     (e.g. 1440px and 375px), screenshotting each.
   - Read the **console** for errors/warnings and the DOM snapshot for structure.

5. **Audit the screenshot** against the checklist below. Write one concrete list
   of every defect you can see — not "looks fine." Be specific: "submit button
   overflows the card on mobile", "heading and body have no vertical spacing",
   "contrast on the muted label is too low."

6. **Batch-fix.** Address all the real defects from the audit in one round of
   edits — not one tiny change per screenshot. Make real edits; don't just
   describe them.

7. **Re-verify once.** Reload, screenshot again, and confirm the issues are
   resolved and nothing regressed. Only re-fix if something is **clearly still
   broken**, and treat each re-fix as one pass against the cap below.

8. **Report.** End with a brief before/after note: what was broken, what you
   changed, and a final screenshot.

### Stop conditions (so it never gets stuck in a loop)

Stop the visual pass and report as soon as **any** of these is true:
- No visible defects remain and the console is clean. ✅
- You've completed **3 fix passes** — stop and list any remaining minor issues
  as notes for the user instead of looping again.
- The last pass made **no meaningful visual improvement**, or you're toggling the
  same property back and forth — stop and surface it as a judgment call.
- An issue is **subjective/ambiguous** (spacing taste, exact color, copy) rather
  than a clear bug — leave it as a suggestion and ask, don't keep iterating.

> If a design reference (Figma export, mockup image, screenshot) is provided,
> compare against it during the single audit and close the gaps in one batch —
> still bounded by the same 3-pass cap.

---

## Audit checklist (what to look for in the screenshot)

**Layout & spacing**
- Overflow, clipping, or horizontal scrollbars at any breakpoint
- Misaligned elements, inconsistent gaps, cramped or floating content
- Elements overlapping or stacking incorrectly

**Responsive**
- Mobile (≈375px), tablet (≈768px), desktop (≈1440px) all hold together
- Nav, modals, and grids reflow instead of breaking
- No fixed widths forcing overflow on small screens

**Typography**
- Readable sizes; clear hierarchy between headings and body
- No truncated or wrapped-awkwardly text; consistent line-height

**Color & contrast**
- Text meets contrast guidance (aim for WCAG AA)
- Consistent palette; states (hover/active/disabled/error) are visible

**Interactive states**
- Buttons/links/inputs have visible hover, focus, and disabled states
- Focus rings present for keyboard users
- Forms show validation/error states clearly

**Correctness**
- Console is free of errors and warnings
- Images load; no broken assets or empty containers
- Content matches intent (no lorem ipsum left behind)

---

## Rules of thumb

- **Detect the stack before acting.** Read the lockfile, `package.json`, and
  config files first; run the repo's own scripts with the right package manager.
  Never assume the framework, command, or port.
- **Always verify visually before claiming done.** "The code compiles" is not
  "the UI is correct."
- **Prefer the MCP browser over assumptions.** Inspect the real DOM and the real
  pixels.
- **Audit after, not during.** Finish all the task's changes first, then run the
  visual pass once — don't screenshot after every small edit.
- **Batch the fixes, and cap the loop.** Fix everything the audit found in one
  round, re-verify once, and stop after at most 3 passes. List leftover minor or
  subjective issues as notes instead of cycling on them.
- **Keep the dev server running** across the loop so reloads are fast.
- **Check more than one viewport.** Most UI bugs hide at the breakpoints.
- **Leave the console clean.** Treat warnings as defects to investigate.

---

## Quick trigger phrases

- "Build the X component, then run it, screenshot it, and fix anything that looks off."
- "Use playwright mcp to open localhost:3000, screenshot desktop and mobile, audit, and rectify."
- "Compare the page to `design.png`, list the differences, fix the top 3, repeat until close."
