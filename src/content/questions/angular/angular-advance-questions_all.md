---
id: angular-advanced-questions-003
slug: angular-advanced-questions_viewChild
title: Angular Advanced Concepts @viewChild
categoryId: angular
subcategory: Angular-Advanced_All
difficulty: Basic
tags:
  - angular
  - advance-questions
  - viewchild,viewchildren,contentchild,contentchildren
  - change detection
summary: Angular-Advanced-Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Angular-Advanced-Concepts

## What is viewChild? How to Create viewChild for Element Reference? How to create viewchild for component Instance?

**@viewChild** is an Angular property decorator used in a parent component class to get a direct reference to a child component, directive, or native DOM element inside its own template

Example 1:
**HTML:** app.component.html

```html
<input #employeeName type="text"
       placeholder="Enter name">

<button (click)="focusInput()">
  Focus Input
</button>
```
TypeScript: app.component.ts
```typescript
import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('employeeName')
  employeeInput!: ElementRef<HTMLInputElement>;

  focusInput() {
    this.employeeInput.nativeElement.focus();
  }
}

```
Example 2:
```html
<input #txtCity type="text"
       placeholder="Enter City Name">

<button (click)="readCity()">
  Read Value
</button>
```
```typescript
import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('txtCity')
  cityText!: ElementRef<HTMLInputElement>;

  readCity() {
    const city = this.cityText.nativeElement.value();
    if(this.cityText){
        this.cityText.nativeElement.style.color="red";
    }
  }
}
```

**Explanation:**

- #employeeName is a template reference variable.
- @ViewChild('employeeName') locates the matching input.
- ElementRef provides access to the native element.
- focus() places the cursor inside the input.
- Use direct DOM access sparingly. Angular bindings are preferable for ordinary UI updates.

**Interview answer**

"@ViewChild() allows us to access a single element, directive, or child component from the component's own view. It is useful for focusing an input, accessing child component methods, or working with template references."

**@ViewChild() — Access a child component**

A parent component can use **@ViewChild()** to access a child component instance and invoke its public methods.

Step 1: Create child component

child.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: `<h3>Child Component</h3>`
})
export class ChildComponent {

  showMessage() {
    alert('Hello from Child Component');
  }
}
```
Step 2: Access child from parent

parent.component.ts
```typescript
import { Component, ViewChild } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ChildComponent],
  template: `
    <app-child></app-child>

    <button (click)="callChild()">
      Call Child Method
    </button>
  `
})
export class ParentComponent {

  @ViewChild(ChildComponent)
  child!: ChildComponent;

  callChild() {
    this.child.showMessage();
  }
}
```
Output: Clicking the button calls the child component's showMessage() method.

For normal parent-to-child data communication, prefer inputs. Use outputs for child-to-parent events. ViewChild is useful when imperative access is genuinely required.


## @ViewChildren() — Access multiple elements or components

@ViewChildren() retrieves all matching elements, directives, or components from the component's own view.

It returns a QueryList.

Example: Access multiple input elements
```html
<input #employeeInput value="Venkat">
<input #employeeInput value="Ram">
<input #employeeInput value="Kumar">

<button (click)="showEmployees()">
  Show Employees
</button>
```
```typescript
import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-employee',
  standalone: true,
  templateUrl: './employee.component.html'
})
export class EmployeeComponent {

  @ViewChildren('employeeInput')
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  showEmployees() {

    this.inputs.forEach(input => {

      console.log(input.nativeElement.value);

    });

  }
}
```
Console output

```
Venkat
Ram
Kumar
```
Important: QueryList

QueryList is an Angular collection that provides methods and properties such as:

| Property / Method | Purpose |
|-------------------|---------|
| `first` | First matching item |
| `last` | Last matching item |
| `length` | Number of matching items |
| `toArray()` | Convert results into an array |
| `forEach()` | Iterate through results |
| `changes` | Observable that emits when query results change |

Example:
```typescript
console.log(this.inputs.length);

console.log(this.inputs.first);

