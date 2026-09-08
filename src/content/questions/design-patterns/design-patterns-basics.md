---
id: design-patterns-basic-001
slug:  design-patterns-basic
categoryId:design-patterns
subcategory: Basics
difficulty: Basic
title: Design-patterns-basic Questions and Answers: Beginner to Expert
description:  Why you selected a pattern, alternatives considered, trade-offs, testability, coupling, and how it behaved in production..
tags: [design-patterns, Architecture Style, Architecture Pattern, repository pattern]
updatedAt: 2026-09-07
status: published
thumbnail: ""
videos: []
resources: []
---

# Design patterns Basics
## 1. Explain your project architecture?

- **The top layers: -**It's a 4-layer architecture with front end in Angular, Middle Layer in MVC,Data acess layer uses EF and DB in SQL Server.
- **Architecture patterns: -**ASP.NET follows MVC architecture where model has business logic,view look and feel and controller connect the model and the view
- **Design patterns: -** In Project we have implemented best practices and design patterns like repository/UOW/Factory, iterator pattern and so on.

![Architecture design patterns](/images/design-patterns/Architecture Level.png)

It’s a 4-layer architecture with front end in Angular, Middle Layer in MVC, Data access layer uses EF and
DB in SQL Server.

ASP.NET follows MVC architecture where model has business logic, view look and feel and controller
connect the model and the view.

In projects we have implemented best practices and design patterns like repository / UOW / Factory,
iterator pattern and so on.

## 2. Architecture Style vs Architecture Pattern Vs Design pattern

- **An architecture style** represents a set of principles or guidelines that shape the overall structure and organization of a software system. Some examples are REST, SOA and so on. So, for example, REST provides general principle on how to design networked application. Like its should  be stateless, resource abstraction, manipulation of resource through representation and standard uniform interfaces.
- **Architecture pattern** provides general structures / layers for designing software system. Some examples are MVC, Layered architecture, MVVM and so on.
- **Design pattern** is solution for recurring problems in software design. And it has a very clear context. It operates at a very lower level, almost at the code level.

![Architecture design patterns](/images/design-patterns/Architecture Level2.png)

## 3:- What are design patterns?

Design patterns are **time tested solution for recurring architecture problems.**
Also, with the above definition try to give one or two design patterns as examples. While giving examples
remember three things: -
1. Do not give example of Singleton pattern so that you can stand out in the crowd.
2. Give one example of non-GOF pattern like repository, CQRS and so on.
3. And whatever patterns you say in example make sure you are fully aware of the same.
Examples of pattern please tailor as per your knowledge

**“Adapter pattern”** helps to make incompatible interfaces compatible.

**“Iterator pattern”** helps iterate over elements of an aggregate object sequentially without exposing the underlying representation of the object.

**“Template pattern”** define a skeleton of the algorithm in parent class and let subclass override specific steps.

**“Repository pattern”** helps to abstract and centralize the data access logic in an application. It provides a layer of separation between the application's business logic and the data access code, making the code more modular, maintainable, and testable.

## 4:- Which are the different types of design patterns?

Gang of Four (GOF) categorized the Design Pattern into three main categories based on the three problem areas (Object Creation and Initialization, Structural Changes of Classes and Interfaces, and the Relationship Between Classes and communication Between Objects) of software architecture. They are as follows.

1. **Creational Design Pattern** (Object Creation and Initialization)
2. **Structural Design Pattern** (Structural Changes of Classes, and Interfaces, and the Relationship Between Classes)
3. **Behavioral Design Pattern** (Communication Between Objects)

**Creational Design Patterns:**

The Creational Design Pattern deals with Object Creation and Initialization. The Creational Design Pattern gives the programmer more flexibility in deciding which objects need to be created for a given case. For example, if we have a huge project, a huge project means we have a lot of classes, and a lot of classes means we are dealing with many objects. So we need to create different objects (like **new Customer(), new Product(), new Invoice(), etc.**) based on some conditions.

The Creational Design Pattern helps us to centralize the object creation and initialization logic, and depending upon the condition, it will create and initialize the appropriate object and return that object to the client. Then, the client can consume the object by calling the necessary methods and properties. The client does not know how the object is created and initialized. 

**Examples** of Creational Design Patterns are **Singleton, Factory, Builder, Prototype, Fluent Interface, Factory Method, and Abstract Factory.**



