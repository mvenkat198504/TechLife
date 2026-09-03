---
id: linq-interview-prepration-001
slug: linq-interview
title: LINQ Interview Questions and Answers
summary: LINQ interview questions for freshers and experienced .NET developers with examples, interview tips, traps, scenario-based questions, and coding exercises.
categoryId: aspnet-core
subcategory: LINQ
tags:
  - C#
  - LINQ
  - .NET
  - Interview Questions
  - Freshers
  - Experienced
difficulty: "Beginner to Advanced"
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# LINQ Interview Questions and Answers

LINQ (**Language Integrated Query**) is a query capability built into C# and .NET that allows developers to query collections, databases, XML, and other data sources using a consistent syntax.

This guide contains:

- Fresher-level LINQ interview questions
- Experienced-level LINQ interview questions
- Practical coding examples
- Scenario-based questions
- Common interview traps
- Performance-related questions
- `IEnumerable` vs `IQueryable`
- Deferred execution
- `Select` vs `SelectMany`
- `First`, `Single`, `FirstOrDefault`, and `SingleOrDefault`
- LINQ joins and grouping
- LINQ with Entity Framework Core
- Interview tips

---

# 1. What is LINQ in C#?

## Answer

LINQ stands for **Language Integrated Query**.

It allows us to query collections and other data sources directly using C# syntax.

Common LINQ data sources include:

- Arrays
- Lists
- Dictionaries
- Entity Framework / databases
- XML
- DataSets

## Example

```csharp
int[] numbers = { 1, 2, 3, 4, 5, 6 };

var evenNumbers = numbers
    .Where(x => x % 2 == 0)
    .ToList();

foreach (var number in evenNumbers)
{
    Console.WriteLine(number);
}
```

### Output

```text
2
4
6
```

## Interview Tip

A good short interview answer:

> LINQ provides a consistent and strongly typed way to query different data sources using C#.

## Interview Trap

**Question:** Is LINQ only used with databases?

**Answer:** No.

LINQ can query in-memory collections, XML, DataSets, databases through Entity Framework, and other query providers.

---

# 2. What are the two LINQ syntaxes?

## Answer

LINQ supports:

1. Query Syntax
2. Method Syntax

## Query Syntax

```csharp
var result =
    from employee in employees
    where employee.Salary > 50000
    select employee;
```

## Method Syntax

```csharp
var result = employees
    .Where(employee => employee.Salary > 50000);
```

## Interview Tip

Method syntax is more commonly used in real-world .NET applications because all LINQ operators are available through method syntax.

---

# 3. What is the difference between `Where()` and `Select()`?

## Answer

`Where()` filters records.

`Select()` transforms or projects records.

## Example

```csharp
var employees = new List<Employee>
{
    new Employee { Id = 1, Name = "Arun", Salary = 45000 },
    new Employee { Id = 2, Name = "John", Salary = 65000 }
};

var filtered = employees
    .Where(x => x.Salary > 50000);

var names = employees
    .Select(x => x.Name);
```

`filtered` contains employees whose salary is greater than 50000.

`names` contains only employee names.

## Interview Trap

```csharp
employees.Select(x => x.Salary > 50000);
```

This does **not** filter employees.

It returns:

```text
false
true
```

because `Select()` projects each item into a Boolean value.

---

# 4. What is deferred execution in LINQ?

## Answer

Deferred execution means that the LINQ query is not executed when it is created.

It executes when the result is enumerated.

## Example

```csharp
var numbers = new List<int> { 1, 2, 3 };

var query = numbers.Where(x => x > 1);

numbers.Add(4);

foreach (var item in query)
{
    Console.WriteLine(item);
}
```

### Output

```text
2
3
4
```

The query executed only when `foreach` started.

## Immediate Execution

Methods such as the following execute immediately:

```csharp
ToList()
ToArray()
Count()
First()
Single()
Max()
Min()
Sum()
Average()
```

## Interview Tip

Say:

> LINQ operators such as `Where()` and `Select()` normally use deferred execution, while materialization operators such as `ToList()` execute the query immediately.

## Interview Trap

Do not say that **all LINQ methods use deferred execution**.

Aggregate and materialization methods usually execute immediately.

---

# 5. What is `IEnumerable<T>`?

## Answer

`IEnumerable<T>` represents a sequence of objects that can be enumerated.

It is commonly used for in-memory collections.

## Example

```csharp
IEnumerable<int> numbers = new List<int>
{
    1, 2, 3, 4, 5
};

var result = numbers.Where(x => x > 3);
```

Filtering normally happens in application memory.

---

# 6. What is `IQueryable<T>`?

## Answer

`IQueryable<T>` represents a query that can be translated by a query provider.

It is commonly used by Entity Framework Core.

## Example

```csharp
IQueryable<Employee> employees = dbContext.Employees;

var result = employees
    .Where(x => x.Salary > 50000);
```

Entity Framework Core can translate this query into SQL.

Conceptually:

```sql
SELECT *
FROM Employees
WHERE Salary > 50000;
```

---

# 7. `IEnumerable` vs `IQueryable`

| Feature | IEnumerable | IQueryable |
|---|---|---|
| Namespace | System.Collections.Generic | System.Linq |
| Common Use | In-memory collections | Database queries |
| Filtering | Usually client side | Usually provider/server side |
| Query Translation | No | Yes |
| EF Core SQL Generation | No | Yes |
| Expression Type | Delegates | Expression Trees |

