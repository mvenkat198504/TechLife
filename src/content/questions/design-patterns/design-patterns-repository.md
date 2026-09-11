---
id: repository-pattern-001
slug:  repository-pattern-basic
categoryId:design-patterns
subcategory: Repository-Pattern
difficulty: Basic
title: Repository-Pattern Questions and Answers: Beginner to Expert
description: Why you selected a pattern, alternatives considered, trade-offs, testability, coupling, and how it behaved in production..
tags: [repository-pattern, Generic repository-pattern, UOW, EF]
updatedAt: 2026-09-09
status: published
thumbnail: ""
videos: []
resources: []
---

# Repository-Pattern Questions and Answers

## 46:-What is the use of repository pattern?
Note: - While answering this question the word abstraction should come out prominently.

![Architecture design patterns](/images/design-patterns/repository-pattern1.png)

The **Repository Pattern** creates a **separation between your business/service layer** and the data-access layer

In simple terms:

Instead of accessing DbContext directly everywhere, we access data through a Repository.

Without Repository Pattern

Your controller/service directly talks to Entity Framework:
```csharp
public class CustomerService
{
    private readonly AppDbContext _context;

    public CustomerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Customer>> GetCustomers()
    {
        return await _context.Customers.ToListAsync();
    }
}
```
Here, `CustomerService` is directly dependent on EF Core's `AppDbContext.`

With Repository Pattern

First create an interface:

```csharp
public interface ICustomerRepository
{
    Task<List<Customer>> GetAllAsync();
    Task<Customer?> GetByIdAsync(int id);
    Task AddAsync(Customer customer);
}
```
Then implement it:

```csharp
public class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _context;

    public CustomerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Customer>> GetAllAsync()
    {
        return await _context.Customers.ToListAsync();
    }

    public async Task<Customer?> GetByIdAsync(int id)
    {
        return await _context.Customers.FindAsync(id);
    }

    public async Task AddAsync(Customer customer)
    {
        await _context.Customers.AddAsync(customer);
        await _context.SaveChangesAsync();
    }
}
```
Now the service depends on the repository:

```csharp
public class CustomerService
{
    private readonly ICustomerRepository _repository;

    public CustomerService(ICustomerRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Customer>> GetCustomers()
    {
        return await _repository.GetAllAsync();
    }
}
```
Register it in Program.cs:
```csharp
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
```
Why do we use it?

The main advantages are:

- Separation of concerns — business logic and database logic are separated.
- Testability — repositories can be mocked when unit testing services.
- Maintainability — database queries are kept in a centralized place.
- Loose coupling — service depends on ICustomerRepository, not directly on EF Core.
- Reusability — the same repository methods can be used by multiple services.

Interview answer

You can say:

"Repository Pattern is used to separate the data-access logic from the business logic. Instead of directly accessing DbContext from controllers or services, we use a repository abstraction. This improves separation of concerns, maintainability, testability, and loose coupling."

One important experienced-level point: `EF Core's` DbContext `already provides repository/unit-of-work-like behavior,` so adding a custom repository is not automatically necessary. It is most useful when the repository provides a meaningful application-specific abstraction rather than simply wrapping every `DbSet` method.

## 47:-Is Dal (Data access Layer) and Repository same?

No. DAL (Data Access Layer) and Repository are related, but they are not the same thing.

Note: - In interviews for repositories do not use vocabulary Dal interchangeably, it can send a different
impression to the interviewer.

Dal focuses on the technical details of data access while repository pattern provides a higher level of
abstraction over Dal.

Dal provides technical centric approach of how to access the data source, while
Repositories provide Domain centric approach.

Simple difference

| DAL                                                                | Repository Pattern                                              |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| An **architectural layer**                                         | A **design pattern**                                            |
| Contains database-related code                                     | Provides an abstraction for accessing data                      |
| May use EF Core, ADO.NET, Dapper, etc.                             | Usually exists **inside the DAL/Infrastructure layer**          |
| Can contain repositories, DbContext, stored-procedure access, etc. | Usually focuses on operations for a particular entity/aggregate |

For example:

Controller
    ↓
Service / Business Layer
    ↓
ICustomerRepository
    ↓
CustomerRepository       ← Repository Pattern
    ↓
AppDbContext / EF Core
    ↓
SQL Server

The `CustomerRepository` and `AppDbContext` could both belong to the application's Data Access Layer.