**Structural Design Patterns:**

The **Structural Design Pattern** is used to Manage the Structure of Classes and Interfaces and the Relationship Between the Classes and Interfaces. For example, if we have a Customer and Product class and the Product class is used inside the Customer class, making One-to-Many relationships. As the project proceeds tomorrow, we want to keep the product class from the Customer class as we want to use the Product and Customer classes independently. This is a structural change, and we don’t want this structural change to affect our project. This is where the Structural Design Pattern helps us.

Examples of Structural Design Patterns are **Adapter, Facade, Decorator, Composite, Proxy, Flyweight, and Bridge Design Patterns.** These patterns concern how classes and objects can be composed to form larger structures. They help ensure that the entire structure doesn’t need to change when one part of a system changes.

- Adapter - Match interfaces of different classes
- Composite - A tree structure of simple and composite objects
- Decorator - Add responsibilities to objects dynamically



**Behavioral Design Patterns:**

**Behavioral Design Patterns** deal with the Communication Between Classes and Objects. That means if you want to change the behavior of a class again, you want it to affect other classes of the project as well. For example, you have an Invoice class that currently applies taxes as 18%. Tomorrow, if you have to add another extra tax. That means you are changing the behavior of a class. To solve such Behavioral issues, Behavioral Design patterns come into the picture.

Behavioral Design Patterns include Chain of **Responsibility, Command,  Observer, Iterator, State, Template Method, Visitor, Strategy, Mediator, Memento, and Interpreter** Design Pattern.

- Chain of responsibility - A way of passing a request between a chain of objects
- Command - Encapsulate a command request as an object
- Mediator - Defines simplified communication between classes
- Memento - Capture and restore an object's internal state
- Template method - Defer the exact steps of an algorithm to a subclass


## 5:- Which design pattern have you used in your project?

**Note: -** first and foremost do not answer SINGLETON pattern as it will not help you stand in the crowd.
and remember: -

- My choice of patterns is not yours so pick what you are comfortable.
- Only talk about patterns you are confident of. Many patterns you have already used in your projects. If you can have closer look on them you can speak not only confidently but also    naturally. When answers are natural interviewers love it.
- Do not just talk GOF but also talk about Non-GOF patterns.
- Yes, avoid singleton stand in the crowd. Its over used and abused in interviews.

**Some of the most used patterns are: -**

Most of the applications are CRUD so repository pattern comes at the top.

1. **Repository pattern:** Acts like an abstract layer between Models and Data access technologies like EF, ADO.NET and so on. Data access logic is centralized making code maintainable, testable and modular. With repository pattern, UOW goes like hand in gloves.

2. **UOW (Unit of Work):** This pattern helps to manage transactions and changes made to objects. It goes with repository pattern well.

3. **Iterator pattern:** Helps iterate over elements of an aggregate object sequentially without exposing the underlying representation of the object. We all know we use FOR EACH so much, so this pattern is also very much used. One important point to note here — talk about `IEnumerator` and `IEnumerable` as they implement iterator by default.

4. **Factory pattern:** From creational patterns this is the most used one. Creates an instance of several derived classes. Used when third party components are used.

5. **Adapter pattern:** Makes incompatible interfaces compatible.

6. **Decorator pattern:** Add behavior dynamically.

7. **Command pattern:** Treat command as objects. Heavy use in CQRS.

8. **Façade:** Represent subsystem in a simplified way.

9. **Composite:** A tree structure of simple and composite objects.

10. **Template method:** Defer the exact steps of an algorithm to a subclass.

## 6:- Explain Singleton Pattern and the use of the same?
Singleton pattern helps to create a single instance of an object. Some of the uses of Singleton patterns are: -

- Caching of data like Countries, States, Currencies and so on.
- Global sharing of data like common themes , hit counters and so on.

## 7:- How did you implement singleton pattern?

![singleton1 design patterns](/images/design-patterns/singleton1.png)

To implement singleton pattern (Check the number with the above figure): -

**1. Whole part relationship: -** The first thing needed in singleton is a root class through which all shared objects should be exposed. This root class instance should be created inside the lass and it should be static.

**2. Thread safety: -** Whenever we are loading the singleton object use the “lock” keyword to make sure only one thread manipulates at a time.

