---
id: javascript-codetesting-001
slug:  withdrawCash
title: Write a JavaScript function to simulate an ATM cash withdrawal. 
categoryId: javascript
subcategory: coding-questions
difficulty: Experienced
tags:
  - coding-testing
  - withdrawCash
  - javascript
summary: JavaScript function that simulates an ATM cash withdrawal using a greedy algorithm 
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Javascript Coding Questions

## Write a JavaScript function to simulate an ATM cash withdrawal. The ATM contains a limited number of denominations

Here is a JavaScript function that simulates an ATM cash withdrawal using a greedy algorithm to prefer higher denominations first.

```javascript
function withdrawCash(amount, atmInventory) {
    // Validate the requested amount
    if (amount <= 0 || !Number.isInteger(amount)) {
        return { success: false, error: "Invalid amount. Please enter a positive whole number." };
    }

    // Get denominations sorted from highest to lowest
    const denominations = Object.keys(atmInventory)
        .map(Number)
        .sort((a, b) => b - a);

    const dispensed = {};
    let remainingAmount = amount;

    // Track potential updates to inventory
    for (const denom of denominations) {
        const availableNotes = atmInventory[denom];
        
        if (availableNotes > 0 && remainingAmount >= denom) {
            const notesNeeded = Math.floor(remainingAmount / denom);
            const notesToDispense = Math.min(notesNeeded, availableNotes);

            if (notesToDispense > 0) {
                dispensed[denom] = notesToDispense;
                remainingAmount -= notesToDispense * denom;
            }
        }
    }

    // Check if the exact amount was successfully met
    if (remainingAmount > 0) {
        return { 
            success: false, 
            error: "Transaction failed: Cannot dispense the exact amount with available notes." 
        };
    }

    // Deduct the dispensed notes from the actual ATM inventory
    for (const denom in dispensed) {
        atmInventory[denom] -= dispensed[denom];
    }

    return {
        success: true,
        dispensed: dispensed,
        remainingInventory: { ...atmInventory }
    };
}

// Current ATM inventory setup
const atmInventory = {
    2000: 5,   // Five $200 bills
    500: 10,   // Ten $500 bills
    200: 10,    // Ten $200 bills
    100: 5     // 5 $100 bills
};

// Test Case 1: Successful withdrawal favoring high bills
console.log(withdrawCash(5000, atmInventory));

// Test Case 2: Unfulfillable amount (exact change error)
console.log(withdrawCash(15, atmInventory));

```

%%%
---
id: javascript-codetesting-002
slug: reversestring
title: Write a JavaScript function to reverse a string without using reverse() .
categoryId: javascript
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-testing
  - reverse-String
  - javascript
summary: Write a JavaScript function to reverse a string without using reverse() .
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Reverse a String
## Write a JavaScript function to reverse a string without using reverse() .

```javascript
function reverseString(str) {
    let result = "";
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}
console.log(reverseString("hello"));
// olleh
```
Tests: Loops and string manipulation.

%%%
---
id: javascript-codetesting-003
slug: polindrom_checking
title:Check Whether a String Is a Palindrome
categoryId: javascript
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-testing
  - PolindromCoding
  - javascript
summary: Check whether a given string reads the same forward and backward
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Check Whether a String Is a Palindrome
## Check whether a given string reads the same forward and backward
Polindrom Coding

```javascript
function isPalindrome(str) {
    let reversed = str.split("").reverse().join("");
    return str === reversed;
}
console.log(isPalindrome("madam")); // true
console.log(isPalindrome("hello")); // false
```
```javascript
function isPolindrom(str){
    let revStr="";
    for (let i=str.length-1;i>=0;i--)
    {
        revStr += str[i];
    }
    if (str==revStr){
        return true;
    }
    else{
        return false;
    }
}

console.log(isPolindrom("malayalam"))
```

%%%
---
id: javascript-codetesting-004
slug: largesnumber_array
title: Find the Largest Number in an Array
categoryId: javascript
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-testing
  - largesnumber_array
  - javascript