console.log(this.inputs.toArray());
```

%%%
---
id: angular-advanced-questions-005
slug: angular-advanced-questions_all
title: Angular Advanced Concepts @ContentChild
categoryId: angular
subcategory: Angular-Advanced_All
difficulty: Basic
tags:
  - angular
  - advance-questions
  - viewchild,viewchildren,contentchild,contentchildren
  - change detection
summary: Angular-Advanced-Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# @ContentChild() — Access projected content

## What is  @ContentChild()?

**@ContentChild()** is used to access the first matching element, directive, or component passed from a parent into a child component through content projection.

**What is content projection?**

Content projection allows a parent component to pass HTML content into a child component using **ng-content.**

app.component.html
```html
<app-parent>
  <app-child></app-child>
</app-parent>
```


parent.component.ts
```typescript
import {
  Component,
  ContentChild,
  AfterContentInit
} from '@angular/core';

import { ChildComponent } from './child.component';

@Component({
  selector: 'app-parent',
  standalone: true,
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `
})
export class ParentComponent implements AfterContentInit {

  @ContentChild(ChildComponent)
  childComponent!: ChildComponent;

  ngAfterContentInit() {
    this.childComponent.showMessage();
  }
}
```
child.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: `
    <div>
      {{ message }}
    </div>
  `
})
export class ChildComponent {

  message: string = 'Hello from Child component';

  showMessage() {
    alert(this.message);
  }
}
```
Output : Hello from Child component


Explanation:

- AppComponent passes <app-child> into <app-parent>.
- <ng-content> displays the child component inside the parent's template.
- @ContentChild(ChildComponent) gets the reference to the projected child component.
- ngAfterContentInit() executes after Angular initializes the projected content.
- this.childComponent.showMessage() calls the child's method and displays an alert.

Output: An alert displays "Hello from Child component".

Interview Tip: @ContentChild is used to access projected content, whereas @ViewChild accesses elements declared in the component's own template.

**Why do we use ngAfterContentInit()?**

Angular initializes projected content before invoking ngAfterContentInit().

![Angular Buildings](/images/angular/contentchild1.png)

**Interview tip:** @ContentChild queries are dynamic by default. Use ngAfterContentInit() when you need to access the initial result.

## Angular @ContentChildren

@ContentChildren is used to access multiple child components, directives, or elements projected into a component through <ng-content>.

It returns a QueryList containing all matching projected children.

1. app.component.html

Here, we pass three child components into the parent.

```html
<app-parent>
  <app-child></app-child>
  <app-child></app-child>
  <app-child></app-child>
</app-parent>
```

2. parent.component.ts

```typescript
import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';

import { ChildComponent } from './child.component';

@Component({
  selector: 'app-parent',
  standalone: true,
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `
})
export class ParentComponent implements AfterContentInit {

  @ContentChildren(ChildComponent)
  childComponents!: QueryList<ChildComponent>;

  ngAfterContentInit() {

    this.childComponents.forEach(child => {
      child.showMessage();
    });

  }
}
```
3. child.component.ts

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: `
    <div>
      {{ message }}
    </div>
  `
})
export class ChildComponent {

  message: string = 'Hello from Child Component';

