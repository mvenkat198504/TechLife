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
console.log(withdrawCash(280, atmInventory));

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
difficulty: Experienced
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