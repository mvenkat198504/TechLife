---
id: angular-basic-questions-001
slug: angular-basic-questions
title: Angular Fundamentals - Questions and Answers?
categoryId: angular
subcategory: Angular-Basics
difficulty: Basic
tags:
  - angular
  - basic-questions
  - angular-basics
summary: Angular Basic Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Angular Basics

## 1.Basic Fundamentals or Basic Building Block of Angular

**Angular Fundamentals – Basic Building Blocks**

Angular is a TypeScript-based frontend framework used to develop dynamic, component-based, single-page applications (SPAs).

**Interview answer: **

Angular applications are built using **components, templates, data binding, directives, pipes, services, dependency injection, routing, singals,httpclient,rxjs and other** supporting features.

![Angular Buildings](/images/angular/angular_buildings.png)

## 2. What is Components

A component is the fundamental building block of an Angular application. It controls a specific part of the user interface. All templates will be in the components only. Components is a kind or directive but with the template.

A component contains:

- TypeScript class – application logic.
- HTML template – user interface.
- CSS – styling.
- @Component decorator – component metadata.

## 3. What is Directive

Directives modify the behavior or appearance of DOM elements. Directives are extra behaviour of existing elements **(ngIf, ngFor, ngStyle, ngSwitch, ngClass, routerlink, routeroutlet, ng-Container,ng-template)**


- **Components** — directives with a template (@Component)
- **Structural** — change DOM layout (*ngIf, *ngFor, *ngSwitch)
- **Attribute** — change appearance/behavior (ngClass, ngStyle, custom ones)

Modern Angular also provides built-in control-flow syntax:
```html
@if (isLoggedIn) {
  <h2>Welcome</h2>
}

@for (employee of employees; track employee.id) {
  <p>{{ employee.name }}</p>
}
```
`@if` and `@for` are built-in control-flow blocks, not directives.

## 4. What is Decorator ?

Decorator  had a metadata , extra information about class, extra information about method,extra information about your properties that is nothing decorator 

**The Four Main Types of Decorators**

**1. Class Decorators**

These are placed directly above a class definition to configure its overarching behavior and tell Angular what role the class plays

- **@Component**: Declares that a class is a UI component and links it to a HTML template, CSS styles, and a selector.
- **@Injectable**: Marks a class as a service that can be handled by Angular's dependency injection system.
- **@Directive**: Used to create custom attributes or behaviors for DOM elements.
- **@Pipe**: Defines a class used for data transformation inside your templates
- **@Service**: From Angular 22

**2. Property Decorators**

These sit inside a class right above a specific property to alter how data flows into or out of it

- **@Input()**: Allows a parent component to pass data into a child component.
- **@Output()**: Allows a child component to send events or data back up to its parent component.
- **@ViewChild()**: Gives you direct access to a specific element or child component inside the HTML template


**3. Method Decorators**

These are applied to methods inside a class to alter their behavior or bind them to specific framework mechanisms

- **@HostListener()**: Listens for events on the host element (like user clicks or scrolls) and triggers the attached method automatically.

**4. Parameter Decorators**

These are used inside class constructors to modify how parameters are provided.

- **@Inject():** Manually specifies a exact dependency token to be injected into a service constructor.

## 5. Explain about Routing ?

Routing enables navigation between different views without reloading the entire application.

Angular is a single page application to achive multiple page navigation we use Routing, then we have multiple componenet want to access routes of it,for navigation we have routerlink,we can inject our router service by using that we have navigate one componenent to another , we have parameterized route,default route,wild card route also

1. Naviagate method (array)
2. Navigate by url  (string)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'employees',
    loadComponent: () =>
      import('./employee.component')
        .then(m => m.EmployeeComponent)
  },
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  }
];
```

**1. The Route Configuration (app.routes.ts)**

This is an array of objects where you map a URL path to a specific component

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: NotFoundComponent }         // Wildcard (404) route
];

```
- Order matters: Angular evaluates routes from top to bottom. The wildcard (**) matches anything, so it must always go last


The application must configure these routes using provideRouter(routes) and render the active route through RouterOutlet.

**2. The Placeholder (<router-outlet>)**

```html
<!-- app.component.html -->
<nav>
  <!-- Navigation bar code goes here -->
</nav>

<!-- The matching component will load right here -->
<router-outlet></router-outlet> 

```

**3. Template Navigation (routerLink)**

Instead of using standard HTML href="..." attributes (which force a hard page reload), you use the routerLink directive

