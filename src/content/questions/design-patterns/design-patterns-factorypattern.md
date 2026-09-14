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

## 57 :- Factory Pattern vs Dependency Injection — if DI can create objects, why do we need Factory?” ?

They solve different problems, even though both can create objects.

**Dependency Injection (DI)** is mainly about supplying an object's dependencies. **Factory Pattern** is mainly about deciding which object to create at runtime and encapsulating that creation logic.

|![Architecture design patterns](/images/design-patterns/factory-pattern1.png)|![Architecture design patterns](/images/design-patterns/factory-pattern3.png)|

For example, with normal ASP.NET Core DI:

```csharp
builder.Services.AddScoped<IPaymentService, CreditCardPaymentService>();
```
Then:
```csharp
public class OrderService
{
    private readonly IPaymentService _paymentService;

    public OrderService(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }
}
```
DI automatically gives `OrderService` a `CreditCardPaymentService`. This is ideal when the implementation is already known through configuration/registration.

But imagine the implementation depends on the user's runtime choice:

```
paymentType = "CreditCard" → CreditCardPayment
paymentType = "UPI"        → UpiPayment
paymentType = "PayPal"     → PayPalPayment
```
This is where a Factory is useful:

```csharp
public interface IPaymentFactory
{
    IPayment Create(string paymentType);
}

public class PaymentFactory : IPaymentFactory
{
    public IPayment Create(string paymentType)
    {
        return paymentType switch
        {
            "CreditCard" => new CreditCardPayment(),
            "UPI"        => new UpiPayment(),
            "PayPal"     => new PayPalPayment(),
            _ => throw new ArgumentException("Invalid payment type")
        };
    }
}
```
The service can receive the factory itself through DI:

```csharp
public class OrderService
{
    private readonly IPaymentFactory _factory;

    public OrderService(IPaymentFactory factory)
    {
        _factory = factory;
    }

    public void ProcessOrder(string paymentType)
    {
        IPayment payment = _factory.Create(paymentType);

        payment.Pay();
    }
}
```
```csharp
builder.Services.AddScoped<IPaymentFactory, PaymentFactory>();
```
So Factory and DI are often used together, not as alternatives..

| DI                                        | Factory                                          |
| ----------------------------------------- | ------------------------------------------------ |
| Provides dependencies                     | Creates/selects objects                          |
| Usually configured at startup             | Can decide at runtime                            |
| DI container controls creation            | Factory contains selection/creation logic        |
| Good when implementation is predetermined | Good when implementation depends on runtime data |


**Interview answer:**

**DI and Factory solve different problems. DI injects dependencies and manages their lifetime, while Factory encapsulates object creation and can decide which implementation to create at runtime. If I always need one implementation, DI alone is usually sufficient. If the implementation must be selected dynamically based on runtime data, a Factory is useful. We can also inject the Factory using DI.**

## 58 :- How does centralizing object creation helps in loose coupling ?

Centralizing object creation helps achieve loose coupling by removing the new keyword and concrete class dependencies from the client code. Instead of a class instantiating its own dependencies directly, it delegates that responsibility to a centralized authority—such as a **Factory pattern**, a **Service Locator**, or a **Dependency Injection (DI) container.** This shifts the client's dependency from a volatile concrete implementation to a stable abstraction (like an interface)

Consider this tightly coupled code:

```csharp
public class OrderService
{
    public void ProcessOrder(string paymentType)
    {
        CreditCardPayment payment = new CreditCardPayment();
        payment.Pay();
    }
}
```
`OrderService` directly knows about `CreditCardPayment`.
```
OrderService
     ↓
CreditCardPayment
```
If you replace it with UpiPayment, you must modify OrderService. So the business class is coupled to the concrete implementation.

