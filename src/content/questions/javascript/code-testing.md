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
  - reverseString
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
id: javascript-codetesting-004
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