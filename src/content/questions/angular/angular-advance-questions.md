---
id: angular-advanced-questions-001
slug: angular-advanced-questions
title: Angular Change Detection?
categoryId: angular
subcategory: Angular-Change Detection
difficulty: Basic
tags:
  - angular
  - advance-questions
  - angular-advance
  - change detection
summary: Angular-Advanced-Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Angular Advanced Questions

## What is Change Detection ?

**Change Detection** is the mechanism Angular uses to check whether application data has changed and update the DOM (UI) accordingly.

Whenever a component's data changes, Angular can detect the change and update the corresponding HTML.

**1. What is Change Detection in Angular?**

**Interview answer:**

**Change Detection** is an Angular mechanism by which UI will reflect the latest value, that particular variable has (Lets say you have created variable and that variable you have binded to HTML and that variable value get changed from event or somewhere as soon as the variable value get changed UI will show the latest value, that is UI your template will detect the change happen in that variable.So it will detect the it will display the latest value. that is your **Change Detection**)

**Change Detection** is an Angular mechanism that synchronizes component data with the view. Angular checks bindings and updates the DOM when their values change.

**How many ways change detection will happen?**
- Once you click on it (click event)
- setTimout
- setIntervel
- Async kind of code

everything will trigger change detection

**2. Simple example**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <h2>Count: {{ count }}</h2>
    <button (click)="increment()">Increment</button>
  `
})
export class CounterComponent {

  count = 0;

  increment() {
    this.count++;
  }
}
```
How it works:

![Angular Buildings](/images/angular/changedetection1.png)

**3. Types of Change Detection Strategies**
Angular provides two main change detection strategies.

| Default | OnPush |
|---|---|
| `ChangeDetectionStrategy.Default` | `ChangeDetectionStrategy.OnPush` |
| Uses CheckAlways behavior | Uses CheckOnce behavior |
| Checks during normal change detection runs | Checks when specifically notified or triggered |
| Simple to use | Helps skip unnecessary component checks |
| May perform more checks | Can improve performance |
| No special configuration required | Explicitly configured |

**A. Default Change Detection**

```typescript
import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <h2>{{ name }}</h2>
    <button (click)="changeName()">Change</button>
  `
})
export class UserComponent {

  name = 'Venkat';

  changeName() {
    this.name = 'Ram';
  }
}
```
Angular checks the component during normal change detection and updates the displayed name.

**B. OnPush Change Detection**
```typescript
import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ name }}</h2>
    <button (click)="changeName()">Change</button>
  `
})
export class UserComponent {

  name = 'Venkat';

  changeName() {
    this.name = 'Ram';
  }
}
```
The click event inside the component triggers change detection, so the name updates even with OnPush.

**Important:** OnPush does not mean Angular checks a component only when its @Input() changes.

Other triggers include events in its subtree, signals read in its template changing, AsyncPipe, and explicitly marking the component for checking.

**4. OnPush with @Input() — Important interview question**
Consider a parent component passing a user object to a child component.

Child component
```typescript
@Component({
  selector: 'app-child',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>{{ user.name }}</h2>`
})
export class ChildComponent {
  @Input() user!: { name: string };
}
```
Parent component
```typescript
export class ParentComponent {

  user = { name: 'Venkat' };

  updateUser() {
    this.user.name = 'Ram';
  }
}
```
The parent mutates the existing object.
![Angular Buildings](/images/angular/changedetection2.png)
Interview tip: With OnPush, use immutable updates when passing arrays or objects through inputs.

**5. Change Detection with Signals (Modern Angular)**

Signals provide reactive state management. Angular tracks signals read in templates and marks their components for checking when those signals change.

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <h2>{{ count() }}</h2>

    <button (click)="increment()">
      Increment
    </button>
  `
})
export class CounterComponent {

  count = signal(0);

