---
id: design-patterns-basic-001
slug:  design-patterns-basic
categoryId:design-patterns
subcategory: Basics
difficulty: Basic
title: design-patterns-basic Questions and Answers: Beginner to Expert
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

The Creational Design Pattern deals with Object Creation and Initialization. The Creational Design Pattern gives the programmer more flexibility in deciding which objects need to be created for a given case. For example, if we have a huge project, a huge project means we have a lot of classes, and a lot of classes means we are dealing with many objects. So we need to create different objects (like new Customer(), new Product(), new Invoice(), etc.) based on some conditions.

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