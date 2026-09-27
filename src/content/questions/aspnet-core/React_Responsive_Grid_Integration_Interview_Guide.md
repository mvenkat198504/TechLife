---
id: aspnet-react-004
slug:  Integrating a Complex Responsive Grid in React
title:  Integrating a Complex Responsive Grid in React
categoryId: aspnet-core
subcategory:  Integrating a Complex Responsive Grid in React
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Integrating a Complex
  - Responsive Grid React
  - Fast Large Tables
  - aspnet-core
summary: Integrating a Complex Responsive Grid in React
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---

# Interview Guide: Integrating a Complex Responsive Grid in React

## Interview question

**How would you handle integrating a complex, responsive grid layout from a UX designer into a React app while ensuring cross-browser compatibility, optimal performance, and maintainable CSS?**

> In an interview, clarify whether “grid” means a **page/card layout**, an **interactive data grid**, or both. The layout and browser strategy applies to either; a data grid also needs careful data, rendering, sorting, and accessibility decisions. I would briefly address both and then go deeper into the actual product scenario.

## Strong 90-second answer

> I would start with the design contract: identify the grid's content hierarchy, breakpoints, spacing tokens, interactions, states, and what may reflow versus what must remain aligned. I would implement the overall two-dimensional structure with CSS Grid and use Flexbox within cells where it fits better. I would favor intrinsic sizing such as `minmax()`, `repeat()` and `min-width: 0` over many hard-coded widths, and use media queries for page changes or container queries for a reusable grid that can live in different parents.
>
> In React, I would split the grid into semantic components without making every cell a special case. I would keep CSS scoped with a consistent convention, use design tokens for repeated decisions, and avoid deep selectors or `!important` overrides. I would validate in Chromium, Firefox and WebKit at representative viewport widths, zoom levels and content lengths, including keyboard and screen-reader behavior. I would compare the result with the handoff and test loading, empty and error states.
>
> Performance depends on the content: I would optimize images and layout shifts for a card grid; for a data grid I would bound API responses, keep filtering and sorting consistent with the full dataset, and virtualize rows only if profiling shows DOM pressure. I would measure production-build render time, scroll responsiveness, layout shifts, bundle size and API latency, then make targeted improvements and add regression checks.

## 1. Turn the designer handoff into a testable specification

Review the desktop, tablet and mobile frames, component variants, hover/focus states and interaction notes with the designer. Record what should change as space narrows.

| Design question | Decision to record |
| --- | --- |
| Content order | Which item is first in reading and keyboard order? |
| Layout behavior | Which columns collapse, wrap, stack or scroll? |
| Track sizing | Fixed sidebar? Flexible main panel? Minimum card width? |
| Overflow | Can long IDs, names and localized text wrap, truncate or scroll? |
| Alignment | Which card edges or table columns must align? |
| States | Loading, empty, error, selected, edit, hover and focus |
| Accessibility | Landmarks, headings, table semantics, keyboard movement and announcements |
| Supported environments | Browser versions, device classes, zoom and input methods |

Use actual content samples, not only polished mock text. An unusually long customer name, a localized label, an error banner, or a 200% zoom view can expose layout rules that were never specified.

## 2. Choose the layout tool for the job

| Requirement | Typical choice | Why |
| --- | --- | --- |
| Two-dimensional page or card arrangement | CSS Grid | Controls rows and columns together |
| Buttons or inline items in one direction | Flexbox | Simple alignment and wrapping |
| Structured tabular data | Semantic `<table>` or an accessible grid implementation | Preserves data relationships and navigation semantics |
| Reusable card adapting to parent width | Container query when supported by target browsers | Depends on component width rather than the viewport |
| Whole-page navigation change | Media query | Responds to viewport-level layout |

Do not use a visual CSS grid of `<div>` elements as a drop-in replacement for a semantic data table. For an interactive spreadsheet-like grid, keyboard and ARIA behavior are more involved than static table markup. Also avoid rearranging visual order in a way that conflicts with DOM reading and focus order.

## 3. Example: responsive dashboard/card grid

### React structure

```tsx
import styles from './DashboardGrid.module.css';

type Summary = { id: string; label: string; value: string; trend?: string };

export function DashboardGrid({ items }: { items: Summary[] }) {
  return (
    <section aria-labelledby="dashboard-heading" className={styles.section}>
      <h2 id="dashboard-heading">Overview</h2>
      <div className={styles.grid}>
        {items.map(item => (
          <article className={styles.card} key={item.id}>
            <h3 className={styles.label}>{item.label}</h3>
            <p className={styles.value}>{item.value}</p>
            {item.trend && <p className={styles.trend}>{item.trend}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Scoped CSS

```css
/* DashboardGrid.module.css */
.section {
  /* The parent can also be a sidebar or embedded workspace panel. */
  container-type: inline-size;
  min-width: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: var(--space-4, 1rem);
  align-items: stretch;
}

