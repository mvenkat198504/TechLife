---
id: angular-optimization-questions-001
slug: angular-optimization-questions
title: Angular Optimization
categoryId: angular
subcategory: Angular-Optimization
difficulty: Basic
tags:
  - angular
  - advance-questions
  - Optimization
  - Angular Performance Optimization
summary: Angular Performance Optimization
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Angular Performance Optimization: Move Business Logic Out of Components

## Problem

A component injecting 6+ services, holding business logic, transforming data, and managing subscriptions has compounding costs.

- Every injected reactive dependency that the template touches is a potential change detection (CD) trigger.
- More responsibilities mean more places where memory leaks can occur.
- Complex components become difficult to maintain and test.

## Solution

Move data transformation and orchestration out of the component into a **Facade Service**.

**Principle:** Components bind data; they should not handle complex business logic.

---

### Before — Business Logic Inside Component

```typescript
export class DashboardComponent implements OnInit, OnDestroy {

  private subs = new Subscription();

  users: EnrichedUser[] = [];

  constructor(
    private userService: UserService,
    private orgService: OrgService,
    private permissionService: PermissionService,
    private analytics: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.subs.add(

      combineLatest([
        this.userService.getUsers(),
        this.orgService.getOrgs()
      ])
      .subscribe(([users, orgs]) => {

        this.users = users.map(u => ({
          ...u,
          orgName: orgs.find(o => o.id === u.orgId)?.name ?? 'Unknown',
          canEdit: this.permissionService.check(u.id, 'edit')
        }));

        this.cdr.markForCheck();

      })

    );

  }
    ngOnDestroy(){
        this.subs.unsubscribe();
    }
}
```

**Problems:**

- Component directly injects multiple services.
- Business logic and data transformation are inside the component.
- Manual subscription management is required.
- `markForCheck()` is called manually.
- Difficult to test and maintain.


---

### After — Facade Pattern with Signals and OnPush

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (u of users(); track u.id) {
      <user-row [user]="u" />
    }
  `
})
export class DashboardComponent {

  private facade = inject(DashboardFacade);

  users = this.facade.enrichedUsers; // thin binding layer only

}
```

### Explanation

- `DashboardFacade` handles business logic and data transformation.
- The component injects only the facade.
- `enrichedUsers` exposes reactive data through a signal.
- `OnPush` reduces unnecessary component checks.
- `@for` with `track u.id` helps Angular reuse existing DOM elements.
- The component focuses on displaying data.



---

## Before vs After Comparison

| Before | After |
|---|---|
| Multiple services injected | Facade service injected |
| Business logic inside component | Business logic moved to facade |
| Manual subscriptions | Facade exposes reactive state |
| Manual `markForCheck()` | Signal-driven updates with OnPush |
| Complex component | Thin presentation component |
| Difficult to maintain | Easier to maintain and test |

---

## Interview Question

**Q: How do you optimize a large Angular component that injects multiple services and performs complex data transformations?**

**Answer:**

I would use the Facade Pattern to separate business logic from presentation logic.

The facade handles service orchestration, data transformation, and reactive state management.

The component injects the facade and binds its signals directly to the template.

I would also use `ChangeDetectionStrategy.OnPush` and `@for` with a stable tracking key to reduce unnecessary change detection and DOM operations.

This improves separation of concerns, maintainability, testability, and can improve performance.

**Interview Tip:** A facade does not automatically improve change detection performance. The benefits come from separating responsibilities and combining it with appropriate reactive state management, OnPush, and efficient template bindings.

%%%
---
id: angular-optimization-questions-002
slug: angular-optimization-questions
title: Avoid Unnecessary Injectable Services
categoryId: angular
subcategory: Angular-Optimization
difficulty: Basic
tags:
  - angular
  - advance-questions
  - Optimization
  - Angular Performance Optimization
summary:  Avoid Unnecessary Injectable Services
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Angular Performance Optimization: Avoid Unnecessary Injectable Services

## Problem

Wrapping every stateless transformation in `@Injectable` adds unnecessary dependency injection (DI) overhead and increases the injector graph.

