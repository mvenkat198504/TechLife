---
id: aspnet-react-009
slug:  Reorder UI Components by `TabIndex` in C#
title: Reorder UI Components by `TabIndex` in C#
categoryId: aspnet-core
subcategory: Reorder UI Components by `TabIndex` in C#
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Dependency Injection
  - React-Facing API
  - aspnet-core
summary: Reorder UI Components by `TabIndex` in C#
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---
# Interview Guide: Reorder UI Components by `TabIndex` in C#

## Interview question

**Write a C# method using .NET Core that takes a list of UI component models, each with a `TabIndex` property, and returns a new list reordered so that all components with `TabIndex >= 0` appear first, sorted ascending, followed by components with `TabIndex < 0`, sorted descending.**

## Short interview answer

> I would partition the components into non-negative and negative values, sort the first group ascending and the second descending, concatenate them, and materialize a new list. LINQ's ordering is stable, so components with the same `TabIndex` retain their original relative order. The input list is not changed. The time complexity is `O(n log n)` and the extra space is `O(n)`.

## Recommended implementation

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

public sealed class UiComponent
{
    public string Name { get; init; } = string.Empty;
    public int TabIndex { get; init; }
}

public static class UiComponentSorter
{
    public static List<UiComponent> ReorderByTabIndex(
        IReadOnlyList<UiComponent> components)
    {
        ArgumentNullException.ThrowIfNull(components);

        var nonNegative = components
            .Where(component => component.TabIndex >= 0)
            .OrderBy(component => component.TabIndex);

        var negative = components
            .Where(component => component.TabIndex < 0)
            .OrderByDescending(component => component.TabIndex);

        return nonNegative.Concat(negative).ToList();
    }
}
```

**Assumption:** the list contains no null component entries. If null elements are possible, decide explicitly whether to reject, skip or place them in a defined position. Do not silently invent a `TabIndex` for them.

### How the code works

1. `Where(component => component.TabIndex >= 0)` selects zero and positive values.
2. `OrderBy(component => component.TabIndex)` places them in ascending order: `0, 1, 2, ...`.
3. The second `Where` selects negative values, and `OrderByDescending` produces `-1, -2, -3, ...`.
4. `Concat` places the negative group after the non-negative group.
5. `ToList()` evaluates the query and creates a **new list**. The original list is not sorted or mutated.

LINQ ordering is stable: when two components have an equal key, their relative input order remains the same within that group.

## Worked example

```csharp
var components = new List<UiComponent>
{
    new() { Name = "A", TabIndex = -3 },
    new() { Name = "B", TabIndex =  2 },
    new() { Name = "C", TabIndex =  0 },
    new() { Name = "D", TabIndex = -1 },
    new() { Name = "E", TabIndex =  1 },
    new() { Name = "F", TabIndex =  2 },
    new() { Name = "G", TabIndex = -3 }
};

var reordered = UiComponentSorter.ReorderByTabIndex(components);

Console.WriteLine(string.Join(", ",
    reordered.Select(component => $"{component.Name}:{component.TabIndex}")));
```

**Output:**

```text
C:0, E:1, B:2, F:2, D:-1, A:-3, G:-3
```

`B` stays before `F` for the shared value `2`; `A` stays before `G` for the shared value `-3`. The source list still starts with `A`.

## A single-sort alternative

A custom comparer can express the grouping in one sorting operation. This is useful if the sorting rule is reused in several places or must be passed to another API.

```csharp
public sealed class TabIndexComparer : IComparer<UiComponent>
{
    public int Compare(UiComponent? x, UiComponent? y)
    {
        if (ReferenceEquals(x, y)) return 0;
        if (x is null) return 1;  // Optional policy: nulls last.
        if (y is null) return -1;

        bool xIsNegative = x.TabIndex < 0;
        bool yIsNegative = y.TabIndex < 0;

        if (xIsNegative != yIsNegative)
            return xIsNegative ? 1 : -1;

        return xIsNegative
            ? y.TabIndex.CompareTo(x.TabIndex) // descending for negatives
            : x.TabIndex.CompareTo(y.TabIndex); // ascending otherwise
    }
}

