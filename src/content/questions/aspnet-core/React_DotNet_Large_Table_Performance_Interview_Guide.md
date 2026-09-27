---
id: aspnet-react-001
slug: Fast Large Lists and Tables
title: React + ASP.NET Core: Fast Large Lists and Tables
categoryId: aspnet-core
subcategory: Fast Large Lists and Tables
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Fast Large Lists and Tables
  - Fast Large Lists
  - Fast Large Tables
  - aspnet-core
summary: React + ASP.NET Core: Fast Large Lists and Tables
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---

# React + ASP.NET Core: Fast Large Lists and Tables

## Interview question

**What strategies would you use to ensure that a React app with a .NET Core backend delivers consistently fast performance when rendering large lists or tables in the UI?**

## A strong 90-second answer

> I would treat the table as an end-to-end performance problem. First, I would measure the time spent in the database, API, network, and React rendering using realistic data and a production build. I would make filtering, sorting, and pagination server-side so the API returns only the rows and fields the user needs. In EF Core, I would use indexed, deterministic sorting, projection to DTOs, `AsNoTracking`, asynchronous queries, and a bounded page size. For sequential navigation over very large or changing datasets, I would consider cursor or keyset pagination; offset pagination is useful when users need to jump to a numbered page.
>
> In React, I would virtualize rows when a page is still large enough to create DOM pressure, keep row props and callbacks stable where profiling shows a benefit, and avoid making every row re-render when selection or unrelated state changes. I would debounce search, cancel stale requests, cache pages by filter and sort key, and preserve the previous page while loading. Finally, I would verify p95 API latency, payload size, query plans, React commit times, DOM count, and scrolling smoothness under realistic concurrency. Virtualization solves rendering cost; it does not replace bounded API responses or efficient SQL.

## 1. Diagnose before optimizing

Measure four stages separately:

| Stage | What to inspect | Typical symptom |
| --- | --- | --- |
| Database | Query plan, rows scanned, index usage, SQL duration, N+1 queries | API slow even with a small response |
| API/network | p50/p95 latency, response bytes, serialization time, compression | Large transfer or high time to first response |
| React | Profiler commits, repeated row renders, expensive cell formatters | Interaction lags after data arrives |
| Browser layout | DOM node count, long tasks, paint and scroll performance | Choppy scrolling despite fast API |

Use a production React build, a representative dataset (for example, hundreds of thousands of records), real filter/sort patterns, and concurrent users. Establish targets as team-specific service objectives rather than claiming one universal millisecond number. Compare cold and cached paths and check slower devices and networks.

## 2. Backend and database strategy

### Bound data at the server

- Define an endpoint such as `GET /api/orders?search=...&status=...&sort=createdAt_desc&page=1&pageSize=50`.
- Apply authorization and tenant scope **before** filtering and paging. Whitelist filter and sort fields; never concatenate arbitrary user input into SQL.
- Enforce a maximum page size. Return only the columns needed for this view, not complete entity graphs or binary content.
- Use server-side filtering and sorting. Calling `.ToListAsync()` before `Where`, `OrderBy`, `Skip`, and `Take` would bring excessive data into memory.
- Choose a deterministic sort with a unique tie-breaker, such as `CreatedAt DESC, Id DESC`; otherwise pages can repeat or omit rows when timestamps tie.
- Index high-volume search, filter, and sort paths based on actual query plans. For example, a tenant-scoped table ordered by time might benefit from an index matching `(TenantId, CreatedAt DESC, Id DESC)`. Index choice depends on query selectivity and the database engine.
- Avoid N+1 queries. Project required related values in one translated query or use an appropriate eager-loading strategy. Be aware of Cartesian explosion when loading multiple collections.
- Decide whether the UI truly needs an exact total row count. `CountAsync` may be an additional expensive query; a `hasMore` flag can be enough for next/previous navigation.

### EF Core offset-paging example

This example assumes an `Orders` table with `TenantId`, `Id`, `CreatedAt`, `CustomerName`, `Status`, and `TotalAmount`. It supports a fixed sort and page-number navigation. Identity and tenant ID come from trusted authentication context.