Unused services may not always be tree-shaken as reliably as unused pure functions.

**Performance impact:**
- Unnecessary dependency injection.
- Increased service instantiation and injector complexity.
- Potentially larger application bundles.
- Additional maintenance overhead.

## Solution

If a function is pure, export it from a plain `.ts` module instead of creating an Angular injectable service.

**Pure Function Characteristics:**
- Same input produces the same output.
- No side effects.
- Does not depend on injected state.
- Can be tested independently.

---

### Before — Unnecessary Injectable Service

```typescript
@Injectable({ providedIn: 'root' })
export class DateFormatterService {

  formatRelative(date: Date): string {
    /* pure logic */
    return '2 days ago';
  }

}
```

**Problem:**

- A service is created for a simple stateless transformation.
- Requires dependency injection to access the method.
- Adds unnecessary complexity when no Angular-specific dependency is needed.

---

### After — Use a Pure Function (Recommended)

**File: `date-utils.ts`**

```typescript
export function formatRelativeDate(date: Date): string {
  /* pure logic */
  return '2 days ago';
}
```

**Usage in a component:**

```typescript
import { formatRelativeDate } from './date-utils';

export class DashboardComponent {

  formattedDate = formatRelativeDate(
    new Date('2026-09-18')
  );

}
```

### Explanation

- No `@Injectable()` decorator is required.
- No dependency injection is needed.
- The function can be imported directly.
- Easier to test and reuse.
- Unused exports can potentially be removed during tree shaking.

**Note:** The date formatter shown above is a simplified example from the screenshot. It returns a fixed string rather than calculating the actual relative date.

---

## Before vs After Comparison

| Before: Injectable Service | After: Pure Function |
|---|---|
| Uses `@Injectable()` | Plain TypeScript function |
| Requires dependency injection | Direct function import |
| Adds to DI configuration | No injector involvement |
| Service instance may be created | No service instance required |
| Useful for stateful or dependency-based logic | Suitable for stateless transformations |
| More boilerplate for simple logic | Less boilerplate |

---

## Interview Question

**Q: When should you use a pure function instead of an Angular injectable service?**

**Answer:**

If the logic is stateless, has no side effects, and does not require dependency injection, I prefer a pure TypeScript function.

For example, simple date formatting, string manipulation, or mathematical calculations can be implemented as reusable utility functions.

I use Angular services when functionality requires dependency injection, shared state, HTTP communication, or coordination between multiple dependencies.

This reduces unnecessary abstraction and keeps the code easier to maintain and test.

---

## Key Takeaway

> "If it doesn't touch HTTP, state, or another Angular API, it doesn't belong in the injector."

**Interview Tip:** This is a useful guideline, not an absolute rule. Stateless services can still be appropriate when dependency injection is needed for abstraction, configuration, or replacing implementations during testing.


%%%
---
id: angular-optimization-questions-003
slug: angular-optimization-questions
title: Angular-Architecural-Pattern-Facade
categoryId: angular
subcategory: Angular-Architecural-Pattern
difficulty: Basic
tags:
  - angular
  - advance-questions
  - Architecural
  - Angular Architecural Pattern
summary:  Angular-Architecural-Pattern
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Angular Performance Optimization: Facade Design Pattern

## Problem

Every injected service is a node that Angular's dependency injector resolves.

Every reactive stream consumed by the template is a potential change detection (CD) trigger.

A component with 8 injected services may have:

- Multiple independent sources of reactive state.
- More complex dependency management.
- More places where subscription leaks can occur.
- Increased maintenance and testing complexity.

## Solution

Introduce a **Facade Pattern**.

A facade is a single service that composes underlying services or stores and exposes a minimal API to the component.

Instead of injecting multiple services directly into the component, inject one facade.

**Architecture:**

```text
Before:

OrderPageComponent
    |
    |-- OrderService
    |-- InventoryService
    |-- PricingService
    |-- UserService


After:

OrderPageComponent
    |
    |-- OrderFacade
           |
           |-- OrderService
           |-- InventoryService
           |-- PricingService
           |-- UserService
```

