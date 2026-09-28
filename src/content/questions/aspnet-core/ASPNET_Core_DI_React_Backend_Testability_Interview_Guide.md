---
id: aspnet-react-008
slug:  Dependency Injection in ASP.NET Core for a React-Facing API
title: Dependency Injection in ASP.NET Core for a React-Facing API
categoryId: aspnet-core
subcategory: AspNet_React
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Dependency Injection
  - React-Facing API
  - aspnet-core
summary: Dependency Injection in ASP.NET Core for a React-Facing API
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---

# Interview Guide: Dependency Injection in ASP.NET Core for a React-Facing API

## Interview question

**How would you use dependency injection in .NET Core to ensure your backend services are testable and maintainable when collaborating with a React front-end?**

> In a modern web application, the backend is usually an **ASP.NET Core API**. React does not participate in the .NET DI container; the teams collaborate through an HTTP contract. DI makes the implementation behind that contract easier to change and test.

## Strong 90-second interview answer

> I would keep controllers thin: they handle HTTP concerns, authentication context, request validation and response mapping, then delegate business operations to application services. I would inject the actual boundaries those services need, such as a repository or EF Core context, a clock, an email or notification gateway, and an external API client. Registrations live at the application composition root in `Program.cs`, so production infrastructure can be replaced with fakes or controlled infrastructure in tests.
>
> I choose lifetimes deliberately: EF Core `DbContext` and request-oriented business services are typically scoped, stateless helpers may be transient, and thread-safe configuration or shared caches may be singleton. I avoid a singleton holding a scoped context or tenant-specific state. For third-party calls I use `IHttpClientFactory` or typed clients, and I bind configuration through options. I unit-test domain decisions with test doubles and run API integration tests with `WebApplicationFactory` to verify routing, authorization, validation and the JSON/error contract that React consumes.
>
> I would agree with the React team on DTOs, status codes, pagination and error shapes, publish an OpenAPI contract and maintain contract tests. That means I can change a database or notification provider without changing the UI, while a deliberate API contract change is visible and reviewed.

## 1. Design layers with a clear dependency direction

```text
React UI ──HTTP/JSON──> ASP.NET Core controller
                          │
                          ▼
                   Application service
                    │             │
                    ▼             ▼
              Data boundary   External gateway
                    │             │
                    ▼             ▼
                 Database      Email/HTTP/Blob
```

- **Controller:** authorization policy/identity, transport DTO, HTTP status and problem response. It should not contain complex business logic.
- **Application service:** use case, validation beyond the basic request shape, transaction coordination and result mapping.
- **Domain:** invariants and policy that should hold regardless of whether a request comes from React, a background worker or another API.
- **Infrastructure:** EF Core, storage, external APIs, messaging and the actual implementations of boundaries.

The React team should know the API's request and response contract, not how the backend constructs dependencies. A dependency diagram is useful when deciding what needs a seam for tests or a future provider change.

## 2. Inject meaningful boundaries, not an interface for every class

Use constructor injection for required dependencies. Put interfaces at real boundaries: a service whose behavior must be replaced in tests, an external system, or a domain capability with multiple implementations. A tiny deterministic calculation may simply be a concrete class or pure function.

### Example: study creation use case

```csharp
public sealed record CreateStudyCommand(
    string TenantId, string Title, DateOnly StartDate, DateOnly EndDate);

public sealed record CreateStudyResult(Guid Id, string Title);

public interface IStudyRepository
{
    Task AddAsync(Study study, CancellationToken cancellationToken);
    Task<Study?> FindByIdAsync(Guid id, string tenantId,
        CancellationToken cancellationToken);
}

public interface INotificationGateway
{
    Task StudyCreatedAsync(Guid studyId, string tenantId,
        CancellationToken cancellationToken);
}

public interface IStudyService
{
    Task<CreateStudyResult> CreateAsync(
        CreateStudyCommand command, CancellationToken cancellationToken);
}

public sealed class StudyService : IStudyService
{
    private readonly IStudyRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationGateway _notifications;
    private readonly TimeProvider _clock;

    public StudyService(
        IStudyRepository repository,
        IUnitOfWork unitOfWork,
        INotificationGateway notifications,
        TimeProvider clock)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _notifications = notifications;
        _clock = clock;
    }

    public async Task<CreateStudyResult> CreateAsync(
        CreateStudyCommand command, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(command.Title))
            throw new StudyValidationException("Title is required.");
        if (command.EndDate < command.StartDate)
            throw new StudyValidationException("End date precedes start date.");

        var study = new Study(
            Guid.NewGuid(), command.TenantId, command.Title.Trim(),
            command.StartDate, command.EndDate,
            _clock.GetUtcNow());

        await _repository.AddAsync(study, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _notifications.StudyCreatedAsync(
            study.Id, command.TenantId, cancellationToken);

        return new CreateStudyResult(study.Id, study.Title);
    }
}
```