## Interview Example

```csharp
var query = dbContext.Employees
    .Where(x => x.Salary > 50000);
```

If `Employees` is an EF Core `DbSet`, the query remains `IQueryable`.

SQL filtering occurs at the database.

But:

```csharp
var employees = dbContext.Employees.ToList();

var result = employees.Where(x => x.Salary > 50000);
```

`ToList()` loads rows first.

The filtering afterward occurs in application memory.

## Interview Trap

Avoid calling `ToList()` too early in a database query.

Bad:

```csharp
var employees = dbContext.Employees
    .ToList()
    .Where(x => x.Salary > 50000);
```

Better:

```csharp
var employees = dbContext.Employees
    .Where(x => x.Salary > 50000)
    .ToList();
```

---

# 8. What is the difference between `First()` and `FirstOrDefault()`?

## `First()`

Returns the first element.

Throws an exception when no matching element exists.

```csharp
var employee = employees.First(x => x.Id == 10);
```

## `FirstOrDefault()`

Returns the first matching element.

Returns the default value when no record exists.

```csharp
var employee = employees.FirstOrDefault(x => x.Id == 10);
```

For a reference type, the default is normally `null`.

## Interview Tip

Use `FirstOrDefault()` when zero records is an expected situation.

---

# 9. What is the difference between `Single()` and `SingleOrDefault()`?

## `Single()`

Expected result count:

```text
Exactly one
```

Exceptions occur if:

- Zero records exist
- More than one record exists

## `SingleOrDefault()`

Expected result count:

```text
Zero or one
```

Exception occurs if:

- More than one record exists

## Example

```csharp
var user = users.SingleOrDefault(x => x.Email == email);
```

This is useful when `Email` is expected to be unique.

---

# 10. `FirstOrDefault()` vs `SingleOrDefault()`

| Method | Zero Items | One Item | Multiple Items |
|---|---|---|---|
| FirstOrDefault | Default | Returns item | Returns first |
| SingleOrDefault | Default | Returns item | Exception |

## Interview Trap

**Question:** Which should you use for a unique email lookup?

Strong answer:

> If the business rule guarantees uniqueness and I want to detect duplicate data, `SingleOrDefault()` communicates that intent. In many EF Core codebases, `FirstOrDefault()` is also used when the database already enforces a unique constraint.

---

# 11. What is `Any()` in LINQ?

## Answer

`Any()` checks whether at least one element exists or matches a condition.

```csharp
bool hasEmployees = employees.Any();
```

Condition:

```csharp
bool hasHighSalaryEmployee =
    employees.Any(x => x.Salary > 100000);
```

## Interview Tip

For existence checks, prefer:

```csharp
Any()
```

instead of:

```csharp
Count() > 0
```

especially for database queries.

---

# 12. `Any()` vs `Count() > 0`

## Better

```csharp
bool exists = employees.Any();
```

## Less Appropriate for Existence Checking

```csharp
bool exists = employees.Count() > 0;
```

`Any()` only needs to determine whether at least one matching item exists.

`Count()` calculates the number of matching items.

---

# 13. What is `All()`?

## Answer

`All()` checks whether every element satisfies a condition.

```csharp
bool allAdults = people.All(x => x.Age >= 18);
```

---

# 14. What is `OrderBy()`?

## Answer

`OrderBy()` sorts data in ascending order.

```csharp
var result = employees.OrderBy(x => x.Name);
```

Descending:

```csharp
var result = employees.OrderByDescending(x => x.Salary);
```

---

# 15. What is `ThenBy()`?

## Answer

`ThenBy()` applies secondary sorting.

```csharp
var result = employees
    .OrderBy(x => x.Department)
    .ThenBy(x => x.Name);
```

Descending secondary sort:

```csharp
var result = employees
    .OrderBy(x => x.Department)
    .ThenByDescending(x => x.Salary);
```

## Interview Trap

This is incorrect if you want secondary sorting:

```csharp
employees
    .OrderBy(x => x.Department)
    .OrderBy(x => x.Name);
```

The second `OrderBy` starts a new primary ordering.

Use `ThenBy`.

---

# 16. What is `GroupBy()`?

## Answer

`GroupBy()` groups elements based on a key.

## Example

```csharp
var groupedEmployees = employees
    .GroupBy(x => x.Department);

foreach (var group in groupedEmployees)
{
    Console.WriteLine(group.Key);

    foreach (var employee in group)
    {
        Console.WriteLine(employee.Name);
    }
}
```

---

# 17. Find employee count by department

```csharp
var result = employees
    .GroupBy(x => x.Department)
    .Select(group => new
    {
        Department = group.Key,
        EmployeeCount = group.Count()
    });
```

---

# 18. Find the highest salary in each department

```csharp
var result = employees
    .GroupBy(x => x.Department)
    .Select(group => new
    {
        Department = group.Key,
        MaxSalary = group.Max(x => x.Salary)
    });
```

## Interview Tip

Grouping plus aggregation is one of the most common LINQ coding-round patterns.

---

# 19. What is an anonymous type?

## Answer

Anonymous types allow us to create objects without explicitly defining a class.

```csharp
var result = employees.Select(x => new
{
    x.Name,
    x.Salary
});
```

Useful for temporary projections.

---

# 20. What is projection in LINQ?

## Answer

Projection means transforming source objects into another shape.

```csharp
var result = employees.Select(x => new EmployeeDto
{
    Id = x.Id,
    Name = x.Name
});
```