The facade reduces the component's direct dependencies from N services to 1.

---

### Before — Multiple Services Injected into Component

```typescript id="bz4t7k"
export class OrderPageComponent {

  constructor(
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private pricingService: PricingService,
    private userService: UserService
  ) {}

}
```

**Problems:**

- Component depends directly on four services.
- Component may need to coordinate multiple services.
- Business logic can become tightly coupled with UI logic.
- Testing requires managing multiple dependencies.
- Component becomes harder to maintain as features grow.

---

### After — Introduce OrderFacade

**File: `order.facade.ts`**

```typescript id="w9h4qm"
import { Injectable, inject, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderFacade {

  private orderService = inject(OrderService);

  private inventoryService = inject(InventoryService);

  private pricingService = inject(PricingService);

  private userService = inject(UserService);

  readonly orderSummary = computed(() => ({

    order: this.orderService.currentOrder(),

    inStock: this.inventoryService.isAvailable(
      this.orderService.currentOrder()
    ),

    price: this.pricingService.calculate(
      this.orderService.currentOrder()
    ),

    user: this.userService.currentUser()

  }));

}
```

### Explanation

1. `OrderFacade` is an Angular injectable service.

2. It injects the four underlying services.

3. The `computed()` signal combines information from multiple services.

4. It exposes a single `orderSummary` signal.

5. Components can consume the summary without knowing how the underlying services work.

**Important:** `computed()` tracks signals read during its execution. The example assumes `currentOrder()` and `currentUser()` are signal getters. If inventory or pricing depends on other reactive state, that state must also be read through signals for automatic recalculation.

---

## Using the Facade in a Component

The following component usage is an additional example.

**File: `order-page.component.ts`**

```typescript id="d3p7cx"
import {
  Component,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';

@Component({
  selector: 'app-order-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Order Summary</h2>

    <p>Price: {{ orderSummary().price }}</p>

    <p>In Stock: {{ orderSummary().inStock }}</p>
  `
})
export class OrderPageComponent {

  private facade = inject(OrderFacade);

  readonly orderSummary = this.facade.orderSummary;

}
```

### Explanation

- Component injects only `OrderFacade`.
- Component accesses the `orderSummary` signal.
- Business logic remains inside the facade and underlying services.
- Component focuses on displaying data.
- `OnPush` works with signal-based updates.

---

## Before vs After Comparison

| Before | After |
|---|---|
| Multiple services injected into component | Single facade injected |
| Component directly coordinates services | Facade coordinates services |
| Business logic may exist in component | Business logic moved to facade |
| Multiple direct dependencies | One direct facade dependency |
| Complex component testing | Simplified component testing |
| Tight coupling to underlying services | Component depends on facade API |

---

## Interview Question

**Q: What is the Facade Design Pattern in Angular, and why do we use it?**

**Answer:**

The Facade Design Pattern provides a simplified interface to a complex subsystem.

In Angular, we create a facade service that coordinates multiple services and exposes a simple API to components.

For example, an OrderPageComponent may require OrderService, InventoryService, PricingService, and UserService.

Instead of injecting all four services into the component, we create an OrderFacade that injects these services and exposes an `orderSummary` signal.

The component injects only the facade.

This improves:

- Separation of concerns.
- Maintainability.
- Testability.
- Reusability.
- Encapsulation of business logic.

---

## Important Interview Trap

**Q: Does the Facade Pattern automatically improve Angular change detection performance?**

**Answer:**

No.

The Facade Pattern primarily improves architecture by reducing direct dependencies and separating responsibilities.

Performance improvements depend on how the facade manages reactive state and how components consume it.

Using `computed()` signals, `OnPush`, and efficient subscriptions can help avoid unnecessary calculations and component checks.

The underlying services still exist and must be resolved by Angular's dependency injection system.

**Key takeaway:**

> The Facade Pattern simplifies the component's dependency graph, not necessarily the application's total dependency graph.