summary:  Find the Largest Number in an Array
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---
# Find the Largest Number in an Array
## Find the Largest Number in an Array
```javascript
function findLargest(numbers) {
    let largest = numbers[0];
        for (let num of numbers) {
            if (num > largest) {
                largest = num;
            }
    }
    return largest;
}
console.log(findLargest([10, 45, 23, 99, 5]));
// 99
```

%%%
---
id: javascript-codetesting-005
slug: secondlargesnumber_array
title: Find the second largest number in an unsorted array
categoryId: javascript
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-testing
  - secondlargesnumber_array
  - javascript
summary:  Find the second largest number in an unsorted array
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---
# Find the second largest number in an unsorted array without any built-in method in JavaScript
## But solution is very simple, first finding maximum number then to find second maximum when the array element is maximum we will just skip that element,

```javascript
let array = [10, 30, 35, 20, 30, 25, 90, 89];

    function secondLargestNumber(array) {
        let max = 0;
        let secondMax = 0;

        for (let i = 0; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }

        for (let i = 0; i < array.length; i++) {
            if (array[i] > secondMax && array[i] !== max) {
                secondMax = array[i];
            }
        }
        return secondMax;
    }
    console.log(secondLargestNumber(array));
```
Appraoch 1:
```javascript
let numArray=[10,20,50,75,35,76,100]
function secondLargest(numArray)
{
    let max=0;
    let secondLargest=0;
    for (let num of numArray){
        if (num>max){
            secondLargest=max
            max=num
        }
        else if (num>secondLargest && num!==max){
            secondLargest=num
        }
    }
    
    console.log(max)
    console.log(secondLargest)
}
secondLargest(numArray)
```

Appraoch 1:
```javascript
let numArray=[10,20,50,75,35,76,100]
function secondLargest(numArray)
{
    let max=0;
    let secondLargest=0;
    for (let num of numArray){
        if (num>max){
            max=num
        }
    }
     for (let num of numArray){
        if (num>secondLargest && num!==max){
            secondLargest=num
        }
    }
    
    console.log(max)
    console.log(secondLargest)
}
secondLargest(numArray)
```

%%%
---
id: javascript-codetesting-006
slug: fresherquestions1
title: Sample Fresher Questions 1
categoryId: javascript
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-testing
  - fresher_questions
  - javascript
summary: Sample Fresher Questions
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Fresher Questions

## The difference is caused by JavaScript Automatic Semicolon Insertion (ASI).


 ```javascript
function app(){
    return {    
        xyz:100
    }
}
console.log(app()) 
```

// what is the Output?

 // output : { xyz: 100 }

 ```javascript
function app(){
    return  
     {
        xyz:100
    }
}
console.log(app()) 
```

// what is the Output?

 // output : undefined

 The difference is caused by JavaScript Automatic Semicolon Insertion (ASI).

 Scenario 1 — Returns the object

 Scenario 2 — Returns undefined


 The important difference is the new line immediately after return.

JavaScript's Automatic Semicolon Insertion effectively changes this:

```javascript
return
{
    xyz: 100
}
``` 
into:

```javascript
return;   // semicolon automatically inserted

{
    xyz: 100
}
```
So the function finishes at return;.

A return without a value means:

**Interview point**

Never put a newline immediately after return when returning an expression or object.

%%%
---
id: javascript-codetesting-007
slug: fresherquestions2
title: Sample Fresher Questions 2
categoryId: javascript
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-testing
  - fresher_questions
  - javascript
summary: Sample Fresher Questions
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Compare Two Arrays
## In JavaScript, you cannot compare two arrays directly using standard equality operators like == or ===

In JavaScript, you cannot compare two arrays directly using standard equality operators like == or === because arrays are objects, meaning they are compared by reference (where they live in memory) rather than by value. For example, [1, 2] === [1, 2] will always evaluate to false

The exact method you should use to compare them depends entirely on your specific data structure.

## 1. For Shallow Arrays (Numbers, Strings, Booleans)

