---
id: csharp-algorithms-and-associated-time-memory-complexity
slug: algorithms-and-associated-time-memory-complexity
title: Algorithms and associated time/memory complexity
categoryId: csharp
subcategory: Big-O basics
difficulty: Intermediate
tags:
  - Big-O notation
  - algorithms
  - Time complexity
  - Space complexity
  - memory complexity
summary: Time complexity describes how execution time grows as input size n increases. Space complexity describes how much additional memory an algorithm requires.
updatedAt: 2026-09-02
status: published
thumbnail: ""
videos: []
resources: []
---

# Algorithms and associated time/memory complexity

## Algorithms and associated time/memory complexity

In .NET/C#, when interviewers ask “algorithms and associated time/memory complexity”, they usually expect you to understand Big-O notation, common data structures, sorting/searching algorithms, and the complexity of common .NET collections.

**Big-O basics**

Time complexity describes how execution time grows as input size n increases.
Space complexity describes how much additional memory an algorithm requires.

| Complexity     | Meaning                | Typical example                    |
| -------------- | ---------------------- | ---------------------------------- |
| **O(1)**       | Constant               | `Dictionary` lookup average case   |
| **O(log n)**   | Logarithmic            | Binary Search                      |
| **O(n)**       | Linear                 | Loop through an array              |
| **O(n log n)** | Very efficient sorting | Merge Sort, `Array.Sort()` average |
| **O(n²)**      | Quadratic              | Nested loops, Bubble Sort          |
| **O(2ⁿ)**      | Exponential            | Naive recursive Fibonacci          |
| **O(n!)**      | Factorial              | Generating all permutations        |

A useful interview ranking is:

O(1)
 ↓
O(log n)
 ↓
O(n)
 ↓
O(n log n)
 ↓
O(n²)
 ↓
O(2ⁿ)
 ↓
O(n!)

Lower growth is generally better.

Common algorithms in C#

| Algorithm      |       Best |    Average |      Worst |      Extra Space |
| -------------- | ---------: | ---------: | ---------: | ---------------: |
| Linear Search  |       O(1) |       O(n) |       O(n) |             O(1) |
| Binary Search  |       O(1) |   O(log n) |   O(log n) |   O(1) iterative |
| Bubble Sort    |      O(n)* |      O(n²) |      O(n²) |             O(1) |
| Selection Sort |      O(n²) |      O(n²) |      O(n²) |             O(1) |
| Insertion Sort |       O(n) |      O(n²) |      O(n²) |             O(1) |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) |             O(n) |
| Quick Sort     | O(n log n) | O(n log n) |      O(n²) | O(log n) typical |
| Heap Sort      | O(n log n) | O(n log n) | O(n log n) |             O(1) |
| BFS            |   O(V + E) |   O(V + E) |   O(V + E) |             O(V) |
| DFS            |   O(V + E) |   O(V + E) |   O(V + E) |             O(V) |

`*` Bubble Sort can be O(n) in the best case when implemented with an early-exit optimization.

**1. Linear Search — O(n)**

```csharp
int Find(int[] numbers, int target)
{
    for (int i = 0; i < numbers.Length; i++)
    {
        if (numbers[i] == target)
            return i;
    }

    return -1;
}
```
For:
`[10, 20, 30, 40, 50]`
finding 50 may require checking all 5 elements.

Time: O(n)
Space: O(1)

**2. Binary Search — O(log n)**

Binary Search requires sorted data.

```csharp
int BinarySearch(int[] arr, int target)
{
    int left = 0;
    int right = arr.Length - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target)
            return mid;

        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return -1;
}

```

For 1,000,000 elements, Binary Search requires only around 20 comparisons.

**Time:** O(log n)
**Space:** O(1)

This is a very good interview example of why algorithm choice matters.

**3. Nested loops — O(n²)**

```csharp
for (int i = 0; i < arr.Length; i++)
{
    for (int j = 0; j < arr.Length; j++)
    {
        Console.WriteLine($"{arr[i]} {arr[j]}");
    }
}
```

If n = 1000:
1000 × 1000
= 1,000,000 operations
Therefore:

Time = O(n²)

**4. Dictionary lookup — average O(1)**

```csharp
Dictionary<int, string> employees = new();

employees.Add(101, "John");
employees.Add(102, "David");

string employee = employees[102];
```
A Dictionary<TKey,TValue> uses hashing.

Typical complexities:

Insert      O(1) average
Lookup      O(1) average
Delete      O(1) average

Worst-case operations can degrade, so in an interview say average O(1) rather than simply “always O(1).”

Important .NET collection complexities

For experienced .NET interviews, this table is particularly useful.
| Collection / Operation           |           Complexity |
| -------------------------------- | -------------------: |
| `Array[index]`                   |                 O(1) |
| Array search                     |                 O(n) |
| `List<T>[index]`                 |                 O(1) |
| `List<T>.Add()`                  |       O(1) amortized |
| `List<T>.Insert(0, item)`        |                 O(n) |
| `List<T>.Remove(item)`           |                 O(n) |
| `List<T>.Contains()`             |                 O(n) |
| `Dictionary<TKey,TValue>` lookup |         O(1) average |
| `Dictionary.Add()`               |         O(1) average |
| `HashSet<T>.Contains()`          |         O(1) average |
| `HashSet<T>.Add()`               |         O(1) average |
| `Queue<T>.Enqueue()`             |                 O(1) |
| `Queue<T>.Dequeue()`             |                 O(1) |
| `Stack<T>.Push()`                |                 O(1) |
| `Stack<T>.Pop()`                 |                 O(1) |
| `SortedDictionary<K,V>`          |             O(log n) |
| `SortedSet<T>` lookup/add/remove |             O(log n) |
| LINQ `FirstOrDefault()`          |      O(n) worst case |
| LINQ `Where()`                   | O(n) when enumerated |
| LINQ `OrderBy()`                 | O(n log n) generally |

**A very common interview problem**

Suppose you need to find whether two numbers add up to a target.

int[] arr = { 10, 15, 11, 8, 12 };
int target = 25;

Approach 1 — Nested loops
```csharp
for (int i = 0; i < arr.Length; i++)
{
    for (int j = i + 1; j < arr.Length; j++)
    {
        if (arr[i] + arr[j] == target)
        {
            Console.WriteLine($"{i}, {j}");
        }
    }
}
```
Complexity:

**Time**  : O(n²)
**Space** : O(1)

**Approach 2 — Dictionary**

```csharp
static int[] TwoSum(int[] nums, int target)
{
    Dictionary<int, int> map = new();

    for (int i = 0; i < nums.Length; i++)
    {
        int required = target - nums[i];

        if (map.TryGetValue(required, out int index))
            return new[] { index, i };

        map[nums[i]] = i;
    }

    return Array.Empty<int>();
}
```
For:
`10, 15, 11, 8, 12`
target:
`25`

result:
`indexes = [0, 1]`

because:
`10 + 15 = 25`
Complexity:
Time  : O(n) average
Space : O(n)
This demonstrates an important engineering trade-off:

Nested loops
Time  O(n²)
Memory O(1)

Dictionary
Time  O(n)
Memory O(n)

We **are using additional memory to improve execution speed.**
A strong experienced-level answer would be:
“I consider both time and space complexity when selecting an algorithm. For example, searching an unsorted list requires O(n), while binary search on sorted data requires O(log n). If I need frequent key-based lookups, I would typically consider a Dictionary, which provides O(1) average lookup at the cost of additional memory. So optimization is normally a trade-off between CPU time, memory usage, maintainability, and the characteristics of the data.”
**How to explain complexity in an interview**