`Study`, `IUnitOfWork` and `StudyValidationException` are domain/application types omitted for brevity. The example emphasizes dependency boundaries, not a copy-paste complete project. **Production reliability caveat:** saving the study and sending a notification cannot form a single transaction merely because both calls appear in one method. If notification delivery must be reliable, persist an outbox message with the database transaction and let a worker deliver it idempotently.

If using EF Core directly in the application service is acceptable for the project, injecting a scoped `AppDbContext` can be simpler than a repository that merely forwards `DbSet` calls. DI does not require a generic repository layer.

## 3. Register dependencies in `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("StudiesDb")));

builder.Services.AddScoped<IStudyRepository, EfStudyRepository>();
builder.Services.AddScoped<IUnitOfWork, EfUnitOfWork>();
builder.Services.AddScoped<IStudyService, StudyService>();
builder.Services.AddScoped<INotificationGateway, QueueNotificationGateway>();

builder.Services.AddSingleton(TimeProvider.System);

builder.Services.AddOptions<ExternalApiOptions>()
    .Bind(builder.Configuration.GetSection("ExternalApi"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddHttpClient<ExternalStudyClient>((provider, client) =>
{
    var options = provider.GetRequiredService<
        Microsoft.Extensions.Options.IOptions<ExternalApiOptions>>().Value;
    client.BaseAddress = new Uri(options.BaseUrl);
});

var app = builder.Build();
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program { } // convenient entry point for WebApplicationFactory<Program>
```

The snippet assumes the relevant EF Core provider, authentication, implementations, and option type are supplied elsewhere. Configure authentication before relying on `UseAuthentication()`. Keep secrets in a secure configuration source, not committed `appsettings.json`. Fail-fast options validation catches missing configuration early; it does not replace runtime validation of external responses.

**Where does DI happen?** ASP.NET Core builds the service provider from `builder.Services`. It creates a scope per HTTP request; the controller asks for `IStudyService`, whose constructor asks for the other registered dependencies. The controller does not use `new StudyService(...)` or look up services manually.

## 4. Choose lifetimes correctly

| Lifetime | Typical example | Key concern |
| --- | --- | --- |
| Transient | Lightweight stateless formatter/mapper | New instance at resolution; avoid expensive, unmanaged state |
| Scoped | EF Core `DbContext`, use-case service, repository | Same instance within an HTTP request scope; not safe to share across concurrent requests |
| Singleton | Immutable lookup/configuration, thread-safe shared service, `TimeProvider.System` | Must be thread-safe and must not capture scoped dependencies |

A singleton that takes `AppDbContext` through its constructor creates a **captive dependency**. Scope validation should catch this in development. For a background `IHostedService` (typically singleton) that needs scoped data access, create a scope per work item via `IServiceScopeFactory`, then resolve the scoped service inside that scope. Do not resolve scoped services from the root provider or store a request-specific service in a static field.

**Typed `HttpClient` nuance:** factory-managed typed clients are generally short-lived. Do not hold one in a singleton for a long time without considering DNS/handler lifecycle and the factory guidance. Keep transient outbound request headers (especially user/tenant tokens) request-specific rather than mutating a shared default header collection.

## 5. Thin controller and stable React-facing contract

```csharp
[ApiController]
[Route("api/studies")]
[Authorize]
public sealed class StudiesController : ControllerBase
{
    private readonly IStudyService _studies;

    public StudiesController(IStudyService studies) => _studies = studies;

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateStudyRequest request, CancellationToken cancellationToken)
    {
        var tenantId = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantId)) return Forbid();

        var result = await _studies.CreateAsync(
            new CreateStudyCommand(
                tenantId, request.Title, request.StartDate, request.EndDate),
            cancellationToken);

        return Created($"/api/studies/{result.Id}",
            new StudyResponse(result.Id, result.Title));
    }
}

