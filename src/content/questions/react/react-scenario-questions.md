---
id: react-Scenario-questions-001
slug: react-Scenario-questions
title: React Scenario-Based Interview Questions
categoryId: react
subcategory: React-Scenario-Based
difficulty: Basic
tags:
  -  react
  -  Scenario-Based
  -  react-basics
summary:React Scenario-Based Interview Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
#  React Scenario-Based Interview Questions

## 1. You React dashboard is very slow when displaying 10,000 records. How would you optimize it?

First profile the application using React DevTools and browser performance tools. Identify whether rendering, network requests, or expensive calculations cause the slowdown. Implement server-side pagination or list virtualization, memoize expensive calculations when profiling justifies it, and avoid unnecessary component updates.

INTERVIEW TIP

Explain how you measured performance before and after optimization.

## 2. A user types quickly in a search box, and old API reponses overwrite newer results. How would you fix this?

Debounce the search input, cancel obsolete requests using AbortController, and ensure only the latest request can update state. A query library can also manage cancellation and request identities.

```react
useEffect(() => {
  const controller = new AbortController();

  async function search() {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
  }

  search();
  return () => controller.abort();
}, [query]);
```

INTERVIEW TIP

Cancellation prevents obsolete requests from updating the component. Add debouncing to reduce API traffic.

## 3. Your component keeps calling an API repeatedly How would you identify and fix the problem?

Inspect the useEffect dependencies. Check whether the effect updates a dependency on every execution, or whether an object or function is recreated on every render. Move unnecessary objects inside the effect or stabilize dependencies. Check development Strict Mode behavior separately from a genuine infinite loop.
```react
useEffect(() => {
  fetchUsers();
}, []);
```
INTERVIEW TIP

An empty dependency array is appropriate only when the effect genuinely has no reactive dependencies. Handle cancellation and errors.

## 4. Your application makes the same API request from five different componenents. How would you prevent duplicate requests?

Use a shared server-state cache such as TanStack Query. Give identical requests the same query key. Configure stale time, invalidation, and refetching according to business requirements.

```react
const { data, isPending, error } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  staleTime: 60_000
});
```

INTERVIEW TIP

Distinguish caching completed responses from deduplicating concurrent requests.

## 5. A react application becomes slow because many child compoents re-render.How would you investigate?

Use the React Profiler to identify expensive renders. Check changing props, context updates, and state placement. Split large components, move state closer to its consumers, and apply React.memo where it demonstrably helps.

INTERVIEW TIP

React.memo is an optimization, not a guarantee that a component will never render.

## 6. You need to share logged-in user information across 50 components.How would you design it?

SAMPLE ANSWER

Create an authentication provider with Context and expose a custom useAuth hook. Keep authentication state centralized, avoid putting unrelated frequently changing values in the same context, and let the server remain the authority for permissions.

INTERVIEW TIP

Context distributes state; it is not a replacement for server-side authorization.

## 7. You access token expires while the user is workig.How would you handle it?

Use an established authentication library and supported refresh or silent-renewal flow. Coordinate concurrent renewal attempts, retry eligible requests at most once, and redirect to login when renewal fails. Prefer secure session designs and avoid exposing refresh tokens unnecessarily to JavaScript.

INTERVIEW TIP

Explain refresh-token rotation, HttpOnly cookies, CSRF protection, and why a frontend route guard is insufficient.

## 8. A form contains 100 fields and becomes difficult to maintain. What architecture would you use?

Split the form into logical sections, create reusable field components, use schema-based validation, and consider React Hook Form for complex forms. Keep field dependencies explicit and submit validated data to the backend.

INTERVIEW TIP

Discuss validation, accessibility, dirty-state tracking, and server validation.

## 9. Two components must update the same shopping cart. How would you synchronize them?

Lift state to their nearest common ancestor for a small feature. For application-wide cart state, use Context with a reducer or an appropriate shared store. Use immutable updates and synchronize authoritative cart data with the backend.

```react
function cartReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, action.item];
    case "clear":
      return [];
    default:
      return state;
  }
}
```
INTERVIEW TIP

Explain when local state is sufficient and when global state adds value.

## 10. your application initially downloads a huge Javascript bundle. How would you reduce loading time?

Analyze the bundle, split routes, dynamically import large features, remove unused dependencies, and defer noncritical code. Use React.lazy and Suspense for suitable client-side components.

