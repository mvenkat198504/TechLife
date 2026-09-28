---
id: aspnet-react-011
slug:  Performant, Scalable React Components from Complex UI/UX Designs
title:  Performant, Scalable React Components from Complex UI/UX Designs
categoryId: aspnet-core
subcategory:  AspNet_React
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Fast Large Lists and Tables
  - Fast Large Lists
  - Fast Large Tables
  - aspnet-core
summary: Performant, Scalable React Components from Complex UI/UX Designs
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---
# Interview Guide: Performant, Scalable React Components from Complex UI/UX Designs

## Interview question

**How would you ensure a React web app remains performant and scalable when translating complex UX/UI designs into reusable components?**

## 90-second interview answer

> I would begin by mapping the design into a component hierarchy and identifying repeated behavior, not just repeated appearance. I would define design tokens, accessible primitives, composed patterns, and feature-level components with clear APIs. Before abstracting, I would document variants, loading and error states, responsive rules, keyboard behavior, and data requirements with the designer.
>
> For performance, I would keep state close to where it is used, avoid duplicating derived state, and make data boundaries explicit. I would split code at route and heavy-feature boundaries, load bounded data from the backend, and virtualize truly large lists. I would profile real interactions before using memoization, then optimize only expensive render paths. I would test the production build on representative devices and data, measuring LCP, INP, CLS, route transition time, React commits, bundle size, and API latency.
>
> For scalability, I would document components with examples, enforce tokens and accessibility rules, add visual and interaction regression checks, and monitor performance after release. A component is reusable when its API captures stable product concepts; turning every visual difference into another boolean prop usually makes it harder to maintain.

## 1. Translate the design into a component model

A complex design handoff often includes desktop/mobile layouts, many states, charts, forms, dialogs, tables, and subtle variations. Inventory them before coding.

| Layer | Examples | Ownership |
| --- | --- | --- |
| Foundations | Typography, spacing, color, radius, motion | Shared design tokens and global base styles |
| Primitives | Button, Input, Checkbox, Icon, Surface | Small accessible building blocks |
| Composed patterns | SearchField, FormField, FilterBar, ConfirmDialog | Repeated interactions and layouts |
| Feature components | OrderSummary, ProtocolSectionEditor, ApprovalQueue | Domain behavior and data |
| Routes/pages | OrdersPage, StudyWorkspace | Orchestration, loading boundaries, navigation |

Ask which differences are meaningful. Two cards with different data but identical behavior may share a component; a card that is also an interactive selection control needs a different semantic contract. Do not build a generic `UniversalCard` with twenty optional props just because several screenshots contain rectangles.

### Example component tree

```text
StudyWorkspacePage
├── WorkspaceHeader
├── SectionNavigation
├── AuthoringPanel
│   ├── SectionToolbar
│   ├── LazyRichTextEditor
│   └── SaveStatus
└── SourcePanel
    ├── SearchField
    └── VirtualizedSourceList
```

In this example, `Button`, `TextField`, `Badge`, `Dialog`, and `EmptyState` can be shared across features; `SectionToolbar` and `SourcePanel` remain domain components. The editor and source list have different performance risks, so they should be profiled independently.

## 2. Design APIs around meaning and composition

Good component APIs expose product concepts such as `variant="danger"`, `size="small"`, and `loading`. They do not require each screen to pass colors, padding, and margins manually.

```tsx
<Dialog title="Submit for review" open={isOpen} onClose={closeDialog}>
  <p>Send this section to the reviewer?</p>
  <DialogActions>
    <Button variant="secondary" onClick={closeDialog}>Cancel</Button>
    <Button variant="primary" loading={isSubmitting} onClick={submit}>
      Submit
    </Button>
  </DialogActions>
</Dialog>
```

Composition keeps the `Dialog` focused on dialog behavior, while content varies. The component should manage focus and keyboard dismissal correctly; a styling-only shell is not a complete accessible dialog. Use TypeScript discriminated unions where variants require different props, and provide stable defaults. Keep unique feature logic outside the design-system package.

### Reuse decision checklist

1. Do instances share semantics and behavior, or only visual similarity?
2. Can the differences be expressed with a few stable variants and slots/children?
3. Would changing the shared component legitimately affect all consumers?
4. Is the dependency direction clear (shared primitives do not import feature code)?
5. Does the abstraction simplify the call sites and tests?

If the answer is mostly no, keep components separate and share smaller primitives or tokens instead.

## 3. Build a consistent design system

- Use a small set of **foundation tokens** (palette, spacing, typography) and **semantic tokens** (`color-text-muted`, `color-surface-raised`, `color-action-primary`). Semantic tokens make theme and brand changes more manageable.
- Choose a consistent CSS approach: for example, CSS Modules for locally scoped component styles, shared tokens as CSS custom properties, and a small global reset. A team with an existing utility framework can use it consistently instead.
- Specify responsive behavior as part of each component's contract. A card used in a sidebar and a full-width panel may need container-based rules rather than only viewport breakpoints.
- Document all states: default, hover, focus, disabled, selected, loading, empty, error, success, and long/translated text.
- Apply reduced-motion preferences and test contrast, zoom, touch, keyboard and screen readers. Accessibility is part of reusable behavior.