For EF Core APIs, projection is important because it can retrieve only required columns.

---

# 21. What is `SelectMany()`?

## Answer

`SelectMany()` flattens nested collections.

## Example

```csharp
var departments = new[]
{
    new
    {
        Name = "IT",
        Skills = new[] { "C#", "SQL" }
    },
    new
    {
        Name = "HR",
        Skills = new[] { "Recruitment", "Payroll" }
    }
};

var skills = departments
    .SelectMany(x => x.Skills);
```

### Output

```text
C#
SQL
Recruitment
Payroll
```

---

# 22. `Select()` vs `SelectMany()`

Suppose:

```csharp
var data = new[]
{
    new[] { 1, 2 },
    new[] { 3, 4 }
};
```

Using `Select`:

```csharp
var result = data.Select(x => x);
```

Result conceptually:

```text
[ [1,2], [3,4] ]
```

Using `SelectMany`:

```csharp
var result = data.SelectMany(x => x);
```

Result:

```text
[1,2,3,4]
```

## Interview Trap

If the interviewer asks:

> How do you flatten a collection of collections?

Answer:

```csharp
SelectMany()
```

---

# 23. What is `Distinct()`?

## Answer

`Distinct()` removes duplicate values.

```csharp
var numbers = new[] { 1, 1, 2, 2, 3 };

var result = numbers.Distinct();
```

### Output

```text
1
2
3
```

For custom objects, equality behavior matters.

In modern .NET, `DistinctBy()` is also useful:

```csharp
var employees = source.DistinctBy(x => x.Email);
```

---

# 24. What are `Skip()` and `Take()`?

They are commonly used for paging.

```csharp
var result = employees
    .Skip(20)
    .Take(10);
```

This skips the first 20 records and returns the next 10.

---

# 25. LINQ pagination example

```csharp
int pageNumber = 3;
int pageSize = 10;

var result = employees
    .OrderBy(x => x.Id)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToList();
```

## Interview Tip

Always use deterministic ordering when paging database records.

---

# 26. What is `Contains()`?

## Answer

Checks whether the sequence contains a value.

```csharp
var ids = new[] { 1, 2, 3 };

bool exists = ids.Contains(2);
```

EF Core can often translate collection `Contains()` into SQL similar to an `IN` clause.

```csharp
var selectedIds = new[] { 1, 2, 3 };

var employees = dbContext.Employees
    .Where(x => selectedIds.Contains(x.Id));
```

---

# 27. What is `Aggregate()`?

## Answer

`Aggregate()` performs a custom accumulation operation.

```csharp
var numbers = new[] { 1, 2, 3, 4 };

var result = numbers.Aggregate(
    (current, next) => current + next
);
```

### Output

```text
10
```

For simple summation, prefer:

```csharp
numbers.Sum();
```

---

# 28. What are aggregate LINQ operators?

Common operators:

```text
Count
Sum
Average
Min
Max
Aggregate
```

Example:

```csharp
var totalSalary = employees.Sum(x => x.Salary);

var averageSalary = employees.Average(x => x.Salary);

var maxSalary = employees.Max(x => x.Salary);
```

---

# 29. What is `ToList()`?

## Answer

`ToList()` materializes a sequence into a `List<T>`.

```csharp
var employees = dbContext.Employees
    .Where(x => x.IsActive)
    .ToList();
```

In database-backed queries, this generally executes the query.

---

# 30. Why should `ToList()` not be called too early?

Bad:

```csharp
var result = dbContext.Employees
    .ToList()
    .Where(x => x.Department == "IT")
    .Take(10);
```

Potential problem:

The application may first retrieve many employees and only then filter them.

Better:

```csharp
var result = dbContext.Employees
    .Where(x => x.Department == "IT")
    .Take(10)
    .ToList();
```

This allows the database provider to apply filtering and limiting.

## Interview Tip

A strong performance statement:

> Keep the query as `IQueryable` until all translatable filtering, projection, ordering, and pagination have been applied, then materialize it.

---

# 31. What is a LINQ Join?

## Example Data

```csharp
public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int DepartmentId { get; set; }
}

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}
```

## Join Example

```csharp
var result = employees.Join(
    departments,
    employee => employee.DepartmentId,
    department => department.Id,
    (employee, department) => new
    {
        EmployeeName = employee.Name,
        DepartmentName = department.Name
    });
```

---

# 32. LINQ Inner Join using Query Syntax

```csharp
var result =
    from employee in employees
    join department in departments
        on employee.DepartmentId equals department.Id
    select new
    {
        EmployeeName = employee.Name,
        DepartmentName = department.Name
    };
```

---

# 33. How do you perform a left join using LINQ?

A common pattern uses `GroupJoin`, `DefaultIfEmpty`, and `SelectMany`.

```csharp
var result =
    from employee in employees
    join department in departments
        on employee.DepartmentId equals department.Id
        into departmentGroup
    from department in departmentGroup.DefaultIfEmpty()
    select new
    {
        EmployeeName = employee.Name,
        DepartmentName = department?.Name ?? "No Department"
    };
```

## Interview Tip

`DefaultIfEmpty()` is an important keyword when explaining LINQ left joins.

---

# 34. What is `GroupJoin()`?

## Answer

`GroupJoin()` associates each item from the outer collection with a group of matching inner elements.

It is similar conceptually to a grouped join and is commonly used when constructing left outer joins.

---

