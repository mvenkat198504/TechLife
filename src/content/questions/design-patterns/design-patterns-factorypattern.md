---
id: factory-pattern-001
slug:  factory-pattern-basic
categoryId:design-patterns
subcategory: factory-Pattern
difficulty: Basic
title: factory-Pattern Questions and Answers: Beginner to Expert
description: Why you selected a pattern, alternatives considered, trade-offs, testability, coupling, and how it behaved in production..
tags: [factory-pattern, Generic factory-pattern, UOW, EF]
updatedAt: 2026-09-09
status: published
thumbnail: ""
videos: []
resources: []
---

# Factory-Pattern Questions and Answers

## 56 :- What is Factory pattern and how does it benefit?

Factory pattern belongs to creational pattern category. It centralizes objection creation and the biggest
benefit of centralizing object creation is “application becomes LOOSELY COUPLED”.

**LOOSELY COUPLED**:  When you make a change at one place you do not have to make changes at many places.

**Key Benefits of the Factory Pattern**

- **Decoupling and Loose Coupling:** Client code depends on a common interface or abstract class rather than concrete implementations, meaning changes to a product's internal construction do not break the client
- **Single Responsibility Principle:** Object creation logic is moved out of standard business workflows and centralized into a single component, making code cleaner and easier to read
- **Open/Closed Principle:** You can introduce new product types (such as adding a new payment processor or document reader) without altering existing, tested client code.
- **Simplifying Complex Creation:** If creating an object requires heavy configuration, calculation, or hidden dependencies, the factory hides those complex steps behind a simple, expressive method name


Example: Consider a notification system that can send Email, SMS, or Push notifications. Instead of directly creating EmailNotification, SMSNotification, or PushNotification objects, the application uses a factory method to create the required notification.

![Architecture design patterns](/images/design-patterns/factory-pattern.png)

In the Diagram:

- If the user selects Email, an EmailNotification object is created.
- If the user selects SMS, an SMSNotification object is created.
- If the user selects Push, a PushNotification object is created.

## Factory Pattern — Simple Interview Explanation

The Factory Pattern is a creational design pattern used to create objects without exposing the object-creation logic to the client.

In simple terms:

Instead of creating objects directly using **new**, we ask a Factory to decide which object should be created.

Simple C# Example

Suppose your application supports different payment methods: Credit Card, UPI, and PayPal.

```csharp
public interface IPayment
{
    void Pay();
}

public class CreditCardPayment : IPayment
{
    public void Pay()
    {
        Console.WriteLine("Payment using Credit Card");
    }
}

public class UpiPayment : IPayment
{
    public void Pay()
    {
        Console.WriteLine("Payment using UPI");
    }
}
```

Without Factory, client code needs to know the concrete classes:

```csharp
IPayment payment = new CreditCardPayment();
payment.Pay();
```
With a Factory:

```csharp
public class PaymentFactory
{
    public static IPayment CreatePayment(string paymentType)
    {
        switch (paymentType)
        {
            case "CreditCard":
                return new CreditCardPayment();

            case "UPI":
                return new UpiPayment();

            default:
                throw new ArgumentException("Invalid payment type");
        }
    }
}
```
Now the client simply asks the factory:
```csharp
IPayment payment = PaymentFactory.CreatePayment("UPI");
payment.Pay();
```

```
Client
   ↓
PaymentFactory
   ↓
IPayment
   ↓
CreditCardPayment / UpiPayment
```
This provides several benefits: the client doesn't need to know the concrete class, object-creation logic is centralized, changes to creation logic have less impact on calling code, and new implementations can be introduced more cleanly.

**Interview Answer**

Factory Pattern is a creational design pattern that encapsulates object creation. Instead of the client directly creating concrete objects using new, it requests an object from a factory. The factory decides which implementation to instantiate. Its main benefits are loose coupling, centralized object creation, maintainability, extensibility, and easier testing.

## 57 :- How does centralizing object creation helps in loose coupling ?

They solve different problems, even though both can create objects.

**Dependency Injection (DI)** is mainly about supplying an object's dependencies. **Factory Pattern** is mainly about deciding which object to create at runtime and encapsulating that creation logic.

|![Architecture design patterns](/images/design-patterns/factory-pattern1.png)|![Architecture design patterns](/images/design-patterns/factory-pattern3.png)|

**Interview answer:**

**DI and Factory solve different problems. DI injects dependencies and manages their lifetime, while Factory encapsulates object creation and can decide which implementation to create at runtime. If I always need one implementation, DI alone is usually sufficient. If the implementation must be selected dynamically based on runtime data, a Factory is useful. We can also inject the Factory using DI.**