```csharp
public interface ICustomerRepository
{
    Customer GetById(int id);
    void Add(Customer customer);
}

public class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _context;

    public CustomerRepository(AppDbContext context)
    {
        _context = context;
    }

    public Customer GetById(int id)
    {
        return _context.Customers.Find(id);
    }

    public void Add(Customer customer)
    {
        _context.Customers.Add(customer);
        _context.SaveChanges();
    }
}
```

Here:

- DAL = the broader layer responsible for data access.
- Repository = a pattern/class used within that layer to abstract data operations.

**Interview answer**

"No, DAL and Repository are not exactly the same. DAL is an architectural layer responsible for all database access. Repository is a design pattern that can be implemented inside the DAL to abstract data-access operations from the business layer."

A good one-line distinction to remember:

DAL is a layer; Repository is a pattern used to organize data access.

## 48:-What is Generic repository pattern ?

Generic repository pattern is an extension to repository pattern. Rather than creating separate interfaces
/ classes for each entity, you can just create a generic interface / class for all entities.

A **Generic Repository Pattern** creates **one common repository that can perform CRUD operations for multiple entities**, instead of creating the same CRUD methods separately for every entity.

Without Generic Repository

Suppose we have `Customer`, `Employee`, and Product.

We might create:

```csharp
public interface ICustomerRepository
{
    Customer GetById(int id);
    List<Customer> GetAll();
    void Add(Customer customer);
    void Delete(Customer customer);
}

public interface IEmployeeRepository
{
    Employee GetById(int id);
    List<Employee> GetAll();
    void Add(Employee employee);
    void Delete(Employee employee);
}
```

Notice that we're repeating the same methods.

**With Generic Repository**
We create one generic interface:

```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}
```
Then one implementation:

```csharp
public class Repository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }
}
```
Now the same repository works for different entities:
```csharp
IRepository<Customer> customerRepository;

IRepository<Employee> employeeRepository;

IRepository<Product> productRepository;
```
For example:
```csharp
var customers = await customerRepository.GetAllAsync();
var employees = await employeeRepository.GetAllAsync();
var products = await productRepository.GetAllAsync();
```
Dependency Injection

Register the open generic type in `Program.cs`:
```csharp
builder.Services.AddScoped(
    typeof(IRepository<>),
    typeof(Repository<>));
```
Then inject it:
```csharp
public class CustomerService
{
    private readonly IRepository<Customer> _repository;

    public CustomerService(IRepository<Customer> repository)
    {
        _repository = repository;
    }

    public async Task<List<Customer>> GetCustomers()
    {
        return await _repository.GetAllAsync();
    }
}
```
**Why use Generic Repository?**

The biggest benefit is avoiding duplicate CRUD code.
Normal Repository

Normal Repository

CustomerRepository → Add, Update, Delete, Get
EmployeeRepository → Add, Update, Delete, Get
ProductRepository  → Add, Update, Delete, Get

```
Generic Repository


                IRepository<T>
                     ↓
                Repository<T>
                 /    |    \
                /     |     \
         Customer  Employee  Product
```


**Interview answer**

"Generic Repository Pattern provides common data-access operations for multiple entities using generics. Instead of creating separate CRUD methods for Customer, Employee, Product, etc., we create IRepository<T> and Repository<T>. This reduces duplicate code and provides a reusable and consistent data-access abstraction."         


**Interview trap:**

 If asked "Should we always use Generic Repository with EF Core?", say No. DbContext and DbSet<T> already provide repository/unit-of-work-like functionality. A generic repository is useful when it adds a meaningful abstraction or common application behavior; simply wrapping every EF Core method can add unnecessary complexity.


## 49:-Is abstraction the only benefit of Repository?

Note: - I framed this question on purpose as this can be a part of discussion more than a question.
During this discussion the interviewer is expecting that reusability is also another big benefit of
Repository other than loose coupling.

The other benefit of repository pattern is reusability across data access layers. There can be many logic
which is common across data layers and they can be put in a common class and all repositories would
inherit from that common class.

No. Abstraction is an important benefit of Repository Pattern, but it is not the only benefit.

**1. Main benefits** of Repository Pattern
Abstraction — hides the details of data access from the business layer.
```
var customer = await _customerRepository.GetByIdAsync(id);
```
The service doesn't need to know whether the repository uses EF Core, Dapper, SQL, or an API.