  showMessage() {
    alert(this.message);
  }

}
```

Output: Three alerts appear sequentially, each displaying: Hello from Child Component

**Small explanation**

- AppComponent passes three <app-child> components into <app-parent>.
- <ng-content> displays the projected child components.
- @ContentChildren(ChildComponent) retrieves all three child instances as a QueryList.
- ngAfterContentInit() runs after the projected content is initialized.
- forEach() loops through the child components and calls showMessage() on each.

| @ContentChild | @ContentChildren |
|---|---|
|Gets the first matching projected child | Gets all matching projected children|
|Returns a single instance |Returns a QueryList|
|Access directly|Iterate using forEach()|

**Interview answer:** @ContentChildren is an Angular decorator used to retrieve multiple projected child components or directives. It returns a QueryList, which can be accessed in the ngAfterContentInit() lifecycle hook.


%%%
---
id: angular-advanced-questions-006
slug: angular-advanced-questions_all
title: Web Worker
categoryId: angular
subcategory: Angular-Advanced_All
difficulty: Basic
tags:
  - angular
  - advance-questions
  - viewchild,viewchildren,contentchild,contentchildren,Web Worker
summary: Angular-Advanced-Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# What is a Web Worker

## Web Worker

A Web Worker runs JavaScript in a background thread, separate from the main UI thread.

So if something is CPU-intensive (like parsing, encrypting, image processing, etc.), you can offload it to a worker and keep the UI fast and responsive.

**Real time Exmplae of web worker**

You're building a finance dashboard (think high-frequency trading platform) in Angular, and you're fetching gigantic JSON datasets every 5 seconds. Parsing them in the main thread causes frame drops and freezes the UI
```
ng generate web-worker dataParser 
```
dataParser.worker
```typescript
addEventListener('message', ({ data }) => {
    const parsedData = JSON.parse(data);
    const processed = parsedData.map((entry: any) => ({
      ...entry,
      amountUSD: entry.amount * 80
    }));
    postMessage(processed);
});
```
component.ts

```typescript
const worker = new Worker(new URL('./data-parser.worker', import.meta.url), {
    type: 'module'
}); 
worker.onmessage = ({ data }) => {
  this.processedData = data;
}; 
this.http.get('url', { responseType: 'text' })
  .subscribe(rawJson => {
    worker.postMessage(rawJson);
});
```
You're building an Angular reporting tool where users can download detailed reports (with tables, charts, and summaries) as PDFs. But generating a PDF (especially with large data and canvas charts) takes 3–5 seconds and blocks the UI — your app freezes.

pdf-generator.worker.ts
```typescript
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

addEventListener('message', ({ data }) => {
  const { tableData, title } = data;

  const docDef = {
    content: [
      { text: title, style: 'header' },
      {
        table: {
          body: [
            ['Name', 'Amount', 'Date'],
            ...tableData.map((row: any) => [row.name, row.amount, row.date])
          ]
        }
      }
    ]
  };

  const pdfDocGenerator = pdfMake.createPdf(docDef);
  pdfDocGenerator.getBlob((blob: Blob) => {
    postMessage(blob);
  });
});
```
componen.ts
```typescript
downloadReport() {
  const worker = new Worker(new URL('./pdf-generator.worker', import.meta.url), {
    type: 'module'
  });

  worker.onmessage = ({ data }) => {
    const blob = data as Blob;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Report.pdf';
    a.click();
    URL.revokeObjectURL(url);
    worker.terminate();
  };

  const payload = {
    title: 'Monthly Finance Report',
    tableData: this.tableData
  };

  worker.postMessage(payload);
}
```

%%%
---
id: angular-advanced-questions-007
slug: angular-advanced-questions_all
title: proxy & polyfills
categoryId: angular
subcategory: Angular-Advanced_All
difficulty: Basic
tags:
  - angular
  - advance-questions
  - proxy 
  - polyfills
summary: Angular-Advanced-Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# proxy
## how to create a proxy to solve CORS
Browsers enforce the Same-Origin Policy, which restricts web pages from making requests to a different domain than the one that served the web page. This policy enhances security but can lead to CORS errors when your frontend application tries to access resources from a different origi

To bypass CORS restrictions, you can set up a proxy server that acts as an intermediary between your frontend application and the external API. Since CORS policies are enforced by browsers and not servers, the proxy server can make requests to the external API and relay the responses back to the frontend.

**In the root directory of your Angular project**
create a file named proxy.conf.json.
```json
{
    "/api": {
      "target": "https://projectapi.gerasim.in",
      "secure": true,
      "changeOrigin": true,
      "logLevel": "debug"
    }
  }
```
Configure Angular to Use the Proxy

```json
"serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": { 
            "proxyConfig": "proxy.conf.json"
          },