```html
<a routerLink="/home">Home</a>
<a routerLink="/about">About Us</a>

```

**4. Code Navigation (Router Service)**

If you need to navigate automatically after an action occurs—like redirecting to a dashboard after a user logs in—you inject the Router service into your TypeScript code

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ ... })
export class LoginComponent {
  private router = inject(Router);

  login() {
    // Perform authentication logic, then redirect
    this.router.navigateByUrl('/dashboard');
  }
}

```

The application must configure these routes using provideRouter(routes) and render the active route through RouterOutlet.

## 6. Custom Directives? What scenario using for custom directives?

A custom directive is a reusable Angular class that adds behavior to HTML elements or modifies their appearance without creating a new component.

Angular provides built-in directives, but we can create our own using the @Directive decorator.

**Example: Custom Highlight Directive**

Step 1: Generate a directive 
```
ng generate directive highlight
```
Step 2: Implement the directive
highlight.ts

```typescript
import {
  Directive,
  ElementRef,
  Renderer2,
  inject
} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class Highlight {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      'yellow'
    );
  }
}
```
Step 3: Use it in an HTML template

For a standalone component, import the directive:
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Highlight],
  templateUrl: './app.html'
})
export class App {}
```
HTML:
```html
<p appHighlight>
  This text has a yellow background.
</p>
```
4. Interview answer

Interviewer: What is a custom directive in Angular?

A custom directive is a reusable class created using the @Directive decorator. It allows us to extend HTML element behavior without creating a separate component.

For example, we can create a highlight directive that changes an element's background color when the user hovers over it.

We can use HostListener to handle events and Renderer2 to modify element styles safely.

Key point: A component has its own template, whereas an attribute directive adds behavior to an existing element.

## 7. What is a Pipe in Angular?

A Pipe in Angular is used to transform data into a desired format before displaying it in the HTML template.

Pipes do not normally modify the original data. They transform the value for presentation.

Syntax:
```html
{{ value | pipeName }}
```
Example
```typescript
export class App {
  name = 'venkat';
  salary = 50000;
  today = new Date();
}
```
```html
<p>{{ name | uppercase }}</p>
<p>{{ salary | currency:'INR' }}</p>
<p>{{ today | date:'dd/MM/yyyy' }}</p>
```

2. Types of Pipes in Angular

- Built-in Pipes(Provided by Angular)
- Custom Pipes (Created by developers)

Example: 
**Built-in pipes**

```html
{{ 'hello angular' | uppercase }}
<!-- HELLO ANGULAR -->

{{ 'HELLO' | lowercase }}
<!-- hello -->

{{ 'hello angular' | titlecase }}
<!-- Hello Angular -->

{{ 1234.5 | currency:'INR' }}
<!-- ₹1,234.50 -->

{{ 0.75 | percent }}
<!-- 75% -->

{{ 1234.567 | number:'1.2-2' }}
<!-- 1,234.57 -->

{{ 'Angular' | slice:0:3 }}
<!-- Ang -->
```
**What is a Custom Pipe?**

A custom pipe is created by developers to implement application-specific data transformations.

Interview example: Create a pipe to display an employee's name with a prefix.

Step 2: Implement the pipe

name-prefix-pipe.ts

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namePrefix',
  standalone: true
})
export class NamePrefixPipe implements PipeTransform {

  transform(value: string, prefix: string): string {
    return `${prefix} ${value}`;
  }

}
```
Step 3: Import into a standalone component
```typescript
import { Component } from '@angular/core';
import { NamePrefixPipe } from './name-prefix-pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NamePrefixPipe],
  template: `
    <p>{{ name | namePrefix:'Mr.' }}</p>
  `
})
export class App {
  name = 'Venkat';
}
```

**Pure Pipe vs Impure Pipe**

| Pure Pipe | Impure Pipe |
|---|---|
| Default behavior | Explicitly configured |
| Executes when a primitive input changes or an object reference changes | Executes during every change-detection cycle |
| Generally better performance | Can be expensive |
| Does not detect in-place mutations within the same array/object reference | Can detect in-place mutations |
| `pure: true` | `pure: false` |


An impure pipe runs during each change-detection cycle, so it can detect changes made to the same array.

Interview tip: Prefer pure pipes whenever possible. Use impure pipes only when necessary because repeated execution can affect performance.

**What is Async Pipe?**

The AsyncPipe automatically subscribes to an Observable or Promise and returns its latest emitted or resolved value.

It also automatically unsubscribes from an Observable when the component is destroyed or the pipe's input changes.

Example with Observable
```typescript