```javascript
const arraysEqual = (arr1, arr2) => {
  // 1. Check if they point to the same memory reference
  if (arr1 === arr2) return true;
  
  // 2. Check if lengths are different
  if (arr1.length !== arr2.length) return false;
  
  // 3. Check if every element matches the corresponding index
  return arr1.every((value, index) => value === arr2[index]);
};

console.log(arraysEqual([1, 2, 3], [1, 2, 3])); // true
console.log(arraysEqual([1, 2, 3], [1, 3, 2])); // false (wrong order)

```

## 2. For Quick Prototyping (The JSON Trick)

If performance is not critical, you can serialize both arrays into strings using
`JSON.stringify()` and compare the resulting strings

**Warning:** This approach fails if your array contains undefined, functions, or complex objects with properties in different orders.

```
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];

const isEqual = JSON.stringify(arr1) === JSON.stringify(arr2);
console.log(isEqual); // true

```

## 3. Irrespective of Order (Unordered Arrays)

If you want to know if two arrays contain the exact same items regardless of what index position they are in, you can sort them first or use a Set approach.

```javascript
const unorderedEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  
  // Sort copies of the arrays before comparing
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  
  return sorted1.every((value, index) => value === sorted2[index]);
};

console.log(unorderedEqual([3, 2, 1], [1, 2, 3])); // true

```

## 4. For Deep Arrays (Arrays of Objects or Nested Arrays)

If your arrays contain object literals or other nested arrays, primitive comparisons will fail. You can use a recursive custom function, or import a utility library like Lodash which handles this automatically via _.isEqual().

```javascript
// Using the Lodash library
const _ = require('lodash');

const objArray1 = [{ id: 1 }, { id: 2 }];
const objArray2 = [{ id: 1 }, { id: 2 }];

console.log(_.isEqual(objArray1, objArray2)); // true

```

%%%
---
id: javascript-codetesting-008
slug: fresherquestions3
title: Sample Fresher Questions 3
categoryId: javascript
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-testing
  - fresher_questions
  - javascript
summary: Sample Fresher Questions
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Sample Fresher Questions 3
## Small Codes and Outputs
```javascript
    console.log("Venkat"-"Venky") 
    // Ouput:  NaN
```
```javascript
    console.log("100" - "10")
    // Ouput:  90
```
```javascript
    console.log("100" + "10")
    // Ouput:  10010
```
```javascript
var a=[10,11,12,13,14]
function print(b,...a)
{
    console.log(a)
}
print(8,9,10,11,12,13)

```
**Output**: `[ 9, 10, 11, 12, 13 ]`

```javascript
//map()
var a=[1,2,3,4,5,6]
var output=a.map((ele,inx,a)=>{

    return ele+1
})

console.log(output)
// Output : [2, 3, 4, 5, 6, 7 ]

var a=[1,2,3,4,5,6]
var output=a.map((ele,inx,a)=>{

    return ele=8
})

// Output : [8, 8, 8, 8, 8, 8 ]
```

```javascript
const obj ={
    a:1,
    b:2,
    c:3,
    d:4
}
console.log(Object.entries(obj))
// output: [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ], [ 'd', 4 ] ]
```

```javascript
let x=10
if(function solve(){}){
    x=x-typeof(solve)
}
console.log(x)
//Outuput :NaN
```
```javascript
let x=[100,200,300]
let y=[100,200,300]
let z=y;
console.log(x==y) // false
console.log(z==y) // true
console.log(z==x) // false

```

```javascript
const obj={
    pqr:100,
    abc:200,
    xyz:{
        pqr:300,
        abc:400
    }
}

const {pqr,abc,xyz:{pqr:p}}=obj;
console.log(pqr,abc,p)

//Output: 100,200,300
```

```javascript
let arr=[1,5,64,3,4,5]
let arry1=arr.map((ele)=>{
    return ele>3
})

console.log(arry1)
// Output : [ false, true, true, false, true, true ]
```

## Split the array and store it datatype based