public static List<UiComponent> ReorderWithComparer(
    IReadOnlyList<UiComponent> components)
{
    ArgumentNullException.ThrowIfNull(components);
    return components.OrderBy(x => x, new TabIndexComparer()).ToList();
}
```

`OrderBy` remains stable for equal comparer results. By contrast, copying to a list and calling `List<T>.Sort(comparer)` does **not** promise stable ordering for ties. If tie order matters and you use `List<T>.Sort`, add an original-position tie breaker. The comparer uses `CompareTo` rather than subtracting integers: `x.TabIndex - y.TabIndex` can overflow for extreme `int` values.

For this interview question, the first LINQ solution is clearer. A single-sort approach can reduce repeated enumeration of a source, but do not assume it is faster without measuring the actual data size and workload.

## Complexity

Let `n` be the number of components.

| Aspect | Result | Reason |
| --- | --- | --- |
| Time | `O(n log n)` | Two group sorts dominate; partitioning and concatenation are linear |
| Extra space | `O(n)` | Sorted buffers and new result list |
| Input mutation | None | `OrderBy` and `ToList` produce a separate sequence/list |
| Relative order of equal indexes | Preserved | LINQ `OrderBy`/`OrderByDescending` are stable |

The method enumerates the `IReadOnlyList` for each filter and sorts the groups. This is usually fine for a list already in memory. If obtaining elements is expensive, or this is on a hot path with very large lists, materialize/partition once and benchmark an explicit approach.

## Edge cases

| Input | Expected output |
| --- | --- |
| Empty list | A new empty list |
| All non-negative | Ascending values |
| All negative | Descending values (for example, `-1, -2, -5`) |
| Contains zero | Zero begins the non-negative group |
| Repeated indexes | Original order among equal values |
| `int.MinValue` and `int.MaxValue` | Correct with `OrderBy`/`CompareTo`; avoid arithmetic negation or subtraction |
| Null list argument | `ArgumentNullException` |

### Simple assertion example

```csharp
var actual = UiComponentSorter.ReorderByTabIndex(components);
var names = actual.Select(x => x.Name).ToArray();

// xUnit example:
Assert.Equal(new[] { "C", "E", "B", "F", "D", "A", "G" }, names);
Assert.Equal("A", components[0].Name); // input remains unchanged
```

## Experienced-level follow-up questions

**Why use `Concat` and `ToList`?** `Concat` puts the two ordered groups in the required order. LINQ queries are deferred until enumerated; `ToList` materializes the requested new list immediately.

**Why not use `OrderBy(x => x.TabIndex)` on the whole list?** That places negative indexes first, contrary to the requirement, and orders negatives ascending (`-5, -2, -1`) rather than descending.

**Why not use `Math.Abs` for negative values?** The requested negative order is naturally expressed by `OrderByDescending`. `Math.Abs(int.MinValue)` is problematic, and magnitude tricks obscure the rule.

**How would you handle null elements?** Agree on a policy: reject with an argument error, exclude them, or place them last. The recommended method assumes non-null entries and a non-null input list.

**Would you mutate the source with `List<T>.Sort`?** No, because the method must return a new list. I would copy first if choosing an in-place sorting API, and I would address stability explicitly.

**Does this change actual browser tab navigation?** Sorting C# models changes the order of the list returned to the caller. In HTML, negative `tabindex` values remove elements from sequential keyboard tabbing, and positive values affect focus order differently from simple list sorting. If these models are rendered into an actual UI, confirm the UX/accessibility intent. Prefer a logical DOM order and `tabindex="0"` for ordinary controls rather than using many positive tabindex values to repair a confusing layout.

## Common mistakes

- Putting negative indexes before zero and positive values.
- Sorting the negative group ascending.
- Mutating the caller's list despite the “new list” requirement.
- Assuming `List<T>.Sort` preserves input order for equal keys.
- Using subtraction in an integer comparer and risking overflow.
- Treating the C# list order as identical to the browser's keyboard focus algorithm.

## Closing statement

> I would use two stable LINQ sorts and concatenate them: non-negative ascending, then negative descending. It is readable, preserves ties and the original input, and has `O(n log n)` time complexity.

## References

- [Microsoft Learn: `Enumerable.OrderBy`](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderby)
- [Microsoft Learn: `Enumerable.OrderByDescending`](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.orderbydescending)
- [Microsoft Learn: `Enumerable.Concat`](https://learn.microsoft.com/en-us/dotnet/api/system.linq.enumerable.concat)
- [MDN: HTML `tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