# 35. What is `DefaultIfEmpty()`?

## Answer

Returns the original sequence if items exist.

If the sequence is empty, it returns a sequence containing the default value.

```csharp
var numbers = Array.Empty<int>();

var result = numbers.DefaultIfEmpty();
```

For `int`, the default value is:

```text
0
```

---

# 36. `OfType<T>()` vs `Cast<T>()`

## `OfType<T>()`

Returns only elements that can be converted to the specified type.

```csharp
object[] items =
{
    1,
    "Hello",
    2,
    "World"
};

var numbers = items.OfType<int>();
```

Result:

```text
1
2
```

## `Cast<T>()`

Attempts to cast every element.

```csharp
var numbers = items.Cast<int>();
```

This can throw an exception when an item cannot be cast.

## Interview Trap

`OfType<T>()` filters incompatible types.

`Cast<T>()` does not.

---

# 37. What is `ToDictionary()`?

## Answer

Converts data to a dictionary.

```csharp
var dictionary = employees.ToDictionary(
    x => x.Id,
    x => x.Name
);
```

## Interview Trap

Duplicate keys can cause an exception.

---

# 38. What is `ToLookup()`?

## Answer

`ToLookup()` creates a one-to-many lookup.

```csharp
var lookup = employees.ToLookup(x => x.Department);
```

Unlike `Dictionary`, multiple values can share the same key.

---

# 39. What is the difference between `GroupBy()` and `ToLookup()`?

A simple practical difference:

- `GroupBy()` normally participates in deferred query execution.
- `ToLookup()` creates the lookup immediately.

---

# 40. What is `SequenceEqual()`?

## Answer

Checks whether two sequences contain equal elements in the same order.

```csharp
var first = new[] { 1, 2, 3 };
var second = new[] { 1, 2, 3 };

bool equal = first.SequenceEqual(second);
```

Result:

```text
true
```

---

# 41. What are `Union`, `Intersect`, and `Except`?

## Union

Combines distinct values.

```csharp
var result = first.Union(second);
```

## Intersect

Returns common values.

```csharp
var result = first.Intersect(second);
```

## Except

Returns values from the first sequence that are not present in the second.

```csharp
var result = first.Except(second);
```

---

# 42. LINQ question: Find common elements from two arrays

```csharp
var first = new[] { 1, 2, 3, 4 };

var second = new[] { 3, 4, 5, 6 };

var common = first.Intersect(second);
```

### Output

```text
3
4
```

---

# 43. LINQ question: Find duplicate numbers

```csharp
var numbers = new[]
{
    1, 2, 3, 2, 4, 1, 5
};

var duplicates = numbers
    .GroupBy(x => x)
    .Where(group => group.Count() > 1)
    .Select(group => group.Key);
```

### Output

```text
1
2
```

---

# 44. LINQ question: Remove duplicates

```csharp
var numbers = new[]
{
    1, 2, 2, 3, 3, 4
};

var uniqueNumbers = numbers.Distinct();
```

---

# 45. Find the second highest salary using LINQ

```csharp
var secondHighestSalary = employees
    .Select(x => x.Salary)
    .Distinct()
    .OrderByDescending(x => x)
    .Skip(1)
    .FirstOrDefault();
```

## Interview Trap

Without `Distinct()`, duplicate highest salaries may produce the wrong interpretation of "second highest distinct salary."

---

# 46. Find the third highest salary using LINQ

```csharp
var thirdHighestSalary = employees
    .Select(x => x.Salary)
    .Distinct()
    .OrderByDescending(x => x)
    .Skip(2)
    .FirstOrDefault();
```

---

# 47. Find top 3 highest-paid employees

```csharp
var topEmployees = employees
    .OrderByDescending(x => x.Salary)
    .Take(3)
    .ToList();
```

---

# 48. Find employees whose name starts with A

```csharp
var result = employees
    .Where(x => x.Name.StartsWith("A"));
```

---

# 49. Find employees whose name contains "an"

```csharp
var result = employees
    .Where(x => x.Name.Contains("an"));
```

For database queries, exact translation and case sensitivity depend on the database provider and database collation.

---

# 50. Find employees with salary between 50,000 and 100,000

```csharp
var result = employees
    .Where(x =>
        x.Salary >= 50000 &&
        x.Salary <= 100000);
```

---

# Experienced-Level LINQ Questions

# 51. How does LINQ work internally?

## Answer

LINQ extension methods operate on abstractions such as:

```csharp
IEnumerable<T>
```

or:

```csharp
IQueryable<T>
```

For `IEnumerable<T>`, lambdas are generally compiled into delegates and executed by .NET.

For `IQueryable<T>`, lambda expressions can be represented as expression trees that query providers inspect and translate.

---

# 52. What is an expression tree?

## Answer

An expression tree represents code as a data structure.

Example:

```csharp
Expression<Func<Employee, bool>> expression =
    x => x.Salary > 50000;
```

A provider such as Entity Framework Core can inspect this expression and translate supported parts into SQL.

## Interview Tip

Important distinction:

```csharp
Func<Employee, bool>
```

is executable code.

```csharp
Expression<Func<Employee, bool>>
```

represents the expression structure.

---

# 53. Why can't every C# method be used inside an EF Core LINQ query?

Because database providers can translate only supported expressions into their target query language.

Example:

```csharp
var result = dbContext.Employees
    .Where(x => MyCustomCheck(x.Name))
    .ToList();
```

