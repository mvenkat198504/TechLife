---
id: solid-principles-basic-001
slug:  solid-principles-basic
categoryId:design-patterns
subcategory: Solid-principles
difficulty: Basic
title: solid-principles-basic Questions and Answers: Beginner to Expert
description: Why you selected a pattern, alternatives considered, trade-offs, testability, coupling, and how it behaved in production..
tags: [solid-principles, SRP, OCP LSP, ISP, DI,Single Responsibility,Open Close,Liskov Substitution,Interface Segregation,Dependency Inversion]
updatedAt: 2026-09-09
status: published
thumbnail: ""
videos: []
resources: []
---
# solid-principles-basic Questions and Answers

## 26:- What is SOLID? Or What is the full form of SOLID?

SOLID is an acronym which represents 5 design principles where: -

- S (SRP) : - Single Responsibility Principle.
- O (OCP) :- Open Close Principle.
- L (LSP) :- Liskov Substitution Principle.
- I (ISP) :- Interface Segregation Principle.
- D (DI) :- Dependency Inversion.

## 28:- What is the goal of SOLID ?

The main goal of SOLID is to minimize dependencies. Thus, making code better understandable, maintainable, and extendable.

## 29:- Explain SRP with an example ?

Class should have single purpose and nothing more than that. For example, you have a “Customer” class
and if the “Customer” class is also having Data access layer code then “Customer” class is overloaded.

Here we need to split the class in to two “Customer” class and “Data Access” class.

**Incorrect approach**

Here, the `Customer` class manages customer information and calculates discounts—two responsibilities.

```csharp
public class Customer
{
    public string Name { get; set; }
    public decimal TotalPurchase { get; set; }

    public decimal CalculateDiscount()
    {
        return TotalPurchase > 10000
            ? TotalPurchase * 0.10m
            : 0;
    }
}
```

If the customer structure changes, we modify this class. If the discount rule changes, we also modify the same class. This violates SRP.

**Correct approach**

Separate customer information and discount calculation.

```csharp
public class Customer
{
    public string Name { get; set; }
    public decimal TotalPurchase { get; set; }
}

public class DiscountService
{
    public decimal CalculateDiscount(Customer customer)
    {
        if (customer.TotalPurchase > 10000)
        {
            return customer.TotalPurchase * 0.10m;
        }

        return 0;
    }
}
```
Usage:
```csharp
var customer = new Customer
{
    Name = "Venkat",
    TotalPurchase = 15000
};

var discountService = new DiscountService();

decimal discount = discountService.CalculateDiscount(customer);

Console.WriteLine(discount); // 1500
```

Now:

- `Customer` stores customer information.
- `DiscountService` handles discount rules.

Interview answer:

According to SRP, one class should have only one responsibility. The Customer class should manage customer data, while the DiscountService should calculate discounts. Therefore, changes to discount rules do not affect the customer class.

## 30:- What is the benefit of SRP ?

As you have more focused classes now it make application more modular and thus improves the quality
of code. 

![Architecture design patterns](/images/design-patterns/SRP1.png)

## 31:- Explain OCP with an example ?
Open Closed Principle says that Class should be opened for extension and closed for modification.

- Open for extension means a child class can extend or override existing behaviour.
- Closed for modification means the existing base class does not need to be changed.

Base class
```
public class Customer
{
    public string Name { get; set; }

    public virtual decimal CalculateDiscount(decimal amount)
    {
        return 0;
    }
}
```
The virtual keyword allows child classes to change the discount behaviour.

**Derived classes**
```
public class RegularCustomer : Customer
{
    public override decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.05m;
    }
}

public class PremiumCustomer : Customer
{
    public override decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.10m;
    }
}
```
Usage
```
Customer customer = new PremiumCustomer();

decimal discount = customer.CalculateDiscount(10000);

Console.WriteLine(discount); // 1000
```
Adding a VIP customer

We can extend the application by creating another class:
```
public class VipCustomer : Customer
{
    public override decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.20m;
    }
}
```
The existing Customer, RegularCustomer, and PremiumCustomer classes are not modified.

How this follows OCP

- Open for extension: New customer types can extend Customer and override CalculateDiscount().
- Closed for modification: Existing tested classes do not need modification when a new discount type is introduced.

![Architecture design patterns](/images/design-patterns/OSP1.png)


![Architecture design patterns](/images/design-patterns/OSP2.png)

**Interview answer:**

The Open/Closed Principle states that software classes should be open for extension but closed for modification. In the discount example, each customer type has a separate implementation of IDiscount. When a new customer type is added, we create a new discount class instead of modifying existing code.