**3. Private constructor: -** Make sure the root class can not be instantiated from outside.

**4. Ensure root object is single instance: -** use the double null check and make sure that only one instance is created and also lock is not executed unnecessarily.

**5. Lazy loading implementation: -** We would like to load the objects when demanded then loading it unnecessarily.

**6. Performance for threading: -** NULL check before the locking to ensure that we do not execute locks unnecessarily.

## Lazy loading implementation in Singleton

```csharp
using System;

namespace SingletonExample
{
    // The 'sealed' keyword prevents subclassing, which could violate the singleton pattern
    public sealed class Logger
    {
        // 1. Instantiate Lazy<Logger>. By default, Lazy<T> provides thread-safe execution mode.
        // The instance is NOT created here. It merely sets up the initialization recipe.
        private static readonly Lazy<Logger> _instance = new Lazy<Logger>(() => new Logger());

        // 2. The public property to expose the instance. 
        // Accessing '_instance.Value' triggers the internal construction only on the first call.
        public static Logger Instance => _instance.Value;

        // 3. A private constructor stops other classes from using 'new Logger()'
        private Logger()
        {
            Console.WriteLine("[System] Logger initialized for the first time.");
        }

        // Example business method inside the singleton
        public void Log(string message)
        {
            Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}");
        }
    }

    class Program
    {
        static void Main()
        {
            Console.WriteLine("Application started. Logger has not been instantiated yet...");

            // First access: This triggers the constructor and executes the Log method.
            Logger.Instance.Log("User logged in successfully.");

            // Second access: Returns the already existing instance; constructor will not run again.
            Logger.Instance.Log("Data successfully saved to database.");

            // Verification check
            Logger logger1 = Logger.Instance;
            Logger logger2 = Logger.Instance;

            bool isSameReference = object.ReferenceEquals(logger1, logger2);
            Console.WriteLine($"Are both logger instances identical? {isSameReference}"); // Output: True
        }
    }
}

```

## Without Lazyloading

```csharp
using System;
using System.IO;

public sealed class Logger
{
    // 1. Private static variable to hold the single instance.
    // The 'volatile' keyword ensures that instance assignment is completed 
    // before the variable can be accessed by other threads.
    private static volatile Logger? _instance;

    // 2. Private static object used exclusively for thread synchronization.
    private static readonly object _lockPadlock = new object();

    // 3. A private constructor prevents external instantiation via 'new'.
    private Logger()
    {
        // Setup code (e.g., initializing a log file) goes here
    }

    // 4. Public static property to provide global access to the instance.
    public static Logger Instance
    {
        get
        {
            // First check: If the instance already exists, skip the lock entirely (High Performance).
            if (_instance == null)
            {
                // Thread safety: Only one thread can enter this block at a time.
                lock (_lockPadlock)
                {
                    // Second check: Double-check if another thread initialized it while we were waiting for the lock.
                    if (_instance == null)
                    {
                        _instance = new Logger();
                    }
                }
            }
            return _instance;
        }
    }

    // Example logging method
    public void Log(string message)
    {
        Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}");
    }
}

```

🚀 How to Use It

You can access the logger from any class or thread in your application using `Logger.Instance`

```csharp
class Program
{
    static void Main()
    {
        // Retrieve the single instance of the Logger
        Logger logger = Logger.Instance;
        logger.Log("Application started successfully.");

        // Any subsequent calls point to the exact same instance in memory
        Logger balancingLogger = Logger.Instance;
        balancingLogger.Log("Processing data...");
        
        // Verification: Both variables point to the exact same instance
        bool areIdentical = ReferenceEquals(logger, balancingLogger);
        Console.WriteLine($"Are both logger instances identical? {areIdentical}"); // Output: True
    }
}

```

## 8:- Can we use Static class rather than using a private constructor? Or Static vs Singleton pattern?

**Singleton Pattern = Static + Thread Safety + Lazy Loading + Performance**

- **Keyword VS Design Pattern: -** Static is a language keyword while Singleton is a Design pattern.
- **Loose many OOP features: -** If you make a class static you cannot implement interfaces, cannot inherit and so on.
- **Lazy loading / Thread Safety: -** When you make a class static, object is created in the first call itself without giving you option of when to load and when not. Second you should also make sure its thread safe as it’s a global object.