import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <p>{{ username$ | async }}</p>
  `
})
export class App {
  username$: Observable<string> = of('Venkat');
}
```
Output:Venkat

Advantages:

- Automatically subscribes to Observables.
- Automatically manages subscription cleanup.
- Updates the view when new values arrive.
- Reduces manual subscription code.

**What is Pipe Chaining?**

Multiple pipes can be applied to a single value.
```html
{{ today | date:'fullDate' | uppercase }}
```
## 8. Common Angular Pipe Interview Questions

1. What is the difference between a Pipe and a Directive?

A pipe transforms a value for display, whereas a directive adds behavior or changes the structure or appearance of DOM elements.

2. What is the default type of Angular pipe?

Pure pipe. Angular uses pure: true by default.

3. Which interface is implemented by a custom pipe?

PipeTransform. It defines the transform() method.

4. Can we pass multiple parameters to a pipe?

Yes. Parameters are separated by colons. Example: {{ today | date:'dd/MM/yyyy':'UTC' }}.

5. Can we use multiple pipes together?

Yes. This is called pipe chaining. Example: {{ name | lowercase | titlecase }}.

6. Does AsyncPipe prevent memory leaks?

It automatically cleans up the subscription it owns when the component is destroyed or the input changes. It does not clean up unrelated subscriptions.

7. Why should we avoid impure pipes?

They execute during every change-detection cycle and can cause performance problems when the transformation is expensive.

8. Can pipes be used in TypeScript code?

Yes. Inject a suitable pipe such as DatePipe and call its transform() method. Register the pipe as a provider where needed.

```typescript
creditCardNo:string="11111222334445456"
constructor(private formatPiepe:CardNoFormaterPipe){
    const formatCardNo=this.formatPiepe.transform(this.creditCardNo)
}
```
**interview answer:** Angular Pipes transform data for display in templates. They are categorized as built-in and custom pipes, and can be pure or impure. The AsyncPipe is particularly useful for handling asynchronous data from Observables and Promises.

## 9. What is View Encapsulation in Angular?
VView Encapsulation in Angular controls how a component's CSS styles are scoped and applied to other components.

It helps prevent CSS styles defined in one component from unintentionally affecting other components.

Angular supports three types of View Encapsulation:

- 1.Emulated (Default)
- 2.ShadowDom
- 3.None

| Feature | Emulated | ShadowDom | None |
|---|---|---|---|
| Default | Yes | No | No |
| Style isolation | Simulated using generated attributes | Native Shadow DOM | No isolation |
| CSS scope | Component template | Shadow root | Global |
| Browser support | Standard CSS | Requires Shadow DOM support | Standard CSS |
| Usage | Most components | Web Components and strong style isolation | Global styles |

**Interview Questions and Answers**

Q1. What is the default View Encapsulation in Angular?

Answer: ViewEncapsulation.Emulated.

Q2. What happens when ViewEncapsulation.None is used?

Answer: Component styles become global and may affect other components.

Q3. What is the difference between Emulated and ShadowDom?

Answer: Emulated uses Angular-generated attributes to scope CSS, whereas ShadowDom uses the browser's native Shadow DOM.

Q4. Can parent component CSS affect a child component?

Answer: With Emulated, parent component styles do not normally target elements inside a child component's template. However, inherited CSS properties and global styles can still affect the child.

Q5. Which View Encapsulation should we use in a normal Angular application?

Answer: Emulated is the default and generally suitable for most application components. Use ShadowDom when native style isolation is required, and None when intentionally defining global styles.

Interview tip

Remember:

- Emulated: Angular-generated attribute-based CSS scoping.
- ShadowDom: Browser-native style isolation.
- None: Global CSS without encapsulation.

## Can we have a single file Component in Angular ?

Yes, you can have a single file in Angular that contains the TypeScript logic, the HTML template, and the CSS styles. This is known as a Single File Component (SFC)

Instead of linking to external .html and .css files, you define the template and styles inline directly inside the @Component decorator of your .ts file

