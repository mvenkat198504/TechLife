---
id: csharp-variables-001
slug: csharpvariables
title: What Difference Between const, readonly, static and dynamic in C# variables
categoryId: csharp
subcategory: OOPS
difficulty: Basic
tags:
  - middleware
  - request-pipeline
  - aspnet-core
summary: In C#, const, readonly, static, and dynamic are not four versions of the same thing. They solve different problems.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# What Difference Between const, readonly, static and dynamic in C# variables

In C#, const, readonly, static, and dynamic are not four versions of the same thing. They solve different problems.

## 1. const — compile-time constant
A const value must be known at compile time and cannot be changed.
```
public class AppSettings
{
    public const int MaxUsers = 100;
    public const string AppName = "Interview Portal";
}
```
Usage:
```
Console.WriteLine(AppSettings.MaxUsers);
```
You cannot do:
```
AppSettings.MaxUsers = 200; // Compile-time error
```
A const is implicitly static, so you access it using the class name.

A common limitation is that this won't work:
```
public const DateTime CreatedDate = DateTime.Now; // Error
```
## 2. readonly — set at runtime, then cannot change
A readonly field can be assigned during declaration or inside the constructor.
```
public class Employee
{
    public readonly int EmployeeId;

    public Employee(int employeeId)
    {
        EmployeeId = employeeId;
    }
}
```
Usage:
```
var employee = new Employee(101);
Console.WriteLine(employee.EmployeeId);
```
After construction:
```
employee.EmployeeId = 200; // Error
```
Unlike const, the value can come from runtime data.
```
public readonly DateTime CreatedDate;

public Employee()
{
    CreatedDate = DateTime.Now; // Valid
}
```
Real project use: values that should be initialized once per object and not changed afterward.

## 3. static — shared by all objects
static means the member belongs to the class itself, rather than individual objects.
```
public class Employee
{
    public static int EmployeeCount = 0;

    public Employee()
    {
        EmployeeCount++;
    }
}
```
Create objects:
```
var emp1 = new Employee();
var emp2 = new Employee();
var emp3 = new Employee();

Console.WriteLine(Employee.EmployeeCount);
```
Output:
```
3
```
There is only one shared copy of EmployeeCount.
Compare:
```
public class Employee
{
    public int EmployeeId;          // One per object

    public static int EmployeeCount; // One per class
}


emp1 → EmployeeId = 101
emp2 → EmployeeId = 102
emp3 → EmployeeId = 103

   


```text
     Employee
           │
           └── EmployeeCount = 3
               shared by everyone
```   
A static variable can change unless you additionally restrict it.

## 4. static readonly
This combination is very common.
```
public static readonly DateTime ApplicationStartedAt
    = DateTime.Now;
    
```
It means:

static → one value shared by the application/class
readonly → cannot be reassigned after initialization
value can be calculated at runtime
```
public static readonly Guid ApplicationId = Guid.NewGuid();
```
You cannot use const here:
```
public const Guid ApplicationId = Guid.NewGuid(); // Error
```
because Guid.NewGuid() is runtime-generated.

## 5. dynamic — type resolved at runtime
dynamic is completely different from the previous three.

Normally C# performs type checking at compile time:
```
string name = "Venkat";

name = 100; // Error
```
With dynamic:
```
dynamic value = "Hello";

Console.WriteLine(value);

value = 100;

Console.WriteLine(value);

value = true;

Console.WriteLine(value);
```
The same variable can hold different runtime types.

More importantly:
```
dynamic obj = GetSomeObject();

obj.DoSomething();
```
A strong interview answer is:

const is a compile-time constant, must be initialized at declaration, cannot change, and is implicitly static.
readonly can be initialized at declaration or in a constructor, allowing runtime values, but cannot normally be reassigned afterward.
static means the member belongs to the type rather than an individual object, so one copy is shared across instances.
dynamic defers type checking and member resolution until runtime, providing flexibility but losing compile-time type safety.

Common follow-up: const vs static readonly — use const for true compile-time constants such as MaxRetries = 3; use static readonly when the value is determined at runtime, such as Guid.NewGuid() or DateTime.UtcNow.
![variable](/images/aspnet-core/variables/variable 1.png)