## 31A : - If a class is not closed for modification

If code is not closed for modification, every new requirement forces us to change existing, already-tested code.

```csharp
public class DiscountService
{
    public decimal CalculateDiscount(string customerType, decimal amount)
    {
        if (customerType == "Regular")
            return amount * 0.05m;

        if (customerType == "Premium")
            return amount * 0.10m;

        return 0;
    }
}
```
When a new VIP customer is introduced, we must modify the existing method:
```
if (customerType == "VIP")
    return amount * 0.20m;
```

This can cause:

- Existing functionality may break.
- Regression bugs may be introduced.
- The if/else or switch block keeps growing.
- The class becomes difficult to maintain.
- All existing scenarios must be retested.
- Multiple developers modifying the same class may cause merge conflicts.
- The class becomes tightly coupled to every customer type.

**Interview answer:**

If a class is not closed for modification, every new requirement requires changes to existing working code. This increases regression risk, testing effort, complexity and maintenance cost. OCP recommends extending behaviour through new implementations or derived classes instead of repeatedly modifying stable code.

“Closed for modification” does not mean that code can never be corrected. We can still modify it for bug fixes or genuine changes to its core responsibility. It means new variations should preferably be introduced through extension.

## 33:- Can you explain LISKOV Principle and its violation ?

LISKOV principle says that child class should be able to substitute the parent class seamlessly during
object polymorphism.

Parent object should replace child object seamlessly without any side effects

A derived class should be usable wherever its base class is expected, without breaking the application’s expected behaviour.

In simple words:

A child class should correctly behave like its parent class.

![Architecture design patterns](/images/design-patterns/LSP1.png)


![Architecture design patterns](/images/design-patterns/LSP2.png)

**Incorrect example**

Suppose all customers can receive discounts:

```
public class Customer
{
    public virtual decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.05m;
    }
}

public class PremiumCustomer : Customer
{
    public override decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.10m;
    }
}
```

So far, substitution works:
```
Customer customer = new PremiumCustomer();
Console.WriteLine(customer.CalculateDiscount(1000)); // 100
```
Now, we introduce a customer who is not eligible for a discount:

```
public class BlockedCustomer : Customer
{
    public override decimal CalculateDiscount(decimal amount)
    {
        throw new NotSupportedException(
            "Blocked customers cannot receive discounts");
    }
}
```
Now, we use the derived class in place of the base class:
```
public decimal GetFinalAmount(Customer customer, decimal amount)
{
    decimal discount = customer.CalculateDiscount(amount);
    return amount - discount;
}

var finalAmount = GetFinalAmount(new BlockedCustomer(), 1000);
```
This throws an exception.

The caller expects every Customer to support CalculateDiscount(), but BlockedCustomer cannot. Therefore,, this derived class cannot safely replace the base class.

This violates LSP.

**Correct design**

Only customers that support discounts should implement the discount contract:

```
public interface IDiscountEligible
{
    decimal CalculateDiscount(decimal amount);
}

public class RegularCustomer : IDiscountEligible
{
    public decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.05m;
    }
}

public class PremiumCustomer : IDiscountEligible
{
    public decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.10m;
    }
}

```

The service now accepts only discount-eligible customers:

```
public class BillingService
{
    public decimal GetFinalAmount(
        IDiscountEligible customer,
        decimal amount)
    {
        decimal discount = customer.CalculateDiscount(amount);
        return amount - discount;
    }
}
```
Usage:
```
var service = new BillingService();

IDiscountEligible customer = new PremiumCustomer();

decimal finalAmount = service.GetFinalAmount(customer, 1000);

Console.WriteLine(finalAmount); // 900
```
A blocked customer does not implement IDiscountEligible:
```
public class BlockedCustomer
{
    public string Reason { get; set; }
}
```
Therefore, it cannot incorrectly be passed to `BillingService.`

## 34:- How can we fix LISKOV Problem ?

In order to fix “LISKOV” issue properly you have to create separate base classes as per abstraction. You
will need to refactor the base classes or interfaces.

Note: - Do not give solutions like bypass and throw exceptions as shown in the video, it will give a bad
impression before the interviewer


## 35:- Explain Interface Segregation Principle?

No Client / Code should be forced to depend on methods/properties which is not concerned with them.

The Interface Segregation Principle means:

A class should not be forced to implement methods that it does not need.

In simple words:

Prefer small, focused interfaces instead of one large interface.

![Architecture design patterns](/images/design-patterns/ISP1.png)


![Architecture design patterns](/images/design-patterns/ISP2.png)

