---
id: aspnet-react-005
slug:  Optimizing Dynamic Lists and Real-Time React Updates
title:  Optimizing Dynamic Lists and Real-Time React Updates
categoryId: aspnet-core
subcategory:  AspNet_React
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Integrating a Complex
  - Responsive Grid React
  - Fast Large Tables
  - aspnet-core
summary: Optimizing Dynamic Lists and Real-Time React Updates
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---

# Interview Guide: Optimizing Dynamic Lists and Real-Time React Updates

## Interview question

**If a designer’s layout includes numerous dynamic lists and real-time updates, how would you optimize React rendering to prevent UI lag and unnecessary re-renders?**

## Strong 90-second interview answer

> I would map the update paths first: which lists change, how often events arrive, which rows are visible, and which interactions must stay immediate. Then I would measure a production build with realistic event volume using React Profiler and the browser Performance panel. I would keep state near its consumers, normalize list data by stable IDs, update only changed records, and avoid replacing every row object for a single event.
>
> I would separate network event frequency from visual refresh frequency. If updates arrive faster than people need to see them, I would buffer and coalesce them by entity ID and flush at a controlled cadence, while preserving every business event that must be processed. I would paginate or virtualize long lists so only visible rows are mounted, and memoize expensive rows after verifying their props are stable. I would keep typing and selection responsive; deferred rendering or transitions can help with expensive nonurgent views, but they do not fix excessive network traffic or a slow server.
>
> For real-time delivery, I would handle reconnection, ordering, missed events, and resynchronization. I would validate scroll position, focus, accessibility announcements and memory over a long session. Finally I would track input responsiveness, React commit times, long tasks, DOM count, event backlog and API/connection health under peak load.

## 1. Clarify the workload and UX contract

“Real-time” can mean ten status changes per minute or hundreds of events per second. The right design depends on event semantics.

| Question | Why it matters |
| --- | --- |
| How many lists, rows and updates per second? | Determines DOM and event-processing pressure |
| Does every update need to be displayed immediately? | Allows visual coalescing where safe |
| Are updates full snapshots or partial patches? | Affects merge logic and network size |
| Can an event be lost, duplicated or delivered out of order? | Requires versioning and reconciliation |
| Must the user's scroll, edit and selection remain stable? | New rows can shift the viewport or overwrite input |
| Which events are business-critical? | Audit/transaction events must not be discarded merely to save renders |

Agree on visible behavior with the designer: for example, show “12 new items” above a feed and insert them when the user requests it, instead of jumping their scroll position. Decide whether live updates pause while a user edits, whether a chart animates on every event, and whether a badge may update at a lower frequency than the underlying data.

## 2. Measure before changing code

Use a production or profiling build with realistic lists, payloads, expensive cells and update rate. Capture:

- React DevTools Profiler: commit duration, affected component tree, repeated row renders, and what caused them.
- Browser Performance panel: scripting, long tasks, style/layout/paint, memory and scroll/input responsiveness.
- DOM count and mounted row count; network message rate, payload size and request waterfalls.
- Interaction timings: click/select, typing in a search field, scroll, event-to-visible latency and recovery after reconnect.
- Field metrics such as INP plus custom timings for critical user actions. Set targets from actual device and product needs.

A rerender is not automatically a bug: a changed visible row should rerender. The goal is to avoid rendering unrelated rows or blocking high-priority interactions.

## 3. Keep state local and subscriptions narrow

A common anti-pattern is storing every list and every hover/edit/modal state in one page component or broad Context provider. One message then rerenders the whole dashboard.

- Keep transient row state (menu, hover, draft edit) near the row or focused editor.
- Keep server data in an appropriate query/cache or normalized store. Subscribe list components to only the data they need; a store with selectors may help very high-frequency screens.
- Keep stable `id` keys. Avoid array indexes when rows insert or reorder.
- Update one record immutably and retain the references of unchanged records where possible. Avoid `.map(row => ({ ...row }))` for every incoming event.
- Avoid duplicate derived state, broad effect chains and global context values recreated for each message.

### A row component with a stable identity

```tsx
import { memo } from 'react';

type Item = { id: string; title: string; status: string; version: number };

export const LiveRow = memo(function LiveRow({ item }: { item: Item }) {
  return (
    <li>
      <span>{item.title}</span>
      <span>{item.status}</span>
    </li>
  );
});

export function LiveList({ items }: { items: Item[] }) {
  return <ul>{items.map(item => <LiveRow key={item.id} item={item} />)}</ul>;
}
```

