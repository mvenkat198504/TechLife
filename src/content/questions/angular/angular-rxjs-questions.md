---
id: angular-rxjs-questions-001
slug: angular-RxJS-questions
title: Angular rxjs - Questions and Answers?
categoryId: angular
subcategory: Angular-RxJS
difficulty: Basic
tags:
  - angular RxJS
  - rxjs-questions
  - angular-rxjs
  - rxjs pdf
  - contactMap
  - switchmap
  - mergemap
  - ExhaustMap
  - map vs ExhaustMap
summary: Angular RxJS Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---
# Angular rxjs Basics

## What is RxJS?
This is astream based library which actually means we can transform anything in the stream you have. for example, click event,you can write it as a stream, you have some data, you can write them as a stream, 
API call is also a stream. 

Working with local storeage can be a stream

Then you can combine thease streams, filter them,map data inside.So this is quite versatile.


## Whare pros and cons of RxJS?

First of all, if we can represent anything with the streams, we can work with all them together.

For example, you can combine a stream of event, click with the stream of geting data from API. if you need to and it makes your whole application reactive.Why is that? Because actually we can subscribe to our streams and then every single time when we are getting new values from some stream, we will rerender our components. This is exactly what we are doing inside Angular.

What are cons fo RxJS?

First of all, the level of entrance inside this library is much higher in comparison to just plain javascript. If you simply write, map and filter inside Javascript, you are toally fine, but rxjs is much more difficult and stream programming can be difficult to grasp from the beginning. 

And additionally to that Rxjs i squite verbose.You will write lot of brackets, lots of different functions.Combine thease functions and this is not the cleanest code in the world that I saw

## Why RxJS is important in Angular?

The main problem is that a lot of developers when they are starting Angular code, they are not using Rxjs at all.

The main point is that Angular is heavy based on a request, and it doesn't make any sense to write your code without Rxjs.

Then your code will be more prone to errors and more verbose.so essentially, using Rxjs inside Angular is not a choice. you must do that in order to write angular code in angular way.

If you will try to write code without Rxjs you will fight against a framework and it won't do you any good

## - Q1: You get such UserInterface. Define a function normalizeUsers which gets a parameter users$ which is an observable of UserInterface array and returns back an array of names as an observable.
  ```typescript
    interface UserInterface {
      id: string;
      name: string;
      age: number
    }
  ```
## - Q2: How RxJS map differs from Javascript map?

```typescript
  interface UserInterface {
      id: string;
      name: string;
      age: number
    }
    const normailizeUsers=(user$:Observable<UserInterface[]>):Observable<string[]>=>{
        return user$.pipe(map((users)=>user.map((user)=>user.name)));
    }
```

## How to Write a Plain Observable in Angular ?
In Angular, you can create a plain Observable using the Observable class from RxJS without using HttpClient, Subject, or BehaviorSubject.

1. Basic Observable example

```typescript
import { Observable } from 'rxjs';

const myObservable = new Observable<number>(res => {
  res.next(10);
  res.next(20);
  res.next(30);
  res.complete();
});

myObservable.subscribe({
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('Completed')
});
```
Output:
```
10
20
30
Completed
```
Explanation:

- new Observable() – Creates an Observable.
- observer.next() – Emits a value.
- observer.error() – Emits an error and terminates the Observable.
- observer.complete() – Signals successful completion.
- subscribe() – Starts execution and receives emitted values.

2. Observable inside an Angular component

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `<h2>{{ message }}</h2>`
})
export class DemoComponent implements OnInit {

  message = '';

  ngOnInit(): void {

    const observable$ = new Observable<string>(observer => {
      observer.next('Hello Angular');
      observer.next('Welcome to RxJS');
      observer.complete();
    });

    observable$.subscribe(value => {
      this.message = value;
      console.log(value);
    });

  }
}
```

Browser output:

Welcome to RxJS

3. Simplest Observable using **of()**

```typescript
import { of } from 'rxjs';

const numbers$ = of(10, 20, 30);

numbers$.subscribe(value => console.log(value));
// Output:10 20 30

