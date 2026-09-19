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