**Example of a Single File Component**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-single-file',
  // 1. Inline Template using ES6 template literals (backticks)
  template: `
    <div class="card">
      <h1>Hello from a Single File!</h1>
      <p>This template, style, and logic live together.</p>
    </div>
  `,
  // 2. Inline Styles as an array of strings
  styles: [`
    .card {
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    h1 {
      color: #333;
    }
  `]
})
export class SingleFileComponent {
  // 3. TypeScript Logic
  constructor() {}
}
```

## Data Bindings? How many type of Data Bindings available?

Data Binding in Angular is a mechanism that establishes communication between a component's TypeScript class and its HTML template.

It allows data to flow from the component to the view, from the view to the component, or in both directions.

Angular supports four common types:

- 1. Interpolation
- 2. Property Binding
- 3. Event Binding
- 4. Two-Way Binding

**1. One Way Binding**

- Template to Class
- Class to Template
- Event Binding
- Interpolation
- Event Binding

**2. Types of Data Binding**

| Binding Type | Syntax | Direction | Purpose |
|---|---|---|---|
| Interpolation | `{{ value }}` | Component → View | Display data |
| Property Binding | `[property]` | Component → View | Set DOM/component properties |
| Event Binding | `(event)` | View → Component | Handle user events |
| Two-Way Binding | `[(ngModel)]` | Component ↔ View | Synchronize data |

**3. Interpolation – One-Way Binding**

Interpolation is used to display component data in the HTML template.

Syntax: {"{{ expression }}"}
```typescript
export class AppComponent {
  name = 'Venkat';
  age = 30;
}
```
```html
<h2>{{ name }}</h2>
<p>Age: {{ age }}</p>
```
```
// Output:
Venkat
Age: 30
```
4. Property Binding – One-Way Binding

Property Binding is used to bind component data to DOM element properties or component inputs.

Syntax: [property]="expression"

```typescript
export class AppComponent {
  imageUrl = 'assets/logo.png';
  isDisabled = true;
}
```
```html
<img [src]="imageUrl">

<button [disabled]="isDisabled">
  Save
</button>
```
Explanation:

- [src] binds the image URL.
- [disabled] controls the button's disabled state.

When isDisabled = true, the Save button is disabled.

**5. Event Binding – One-Way Binding**
Event Binding allows the HTML template to communicate with the component when a user performs an action.

Syntax: (event)="method()"

```typescript
export class AppComponent {
  message = '';

  saveData() {
    this.message = 'Data saved successfully';
  }
}
```
```html
<button (click)="saveData()">
  Save
</button>

<p>{{ message }}</p>
```
![Angular Buildings](/images/angular/databinding1.png)
Key point: Event Binding sends user actions from the view to the component.

**6. Two-Way Data Binding**

Two-Way Data Binding synchronizes data between the component and the HTML view.

When the component value changes, the view updates. When the user modifies the input, the component value also updates.

Syntax: [(ngModel)]="property"

It is also called Banana-in-a-Box syntax.

```typescript
export class AppComponent {
  username = 'Venkat';
}
```
```html
<input [(ngModel)]="username">

<p>{{ username }}</p>
```
Import FormsModule to use ngModel.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html'
})
export class AppComponent {
  username = 'Venkat';
}
```

![Angular Buildings](/images/angular/databinding2.png)

**7. How Two-Way Binding Works Internally**

Two-Way Binding using ngModel combines Property Binding and Event Binding.
```html
<!-- Two-way binding -->
<input [(ngModel)]="username">

<!-- Equivalent expanded syntax -->
<input
  [ngModel]="username"
  (ngModelChange)="username = $event"
>
```
![Angular Buildings](/images/angular/databinding3.png)

**8. Real-Time Example: Employee Registration Form**
```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee.html'
})
export class EmployeeComponent {
  employeeName = '';
  isDisabled = false;

  saveEmployee() {
    alert('Employee: ' + this.employeeName);
  }
}
```
```html
<h2>Employee Registration</h2>

<!-- Two-Way Binding -->
<input [(ngModel)]="employeeName">

<!-- Interpolation -->
<p>Employee: {{ employeeName }}</p>

<!-- Property + Event Binding -->
<button
  [disabled]="isDisabled"
  (click)="saveEmployee()">
  Save
</button>
```
![Angular Buildings](/images/angular/databinding4.png)

**9. Angular Data Binding Interview Questions**

Q1. What is Data Binding in Angular?

Data Binding connects a component's TypeScript properties and methods with its HTML template.

Q2. What are the four types of Data Binding?

Interpolation, Property Binding, Event Binding and Two-Way Binding.

Q3. What is the difference between Interpolation and Property Binding?

Interpolation displays values as text, while Property Binding assigns values to DOM properties or component inputs.