// another example
const cityList$ of (["Pune","Mumbai","Nagpur","Tahney"]);
const studentObj$ of ([name:'Venkat',city:'Pune',studentId:123,mobile:'1234646726'])

const rollNoList = from([11,12,13,14,15,16]);
allSubscription(){
    this.cityList$.subscribe({
        next:(res:string[])=>{

        }
    })
    this.studentObj$.subscribe({
        next:(res:any)=>{

        }
    })

    this.rollNoList.subscribe({
        next:(rollNo:number)=>{

        }
    })
}
```
**of()** is a creation function that creates an Observable and emits the supplied values.this is using unicast emit data only once we can't change it

**Interview answer**

Answer: We can create an Observable using the RxJS Observable constructor or creation functions such as **of()** and **from()**. An Observable can emit multiple values over time. We subscribe to it to receive values, handle errors, and receive completion notifications.

Important: An Observable created using new Observable() is typically cold, meaning its execution starts independently for each subscription. For asynchronous Observables that remain active, manage subscriptions to avoid memory leaks.

## Interviewer: What is the difference between Promise and Observable?

A **Promise** handles a **single asynchronous result** and starts executing immediately when created.

An **Observable** can **emit multiple values over time** and is generally **lazy**, meaning **execution begins when subscribed to**.

Observables support cancellation through unsubscription and provide powerful RxJS operators such as map, filter, switchMap, and debounceTime.

In Angular, we commonly use Observables for HTTP requests, reactive forms, and event streams.

**1. Key differences**

| Feature | Promise | Observable |
|---|---|---|
| Library | Native JavaScript | RxJS |
| Values | Resolves with one value | Can emit zero, one, or multiple values |
| Execution | Eager: executor starts immediately | Usually lazy: starts on subscription |
| Consumption | `.then()` / `async-await` | `.subscribe()` / `async` pipe |
| Cancellation | No built-in cancellation | Supports unsubscription |
| Operators | `.then()`, `.catch()`, `.finally()` | `map`, `filter`, `switchMap`, etc. |
| Error Handling | `.catch()` / `try-catch` | `error` callback / `catchError()` |
| Completion | Resolve or reject | Complete or error |
| Common Usage | One-time async operations | HTTP, events, streams, reactive programming |

## Promise vs Observable – Simple API Call Example in Angular

Both methods call an API, but fetch() returns a Promise, whereas Angular HttpClient.get() returns an **Observable.**

**1. Promise – Using fetch()**

```typescript
getUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}

```

Explanation:

- fetch() returns a Promise.
- API request starts immediately when fetch() is called.
- .then() handles the response.
- response.json() converts the response body into JavaScript data and returns another Promise.
- .catch() handles errors.

Note: fetch() does not reject automatically for HTTP errors such as 404 or 500. You need to check response.ok.

**2. Observable – Using Angular HttpClient**

```typescript
getAllPosts() {
  this.http.get(
    "https://jsonplaceholder.typicode.com/posts"
  ).subscribe({
    next: data => {
      console.log(data);
    },
    error: error => {
      console.error(error);
    }
  });
}
```
Explanation:

- http.get() returns an Observable.
- API request starts when .subscribe() is called.
- next receives the API response.
- error handles errors, including HTTP 404 and 500 responses.

**Interview answer:** fetch() returns a Promise and starts the API request immediately. Angular HttpClient.get() returns a cold Observable, **so the API request executes only when we subscribe to it.**

%%%
---
id: angular-rxjs-questions-002
slug: angular-RxJS-questions
title: Angular rxjs - Questions and Answers PDF?
categoryId: angular
subcategory: Angular-RxJS
difficulty: Basic
tags:
  - angular RxJS
  - rxjs-questions
  - angular-rxjs
  - rxjs pdf
  - contactMap
  - switchmap
  - mergemap
  - ExhaustMap
  - map vs ExhaustMap
  - rxjs pdf
summary: Angular RxJS Questions
updatedAt: 2026-09-17
status: published
thumbnail: ""
videos: []
resources: []
---

# Angular rxjs top 20 questions and answers in PDF

## 1. Angular rxjs top 20 questions

![Angular rxjspdf](/pdf/angular/RxJS Interview Answers.pdf "RxJS Interview Guide")