**Incorrect design**

Assume one large customer interface:

```
public interface ICustomer
{
    void PlaceOrder();
    decimal CalculateDiscount(decimal amount);
    void GetCreditFacility();
}
```
A regular customer can use all these methods:

```
public class RegularCustomer : ICustomer
{
    public void PlaceOrder()
    {
        Console.WriteLine("Order placed");
    }

    public decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.05m;
    }

    public void GetCreditFacility()
    {
        Console.WriteLine("Credit facility provided");
    }
}
```

But a guest customer may only place an order:

```
public class GuestCustomer : ICustomer
{
    public void PlaceOrder()
    {
        Console.WriteLine("Order placed");
    }

    public decimal CalculateDiscount(decimal amount)
    {
        throw new NotSupportedException();
    }

    public void GetCreditFacility()
    {
        throw new NotSupportedException();
    }
}
```
`GuestCustomer` is forced to implement methods it does not support. This violates ISP.

**Correct design**

Split the large interface into small, focused interfaces:

```
public interface IOrderCustomer
{
    void PlaceOrder();
}

public interface IDiscountEligible
{
    decimal CalculateDiscount(decimal amount);
}

public interface ICreditEligible
{
    void GetCreditFacility();
}
```
A guest customer implements only what it needs:

```
public class GuestCustomer : IOrderCustomer
{
    public void PlaceOrder()
    {
        Console.WriteLine("Guest order placed");
    }
}
```
A regular customer implements the required interfaces:

```
public class RegularCustomer :
    IOrderCustomer,
    IDiscountEligible,
    ICreditEligible
{
    public void PlaceOrder()
    {
        Console.WriteLine("Regular customer order placed");
    }

    public decimal CalculateDiscount(decimal amount)
    {
        return amount * 0.05m;
    }

    public void GetCreditFacility()
    {
        Console.WriteLine("Credit facility provided");
    }
}
```
Usage:

```
IOrderCustomer guest = new GuestCustomer();
guest.PlaceOrder();

IDiscountEligible customer = new RegularCustomer();
decimal discount = customer.CalculateDiscount(1000);

Console.WriteLine(discount); // 50
```

Benefits
- Classes implement only the methods they need.
- No unnecessary methods or NotSupportedException.
- Interfaces are easier to understand, maintain and test.
- Changes to one capability have less impact on unrelated classes.

Interview answer

The Interface Segregation Principle states that clients should not be forced to depend on methods they do not use. Instead of creating one large interface, we should divide it into smaller, role-specific interfaces. For example, a guest customer can implement only IOrderCustomer, while a regular customer can additionally implement IDiscountEligible and ICreditEligible. This prevents unnecessary implementations and reduces coupling.

## 36:- Is there a connection between LISKOV and ISP ?

LSP focusses on wrong inheritance. While ISP focusses on clients been forced to use Interface methods
even when not needed.

LISKOV is more related to inheritance where we have grouped class in a wrong family. Due to which the
child class is forced to implement methods which it should not.
ISP is broader and deals with interfaces.

1. Clients which consume the classes.
2. When classes are forced to implement interface methods.
3. When classes are put in wrong family.

**Interview answer**

Yes, ISP supports LSP. If an interface is too large, classes may be forced to implement unsupported methods and throw exceptions. Those classes can no longer safely substitute the interface, which violates LSP. By splitting large interfaces into smaller, focused interfaces, ISP helps ensure that every implementation honours its contract and follows LSP.

## 37:- Define dependency inversion?

High-level classes should not depend directly on low-level classes. Both should depend on abstractions such as interfaces.

Also:

Abstractions should not depend on implementation details; implementations should depend on abstractions.


![Architecture design patterns](/images/design-patterns/DI.png)

Simple customer example

Suppose CustomerService directly uses EmailService:

```csharp
public class EmailService
{
    public void Send(string message)
    {
        Console.WriteLine($"Email sent: {message}");
    }
}

public class CustomerService
{
    private readonly EmailService _emailService = new EmailService();

    public void RegisterCustomer(string name)
    {
        Console.WriteLine($"{name} registered");
        _emailService.Send("Registration successful");
    }
}
```
Here, `CustomerService` is tightly coupled to EmailService.

If we want SMS notifications, we must modify CustomerService. This violates DIP.

Correct design using an abstraction

Create an interface:
```
public interface INotificationService
{
    void Send(string message);
}
```
Low-level implementations depend on the interface:
```
public class EmailService : INotificationService
{
    public void Send(string message)
    {
        Console.WriteLine($"Email sent: {message}");
    }
}

public class SmsService : INotificationService
{
    public void Send(string message)
    {
        Console.WriteLine($"SMS sent: {message}");
    }
}
```
The high-level class also depends on the interface:

