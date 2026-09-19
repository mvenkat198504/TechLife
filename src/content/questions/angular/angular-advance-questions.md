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

%%%
---
id: angular-advanced-questions-002
slug: angular-advanced-questions-DI
title: Angular Dependency Injection
categoryId: angular
subcategory: Angular-Dependency-Injection
difficulty: Intermediate
tags:
  - angular
  - Angular Dependency Injection
  - angular DI
  - advanced
summary: Angular-Dependency-Injection
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Angular Dependency Injection

## Dependency Injection (DI)

**1. What is Dependency Injection in Angular?**
**DI** is a design pattern and mechanism for creating and delivering some parts of an app to other parts of an app that require them.

Dependency injection , or DI is one the fundamental concepts in Angular. DI is wired into the Angular framework and allows classes with angular decorotos, such as Componenents, Directives,Pipes, and Injectables, to configure dependencies that they need.

Two main roles exist in the DI system: dependency consumer and dependency provider.

**Interview answer:**

"Dependency Injection is a design pattern that allows Angular to inject services into components or other services. It promotes loose coupling, code reusability, maintainability, and testability."

How Dependency Injection works
![Angular Buildings](/images/angular/DI_1.png)

**2. Example 1: Dependency Injection using LoggerService**

Consider a LoggerService that logs messages to the browser console.

Step 1: Create LoggerService

Run the Angular CLI command:
```
ng generate service services/logger
```
File: logger.service.ts
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR]: ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARNING]: ${message}`);
  }
}
```
Explanation:

- @Injectable() marks the class as available for Angular's dependency injection system.
- providedIn: 'root' registers the service with the root environment injector.
- Angular generally creates one shared instance for the application when the service is first requested.
- The service contains reusable logging methods.

**Step 2: Inject LoggerService into a component**

File: app.component.ts

```typescript
import { Component } from '@angular/core';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h2>Dependency Injection Example</h2>

    <button (click)="save()">
      Save
    </button>
  `
})
export class AppComponent {

  constructor(
    private logger: LoggerService
  ) {}

  save(): void {

    this.logger.log('Save button clicked');

    this.logger.warn('Checking data');

    this.logger.error('Sample error');

  }
}
```
**Why is this Dependency Injection?**

We are not creating the service manually:
```typescript
const logger = new LoggerService();
```
nstead, Angular provides the service through the constructor:
```typescript
constructor(private logger: LoggerService) {}
```
This is called Constructor Injection.

**3. Example 2: Dependency Injection using an API Service**

This is a practical example commonly used in Angular applications.

We will create a service to fetch employee details from an API.

**Step 1: Configure HttpClient**

For modern standalone Angular applications, configure HttpClient in app.config.ts.
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
```
provideHttpClient() registers the dependencies required by Angular's HTTP client.

**Step 2: Create EmployeeService**

```
ng generate service services/employee
```
File: employee.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:7001/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {

    return this.http.get<Employee[]>(this.apiUrl);

  }

  getEmployee(id: number): Observable<Employee> {

    return this.http.get<Employee>(
      `${this.apiUrl}/${id}`
    );

  }
}
```
Explanation:

Angular injects HttpClient into EmployeeService.
```typescript
constructor(private http: HttpClient) {}
```
The service then uses HttpClient to call the API.

**Step 3: Inject EmployeeService into EmployeeComponent**

File: employee.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from './employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  template: `
    <h2>Employee List</h2>

    @for (emp of employees; track emp.id) {
      <p>{{ emp.name }} - {{ emp.department }}</p>
    }
  `
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {

    this.employeeService.getEmployees()
      .subscribe({
        next: (data) => {
          this.employees = data;
        },
        error: (err) => {
          console.error(err);
        }
      });

  }
}
```
![Angular Buildings](/images/angular/DI_2.png)
The API URL is an example. Replace it with your actual API endpoint and configure CORS on the backend if the Angular app and API use different origins.