With a factory, creation moves to one place:
```csharp
public interface IPayment
{
    void Pay();
}

public class PaymentFactory
{
    public IPayment Create(string type)
    {
        return type switch
        {
            "CreditCard" => new CreditCardPayment(),
            "UPI"        => new UpiPayment(),
            _ => throw new ArgumentException("Invalid payment type")
        };
    }
}
// Now the client works primarily with the abstraction:

public class OrderService
{
    private readonly PaymentFactory _factory;

    public OrderService(PaymentFactory factory)
    {
        _factory = factory;
    }

    public void ProcessOrder(string paymentType)
    {
        IPayment payment = _factory.Create(paymentType);
        payment.Pay();
    }
}

```
The relationship becomes:
```
OrderService
     ↓
PaymentFactory
     ↓
   IPayment
   ↙     ↘
Credit   UPI
```
The important point is that centralization alone doesn't magically create loose coupling. The benefit comes from moving knowledge of concrete implementations out of business/client code and having the client depend on an abstraction such as IPayment.

**Interview answer**

Centralizing object creation improves loose coupling because client classes don't need to know the concrete implementation or its construction details. They work with an abstraction, while the Factory handles creation and selection of concrete objects. Therefore, changes in object-creation logic have less impact on the rest of the application.

## 58 :- What is IOC and DI ?

- **IoC (Inversion of Control)** is a **principle.**
- **DI (Dependency Injection)** is a **technique/pattern used to implement IoC.**

**Inversion of Control (IoC)** is a high-level design principle where an external framework manages object creation and lifecycles, while **Dependency Injection (DI)** is the specific design pattern used to implement IoC by passing required dependencies into an object

- **IoC** = Who controls object creation?
- **DI** = How are dependencies given to the object?

**Strong interview answer**

IoC is a principle where control of object creation and dependency management is transferred from the application class to an external framework or container. Dependency Injection is one technique for implementing IoC, where dependencies are provided to a class instead of the class creating them itself. In ASP.NET Core, the built-in DI container creates and injects registered dependencies. This provides loose coupling, easier testing, and better maintainability.

## What are Constructor Injection, Method Injection, and Property Injection, and which one is recommended in ASP.NET Core?

There are three common ways to inject dependencies: Constructor Injection, Method Injection, and Property Injection.

In ASP.NET Core, Constructor Injection is the recommended and most commonly used approach.

1. Constructor Injection — Recommended

The dependency is provided through the class constructor.

```csharp
public interface IEmailService
{
    void SendEmail();
}

public class OrderService
{
    private readonly IEmailService _emailService;

    public OrderService(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void PlaceOrder()
    {
        _emailService.SendEmail();
    }
}
```
Register it:
```csharp
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<OrderService>();
```
ASP.NET Core's DI container creates EmailService and passes it to OrderService.

```
DI Container
    ↓
creates EmailService
    ↓
new OrderService(emailService)
```
Why is Constructor Injection preferred? Because the dependency is explicit, the class cannot normally be created without its required dependency, readonly fields can be used, and the class is easy to unit test.

For example:
```csharp
var mockEmail = new Mock<IEmailService>();

var service = new OrderService(mockEmail.Object);
```

2. Method Injection

The dependency is passed directly to the method that needs it.

```csharp
public class OrderService
{
    public void PlaceOrder(IEmailService emailService)
    {
        // Order processing...

        emailService.SendEmail();
    }
}
```
This is useful when a dependency is needed only for a particular operation, rather than throughout the entire class.

ASP.NET Core also supports method-level injection in some framework scenarios. For example, [FromServices] can inject a registered service into a controller action:
```csharp
[HttpPost]
public IActionResult PlaceOrder(
    [FromServices] IEmailService emailService)
{
    emailService.SendEmail();

    return Ok();
}
```
However, for normal application services, constructor injection is usually cleaner.

3. Property Injection

The dependency is assigned through a public property.
```csharp
public class OrderService
{
    public IEmailService? EmailService { get; set; }

    public void PlaceOrder()
    {
        EmailService?.SendEmail();
    }
}
```
Then something outside the class must set it:

```csharp
var service = new OrderService();

service.EmailService = new EmailService();

// The major problem is that someone could forget to set the property:

var service = new OrderService();

service.PlaceOrder(); // EmailService was never provided
```
This can leave the object in an incomplete state.