A visual catalog or Storybook-style component gallery should show representative states. Designers and developers can review the same contract before pages multiply.

## 4. Structure state to limit rerenders

State placement affects performance and maintainability more than adding `memo` everywhere.

| State | Place it near | Reason |
| --- | --- | --- |
| Dialog open/close | The trigger or small feature boundary | Avoid unrelated page rerenders |
| Current cell edit | Row/cell editor, with committed value in parent/data layer | Keep typing responsive |
| Filter query | Filter panel or page data controller | Drives URL/query and server request |
| Server data | Query/cache layer | Deduplication, invalidation, loading/error state |
| Auth/theme | App-level provider, with narrow consumers | Truly shared concerns |

Do not store values that can be cheaply derived from existing props/state. Avoid syncing the same value between several hooks with effects. If a large context provider changes on every keystroke, split it or use narrower subscriptions. Pass stable IDs through lists; avoid using array indexes for reorderable items.

For a data-heavy screen, separate **input state** from **committed search criteria** when debouncing. The text field should update immediately, while the request can wait briefly; cancel obsolete requests and make loading state clear. React transitions can make nonurgent rendering interruptible, but they do not make a slow database query faster.

## 5. Control rendering work

1. **Profile first.** Use React DevTools Profiler to identify expensive commits and unexpected child rerenders in a production-like build.
2. **Reduce DOM volume.** Paginate or virtualize large lists/grids. Virtualization renders a visible window, but does not justify fetching all records into the browser.
3. **Optimize expensive children selectively.** Use `memo` for rows or charts that rerender unnecessarily, and `useMemo` for truly expensive calculations. Stable props matter; newly created objects/functions can defeat memoization. React Compiler behavior and build setup may affect how much manual memoization is needed, so measure the shipped app.
4. **Keep render pure.** Do not perform network calls or large transformations in render. Preprocess heavy data, move work to the server, or use a worker for CPU-heavy client-only processing when justified.
5. **Beware of animations/layout.** A smooth component should avoid large layout recalculations and unnecessary DOM measurements; prefer measured, limited motion and honor reduced-motion settings.

A 40-row list can be fine without virtualization. A dense grid with expensive cells may need it much earlier. Choose based on actual profiling, not a fixed row-count rule.

## 6. Control bundle and loading cost

- Split by route and by heavy feature. A rich-text editor, chart package, map, or PDF viewer can load when its panel is opened.
- Use `React.lazy` and `Suspense` for appropriate client-side code boundaries, with a fallback that preserves layout. The framework/router may provide additional route-level facilities.
- Analyze production bundles for duplicate libraries, full icon packs, locale bundles, large images and CSS. Confirm that imports actually tree-shake in the chosen build.
- Reserve dimensions for images and async panels to reduce layout shifts. Optimize images and fonts according to the design and delivery environment.
- Do not split every tiny component into separate chunks; too many boundaries and waterfalls can worsen UX. Test the first visit and subsequent navigation.

```tsx
import { lazy, Suspense, useState } from 'react';

const RichTextEditor = lazy(() => import('./RichTextEditor'));

export function SectionEditorPanel() {
  const [editing, setEditing] = useState(false);
  return <section>
    <button type="button" onClick={() => setEditing(true)}>Edit section</button>
    {editing && (
      <Suspense fallback={<div aria-live="polite">Loading editor…</div>}>
        <RichTextEditor />
      </Suspense>
    )}
  </section>;
}
```

This example defers the editor's code. In a real app, preserve draft state when toggling, provide an error boundary for failed chunk loading, and verify focus after opening.

## 7. Design the data/API boundary

Complex screens often look slow because their data contract is too broad.

- Ask each feature for only the data needed for its visible state. Use a paged, filtered API for grids and search results; return compact DTOs.
- Avoid request waterfalls where a page waits on one API before starting an independent API. Fetch independent panels concurrently when suitable.
- Cache server state with correct query keys, stale times, and invalidation after changes. Do not put full server responses into global UI state by default.
- Debounce search, cancel stale requests, provide skeleton/empty/error states, and avoid flashing stale results as though they were current.
- Coordinate with the backend on indexes, stable sorting, bounded response sizes, and tracing. For a .NET backend, project read models and inspect EF Core query plans when data loads dominate.
- Treat offline, autosave, and conflict behavior as explicit UX requirements; these can affect component boundaries and state lifecycles.

## 8. Validate with realistic scenarios

Set performance budgets in the context of target users, devices, and data. Measure before and after the component architecture is introduced.

| Scenario | Measurement | Typical risk |
| --- | --- | --- |
| Cold first visit | LCP, JS transfer/execution, CLS | Heavy bundles, fonts, images |
| Navigate to complex route | Transition time and loading behavior | Chunk/data waterfalls |
| Type in long form/editor | Input responsiveness, React commits | Broad state updates, validation per keystroke |
| Filter a large table | Request timing, result size, commits | Client-side full-data operations |
| Scroll dense list | Long tasks, DOM count, memory | Too many nodes or expensive cells |
| Open/close modal repeatedly | Mount cost, focus, memory | Leaked listeners, heavy dependencies |
| Slow network/API error | Interaction and recovery | Blank screens, stale data, layout shifts |

