---
id: unit-test-001
slug: unit-unit-basic
categoryId: unit-test
subcategory: unit-test-basic-questions
difficulty: Basic
title: C# / .NET Unit Testing Interview Preparation
description: Real-interview-style unit testing questions and answers for C#, ASP.NET Core, xUnit and Moq.
tags: [C#,Unit Test,xUnit, Moq, Mock]
updatedAt: 2026-09-09
status: published
thumbnail: ""
videos: []
resources: []
---


# C# / .NET Unit Testing Interview Preparation

> **How to use this page:** Read each question as if the interviewer
> asked it. First try answering aloud, then compare your answer with the
> interview-ready response and code.

## 1. What is Unit Testing, and why is it important in .NET applications?

**Interviewer:** What is unit testing?

**Candidate:** Unit testing is testing the smallest independently
testable piece of application logic---usually a method or class---in
isolation from external dependencies such as databases, APIs, file
systems, queues, and email services.

A good unit test should be **fast, isolated, repeatable, deterministic,
and easy to understand**. In .NET, common test frameworks include xUnit,
NUnit, and MSTest.

The main benefits are early defect detection, safer refactoring,
executable documentation of expected behavior, and better application
design because testable code normally has clear responsibilities and
loosely coupled dependencies.

**Interview line:**
"A unit test validates one unit of behavior in isolation. I replace
external dependencies with test doubles so failures point to the
business logic being tested."

------------------------------------------------------------------------

## 2. How does Dependency Injection make a class easier to unit test? (Hexaware)

**Interviewer:** You mentioned Dependency Injection. How does DI help
with unit testing?

**Candidate:** Dependency Injection makes a class depend on abstractions
instead of constructing concrete dependencies internally. During
production, the DI container injects the real implementation. During a
unit test, I can inject a mock or fake implementation.

``` csharp
public interface IBookRepository
{
    Task<Book?> GetByIdAsync(int id);
}

public class BookService
{
    private readonly IBookRepository _repository;

    public BookService(IBookRepository repository)
    {
        _repository = repository;
    }

    public Task<Book?> GetBookAsync(int id)
        => _repository.GetByIdAsync(id);
}
```

The service does not create `BookRepository` or `AppDbContext`.
Therefore the test can supply a mocked `IBookRepository` and run without
a real database.

**Interview line:**

 "DI improves testability because I can replace a real dependency with
a test double without changing the class under test."

**Follow-up:** What happens if the class creates the repository with
`new BookRepository()`?

**Candidate:** The class becomes tightly coupled to that implementation.
Mocking or replacing the repository becomes difficult, so I would
normally inject the dependency through the constructor.

------------------------------------------------------------------------

## 3. How would you mock a repository/database dependency while unit testing a service? (Hexaware)

**Interviewer:** Your service depends on `IBookRepository`. Write a test
without accessing SQL Server.

**Candidate:** I mock the repository interface and configure the
expected result. The unit test then tests only `BookService`.

``` csharp
using Moq;
using Xunit;

public class BookServiceTests
{
    [Fact]
    public async Task GetBookAsync_WhenBookExists_ReturnsBook()
    {
        // Arrange
        var repository = new Mock<IBookRepository>();

        repository
            .Setup(r => r.GetByIdAsync(10))
            .ReturnsAsync(new Book { Id = 10, Title = "Clean Code" });

        var service = new BookService(repository.Object);

        // Act
        var result = await service.GetBookAsync(10);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(10, result.Id);
        Assert.Equal("Clean Code", result.Title);
    }
}
```

No SQL Server is contacted. The mock controls the repository response,
which keeps the test fast and deterministic.

**Follow-up:** Why mock the interface rather than `DbContext` directly?

**Candidate:** At the service layer I prefer mocking the service's
abstraction, such as `IBookRepository`. Database query behavior itself
is better covered separately with integration tests when appropriate.

------------------------------------------------------------------------

## 4. What is the difference between a Mock, Stub and Fake?

**Interviewer:** Explain Mock, Stub, and Fake.

**Candidate:** They are test doubles, but their purposes differ.

| Test Double | Purpose                                        | Example                                        |
| ----------- | ---------------------------------------------- | ---------------------------------------------- |
| **Stub**    | Returns predefined data                        | Repository always returns a particular book    |
| **Mock**    | Allows expectations / interaction verification | Verify `SendEmailAsync()` was called once      |
| **Fake**    | Working but simplified implementation          | In-memory repository instead of SQL repository |



A **stub** mainly controls inputs to the unit under test. A **mock** is
useful when interaction with a dependency is itself part of the behavior
being verified. A **fake** has a lightweight working implementation.

**Interview line:**
"Stub for canned responses, mock for interaction verification, fake
for a simplified working implementation."

------------------------------------------------------------------------

## 5. What is the difference between xUnit, NUnit and MSTest?

**Interviewer:** Which unit testing framework do you use?

**Candidate:** xUnit, NUnit, and MSTest are all .NET testing frameworks.
The core concepts are similar; syntax and lifecycle features differ.
| Feature                | xUnit                               | NUnit        | MSTest                               |
| ---------------------- | ----------------------------------- | ------------ | ------------------------------------ |
| **Basic Test**         | `[Fact]`                            | `[Test]`     | `[TestMethod]`                       |
| **Parameterized Test** | `[Theory]`                          | `[TestCase]` | `[DataTestMethod]` / Data Attributes |
| **Test Setup**         | Constructor commonly used for setup | `[SetUp]`    | `[TestInitialize]`                   |

For modern .NET projects I am comfortable with xUnit, but the important
skill is writing isolated and maintainable tests rather than depending
on one framework.

------------------------------------------------------------------------

## 6. How do you use Moq to mock an interface?

**Interviewer:** Show me the basic Moq syntax.

**Candidate:**

``` csharp
var repo = new Mock<IBookRepository>();

repo.Setup(x => x.GetByIdAsync(1))
    .ReturnsAsync(new Book
    {
        Id = 1,
        Title = "DDD"
    });

var service = new BookService(repo.Object);

var result = await service.GetBookAsync(1);

Assert.Equal("DDD", result!.Title);
```

`Mock<T>` creates the mock, `Setup()` defines behavior, `ReturnsAsync()`
supplies the asynchronous result, and `.Object` gives the mocked
implementation to the class under test.

------------------------------------------------------------------------

## 7. What is Arrange-Act-Assert (AAA)?

**Interviewer:** How do you normally structure a unit test?

**Candidate:** I normally use **Arrange, Act, Assert**.

``` csharp
[Fact]
public void Add_TwoNumbers_ReturnsSum()
{
    // Arrange
    var calculator = new Calculator();

    // Act
    var result = calculator.Add(10, 20);

    // Assert
    Assert.Equal(30, result);
}
```

**Arrange** creates inputs and dependencies. **Act** executes the
behavior. **Assert** verifies the outcome. This makes the intention of
the test immediately visible.

------------------------------------------------------------------------

## 8. What is the difference between Assert.Equal(), Assert.True() and Assert.Throws()?

**Interviewer:** When would you use these assertions?

**Candidate:** `Assert.Equal()` compares expected and actual values.
`Assert.True()` verifies a Boolean condition. `Assert.Throws<T>()`
verifies that synchronous code throws a particular exception.

``` csharp
Assert.Equal(100, result);
Assert.True(customer.IsActive);

var ex = Assert.Throws<ArgumentException>(
    () => service.CreateCustomer("")
);

Assert.Equal("Name is required", ex.Message);
```

For asynchronous exceptions in xUnit, I use `Assert.ThrowsAsync<T>()`.

------------------------------------------------------------------------

## 9. How do you unit test an async/await method?

**Interviewer:** Your service is asynchronous. How will you test it?

**Candidate:** The test itself should normally return `Task` and `await`
the asynchronous operation.

``` csharp
[Fact]
public async Task GetBookAsync_WhenBookExists_ReturnsExpectedBook()
{
    var repo = new Mock<IBookRepository>();

    repo.Setup(x => x.GetByIdAsync(5))
        .ReturnsAsync(new Book { Id = 5, Title = "Azure" });

    var service = new BookService(repo.Object);

    var result = await service.GetBookAsync(5);

    Assert.NotNull(result);
    Assert.Equal("Azure", result.Title);
}
```

I avoid `.Result` and `.Wait()` in asynchronous tests. Awaiting the task
gives correct exception propagation and matches production asynchronous
flow.

------------------------------------------------------------------------

## 10. How do you test that a dependency method was called exactly once using Moq?

**Interviewer:** Suppose placing an order must send one notification.
How do you verify that?

**Candidate:** I use `Verify()` with `Times.Once`.

``` csharp
var notifier = new Mock<INotificationService>();

var service = new OrderService(notifier.Object);

await service.PlaceOrderAsync(order);

notifier.Verify(
    x => x.SendOrderConfirmationAsync(order.Id),
    Times.Once);
```

I use interaction verification when the interaction is an important
observable behavior. I avoid verifying every internal call because that
can make tests brittle.

------------------------------------------------------------------------

## 11. How do Setup(), Returns(), ReturnsAsync() and ThrowsAsync() work in Moq?

**Interviewer:** Explain common Moq setup methods.

**Candidate:**

``` csharp
mock.Setup(x => x.GetName(1))
    .Returns("Rohit");

mock.Setup(x => x.GetBookAsync(1))
    .ReturnsAsync(book);

mock.Setup(x => x.SaveAsync(It.IsAny<Book>()))
    .ThrowsAsync(new InvalidOperationException("Save failed"));
```

`Setup()` identifies the member call. `Returns()` supplies a synchronous
result. `ReturnsAsync()` supplies the result for an async method.
`ThrowsAsync()` simulates an asynchronous failure.

`It.IsAny<T>()` is useful when the exact argument is not important,
while `It.Is<T>(predicate)` lets me verify specific argument properties.

------------------------------------------------------------------------

## 12. What is the difference between Unit Testing and Integration Testing?

**Interviewer:** Unit test versus integration test?

**Candidate:**

| Unit Test                               | Integration Test                                        |
| --------------------------------------- | ------------------------------------------------------- |
| Tests a small unit of behavior          | Tests components working together                       |
| External dependencies normally replaced | Often uses real infrastructure or realistic substitutes |
| Very fast                               | Usually slower                                          |
| Failure is highly localized             | Failure can span integration boundaries                 |
| Run in large numbers                    | Usually fewer than unit tests                           |


For example, testing `BookService` with a mocked `IBookRepository` is a
unit test. Testing an EF Core repository against an actual test database
is an integration test.

**Interview line:**
 "Unit tests prove isolated business behavior; integration tests prove
that boundaries and components work together."

------------------------------------------------------------------------

## 13. Should you unit test private methods?

**Interviewer:** How do you unit test a private method?

**Candidate:** Normally I don't test private methods directly. I test
them through the public behavior of the class. A private method is an
implementation detail.

If a private method becomes very complex and needs many direct tests,
that can indicate that the logic should be extracted into another class
with a clear responsibility and tested through its public API.

------------------------------------------------------------------------

## 14. How do you unit test an ASP.NET Core Controller without calling the database?

**Interviewer:** Show a controller unit test.

**Candidate:** I mock the service used by the controller.

``` csharp
[Fact]
public async Task Get_WhenBookExists_ReturnsOk()
{
    // Arrange
    var service = new Mock<IBookService>();

    service.Setup(x => x.GetByIdAsync(1))
           .ReturnsAsync(new BookDto
           {
               Id = 1,
               Title = "Microservices"
           });

    var controller = new BooksController(service.Object);

    // Act
    var result = await controller.Get(1);

    // Assert
    var ok = Assert.IsType<OkObjectResult>(result);
    var book = Assert.IsType<BookDto>(ok.Value);

    Assert.Equal(1, book.Id);
}
```

This verifies the controller's behavior without SQL Server, EF Core, or
an HTTP server.

------------------------------------------------------------------------

## 15. How do you unit test code that uses HttpClient?

**Interviewer:** Can you mock `HttpClient` directly?

**Candidate:** Instead of mocking the high-level `HttpClient` methods,
one common approach is to control its `HttpMessageHandler`, because
`HttpClient` sends requests through the handler. Another design is to
hide the external API behind an application-specific interface and mock
that interface when testing business logic.

Example concept:

``` csharp
public interface IWeatherClient
{
    Task<WeatherDto> GetWeatherAsync(string city);
}

public class TravelService
{
    private readonly IWeatherClient _weather;

    public TravelService(IWeatherClient weather)
    {
        _weather = weather;
    }
}
```

Then a `TravelService` unit test mocks `IWeatherClient`. Separate tests
can verify the HTTP adapter itself.

**Interview line:**
"I isolate HTTP behind a boundary. Business tests mock that boundary;
HTTP-specific tests exercise the client/handler behavior separately."

------------------------------------------------------------------------

## 16. How do you test exceptions?

**Interviewer:** How would you test validation that throws an exception?

**Candidate:**

``` csharp
[Fact]
public void Withdraw_WhenAmountExceedsBalance_Throws()
{
    var account = new BankAccount(balance: 100);

    var ex = Assert.Throws<InvalidOperationException>(
        () => account.Withdraw(150));

    Assert.Equal("Insufficient balance", ex.Message);
}
```

For asynchronous code:

``` csharp
await Assert.ThrowsAsync<InvalidOperationException>(
    () => service.ProcessAsync());
```

I verify the exception type and, when it is part of the contract,
important details such as the message or error information.

------------------------------------------------------------------------

## 17. What is parameterized testing?

**Interviewer:** You need to test many inputs. Will you create ten test
methods?

**Candidate:** Not necessarily. If the behavior is the same for
different inputs, I can use a parameterized test. In xUnit I use
`[Theory]` with data.

``` csharp
[Theory]
[InlineData(2, 2, 4)]
[InlineData(10, 5, 15)]
[InlineData(-1, 1, 0)]
public void Add_WithDifferentInputs_ReturnsExpected(
    int a, int b, int expected)
{
    var calculator = new Calculator();

    var result = calculator.Add(a, b);

    Assert.Equal(expected, result);
}
```

This reduces duplication while making the input/output cases explicit.

------------------------------------------------------------------------

## 18. What makes a good unit test?

**Interviewer:** What qualities do you look for in a good unit test?

**Candidate:** A good unit test should be fast, deterministic, isolated,
readable, maintainable, and focused on one behavior. It should not
depend on execution order or shared mutable state.

I also give tests descriptive names such as:

``` text
MethodName_Scenario_ExpectedResult
```

For example:

``` text
Withdraw_WhenBalanceIsInsufficient_ThrowsInvalidOperationException
```

The name tells the reader what behavior failed without first reading the
implementation.

------------------------------------------------------------------------

## 19. What makes code difficult to unit test?

**Interviewer:** What code smells make testing difficult?

**Candidate:** Common problems are hard-coded dependencies,
static/global state, hidden side effects, classes with too many
responsibilities, direct calls to databases or external APIs throughout
business logic, nondeterministic access to time or randomness, and
tightly coupled object creation.

For example, this is difficult to isolate:

``` csharp
public void PlaceOrder(Order order)
{
    var repository = new SqlOrderRepository();
    repository.Save(order);

    var sender = new EmailSender();
    sender.Send(order.CustomerEmail);
}
```

A more testable design injects abstractions:

``` csharp
public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly IEmailSender _emailSender;

    public OrderService(
        IOrderRepository repository,
        IEmailSender emailSender)
    {
        _repository = repository;
        _emailSender = emailSender;
    }
}
```

Now both external dependencies can be replaced during unit testing.

------------------------------------------------------------------------

## 20. Senior Scenario: How would you design and test an order service?

**Interviewer:** An order service saves an order and sends a
confirmation email. The email must not be sent if saving fails. How
would you test it?

**Candidate:** I would inject `IOrderRepository` and `IEmailSender`. I
would test both the successful path and the failure path.

``` csharp
[Fact]
public async Task PlaceOrder_WhenSaveSucceeds_SendsEmailOnce()
{
    var repository = new Mock<IOrderRepository>();
    var email = new Mock<IEmailSender>();

    repository
        .Setup(x => x.SaveAsync(It.IsAny<Order>()))
        .Returns(Task.CompletedTask);

    var service = new OrderService(
        repository.Object,
        email.Object);

    var order = new Order { Id = 100 };

    await service.PlaceOrderAsync(order);

    repository.Verify(
        x => x.SaveAsync(order),
        Times.Once);

    email.Verify(
        x => x.SendConfirmationAsync(order),
        Times.Once);
}

[Fact]
public async Task PlaceOrder_WhenSaveFails_DoesNotSendEmail()
{
    var repository = new Mock<IOrderRepository>();
    var email = new Mock<IEmailSender>();

    repository
        .Setup(x => x.SaveAsync(It.IsAny<Order>()))
        .ThrowsAsync(new Exception("Database unavailable"));

    var service = new OrderService(
        repository.Object,
        email.Object);

    var order = new Order { Id = 100 };

    await Assert.ThrowsAsync<Exception>(
        () => service.PlaceOrderAsync(order));

    email.Verify(
        x => x.SendConfirmationAsync(It.IsAny<Order>()),
        Times.Never);
}
```

**Interviewer follow-up:** What is the most important assertion in the
second test?

**Candidate:** `Times.Never`. The business requirement says no
confirmation should be sent when persistence fails, so I explicitly
verify that side effect did not occur.

**Interview line:**
"For important workflows I test both positive and negative
interactions---not only what must happen, but also what must never
happen."

------------------------------------------------------------------------

# Rapid Revision

Before an interview, make sure you can explain aloud:

-   Unit test vs integration test
-   Arrange / Act / Assert
-   Dependency Injection and testability
-   Mock vs Stub vs Fake
-   xUnit `[Fact]` vs `[Theory]`
-   Moq `Setup`, `ReturnsAsync`, `Verify`, `Times.Once`, `Times.Never`
-   Testing async methods and exceptions
-   Controller/service testing without a real database
-   Why private methods normally aren't tested directly
-   How to isolate external HTTP APIs
-   Characteristics of a good unit test
-   How to redesign tightly coupled code for testability

## Source Note

The supplied Hexaware AI Round material explicitly identifies
**Dependency Injection --- concept, implementation, benefits** as an
interview topic and states that a benefit of DI is **testability: mock
the interface in unit tests, no real DB needed**. The additional
detailed unit-testing questions and examples on this page are expanded
interview-preparation material; they are not claimed to have all
appeared in the supplied interview source.
