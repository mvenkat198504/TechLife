---
id: javascript-randomquestions-002
slug:  JavaScript Interview Guide
title: JavaScript Interview Guide for Experienced Full Stack Developers
categoryId: javascript
subcategory: JavaScript Interview Guide
difficulty: Experienced
tags:
  - JavaScript Interview Guide
  - Interview Guide
  - javascript
summary: Forty detailed JavaScript interview answers with examples and production scenarios.
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# JavaScript Interview Guide for Experienced Full Stack Developers

Use each **interview answer** as a concise spoken response, then expand with the example and production considerations. Examples use modern JavaScript in a browser unless stated otherwise. Browser event-loop behavior and Node.js scheduling have differences.

## 1. Event Loop, Call Stack, Web APIs, Task Queue and Microtask Queue

**Interview answer:** JavaScript runs synchronous code on a call stack. Browser APIs handle timers, network operations, and DOM events outside that stack. When callbacks are ready, they enter a task queue; Promise reactions and `queueMicrotask` enter the microtask queue. After the current stack empties, the event loop drains microtasks before taking the next task. The browser typically gets a rendering opportunity between tasks, subject to its scheduling decisions.

```js
console.log('A');
setTimeout(() => console.log('D'), 0); // timer task
Promise.resolve().then(() => console.log('C')); // microtask
console.log('B');
// A, B, C, D
```

A zero-delay timer means eligible after its minimum delay, not immediate execution. A long synchronous loop blocks callbacks and painting. Microtasks that continuously enqueue more microtasks can also starve rendering. `fetch` completion ultimately queues Promise reactions; it does not execute a JavaScript callback on a second UI thread.

## 2. Promise, async/await and callbacks

**Interview answer:** A callback is a function passed to run later. A Promise represents eventual fulfillment or rejection and supports composition with `.then()` and `.catch()`. An `async` function always returns a Promise; `await` pauses that function's continuation until a Promise settles without blocking the main thread. These are related mechanisms, not three kinds of parallel execution.

```js
function loadWithCallback(id, done) {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(user => done(null, user), error => done(error));
}

function loadWithPromise(id) {
  return fetch(`/api/users/${id}`).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
}

async function loadWithAwait(id) {
  const r = await fetch(`/api/users/${id}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
```

Callbacks also appear in synchronous APIs such as `map`; “callback” alone does not imply asynchronous behavior. Use `async`/`await` for readable sequential flow and Promise combinators for independent work.

## 3. How can async race conditions occur in single-threaded JavaScript? (Hexaware)

**Interview answer:** Only one JavaScript callback runs at a time on the main thread, but operations finish in unpredictable order. Code can read state, `await`, and later write state after another operation has changed it. The race concerns *ordering*, not simultaneous JavaScript instructions.

```js
let balance = 100;
async function spend(amount) {
  const old = balance;
  await Promise.resolve();
  balance = old - amount;
}
await Promise.all([spend(30), spend(40)]);
// Both can read 100; final value can be 60 rather than 30.
```

In production, stale search responses and duplicate form submissions are common examples. Use functional state updates for local state, request sequence checks or cancellation for stale reads, and server-side transactions, version checks, or idempotency for authoritative writes. A frontend guard alone cannot guarantee correctness across users and devices.

## 4. Closures and a real-world use case

**Interview answer:** A closure is a function together with access to variables in its lexical environment, even after the outer function returns. It is useful for private state, factories, event handlers, and debouncing.

```js
function createRequestId() {
  let next = 0;
  return () => ++next;
}
const getId = createRequestId();
console.log(getId(), getId()); // 1, 2
```

A search component can keep its latest request number inside a closure and ignore older responses. Be aware that closures can also keep large objects reachable longer than needed if a long-lived listener captures them.

## 5. `var`, `let` and `const`: scope and hoisting

| Declaration | Scope | Redeclare in same scope | Reassign | Before declaration |
| --- | --- | --- | --- | --- |
| `var` | Function or global | Yes | Yes | Reads as `undefined` |
| `let` | Block | No | Yes | ReferenceError (TDZ) |
| `const` | Block | No | No | ReferenceError (TDZ) |

```js
function example() {
  if (true) {
    var a = 1;
    let b = 2;
    const c = { value: 3 };
    c.value = 4; // allowed: object mutated, binding unchanged
  }
  console.log(a); // 1
  // console.log(b); // ReferenceError
}
```

Use `const` by default and `let` when rebinding. `const` does not freeze an object. At top level in a classic browser script, `var` has global-object behavior that top-level `let`/`const` do not; modules have their own scope.

## 6. `==` versus `===`

**Interview answer:** `===` compares without type coercion; `==` performs coercion under defined but sometimes surprising rules. Object comparisons use identity in both cases.

```js
0 == false;       // true
0 === false;      // false
null == undefined; // true
null === undefined; // false
[] === [];        // false: different array objects
```

Prefer `===` for predictable comparisons. A deliberate `value == null` is a compact test for both `null` and `undefined`, but make that intent explicit to the team.

## 7. Hoisting and the Temporal Dead Zone

**Interview answer:** Hoisting describes how declarations are registered when a scope is created. Function declarations can generally be called before their textual location; `var` exists with value `undefined`; lexical `let`/`const` bindings exist but cannot be accessed from the start of their scope until initialization. That interval is the Temporal Dead Zone (TDZ).

```js
sayHi(); // works
function sayHi() { console.log('Hi'); }