.card {
  min-width: 0;
  padding: var(--space-4, 1rem);
  border: 1px solid var(--color-border, #d0d5dd);
  border-radius: var(--radius-card, 0.5rem);
  background: var(--color-surface, #fff);
}

.label, .value { overflow-wrap: anywhere; }
.value { font-size: clamp(1.25rem, 3vw, 2rem); font-weight: 700; }

@container (min-width: 48rem) {
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

`min(100%, 16rem)` lets a card fit a narrower container, while `minmax(0, 1fr)` helps prevent long content from forcing equal tracks wider than intended. These rules are illustrative: use breakpoints and minimum widths derived from content and the actual design. `overflow-wrap: anywhere` may be inappropriate for some identifiers, so confirm the content policy.

**Progressive enhancement:** the `auto-fit` layout works without the container-query override. Test required browser versions and consider a simpler media-query fallback when the product supports older engines. A feature query such as `@supports` can help isolate enhancements, but should be validated against actual target browsers.

## 4. Complex page layout: preserve structure and reading order

For a page with navigation, main content and an inspector, keep the DOM in logical reading order. Change layout with CSS without making the keyboard order confusing.

```css
.workspace {
  display: grid;
  grid-template-columns: minmax(12rem, 16rem) minmax(0, 1fr) minmax(14rem, 20rem);
  gap: var(--space-4, 1rem);
  align-items: start;
}

.workspace > * { min-width: 0; }

@media (max-width: 70rem) {
  .workspace { grid-template-columns: minmax(12rem, 16rem) minmax(0, 1fr); }
  .inspector { grid-column: 1 / -1; }
}

@media (max-width: 45rem) {
  .workspace { grid-template-columns: minmax(0, 1fr); }
  .inspector { grid-column: auto; }
}
```

At very narrow widths, a genuinely wide data table may need its **own horizontal scroll container**. Forcing all columns into unreadable widths is not responsive design. Keep page-level horizontal overflow under control and give users clear table navigation.

## 5. If the grid contains thousands of data rows

The layout alone does not solve a data-grid performance problem.

- Filter, sort and paginate on the server for large datasets; request only the visible page and needed columns. Use a stable sort and an appropriate index. Make it clear whether the sort applies globally or only to loaded rows.
- Use a grid library only after checking its accessibility, browser support, bundle/runtime cost, remote-data model and virtualization behavior. Wrap it in an app-owned component so vendor-specific props and styling do not spread across features.
- Virtualize rows and possibly columns when the DOM becomes expensive. Test dynamic heights, sticky headers, selection, focus, screen readers and print/export behavior. Export the filtered dataset through a dedicated server path, not by reading mounted DOM rows.
- Keep row keys stable and state localized. Profile before adding memoization. A single selection update should not needlessly rerender every expensive cell.
- Debounce search, cancel stale requests, show loading/error/empty states without excessive layout shifts, and cache data by page/filter/sort key as appropriate.

For a small bounded result, a simple semantic table may be faster to develop and easier to maintain than a full vendor grid.

## 6. Cross-browser compatibility plan

1. Define a support matrix with the product team: Chrome/Edge, Firefox, Safari and supported mobile browsers and versions. Do not assume “works in Chrome” implies Safari support.
2. Check compatibility for specific CSS features and component dependencies, especially container queries, subgrid, sticky positioning, form styling and newer selectors. Use widely supported foundations and progressive enhancement where needed.
3. Run automated functional and visual tests in Chromium, Firefox and WebKit with Playwright. Test actual Safari/target devices for critical interactions when the environment requires it; WebKit automation is useful but is not identical to every Safari/device combination.
4. Compare layout at agreed widths plus boundary widths just above/below breakpoints, portrait/landscape, zoom, font scaling, long text and right-to-left content if the app supports it.
5. Inspect overflow, scrollbar behavior, fonts, focus rings, sticky elements, touch targets and hover assumptions. Build tools can add vendor prefixes when configured, but prefixes do not make unsupported features work.
6. Review visual diffs intentionally; font rasterization can vary across browsers, so set sensible tolerances and focus on meaningful layout shifts.

### Illustrative Playwright projects

```ts
// playwright.config.ts (excerpt)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } }
  ]
});
```

A functional test should assert that key content and controls remain usable at each supported size. Visual snapshots are useful for representative layouts, with stable data/fonts and a controlled environment. Automated accessibility scans should be supplemented with keyboard and assistive-technology checks.

## 7. Performance plan and measurement

| Area | What to measure | Typical action |
| --- | --- | --- |
| Initial load | LCP, bundle size, image/font transfer | Lazy-load heavy panels; optimize assets |
| Layout stability | CLS and layout-shift regions | Reserve image/panel dimensions |
| Interaction | INP, click-to-result, input latency | Reduce long main-thread tasks and rerenders |
| Rendering | React commits, DOM count, scroll FPS/long tasks | Paginate/virtualize; simplify cells |
| CSS/layout | Style recalculation, forced synchronous layout | Simplify selectors and measurement loops |
| Data | API p95, query plan, payload size | Project/paginate/index responses |
| Memory | Repeated mount/unmount and long session usage | Clean up observers/listeners; bound cached rows |

Use a production build with realistic content and representative devices. Measure the baseline first, then change one thing at a time. Use React Profiler for component work and browser Performance tools for scripting, style/layout and paint. Web Vitals describe user experience, while custom timings cover the actual task such as “filter to visible results.” Avoid promising universal millisecond targets without product/device context.

## 8. Keep the CSS maintainable

- Define semantic design tokens for spacing, colors, radii and typography, so a design change is made centrally.
- Keep grid styles co-located with their component using CSS Modules or the project's established convention. Use a small number of intentional global rules for reset and tokens.
- Separate layout responsibilities: a page owns its columns; a card owns its internal presentation; a data grid owns its table behavior. Avoid children reaching into parent internals with deep selectors.
- Name classes by purpose (`workspace`, `inspector`, `card`, `compact`) instead of specific color or position. Keep selector specificity low and avoid routine `!important`.
- Use explicit variants when they reflect real design decisions; avoid dozens of booleans or per-screen hard-coded overrides.
- Document supported states and breakpoints with component examples. Establish a review process for new grid variants and third-party overrides.
- Use CSS linting/formatting and inspect output size. Keep old unused rules from accumulating during migration.

## 9. Validation checklist for the final review

- [ ] Visual layout matches approved designs at target widths and boundary widths.
- [ ] DOM and keyboard order remain logical when columns stack or move.
- [ ] Long content, localization, zoom and narrow containers do not clip key actions.
- [ ] Loading, empty, error and selected states maintain layout and usability.
- [ ] Chromium, Firefox, WebKit and required actual devices pass critical flows.
- [ ] Automated and manual accessibility checks cover focus, labels and contrast.
- [ ] Production-build rendering, scroll, bundle and API metrics meet agreed budgets.
- [ ] Shared tokens/components are documented and page-specific CSS stays isolated.

## Follow-up interview questions

**CSS Grid or Flexbox?** Grid is a good fit for two-dimensional page/card structure; Flexbox fits one-dimensional content inside a cell. They complement each other.

**Media queries or container queries?** Media queries respond to viewport size; container queries let a reusable component adapt to the space allocated by its parent. Choose based on what drives the design and verify the target browser matrix.

**What if Safari renders the grid differently?** Reproduce on the supported Safari version/device, isolate the CSS feature or intrinsic-sizing behavior, check the browser support table, create a minimal case, and use a simpler fallback or targeted fix. Avoid broad browser sniffing when feature detection and compatible CSS suffice.

**Would you virtualize every table?** No. A small page of simple rows often works well as a regular semantic table. Virtualization introduces complexity for focus, variable row heights, sticky elements and assistive technology; use it when measurement justifies the cost.

**How do you avoid CSS becoming brittle?** Scope styles, use tokens, assign layout ownership clearly, limit specificity, and document variants. Test representative pages visually whenever shared styles change.

**How do you handle a design that wants every column visible on mobile?** Clarify priority with the designer and product owner. Consider a scrollable table with pinned identifiers, a condensed card view, or a column chooser. Preserve data relationships and keyboard access; do not squeeze important data into illegible columns.

## Common mistakes

- Treating the mockup's fixed pixels as the whole responsive specification.
- Using absolute positioning for the core grid layout.
- Reordering visual content without considering screen-reader and keyboard order.
- Relying on a vendor grid's demo with a handful of rows as performance proof.
- Fetching all records because only visible rows are rendered.
- Testing one browser and one screen size.
- Adding deep global selectors to override component internals.
- Claiming prefixes or polyfills guarantee support without checking the actual feature.

## Closing answer

> I translate the grid as a content and interaction system, not just a screenshot. CSS Grid and scoped tokens make the layout adaptable and maintainable; semantic components and bounded data keep React manageable; and cross-browser, accessibility and performance measurements confirm that the result works for real users.

## References

- [MDN: CSS Grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts)
- [MDN: `minmax()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/minmax)
- [MDN: Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [MDN: CSS feature queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Using_feature_queries)
- [Playwright: Browser support](https://playwright.dev/docs/browsers)
- [Playwright: Projects](https://playwright.dev/docs/test-projects)
- [React: Profiler](https://react.dev/reference/react/Profiler)