```csharp
public sealed record OrderRowDto(
    long Id, DateTime CreatedAt, string CustomerName,
    string Status, decimal TotalAmount);

public sealed record PageResult<T>(
    IReadOnlyList<T> Items, int Page, int PageSize, bool HasMore);

[HttpGet("orders")]
public async Task<ActionResult<PageResult<OrderRowDto>>> GetOrders(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50,
    [FromQuery] string? status = null,
    CancellationToken cancellationToken = default)
{
    if (page < 1 || pageSize < 1) return BadRequest("Invalid paging parameters.");
    pageSize = Math.Min(pageSize, 100);

    // Resolve this from the authenticated user, never a client-provided tenant ID.
    var tenantId = _tenantContext.TenantId;
    var query = _db.Orders.AsNoTracking()
        .Where(o => o.TenantId == tenantId);

    if (!string.IsNullOrWhiteSpace(status))
        query = query.Where(o => o.Status == status);

    var rows = await query
        .OrderByDescending(o => o.CreatedAt)
        .ThenByDescending(o => o.Id)
        .Skip((page - 1) * pageSize)
        .Take(pageSize + 1)
        .Select(o => new OrderRowDto(
            o.Id, o.CreatedAt, o.CustomerName,
            o.Status, o.TotalAmount))
        .ToListAsync(cancellationToken);

    var hasMore = rows.Count > pageSize;
    if (hasMore) rows.RemoveAt(pageSize);
    return Ok(new PageResult<OrderRowDto>(rows, page, pageSize, hasMore));
}
```

For public APIs, validate or cap the computed offset to prevent integer overflow and excessive deep-page scans. Put an upper bound on search complexity as well. `AsNoTracking()` helps for read-only projections, though the performance gain from no-tracking depends on query shape.

### Offset versus keyset pagination

| Choice | Best fit | Tradeoff |
| --- | --- | --- |
| `Skip`/`Take` (offset) | Page numbers and jumping to a chosen page | Deep offsets require scanning/skipping earlier rows; inserts/deletes can shift page boundaries |
| Keyset/cursor | Next/previous or infinite scroll through large data | Efficient deep navigation and more stable boundaries; random jumps and arbitrary sorts need extra design |

For `CreatedAt DESC, Id DESC`, the next-page predicate is:

```csharp
.Where(o => o.CreatedAt < cursor.CreatedAt ||
           (o.CreatedAt == cursor.CreatedAt && o.Id < cursor.Id))
.OrderByDescending(o => o.CreatedAt)
.ThenByDescending(o => o.Id)
.Take(pageSize + 1)
```

Use the same filters and tenant scope as the first page. Encode and validate the cursor, and align the composite index with the filter and sort. A cursor is not a full snapshot guarantee: updates to sort keys and concurrent changes can still affect what users see. For strict consistency, discuss snapshot semantics or a stable cutoff.

## 3. React rendering strategy

1. **Render a manageable slice.** A 50-row server page may render well without virtualization. If a screen holds hundreds or thousands of loaded rows, use row virtualization so only visible rows plus a small overscan are mounted. Virtualize columns too if there are many wide columns.
2. **Keep data operations on the server.** Configure a table library for manual/server pagination, filtering, and sorting; do not accidentally sort only the currently loaded page while displaying it as a global sort.
3. **Stabilize inputs thoughtfully.** Use stable row IDs (`key={row.id}`), keep column definitions stable where appropriate, and wrap expensive row/cell components in `memo` only when React Profiler shows avoidable rerenders. Avoid recreating every row object or inline derived collection on unrelated state changes. Memoization is an optimization, not a correctness mechanism.
4. **Limit state fan-out.** Keep hover, open menus, and edit state close to their cells/rows. Store selection by stable ID; for select-all-across-pages, use an explicit server-backed selection model or selection rule instead of assuming current-page IDs represent all rows.
5. **Control expensive work.** Debounce free-text search, use a deferred value or transition when local updates compete with typing, and move genuinely heavy transforms to a worker if needed. Avoid expensive formatting or aggregation inside each cell render; precompute or cache measured hot paths.
6. **Make loading predictable.** Key cache entries by page/cursor, page size, filters, sort, and tenant/user scope. Cancel stale fetches with `AbortSignal`, keep previous results visible if the UX calls for it, prefetch an adjacent page selectively, and invalidate relevant cached queries after mutations.
7. **Preserve usability.** Virtualized tables need careful keyboard navigation, focus restoration, sticky headers, dynamic row heights, screen-reader behavior, and export logic. An export should be a server job or dedicated endpoint for the entire filtered set, not a CSV built from only visible DOM rows.

### Small React query example

The example uses TanStack Query; install/configure its provider in the app. It shows the request lifecycle, not a complete grid implementation.