A custom method may not be translatable to SQL.

## Better Approach

Move supported filtering to the database first.

```csharp
var result = dbContext.Employees
    .Where(x => x.IsActive)
    .AsEnumerable()
    .Where(x => MyCustomCheck(x.Name))
    .ToList();
```

## Interview Trap

Using `AsEnumerable()` too early can move filtering into application memory and create performance problems.

---

# 54. `AsEnumerable()` vs `ToList()`

## `AsEnumerable()`

Changes how subsequent LINQ operators are evaluated without necessarily materializing the sequence immediately.

```csharp
var query = dbContext.Employees
    .Where(x => x.IsActive)
    .AsEnumerable();
```

Subsequent LINQ-to-Objects operations occur in application code.

## `ToList()`

Materializes the query into a list.

```csharp
var employees = dbContext.Employees
    .Where(x => x.IsActive)
    .ToList();
```

---

# 55. What is multiple enumeration?

## Answer

Multiple enumeration occurs when the same `IEnumerable` query is enumerated more than once.

Example:

```csharp
var query = GetEmployees()
    .Where(x => x.IsActive);

var count = query.Count();

foreach (var employee in query)
{
    Console.WriteLine(employee.Name);
}
```

Depending on the source, the underlying work may execute twice.

## Better

```csharp
var employees = GetEmployees()
    .Where(x => x.IsActive)
    .ToList();

var count = employees.Count;

foreach (var employee in employees)
{
    Console.WriteLine(employee.Name);
}
```

## Interview Tip

Materialize only when reuse is intentional and the memory trade-off is acceptable.

---

# 56. What is deferred execution useful for?

Benefits include:

- Composable query construction
- Query executes only when required
- Latest collection state may be observed
- Database providers can combine operations into one query

Possible disadvantages:

- Unexpected repeated execution
- Source data may change between enumerations
- Exceptions may occur later during enumeration

---

# 57. What is immediate execution?

Examples:

```csharp
ToList()
ToArray()
ToDictionary()
Count()
First()
Single()
Max()
Min()
Sum()
Average()
```

These methods need the query result immediately.

---

# 58. How do you dynamically construct a LINQ query?

```csharp
IQueryable<Employee> query =
    dbContext.Employees;

if (!string.IsNullOrWhiteSpace(search))
{
    query = query.Where(x =>
        x.Name.Contains(search));
}

if (departmentId.HasValue)
{
    query = query.Where(x =>
        x.DepartmentId == departmentId);
}

if (minimumSalary.HasValue)
{
    query = query.Where(x =>
        x.Salary >= minimumSalary);
}

var result = await query.ToListAsync();
```

## Interview Tip

This is a common real-world example of deferred execution and query composition.

---

# 59. Why should projection be applied before materialization?

Bad:

```csharp
var employees = dbContext.Employees
    .ToList()
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name
    });
```

Better:

```csharp
var employees = dbContext.Employees
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name
    })
    .ToList();
```

The second approach allows the provider to request only required columns.

---

# 60. What is the N+1 problem and how is LINQ related?

Consider:

```csharp
var employees = dbContext.Employees.ToList();

foreach (var employee in employees)
{
    Console.WriteLine(employee.Department.Name);
}
```

If lazy loading causes one additional query per employee, many database queries can be generated.

Possible solutions include:

```csharp
Include()
```

or projection:

```csharp
var employees = dbContext.Employees
    .Select(x => new
    {
        x.Name,
        DepartmentName = x.Department.Name
    })
    .ToList();
```

## Interview Tip

For API read operations, projection is often a strong solution because it fetches only the shape required by the API.

---

# 61. `Include()` vs `Select()` projection

## Include

Use when you need complete related entities.

```csharp
var orders = dbContext.Orders
    .Include(x => x.Customer)
    .ToList();
```

## Projection

Use when the response needs only selected fields.

```csharp
var orders = dbContext.Orders
    .Select(x => new OrderDto
    {
        Id = x.Id,
        CustomerName = x.Customer.Name
    })
    .ToList();
```

Projection can reduce transferred columns and object materialization.

---

# 62. What is client-side evaluation?

Client-side evaluation means part of the work happens inside application memory instead of in the database.

Example after explicitly switching to LINQ-to-Objects:

```csharp
var result = dbContext.Employees
    .Where(x => x.IsActive)
    .AsEnumerable()
    .Where(x => ComplexCSharpLogic(x))
    .ToList();
```

This can be valid when intentionally used on a reasonably small result set.

## Interview Trap

Do not move large database datasets into memory merely because a method cannot be translated.

---

# 63. What is `AsNoTracking()` and why is it important with LINQ?

For read-only Entity Framework queries:

```csharp
var employees = dbContext.Employees
    .AsNoTracking()
    .Where(x => x.IsActive)
    .ToList();
```

`AsNoTracking()` tells EF Core not to track returned entities for change detection.

This can reduce tracking overhead for read-only scenarios.

---

# 64. How can LINQ query performance be improved?

Common strategies:

- Filter before materialization
- Project only required columns
- Use `AsNoTracking()` for read-only EF queries
- Avoid unnecessary `ToList()`
- Avoid multiple enumeration
- Use `Any()` for existence checks
- Apply pagination in the database
- Avoid client-side filtering over large datasets
- Avoid N+1 queries
- Review generated SQL
- Ensure database indexes support frequently used filters and joins

---

# 65. What happens when you call `Where()` multiple times?

Example:

```csharp
var result = dbContext.Employees
    .Where(x => x.IsActive)
    .Where(x => x.Salary > 50000);
```

For a capable query provider, these conditions can typically be combined into one SQL query.

Conceptually:

```sql
WHERE IsActive = 1
AND Salary > 50000
```

---

# 66. Does the order of LINQ operators matter?

Yes.

Example:

```csharp
employees
    .Where(x => x.IsActive)
    .Take(10);
```

is logically different from:

```csharp
employees
    .Take(10)
    .Where(x => x.IsActive);
```

The second version considers only the first 10 elements before filtering when executed as LINQ-to-Objects.

## Interview Tip

Always think about the logical query pipeline.

---

# 67. Difference between `OrderBy()` and `ThenBy()`

Correct:

```csharp
employees
    .OrderBy(x => x.Department)
    .ThenBy(x => x.Name);
```

Potential mistake:

```csharp
employees
    .OrderBy(x => x.Department)
    .OrderBy(x => x.Name);
```

The second `OrderBy()` creates a new primary ordering.

---

# 68. What is `DistinctBy()`?

```csharp
var uniqueEmployees =
    employees.DistinctBy(x => x.Email);
```

This returns one element for each distinct key.

Similar operators include:

```text
UnionBy
IntersectBy
ExceptBy
MinBy
MaxBy
```

Availability depends on the target .NET version.

---

# 69. What are `MinBy()` and `MaxBy()`?

Instead of getting only the salary:

```csharp
var maxSalary = employees.Max(x => x.Salary);
```

you can retrieve the employee having the maximum salary:

```csharp
var employee =
    employees.MaxBy(x => x.Salary);
```

---

# 70. Find highest-paid employee in each department

```csharp
var result = employees
    .GroupBy(x => x.Department)
    .Select(group => group
        .OrderByDescending(x => x.Salary)
        .First());
```

Alternative when available:

```csharp
var result = employees
    .GroupBy(x => x.Department)
    .Select(group => group.MaxBy(x => x.Salary));
```

For EF Core queries, always verify whether the exact expression is translated efficiently by your provider/version.

---

# 71. Find duplicate employees by email

```csharp
var duplicates = employees
    .GroupBy(x => x.Email)
    .Where(group => group.Count() > 1)
    .Select(group => new
    {
        Email = group.Key,
        Count = group.Count()
    });
```

---

# 72. Find the most frequent number

```csharp
var numbers = new[]
{
    1, 2, 2, 3, 3, 3, 4
};

var result = numbers
    .GroupBy(x => x)
    .OrderByDescending(group => group.Count())
    .Select(group => group.Key)
    .First();
```

### Output

```text
3
```

---

# 73. Find the first non-repeated character

```csharp
string input = "swiss";

char result = input
    .GroupBy(x => x)
    .Where(group => group.Count() == 1)
    .Select(group => group.Key)
    .FirstOrDefault();

Console.WriteLine(result);
```

### Output

```text
w
```

---

# 74. Count occurrence of every character

```csharp
string input = "banana";

var result = input
    .GroupBy(x => x)
    .Select(group => new
    {
        Character = group.Key,
        Count = group.Count()
    });
```

---

# 75. Reverse words using LINQ

```csharp
string input = "LINQ Interview Questions";

string result = string.Join(
    " ",
    input.Split(' ').Reverse()
);

Console.WriteLine(result);
```

### Output

```text
Questions Interview LINQ
```

---

# 76. Find even and odd numbers

```csharp
var numbers = Enumerable.Range(1, 10);

var evenNumbers =
    numbers.Where(x => x % 2 == 0);

var oddNumbers =
    numbers.Where(x => x % 2 != 0);
```

---

# 77. Find sum of even numbers

```csharp
var result = numbers
    .Where(x => x % 2 == 0)
    .Sum();
```

---

# 78. Convert a list of objects into a dictionary

```csharp
var employeeDictionary =
    employees.ToDictionary(
        x => x.Id,
        x => x.Name);
```

---

# 79. Flatten nested employee skills

```csharp
public class Employee
{
    public string Name { get; set; } = "";
    public List<string> Skills { get; set; } = new();
}

var skills = employees
    .SelectMany(x => x.Skills)
    .Distinct()
    .ToList();
```

---

# 80. Find employees having more than three skills

```csharp
var result = employees
    .Where(x => x.Skills.Count > 3);
```

---

# Scenario-Based Interview Questions

# 81. Scenario: API returns 1 million employee records and then filters them

Bad code:

```csharp
var employees = dbContext.Employees
    .ToList();

var result = employees
    .Where(x => x.DepartmentId == departmentId);
```

## Problem

The application loads far more data than necessary.

## Better

```csharp
var result = await dbContext.Employees
    .Where(x => x.DepartmentId == departmentId)
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name
    })
    .ToListAsync();
```

## Interview Answer

> Push filtering and projection to the database and materialize only at the end.

---

# 82. Scenario: You only need to check whether a user exists

Avoid:

```csharp
var exists = dbContext.Users
    .Count(x => x.Email == email) > 0;
```

Prefer:

```csharp
var exists = dbContext.Users
    .Any(x => x.Email == email);
```

---

# 83. Scenario: Same query is called twice unexpectedly

```csharp
var query = dbContext.Employees
    .Where(x => x.IsActive);

var count = query.Count();

var employees = query.ToList();
```

For a database query, this usually means two database executions.

## Possible Approach