Q4. What is Banana-in-a-Box syntax?

`[(ngModel)]` is called Banana-in-a-Box syntax and supports two-way binding for form controls.

Q5. Which module is required for ngModel?

FormsModule from @angular/forms.

Q6. What is $event in Angular?

`$event` represents the data emitted by an event. For a native DOM event, it is typically the event object. For ngModelChange, it is the updated value.

Q7. Can we implement Two-Way Binding without ngModel?

Yes. We can combine Property Binding and Event Binding manually. Angular also supports two-way binding between components using compatible inputs and outputs or model inputs.

![Angular Buildings](/images/angular/databinding5.png)

## package.json in Angular – Interview Explanation

**1. What is package.json in Angular?**

Interview Answer:

`package.json` is a configuration file used in Angular projects to manage project information, dependencies, development dependencies, and npm scripts.

It is automatically created when we create a new Angular project using Angular CLI.

The package.json file is located in the root directory of the Angular project.

It is used to:

- Manage Angular and third-party package dependencies.
- Define npm commands such as start, build and test.
- Maintain project name and version.
- Specify package version requirements.
- Configure project-specific npm settings.

**2. Example of package.json**

Here is a simplified example of an Angular 21 project's package.json. Actual versions and scripts depend on the CLI version and project configuration.

```json
{
  "name": "employee-management",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/animations": "^21.0.0",
    "@angular/common": "^21.0.0",
    "@angular/compiler": "^21.0.0",
    "@angular/core": "^21.0.0",
    "@angular/forms": "^21.0.0",
    "@angular/platform-browser": "^21.0.0",
    "@angular/router": "^21.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  },
  "devDependencies": {
    "@angular/build": "^21.0.0",
    "@angular/cli": "^21.0.0",
    "@angular/compiler-cli": "^21.0.0",
    "typescript": "~5.9.0"
  }
}
```
**3. Important sections of package.json**

A. name

Specifies the project or package name.

```json
"name": "employee-management"
```
B. version

Specifies the project version.
```json
"version": "1.0.0"
```
Version format:

![Angular Buildings](/images/angular/packagejsonversion1.png)

C. private
```json
"private": true
```
Prevents accidental publication of the project as an npm package.

This is commonly used for Angular applications.

D. scripts

The scripts section defines commands that can be executed using npm.
```json
"scripts": {
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test",
  "watch": "ng build --watch"
}
```
Common npm commands
| Command | Purpose |
|---|---|
| npm start | Start Angular development server |
| npm run build | Build Angular application |
| npm test | Run unit tests |
| npm run watch | Build and watch for changes |
| npm install | Install project dependencies |

**4. dependencies vs devDependencies**
This is one of the most frequently asked Angular interview questions.

dependencies

Packages required by the application at runtime or included in its application dependency graph.

Example:
```json
"dependencies": {
  "@angular/core": "^21.0.0",
  "@angular/common": "^21.0.0",
  "@angular/router": "^21.0.0",
  "rxjs": "~7.8.0"
}
```
Examples include Angular Core, Router, Forms, RxJS and application UI libraries.

devDependencies

Packages primarily required during development, compilation, testing and building.
```json
"devDependencies": {
  "@angular/cli": "^21.0.0",
  "@angular/compiler-cli": "^21.0.0",
  "@angular/build": "^21.0.0",
  "typescript": "~5.9.0"
}
```
These packages are generally not part of the browser application's runtime bundle.

Comparison table
**dependencies vs devDependencies**

| dependencies | devDependencies |
|---|---|
| Application runtime dependencies | Development and build tools |
| Examples: Angular Core, Router, RxJS | Examples: Angular CLI, TypeScript, testing tools |
| Installed by npm install | Installed by npm install by default |
| Usually required for application functionality | Usually required to develop, test or build the application |
| npm install package-name | npm install -D package-name |

Important: Both dependency categories are installed by default with npm install. Production-only installation can omit devDependencies, but Angular builds generally require development tools.

**5. Understanding package version symbols**

Consider the following:
```json
"@angular/core": "^21.0.0"
```
What does ^ mean?

**Version symbols**
| Symbol | Example | Meaning |
|---|---|---|
| ^ | ^21.0.0 | Allows compatible updates below 22.0.0 |
| ~ | ~21.0.0 | Allows patch updates below 21.1.0 |
| Exact | 21.0.0 | Requires exactly version 21.0.0 |
| * | * | Allows any version |

For example:

^21.0.0 allows versions from 21.0.0 up to, but not including, 22.0.0.

~21.0.0 allows versions from 21.0.0 up to, but not including, 21.1.0.

Actual installed versions also depend on the lockfile, registry availability and dependency constraints.

**6. package.json vs package-lock.json vs node_modules**
![Angular Buildings](/images/angular/packagejsonversion2.png)
| File / Folder | Purpose | Commit to Git? |
|---|---|---|
| `package.json` | Defines dependencies and scripts | Yes |
| `package-lock.json` | Locks resolved dependency versions | Yes |
| `node_modules/` | Stores installed packages | No |

Interview tip: Commit both package.json and package-lock.json to Git. Use npm ci in CI/CD pipelines for reproducible installation from the lockfile.

**7. Common npm commands in Angular**
Command reference
```
# Install all dependencies
npm install

# Install Bootstrap
npm install bootstrap

# Install a development dependency
npm install -D typescript

# Remove a package
npm uninstall bootstrap

# Update packages within allowed ranges
npm update

# Check outdated packages
npm outdated

# Display installed packages
npm list

# Clean install for CI/CD
npm ci

# Build Angular application
npm run build
```
**8. Real-time scenario: npm dependency conflict**

Suppose your Angular application uses Angular 21, but you install a third-party package that only supports Angular 18.
```
npm install some-library
```
You may receive:
```
npm ERR! ERESOLVE unable to resolve dependency tree
```
This generally occurs because npm cannot satisfy the dependency or peer-dependency version requirements.

How to resolve it:

- Check the installed Angular version using ng version.
- Check the library's supported Angular versions and peer dependencies.
- Install a compatible version of the library.
- Run npm install again.

Avoid using --force or --legacy-peer-deps as the default solution because these options can bypass dependency compatibility checks.

**9. Angular package.json Interview Questions**

Q1 What is package.json?

It is the npm project manifest that defines project metadata, dependencies, devDependencies and scripts.

Q2 What is the difference between package.json and package-lock.json?

package.json defines dependency requirements and scripts. package-lock.json records exact resolved dependency versions and the dependency tree.

Q3 What is the difference between dependencies and devDependencies?

dependencies contain packages needed by the application, while devDependencies contain tools primarily used for development, testing and building.

Q4 What is the difference between npm install and npm ci?

npm install resolves and installs dependencies and may update the lockfile. npm ci performs a clean installation using the existing lockfile and fails if the manifest and lockfile disagree.

Q5 What happens if we delete node_modules?

The installed packages are removed. Run npm install or npm ci to restore them from the project manifest and lockfile.

Q6 What is the difference between ^ and ~?

For normal major versions, ^ allows compatible minor and patch updates, while ~ allows patch updates within the specified minor version.

Q7 Why should we commit package-lock.json?

It helps developers and CI/CD pipelines install the same resolved dependency versions.

Q8 What happens when we execute npm start?

npm executes the command defined under the start script in package.json.

**Quick interview summary**

`package.json` manages project dependencies, npm scripts, version requirements and metadata.

`package-lock.json` records exact resolved dependency versions.

`node_modules` contains the installed packages.

`npm install` installs dependencies, while npm ci performs a clean, lockfile-based installation commonly used in CI/CD.

## What is Standalone Component ?
- Standalone components are a new type of Angular component that does not need to be declared in a NgModule . These are components that can be used directly in the template of another component without being part of an NgModule, or imported in an NgModule.
- We Define standalone component by adding standalone field as true
- From Angular 16 we got standalone components
- From 18 By Defyalt all Components are standalone
```typescript
  @Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  standalone: true,
  styleUrl: './add-user.component.css'
})
```

## Purpose of the @ Component decorator?
The @Component decorator tells Angular that the class is a component, in component decorator we have so many options like
- **selector**: Defines the custom HTML tag used to embed the component.
- **template**: Inline HTML content for the component.
- **templateUrl**: Path to an external HTML file for the component template.
- **styles**: Inline CSS styles applied specifically to this component.
- **styleUrls**: Path(s) to external CSS/SCSS files for styling the component.
- **providers**: Registers services at the component level (local DI).
- **encapsulation**: Controls style encapsulation (Emulated, None, or ShadowDom).
- **changeDetection**: Sets the change detection strategy (Default or OnPush).
- **imports**: (Standalone only) Modules/components this standalone component depends on.
- **standalone**: (Angular 14+) Declares this component as standalone (not part of a module).