```javascript
var arr=[100,"q","Chennai",10,8,"C"]
var numArray=[]
var strArray=[]
var charArray=[]
arr.forEach((ele)=>{
    if (typeof ele=="string" && ele.length>1){
        strArray.push(ele)
    }
    else if (typeof ele=="string" && ele.length==1){
         charArray.push(ele)
    }
     else if (typeof ele=="number" ){
         numArray.push(ele)
    }
})

console.log(numArray)
console.log(strArray)
console.log(charArray)
```
**Output**
`[ 100, 10, 8 ]`
`[ 'Chennai' ]`
`[ 'q', 'C' ]`

**OR**

```javascript
function dataSplit(arr){
    for (let i=0;i<=arr.length-1;i++)
    {
        console.log(typeof(arr[i]));

        if (typeof(arr[i])=="string" && arr[i].length>1){
            strArray.push(arr[i])
        }
        else if (typeof(arr[i])=="number"){
             numArray.push(arr[i])
        }
         else if (typeof(arr[i])=="string" && arr[i].length==1){
             charArray.push(arr[i])
        }
    }
}
```

## Merge Two Arrays

You can merge two JavaScript arrays in several ways. The most common modern approach is the spread **operator (...).**

**1.Spread operator — Recommended**
```javascript
    var a = [1, 2, 3];
    var b = [4, 5, 6, 7];

    var c = [...a, ...b];

    console.log(c);
    // Output: [1, 2, 3, 4, 5, 6, 7]
```
...a means: take all elements from a and place them here.
So:

**[...a, ...b]**

becomes:

**[1, 2, 3, 4, 5, 6, 7]**

**2. Using concat()**

Another common interview answer:

```javascript
var c = a.concat(b);

console.log(c);
```
Output:

**[1, 2, 3, 4, 5, 6, 7]**

Both approaches create a new array and don't modify a or b.

**3. If interviewer asks to modify the existing array**
```javascript
a.push(...b);

console.log(a);
```
Output:

**[1, 2, 3, 4, 5, 6, 7]**

Here a itself is modified.

Interview answer: Usually say, “I would use the spread operator for modern JavaScript: **const merged = [...a, ...b]. Alternatively, a.concat(b)** can be used.”

## Find the Common Elements

You can use the spread operator to merge and **filter() + includes()** to find common elements.
```javascript
var a=[1,2,3]
var b=[4,5,6,7,8,1,2]
var c=[...a,...b]
console.log(c)
```
// Output :[
  1, 2, 3, 4, 5,
  6, 7, 8, 1, 2
]

```javascript
var commonElements= a.filter(x=>b.includes(x))
console.log(commonElements)
```
// Output
**[ 1, 2 ]**

**Unique merged array without duplication**
```javascript
var a=[1,2,3]
var b=[4,5,6,7,8,1,2]
var c=[...a,...b]
var uniqueMerged = [...new Set([...a , ...b])];
console.log(uniqueMerged)
```
//Ouput
**[1, 2, 3, 4, 5, 6, 7, 8]**

## Array Sorting

If an interviewer asks you to sort an array without using JavaScript's built-in sort(), the simplest answer is to use a sorting algorithm such as Bubble Sort.

```javascript
var a = [1, 2, 3, 9, 8, 0, 5, 11, 6];

for (var i = 0; i < a.length - 1; i++) {

    for (var j = 0; j < a.length - 1 - i; j++) {

        if (a[j] > a[j + 1]) {

            // Swap
            var temp = a[j];
            a[j] = a[j + 1];
            a[j + 1] = temp;
        }
    }
}

console.log(a);
```
Output:

**[0, 1, 2, 3, 5, 6, 8, 9, 11]**

Built in function 
```javascript
var sortrec=a.sort((a,b)=>a-b)
console.log(sortrec);
```

## Sum the Array using reduce()

```javascript
var a = [1, 2, 3, 9, 8, 0, 5, 11, 6];

var sum = a.reduce((total, current) => {
    return total + current;
}, 0);

console.log(sum);

// Output:45
```

- total → accumulated value
- current → current array element
- 0 → initial value of total

## find() and filter()