```csharp
public class CustomerService
{
    private readonly INotificationService _notificationService;

    public CustomerService(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public void RegisterCustomer(string name)
    {
        Console.WriteLine($"{name} registered");
        _notificationService.Send("Registration successful");
    }
}
```
**Dependency injection registration**

```csharp
builder.Services.AddScoped<INotificationService, EmailService>();
builder.Services.AddScoped<CustomerService>();
```
To switch to SMS:
```
builder.Services.AddScoped<INotificationService, SmsService>();
```
`CustomerService` does not need to change.
DIP vs dependency injection

They are related but different:

- DIP is a software design principle.
- Dependency Injection (DI) is a technique used to implement DIP.
- IoC container is a framework that creates and supplies dependencies.

**Interview answer**

Dependency Inversion means high-level business classes should not directly depend on concrete low-level classes. Both should depend on abstractions. For example, CustomerService depends on INotificationService instead of directly creating EmailService. The actual implementation is provided through dependency injection, reducing coupling and making the code easier to extend and test.

 **38:- What is higher level module and lower level module ?**

 Module which calls the other module is termed as Higher-level module. The module which gets
consumed is termed as Lower-Level module.

![Architecture design patterns](/images/design-patterns/DI2.png)

## 40:- Will only Dependency inversion solve decoupling problem?

No, you also need to implement IOC (Inversion of Control) and DI (Dependency injection ) for a proper
decoupled architecture.

## 42:- Explain IOC (Inversion of control) ?

IOC is a thought process where we remove the object creation process from the higher level module. We
remove the “NEW” keyword from the higher-level module.

IoC means:

A class does not create and control its own dependencies. An external framework or container creates the dependencies and provides them to the class.

In simple words:

Instead of your class controlling object creation, the control is given to the .NET framework.


 ## 43:- Explain Dependency Injection ( DI ) with an example?


Dependency injection is a process where we inject dependent object from outside.

Without IoC

CustomerService creates its own EmailService:
```
public class EmailService
{
    public void Send(string message)
    {
        Console.WriteLine($"Email: {message}");
    }
}

public class CustomerService
{
    private readonly EmailService _emailService;

    public CustomerService()
    {
        _emailService = new EmailService();
    }

    public void RegisterCustomer(string name)
    {
        Console.WriteLine($"{name} registered.");
        _emailService.Send("Registration successful.");
    }
}
```

Problems:

- `CustomerService` is tightly coupled to EmailService.
- Switching to SmsService requires modifying CustomerService.
- Unit testing is difficult because we cannot easily provide a mock service.

With IoC

First, create an abstraction:
```
public interface INotificationService
{
    void Send(string message);
}
```
Implement the interface:

```
public class EmailService : INotificationService
{
    public void Send(string message)
    {
        Console.WriteLine($"Email: {message}");
    }
}
```
Now CustomerService receives its dependency:

```
public class CustomerService
{
    private readonly INotificationService _notificationService;

    public CustomerService(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public void RegisterCustomer(string name)
    {
        Console.WriteLine($"{name} registered.");
        _notificationService.Send("Registration successful.");
    }
}
```

Register it in ASP.NET Core:

```
builder.Services.AddScoped<
    INotificationService,
    EmailService>();

builder.Services.AddScoped<CustomerService>();
```

Use it in a controller:
```
public class CustomerController : ControllerBase
{
    private readonly CustomerService _customerService;

    public CustomerController(CustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost]
    public IActionResult Register(string name)
    {
        _customerService.RegisterCustomer(name);

        return Ok("Customer registered");
    }
}
```
The ASP.NET Core IoC container now:

1. Creates EmailService.
2. Creates CustomerService.
3. Injects EmailService into CustomerService.
4. Injects CustomerService into the controller.

This transfer of object-creation control to the framework is called Inversion of Control.

IoC vs DI vs DIP
| Concept | Meaning                                                              |
| ------- | -------------------------------------------------------------------- |
| **IoC** | General concept of transferring control to a framework or container  |
| **DI**  | A technique where dependencies are supplied from outside             |
| **DIP** | A SOLID principle stating that classes should depend on abstractions |


**Interview answer**

Inversion of Control means transferring control of dependency creation from a class to an external framework or IoC container. In ASP.NET Core, we register services in the built-in container, and the framework creates and injects them through constructors. This reduces tight coupling and improves maintainability, extensibility and unit testing.