**2. Separation of Concerns** — keeps business logic separate from database/query logic.
```
Controller
    ↓
Service            → Business Logic
    ↓
Repository         → Data Access Logic
    ↓
EF Core / Database
```

**3.Testability** — because the service depends on an interface, you can mock the repository without using a real database.

```csharp
var mockRepo = new Mock<ICustomerRepository>();

mockRepo
    .Setup(x => x.GetByIdAsync(1))
    .ReturnsAsync(customer);
```

**4.Centralized data-access logic** — complex queries can be kept in one place rather than duplicated across controllers/services.
```
_customerRepository.GetActiveCustomersAsync();
```
**5.Loose Coupling** — the business layer depends on an abstraction such as:
```
ICustomerRepository
```
rather than directly depending on:
```
AppDbContext
```
**6.Maintainability and reusability** — if several services need the same query, they can reuse the repository method.

**Interview answer**

"No. Abstraction is one benefit of Repository Pattern, but it also provides separation of concerns, loose coupling, testability, centralized data-access logic, reusability, and maintainability."

A useful interview point is that Repository Pattern does not automatically make code better. With EF Core, DbContext/DbSet already provide repository-like abstractions. A custom repository is most valuable when it adds meaningful domain-specific queries, testing boundaries, or architectural separation—not when it simply wraps every EF Core CRUD method.


## 50:-How to implement transaction in repository?

In a Repository Pattern, transactions are usually handled using **EF Core** `DbContext.Database.BeginTransactionAsync()`, often through a **Unit of Work** so multiple repositories can participate in the same transaction.

**Simple example**

Suppose you need to save an Order and Payment. If payment fails, the order should also be rolled back.

```csharp
public class OrderService
{
    private readonly AppDbContext _context;
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;

    public OrderService(
        AppDbContext context,
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository)
    {
        _context = context;
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task CreateOrderAsync(Order order, Payment payment)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            await _orderRepository.AddAsync(order);
            await _paymentRepository.AddAsync(payment);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
```
The flow is:
```
Begin Transaction
      ↓
Insert Order
      ↓
Insert Payment
      ↓
SaveChanges
      ↓
Success?
  /       \
Yes        No
 ↓          ↓
Commit    Rollback
```
**Better approach: Unit of Work**

In larger applications, don't normally put transaction management inside each individual repository.

Create a Unit of Work:
```csharp
public interface IUnitOfWork
{
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
    Task<int> SaveChangesAsync();
}
```
Implementation:
```csharp
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public async Task BeginTransactionAsync()
    {
        _transaction =
            await _context.Database.BeginTransactionAsync();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task CommitAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
        }
    }

    public async Task RollbackAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
        }
    }
}
```
Then your service becomes:

```csharp
public async Task CreateOrderAsync(
    Order order,
    Payment payment)
{
    await _unitOfWork.BeginTransactionAsync();

    try
    {
        await _orderRepository.AddAsync(order);
        await _paymentRepository.AddAsync(payment);

        await _unitOfWork.SaveChangesAsync();

        await _unitOfWork.CommitAsync();
    }
    catch
    {
        await _unitOfWork.RollbackAsync();
        throw;
    }
}
```
Important interview point

If only one SaveChangesAsync() is being used, EF Core already treats that call as a transaction for supported relational databases.

For example:
```csharp
_context.Orders.Add(order);
_context.Payments.Add(payment);

await _context.SaveChangesAsync();
```

If one insert fails, EF Core normally rolls back the whole SaveChangesAsync() operation.

You explicitly create a transaction when you have things like:

```
SaveChanges()
   ↓
Some processing
   ↓
Another SaveChanges()
```

or multiple repository operations that must behave as one atomic business operation.

**Interview answer**

"In Repository Pattern, transactions can be implemented using EF Core's BeginTransaction, Commit, and Rollback. Usually transaction management is placed in a Unit of Work rather than inside individual repositories, so multiple repositories can participate in the same transaction. Also, a single EF Core SaveChanges() is already transactional."

A useful distinction:

Repository manages data access. Unit of Work manages SaveChanges and transaction boundaries across repositories.

## 51:-What is Unit of work design pattern?

Unit of Work ( UOW ) helps to abstract / implement transactions in repository.

Note :- Many developers do not know how to answer transaction definition so here is the answer :-
Transaction is a group of task / operation where in either the whole group is committed or the whole
group is rolled back.

Unit of Work (UoW) is a design pattern used to manage multiple database operations as one logical transaction.

In simple terms:

Either all operations succeed and are committed, or if something fails, the transaction can be rolled back.

**Simple example**

Suppose an order process has two operations:
```
Create Order
     ↓
Create Payment
     ↓
Save Changes
```
We have two repositories:

```csharp
IOrderRepository
IPaymentRepository
```
The Unit of Work coordinates both repositories and controls when the changes are saved.

```csharp
public interface IUnitOfWork
{
    IOrderRepository Orders { get; }
    IPaymentRepository Payments { get; }

    Task<int> SaveChangesAsync();
}
```
Implementation:
```csharp
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IOrderRepository Orders { get; }
    public IPaymentRepository Payments { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;

        Orders = new OrderRepository(context);
        Payments = new PaymentRepository(context);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
```
Now the service can do:

```csharp
public async Task CreateOrderAsync(
    Order order,
    Payment payment)
{
    await _unitOfWork.Orders.AddAsync(order);

    await _unitOfWork.Payments.AddAsync(payment);

    await _unitOfWork.SaveChangesAsync();
}
```
Both repositories use the same `DbContext`, and `SaveChangesAsync()` persists their changes together.

**Repository vs Unit of Work**

| Repository                         | Unit of Work                              |
| ---------------------------------- | ----------------------------------------- |
| Handles data access for entities   | Coordinates multiple data operations      |
| Contains queries/CRUD operations   | Controls the save/transaction boundary    |
| Example: `OrderRepository`         | Example: `UnitOfWork`                     |
| Focuses on **what data to access** | Focuses on **when changes are committed** |

Think of it as:

```
            Unit of Work
                 |
       +---------+---------+
       |                   |
OrderRepository     PaymentRepository
       |                   |
       +---------+---------+
                 |
            DbContext
                 |
             Database
```

**Important EF Core interview point**

EF Core's DbContext itself already behaves much like a Unit of Work, while DbSet<T> has repository-like behavior.

```csharp
_context.Orders.Add(order);
_context.Payments.Add(payment);

await _context.SaveChangesAsync();
```
A single `SaveChangesAsync()` is transactional for relational providers under normal conditions.

So you don't always need to create a custom UnitOfWork class.

**Interview answer**

"Unit of Work is a design pattern that coordinates multiple repository operations and maintains them as one logical unit of work. It provides a common SaveChanges or transaction boundary so that related database changes can be committed together or rolled back when necessary. In EF Core, DbContext itself already provides Unit of Work behavior."

Easy way to remember:

**Repository = Data Access**
**Unit of Work = Coordinates repositories + Save/Transaction boundary**

## 52:-Do we need repository pattern as EF does almost the same work?

Note: - This question cannot be answered in black and white, it’s a subjective question and interviewers
can have their own perspective. So, the challenge is if you do not answer from interviewer’s perspective,
he will feel uncomfortable and on the other hand there can be interviewers who would like to get in to
intellectual discussion and understand that do you know both the perspectives.

**Perspective 1 :- Repository pattern is a must**

The first school of thought believes in best practices like loose coupling and unit testing. They
understand the importance of repository pattern that it helps to abstract the Data access layer
(Heterogenous data sources) so that we can change / use different DAL technologies (EF , Dapper ,
ADONET etc.) with ease.

If you are using multiple DAL technologies (heterogenous data sources) and you want plug and play of
DAL in future, repository is a MUST.

Second reason this school also thinks that unit testing is important. Which again is a very compelling
reason you need to have a repository so that you can mock test it easily.

**Perspective 2 :- EF implements Repository not needed**

Myth: - Many developers from this school think that EF implements repository pattern. But that’s not
true. Repository helps you to only abstract RDBMS data source and not other data sources

But if you are only dealing with heterogenous RDBMS then I personally feel repository pattern is overkill.

![Architecture design patterns](/images/design-patterns/repository-pattern1.png)
Now summing the answer from interview perspective.

Comparison of Repository pattern with EF is like comparing apples with oranges because one is Data
access technology while other is a design pattern which focuses on abstraction over heterogenous data
access technologies.

As a good practice it’s always good to use Repository pattern as it creates a higher level of abstraction
over any kind of data source and also makes MOCK UNIT TESTING easy to implement.

After this watch the interviewers reaction if you think he belongs to the second school and if he is
having an ANTI- REPOSITORY mind set then you can just say “Yes , I do agree if we do not have
heterogenous data sources repository pattern can be overkill”.