  increment() {
    this.count.update(value => value + 1);
  }
}
```
Here:

- signal(0) creates reactive state.
- count() reads the signal.
- count.update() modifies its value.
- Angular marks the component for checking and updates the template when change detection runs.

Signals work particularly well with OnPush.

**6. ChangeDetectorRef — Manual Change Detection**

Angular provides ChangeDetectorRef to control change detection manually.

| Method | Purpose |
|---|---|
| `markForCheck()` | Marks the view for checking in a future change detection run. |
| `detectChanges()` | Immediately checks this view and its children. |
| `detach()` | Detaches the view from the change detection tree. |
| `reattach()` | Reattaches the view to the change detection tree. |
| `checkNoChanges()` | Development-only verification API; deprecated. |

Example:

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2>{{ message }}</h2>`
})
export class DemoComponent {

  message = 'Hello';

  constructor(private cdr: ChangeDetectorRef) {}

  updateMessage() {
    this.message = 'Welcome';

    this.cdr.markForCheck();
  }
}
```
markForCheck() marks the view as needing a check. It does not immediately execute change detection.

**7. Change Detection and ngDoCheck()**

ngDoCheck() is a lifecycle hook invoked when Angular checks the component.

```typescript
import {
  Component,
  DoCheck
} from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `<h2>{{ name }}</h2>`
})
export class DemoComponent implements DoCheck {

  name = 'Venkat';

  ngDoCheck() {
    console.log('Change detection check');
  }
}
```
Important: ngDoCheck() can execute frequently. Avoid expensive operations inside it.

**8. Angular Change Detection — Interview Questions**

1. What is Change Detection in Angular?

It is the mechanism that checks template bindings and updates the DOM when their values change.

2. What are the two change detection strategies?

Default (CheckAlways) and OnPush (CheckOnce). OnPush allows Angular to skip component subtrees when they do not need checking.

3. Does OnPush detect object mutation?

Mutating an object passed through @Input does not by itself trigger OnPush checking because its reference remains unchanged. Other triggers, such as events, can still cause the component to be checked.

4. What is the difference between markForCheck() and detectChanges()?

markForCheck() marks the view for a future check. detectChanges() synchronously checks the view and its children.

5. How do Signals work with OnPush?

When a signal read in an OnPush template changes, Angular marks that component for checking.

6. What is the role of Zone.js?

In zone-based Angular applications, Zone.js helps Angular identify when asynchronous activity has completed and change detection may need to run. Angular also supports zoneless change detection.

7. How can we optimize change detection?

Use OnPush where appropriate, Signals, AsyncPipe, immutable input updates, track expressions in loops, and avoid expensive template computations.

**Final interview answer**

**Change Detection** in Angular is the mechanism that synchronizes component data with the DOM. Angular provides two strategies: Default and OnPush. Default checks components during normal change detection, whereas OnPush allows Angular to skip unnecessary checks. We can optimize performance using OnPush, Signals, AsyncPipe, immutable updates, and ChangeDetectorRef when manual control is required.


## NgZone in Angular

**1. What is NgZone in Angular?**

**NgZone** is an Angular service that helps manage change detection by controlling whether code executes inside or outside Angular's zone.

In zone-based Angular applications, it helps Angular respond to asynchronous operations such as timers, promises, and browser events.

**Interview answer:**

"NgZone is an Angular service that allows us to execute code inside or outside Angular's zone. It helps control change detection and improve performance by running unnecessary background operations outside Angular's zone."

**2. How NgZone works**

![Angular Buildings](/images/angular/changedetection3.png)

This diagram represents traditional Zone.js-based change detection. Modern Angular also supports zoneless change detection.
**3. Important NgZone Methods**

| Method | Purpose |
|---|---|
| `run()` | Executes code inside Angular's zone. |
| `runOutsideAngular()` | Executes code outside Angular's zone. |
| `isInAngularZone()` | Checks whether the current code is running inside Angular's zone. |
| `assertInAngularZone()` | Throws an error if code is outside Angular's zone. |
| `assertNotInAngularZone()` | Throws an error if code is inside Angular's zone. |

**4. Example: NgZone.run()**

run() executes code inside Angular's zone.

```typescript
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `<h2>{{ message }}</h2>`
})
export class DemoComponent {

  message = 'Hello';

  constructor(private ngZone: NgZone) {}