```
# polyfills

polyfills are scripts that add support for features that are not natively available in all browsers. They essentially "fill in the gaps" to ensure your Angular app works consistently across different environments.

- Different browsers support different features of JavaScript and web APIs. For example:
- Modern browsers support ES6+ features.
- Older versions (like Internet Explorer 11) do not.
- Polyfills help bridge this gap by emulating modern features in older browsers.

Array.includes()
```
const isValid = [1, 2, 3].includes(2);
```
This works fine in Chrome, Firefox, Edge, etc. But in Internet Explorer, it throws an error:

solution => in polyfills.ts
```
import 'core-js/es/array/includes';
```
now it works in IE alos


%%%
---
id: angular-advanced-questions-008
slug: angular-advanced-questions_all
title:Unit testing
categoryId: angular
subcategory: Angular-Advanced_All
difficulty: Basic
tags:
  - angular
  - advance-questions
  - unit test 
  - TestBed 
  - beforeEach 
  - describe
summary: Angular-Advanced-Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Unit Testing

## What is Unit Testing in Angular, and why is it important?
Unit testing in Angular is the process of testing individual pieces of code—like components, services, pipes, or directives—in isolation. The main goal is to ensure that each unit of the app works as expected independently.

- Detect bugs early before integration
- Improve code reliability and confidence in refactoring
- Acts as documentation for how each unit should behave
- Jasmine – for writing the test specs
- Karma – as the test runner (executes the tests in a browser environment)

## What is TestBed in Angular?

TestBed is the primary Angular testing utility that allows you to create an Angular testing module—like a mini Angular app—just for the test environment.

You use it to:
- Declare components, pipes, and directives you want to test.
- Provide services or mocks.
- Configure module-level setup (like imports, declarations, providers)

```typescript
beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterComponent]
    });

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });
```

## What is beforeEach in Angular Unit Testing
In Jasmine, beforeEach() is a special function that runs before each test case (it()) in a describe block. Think of it as a setup step to prepare your test environment before each individual test runs.

It helps you:
- Avoid repeating code (like component setup or service creation).
- Ensure each test starts with a fresh, clean state

## What is describe in Jasmine

describe() is a test suite — it’s a way to group related test cases (it() blocks) together under a common description.

It helps organize your tests into logical blocks, so when you run them in Karma, you can easily see which group of tests passed or failed.

- xdescribe() : Skip the whole suite
- xit() – Skip just one test
- fdescribe() – Focus only this suite

%%%
---
id: angular-advanced-questions-009
slug: angular-advanced-questions_all
title:Optimization
categoryId: angular
subcategory: Angular-Advanced_All
difficulty: Basic
tags:
  - angular
  - advance-questions
  - Optimization 
  - Lazy Loading  
  - Code Splitting 
  - Source Mapping
summary: Angular-Advanced-Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Optimization
## 1. How to Optimize Angular Applications?
**Use Lazy Loading (Route-Level Code Splitting)**

- Split app into modules (AdminModule, UserModule, etc.)
- Use Angular Router’s loadChildren to lazy load those modules

**Enable Change Detection Optimization**
- Only re-renders component if @Input() changes
- Improves performance, especially in large UIs

**Use TrackBy in *ngFor** 
- With trackBy, only changed items are updated

**Avoid Memory Leaks (Especially in RxJS)**
- Always unsubscribe from subscriptions using:
- takeUntil(), AsyncPipe
- Subscription management in ngOnDestroy

**Use Pure Pipes for Expensive Transformations**
- Pure pipes are only re-evaluated when input changes.

**Use Web Workers for Heavy Computation**
- move Offload CPU-heavy tasks (e.g., data parsing, image processing) to Web Workers.

**Lazy Load Images and Components**
- Use loading="lazy" on 

## How do you secure an Angular app?
**Route Guards**
- We should use canActivate, canLoad, and canActivateChild to restrict unauthorized access, based on roles or auth status.
**Interceptors**
- use HttpInterceptors to inject tokens into headers securely, and also handle unauthorized responses globally.
**CSRF Protection**
- For cookie-based auth, I work with backend teams to enable CSRF protection using X-XSRF-TOKEN, which Angular supports out of the box.
```typescript
imports: [
  HttpClientXsrfModule.withOptions({
    cookieName: 'MY-XSRF-COOKIE',
    headerName: 'MY-XSRF-HEADER'
  })
]
```
**Avoid Exposing Secrets**
- make sure not to hardcode API keys or secrets in Angular, since all front-end code is publicly visible.
**Token Security**
- we should prefer storing JWTs in HttpOnly cookies to avoid XSS risks.
- If localStorage or sessionStorage is used, we should ensure input sanitization and logout on suspicious activity.
- HttpOnly cookies: They are stored by the browser itself, and not accessible via document.cookie or JavaScript. You only see them in the "Application → Cookies" tab in dev tools.
- this.http.get('/api/user-profile', { withCredentials: true }).subscribe(...)

## Code-Level Optimizations
**Lazy Loading Modules or Components**
Split large modules into lazy-loaded chunks using routes:
```
{
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
}
     