Note :- One of the key to success during interview is “Satisfying the interviewer that he is RIGHT (The
EGO) ”. That releases a chemical called as dopamine which make him feel good and that can be affect
your interview results in a very positive way.

## 53:-Did you do unit testing with Repository ?

Yes. In an interview, if they ask “Did you do unit testing with Repository Pattern?”, you can explain that the repository abstraction makes the service/business layer easy to unit test by mocking the repository.

Simple example

Suppose we have:

```csharp
public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(int id);
}
```
And a service:

```csharp
public class CustomerService
{
    private readonly ICustomerRepository _repository;

    public CustomerService(ICustomerRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> GetCustomerNameAsync(int id)
    {
        var customer = await _repository.GetByIdAsync(id);

        if (customer == null)
            return "Customer Not Found";

        return customer.Name;
    }
}
```
Now we can unit test CustomerService without connecting to the actual database.

Using xUnit + Moq:

```csharp
[Fact]
public async Task GetCustomerName_ShouldReturnCustomerName()
{
    // Arrange
    var mockRepository = new Mock<ICustomerRepository>();

    mockRepository
        .Setup(x => x.GetByIdAsync(1))
        .ReturnsAsync(new Customer
        {
            Id = 1,
            Name = "Venkat"
        });

    var service = new CustomerService(mockRepository.Object);

    // Act
    var result = await service.GetCustomerNameAsync(1);

    // Assert
    Assert.Equal("Venkat", result);
}
```
Here there is no SQL Server, **no EF Core database call, and no real** `CustomerRepository`. We mock `ICustomerRepository` and control what it returns.

The flow is:

```
Unit Test
   ↓
CustomerService
   ↓
ICustomerRepository
   ↓
Mock Repository
   ✕
No Database
```
We can also test the failure scenario:

```csharp
[Fact]
public async Task GetCustomerName_WhenNotFound_ShouldReturnNotFound()
{
    // Arrange
    var mockRepository = new Mock<ICustomerRepository>();

    mockRepository
        .Setup(x => x.GetByIdAsync(10))
        .ReturnsAsync((Customer?)null);

    var service = new CustomerService(mockRepository.Object);

    // Act
    var result = await service.GetCustomerNameAsync(10);

    // Assert
    Assert.Equal("Customer Not Found", result);
}
```
**What if interviewer asks: “Are you testing the Repository here?”**

Important distinction: No.

In the above test, we're testing the service/business logic by mocking the repository.

If you want to test the actual repository implementation:
```
CustomerRepository
      ↓
EF Core
      ↓
Database
```
that's generally an integration test, where you can use a real test database or an appropriate test provider/container.

**Interview answer**

“Yes. We use repository interfaces to unit test our service layer. For example, using xUnit and Moq, I mock ICustomerRepository, configure expected repository responses, call the service method, and assert the result. This allows us to test business logic without connecting to the actual database. For testing the actual repository and EF Core queries, I prefer integration tests.”

**Key point to remember:**

**Unit Test → Mock Repository → Test Service logic**
**Integration Test → Real Repository → Test database/data-access behavior**

## 54:-How does repository pattern make unit testing easy?

Repository Pattern makes unit testing easier mainly because it separates business logic from actual database access.

1. Eliminating Database Dependencies via MockingIn a tightly coupled application, a service or controller queries the database directly (e.g., using raw SQL or an ORM like Entity Framework). To unit test that service, you would need a spinning database, which transforms your fast unit test into a slow, fragile integration test.

With the repository pattern, you inject an interface (like IUserRepository). During testing, you can use a mocking framework (like Moq, NSubstitute, or unittest.mock) to substitute the real database with a lightweight, fake implementation

- Real App Execution: The service talks to SqlUserRepository → Connects to production SQL Server.

Instead of your service depending directly on DbContext:

```csharp
public class CustomerService
{
    private readonly AppDbContext _context;
}
```
it depends on an interface:

```csharp
public class CustomerService
{
    private readonly ICustomerRepository _repository;

    public CustomerService(ICustomerRepository repository)
    {
        _repository = repository;
    }
}
```
Because ICustomerRepository is an abstraction, during a unit test we can replace the real repository with a **mock repository.**

```csharp
var mockRepo = new Mock<ICustomerRepository>();

mockRepo
    .Setup(x => x.GetByIdAsync(1))
    .ReturnsAsync(new Customer
    {
        Id = 1,
        Name = "Venkat"
    });

var service = new CustomerService(mockRepo.Object);

var result = await service.GetCustomerNameAsync(1);

Assert.Equal("Venkat", result);

```
So the test flow becomes:

```
Production:

Service
   ↓
ICustomerRepository
   ↓
CustomerRepository
   ↓
EF Core
   ↓
Database


Unit Test:

Service
   ↓
ICustomerRepository
   ↓
Mock Repository

(No Database)
```
This makes testing **faster, isolated, predictable, and independent of the database.** You can easily simulate success, not-found results, or exceptions.

Interview answer

“Repository Pattern makes unit testing easier because the business layer depends on a repository interface rather than directly on the database or DbContext. During unit testing, we can mock the repository using tools such as Moq and test the business logic without connecting to a real database.”

One important distinction: we are usually mocking the repository to unit-test the service. Testing the actual repository and its EF Core queries is generally an integration test.

## 55:-How can we do mock testing with Repository?

Note: - All the above flavor of questions stresses the importance of unit testing and mock testing in
repository. Interviewer would like to know that do you understand the importance of unit testing in
repository.

Repository pattern is a higher level of abstraction over Data access logic. And this Abstraction is
represented by EMPTY GENERIC INTERFACE. Because of this generic Interfaces unit testing is like a cake
walk.

The ONE big benefit of doing unit testing on Empty interface is ISOLATED MOCK UNIT Testing. Mock Unit
testing has two primary uses: -

- Unit testing by passing Data access Logic: - Many times you want to only test business logic and not the data access part. With repository this is like a cake walk.

- Parallel Development and Testing: - Many times data access is developed by some other team , so either they have not completed the code or are in between and you want to still test your part of the code , repository is the answer for it.

You can do **mock testing with Repository Pattern** by mocking the repository interface and injecting that mock into the service you want to test.

The key point is:

We do not mock the database. We mock the repository interface.

Suppose you have this repository:
```csharp
public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(int id);
    Task<List<Customer>> GetAllAsync();
}
```
And your service depends on it:

```csharp
public class CustomerService
{
    private readonly ICustomerRepository _repository;

    public CustomerService(ICustomerRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> GetCustomerNameAsync(int id)
    {
        var customer = await _repository.GetByIdAsync(id);

        if (customer == null)
            return "Customer Not Found";

        return customer.Name;
    }
}
```
Now in the unit test, use Moq:

```csharp
[Fact]
public async Task GetCustomerName_ShouldReturnCustomerName()
{
    // Arrange
    var mockRepository = new Mock<ICustomerRepository>();

    mockRepository
        .Setup(x => x.GetByIdAsync(1))
        .ReturnsAsync(new Customer
        {
            Id = 1,
            Name = "Venkat"
        });

    var service = new CustomerService(mockRepository.Object);

    // Act
    var result = await service.GetCustomerNameAsync(1);

    // Assert
    Assert.Equal("Venkat", result);
}
```
What happens here is:
```
CustomerService
      ↓
ICustomerRepository
      ↓
Mock Repository
      ↓
Returns fake Customer

No SQL Server
No EF Core query
No real database
```
You can also test a not found case:
```csharp
[Fact]
public async Task GetCustomerName_WhenCustomerNotFound_ShouldReturnNotFound()
{
    // Arrange
    var mockRepository = new Mock<ICustomerRepository>();

    mockRepository
        .Setup(x => x.GetByIdAsync(100))
        .ReturnsAsync((Customer?)null);

    var service = new CustomerService(mockRepository.Object);

    // Act
    var result = await service.GetCustomerNameAsync(100);

    // Assert
    Assert.Equal("Customer Not Found", result);
}
```
You can also verify that a repository method was called:
```csharp
mockRepository.Verify(
    x => x.GetByIdAsync(1),
    Times.Once);
```

Interview answer

"For mock testing with Repository Pattern, I mock the repository interface using a framework like Moq. I configure the expected return value using Setup, inject the mocked repository into the service, execute the service method, and assert the result. This allows me to test business logic without connecting to a real database."

A simple interview flow to remember is:

```
Arrange
  ↓
Create Mock Repository
  ↓
Setup Expected Response
  ↓
Inject Mock into Service

Act
  ↓
Call Service Method

Assert
  ↓
Check Result
  ↓
Optionally Verify Repository Call
```
One important distinction: **mocking the repository tests the service layer.** Testing the real repository itself is normally an **integration test.**