public sealed record CreateStudyRequest(
    string Title, DateOnly StartDate, DateOnly EndDate);
public sealed record StudyResponse(Guid Id, string Title);
```

The snippet assumes request validation, exception-to-problem mapping, authorization and a trusted tenant claim are configured. In production, check the resource-level permission as well. A body-provided `TenantId` or `IsApproved` must not be trusted just because it matches a DTO property.

### Agree on the contract with React

| Contract element | Example |
| --- | --- |
| Endpoint and method | `POST /api/studies` |
| Request DTO | `title`, `startDate`, `endDate` |
| Success | `201 Created` and `StudyResponse` |
| Validation error | `400 ValidationProblemDetails` with field keys |
| Conflict | Documented `409` with stable code and guidance |
| Authentication/authorization | `401` and `403` semantics |
| Cancellation and retries | Idempotency strategy for writes; client abort when navigating |

Publish OpenAPI and generate TypeScript types/clients if helpful. Generated types improve compile-time alignment, but server contract tests and runtime error handling remain necessary. Avoid exposing EF entities or changing JSON because an internal service implementation changed.

## 6. Test application behavior with replacements

Constructor injection makes a pure use-case test straightforward: supply fake repository/unit of work, a fake notification gateway and a deterministic clock. Verify observable behavior and invariants, not the fact that a constructor received an interface.

```csharp
[Fact]
public async Task CreateAsync_rejects_end_date_before_start_date()
{
    var service = new StudyService(
        new FakeStudyRepository(),
        new FakeUnitOfWork(),
        new FakeNotificationGateway(),
        new FakeTimeProvider());

    var command = new CreateStudyCommand(
        "tenant-1", "Phase III study",
        new DateOnly(2026, 10, 10),
        new DateOnly(2026, 10, 1));

    await Assert.ThrowsAsync<StudyValidationException>(
        () => service.CreateAsync(command, CancellationToken.None));
}
```

The fakes and `FakeTimeProvider` are illustrative test helpers. Other useful service tests: normalized title, correct tenant context, save called once, notification scheduled only after a successful save, cancellation propagation and provider errors. For outbox behavior, test the persisted study and outbox record together rather than asserting an immediate external call.

**Avoid overmocking EF Core:** mocking `DbSet` query behavior can give misleading confidence. Test real EF queries, constraints and transactions with integration tests against a realistic provider, especially when production uses PostgreSQL or SQL Server. A different in-memory provider may not reproduce relational behavior.

## 7. Verify the actual HTTP boundary

Use `WebApplicationFactory<Program>` for API integration tests. Replace selected dependencies through `ConfigureTestServices`, use a test database or isolated infrastructure where needed, and issue real HTTP requests against the test host.

```csharp
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

using var factory = new WebApplicationFactory<Program>()
    .WithWebHostBuilder(builder =>
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<INotificationGateway>();
            services.AddScoped<INotificationGateway, FakeNotificationGateway>();
            // Also configure test authentication and an isolated test database.
        }));