Also, ASP.NET Core's built-in DI container does not automatically provide general property injection in the same way it provides constructor injection.

Interview comparison

| Type                      | Dependency provided through | Typical use                                                       |
| ------------------------- | --------------------------- | ----------------------------------------------------------------- |
| **Constructor Injection** | Constructor                 | ✅ Best for required dependencies                                  |
| **Method Injection**      | Method parameter            | Good for operation-specific dependencies                          |
| **Property Injection**    | Public property             | Sometimes useful for optional dependencies, but generally avoided |

**Interview answer**

Constructor Injection, Method Injection, and Property Injection are different ways of providing dependencies to a class. Constructor Injection provides dependencies through the constructor and is the recommended approach in ASP.NET Core because dependencies are explicit, required dependencies are available when the object is created, and it improves testability and maintainability. Method Injection is useful when a dependency is required only by a specific operation. Property Injection provides dependencies through properties, but it can leave an object without its required dependencies and isn't automatically supported as general property injection by ASP.NET Core's built-in DI container.

A good interview rule to remember is:

Required dependency → Constructor Injection

Only one operation needs it → Method Injection

Optional dependency → Property Injection can be considered, but usually prefer a clearer design.

## 59 :- DI vs IOC ?

**IOC ( Inversion of Control)** is a principle while **DI ( Dependency Injection )** is an implementation of IOC.
So, IOC says that delegate / invert the object creation to external framework. While DI is an
implementation for IOC which says how the dependent objects will be injected ( from constructor ,
method etc ).

IoC and DI are closely related, but they are not the same thing.

Simple difference

- **IoC (Inversion of Control)** is the principle: a class should not control the creation and management of its dependencies.

- **DI (Dependency Injection)** is a technique used to achieve IoC: dependencies are supplied to the class from outside.

Think of it as:

- IoC = What we want → Move control outside the class.
- DI = How we achieve it → Inject dependencies from outside.

| IoC                                  | DI                                           |
| ------------------------------------ | -------------------------------------------- |
| Principle/concept                    | Technique/pattern                            |
| Broader concept                      | One way to implement IoC                     |
| Says control should be external      | Supplies dependencies externally             |
| Answers **“Who controls creation?”** | Answers **“How is dependency provided?”**    |
| Can be achieved in different ways    | Constructor injection is the common approach |

**Interview answer**
oC is a principle where control of object creation and dependency management is moved outside the class. DI is a technique used to implement IoC by providing dependencies to a class instead of the class creating them itself. In ASP.NET Core, the built-in DI container implements IoC by creating registered services and injecting them, usually through constructors.

Easy memory trick: IoC = Principle, DI = Implementation technique.

## 60: - What is a service locator ?

A Service Locator is a pattern where a class asks a central service provider/container for the dependency it needs, instead of receiving that dependency explicitly through constructor injection.

|![Architecture design patterns](/images/design-patterns/Service-locator1.png)|![Architecture design patterns](/images/design-patterns/Service-locator2.png)|

For example, in ASP.NET Core:

```csharp
public class OrderService
{
    private readonly IServiceProvider _serviceProvider;

    public OrderService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void PlaceOrder()
    {
        var emailService =
            _serviceProvider.GetRequiredService<IEmailService>();

        emailService.SendEmail();
    }
}
```
Here, `OrderService` is saying:

"Give me the `IEmailService` when I need it."

That's different from normal Dependency Injection, where the dependency is explicitly provided:

```csharp
public class OrderService
{
    private readonly IEmailService _emailService;

    public OrderService(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void PlaceOrder()
    {
        _emailService.SendEmail();
    }
}
```
The key difference is:

| Dependency Injection                 | Service Locator                               |
| ------------------------------------ | --------------------------------------------- |
| Dependency is **given to the class** | Class **asks for dependency**                 |
| Dependencies are explicit            | Dependencies can be hidden                    |
| Easier to understand/test            | Can be harder to understand/test              |
| Recommended approach                 | Generally avoided for normal business classes |

For example, when you see:
```csharp
public OrderService(IEmailService emailService)
```
you immediately know:

`OrderService` requires `IEmailService`.

But with:
```csharp
public OrderService(IServiceProvider serviceProvider)
```
you don't know what OrderService actually requires without reading the implementation. It could request 2, 5, or 20 different services.

That's one reason Service Locator is often considered an anti-pattern when overused.

**Interview answer**

Service Locator is a pattern where a class gets its required dependencies from a central service registry or container. Unlike Dependency Injection, where dependencies are explicitly provided to the class, Service Locator makes the class request dependencies itself. Although it can be useful in some dynamic scenarios, constructor injection is generally preferred because dependencies are explicit, the code is more loosely coupled to the DI container, and unit testing is easier.

## 61:- Service Locator vs DI ?

**Service Locator and Dependency Injection both provide dependencies to a class, but the direction is different.**

The easiest way to remember:

**DI:** Dependencies are given to the class.
**Service Locator:** The class goes and asks for dependencies.

**Dependency Injection**

With DI, the dependency is explicit in the constructor:
```csharp
public class OrderService
{
    private readonly IEmailService _emailService;

    public OrderService(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void PlaceOrder()
    {
        _emailService.SendEmail();
    }
}
```
ASP.NET Core provides it:

```csharp
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<OrderService>();
```
You can immediately see that `OrderService` requires `IEmailService.`

**Service Locator**

With `Service Locator`, we inject/access a service provider and ask it for dependencies:

```csharp
public class OrderService
{
    private readonly IServiceProvider _serviceProvider;

    public OrderService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void PlaceOrder()
    {
        var emailService =
            _serviceProvider.GetRequiredService<IEmailService>();

        emailService.SendEmail();
    }
}
```

Here the real dependency is hidden. Looking only at the constructor, you can't tell that `OrderService` requires `IEmailService`.

**Key differences**
| Dependency Injection                                                    | Service Locator                                     |
| ----------------------------------------------------------------------- | --------------------------------------------------- |
| Dependency is pushed into class                                         | Class pulls dependency                              |
| Dependencies are explicit                                               | Dependencies can be hidden                          |
| Class depends on required abstractions                                  | Class often depends on `IServiceProvider`/locator   |
| Easier unit testing                                                     | Usually more setup/mocking                          |
| Missing dependencies tend to fail during object construction/resolution | Missing service may fail only when code requests it |
| Recommended for normal ASP.NET Core services                            | Generally avoid for normal business code            |

For example, DI clearly communicates:
```
public OrderService(
    IEmailService emailService,
    IPaymentService paymentService)
```
You immediately know the class has two dependencies.

With Service Locator:
```
public OrderService(IServiceProvider serviceProvider)
```

So the actual dependencies aren't visible from the class API.

Is Service Locator always bad?

No. There are legitimate scenarios where dynamic resolution is useful, but it shouldn't normally replace constructor injection.

For example, framework/infrastructure code sometimes needs to resolve a service dynamically based on runtime information. Even then, a Factory is often a cleaner abstraction for application code.

**Interview answer**

In Dependency Injection, dependencies are provided to a class from outside, usually through constructor injection. In Service Locator, the class requests its dependencies from a central service provider. DI is generally preferred because dependencies are explicit, the class is less coupled to the DI container, and unit testing is easier. Service Locator can hide dependencies and introduce coupling to the service provider, so it should generally be avoided in normal business classes.

## 62 :- Which is good to use Service Locator or DI ?

Service locator makes system tightly coupled while DI makes it more loose coupled. Currently developers
mostly use DI.

DI is generally the better choice for normal ASP.NET Core application code.

Use Dependency Injection by default because dependencies are explicit, easier to test, and the class stays independent of the DI container.

**Interview answer**

Dependency Injection is preferred over Service Locator. DI makes dependencies explicit, improves loose coupling, testability, and maintainability. Service Locator hides dependencies and couples the class to the service container, so it is generally avoided unless dynamic service resolution is genuinely required.

A simple rule:

**Use DI by default. Use Service Locator only for exceptional dynamic-resolution scenarios.**