```
**Tree Shaking & Dead Code Elimination**

Angular and Webpack remove unused code ( but only if it's structured well)

- Avoid large barrel exports
- Don’t bundle everything in a single shared module
- Mark classes with providedIn: 'root' for optimal tree-shaking

**Use Standalone Components**
Helps reduce boilerplate, improves tree-shakability and bundling.

## Build-Time Optimizations
**Ahead-of-Time (AOT) Compilation**
- Faster rendering
- Smaller bundles
- Detects template errors at build time
**ESBuild Integration (Angular 16+)**
- The Angular CLI now supports ESBuild — much faster than Webpack for transpiling.

**Differential Loading**
- create separate bundles for modern and legacy browsers.
- Angular CLI handles this automatically
- es2015 for modern browsers
- es5 fallback for older ones

**Disable Source Maps in Prod**
When you write Angular code using TypeScript, SCSS, etc., it's not what the browser actually runs. The browser gets compiled JavaScript, CSS, and HTML.

But when you're debugging, you want to see your original TypeScript code, not the ugly minified JS.

That’s where source maps come in—they’re like a translator between your original source code and the compiled output.
```
"configurations": {
    "production": {
      ...
      "sourceMap": false
    }
}     
```

## Runtime Optimization Techniques
**OnPush Change Detection**
Use ChangeDetectionStrategy.OnPush to avoid unnecessary checks:

**Use trackBy in ngFor**

**Problem:** Without it Angular destroys and recreates every DOM mode in a list when the array reference changes --even if only one item changed

**Solution:** Angular reconciles by key and patches only what's different
### Before
```html
//Before
<div *ngFor="let user of users{{user.name}}></div>
```
### After
```html
// legacy strctural directive

<div *ngFor="let user of users; trackBy: trackById">{{user.name}}</div>

trackById(index: number, user: User) {
    return user.id;
}

//modern control flow-track is required syntex

@for(user of users;tack user.id){
  <div>{{user.name}}</div>
}
```

#### Explicit public/private/protected
**Problem:** Defaults to public if omiited,silently exposing internals to templates and other classes
### Before
```typescript
export class UserCardComponent{
  user:User;
  formatName(u:User){/*....*/}
}
```
### After
```typescript
export class UserCardComponent{
  public user!:User;
  protected formatName(u:User):string{/* usable in template only*/}
  private buildCachekey(u:User):string{/*internal only*/}
}
```
#### Explicit return types on every method

Problem:Without it, typescript infers the type- a refactor can silently widen or narrow it with no compiler warning downstream.
### Before
```typescript
calculateTotal(items:CartItem[]){
  return items.reduce((sum,i)=> sum+i.price,0)
}
```
### After
```typescript
calculateTotal(items:CartItem[]: number){
  return items.reduce((sum,i)=> sum+i.price,0)
}
```

#### Unsubscribe discipline
Problem: Manual .subscribe() without cleanup is the #1 cause of memory leaks in Angular apps.

### Before
```typescript
ngOnInit*(){
  this.service.data$.subscribe(d=>this.data=d);
  //leaks - outlives the componennt
}
```
### After
```typescript
//Option A- let the template own it 
// template:<div>{{data$ | async}}</div>
data$=this.service.data$;

