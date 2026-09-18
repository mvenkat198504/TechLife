---
id: angular-17to19-features-001
slug: angular-16to18-features
title: Angular 17-18-19- Features?
categoryId: angular
subcategory: Angular-17-18-19-Features
difficulty: Basic
tags:
  - angular
  - basic-questions
  - angular-basics
summary: Angular 17-18-19- Features
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Angular 17-18-19-Features

## Deferrable Views
a new way to delay or defer the rendering of parts of your template until certain conditions are met, such as:

- When the component is visible in the viewport
- when some event triggered
- After an idle period
- After a timeout
- this helps to => Speeding up initial load, Saving resources by not rendering offscreen content,Improving performance in large Angular apps
```typescript
@defer (on idle) {
  <app-heavy-component></app-heavy-component>
} @placeholder {
  <p>Loading component...</p>
}

// 

@defer (on interaction) {
  <app-recent-activity></app-recent-activity>
} @placeholder {
  <p>Waiting for user activity...</p>
}

// 

@defer (on viewport) {
  <app-footer-info></app-footer-info>
} @placeholder {
  <p>Footer loading...</p>
}
```
## Control Flow Syntax
a new way to delay or defer the rendering of parts of your template until certain conditions are met, such as:

- When the component is visible in the viewport
- when some event triggered
- After an idle period
- After a timeout
- this helps to => Speeding up initial load, Saving resources by not rendering offscreen content,Improving performance in large Angular apps

```typescript
@defer (on idle) {
  <app-heavy-component></app-heavy-component>
} @placeholder {
  <p>Loading component...</p>
} 

// 

@defer (on interaction) {
  <app-recent-activity></app-recent-activity>
} @placeholder {
  <p>Waiting for user activity...</p>
} 

//

@defer (on viewport) {
  <app-footer-info></app-footer-info>
} @placeholder {
  <p>Footer loading...</p>
}
```
## @let declare variables directly within templates

@let, was introduced to declare variables directly within templates. This enhances template logic and readability by allowing the creation of aliases for complex expressions or values that may be used multiple times.

```typescript
studentLst: any []= [
  {fname:'sachin', lname:'Tendulkar'},
  {fname:'sachin', lname:'Tendulkar'},
  {fname:'sachin', lname:'Tendulkar'}
]

//

@for (item of studentLst; track $index) {
    @let fullName = item.fname + ' '+item.lname;
    <li>
        {{fullName}}
    </li>
 }

```
## Function-Based Route Redirects

in default route in earlier version we used to pass router name to redirect now it supports function as well

app.routes.ts
```typescript

   import { redirectByRole } from './service/utility';
   {
           path:'',
           redirectTo: redirectByRole(),
           pathMatch:'full'
   }
```
utility.ts
```typescript
  export function redirectByRole(): string{ 
     const loggedData =  localStorage.getItem("role");
     if(loggedData =='admin') {
         return 'life-cycle';
     } else {
        return 'view-encap';
     }
 }
```

## computed signal

you can pass a signal to chnage another signal value based on one signal value change, reactive signal it's value will depend on value chnage on signal we pass. We can't changed compoented signal value it will change if depedend value changes

```typescript
count =  signal<number>(2);
 doubleCount =  computed(()=> this.count() * 2);
 
 constructor(){
   setTimeout(() => {
     this.count.set(5)
   }, 5000);
 }
 
```
```
doubleCount signal value will chnage after 5 sec
count => 5
doubleCount => 10
```
## Linked Signals
Linked signals are reactive variables that depend on other signals and update automatically when their dependencies change — like computed values.

in source you can pass which signal we need to track if source changes then only it will compute again
```typescript
 firstNum = signal<number>(5);
 secondNum = signal<number>(7);
 total = linkedSignal({
   source: this.firstNum,
   computation: () => (this.firstNum() + untracked(this.secondNum)),
 });
 
 constructor() {
   setTimeout(() => {
    this.firstNum.set(6)
  }, 8000);
  setTimeout(() => {
    this.secondNum.set(10)
  }, 10000);
 }
```
```
total signal state value will chnage after 8 sec only as in source that value is there

total => 13
firstNum => 6
secondNum => 10
```

## Zoneless Change Detection
zoneless change detection mechanism that eliminates the need for zone.js, leading to improved performance and better debugging capabilities.

means now you can disable change detection overall project
```typescript
bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()],
});
```
## input signal
let's say we created a reusable component and instaed of normal input , we can create a signal based input for more reactivity.

```typescript
@Component({
  selector: 'app-my-card', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyCardComponent { 
  @Input() htmlTemplate!: TemplateRef<Element>;
  @Input() showFillter: boolean = false;
  cardTitle = input<string>();//signal input
}
```
```html
<div class="card">
    <div class="card-header bg-primary">{{cardTitle()}}</div>
    <div class="card-body">
        <ng-container [ngTemplateOutlet]="htmlTemplate"></ng-container>
    </div>
    @if (showFillter) {
        <div class="card-footer"> 
        </div>
    } 
</div>
```
## Reactive form control state change events
Angular forms now expose a property called events, which allows you to subscribe to a stream of events for this form control.

```typescript
const nameControl = new FormControl<string|null>('name', Validators.required);
nameControl.events.subscribe(event => {
  // process the individual events
});
```
can track changes in value, touch state, pristine status, and the control status.

## resource api
resource() is a new reactive way that helps manage asynchronous data (like HTTP calls, promises, or observables) in a declarative, signal-based way.

Bret , Antonette , Samantha , Karianne , Kamren , Leopoldo_Corkery , Elwyn.Skiles , Maxime_Nienow , Delphine , Moriah.Stanton ,

```typescript
userResourceData = resource({
  loader: () => {
    return fetch("https://jsonplaceholder.typicode.com/users").then(result=> result.json())
  }
})
```
```html
@if (userResourceData.isLoading()) {
 <span>Loading</span>
 }
 @if (userResourceData.hasValue()) {
 <ul>
     @for (item of userResourceData.value(); track $index) {
     <li>{{item.username}}</li>
     }
 </ul>
 }
 ```
 ## rxResource api
 rxResource() we can use in case of observables

Bret , Antonette , Samantha , Karianne , Kamren , Leopoldo_Corkery , Elwyn.Skiles , Maxime_Nienow , Delphine , Moriah.Stanton ,

```typescript
user = rxResource({
    loader:() => this.userService.getUsers()
})
```
```html
@if (user.isLoading()) {
    <span>Loading</span>
}
@if (user.hasValue()) {
    @for (item of userResourceData.value(); track $index) {
     <span>{{item.username}}</span> ,
    }
}
```