## @Input() and @ Output() decorators and how are they used?
- **@Input()**: Pass data from parent to child
- **@Output()**: Send event/data from child to parent

## Various ways of component communication
To pass data from one component to another there are following ways based on scenario

**In case of Parent - Child Relationship**
- using Input and Output.
- using viewChild.

**In case of No Parent - Child Relationship**
- using service by storing value into variables.
- using Subject & SubjectBehaviour of RXJS.
- using routing i.e. navigating from one component to another with query param.
- store data in local Storage or session Storage and read data wherever we need.

## Angular Lifecycle Hooks
ngOnChanges → ngOnInit → ngDoCheck → ngAfterContentInit/Checked → ngAfterViewInit/Checked → ngOnDestroy

Angular components and directives have a series of lifecycle phases from creation to destruction. Lifecycle hooks are special methods that allow you to write code onto these phases to execute custom logic.

**ngOnChanges**
- Invoked when any data-bound input property changes.
- Reacting to changes in @Input() properties
**ngOnInit**
- Called once after the first ngOnChanges().
- Initializing component properties, fetching data, or setting up subscriptions.​
**ngDoCheck**

The ngDoCheck lifecycle hook in Angular is a powerful tool for implementing custom change detection logic, especially when Angular's default change detection doesn't suffice.

It is called whenever Angular checks a component for changes, allowing us to detect changes that Angular's default change-detection mechanisms may not identify in the way our application requires.
Syntax:
```typescript
ngDoCheck(): void {
  // Custom change detection logic
}
```
**Real-Time Example: Detecting Array Changes**

Consider an employee-management application.

We have an employee array, and we want to detect when employees are added or removed.

```typescript
import {
  Component,
  DoCheck
} from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.html'
})
export class EmployeeComponent implements DoCheck {

  employees = ['Venkat', 'Ram'];

  previousCount = this.employees.length;

  addEmployee(): void {
    this.employees.push('Kumar');
  }

  ngDoCheck(): void {

    if (this.previousCount !== this.employees.length) {

      console.log('Employee count changed');

      this.previousCount = this.employees.length;
    }
  }
}
```
```html
<button (click)="addEmployee()">
  Add Employee
</button>

<ul>
  @for (employee of employees; track $index) {
    <li>{{ employee }}</li>
  }
</ul>
```
![Angular Buildings](/images/angular/lifecycle1.png)

**ngOnChanges vs ngDoCheck**

This is an important Angular interview question.

| ngOnChanges | ngDoCheck |
|---|---|
| Called when data-bound inputs change | Called whenever Angular checks the component |
| Automatically reports input changes | Requires custom comparison logic |
| Receives SimpleChanges | Does not receive SimpleChanges |
| Can detect new input references | Can detect in-place mutations with custom logic |
| Suitable for reacting to input changes | Suitable for custom change detection |
| Generally less frequent | Can execute frequently |

**Angular Lifecycle Hook Execution Order**

![Angular Buildings](/images/angular/lifecycle2.png)

On subsequent checks, ngDoCheck(), ngAfterContentChecked() and ngAfterViewChecked() can run again.

ngOnChanges() runs when relevant inputs change.

**ngAfterContentInit**

- Called after Angular projects external content into the component's view.
- Accessing projected content using ContentChild() or ContentChildren()​

**ngAfterContentChecked**

- Called after every check of projected content.
- Responding to changes in projected content.​

**ngAfterViewInit**
- Called after Angular initializes the component's views and child views.
- Accessing ViewChild() or ViewChildren() properties.​
- or DOM Interactions: Access and manipulate DOM elements only after the view has been initialized

**ngAfterViewChecked**
- Called after every check of the component's views and child views.
- Responding to changes in the component's view.​
**ngOnDestroy**
- Cleanup just before Angular destroys the component
- Unsubscribing from observables, detaching event handlers, or other cleanup tasks.​​

%%%
---
id: angular-basic-questions-002
slug: angular-signals-questions
title: Angular signals - Questions and Answers?
categoryId: angular
subcategory: Angular-Basics
difficulty: Basic
tags:
  - angular
  - signal-questions
  - signal
summary: Angular signals Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Angular Signals – Complete Interview Preparation Guide
## 1. What is a Signal in Angular?


![Angular pdf](/pdf/angular/Angular Signals Guide.pdf "Interview Guide")
<!-- 
Interview answer:

A Signal is a reactive wrapper around a value that notifies Angular when the value changes. Angular uses signals to track where state is read and update the relevant parts of the application efficiently.