```tsx
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

type OrderRow = {
  id: number;
  createdAt: string;
  customerName: string;
  status: string;
  totalAmount: number;
};
type PageResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  hasMore: boolean;
};

async function fetchOrders(
  page: number, status: string, signal: AbortSignal
): Promise<PageResult<OrderRow>> {
  const params = new URLSearchParams({
    page: String(page), pageSize: '50', ...(status ? { status } : {})
  });
  const response = await fetch(`/api/orders?${params}`, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export function OrdersTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, isPending, isFetching, error } = useQuery({
    queryKey: ['orders', page, 50, status],
    queryFn: ({ signal }) => fetchOrders(page, status, signal),
    placeholderData: previous => previous
  });

  return <section>
    <select value={status} onChange={e => {
      setStatus(e.target.value);
      setPage(1);
    }}>
      <option value="">All statuses</option>
      <option value="Open">Open</option>
    </select>
    {error && <p role="alert">Could not load orders.</p>}
    {isPending ? <p>Loading…</p> : <>
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
        <tbody>{data?.items.map(row =>
          <tr key={row.id}>
            <td>{row.id}</td><td>{row.customerName}</td>
            <td>{row.status}</td><td>{row.totalAmount}</td>
          </tr>
        )}</tbody>
      </table>
      {isFetching && <span aria-live="polite">Updating…</span>}
      <button disabled={page === 1 || isFetching} onClick={() => setPage(p => p - 1)}>Previous</button>
      <button disabled={!data?.hasMore || isFetching} onClick={() => setPage(p => p + 1)}>Next</button>
    </>}
  </section>;
}
```

When `placeholderData` is active, previous page rows may remain visible briefly. For critical views, distinguish placeholder rows from current-page rows, disable misleading actions, and use an explicit loading indication. Add virtualization only if profiling justifies it; a production grid also needs accessible sort/filter controls and error recovery.

## 4. Caching, transport, and consistency

- Prefer targeted client caching with a short stale period appropriate to the business data. Invalidate affected pages after writes. Never share cached tenant-specific data across identities.
- Use HTTP caching or server/distributed caching for read-heavy, suitable responses with a clear key, TTL, and invalidation strategy. Highly personalized or frequently changing views may gain little.
- Compress larger JSON responses when beneficial, but first remove unnecessary fields. Avoid excessive simultaneous requests; use bounded concurrency and cancellation.
- For real-time updates, patch affected rows or invalidate queries selectively rather than reloading a massive table every event. Explain how changing rows affect page order and selection.
- Do not use virtualization as a substitute for server paging: fetching a million rows still consumes network and browser memory even if only 30 DOM rows are visible.

## 5. How I would validate the result

1. Reproduce slow cases: initial load, filter changes, sort, deep paging, rapid typing, scrolling, and selecting rows across pages.
2. Check database execution plans and query counts, including common and worst-case filters. Verify indexes against actual SQL.
3. Capture p50/p95/p99 API latency, database duration, response size, error rate, and concurrency; trace a request from browser to SQL.
4. Use React Profiler and browser Performance tools to measure rerender counts, long tasks, DOM size, memory, and scroll responsiveness.
5. Run a representative load test, then compare the same metrics after each change. Add performance regression checks for the most valuable endpoints and interactions.

## Follow-up questions and experienced-level answers

**Would you always virtualize a table?** No. Server paging to 25–100 simple rows can be enough. Virtualization adds complexity for focus, accessibility, variable heights, sticky content, and printing. Measure DOM and commit cost first.

**How do you handle a user jumping to page 500?** Offset pagination can serve numbered pages but deep offsets become costly. If random access is a core feature, test indexed offset queries, constrain the navigation model, or use search/bookmarks. A cursor is preferable for sequential navigation.

**What happens when records change while paging?** Use deterministic ordering, explain that offset boundaries may shift, and choose cursors for sequential traversal. If the requirement is a consistent report, generate a snapshot or use a stable cutoff and export workflow.

**Where should filtering and sorting happen?** On the server for the full dataset. Client-side operations are appropriate only when the complete, bounded dataset is intentionally loaded and the UI clearly communicates its scope.

**Would `React.memo` fix a slow query?** No. It may skip some React renders, but cannot reduce database time, response payload, or a huge number of mounted DOM nodes. Profile each layer.

**How do you handle select all across 100,000 filtered records?** Define whether select-all means the current page or all matching results. For all results, store a filter snapshot or server-side selection token with explicit exclusions and authorization checks; do not send 100,000 IDs from the browser by default.

## Common mistakes to avoid

- Returning all records and slicing them with JavaScript.
- Combining server pagination with client-only sorting that misrepresents the whole dataset.
- Calling `ToListAsync` before applying filters and limits.
- Returning EF entities with navigation graphs instead of small DTOs.
- Counting the entire filtered result on every keystroke when the UX needs only `hasMore`.
- Assuming `useMemo` or `memo` makes every render free, or virtualizing without fixing the SQL.
- Using unstable list keys (such as array index) when rows can be sorted, inserted, or edited.
- Reporting only average latency and testing only with small development datasets.

## Official references

- [React `memo`](https://react.dev/reference/react/memo)
- [React `useMemo`](https://react.dev/reference/react/useMemo)
- [TanStack Table virtualization guide](https://tanstack.com/table/latest/docs/framework/react/guide/virtualization)
- [EF Core efficient querying](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying)
- [EF Core pagination](https://learn.microsoft.com/en-us/ef/core/querying/pagination)
- [ASP.NET Core best practices](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices)