```react
const Reports = React.lazy(
  () => import("./Reports")
);

<Suspense fallback={<Loading />}>
  <Reports />
</Suspense>
```
INTERVIEW TIP

Measure bundle size and user-centric loading metrics after the change.

## 11. Users lose their entered data when navigating between pages. How would you preserve it?

Keep draft state above the route component or use an appropriate shared store. Persist non-sensitive drafts in sessionStorage or localStorage when necessary, restore them safely, and provide an unsaved-changes warning.

Avoid persisting passwords, tokens, or sensitive medical and financial information in ordinary browser storage.

## 12. An API returns 100,000 products. How would you implement filtering and pagination?
 
Move pagination, sorting, and filtering to the server. Send query parameters, use stable ordering, cache pages where appropriate, and consider cursor-based pagination for frequently changing datasets. Virtualize long visible lists.

INTERVIEW TIP

Explain why downloading all records and filtering them in JavaScript is often inefficient.

## 13. A React application works locally, but API calls fail after deployment.How would you debug it?

Inspect the browser Network tab and console. Verify the API URL, environment configuration, HTTPS, CORS, authentication headers, cookies, and reverse-proxy configuration. Check server logs and compare actual requests across environments.

INTERVIEW TIP

A CORS failure must generally be corrected in the server or gateway configuration, not bypassed in React.

## 14. You must prevent unauthorized users from accessing an admin page. How would you implement this?

Use route guards or protected layouts to control the frontend experience. Retrieve trusted identity and permissions, but enforce every privileged operation through backend authorization. Handle loading and expired sessions correctly.

INTERVIEW TIP

Hiding an Admin button is not authorization.

## 15. A user clicks Save multiple times, creating duplicate order. How would you prevent it?

Disable the button while submission is pending and show clear feedback. Use a backend idempotency key or unique business constraint to prevent duplicate transactions even if requests are retried.
```react
async function handleSave() {
  if (saving) return;
  setSaving(true);
  try {
    await saveOrder();
  } finally {
    setSaving(false);
  }
}
```
INTERVIEW TIP

The UI guard improves usability; backend idempotency provides reliable protection.

## 16.One component crsahses and breaks the entire page. How would you isolate the failure?


Add Error Boundaries around major application sections and display useful fallback interfaces. Log exceptions with appropriate context. Handle event-handler and asynchronous errors separately, since Error Boundaries do not catch all errors.

INTERVIEW TIP

Place boundaries strategically around independently recoverable features.

## 17. Your React application needs real-time notifications from an ASP.NET Core backend.How would you implement them?

Use SignalR with an ASP.NET Core backend or another suitable real-time transport. Create a connection in a dedicated service or hook, register listeners, handle reconnects, and clean up subscriptions on unmount.

INTERVIEW TIP

Discuss authentication, duplicate events, reconnect behavior, and multi-instance scaling.

## 18. Your applications has 200 compoenents and developers struggle to maintain it. How would you redesign the architecture?

Organize the code by business feature, establish shared UI components, separate API access from presentation, use typed contracts, and define conventions for testing and state ownership. Introduce shared abstractions only when reuse justifies them.

INTERVIEW TIP

Explain module boundaries, dependency direction, and incremental migration rather than proposing a complete rewrite.

## 19. How would you test a complex React componenet that loads data and updates the UI?

Use React Testing Library to verify user-visible behavior. Mock network calls with MSW or equivalent tools. Cover loading, success, empty, error, and retry states, and test keyboard interactions where relevant.

```react
render(<UserList />);

expect(
  screen.getByText(/loading/i)
).toBeInTheDocument();

expect(
  await screen.findByText("John")
).toBeInTheDocument();
```
INTERVIEW TIP

Test observable behavior rather than implementation details.

## 20. You are designing a large React + ASP.NET Core application for thousands of concurrent users. What architecture would you propose?

Use feature-based React modules, shared design components, route-level code splitting, and an API client or server-state layer. Expose versioned ASP.NET Core APIs with authorization, pagination, caching, observability, and appropriate horizontal scaling. Measure actual load before choosing infrastructure capacity.

INTERVIEW TIP

Describe data flow, security boundaries, deployment, monitoring, and how the architecture evolves as traffic increases.