## 10:- How did you implement thread safety in Singleton?

- C# **“lock”** keyword helps to implement thread safety.
- Whatever code is in the scope of **“lock”** keyword will get executed by only ONE thread at time avoiding any thread unsafe situation.

![singleton1 design patterns](/images/design-patterns/singleton3.png)

##  11:- What is double null check in Singleton?

Double null check is done for two purposes.

**Internal null check: -** This is done to make sure the instance load only once and its loaded OnDemand.

**External null check :-** This is done so that “lock” is not acquired unnecessarily. “lock” is an intensive process and should be executed only when the singleton is null.

![singleton1 design patterns](/images/design-patterns/singleton4.png)

## 12:- Can Singleton pattern code be made easy with Lazy keyword?
- Yes, by using LAZY keyword we can make the code size smaller. LAZY makes code thread safe and also does late initialization.

![singleton1 design patterns](/images/design-patterns/singleton5.png)

## 13:- Can we rid of this double null check code?

Yes by using LAZY keyword you can get rid of double null check.

## 14:- What are GUI architecture patterns, can you name some?

GUI Architecture pattern refers to how to organize structurally the interaction between User, View (UI) and components (Models, Business logic) in a software application. Its helps to maintain clear separation of concerns in distinct layers.

Some of the GUI architecture patterns are: -

- MVC: - Model View Controller.
- MVP: - Model View Presenter.
- MVVM: - Model View ViewModel.

![GUI design patterns](/images/design-patterns/GUI Pattern1.png)

If you take an example of a typical GUI code it has lot of plumbing code as shown in the below figure.

This makes the code more complex and difficult to maintain. A typical UI code does following things:-

- Calling, loading and updating model.
- Updating UI from the Model and vice-versa.
- Enabling, Disabling, changing color and so on.

So rather than GUI getting loaded with all CONCERNS we put them in to different sections and layers.

## 15:- Explain term Separation of concerns ( SOC ) ?

Separation of Concerns (SoC) is a design principle that advocates breaking a software system into distinct sections, each addressing a separate concern or aspect of functionality.

For example **MVC , MVP and MVVM** apply separation of concerns concept.

## 16:- Explain MVC Architecture Pattern?

![GUI design patterns](/images/design-patterns/GUI Pattern2.png)

## 17:- Explain MVP Architecture pattern?

![GUI design patterns](/images/design-patterns/GUI Pattern3.png)

## 18:- What is the importance of interface in MVP ?

Interface helps to connect the view and presenter. Presenter calls / Updates the View via the Interface callback.

![GUI design patterns](/images/design-patterns/GUI Pattern4.png)

## 19:- What is passive view?

Passive view is view which does not contain any logic related to user interaction and presentation. Passive View submits itself to the presenter for all UI interaction logic and follows the presenter like deity. Here view does two things: -

- Has User controls.
- Passes the UI interaction to the presenter.
- Waits for the presenter call back to update the UI.

## 20:- Explain MVVM architecture pattern?

![GUI design patterns](/images/design-patterns/GUI Pattern5.png)

## 21:- What is the difference between MVP and MVVM ?

MVP does not have automated bindings and it submits itself completely to presenter. While in case of MVVM view talks to View Model through bindings. In both cases the first hit comes to view.

## 22:- What is a ViewModel?

`Note:- We have ViewModel term in MVVM also and also generically ViewModel class is used. This
answer is from the more generic perspective. ViewModel class is used generically in MVC, MVP and in
many other architectures as well. The ViewModel class in MVVM has specialty of bindings.`

ViewModel acts like a mediator between View and Model. ViewModel encapsulates the model and
provides all things needed by view. ViewModel provides two things to view : -

- Model Data:- examples - Customer code ,Customer name.
- View Data:- Enable , Disable , Color , Aesthetics and so on.

## 23:- When to use what MVP / MVC / MVVM?

Putting it simple choice of these architecture pattern is not in the hand of the architect but **rather what kind of technical support that technology give.** So here is the decision road map.

![GUI design patterns](/images/design-patterns/GUI Pattern6.png)

## 24:- MVC vs MVP vs MVVM?

![GUI design patterns](/images/design-patterns/GUI Pattern7.png)

## 25:- Layered architecture vs Tiered?

![GUI design patterns](/images/design-patterns/GUI Pattern8.png)