//Option B- auto unsubscribe on destroy
private destroyREf=inejct(DestroyRef);
ngOnInit*(){
    this.service.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(d=>this.data=d);
}
```
#### readonly for properties that never reassign
Why: signals a contract to future (and the compiler) that this shouldn't change after construction.
```typescript
export class UserCardComponent{
  private readonly userService=inject(UserService);
  readonly maxNameLength=40;
}
```

**Memoization & Pure Pipes**
Memoization is an optimization technique where you cache the result of expensive function calls and return the cached result when the same inputs occur again.

**Image & Asset Optimization**
- Use WebP or AVIF
- Lazy load heavy images

## What is Webpack?
Webpack is a module bundler. Think of it as a super-efficient packer: it takes all your project files (JavaScript, CSS, images, HTML, etc.), analyzes their dependencies, and bundles them into optimized files that can be shipped to the browser.

**Module Bundling**
- Webpack takes your Angular components, services, pipes, directives, and other modules and builds a dependency graph.
- Then it bundles these modules into efficient JavaScript files (like main.js, polyfills.js, etc.).
**Asset Processing**
- Webpack loads and processes your styles (CSS/SCSS), HTML templates, and images using loaders
**Tree Shaking**
- Removes unused code (dead code elimination).
- This significantly reduces bundle size in production builds
**Code Splitting**
- Webpack enables lazy loading and dynamic imports to split your app into smaller chunks.
- This means only the necessary code is loaded initially, improving performance.
**Environment-Specific Builds**
- Angular uses Webpack to replace environment files (environment.ts vs environment.prod.ts) during build time.
**Minification and Optimization**
- Removes white spaces, comments, shortens variable names, etc.
- Also optimizes images, CSS, and other static files
**Source Mapping**
- Generates .map files so that even after code minification, you can debug using original source code in the browser.

Webpack is the engine behind Angular CLI's build system. It bundles your code, optimizes it, splits it for lazy loading, processes your assets, and prepares everything for efficient browser delivery.

## What is Babel?
Babel is a JavaScript compiler. Think of it like a translator that:

- Converts modern JavaScript (ES6+ or TypeScript) into older versions (like ES5) that all browsers can understand.
- Allows use of cutting-edge JS features without worrying about browser support.
- Transpile ES6+ code to ES5
- Transpile JSX (React syntax) to plain JS
- Polyfill new APIs like Promise, Array.from, etc.

## XSS (Cross-Site Scripting)
XSS is when an attacker injects malicious JavaScript into your application — often via input fields, query params, or URLs.
```
[innerHTML]="userInput"
 p  {{ userInput }} p 
 userInput ="<script>alert('x')script>"
```
If you're binding unsafe HTML, Angular won’t sanitize it unless you let it.
```
this.sanitizer.bypassSecurityTrustHtml(userInput);                                    
```
Angular renders it as plain text – not executable.

## AOT vs JIT
**JIT (Just-In-Time) Compilation**
Angular compiles your HTML templates + TypeScript code in the browser, as the app loads.

- You write TS and templates.
- Angular sends them raw-ish to the browser.
- Angular compiler runs in the browser and compiles templates into JS on the fly.
**AOT (Ahead-of-Time) Compilation**
Angular pre-compiles your templates and code before shipping to the browser.

- Angular CLI compiles HTML & TS into pure JavaScript during ng build.
- Removes Angular compiler from final bundle.
- Faster rendering in the browser ,Smaller bundle size,Early error detection

## Accessibility in angular
**Core Concepts of Accessibility**
- Keyboard Navigation: Users should be able to use the app using just a keyboard (Tab, Enter, Space, etc.).
- Screen Readers: The UI should be understandable by screen readers (like NVDA, JAWS).
- Semantic HTML: Use elements for what they mean (, ,, etc.).
- Color Contrast: Make sure there's enough contrast between text and background.
- Focus Management: Properly manage focus (especially after navigation/dialogs).
- ARIA attributes: aria-label, aria-hidden, role, etc., to enhance semantics for assistive tech.
- Live announcements with cdk/LiveAnnouncer

We ensure all interactive elements are keyboard-accessible using tabindex, role, and HostListener for key events."

use LiveAnnouncer and FocusTrap from Angular CDK to make dynamic interactions accessible.

avoid using divs or spans for interactivity unless I add the necessary ARIA roles and keyboard logic.