**4. Constructor Injection vs inject() Function**

Modern Angular supports two common ways to inject services.

**Constructor injection**
```typescript
export class EmployeeComponent {

  constructor(
    private employeeService: EmployeeService
  ) {}

}
```
**inject() function**
```typescript
import { inject } from '@angular/core';

export class EmployeeComponent {

  private employeeService =
    inject(EmployeeService);

}
```
Both approaches request a dependency from Angular's injection system.

The inject() function must be called in a valid injection context, such as a field initializer, constructor, or provider factory. It cannot ordinarily be called inside an arbitrary component method.

**5. What is providedIn: 'root'?**
```typescript
@Injectable({
  providedIn: 'root'
})
```
This registers the service with the root environment injector.

The same service instance is normally shared across components that resolve it from that injector.

![Angular Buildings](/images/angular/DI_3.png)

**6. Service provided at component level**
```typescript
@Component({
  selector: 'app-employee',
  standalone: true,
  providers: [LoggerService],
  template: `<h2>Employee</h2>`
})
export class EmployeeComponent {

  constructor(private logger: LoggerService) {}

}
```
When LoggerService is registered in the component's providers array, each component instance gets its own service instance. Its descendants can share that instance unless they override the provider.

| Root Provider | Component Provider |
|---|---|
| `providedIn: 'root'` | `providers: [LoggerService]` |
| Shared root-level instance | Instance scoped to component |
| Suitable for API services and shared state | Suitable for component-specific state |
| Generally available application-wide | Available to component and descendants |

**7. Advantages of Dependency Injection**

| Advantage | Explanation |
|---|---|
| Loose coupling | Components depend on injected services rather than creating them |
| Reusability | Same service can be used across components |
| Testability | Dependencies can be replaced with mocks or stubs |
| Maintainability | Business logic remains separate from UI logic |
| Instance management | Angular manages service creation and lifetime |
| Hierarchical DI | Different injectors can provide different instances |

**8. Angular DI vs ASP.NET Core DI**

Since the concepts are similar, here is a comparison.
| Angular | ASP.NET Core |
|---|---|
| `@Injectable()` | Service class registration |
| `providedIn: 'root'` | Similar to Singleton in typical application scope |
| Component `providers` | Child dependency-injection scope (conceptually) |
| Constructor injection | Constructor injection |
| `inject()` | Resolving dependencies through the DI system |
| Injector | `IServiceProvider` |

**9. Dependency Injection interview questions**

1. What is Dependency Injection in Angular?

It is a design pattern where Angular creates and supplies dependencies to components or services through its injector.

2. What is @Injectable()?

It is a decorator that marks a class as injectable and allows Angular to generate the necessary dependency-injection metadata.

3. What is providedIn: 'root'?

It registers the service with the root environment injector, generally providing one shared instance unless another injector overrides it.

4. What is the difference between constructor injection and inject()?

Constructor injection declares dependencies as constructor parameters. inject() retrieves dependencies directly within a valid Angular injection context.

5. Can one service inject another service?

Yes. For example, EmployeeService can inject HttpClient and LoggerService through its constructor or the inject() function.

6. How do you create separate service instances?

Provide the service in a component's providers array. Each component instance receives its own provider instance.

7. How does DI improve unit testing?

It allows us to replace real dependencies with mocks or stubs. For example, an EmployeeComponent test can inject a mock EmployeeService without calling the real API.

8. What happens if Angular cannot find a provider?

Angular throws a NullInjectorError unless the dependency is optional or otherwise handled.

**Final interview answer**

"Dependency Injection in Angular is a design pattern where Angular creates and provides services to components or other services through its injector.

For example, I create a LoggerService with @Injectable({ providedIn: 'root' }) and inject it into a component using constructor injection or the inject() function.

Similarly, EmployeeService can inject HttpClient to communicate with a backend API.

Dependency Injection improves loose coupling, reusability, maintainability, and unit testing."