Signals were introduced in Angular 16 and are commonly used for managing component state.

Key features:

Reactive state management.

Fine-grained dependency tracking.

Automatic dependency tracking for computed signals.

Supports primitive values, objects and arrays.

Works with Angular's change detection, including zoneless applications.

Simple example
```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <h2>Count: {{ count() }}</h2>

    <button (click)="increment()">Increment</button>
  `
})
export class CounterComponent {

  count = signal(0);

  increment() {
    this.count.update(value => value + 1);
  }
}
```
Explanation:

signal(0) creates a signal with an initial value of 0.

count() reads the current value.

update() calculates and sets a new value.

Angular marks the component for updating when a signal read in its template changes.

## 2. Types of Signals in Angular

There are three fundamental signal concepts commonly discussed in interviews.
![Angular Buildings](/images/angular/signals.png)

| Type | Purpose | Writable? |
|---|---|---|
| `signal()` | Stores reactive state | Yes |
| `computed()` | Calculates derived values | No |
| `effect()` | Executes side effects | Not a signal |
| `linkedSignal()` | Writable state linked to another reactive source | Yes |
| `input()` | Receives input from a parent | No |
| `model()` | Supports two-way component binding | Yes |

## 3. Writable Signal – signal()

A writable signal stores a value that can be modified using set() or update().

Syntax
```typescript
const count = signal(0);
```
Angular infers the signal's type from its initial value.
```typescript
const count = signal<number>(0);
const name = signal<string>('Venkat');
const isActive = signal<boolean>(true);
```
Important methods

| Method | Purpose |
|---|---|
| `signal()` | Creates a writable signal |
| `set()` | Replaces the current value |
| `update()` | Updates based on the previous value |
| `asReadonly()` | Exposes a read-only signal |
| `()` | Reads the current value |


Example: set() and update()
```typescript
import { signal } from '@angular/core';

const count = signal(10);

// Read
console.log(count()); // 10

// Set new value
count.set(20);

console.log(count()); // 20

// Update existing value
count.update(value => value + 5);

console.log(count()); // 25
```

Difference between set() and update()

| set() | update() |
|---|---|
| Replaces the value | Calculates from the current value |
| Accepts a new value | Accepts an updater function |
| `count.set(10)` | `count.update(x => x + 1)` |

**Interview tip:** Use set() when the new value is already known. Use update() when the new value depends on the existing value.

## 4. Computed Signal – computed()

Interview answer:

A computed signal is a read-only signal that derives its value from other signals. It automatically tracks dependencies, recalculates when necessary and caches its result.

Example: Calculate total price

```typescript
import { signal, computed } from '@angular/core';

export class ProductComponent {

  price = signal(100);
  quantity = signal(2);

  total = computed(() =>
    this.price() * this.quantity()
  );

  changeQuantity() {
    this.quantity.set(5);
  }
}
```
```html
<p>Price: {{ price() }}</p>
<p>Quantity: {{ quantity() }}</p>
<p>Total: {{ total() }}</p>

<button (click)="changeQuantity()">
  Change Quantity
</button>
```
Output:
```
Initially:

Price: 100
Quantity: 2
Total: 200

After clicking:

Price: 100
Quantity: 5
Total: 500
```
Important characteristics

- Computed signals are read-only.
- Values are calculated lazily, on demand.
- Results are memoized (cached).
- Dependencies are tracked dynamically.
- A computed signal recalculates when read after a dependency change invalidates its cached value.

You cannot write:
```typescript
this.total.set(500); // Error
```
## 5. Effect – effect()

Interview answer:

An effect is a reactive function that runs when its tracked signal dependencies change. It is mainly used to synchronize signal state with external systems.

Examples include logging, browser storage, third-party charts and external APIs.

Example
```typescript
import {
  Component,
  signal,
  effect
} from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>{{ count() }}</p>

    <button (click)="increment()">
      Increment
    </button>
  `
})
export class CounterComponent {

  count = signal(0);

  constructor() {

    effect(() => {
      console.log('Count changed:', this.count());
    });

  }

  increment() {
    this.count.update(value => value + 1);
  }
}
```
Console output after initial execution and successive clicks:
```
Count changed: 0
Count changed: 1
Count changed: 2
```
Effects execute asynchronously during Angular's synchronization process. Multiple synchronous updates may be coalesced, so an effect is not guaranteed to run once for every intermediate value. -->