`memo` can skip an unchanged row if its `item` reference remains the same. It will not help if a parent recreates every item object for every update. Nor does it reduce the cost of mounting thousands of rows. Profile the actual benefit; a changed row must still render.

## 4. Coalesce visual updates without losing business events

React can batch multiple state changes in an event cycle, but that does not automatically make a high-frequency stream cheap. If a separate message arrives every few milliseconds, each may still create work. A visual buffer can merge replaceable status updates by ID and flush periodically. **Do not drop critical transaction/audit events:** persist/process those separately, and coalesce only the latest presentation state when the business semantics allow it.

```tsx
import { useEffect, useState } from 'react';

type StatusPatch = { id: string; status: string; version: number };
type Item = { id: string; title: string; status: string; version: number };

export function useLiveItems(
  initialItems: Item[],
  subscribe: (onPatch: (patch: StatusPatch) => void) => () => void
) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const pending = new Map<string, StatusPatch>();
    const unsubscribe = subscribe(patch => {
      const previous = pending.get(patch.id);
      if (!previous || patch.version > previous.version) {
        pending.set(patch.id, patch);
      }
    });

    // Example cadence only: choose it based on visibility and UX requirements.
    const timer = window.setInterval(() => {
      if (pending.size === 0) return;
      const batch = new Map(pending);
      pending.clear();

      setItems(previous => previous.map(item => {
        const patch = batch.get(item.id);
        return patch && patch.version > item.version
          ? { ...item, status: patch.status, version: patch.version }
          : item; // preserve reference for an unchanged row
      }));
    }, 100);

    return () => {
      window.clearInterval(timer);
      unsubscribe();
      pending.clear();
    };
  }, [subscribe]);

  return items;
}
```

**Production considerations:** make `subscribe` stable; handle changes to `initialItems` through a deliberate resynchronization path rather than assuming the hook resets automatically. The example scans the array once per flush; for extremely large collections or many independent lists, normalized maps and selector-based subscriptions can reduce work. Version numbers must reflect the server's ordering contract. Buffer size and memory should be bounded, and deleting/reordering items needs explicit handling.

For a feed, append events to a bounded window or page. For a live chart, aggregate samples into display buckets if exact per-event rendering is unnecessary. For a financial or clinical audit trail, record all events in the authoritative backend even if the screen displays a sampled or grouped view.

## 5. Render only what is needed

- **Server pagination/cursors:** fetch a bounded segment. Do not download an unbounded history because a virtual list hides most DOM rows.
- **Windowing/virtualization:** mount only visible rows plus overscan when DOM count is a measurable cost. Check variable heights, sticky headers, screen readers, keyboard navigation and scroll anchoring.
- **Selection and updates:** use stable IDs. When new records arrive above the viewport, hold them in a “new items” buffer or maintain the scroll anchor instead of forcing a jump.
- **Computed values:** avoid expensive per-row formatting or sorting on every render. Precompute, memoize measured hot spots, or move heavy aggregation to the server or worker.
- **Images and charts:** lazy-load media, reserve dimensions, and limit animation or redraw frequency. Rendering a live chart on every raw event may block the main thread.

### Useful optimization choices

| Symptom | First place to look | Candidate solution |
| --- | --- | --- |
| Every row renders for one changed status | Prop identities and broad state updates | Preserve unchanged objects; narrow subscriptions; measured `memo` |
| Scroll is choppy | DOM size, cells, layout/paint | Pagination/virtualization; simplify expensive cells |
| Typing lags while filtering | Synchronous list computation | Debounce server requests; defer nonurgent rendering; avoid repeated full scans |
| UI updates hundreds of times per second | Event-to-render cadence | Coalesce replaceable patches; cap display refresh rate |
| Large memory after an hour | Unbounded history, listeners, caches | Bound lists/cache; clean up subscriptions/timers |
| Reconnect shows stale data | Missed events or ordering | Cursor/version check and snapshot resync |

`useDeferredValue` or `useTransition` can keep urgent input updates responsive while React renders a slower view. They are scheduling tools; they do not reduce SQL work, network payload or the number of records retained. Use them after identifying the slow interaction.

## 6. Real-time transport and correctness

With an ASP.NET Core backend, SignalR is one possible transport. WebSocket, SSE or polling may also fit, depending on one-way/two-way requirements and infrastructure.

