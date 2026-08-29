---
id: javascript-randomquestions-001
slug:  question1
title: Difference between Default export and Named export. 
categoryId: javascript
subcategory: random-questions
difficulty: Experienced
tags:
  - random-testing
  - default_export
  - javascript
summary: Difference between Default export and Named export.
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Random Questions
## Difference between Default export and Named export.

In JavaScript/React, **Named Export** and **Default Export** are two ways to export functions, variables, classes, or components from a module.

Named Export

You export using the actual name.
```javascript
// math.js

export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;
```
When importing, you normally use the same exported name inside { }.

```javascript
import { add, subtract } from "./math";

console.log(add(10, 20));
```
You can have multiple named exports from one file.

You can rename a named import using as:
```javascript
import { add as addition } from "./math";

addition(10, 20);
```
Default Export

A module can have only one default export.
```javascript
// Calculator.js

const Calculator = () => {
    return <h1>Calculator</h1>;
};

export default Calculator;
```
When importing, { } is not required:
```javascript
import Calculator from "./Calculator";
```
An important point is that you can give it a different name while importing:
```javascript
import MyCalculator from "./Calculator";
```

%%%
---
id: javascript-randomquestions-002
slug:  question2
title: Multiple types of error in javascript 
categoryId: javascript
subcategory: random-questions
difficulty: Experienced
tags:
  - random-testing
  - default_export
  - javascript
summary: Multiple types of error in javascript 
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Multiple types of error in javascript 
## Multiple types of error in javascript 

In JavaScript, errors can be divided into **built-in error** types and broader categories such as syntax, runtime, and logical errors. For interviews, know these built-in types well.

| Error Type       | Meaning                          | Example                |
| ---------------- | -------------------------------- | ---------------------- |
| `SyntaxError`    | Invalid JavaScript syntax        | Missing `)`            |
| `ReferenceError` | Variable/function doesn't exist  | `console.log(x)`       |
| `TypeError`      | Operation used on wrong type     | `null.toString()`      |
| `RangeError`     | Value outside allowed range      | Invalid array length   |
| `URIError`       | Invalid URI encoding/decoding    | `decodeURIComponent()` |
| `EvalError`      | Related historically to `eval()` | Rare in modern JS      |
| `AggregateError` | Multiple errors grouped together | `Promise.any()`        |


**1. SyntaxError**

Occurs when JavaScript cannot understand your code.
```javascript
if (true {
    console.log("Hello");
}
```
Missing ) causes:

`SyntaxError`
**2. ReferenceError**

Occurs when you're trying to access something that doesn't exist in the current scope.
```javascript
console.log(username);
```
If `username` hasn't been declared:

`ReferenceError`: username is not defined

Another example:

```javascript
function test() {
    let x = 10;
}

console.log(x);
```
`x` is scoped to `test()`, so accessing it outside causes a ReferenceError.

**3. TypeError**

Very common in real applications.

It occurs when you perform an operation that isn't valid for the value's type.

```javascript
var user = null;

console.log(user.name);
```
This results in a TypeError because you can't read name from null.

Another example:

```javascript
var x = 100;

x();
```
x is a number, not a function.

`TypeError`: x is not a function

**4. RangeError**

Occurs when a value is outside the permitted range.
```javascript
var a = new Array(-10);
```
Result:

`RangeError`: Invalid array length

Another example:
```javascript
var num = 10;

num.toFixed(200);
```
The requested precision is outside the allowed range.

**5. URIError**

Related to URI encoding/decoding functions.
```javascript
decodeURIComponent("%");
```
The % represents an invalid encoded URI sequence, so it throws a URIError.

This error is much less common in normal application development.

**6. EvalError**

Historically related to incorrect usage of eval().
```javascript
new EvalError("Eval operation failed");
```
In modern JavaScript, EvalError is mostly retained for backward compatibility. Modern `eval()` doesn't normally throw EvalError.

Also, avoid `eval()` in application code unless there's a very specific reason to use it.

**7. AggregateError**

Used when multiple errors need to be represented as one error.

A common example is `Promise.any()`:
```javascript
const p1 = Promise.reject("Error 1");
const p2 = Promise.reject("Error 2");

Promise.any([p1, p2])
    .catch(error => {
        console.log(error);
    });
```
Because **all promises failed**, `Promise.any()` rejects with an `AggregateError`.

**Interview answer**
If an interviewer asks "What types of errors are available in JavaScript?", you can say:

JavaScript has several built-in error types: `Error, SyntaxError, ReferenceError, TypeError, RangeError, URIError, EvalError, and AggregateError`. In application development, the errors I encounter most frequently are `TypeError` and `ReferenceError`. We can handle runtime exceptions using `try...catch`, while logical errors generally need testing, debugging, and validation to identify.

%%%
---
id: javascript-randomquestions-003
slug:  question3
title: function declration vs function expression
categoryId: javascript
subcategory: random-questions
difficulty: Experienced
tags:
  - random-testing
  - function_declration
  - javascript
summary: function declration vs function expression
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Function declration vs function expression
## Function declration vs function expression

The main difference between Function Declaration and Function Expression in JavaScript is how the function is created and how hoisting works.

Function Declaration

A function is declared directly using the `function` keyword with a name.

```javascript
function add(a, b) {
    return a + b;
}

console.log(add(10, 20)); // 30
```

A function declaration is fully hoisted, so you can call it before its declaration:

```javascript
console.log(add(10, 20)); // 30

function add(a, b) {
    return a + b;
}
```
✅ This works.

**Function Expression**

A function is created and assigned to a variable.

```javascript
const add = function(a, b) {
    return a + b;
};

console.log(add(10, 20)); // 30
```
The function itself can be anonymous:
```javascript
function(a, b) {
    return a + b;
}
```
and then assigned:
```javascript
const add = function(a, b) {
    return a + b;
};
```
Unlike a function declaration, you cannot use this const function expression before initialization:

```javascript
console.log(add(10, 20)); // ❌ ReferenceError

const add = function(a, b) {
    return a + b;
};
```
**Key differences**

| Function Declaration        | Function Expression                       |
| --------------------------- | ----------------------------------------- |
| `function add(){}`          | `const add = function(){}`                |
| Fully hoisted               | Depends on variable declaration           |
| Can call before declaration | Usually cannot call before initialization |
| Must have a name            | Function can be anonymous                 |
| Defined directly            | Assigned to a variable                    |

**What if we use `var?`**

This is an interesting interview question:

```javascript
console.log(add(10, 20));

var add = function(a, b) {
    return a + b;
};
```
You get an error similar to:
`TypeError: add is not a function`
Why?

Because var add is hoisted, but its assignment is not:

```javascript
var add;             // hoisted

console.log(add);    // undefined

add(10, 20);         // undefined(...) → TypeError

add = function(a, b) {
    return a + b;
};
```
With `const/let`, accessing it before initialization instead produces a ReferenceError because of the Temporal Dead Zone.

**Arrow function is also an expression**

```javascript
const add = (a, b) => a + b;
```
This is an arrow function expression assigned to add.

**Interview answer:** A function declaration uses `function name(){}` and is fully hoisted, meaning it can be called before its declaration. 
A function expression creates a function and assigns it to a variable; it generally cannot be called before that variable has been initialized.