console.log(a); // undefined
var a = 1;

// console.log(b); // ReferenceError, not undefined
let b = 2;
```

A function expression assigned to `const` follows `const` initialization rules. Avoid explaining hoisting as source code physically moving.

## 8. `null`, `undefined` and an undeclared variable

**Interview answer:** `null` is an intentional empty value. `undefined` is a value commonly produced by missing properties, uninitialized variables, and functions without an explicit return. An undeclared identifier has no binding in the current accessible scopes; reading it throws `ReferenceError`.

```js
const user = { manager: null };
console.log(user.manager); // null
console.log(user.phone);   // undefined
let x;
console.log(x);            // undefined
// console.log(missingName); // ReferenceError
console.log(typeof missingName); // 'undefined' for an undeclared identifier
```

`typeof null` is historically `'object'`. Avoid treating a missing property and an explicitly present property with value `undefined` as equivalent when presence matters: use `Object.hasOwn(user, 'phone')`.

## 9. How `this` works; arrow functions

**Interview answer:** In a regular function, `this` depends on how the function is called: as `obj.method()`, with `call`/`apply`/`bind`, with `new`, or as a standalone function. An arrow function captures `this` lexically from its surrounding scope and cannot rebind it with `call` or `bind`.

```js
const counter = {
  count: 0,
  increment() { this.count++; },
  schedule() {
    setTimeout(() => this.increment(), 100); // arrow captures counter's this
  }
};
const fn = counter.increment;
// fn() loses the receiver; in strict mode this is undefined.
```

Do not use an arrow as an object method when the method needs `this` to refer to that object. Class field arrows can preserve instance `this`, but create a function per instance rather than using the prototype method.

## 10. Regular function versus arrow function

| Feature | Regular function | Arrow function |
| --- | --- | --- |
| `this` | Determined by call | Lexically captured |
| Own `arguments` | Yes (except arrow) | No; use rest parameters |
| Constructor with `new` | Usually yes | No |
| Own `prototype` property | Constructor-capable functions have one | No |
| Generator | Can use `function*` | Cannot be a generator |
| Typical use | Methods, constructors, dynamic receiver | Callbacks, lexical `this` |

```js
function sum() { return [...arguments].reduce((a, b) => a + b, 0); }
const sumArrow = (...numbers) => numbers.reduce((a, b) => a + b, 0);
```

Arrow syntax's implicit return is convenient, but object literals require parentheses: `items.map(x => ({ id: x.id }))`.

## 11. Prototype and prototypal inheritance

**Interview answer:** Objects have an internal prototype link. If a property is absent on an object, lookup walks its prototype chain. Constructor functions expose a `.prototype` object used as the prototype of instances created with `new`. `class` provides syntax over this mechanism.

```js
class Animal {
  speak() { return `${this.name} makes a sound`; }
}
class Dog extends Animal {
  constructor(name) { super(); this.name = name; }
  speak() { return `${this.name} barks`; }
}
const dog = new Dog('Max');
console.log(dog.speak()); // Max barks
console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true
```

Methods declared on the class prototype are shared. An instance's own property shadows a prototype property. Distinguish `Dog.prototype` (used for instances) from the prototype link of the `Dog` constructor itself.

## 12. Shallow copy versus deep copy

**Interview answer:** A shallow copy creates a new top-level array/object while retaining references to nested values. A deep copy recursively duplicates supported nested data. Choose based on which levels may be mutated.

```js
const original = { name: 'A', address: { city: 'Delhi' } };
const shallow = { ...original };
shallow.address.city = 'Pune';
console.log(original.address.city); // Pune