- Subscribe only to authorized channels or groups relevant to the current screen. Server-side authorization must remain authoritative.
- On reconnect, compare a server sequence number, version or cursor and fetch a snapshot or missed events. Automatic reconnection by itself does not guarantee no events were missed.
- Make event handlers idempotent, reject older versions, and handle duplicate messages. Document whether updates are ordered per entity or globally.
- Merge live patches with paginated query data carefully. Invalidate/refetch when filters or ordering may change; a row may leave the current result set.
- Clean up subscriptions when a screen unmounts or its channel changes. Limit queued events and define what happens under backpressure or a hidden tab.
- Keep a single clearly owned connection or connection manager where appropriate; avoid a new connection for every row.

### SignalR lifecycle sketch

```tsx
useEffect(() => {
  const handler = (patch: StatusPatch) => applyPatch(patch);
  connection.on('StatusChanged', handler);
  return () => connection.off('StatusChanged', handler);
}, [connection, applyPatch]);
```

In a complete implementation, manage connection start/stop and reconnection in a dedicated service or provider, and resync on reconnect. The `applyPatch` callback should be stable or the subscription will be recreated frequently. A React component should not silently instantiate a new connection on every render.

## 7. Validation plan under peak load

1. Generate representative traffic: normal and peak event rates, bursty delivery, several lists and realistic row content.
2. Profile a production build while typing, scrolling and selecting during updates. Record commit duration, long tasks, INP/custom latency and missed frames.
3. Compare three cases: no live updates, baseline live updates, and optimized live updates. This isolates rendering from network/API cost.
4. Test long-running sessions, hidden/visible tab transitions, reconnect, duplicate/out-of-order events, slow network and API failure.
5. Verify correctness: selected item remains selected, edits are not overwritten, filter results stay valid, keyboard focus is not lost, and accessibility announcements are not overwhelming.
6. Observe backend event generation and fan-out, payload size, connection counts and resync latency. If events overwhelm the client, improve the producer/contract as well as React.
7. Put a repeatable performance scenario and key functional checks in CI; monitor field metrics and event backlog after rollout.

## Experienced follow-up questions

**Is `React.memo` enough?** No. It may avoid rerendering unchanged rows with stable props, but it does not prevent thousands of DOM nodes, large payloads, frequent parent work, expensive layout, or event backlog.

**Would you call `setState` for every SignalR event?** For low volume, that may be fine. At high volume, I would measure and consider a buffer that coalesces replaceable updates before one state commit. I would retain all events that the domain requires.

**What if a new event changes the current sort order?** The row may move or leave the filtered page. Define whether to update in place, show a “refresh results” cue, or refetch the affected query. Preserve scroll/focus and use stable ordering; the choice depends on the workflow.

**Should every row have its own Context consumer?** Usually no. Broad context changes can update many consumers. Use narrow selectors or an external store for high-frequency data if profiling shows a need; keep local UI state local.

**How do you handle out-of-order events?** Use server-assigned versions or sequence numbers, reject older entity versions, and resync when a gap is detected. Client timestamps alone are not a reliable universal ordering rule.

**How would you optimize a live chart?** Aggregate data into display buckets, cap sample history, update at a suitable visual cadence, and inspect chart-library redraw behavior. Preserve raw events in the backend if required.

**What would you say about React automatic batching?** It can group updates within a scheduling boundary, but a stream of distinct asynchronous messages still needs workload management. Batching is not a substitute for bounded lists or selective subscriptions.

## Common mistakes

- Replacing the whole list and all row objects for each changed item.
- Using array index keys in a list that inserts or reorders.
- Rendering the full history because virtualization is enabled.
- Dropping business-critical events merely to reduce rerenders.
- Treating reconnect as proof of lossless delivery.
- Applying `memo` everywhere without profiling or stable props.
- Ignoring focus, scroll anchoring, hidden tabs and long-session memory growth.
- Measuring only initial load instead of active interaction under update pressure.

## Closing statement

> I control how much data reaches the client, how often presentation state changes, and how much of the tree renders for each change. I preserve correctness with versioned events and resynchronization, then verify responsiveness and memory under realistic live traffic.

## Official references

- [React: Queueing state updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [React: `memo`](https://react.dev/reference/react/memo)
- [React: `useDeferredValue`](https://react.dev/reference/react/useDeferredValue)
- [React: `useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)
- [React: Profiler](https://react.dev/reference/react/Profiler)
- [TanStack Virtual: React adapter](https://tanstack.com/virtual/latest/docs/framework/react/react-virtual)
- [ASP.NET Core SignalR JavaScript client](https://learn.microsoft.com/aspnet/core/signalr/javascript-client)