In JavaScript, both find() and filter() search an array based on a condition. The main difference is:

- `find()` returns the first matching element.
- `filter()` returns all matching elements as a new array.

**find()**
```javascript
var numbers = [10, 20, 30, 40, 50];

var result = numbers.find(x => x > 25);

console.log(result);
```
**Output:**
30

Even though `30, 40`, and `50` satisfy the condition, find() stops at the first match.

If nothing matches:
```javascript
var result = numbers.find(x => x > 100);

console.log(result); // undefined
```
**filter()**
```javascript
var numbers = [10, 20, 30, 40, 50];

var result = numbers.filter(x => x > 25);

console.log(result);
```
**Output:**
`[30, 40, 50]`

`filter()` checks the array and returns all matching elements.

If nothing matches:
```javascript
var result = numbers.filter(x => x > 100);

console.log(result); // []
```
**Real-world example with objects**
```javascript
var users = [
    { id: 1, name: "John", role: "Admin" },
    { id: 2, name: "David", role: "User" },
    { id: 3, name: "Peter", role: "User" }
];
```
If you need one user by ID, `use find()`:
```javascript
var user = users.find(x => x.id === 2);

console.log(user);
```
Output:
`{ id: 2, name: "David", role: "User" }`

If you need **all users with a particular role**, use `filter()`:
```javascript
var normalUsers = users.filter(x => x.role === "User");

console.log(normalUsers);
```
**Output:**
[
    { id: 2, name: "David", role: "User" },
    { id: 3, name: "Peter", role: "User" }
]

**Interview answer**

- `find()` returns the first element that satisfies the condition and returns undefined if nothing matches. 
- `filter()` returns a new array containing all matching elements and returns an empty array if nothing matches.

## Object Code for understanding

```javascript
const obj1={};

const obj2={
    name:"Venkat"
}
const obj3={
    name:"Venky"
}
obj1[obj2]={
    name:"Venkatesn"
}
obj1[obj3]={
    name:"Vijay"
}
console.log(obj1[obj2])
```
**Output:**
`{ name: 'Vijay' }`

## function call with Normal and currying - using Same function satifying different function call

```javascript
function sum(a,b){
    if (a && b) return a+b;
    return function (b){
       return a+b
    }
}

console.log(sum(8,9));
console.log(sum(8)(9))
```
**Output**
`17`
`17`

## Primitive and NonPrimitive datatype coding simple question

```javascript
console.log([]===[]); // false
console.log([]==[]); // false
```
The reason is that **arrays are objects in JavaScript**, and objects are compared by reference, not by their contents.

Each [] creates a **new array object in memory.**

Conceptually:

[]  → Array Object #1
[]  → Array Object #2

Even though both arrays are empty, they are different objects.

**Why [] === [] is false**

=== is strict equality. For objects, it checks whether both variables refer to the same object.

console.log([] === []); // false

It's similar to:

var a = [];
var b = [];

console.log(a === b); // false

a and b contain different array references.

Why [] == [] is also false

You might think == performs type conversion and could return true.

But here, both operands are already objects.

[] == [] // false

When will it return true?

When both variables reference the same array:
```javascript
var a = [];
var b = a;

console.log(a === b); // true
console.log(a == b);  // true
```
Conceptually:

          ┌──────────┐
a ───────→│    []    │
          │  Array   │
b ───────→│  Object  │
          └──────────┘

Both variables point to the same object.

Important interview twist

Now consider this:
console.log([] == "");  // true
console.log([] === ""); // false

Why?

With ==, one side is an object and the other is a primitive, so JavaScript performs type coercion:
[] == ""

[] converts to ""

"" == ""

true
But === doesn't perform type coercion:
Array !== String // false

**Interview answer**

Arrays are objects in JavaScript. Objects are compared by reference rather than by their contents. 

Every `[]` creates a new array object, so `[] === []` and `[] == []` both return false. 

If two variables point to the same array object, both comparisons return true.

A useful rule to remember:

- Primitive values → generally compared by value
- Objects/Arrays   → compared by reference