If both the rows and count are needed, choose the best approach based on paging and dataset size. Do not automatically materialize a huge table merely to avoid a second query.

## Interview Tip

This is a trade-off question, not a one-rule answer.

---

# 84. Scenario: Need unique employees by email

```csharp
var result = employees
    .DistinctBy(x => x.Email);
```

Alternative:

```csharp
var result = employees
    .GroupBy(x => x.Email)
    .Select(group => group.First());
```

---

# 85. Scenario: Need employee and department even when department is missing

Use a left join.

```csharp
var result =
    from employee in employees
    join department in departments
        on employee.DepartmentId equals department.Id
        into groups
    from department in groups.DefaultIfEmpty()
    select new
    {
        employee.Name,
        Department =
            department?.Name ?? "Not Assigned"
    };
```

---

# 86. Scenario: Need API paging

```csharp
var result = await dbContext.Employees
    .AsNoTracking()
    .OrderBy(x => x.Id)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name
    })
    .ToListAsync();
```

## Interview Tip

Mention:

- Database-side pagination
- Stable ordering
- Projection
- `AsNoTracking()` for read-only data

---

# 87. Scenario: Need optional filters

```csharp
IQueryable<Employee> query =
    dbContext.Employees.AsNoTracking();

if (!string.IsNullOrWhiteSpace(name))
{
    query = query.Where(x =>
        x.Name.Contains(name));
}

if (departmentId.HasValue)
{
    query = query.Where(x =>
        x.DepartmentId == departmentId);
}

if (minSalary.HasValue)
{
    query = query.Where(x =>
        x.Salary >= minSalary.Value);
}

var result = await query
    .OrderBy(x => x.Name)
    .ToListAsync();
```

This demonstrates LINQ query composition.

---

# 88. Scenario: Need parent records with child count

```csharp
var result = dbContext.Departments
    .Select(x => new
    {
        x.Id,
        x.Name,
        EmployeeCount = x.Employees.Count()
    });
```

A good provider can translate this into an appropriate database query.

---

# 89. Scenario: Need only the latest order per customer

For in-memory LINQ:

```csharp
var result = orders
    .GroupBy(x => x.CustomerId)
    .Select(group => group
        .OrderByDescending(x => x.OrderDate)
        .First());
```

For EF Core, verify the generated SQL for the target provider/version because group-by translation shapes can vary.

---

# 90. Scenario: Find customers with no orders

For in-memory collections:

```csharp
var result = customers
    .Where(customer =>
        !orders.Any(order =>
            order.CustomerId == customer.Id));
```

With EF Core navigation properties:

```csharp
var result = dbContext.Customers
    .Where(x => !x.Orders.Any());
```

---

# LINQ Interview Traps

# 91. Trap: `First()` on an empty sequence

```csharp
var employee = employees
    .First(x => x.Id == 100);
```

If no match exists:

```text
InvalidOperationException
```

Consider:

```csharp
FirstOrDefault()
```

when zero results are expected.

---

# 92. Trap: `SingleOrDefault()` with duplicate records

```csharp
var employee =
    employees.SingleOrDefault(
        x => x.Email == email);
```

If two matching records exist, it throws an exception.

This is intentional because `SingleOrDefault()` asserts uniqueness.

---

# 93. Trap: `ToDictionary()` with duplicate keys

```csharp
var result =
    employees.ToDictionary(x => x.DepartmentId);
```

If multiple employees belong to the same department, duplicate keys can cause an exception.

Use:

```csharp
ToLookup()
```

or group the records.

---

# 94. Trap: Calling `ToList()` before `Where()`

Bad:

```csharp
dbContext.Employees
    .ToList()
    .Where(x => x.IsActive);
```

Better:

```csharp
dbContext.Employees
    .Where(x => x.IsActive)
    .ToList();
```

---

# 95. Trap: Using `Count()` just to check existence

Avoid:

```csharp
employees.Count() > 0
```

Prefer:

```csharp
employees.Any()
```

---

# 96. Trap: Multiple `OrderBy()`

Wrong intent:

```csharp
employees
    .OrderBy(x => x.Department)
    .OrderBy(x => x.Name);
```

Correct:

```csharp
employees
    .OrderBy(x => x.Department)
    .ThenBy(x => x.Name);
```

---

# 97. Trap: Assuming deferred query results are fixed

```csharp
var numbers = new List<int>
{
    1, 2, 3
};

var query = numbers.Where(x => x > 1);

numbers.Add(4);

var result = query.ToList();
```

Result:

```text
2
3
4
```

The query used the collection state at enumeration time.

---

# 98. Trap: Assuming `Select()` performs filtering

Wrong:

```csharp
employees.Select(x => x.Salary > 50000);
```

Correct:

```csharp
employees.Where(x => x.Salary > 50000);
```

---

# 99. Trap: Using custom C# methods inside database LINQ

```csharp
dbContext.Employees
    .Where(x => ValidateEmployee(x))
    .ToList();
```

The provider may be unable to translate this method.

Ask:

- Can the logic be expressed using translatable LINQ?
- Can filtering occur in SQL first?
- Is client-side processing safe for the remaining result size?

---

# 100. Trap: Ignoring generated SQL

A LINQ expression may look simple but produce inefficient SQL.

For production EF Core applications, inspect generated SQL and execution plans for expensive queries.

---

# Rapid-Fire LINQ Interview Questions

## What does `Where()` return?

Normally an:

```csharp
IEnumerable<T>
```

or provider-backed query sequence such as:

```csharp
IQueryable<T>
```

depending on the source and overload.

## What does `Select()` do?

Projects each item into another shape.

## What does `SelectMany()` do?

Flattens nested sequences.

## What does `Any()` do?

Checks whether at least one matching item exists.

## What does `All()` do?

Checks whether all items match a condition.

## What does `Distinct()` do?

Removes duplicate values based on equality.

## What does `GroupBy()` do?

Groups elements by key.

## What does `OrderByDescending()` do?

Sorts in descending order.

## What does `Take()` do?

Returns the first N elements of the current sequence.

## What does `Skip()` do?

Skips the first N elements.

## Which LINQ method is commonly used for left joins?

`DefaultIfEmpty()` is part of the common left-join pattern.

## Which method materializes query results into a list?

```csharp
ToList()
```

## Which method is good for existence checking?

```csharp
Any()
```

---

# LINQ Coding Round Exercises

## Exercise 1: Find numbers greater than 10

```csharp
var numbers = new[]
{
    5, 10, 15, 20, 25
};

var result =
    numbers.Where(x => x > 10);
```

---

## Exercise 2: Square every number

```csharp
var result =
    numbers.Select(x => x * x);
```

---

## Exercise 3: Find distinct values

```csharp
var result =
    numbers.Distinct();
```

---

## Exercise 4: Find second highest distinct number

```csharp
var result = numbers
    .Distinct()
    .OrderByDescending(x => x)
    .Skip(1)
    .FirstOrDefault();
```

---

## Exercise 5: Find duplicate values

```csharp
var result = numbers
    .GroupBy(x => x)
    .Where(group => group.Count() > 1)
    .Select(group => group.Key);
```

---

## Exercise 6: Sort employees by salary descending

```csharp
var result = employees
    .OrderByDescending(x => x.Salary);
```

---

## Exercise 7: Count employees per department

```csharp
var result = employees
    .GroupBy(x => x.Department)
    .Select(group => new
    {
        Department = group.Key,
        Count = group.Count()
    });
```

---

## Exercise 8: Find departments with more than 5 employees

```csharp
var result = employees
    .GroupBy(x => x.Department)
    .Where(group => group.Count() > 5)
    .Select(group => group.Key);
```

---

## Exercise 9: Find highest salary per department

```csharp
var result = employees
    .GroupBy(x => x.Department)
    .Select(group => new
    {
        Department = group.Key,
        HighestSalary =
            group.Max(x => x.Salary)
    });
```

---

## Exercise 10: Flatten all employee skills

```csharp
var result = employees
    .SelectMany(x => x.Skills)
    .Distinct();
```

---

# Experienced Candidate: Strong Interview Answer Template

When an interviewer asks:

> How do you use LINQ in your project?

A strong answer can be:

> I use LINQ extensively for filtering, projection, sorting, grouping, joining, aggregation, and pagination. With Entity Framework Core, I try to keep queries as `IQueryable` until all database-translatable filters, projections, and pagination are applied. I avoid calling `ToList()` too early, use `AsNoTracking()` for read-only queries, use `Any()` for existence checks, and project directly into DTOs when possible. For performance-sensitive queries, I also inspect the generated SQL and database execution plan.

---

# Interview Tips

1. Do not only memorize LINQ method definitions. Practice writing code using `Where`, `Select`, `GroupBy`, `Join`, `SelectMany`, `Any`, `OrderBy`, `Skip`, and `Take`.

2. For experienced interviews, always connect LINQ with Entity Framework Core and SQL performance.

3. Be ready to explain deferred execution with a small example.

4. Understand `IEnumerable` vs `IQueryable` clearly.

5. Remember this important sequence for database queries:

```text
Filter
→ Sort
→ Project
→ Paginate
→ Materialize
```

The exact order may vary by requirement, but materialization should generally happen only after all useful database-side operations are applied.

6. Do not blindly say one LINQ method is always faster. Performance depends on the source, provider, translated SQL, indexes, result size, and data shape.

7. When asked a scenario question, explain both correctness and performance.

---

# Most Important LINQ Questions to Prepare

Before attending a .NET interview, make sure you can confidently explain:

```text
1. What is LINQ?
2. Query syntax vs method syntax
3. Where vs Select
4. Select vs SelectMany
5. IEnumerable vs IQueryable
6. Deferred execution
7. Immediate execution
8. First vs FirstOrDefault
9. Single vs SingleOrDefault
10. FirstOrDefault vs SingleOrDefault
11. Any vs Count
12. GroupBy
13. Join
14. Left Join
15. OrderBy vs ThenBy
16. Skip and Take
17. Distinct / DistinctBy
18. Expression trees
19. LINQ with EF Core
20. ToList called too early
21. AsEnumerable vs ToList
22. Multiple enumeration
23. Projection into DTOs
24. N+1 query problem
25. LINQ query optimization
```

---

# Final Interview Tip

For a fresher, interviewers usually expect correct syntax and a clear understanding of LINQ operators.

For an experienced .NET developer, interviewers expect more:

```text
Correct LINQ
+
SQL awareness
+
EF Core translation awareness
+
Performance
+
Memory usage
+
Deferred execution
+
Real project examples
```

A senior-level answer should explain not only **how to write the LINQ query**, but also:

> Where will this query execute, when will it execute, what SQL could it generate, how much data will it retrieve, and can it be made more efficient?