using var client = factory.CreateClient();
// POST a study request and assert status, JSON shape, validation and auth behavior.
```

The example intentionally leaves test authentication/database setup to the application's real configuration. Integration checks should cover: unauthorized requests, invalid DTOs and `ValidationProblemDetails`, tenant isolation, success response, database uniqueness and a dependency failure mapped to a safe API error. This is what proves the contract works for React, beyond isolated service tests.

React should also have a small number of tests for mapping validation errors and loading states. Contract or end-to-end tests can verify one real request/response path between the UI and API.

## 8. DI patterns for production maintainability

- **Options pattern:** inject `IOptions<T>` for stable configuration, or `IOptionsMonitor<T>` only when reload is actually needed. Validate values at startup.
- **Typed or named HTTP clients:** configure base URLs, timeouts and handlers centrally; test integration via a replaceable HTTP handler or fake gateway. Keep retry policies safe for the operation's idempotency.
- **Logging and tracing:** inject `ILogger<T>` and propagate correlation/trace information without leaking sensitive request data.
- **Background work:** enqueue work rather than capturing a scoped controller/service inside a singleton hosted worker; create a scope per job.
- **Feature-specific boundaries:** `IBlobStore`, `IEmbeddingGenerator`, `INotificationGateway` and similar ports are useful when they represent actual external dependencies. Do not add an interface solely to make a one-line helper mockable.
- **Composition root:** group registrations into clear extension methods by feature, but keep ownership of lifetimes and configuration visible. Do not call `BuildServiceProvider()` during registration to resolve dependencies; it can create a second container and duplicate singletons.
- **Avoid service locator:** request dependencies through constructors or supported framework injection, not arbitrary `IServiceProvider.GetService` calls throughout business code.

## Practical scenario: React clinical authoring app

For a protocol-authoring workspace, React calls endpoints for studies, sections, source search and workflow. An `ISectionAuthoringService` coordinates section rules, a scoped EF Core context/repository persists drafts, an `ISourceSearchClient` queries Azure AI Search, and an `IAuditWriter` records changes. A background worker handles document processing and creates its own scope per job. The UI sees stable DTOs and a documented problem-response shape whether search is backed by a live Azure service or a deterministic fake in a test. A reviewer-permission rule stays on the server even if React hides the Approve button.

## Experienced follow-up questions

**Scoped versus transient for an application service?** A stateless service can be transient, but if it depends on a scoped `DbContext`, registering it scoped often makes request ownership explicit. The main rule is that no longer-lived service captures a shorter-lived dependency.

**Do you need a repository interface when EF Core already has `DbContext`?** Not automatically. Injecting `DbContext` directly into an application service is reasonable. Introduce a repository when it expresses a useful domain boundary or isolates complex queries, not just to mirror every EF method.

**How does DI help the React team?** It keeps backend implementation changes behind the same HTTP contract and makes API behavior testable. React never sees the container; OpenAPI, DTOs, statuses and error formats are the collaboration boundary.

**What happens if a singleton needs tenant data?** Do not retain request-specific tenant state in a singleton. Pass the tenant ID to a method, use a scoped service within a request, or create a scope for a background job and load its tenant context explicitly.

**How would you test an external API failure?** Replace the gateway/HTTP handler to simulate timeout, non-success response and malformed payload in service tests, then use an API integration test to confirm the safe response and correlation. Verify retry policy does not duplicate a non-idempotent command.

**What does `WebApplicationFactory` add over unit tests?** It exercises routing, middleware, DI registration, authentication configuration, model binding, filters and JSON serialization. Unit tests exercise business decisions faster and with narrower failure scope; both have distinct value.

**Could you use `new` anywhere?** Yes, for local value objects and implementation details. DI is for dependencies whose lifetime, configuration or replacement belongs to the application, not a ban on constructors.

## Common mistakes

- Putting business rules and `new DbContext()` inside controllers.
- Registering `DbContext` or tenant state as a singleton.
- Creating dozens of one-to-one interfaces with no meaningful boundary.
- Mocking every EF query instead of verifying real SQL behavior.
- Sending internal EF entities directly to React.
- Using `BuildServiceProvider()` inside registration or resolving services manually throughout the codebase.
- Assuming a mocked service test verifies routing, auth or JSON response shape.
- Making external side effects after a database commit without an outbox or other failure strategy when reliable delivery is required.

## Closing statement

> DI lets me keep use cases independent of infrastructure, pick safe lifetimes, and replace external boundaries in tests. The React team benefits through a stable, verified API contract: we can change the backend implementation confidently while preserving predictable requests, responses and errors.

## Official references

- [ASP.NET Core dependency injection](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection)
- [.NET service lifetimes](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/service-lifetimes)
- [.NET dependency injection guidelines](https://learn.microsoft.com/dotnet/core/extensions/dependency-injection/guidelines)
- [ASP.NET Core integration tests](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests)
- [`IHttpClientFactory`](https://learn.microsoft.com/en-us/dotnet/core/extensions/httpclient-factory)