Use browser Performance and Network panels, React Profiler, bundle analysis, and Web Vitals field data. LCP relates to load, INP to interaction responsiveness, and CLS to visual stability. Measure custom user journeys too: “click to usable editor” or “search to visible results” may reveal problems those three metrics alone cannot describe. Compare p75 field experience and slow-device cohorts; use API traces if the backend participates in the delay.

## 9. Maintain quality as the app grows

- Keep shared components versioned and documented; require review for new variants and breaking changes.
- Use TypeScript, linting, formatting, and clear component ownership. Keep feature packages from importing each other's internals.
- Add visual regression checks for representative component states and responsive breakpoints, plus behavior/accessibility tests for keyboard, focus, forms, and dialogs.
- Run a few repeatable performance checks for critical flows in CI; monitor production metrics by route, release, browser and device class. Do not rely on one noisy synthetic score.
- Review third-party dependencies for bundle/runtime cost, accessibility, compatibility and upgrade behavior. Wrap vendor components behind app-owned adapters where practical.
- Track maintainability as well as speed: duplication, number of variants, time to apply a design change, regressions, and component adoption.

## Practical scenario: clinical authoring workspace

Suppose a designer provides a complex workspace with a section tree, rich-text editor, source search, comments, workflow status, and responsive panels.

1. Define shared primitives (`Button`, `Tabs`, `Dialog`, `Badge`) and domain components (`SectionTree`, `SourceSearch`, `ApprovalStatus`). Keep them separate.
2. Use semantic tokens for the application's surfaces and states. Document narrow and wide layouts, focus order, and empty/loading/error states.
3. Fetch section metadata and active section content independently when possible. Load only the selected section's editor and a bounded source-result page.
4. Lazy-load the rich editor. Keep its draft state local or in a dedicated draft store and autosave with a controlled cadence; an unrelated comment update should not rerender the entire editor.
5. Virtualize a very long section or source list if profiling shows DOM cost. Preserve keyboard focus and scroll position.
6. Profile typing, switching sections, searching sources, opening comments, and saving. Trace slow actions from browser through the .NET API and database.
7. Add component stories and end-to-end tests for draft preservation, error recovery, narrow screens, and keyboard navigation. Monitor real users after release.

This example shows why reuse, performance, and UX behavior must be planned together: a shared visual system alone cannot prevent a slow editor or an oversized API response.

## Experienced-level follow-up questions

**Would you put all state in Redux or Context for consistency?** No. Keep transient state local, server data in a query/cache layer, and cross-cutting state global only when multiple distant consumers truly need it. Broad context updates can cause unnecessary work.

**How do you decide whether to extract a shared component?** I look for shared semantics, behavior, accessibility needs and likely coordinated changes. Visual similarity alone may justify shared tokens/primitives, not a common high-level component.

**What if a reusable component becomes slow?** Reproduce with realistic props, profile mount/update paths, check consumers' prop identity and state scope, then optimize the hot path. A single shared fix can help many screens, but a bad shared abstraction can spread a performance regression widely.

**How do you handle different screen sizes?** Define layout and interaction changes at design time; use flexible CSS and component/container-level responsiveness where suitable. Test content length, zoom and input methods, not only viewport screenshots.

**Can memoization solve a huge table?** It can reduce unnecessary rerenders, but it does not reduce DOM count, network payload or database cost. Bound data, paginate/virtualize where appropriate, then use memoization for measured hot spots.

**How would you keep the editor responsive during autosave?** Separate typing from network state, debounce or schedule saves based on product requirements, cancel or serialize requests carefully, show save status, and handle version conflicts. Profile validation and serialization work on long documents.

## Common mistakes

- Building components directly from screenshots without mapping behavior and states.
- Extracting a universal component with many booleans and feature-specific branches.
- Putting all state at the page root or duplicating derived state.
- Applying `memo` everywhere before measuring.
- Downloading huge datasets and relying on virtualization to hide them.
- Loading chart/editor libraries on the initial route when not yet needed.
- Ignoring accessibility, localization, narrow screens, and failure states.
- Declaring the app “fast” from a desktop development build with ten sample records.

## Closing statement

> I make the design reusable by defining stable component contracts and tokens, and I make it performant by keeping render, bundle, and data work proportional to what the user actually needs. I validate both qualities with realistic journeys and field metrics, then protect them with reviews and regression checks.

## Official references

- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [React: `lazy`](https://react.dev/reference/react/lazy)
- [React: `<Profiler>`](https://react.dev/reference/react/Profiler)
- [React: `useTransition`](https://react.dev/reference/react/useTransition)
- [React: `useMemo`](https://react.dev/reference/react/useMemo)
- [Web Vitals](https://web.dev/articles/vitals)