const deep = structuredClone(original);
deep.address.city = 'Mumbai';
console.log(original.address.city); // Pune
```

`structuredClone` handles many built-in types and cycles, but cannot clone functions and some platform objects. JSON stringify/parse loses types such as `Date`, drops `undefined`, and fails on cycles. For immutable state, often copy only the changed path instead of deep cloning the whole tree.

## 13. Spread `...` versus rest parameters

**Interview answer:**

The same ... syntax has two jobs in JavaScript:

- Spread expands values from an iterable, such as an array, or copies properties from an object.
- Rest collects multiple values into one array, or remaining properties into one object.

| Use | Example | What happens |
|---|---|---|
| Spread in a function call | `sum(...numbers)` | Passes array items as separate arguments |
| Spread in an array | `[...first, ...second]` | Adds items to a new array |
| Spread in an object | `{ ...user, active: true }` | Copies properties into a new object |
| Rest in parameters | `function sum(...numbers)` | Collects arguments into an array |
| Rest in destructuring | `const [first, ...others] = items` | Collects the remaining items |

```js
function sum(...numbers) {          // Rest: collect arguments
  return numbers.reduce((a, b) => a + b, 0);
}

const values = [10, 20, 30];
console.log(sum(...values));        // Spread: pass 10, 20, 30
// 60
```
For a React example:

```js
const original = { name: "Venkat", role: "Developer" };
const updated = { ...original, role: "Lead" }; // Spread

const { name, ...otherDetails } = updated;     // Rest
console.log(otherDetails); // { role: "Lead" }
```

**Interview shortcut:** Spread means expand; rest means collect. Both array and object spread create shallow copies, so nested objects still share references.

## 14. Destructuring and production use

**Interview answer:** Destructuring extracts values from an object or array into variables.

```js
const user = { id: 101, name: "Venkat", role: "Lead" };
const { name, role } = user;

console.log(name); // "Venkat"
console.log(role); // "Lead"

const scores = [85, 92, 78];
const [first, second] = scores;

console.log(first);  // 85
console.log(second); // 92
```
Where you use it in production

1. Read API responses clearly
```js
const response = await fetch("/api/studies/101");
const { id, title, status } = await response.json();
```
2. Extract React props
```js
function StudyCard({ title, status, owner }) {
  return <div>{title} — {status} — {owner}</div>;
}
```
3. Set defaults for optional configuration
```js
function loadStudies({ page = 1, pageSize = 20 } = {}) {
  return fetch(`/api/studies?page=${page}&pageSize=${pageSize}`);
}

loadStudies();                 // Uses defaults
loadStudies({ page: 3 });      // pageSize remains 20
```
4. Rename a property and collect the rest
```js
const { id: studyId, ...studyDetails } = user;
```
Here, studyId receives user.id, and studyDetails is a new object with the remaining own enumerable properties.
Common production pitfall: A default applies to undefined, but not to null.
```js
const { status = "Draft" } = { status: null };
console.log(status); // null
```
In an authoring workspace, I might extract `studyId`, `sectionId`, and `version` from a response before updating a section. Defaults apply only when a value is `undefined`, not when it is `null`. Guard optional nested data or use optional chaining if the parent can be missing.

**Interview answer:** “Destructuring lets me pull the fields I need from arrays, objects, API responses, and function parameters. I use it to make React props and service code easier to read, set safe defaults, rename fields, and separate selected fields from the remaining data.”

## 15. `map`, `filter`, `reduce`, `find` and `some`

| Method | Purpose | Return |
| --- | --- | --- |
| `map` | Transform each item | New array, same length |
| `filter` | Keep matching items | New array |
| `reduce` | Accumulate into a result | Accumulator |
| `find` | First matching item | Item or `undefined` |
| `some` | Whether any item matches | Boolean |

```js
const orders = [
  { id: 1, total: 40, paid: true },
  { id: 2, total: 60, paid: false },
  { id: 3, total: 20, paid: true }
];
orders.map(o => o.id);                       // [1, 2, 3]
orders.filter(o => o.paid);                  // orders 1 and 3
orders.reduce((sum, o) => sum + o.total, 0); // 120
orders.find(o => o.id === 2);               // order 2
orders.some(o => !o.paid);                  // true
```

All run callbacks synchronously; `async` callbacks inside `map` produce an array of Promises. To await them, use `await Promise.all(items.map(async item => ...))`, subject to concurrency limits.

## 16. `forEach()` versus `map()`

**Interview answer:** `forEach` runs a callback for each element and returns `undefined`; use it for synchronous side effects. `map` returns a new array of transformed results. Neither waits for asynchronous callbacks.

| | `forEach()` | `map()` |
|---|---|---|
| Purpose | Perform an action for each item | Transform each item |
| Return value | `undefined` | A new array |
| Typical use | Logging, updating an external value | Preparing data for display or further processing |
| Changes original array? | Neither does so automatically; your callback can still mutate objects | Neither does so automatically; your callback can still mutate objects |

```js
const numbers = [1, 2, 3];