  updateMessage() {

    this.ngZone.run(() => {
      this.message = 'Welcome';
    });

  }
}
```
Explanation:

- ngZone.run() enters Angular's zone.
- The message changes from Hello to Welcome.
- In a typical zone-based application, Angular can subsequently run change detection and update the view.

Note: Calling run() is not required for ordinary Angular click handlers because they already execute inside Angular's zone.

**5. Example: NgZone.runOutsideAngular()**

runOutsideAngular() executes code outside Angular's zone to avoid unnecessary change-detection triggers from asynchronous work.

```typescript
import {
  Component,
  NgZone,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `<h2>{{ count }}</h2>`
})
export class DemoComponent implements OnDestroy {

  count = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private ngZone: NgZone) {}

  startTimer() {

    this.ngZone.runOutsideAngular(() => {

      this.timer = setInterval(() => {

        console.log('Background task');

      }, 1000);

    });

  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
```
Explanation:

- The timer is created outside Angular's zone.
- Its callback executes outside Angular's zone.
- The timer itself does not trigger Angular's Zone.js-based change detection.
- This can improve performance when frequent background operations do not need UI updates.

**6. Real-time example: Run outside Angular and update UI inside Angular**

This is an important interview scenario.

Suppose a timer performs background work every second, but the UI needs updating only once every five seconds.

```typescript
import {
  Component,
  NgZone,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <h2>Count: {{ count }}</h2>
    <button (click)="start()">Start</button>
  `
})
export class CounterComponent implements OnDestroy {

  count = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private ngZone: NgZone) {}

  start() {

    if (this.timer) return;

    this.ngZone.runOutsideAngular(() => {

      this.timer = setInterval(() => {

        this.count++;

        if (this.count % 5 === 0) {

          this.ngZone.run(() => {
            // Re-enter Angular's zone.
            // The view can now be checked.
          });

        }

      }, 1000);

    });

  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
```
For this example, the UI is intended to update every five seconds in a typical Zone.js-based application using Default change detection.

For an OnPush component, explicitly mark it for checking or use a signal. For an immediate update, ChangeDetectorRef.detectChanges() is another option.

**NgZone: run() vs runOutsideAngular()**

| `run()` | `runOutsideAngular()` |
|---|---|
| Executes inside Angular's zone | Executes outside Angular's zone |
| Async work can trigger zone-based change detection | Async work does not itself trigger zone-based change detection |
| Useful when returning to Angular from external callbacks | Useful for frequent background operations |
| Used when UI needs Angular's change-detection handling | Used to avoid unnecessary zone-based change detection |

**8. Real-world use cases**

NgZone is useful when working with:

- High-frequency mouse movement or scrolling events.
- Charts and animations with frequent callbacks.
- Third-party JavaScript libraries.
- Background timers and polling.
- External callbacks that execute outside Angular's zone.

For example, a chart library might generate hundreds of events per second. Running its non-UI work outside Angular's zone can avoid unnecessary change-detection cycles.

**9. NgZone interview questions**

1. What is NgZone?

NgZone is an Angular service that lets us execute code inside or outside Angular's zone. It is useful for controlling zone-based change detection.

2. What is the difference between run() and runOutsideAngular()?

run() enters Angular's zone. runOutsideAngular() executes outside it, preventing its asynchronous tasks from independently triggering zone-based change detection.

3. Does runOutsideAngular() completely disable change detection?

No. It prevents zone-based triggers from work scheduled outside the zone. Signals, explicit change-detection APIs, and other notifications may still cause checks.

4. Does NgZone work with OnPush?

Yes. NgZone and OnPush solve different problems. NgZone controls zone execution; OnPush determines when a component subtree is eligible for checking.

5. What is the difference between NgZone and ChangeDetectorRef?

NgZone controls execution inside or outside Angular's zone. ChangeDetectorRef controls checking of a component view using methods such as markForCheck() and detectChanges().

6. Is NgZone mandatory in modern Angular?

No. Angular supports zoneless change detection. In zoneless applications, UI updates rely on explicit Angular notifications such as signals, template listeners, and ChangeDetectorRef rather than Zone.js tracking.

**Final interview answer**

"**NgZone** is an Angular service that helps control change detection by executing code inside or outside Angular's zone. We use runOutsideAngular() for frequent background operations to avoid unnecessary change detection, and run() to re-enter Angular's zone when needed. This is particularly useful for timers, animations, and third-party libraries. Modern Angular also supports zoneless change detection."