## 64 :- Is DI a Factory Pattern?

No, DI is not factory pattern. DI just says how the objects are injected. While Factory pattern centralizes
COMPLEX object creation.

**Dependency Injection (DI) is not the Factory Pattern**, although a DI container internally performs some factory-like object creation.

A good interview answer is:

No, DI is not a Factory Pattern. DI is a technique for providing dependencies from outside a class, while Factory is a creational design pattern that encapsulates and controls object creation. However, DI containers internally create objects, so they may use factory-like mechanisms. DI and Factory can also be used together—for example, injecting a factory through constructor DI when runtime object selection is required.

A simple memory trick is: **DI = “Give me what I need.” Factory = “Decide what to create.”**

## 66 :- Static DI and Dynamic DI ?

Static DI means application needs to restart for taking up the changes. Dynamic DI means during the
runtime which object will be injected will be decided.

“Static DI” and “Dynamic DI” are useful interview terms, although they are not formal DI types like Constructor, Method, or Property Injection. They usually describe **when/how an implementation is selected.**

**Static DI**

In static DI, the implementation is **decided during application configuration/startup**.

ASP.NET Core example:

```csharp
builder.Services.AddScoped<IPaymentService, CreditCardPaymentService>();
```
Then:
```csharp
public class OrderService
{
    private readonly IPaymentService _paymentService;

    public OrderService(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }
}
```
Whenever `OrderService` is created, the DI container knows:
```
IPaymentService
       ↓
CreditCardPaymentService
```

The selection doesn't depend on whether the current customer chose UPI, PayPal, etc.

This is what people often mean by static DI.

**Dynamic DI**

Suppose you have three implementations:
```csharp
public class CreditCardPayment : IPaymentService { }
public class UpiPayment : IPaymentService { }
public class PayPalPayment : IPaymentService { }
```
At runtime:
```
User selects Credit Card → CreditCardPayment
User selects UPI         → UpiPayment
User selects PayPal      → PayPalPayment
```

So conceptually:

```
Static DI
--------
Startup configuration
       ↓
IPaymentService
       ↓
CreditCardPaymentService


Dynamic selection
-----------------
Runtime value = "UPI"
       ↓
Factory / Resolver
       ↓
UpiPayment
```
**Interview answer**

Static DI generally means the dependency implementation is predetermined through DI registration, usually at application startup. Dynamic DI means the required implementation needs to be selected based on runtime information. For normal dependencies, I use constructor DI. When runtime selection is required, I can combine DI with a Factory, keyed services, or another resolver mechanism rather than directly using Service Locator throughout the application.

So remember:

**Static DI → implementation known at configuration time.**

**Dynamic selection → implementation chosen based on runtime conditions, often using DI + Factory.**

## 67 :- In which scenarios to use Static DI vs Dynamic DI ?
Static DI is mostly used for services while Dynamic DI is used for complex model creation during runtime.

- Use Static DI when the dependency is known in advance.
- Use Dynamic DI/selection when the implementation depends on runtime information.

| Scenario                                | Prefer                |
| --------------------------------------- | --------------------- |
| One implementation is known at startup  | **Static DI**         |
| Repository/service is always the same   | **Static DI**         |
| Implementation changes by user input    | **Dynamic selection** |
| Implementation changes per request      | **Dynamic selection** |
| Payment method selection                | **Dynamic selection** |
| File processor based on file type       | **Dynamic selection** |
| Multiple strategies selected at runtime | **Dynamic selection** |

One important nuance: in modern ASP.NET Core, you don't necessarily need a hand-written Factory for every dynamic case. Keyed services can also be useful when selecting among registered implementations. But conceptually the interview distinction remains the same.

**Interview answer:** Static DI is suitable when the implementation is known during application configuration and remains predictable. Dynamic DI/selection is appropriate when the implementation must be chosen based on runtime information such as user input, request data, tenant, payment type, or file type. For most application dependencies I prefer normal constructor DI; for runtime selection I use a Factory, keyed services, or another explicit strategy-selection mechanism.