const result1 = numbers.forEach(n => n * 2);
console.log(result1); // undefined

const result2 = numbers.map(n => n * 2);
console.log(result2); // [2, 4, 6]
```
Production example: Transform an API response into options for a dropdown:
```js
const users = [
  { id: 1, fullName: "Anita" },
  { id: 2, fullName: "Ravi" }
];

const options = users.map(user => ({
  value: user.id,
  label: user.fullName
}));

// [{ value: 1, label: "Anita" }, { value: 2, label: "Ravi" }]
```
Use forEach() when the action itself is the goal:

```js
users.forEach(user => console.log(user.fullName));
```

**Interview answer:** “I use map() when I need a new array of transformed values. I use forEach() when I just need to perform an action for each item and do not need an array returned.”

## 17. `Promise.all`, `allSettled`, `race` and `any`

| Combinator | Settles when | Result / failure |
| --- | --- | --- |
| `Promise.all` | All fulfill, or first rejects | Ordered values / first rejection |
| `Promise.allSettled` | All settle | Ordered `{status, value}` or `{status, reason}` records |
| `Promise.race` | First settles | First fulfillment or rejection |
| `Promise.any` | First fulfills, or all reject | First value / `AggregateError` |

```js
const [profile, roles] = await Promise.all([getProfile(), getRoles()]);
const outcomes = await Promise.allSettled([loadChart(), loadNews()]);
const quickest = await Promise.race([fetchFromA(), fetchFromB()]);
const firstSuccess = await Promise.any([fetchFromA(), fetchFromB()]);
```

A plain `Promise.race` timeout or competing request does not cancel losing work; use `AbortController` where possible. All four attach handlers to inputs, but choose based on business requirements for partial failure.

## 18. One rejection inside `Promise.all()`

**Interview answer:** The combined Promise rejects as soon as one input rejects. Other operations generally keep running; `Promise.all` does not cancel them. Successful values are not returned from that rejected aggregate. Input order determines result order when all succeed, irrespective of completion order.

```js
try {
  const values = await Promise.all([saveA(), saveB()]);
} catch (error) {
  console.error('At least one save failed', error);
}
```

For independent widgets that can fail separately, use `allSettled`. For dependent transactional writes, do not assume `Promise.all` provides rollback; coordinate atomicity on the server.

## 19. Correct error handling with async/await

**Interview answer:** Await inside `try/catch`; check HTTP status because `fetch` rejects on network failures and aborts, not ordinary HTTP 4xx/5xx responses. Handle known failures close to their context, preserve useful error detail, and let unexpected failures reach a centralized error boundary/logging path.

```js
async function loadStudy(id, signal) {
  try {
    const response = await fetch(`/api/studies/${id}`, { signal });
    if (!response.ok) throw new Error(`Study request failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') return null; // expected cancellation
    throw error; // caller can show error state and log appropriately
  }
}
```

Use `finally` for cleanup such as resetting a loading indicator, while avoiding a stale request clearing the loading state of a newer request. Do not silently swallow exceptions or expose sensitive server details in UI messages.

## 20. Ordering of synchronous code, Promise reaction and timer

```js
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
// start, end, promise, timeout
```

**Why:** Current synchronous work completes first. The Promise reaction runs as a microtask at the checkpoint. The timer callback runs as a later task. If a task itself queues microtasks, those microtasks run before the event loop selects another task. This is the typical browser ordering; do not generalize every scheduling detail to Node.js.

## 21. Debouncing versus throttling

**Interview answer:** Debouncing runs after a quiet period, resetting a timer whenever a new event arrives. Throttling limits execution to at most once per time window (depending on leading/trailing policy). Debounce search input; throttle scroll position or resize updates. For paint-related UI work, `requestAnimationFrame` can be more appropriate.

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const searchLater = debounce(query => search(query), 300);
```

A production utility should define whether the first or last call executes and expose cleanup for pending timers when the UI unmounts.

## 22. Prevent excessive search API calls while typing

**Interview answer:** Debounce the query, ignore very short input if appropriate, cache repeated queries, and cancel or ignore obsolete requests. Ensure empty input clears results and a slow response cannot overwrite the current query.

```js
let timer;
let controller;
let requestVersion = 0;
function onQueryChanged(query) {
  clearTimeout(timer);
  controller?.abort();
  const version = ++requestVersion;
  if (!query.trim()) { showResults([]); return; }
  timer = setTimeout(async () => {
    controller = new AbortController();
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      if (version === requestVersion) showResults(data);
    } catch (e) {
      if (e.name !== 'AbortError' && version === requestVersion) showError(e);
    }
  }, 300);
}
```

Clean up both timer and controller when the component unmounts. In React Query or similar tools, use their query keys and cancellation signal instead of duplicating cache machinery.

## 23. Older API response overwrites newer data

**Interview answer:** Give each request a monotonically increasing version and apply a response only if its version is still current. Abort the old request when possible to save work; the version guard still protects against operations that cannot be cancelled or have already completed.

```js
let latest = 0;
async function loadDetails(id) {
  const version = ++latest;
  const response = await fetch(`/api/items/${id}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (version === latest) render(data);
}
```

Another approach is to key state by request parameters and render only the key matching the selected item. For mutations, use server-side concurrency control such as a version/ETag rather than assuming last response wins.

## 24. Cancel obsolete HTTP requests with `AbortController`

```js
let activeController;
async function loadSearch(query) {
  activeController?.abort();
  const controller = new AbortController();
  activeController = controller;
  try {
    const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    if (e.name === 'AbortError') return null;
    throw e;
  } finally {
    if (activeController === controller) activeController = undefined;
  }
}
```

**Interview answer:** Abort signals communicate that the client no longer needs a request. Aborting a fetch does not guarantee the server stops processing or undoes an already committed mutation. Use the active-controller identity (or sequence token) to prevent old cleanup from changing new request state.

## 25. Client API cache and invalidation

**Interview answer:** Cache by a stable key containing all request parameters and user/tenant context. Set a freshness period based on how often data changes. Invalidate or update matching keys after a successful mutation; refetch on relevant navigation, focus, or explicit refresh. Clear user-scoped data on logout and avoid exposing one user's cache to another.

```js
// TanStack Query style pseudocode
useQuery({ queryKey: ['study', studyId], queryFn: () => getStudy(studyId), staleTime: 60_000 });
const save = useMutation({
  mutationFn: updateStudy,
  onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['study', variables.id] })
});
```

Consider HTTP `Cache-Control`/ETag for transport caching. Differentiate *stale* from *evicted*: stale data may be shown while refetching; eviction removes it. For high-stakes authoring, version fields and refetch after approval changes help avoid editing outdated content.

## 26. `localStorage`, `sessionStorage` and cookies

| Storage | Lifetime and scope | Sent automatically with HTTP? | Typical use |
| --- | --- | --- | --- |
| `localStorage` | Persists across browser sessions for an origin | No | Non-sensitive UI preferences |
| `sessionStorage` | Usually per tab/session for an origin | No | Temporary tab-specific UI state |
| Cookies | Expiry/session rules; domain/path and SameSite attributes | Yes, for matching requests | Server sessions, preferences |

**Interview answer:** Storage APIs are synchronous and subject to browser policy and quota. `HttpOnly` cookies cannot be read by JavaScript; `Secure` restricts transmission to secure contexts; `SameSite` affects cross-site sending. Cookie-based authentication also needs CSRF design appropriate to the deployment. Do not confuse `sessionStorage` with a server session.

## 27. Why not store sensitive authentication data in `localStorage`?

**Interview answer:** JavaScript running in the origin can read `localStorage`, so a successful XSS injection can steal stored tokens. Values also persist beyond a tab and can be accessed by any same-origin script. Prefer a server-managed session using `Secure`, `HttpOnly`, appropriately scoped `SameSite` cookies when suitable, with CSRF protection where needed.

HttpOnly cookies reduce direct token theft through JavaScript, but they do **not** eliminate XSS: injected code can still perform actions in the user's session. Protect against XSS with output escaping, safe DOM APIs, dependency hygiene, and a suitable CSP. For token-based systems, minimize token lifetime and exposure, and design refresh/rotation deliberately.

## 28. CORS and why frontend code cannot fix it

**Interview answer:** Cross-Origin Resource Sharing is a browser mechanism in which the server states which other origins may read its responses via CORS headers. For certain requests the browser sends a preflight `OPTIONS` request to check allowed methods and headers. A frontend script cannot grant itself access: the target server or a controlled same-origin backend must provide the correct headers.

For credentialed cross-origin requests, the server must explicitly allow the requesting origin and credentials; wildcard origin is not sufficient. `mode: 'no-cors'` yields an opaque response that JavaScript cannot read. CORS controls browser reading; it is not authentication or protection against server-to-server requests. Diagnose origin, preflight method/headers, redirects, credentials, and server response headers in DevTools.

## 29. Event bubbling, capturing and delegation

**Interview answer:** A DOM event travels down ancestors in the capture phase, reaches the target, then travels upward in the bubble phase (for events that bubble). `addEventListener(..., { capture: true })` listens on the way down. Event delegation attaches one listener to a parent and uses `event.target`/`closest()` to handle matching descendants.

Event Propagation Lifecycle
When you interact with an element on a webpage (like clicking a button), the browser runs an event lifecycle with three distinct phases:
1. Capturing Phase: The event starts at the root (window/document) and travels down the DOM tree through ancestor elements to the target element.
2. Target Phase: The event reaches the actual element that was clicked or activated.
3. Bubbling Phase: The event turns around and bubbles up from the target element back through its parents to the root

**1. Event Bubbling**
- Definition: An event triggered on a child element travels upward to its parent and ancestor elements.
- Direction: Inside to outside (bottom to top).
- Default Behavior: By default, most JavaScript event listeners execute during this bubbling phase.
- Stopping It: You can use e.stopPropagation() inside an event handler to stop the event from bubbling up to parents.

**2. Event Capturing**
- Definition: The exact opposite of bubbling; the outer ancestor handlers fire before the inner target handler.
- Direction: Outside to inside (top to bottom).
- Usage: To listen for events during this phase, pass true (or { capture: true }) as the third argument to addEventListener.

**3. Event Delegation**
- Definition: A pattern where you attach a single event listener to a parent element instead of adding separate listeners to multiple child elements.
- How It Works: It relies on event bubbling. When a child is clicked, the event bubbles up to the parent where your single listener catches it

**Benefits:**
- Saves memory and improves performance by reducing total event listeners.
- Automatically works for new child elements added dynamically to the DOM later.

```js
const list = document.querySelector('#orders');
list.addEventListener('click', event => {
  const button = event.target.closest('button[data-order-id]');
  if (!button || !list.contains(button)) return;
  openOrder(button.dataset.orderId);
});
```

Delegation is useful for dynamic lists and fewer listeners. `event.target` is the element where the event began; `event.currentTarget` is the element whose listener is executing. `stopPropagation()` should be used only when the interaction actually requires stopping propagation.

## 30. Causes and diagnosis of JavaScript memory leaks

**Interview answer:** Leaks are objects still reachable even though the app no longer needs them: detached DOM retained by listeners, long-lived closures, accumulating caches, uncleared timers, subscriptions, or Web Workers. Garbage collection cannot reclaim reachable objects.

**Investigation:** Reproduce the same navigation or action repeatedly. Record browser heap snapshots before and after, force GC only for controlled measurement, compare retained object counts and paths to GC roots, and inspect detached elements. Use the Performance and Memory panels to correlate increasing heap, listener count, and long tasks. Check whether memory returns to a stable baseline after cleanup; one rise alone is not proof of a leak.

## 31. Timers, subscriptions and listeners as leaks

```js
function mountWidget(element, stream) {
  const onClick = () => console.log(element.textContent);
  element.addEventListener('click', onClick);
  const timer = setInterval(refresh, 5_000);
  const unsubscribe = stream.subscribe(render);
  return () => {
    element.removeEventListener('click', onClick);
    clearInterval(timer);
    unsubscribe();
  };
}
```

**Interview answer:** These registrations can retain callbacks and objects captured by them. If a component is removed while a global listener, interval, or subscription remains, it may keep running and keep state reachable. Pair setup with teardown: React effect cleanup, Angular `takeUntilDestroyed` or `async` pipe, and explicit `AbortController`/listener cleanup where appropriate. A finished one-shot timer generally releases its callback; repeating or continually rescheduled timers are more concerning.

## 32. Process a very large array without freezing the browser

**Interview answer:** First ask whether all records should be on the client. If they must be, process in bounded chunks and yield to the browser between chunks, or move CPU-heavy transforms to a Web Worker. Virtualize the visible rows so DOM size stays small. Async syntax alone does not make a CPU loop non-blocking.

```js
async function processInChunks(items, transform, chunkSize = 1_000) {
  const result = [];
  for (let start = 0; start < items.length; start += chunkSize) {
    const end = Math.min(start + chunkSize, items.length);
    for (let i = start; i < end; i++) result.push(transform(items[i]));
    await new Promise(resolve => setTimeout(resolve, 0)); // yield a task
  }
  return result;
}
```

Tune chunk size using measured frame time. A zero-delay timer is a practical yield but has scheduling overhead and possible clamping; use a worker for substantial computation. Avoid making a 100,000-row DOM table even if transformation is fast.

## 33. Web Workers

**Interview answer:** A Web Worker runs JavaScript off the main UI thread. It is suited to CPU-heavy parsing, calculations, data transforms, and image work, keeping interactions responsive. Workers communicate through messages using structured cloning or transferable objects and cannot directly access the DOM.

```js
// main.js
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
worker.onmessage = ({ data }) => renderSummary(data);
worker.postMessage(records);
// worker.js
self.onmessage = ({ data }) => {
  const total = data.reduce((sum, row) => sum + row.amount, 0);
  self.postMessage({ total });
};
```

Move large binary buffers as transferables when possible to avoid copying cost. Terminate idle workers and handle errors. A worker does not automatically make network requests faster or solve backend bottlenecks.

## 34. ES modules, import/export and tree shaking

**Interview answer:** ES modules use static `import` and `export` declarations. Each module has its own scope, runs once per module instance, and exposes live bindings. Static structure lets build tools analyze dependencies and omit unused exports where code is safe to remove (tree shaking).

```js
// math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
// app.js
import { add } from './math.js';
console.log(add(2, 3));
```

`import()` loads dynamically and returns a Promise, useful for route-level code splitting. Tree shaking depends on bundler configuration and side effects; importing a module with top-level side effects can keep it in the bundle. `export default` and named exports are both valid; use a consistent team convention.

## 35. CommonJS versus ES Modules

| Aspect | CommonJS | ES Modules |
| --- | --- | --- |
| Syntax | `require()`, `module.exports` | `import`, `export` |
| Dependency structure | Typically resolved during execution | Static imports analyzable before execution |
| Loading behavior | Synchronous `require` in traditional Node usage | Module linking/evaluation; supports dynamic `import()` and top-level `await` |
| Exports | Exported value/object; Node caching applies | Live exported bindings |
| Typical environment | Older Node ecosystems | Browsers and modern Node/build tools |

```js
// CommonJS
const { add } = require('./math.cjs');
module.exports = { add };
// ES module
import { add } from './math.js';
export { add };
```

In Node.js, extension and package configuration (`type: "module"`) affect interpretation and interoperability. Do not assume `require()` and `import` are mechanically interchangeable, especially with ESM-only dependencies or top-level await.

## 36. Retry with exponential backoff

**Interview answer:** Retry transient network failures, 429, and selected 5xx responses with increasing delay, a retry limit, and jitter. Honor `Retry-After` where applicable. Do not automatically retry arbitrary non-idempotent writes without an idempotency key or server guarantee.

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function getWithRetry(url, maxAttempts = 4) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      if (response.status !== 429 && response.status < 500) {
        throw Object.assign(new Error(`HTTP ${response.status}`), { retryable: false });
      }
      throw new Error(`Transient HTTP ${response.status}`);
    } catch (error) {
      if (error.retryable === false || attempt === maxAttempts - 1) throw error;
      const cap = Math.min(500 * 2 ** attempt, 8_000);
      await delay(Math.random() * cap); // full jitter
    }
  }
}
```

A production helper should accept `AbortSignal`, check cancellation during waits, parse valid `Retry-After`, and distinguish transient network errors from programmer errors. Backoff reduces load during outages; it is not a substitute for showing a useful failure state.

## 37. Process 1,000 requests with concurrency of 10

**Interview answer:** Start a fixed number of workers. Each worker claims the next index and awaits its request before claiming another. This bounds in-flight requests and avoids launching 1,000 operations at once.

```js
async function mapLimit(items, limit, fn) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit must be positive');
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++; // claim synchronously before awaiting
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
const responses = await mapLimit(ids, 10, id => fetch(`/api/items/${id}`));
```

On first failure, the aggregate rejects, but already-running workers can continue. Add an abort signal or `allSettled`-style result capture if your requirements call for it. Respect API rate limits separately: concurrency 10 does not guarantee at most 10 requests per second.

## 38. Separate business logic from UI/framework code

**Interview answer:** Keep domain rules in plain functions or services with explicit inputs/outputs. Put HTTP, storage, and clock access behind adapters; let React or Angular components coordinate interactions and display state. This makes rules reusable and testable without rendering a UI.

```js
// domain/approval.js
export function canApprove(section, user) {
  return section.status === 'Submitted' &&
    section.reviewerId === user.id &&
    section.authorId !== user.id;
}

// application/approveSection.js
export async function approveSection(section, user, repository) {
  if (!canApprove(section, user)) throw new Error('Approval not allowed');
  return repository.approve(section.id, section.version);
}

// UI handler
async function onApprove() {
  const updated = await approveSection(section, user, sectionApi);
  setSection(updated);
}
```

The server must enforce authorization and transitions too; client-side rules only improve the experience. Version checking at the API protects against another reviewer changing the section between display and submission.

## 39. Page slows after several hours: investigation

**Interview answer:** Establish a repeatable workload and gather a timeline instead of guessing. Inspect long tasks, scripting time, heap growth, detached DOM nodes, listeners, timers, network polling, and rendered component counts. Compare an early and late heap snapshot and follow retention paths for objects that should have disappeared.

**Practical sequence:** (1) Capture CPU and memory baseline after startup. (2) Repeat normal navigation and editing. (3) Check whether listeners/subscriptions and heap return near baseline after leaving a screen. (4) Profile a slow interaction for long tasks, layout and rendering cost. (5) Inspect request counts and cache sizes over time. (6) Fix one suspected retention or repeated-work source, then measure again. Browser extensions and server latency can also affect perceived slowness, so compare isolated sessions and network timing.

A common example is a component registering a `window` listener on every mount without cleanup. Another is an unbounded query cache retaining every search term. The fix should match the measured cause.

## 40. API returns 100,000 records: client or server filtering?

**Interview answer:** Usually filter, sort, and paginate on the server so the browser receives only the needed slice. Sending 100,000 records costs bandwidth, memory, parsing time, and DOM work; it also risks exposing fields the client did not need. The server can use indexes and enforce authorization before returning results.

```text
GET /api/orders?status=Open&search=acme&pageSize=50&cursor=eyJpZCI6...
→ { items: [up to 50 orders], nextCursor: '...' }
```

Client filtering is reasonable when the dataset is small, already loaded for another purpose, stable, and the interaction needs instant local refinement. For genuinely offline workflows, download a bounded, authorized dataset, store it deliberately, and consider a worker for heavy transforms. Prefer cursor pagination for changing large datasets, choose indexes based on actual filters, and return total counts only when the UI needs them. With 100,000 records, virtualizing the table helps rendering but does not solve unnecessary transfer or parsing.

---

## Quick interview practice prompts

1. Predict `A, B, C, D` in question 1 and explain which queues are involved.
2. Explain why `Promise.all` rejecting does not cancel successful or pending requests.
3. Design a search box that debounces input, aborts stale requests, guards response order, and cleans up on unmount.
4. Explain how you would prove a memory leak with heap snapshots rather than infer one from a single high-memory reading.
5. For a 100,000-record data grid, discuss backend filtering, authorization, pagination, caching, and UI virtualization.

**Interview tip:** Give the rule first, explain a realistic failure mode, then show the safeguard and its limits. For frontend concurrency, distinguish protecting displayed state from ensuring server-side data consistency.