## 44:- Is SOLID, IOC and DI design pattern or principle?

SOLID and IOC are principles while DI is a technique. DI is a technique because some can inject through
properties , some developers through methods and some like constructors.

They are related, but they are not all design patterns.

| Term      | Category                 | Meaning                                                                           |
| --------- | ------------------------ | --------------------------------------------------------------------------------- |
| **SOLID** | Design principles        | Five principles used to design maintainable object-oriented software              |
| **DIP**   | SOLID principle          | High-level and low-level modules should depend on abstractions                    |
| **IoC**   | Design principle/concept | Transfers control of object creation or application flow to a framework/container |
| **DI**    | Design pattern/technique | Supplies a class’s dependencies from outside                                      |

1. SOLID — Design principles

SOLID represents five object-oriented design principles:

S — Single Responsibility Principle
O — Open/Closed Principle
L — Liskov Substitution Principle
I — Interface Segregation Principle
D — Dependency Inversion Principle

SOLID is not a design pattern. It provides guidelines for designing maintainable software.

2. IoC — Design principle/concept

IoC means your class gives control of object creation or program flow to another component, such as the ASP.NET Core framework.
```
// ASP.NET Core creates the controller and supplies its dependency.
public CustomerController(ICustomerService customerService)
{
    _customerService = customerService;
}
```
IoC is a broad concept. Dependency Injection is one way to implement it.

3. DI — Design pattern/technique

DI supplies dependencies to a class from outside:

```
public CustomerService(INotificationService notificationService)
{
    _notificationService = notificationService;
}
```
Instead of this:
```
_notificationService = new EmailService();
```
Common DI types are:

- Constructor injection — recommended
- Method injection
- Property injection

Easy way to remember

- SOLID tells us how to design.
- DIP tells us to depend on abstractions.
- IoC transfers control.
- DI injects the required dependencies.

Interview answer

SOLID is a collection of five design principles. IoC is a broader design principle or architectural concept where control is transferred to a framework or container. Dependency Injection is a design pattern or technique used to implement IoC and commonly support DIP. Therefore, SOLID and IoC are principles or concepts, while DI is their practical implementation technique.

## 45:- Is only SOLID Enough for good code/architecture ?

Note :- Never just say that SOLID is enough to create a good code or architecture. Interviewer would
probably not like that hard stand.

For good code and architecture its culmination of many things SOLID , DRY , DI , IOC , Design patterns ,
Architecture patterns and so on

No. SOLID alone is not enough for good code or architecture.

SOLID mainly helps us design individual classes and their relationships. Good architecture also requires decisions about the entire application—security, performance, database, integration, deployment and maintainability.

**What else is required?**

| Area                     | Purpose                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| Clear requirements       | Build the correct solution                                                  |
| Separation of concerns   | Keep UI, business logic and data access separate                            |
| Appropriate architecture | Modular monolith, layered architecture, Clean Architecture or microservices |
| Design patterns          | Use proven solutions when appropriate                                       |
| DRY                      | Avoid unnecessary duplication                                               |
| KISS                     | Keep the solution simple                                                    |
| YAGNI                    | Do not build features before they are needed                                |
| Testing                  | Unit, integration and end-to-end tests                                      |
| Security                 | Authentication, authorization, validation and secrets management            |
| Performance              | Efficient database queries, caching and asynchronous I/O                    |
| Error handling           | Centralized exceptions, proper status codes and clear messages              |
| Observability            | Structured logging, metrics, tracing and health checks                      |
| CI/CD                    | Automated build, test and deployment                                        |
| Documentation            | Record APIs, architecture and important decisions                           |


**Example**

A project can follow SOLID but still have:

Slow EF Core queries and N+1 problems
Insecure APIs
Poor database design
No exception handling
No automated testing
Too many unnecessary abstractions
Incorrect service lifetimes
A distributed microservice system that is difficult to maintain

Therefore, SOLID does not automatically create a good system.

**Important balance**

SOLID should not be applied blindly. For example, creating an interface for every small class can make a simple application unnecessarily complex.

Apply abstraction when it provides real value, such as:

- Multiple implementations
- External dependencies
- Unit-test boundaries
- Business rules that are likely to change

**Interview answer**

No, SOLID is only one part of good software design. It improves class-level maintainability, extensibility and loose coupling, but good architecture also requires clear requirements, separation of concerns, suitable architecture, testing, security, performance, observability and deployment practices. SOLID should be applied pragmatically along with principles such as KISS, DRY and YAGNI; otherwise, overengineering can make the code more difficult to maintain.