---
id: design-patterns-CQRS-pattern
slug: CQRS-pattern
title: "CQRS Pattern Detailed Interview Preparation Guide"
categoryId: design-patterns
subcategory: CQRS pattern-basics
difficulty: Basic
tags:
  - cqrs
  - dotnet
  - architecture
  - design pattern
  - microservices
  - interview
  - Domain Driven Design
  - CQRS
summary: "CQRS Pattern --- Detailed Interview Preparation Guide"
updatedAt: 2026-09-25
status: published
thumbnail: ""
videos: []
resources: []
---
# CQRS Pattern --- Detailed Interview Preparation Guide

**Audience:** Experienced C# / ASP.NET Core developers, technical leads
and solution architects (8--20 years).\
**Focus:** DDD, EF Core, SQL Server, Azure Service Bus, production
reliability and architecture decisions.

> **Evidence note:** Ordered by suggested study priority, **not**
> measured company frequency. The supplied interview materials do not
> substantiate company-by-company CQRS question counts; no company
> attribution is invented. Answers below expand on source themes with
> illustrative engineering examples.

## Contents

-   [Architecture](#architecture)
-   [Detailed questions and answers](#detailed-questions-and-answers)
-   [End-to-end C# implementation](#end-to-end-c-implementation)
-   [Scenario drills](#scenario-drills)
-   [Revision checklist](#revision-checklist)
-   [Sources and attribution](#sources-and-attribution)

## Architecture

``` mermaid
flowchart TD
    API["ASP.NET Core API"] --> C["Command handler"]
    API --> Q["Query handler"]
    C --> D["Domain aggregate and EF Core"]
    D --> W["SQL Server write store"]
    W --> O["Transactional outbox"]
    O --> B["Azure Service Bus"]
    B --> P["Idempotent projection consumer"]
    P --> R["Read model"]
    Q --> R
```

**Important:** This is the *advanced* topology. CQRS can use one
database and no message broker. Commands and queries may be separated
entirely in-process.

## Detailed questions and answers

### 1. What is CQRS and when should it be used?

**Detailed answer:** CQRS separates state-changing commands from
read-only queries. Commands model business intent and enforce
invariants; queries return tailored projections. Start with logical
separation over one database. Introduce independent read storage only
when read workload, reporting shape, or scaling warrants it.

**Practical example:** A hospital admission command validates capacity
and admission rules; a ward dashboard query reads a compact
bed-occupancy projection.

**Senior interview follow-up / trade-off:** Avoid CQRS for simple CRUD
when it adds handlers and operational complexity without meaningful
benefit.

**Interview-ready answer:** "CQRS separates state-changing commands from
read-only queries. I would choose the simplest implementation that meets
consistency, domain and performance requirements, and make failure
recovery explicit."

------------------------------------------------------------------------

### 2. How is CQRS different from CRUD?

**Detailed answer:** CRUD commonly reuses an entity and service for both
writes and reads. CQRS allows a rich domain model for writes and
lightweight DTOs for reads. This is a design choice, not necessarily two
databases.

**Practical example:** CreateInvoiceCommand calls Invoice.Issue();
GetInvoiceSummaryQuery selects invoice number, status and amount.

**Senior interview follow-up / trade-off:** Do not confuse a separate
controller method with genuinely separated responsibilities.

**Interview-ready answer:** "CRUD commonly reuses an entity and service
for both writes and reads. I would choose the simplest implementation
that meets consistency, domain and performance requirements, and make
failure recovery explicit."

------------------------------------------------------------------------

### 3. What is the difference between a command and a query?

**Detailed answer:** A command requests a business action and can change
state. A query must not intentionally change business state. Commands
can return IDs, versions or statuses; queries return data. Commands
should use meaningful verbs rather than generic table-update names.

**Practical example:** ApproveClaimCommand versus GetClaimDetailsQuery.

**Senior interview follow-up / trade-off:** Explain validation,
authorization and idempotency for commands.

**Interview-ready answer:** "A command requests a business action and
can change state. I would choose the simplest implementation that meets
consistency, domain and performance requirements, and make failure
recovery explicit."

------------------------------------------------------------------------

### 4. Does CQRS require separate databases?

**Detailed answer:** No. A single SQL Server database with distinct
handlers is a valid CQRS design. Separate read stores introduce
asynchronous projections, lag, replay and operational monitoring.

**Practical example:** Use EF Core for command-side aggregate
persistence and Dapper or EF projections for queries on the same
database.

**Senior interview follow-up / trade-off:** Separate databases only for
a measurable need.

**Interview-ready answer:** "No. I would choose the simplest
implementation that meets consistency, domain and performance
requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 5. Is MediatR required for CQRS?

**Detailed answer:** No. MediatR is a dispatch mechanism, not CQRS
itself. Plain application services and interfaces are enough. A mediator
can centralize behaviors such as validation and tracing, but avoid
creating indirection without value.

**Practical example:** Controller calls
ICommandHandler\<CreateOrderCommand,Guid\>.

**Senior interview follow-up / trade-off:** A mediator does not solve
distributed messaging or reliability.

**Interview-ready answer:** "No. I would choose the simplest
implementation that meets consistency, domain and performance
requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 6. How does CQRS complement DDD?

**Detailed answer:** DDD identifies aggregates, invariants and bounded
contexts. CQRS lets commands invoke aggregate behavior while queries use
projections rather than reconstructing rich aggregates. They can be
adopted independently.

**Practical example:** IssueInvoice command invokes Invoice.Issue;
invoice summary query selects only needed columns.

**Senior interview follow-up / trade-off:** Protect aggregate invariants
in the domain, not only in controller validation.

**Interview-ready answer:** "DDD identifies aggregates, invariants and
bounded contexts. I would choose the simplest implementation that meets
consistency, domain and performance requirements, and make failure
recovery explicit."

------------------------------------------------------------------------

### 7. CQRS versus Event Sourcing?

**Detailed answer:** CQRS separates read/write responsibilities. Event
Sourcing stores events as the authoritative state history. Either can be
used without the other. Event-sourced systems often build CQRS read
projections from events.

**Practical example:** OrderCreated and OrderShipped events can rebuild
order state; a read model stores current order status.

**Senior interview follow-up / trade-off:** Event Sourcing brings event
versioning, replay and operational costs.

**Interview-ready answer:** "CQRS separates read/write responsibilities.
I would choose the simplest implementation that meets consistency,
domain and performance requirements, and make failure recovery
explicit."

------------------------------------------------------------------------

### 8. What is eventual consistency?

**Detailed answer:** With asynchronously maintained projections, a
successful write can precede the corresponding read update. Define an
acceptable lag, expose status and choose read-after-write strategies for
workflows needing immediate confirmation.

**Practical example:** After admission, return admission ID and
committed status; dashboard may update moments later.

**Senior interview follow-up / trade-off:** Do not promise immediate
visibility from an async read store.

**Interview-ready answer:** "With asynchronously maintained projections,
a successful write can precede the corresponding read update. I would
choose the simplest implementation that meets consistency, domain and
performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 9. How do you guarantee publishing after a database commit?

**Detailed answer:** Use the Transactional Outbox: write domain state
and an outbox row in one local database transaction. A separate
dispatcher publishes and marks delivery. Consumers must be idempotent
because publish may repeat.

**Practical example:** Commit PatientAdmitted and OutboxMessage
together, then publish to Azure Service Bus.

**Senior interview follow-up / trade-off:** An outbox is at-least-once
delivery in practice, not exactly-once end-to-end.

**Interview-ready answer:** "Use the Transactional Outbox: write domain
state and an outbox row in one local database transaction. I would
choose the simplest implementation that meets consistency, domain and
performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 10. How do you handle duplicate commands and events?

**Detailed answer:** Require idempotency keys for retryable commands and
store the result under a unique constraint. Consumers can record
processed message IDs in the same transaction as their projection
update. Repeated deliveries become no-ops.

**Practical example:** A payment request with the same idempotency key
returns the original outcome.

**Senior interview follow-up / trade-off:** Never blindly retry
non-idempotent operations.

**Interview-ready answer:** "Require idempotency keys for retryable
commands and store the result under a unique constraint. I would choose
the simplest implementation that meets consistency, domain and
performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 11. How do you manage command-side transactions?

**Detailed answer:** Load required aggregates, enforce invariants,
persist changes and outbox entries in one local ACID transaction. A
remote service call cannot join an ordinary EF Core transaction. For
cross-service business workflows use sagas.

**Practical example:** Reserve inventory locally; orchestrate payment
and shipping through a saga.

**Senior interview follow-up / trade-off:** Keep transaction scope short
and avoid external calls while holding locks.

**Interview-ready answer:** "Load required aggregates, enforce
invariants, persist changes and outbox entries in one local ACID
transaction. I would choose the simplest implementation that meets
consistency, domain and performance requirements, and make failure
recovery explicit."

------------------------------------------------------------------------

### 12. How do you handle concurrency conflicts?

**Detailed answer:** Use EF Core concurrency tokens such as SQL Server
rowversion; catch DbUpdateConcurrencyException and decide whether to
reject, reload or retry after revalidating business rules. Blind retries
can violate intent.

**Practical example:** Two nurses update the same bed allocation; the
second update must detect stale state.

**Senior interview follow-up / trade-off:** Concurrency handling is a
business decision, not just a technical retry.

**Interview-ready answer:** "Use EF Core concurrency tokens such as SQL
Server rowversion; catch DbUpdateConcurrencyException and decide whether
to reject, reload or retry after revalidating business rules. I would
choose the simplest implementation that meets consistency, domain and
performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 13. How do you optimize query-side performance?

**Detailed answer:** Project directly to DTOs, use AsNoTracking,
appropriate indexes, pagination, caching and precomputed projections.
Measure actual query plans and latency before adding separate
infrastructure.

**Practical example:** Dashboard reads a denormalized WardOccupancy view
instead of loading every admission aggregate.

**Senior interview follow-up / trade-off:** A separate read database
does not automatically make queries fast.

**Interview-ready answer:** "Project directly to DTOs, use AsNoTracking,
appropriate indexes, pagination, caching and precomputed projections. I
would choose the simplest implementation that meets consistency, domain
and performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 14. How do you rebuild a read model?

**Detailed answer:** Keep a durable replayable source such as an event
log, CDC history or authoritative snapshot plus change feed. Build a new
projection version, checkpoint progress, validate totals and atomically
switch readers. Ordinary integration events may not be retained forever.

**Practical example:** Rebuild patient census projection from retained
admission/discharge events.

**Senior interview follow-up / trade-off:** Do not claim replay is
possible unless source history is retained.

**Interview-ready answer:** "Keep a durable replayable source such as an
event log, CDC history or authoritative snapshot plus change feed. I
would choose the simplest implementation that meets consistency, domain
and performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 15. What is a projection and how do you version it?

**Detailed answer:** A projection transforms authoritative changes into
a read-optimized shape. Version schemas and handlers, support upcasting
or parallel consumers, and use blue-green projection rebuilds for
incompatible changes.

**Practical example:** WardCensusV2 adds isolation-status counts.

**Senior interview follow-up / trade-off:** Track lag, last processed
offset and error rate.

**Interview-ready answer:** "A projection transforms authoritative
changes into a read-optimized shape. I would choose the simplest
implementation that meets consistency, domain and performance
requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 16. What if the projection consumer crashes halfway through?

**Detailed answer:** Process a message and projection checkpoint in the
same transaction when possible. On redelivery, idempotency protects
against duplicates. Use retries with backoff and a dead-letter queue for
poison messages.

**Practical example:** Azure Service Bus redelivers after a lock
expires; consumer checks message ID.

**Senior interview follow-up / trade-off:** Monitor dead-letter queues
and provide manual recovery procedures.

**Interview-ready answer:** "Process a message and projection checkpoint
in the same transaction when possible. I would choose the simplest
implementation that meets consistency, domain and performance
requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 17. How do you implement authorization in CQRS?

**Detailed answer:** Authenticate at the API boundary, then authorize
command/query use cases against user roles and resource ownership.
Validate tenant filters on read paths as well as writes. Avoid relying
only on mediator behaviors for object-level authorization.

**Practical example:** A doctor may query only patients assigned to
their care team.

**Senior interview follow-up / trade-off:** Security is needed on both
command and query paths.

**Interview-ready answer:** "Authenticate at the API boundary, then
authorize command/query use cases against user roles and resource
ownership. I would choose the simplest implementation that meets
consistency, domain and performance requirements, and make failure
recovery explicit."

------------------------------------------------------------------------

### 18. What is the role of validation pipeline behaviors?

**Detailed answer:** Cross-cutting request validation, logging and
tracing can be centralized, while business invariants remain in
aggregates or domain services. Pipeline behaviors are optional and
framework-specific.

**Practical example:** Validate request format before invoking
AdmitPatientHandler; domain checks bed availability.

**Senior interview follow-up / trade-off:** Input validation is not a
replacement for domain invariants.

**Interview-ready answer:** "Cross-cutting request validation, logging
and tracing can be centralized, while business invariants remain in
aggregates or domain services. I would choose the simplest
implementation that meets consistency, domain and performance
requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 19. How do you test CQRS?

**Detailed answer:** Unit-test command business rules and query mapping;
integration-test EF mappings, transactions, outbox persistence and query
SQL; contract-test event schemas; exercise duplicate delivery and lag in
end-to-end tests.

**Practical example:** Test admission fails when ward is full; test
duplicate PatientAdmitted does not double-count.

**Senior interview follow-up / trade-off:** Use real database
integration tests for concurrency and transaction semantics.

**Interview-ready answer:** "Unit-test command business rules and query
mapping; integration-test EF mappings, transactions, outbox persistence
and query SQL; contract-test event schemas; exercise duplicate delivery
and lag in end-to-end tests. I would choose the simplest implementation
that meets consistency, domain and performance requirements, and make
failure recovery explicit."

------------------------------------------------------------------------

### 20. How would you migrate CRUD to CQRS?

**Detailed answer:** Start with one complex use case. Separate its
command and query handlers without changing storage. Introduce DTO
projections, benchmark, then add asynchronous read models only when
justified. Keep rollout reversible.

**Practical example:** Extract invoice approval workflow from a
monolithic BillingService.

**Senior interview follow-up / trade-off:** Avoid a big-bang rewrite.

**Interview-ready answer:** "Start with one complex use case. I would
choose the simplest implementation that meets consistency, domain and
performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 21. How do you design CQRS with Azure Service Bus?

**Detailed answer:** Command handler commits SQL state plus outbox;
background worker publishes integration events to Service Bus;
projection worker receives, deduplicates and updates read storage;
observability tracks correlation ID, outbox age and consumer lag.

**Practical example:** PatientRegistered event updates a reporting
projection.

**Senior interview follow-up / trade-off:** Use managed identity, least
privilege, retries and dead-letter handling.

**Interview-ready answer:** "Command handler commits SQL state plus
outbox; background worker publishes integration events to Service Bus;
projection worker receives, deduplicates and updates read storage;
observability tracks correlation ID, outbox age and consumer lag. I
would choose the simplest implementation that meets consistency, domain
and performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 22. How do you scale CQRS to high throughput?

**Detailed answer:** Partition work by aggregate key when ordering
matters, scale read consumers independently, optimize indexes and batch
projection updates where safe. Establish throughput, latency and lag
SLOs and load-test hotspots.

**Practical example:** Partition order events by OrderId to preserve
per-order sequencing.

**Senior interview follow-up / trade-off:** Global ordering is costly
and usually unnecessary.

**Interview-ready answer:** "Partition work by aggregate key when
ordering matters, scale read consumers independently, optimize indexes
and batch projection updates where safe. I would choose the simplest
implementation that meets consistency, domain and performance
requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 23. How does Saga relate to CQRS?

**Detailed answer:** CQRS separates write and read paths; Saga
coordinates a multi-step business process across services with local
commits and compensating actions. They address different concerns and
may coexist.

**Practical example:** Admission triggers insurance authorization and
bed allocation; failures require release/compensation.

**Senior interview follow-up / trade-off:** Compensation is a new
business action, not a distributed rollback.

**Interview-ready answer:** "CQRS separates write and read paths; Saga
coordinates a multi-step business process across services with local
commits and compensating actions. I would choose the simplest
implementation that meets consistency, domain and performance
requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 24. What are the main disadvantages of CQRS?

**Detailed answer:** More handlers and contracts, duplicated models,
debugging complexity and---when stores are separated---eventual
consistency, projection operations and failure recovery. Compare these
costs with measured benefits.

**Practical example:** A small reference-data admin page may remain
ordinary CRUD.

**Senior interview follow-up / trade-off:** Architecture should be
proportionate to domain complexity.

**Interview-ready answer:** "More handlers and contracts, duplicated
models, debugging complexity and---when stores are separated---eventual
consistency, projection operations and failure recovery. I would choose
the simplest implementation that meets consistency, domain and
performance requirements, and make failure recovery explicit."

------------------------------------------------------------------------

### 25. How would you explain a production CQRS failure incident?

**Detailed answer:** Start with user impact and timestamps, trace
command correlation ID, verify write commit and outbox row, inspect
broker delivery, consumer retries and projection checkpoint, then replay
or repair safely. Add alerts and a regression test.

**Practical example:** Dashboard shows stale invoices although approval
succeeded.

**Senior interview follow-up / trade-off:** Never repair by blindly
reissuing the original payment command.

**Interview-ready answer:** "Start with user impact and timestamps,
trace command correlation ID, verify write commit and outbox row,
inspect broker delivery, consumer retries and projection checkpoint,
then replay or repair safely. I would choose the simplest implementation
that meets consistency, domain and performance requirements, and make
failure recovery explicit."

------------------------------------------------------------------------

## End-to-end C# implementation

The following is an **illustrative minimal CQRS implementation** using
ASP.NET Core, EF Core and SQL Server. It uses **one database**, and
deliberately does not require MediatR. Adapt namespaces, validation,
cancellation, error mapping, migrations and DI to your project.

### Domain model and DbContext

``` csharp
public sealed class Order
{
    public Guid Id { get; private set; }
    public Guid CustomerId { get; private set; }
    public decimal Amount { get; private set; }
    public string Status { get; private set; } = "Pending";

    private Order() { } // EF Core
    public Order(Guid customerId, decimal amount)
    {
        if (customerId == Guid.Empty) throw new ArgumentException("Customer required");
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount));
        Id = Guid.NewGuid();
        CustomerId = customerId;
        Amount = amount;
    }
}

public sealed class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>().HasKey(x => x.Id);
        modelBuilder.Entity<Order>().Property(x => x.Amount).HasPrecision(18, 2);
    }
}
```

### Command and handler

``` csharp
public record CreateOrderCommand(Guid CustomerId, decimal Amount);

public sealed class CreateOrderHandler(AppDbContext db)
{
    public async Task<Guid> Handle(
        CreateOrderCommand command, CancellationToken ct = default)
    {
        var order = new Order(command.CustomerId, command.Amount);
        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        return order.Id;
    }
}
```

### Query and handler

``` csharp
public record GetOrderQuery(Guid OrderId);
public record OrderDto(Guid Id, Guid CustomerId, decimal Amount, string Status);

public sealed class GetOrderHandler(AppDbContext db)
{
    public Task<OrderDto?> Handle(GetOrderQuery query, CancellationToken ct = default)
        => db.Orders.AsNoTracking()
            .Where(x => x.Id == query.OrderId)
            .Select(x => new OrderDto(x.Id, x.CustomerId, x.Amount, x.Status))
            .FirstOrDefaultAsync(ct);
}
```

### Minimal API wiring

``` csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<CreateOrderHandler>();
builder.Services.AddScoped<GetOrderHandler>();
var app = builder.Build();

app.MapPost("/orders", async (
    CreateOrderCommand cmd, CreateOrderHandler handler, CancellationToken ct) =>
{
    var id = await handler.Handle(cmd, ct);
    return Results.Created($"/orders/{id}", new { id });
});

app.MapGet("/orders/{id:guid}", async (
    Guid id, GetOrderHandler handler, CancellationToken ct) =>
{
    var result = await handler.Handle(new GetOrderQuery(id), ct);
    return result is null ? Results.NotFound() : Results.Ok(result);
});

app.Run();
```

**Production additions:** authenticate and authorize, validate requests,
map domain exceptions to appropriate HTTP responses, add concurrency
control and idempotency where required, use telemetry, and write
integration tests. For separate read stores, add transactional outbox,
broker and projection consumer.

### Reliable write-to-read flow

``` text
1. API receives CreateOrder with an idempotency key.
2. Handler validates business rules.
3. SQL transaction commits Order + OutboxMessage together.
4. Outbox worker publishes OrderCreated to Azure Service Bus.
5. Projection consumer checks whether MessageId was processed.
6. Consumer updates OrderSummary and records MessageId atomically.
7. Query handler reads OrderSummary.
8. Monitoring measures outbox age, projection lag and dead-letter count.
```

**Critical failure cases:** SQL rollback must roll back outbox row;
publish-after-commit may retry; message delivery may duplicate;
projection update and checkpoint must be coordinated; delayed read
visibility must be communicated to the user.

## Scenario drills

1.  **An order is saved but no event reaches Service Bus.** Explain the
    outbox, dispatcher retries, alerts and idempotent publishing.
2.  **The client times out after a payment command.** Explain unknown
    outcomes, idempotency keys and status lookup instead of blind retry.
3.  **A user cannot see their newly created order.** Explain projection
    lag, read-after-write alternatives and product UX.
4.  **Two operators approve the same claim concurrently.** Explain
    aggregate invariants and optimistic concurrency.
5.  **A consumer receives the same event three times.** Explain
    deduplication within the projection transaction.
6.  **The read model schema changes.** Explain versioned projection
    rebuild, validation and cutover.
7.  **Reporting is slow despite CQRS.** Explain indexes, query plans,
    pagination, partitioning and caching.
8.  **A cross-service workflow partially completes.** Explain Saga
    state, compensating actions and operational recovery.
9.  **You are migrating a legacy monolith.** Explain incremental handler
    separation and gradual extraction.
10. **The interviewer asks for 'exactly once'.** Explain at-least-once
    transport and effectively-once business effects through idempotency.

## Revision checklist

-   [ ] Define CQRS in 30 seconds.
-   [ ] Explain commands vs queries and CQRS vs CRUD.
-   [ ] Explain why separate databases and MediatR are optional.
-   [ ] Write one command handler and one projection query in C#.
-   [ ] Explain CQRS vs DDD vs Event Sourcing.
-   [ ] Draw SQL transaction + outbox + broker + projection.
-   [ ] Handle duplicate messages and idempotent commands.
-   [ ] Explain eventual consistency and read-after-write UX.
-   [ ] Handle optimistic concurrency.
-   [ ] Describe projection replay and versioning.
-   [ ] Explain security, testing and observability.
-   [ ] Justify when **not** to use CQRS.

## Sources and attribution

**Source-derived concepts:** The user's existing
*Microservices_Advanced_Interview_Questions_Part2.md*,
*DDD_Interview_Guide.md* and
*DotNet_Microservices_Experienced_Interview_Guide.pdf* discuss CQRS,
optional database separation, CQRS vs Event Sourcing, domain aggregates,
outbox and eventual consistency. This guide retains those conceptual
distinctions.

**Expanded material:** The 25 interview prompts, worked C# example,
operational scenarios, suggested priority and interview-ready wording
are synthesized study material; they are not represented as verbatim
questions asked by named employers.

**Further reading:** - Martin Fowler, CQRS:
https://martinfowler.com/bliki/CQRS.html - Microsoft, CQRS pattern:
https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs -
Microsoft, EF Core concurrency:
https://learn.microsoft.com/en-us/ef/core/saving/concurrency -
Microsoft, Transactional Outbox (Cosmos example):
https://learn.microsoft.com/en-us/azure/architecture/databases/guide/transactional-out-box-cosmos
