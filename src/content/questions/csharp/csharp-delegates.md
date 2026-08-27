---
id: csharp-delegates-001
slug: csharpdelegates
title: Delegates in C#
categoryId: csharp
subcategory: OOPS
difficulty: Basic
tags:
  - delegates
  - Delegates
  - aspnet-core
summary: A delegate in C# is a type-safe object that holds a reference to one or more methods with a specific return type and parameter.
updatedAt: 2026-08-26
status: published
thumbnail: ""
videos: []
resources: []
---

# Delegates in C#

## Key Characteristics
In C#, a delegate is a type-safe function pointer that allows methods to be referenced and invoked dynamically. It provides a way to treat methods as objects, enabling scenarios such as event handling, callbacks and functional-style programming.

**Type-Safe:** The signature of the target method must match the delegate's return type and parameters.

**Multicast:** A delegate can hold and invoke a list of multiple methods using the += and -= operators.

**Under the Hood:** Custom delegates inherit from System.MulticastDelegate

- A delegate defines the signature of methods it can point to.
- It can reference both static and instance methods.
- Delegates are type-safe, meaning the method signature must match the delegate declaration.
- They are the foundation of events and anonymous functions in C#.

## When to Use Delegates

- For implementing callbacks.
- For handling events.
- For writing flexible, reusable code where behavior can be passed as parameters.
- For functional-style programming with LINQ and lambdas.

## Declaration of Delegates

Delegate type can be declared using the delegate keyword. Once a delegate is declared, delegate instance will refer and call those methods whose return type and parameter-list matches with the delegate declaration.

```csharp
using System;

public class DelegateExample
{
    // Delegate declaration
    public delegate void MyDelegate(string message);

    // Method matching the delegate signature
    public static void DisplayMessage(string msg)
    {
        Console.WriteLine("Message: " + msg);
    }

    public static void Main()
    {
        // Instantiating delegate
        MyDelegate del = DisplayMessage;

        // Invoking delegate
        del("Hello from delegate!");
    }
}
```
Output
```
Message: Hello from delegate!
```
## Explanation:
- MyDelegate is defined to point to methods that take a string parameter and return void.
- The DisplayMessage method matches the delegate signature.
- The delegate instance del references the method and is invoked like a method call.

## Multicasting of a Delegate

Delegates can reference multiple methods at once using the + or += operator. Such delegates are called multicast delegates.

**Properties:**

- Delegates are combined and when you call a delegate then a complete list of methods is called.
- All methods are invoked in the order they were added to the delegate (invocation order).
- '+' or '+=' Operator is used to add the methods to delegates.
- '–' or '-=' Operator is used to remove the methods from the delegates list.

```csharp
using System;

public class MulticastDelegateDemo
{
    public delegate void Notify();

    public static void MethodA() => Console.WriteLine("Method A executed");
    public static void MethodB() => Console.WriteLine("Method B executed");

    public static void Main()
    {
        Notify notify = MethodA;
        notify += MethodB;

        notify(); // Invokes both MethodA and MethodB
    }
}
```
```
Method A executed
Method B executed
```
**Note:**
If the delegate has a return value, only the result of the last method in the invocation list is returned.

## Delegates with Return Types
Delegates can also be used with methods that return values.

```csharp
using System;

public class ReturnDelegateDemo
{
    public delegate int Operation(int x, int y);

    public static int Add(int a, int b) => a + b;
    public static int Multiply(int a, int b) => a * b;

    public static void Main()
    {
        Operation op = Add;
        Console.WriteLine("Addition: " + op(5, 3));

        op = Multiply;
        Console.WriteLine("Multiplication: " + op(5, 3));
    }
}
```
```
Addition: 8
Multiplication: 15
```
**Explanation:**
- Delegates can point to methods that return a value and the return type must match the delegate signature.
- If multiple methods are attached, only the last method’s return value is returned.

## Anonymous delegates in c#

In C#, anonymous delegates let you define a method **inline without giving the method a name.**
 They were introduced in C# 2.0 and are the predecessor to **lambda expressions.**

 1.Basic example

Traditional named method:
```csharp
public delegate void PrintMessage(string message);

static void Print(string message)
{
    Console.WriteLine(message);
}

PrintMessage printer = Print;
printer("Hello");
```
Using an anonymous delegate:
```csharp
public delegate void PrintMessage(string message);

PrintMessage printer = delegate(string message)
{
    Console.WriteLine(message);
};

printer("Hello");
```
Here:
```csharp
delegate(string message)
{
    Console.WriteLine(message);
}
```
is the anonymous method.

2.Anonymous delegate vs lambda

Modern C# usually uses a lambda instead.

Anonymous delegate:
```csharp
Func<int, int, int> add = delegate(int a, int b)
{
    return a + b;
};

Console.WriteLine(add(10, 20));
```
Lambda equivalent:
```csharp
Func<int, int, int> add = (a, b) =>
{
    return a + b;
};
```