---
id: system-designs-002
slug:  system-designs
title: Highly Scalable Microservices Architecture --- System Design Interview Guide
categoryId: system-design
subcategory: 2. Design Highly Scalable Microservices Architecture
difficulty: Experienced
tags:
  - system-designs
  - Highly Scalable Microservices Architecture
  - Microservices System Design 

summary:  E-Commerce / Order Management System
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---
# Highly Scalable Microservices Architecture --- System Design Interview Guide
## Highly Scalable Microservices Architecture --- System Design Interview Guide

> **Interview Scenario:** Design a highly scalable Microservices
> architecture. Explain API Gateway, service boundaries,
> database-per-service, messaging, caching, resiliency, security and
> observability.
>
> **Target:** Senior .NET Developer / Technical Lead / Solution
> Architect interviews\
> **Reference stack:** ASP.NET Core, Azure Front Door/WAF, Azure API
> Management, Azure Service Bus, Azure SQL/PostgreSQL, Redis, Azure
> Entra ID, Managed Identity, Key Vault, OpenTelemetry, Application
> Insights/Azure Monitor, Docker, AKS, HPA/KEDA

------------------------------------------------------------------------

## 1. What is the interviewer testing?

This question tests whether you can design a **production distributed
system**, not merely draw several Web APIs.

A strong answer should cover:

-   Functional and non-functional requirements
-   Domain/service boundaries
-   API Gateway
-   Synchronous vs asynchronous communication
-   Database-per-service
-   Distributed consistency
-   Caching
-   Scalability
-   High availability
-   Resiliency
-   Security
-   Observability
-   Deployment
-   Autoscaling
-   Contract evolution
-   Failure recovery
-   Architectural trade-offs

The most important senior-level principle is:

> Do not start with technologies. Start with requirements, boundaries,
> traffic patterns, availability targets and business constraints.

------------------------------------------------------------------------

## 2. First clarify scale

Before saying "we need Kubernetes," ask what **highly scalable** means.

For example:

``` text
Requests/day?
Peak requests/second?
Read/write ratio?
Payload size?
Latency SLO?
Regional or global users?
Traffic spikes?
Consistency requirements?
Availability target?
Recovery requirements?
```

Example assumptions:

``` text
Peak API traffic       = 20,000 RPS
Average API traffic    = 4,000 RPS
Read/write ratio       = 80/20
Availability target    = 99.95%
API P95 target         < 300 ms
API P99 target         < 800 ms
Traffic                = bursty
Deployment             = independent per service
```

These numbers are examples for design discussion, not universal targets.

------------------------------------------------------------------------

## 3. High-Level Architecture

``` text
                          Internet / Mobile / SPA
                                   |
                                   v
                        +-------------------------+
                        | Azure Front Door + WAF  |
                        +------------+------------+
                                     |
                                     v
                        +-------------------------+
                        | Azure API Management    |
                        | API Gateway             |
                        +------------+------------+
                                     |
              +----------------------+----------------------+
              |                      |                      |
              v                      v                      v
       +-------------+        +-------------+        +-------------+
       | Catalog API |        | Order API   |        | Customer API|
       | .NET / AKS  |        | .NET / AKS  |        | .NET / AKS |
       +------+------+        +------+------+        +------+------+
              |                      |                      |
        +-----+-----+                |                 Customer DB
        |           |                |
        v           v                v
      Redis     Catalog DB       Order DB + Outbox
                                      |
                                      v
                           +------------------------+
                           | Azure Service Bus      |
                           | Topics / Queues / DLQ  |
                           +----+----------+--------+
                                |          |
                                v          v
                       +------------+ +------------+
                       | Inventory  | | Payment    |
                       | Service    | | Service    |
                       +-----+------+ +-----+------+
                             |              |
                        Inventory DB    Payment DB
                                \          /
                                 \        /
                                  v      v
                              +-------------+
                              | Shipping    |
                              | Service     |
                              +------+------+
                                     |
                                Shipping DB
```

Cross-cutting platform:

``` text
Azure Entra ID
Managed Identity / Workload Identity
Azure Key Vault
Azure App Configuration
OpenTelemetry
Application Insights / Azure Monitor
Azure Container Registry
AKS
HPA / KEDA
CI/CD
Infrastructure as Code
Centralized logs
Metrics and alerts
```

------------------------------------------------------------------------

## 4. Service Boundaries

The first major design decision is deciding **what becomes a service**.

Do not create services from database tables:

``` text
CustomerTableService
ProductTableService
OrderTableService
```

Instead identify **business capabilities / bounded contexts**.

Example:

``` text
Identity
Customer
Catalog
Ordering
Inventory
Payment
Shipping
Notification
```

#### DDD approach

Use:

-   Bounded Contexts
-   Aggregates
-   Domain events
-   Business capabilities
-   Event Storming
-   Team ownership
-   Change-frequency analysis

Example domain events:

``` text
OrderPlaced
InventoryReserved
PaymentCompleted
ShipmentCreated
```

These events often reveal natural boundaries.

#### Boundary test

Ask:

``` text
Does this capability own clear business rules?
Can it own its data?
Can it evolve independently?
Does it need independent scaling?
Can one team own it?
Can its contract be clearly defined?
Would separating it create excessive network chatter?
```

#### Avoid too many tiny services

Bad:

``` text
OrderHeaderService
OrderLineService
OrderStatusService
OrderValidationService
```

These probably belong to the same Ordering bounded context.

A good principle is:

> Start with coarse business capabilities and split further only when
> independent ownership, scaling, deployment or domain complexity
> justifies it.

------------------------------------------------------------------------

## 5. API Gateway

External clients should normally not know every internal service
location.

``` text
Client
  |
  v
API Gateway
 /   |    \
v    v     v
Catalog Order Customer
```

Possible Azure choice:

``` text
Azure API Management
```

#### Responsibilities

The Gateway can handle:

-   Routing
-   TLS termination
-   Authentication/token validation
-   Rate limiting
-   Quotas
-   API version routing
-   Request/response transformation
-   Correlation/trace headers
-   Central API policies
-   Sometimes response aggregation

#### Example

``` text
GET /api/catalog/products/100
        |
        v
Gateway
        |
        v
Catalog Service
```

#### What should not be in the Gateway?

Avoid core business logic.

Bad:

``` text
Gateway decides whether an order can be approved.
```

Better:

``` text
Order Service owns order business rules.
```

Otherwise the Gateway becomes another monolith and a critical
bottleneck.

#### API Gateway vs Load Balancer

A load balancer primarily distributes traffic among instances.

An API Gateway understands API concerns such as:

``` text
Routes
Tokens
Quotas
Policies
Versions
Transformations
```

------------------------------------------------------------------------

## 6. North-South vs East-West traffic

Useful interview terminology:

``` text
North-South:
Client <-> platform

East-West:
Service <-> service
```

The API Gateway primarily governs north-south traffic.

Do not force every internal call through the public Gateway unless there
is a deliberate reason. Internal service communication should have its
own secure routing and identity model.

------------------------------------------------------------------------

## 7. Synchronous Communication

Use REST or gRPC when an immediate response is required.

Example:

``` text
Client -> Catalog Service -> Product details
```

REST is usually convenient for public/general APIs.

gRPC can be useful for efficient strongly typed internal communication.

But remember:

> A network call can fail independently.

Every synchronous dependency requires:

``` text
Timeout
Failure handling
Observability
Authentication
Capacity planning
```

------------------------------------------------------------------------

## 8. Avoid long synchronous call chains

Bad:

``` text
Gateway
  |
Order
  |
Inventory
  |
Payment
  |
Shipping
  |
Notification
```

If every dependency must respond before the client receives a response,
latency and availability multiply across the chain.

Prefer asynchronous workflows where immediate completion is unnecessary.

Example:

``` text
Order Service
      |
      | OrderCreated
      v
Message Broker
   /      |       \
  v       v        v
Inventory Payment Notification
```

------------------------------------------------------------------------

## 9. Messaging

For Azure, a common choice for durable enterprise commands/events is:

``` text
Azure Service Bus
```

Use queues/topics for:

-   Business events
-   Background processing
-   Workflow steps
-   Load leveling
-   Fan-out
-   Decoupling

Example:

``` text
OrderCreated
     |
     v
Service Bus Topic
   /      |       \
  v       v        v
Inventory Payment Analytics
```

#### Benefits

-   Producer does not require consumers to be available at the same
    moment
-   Traffic spikes can be buffered
-   Consumers scale independently
-   Failures can be retried
-   Multiple subscribers can react to one event

#### Costs

-   Eventual consistency
-   Duplicate delivery
-   Ordering concerns
-   DLQ management
-   More difficult debugging
-   Schema evolution

------------------------------------------------------------------------

## 10. Commands vs Events

Commands request an action:

``` text
ReserveInventory
ProcessPayment
CreateShipment
```

Events describe facts:

``` text
InventoryReserved
PaymentCompleted
ShipmentCreated
```

This distinction makes event-driven architectures easier to understand.

------------------------------------------------------------------------

## 11. Database-per-service

Each service should own its data.

``` text
Catalog Service   -> Catalog DB
Order Service     -> Order DB
Inventory Service -> Inventory DB
Payment Service   -> Payment DB
```

Avoid:

``` text
Catalog ----\
Order -------+--> Shared DB
Inventory ---+
Payment -----/
```

#### Why?

### Independent schema evolution

Payment can change its internal schema without breaking Order.

### Clear ownership

Only Inventory Service controls inventory invariants.

### Independent scaling

Different stores can be optimized for different workloads.

### Reduced coupling

Consumers depend on contracts rather than internal tables.

------------------------------------------------------------------------

## 12. Does database-per-service mean separate physical servers?

Not necessarily.

The principle is primarily:

``` text
Logical ownership
+
Access isolation
```

For cost reasons, several services may initially use separate
databases/schemas on common infrastructure, provided one service cannot
casually manipulate another service's data.

As scale or isolation requirements increase, infrastructure can be
separated.

------------------------------------------------------------------------

## 13. Cross-service queries

Suppose a UI needs:

``` text
Order
Customer name
Payment status
Shipping status
```

Do not perform a SQL join across four service databases.

Options include:

### API composition

A query layer calls services and combines results.

### Read model

Build a denormalized projection from events.

``` text
OrderSummaryReadModel
```

### CQRS

Use a read model optimized for query workloads when complexity justifies
it.

The correct approach depends on latency, consistency and query
requirements.

------------------------------------------------------------------------

## 14. Distributed transactions

Because each service owns its database, this is not possible as one
simple local transaction:

``` text
BEGIN
Update Order DB
Update Inventory DB
Update Payment DB
COMMIT
```

Use:

``` text
Local ACID transactions
+
Saga
+
Outbox
+
Inbox
+
Idempotency
+
Compensation
```

This provides reliable **business consistency** rather than pretending
all services share one database transaction.

------------------------------------------------------------------------

## 15. Transactional Outbox

Problem:

``` text
Save Order
     |
Publish OrderCreated
```

What if DB commit succeeds but publishing fails?

The system becomes inconsistent.

Solution:

``` text
BEGIN

INSERT Order
INSERT OutboxMessage

COMMIT
```

Then a publisher sends pending Outbox messages.

``` text
Business DB
+----------------+
| Orders         |
| OutboxMessages |
+-------+--------+
        |
        v
Publisher
        |
        v
Message Broker
```

------------------------------------------------------------------------

## 16. Inbox and idempotent consumers

Messages can be redelivered.

Consumer stores:

``` text
MessageId
Consumer
ProcessedAt
```

Then:

``` text
BEGIN

If MessageId exists:
    ignore duplicate

Perform business operation
Insert Inbox record
Insert resulting Outbox event

COMMIT
```

Do not assume transport-level "exactly once" removes all
application-level duplication concerns.

------------------------------------------------------------------------

## 17. Caching

For a read-heavy system, caching can dramatically reduce latency and
database load.

Example:

``` text
Client
  |
Catalog API
  |
Redis
  |
Catalog DB
```

Flow:

``` text
Check Redis
   |
   +-- Hit --> return
   |
   +-- Miss --> DB
                 |
              Cache result
                 |
               return
```

This is commonly called **cache-aside**.

------------------------------------------------------------------------

## 18. What should be cached?

Good candidates:

-   Product catalog
-   Reference data
-   Frequently requested read models
-   Expensive computed data
-   Configuration/reference lookups

Be careful with:

-   Inventory quantities
-   Financial state
-   Security decisions
-   Rapidly changing critical data

The acceptable staleness depends on business requirements.

------------------------------------------------------------------------

## 19. Cache invalidation

Caching creates a new problem:

> How do you keep cached data fresh?

Strategies:

-   TTL
-   Explicit invalidation
-   Event-driven invalidation
-   Versioned keys

Example:

``` text
ProductUpdated
      |
      v
Invalidate Redis product key
```

The famous problem is not storing data in Redis; it is maintaining
correct freshness semantics.

------------------------------------------------------------------------

## 20. Cache stampede

Suppose a popular key expires:

``` text
10,000 requests
      |
      v
Cache miss
      |
      v
10,000 DB queries
```

Mitigations include:

-   Request coalescing/single-flight
-   Distributed locking where justified
-   Staggered TTL/jitter
-   Refresh-ahead
-   Serving acceptable stale data while refreshing

------------------------------------------------------------------------

## 21. Resiliency

Every remote dependency can fail.

Core patterns:

``` text
Timeout
Retry
Circuit Breaker
Bulkhead
Rate Limiting
Fallback
Load Shedding
```

These should be designed together rather than configured independently.

------------------------------------------------------------------------

## 22. Timeout

Never allow remote calls to wait indefinitely.

Example:

``` text
Order -> Pricing Service
```

If the business allows only 500 ms for the dependency, bound the call
accordingly.

Timeout values should come from latency budgets and dependency behavior,
not arbitrary defaults.

------------------------------------------------------------------------

## 23. Retry

Retry transient failures only.

Potentially retryable:

``` text
Temporary network error
HTTP 503
Transient DB connectivity
```

Usually not blindly retryable:

``` text
400 validation error
401/403
Insufficient funds
Permanent business rejection
```

Use:

``` text
Exponential backoff
+
Jitter
+
Bounded attempts
```

Retries must consider idempotency.

------------------------------------------------------------------------

## 24. Retry storm

Suppose:

``` text
Gateway retries 3 times
Order retries 3 times
Inventory retries 3 times
```

One client request can multiply into many downstream attempts.

Coordinate retry policies across layers.

Often retries should occur at the layer that best understands whether
retrying is safe.

------------------------------------------------------------------------

## 25. Circuit Breaker

If a dependency repeatedly fails:

``` text
Closed
  |
failure threshold
  |
Open
  |
cool-down
  |
Half-Open
  |
trial
  |
Closed/Open
```

When open, fail fast instead of consuming threads/connections waiting
for a known unhealthy dependency.

------------------------------------------------------------------------

## 26. Bulkhead

Isolate resource pools.

Example:

``` text
Payment dependency -> limited concurrency
Shipping dependency -> separate concurrency
```

A failing Shipping dependency should not consume every resource needed
by Payment.

The concept comes from compartments in ships: one flooded compartment
should not sink the entire system.

------------------------------------------------------------------------

## 27. Fallback

Fallback is useful only when degraded behavior is valid.

Example:

``` text
Recommendation service unavailable
        |
Return cached recommendations
```

Bad fallback:

``` text
Payment service unavailable
        |
Pretend payment succeeded
```

Fallback must preserve business correctness.

------------------------------------------------------------------------

## 28. Rate limiting

Protect services from excessive traffic.

Possible algorithms:

-   Fixed window
-   Sliding window
-   Token bucket
-   Concurrency limiting

Rate limiting can exist at:

``` text
Front Door/WAF
API Gateway
Service
```

Example policy:

``` text
Customer API:
100 requests/minute/client

Expensive report API:
10 concurrent requests/client
```

Rate limits should reflect endpoint cost and consumer contracts.

------------------------------------------------------------------------

## 29. Load shedding

When a service is overloaded, rejecting some work quickly can be better
than accepting everything and collapsing.

Example:

``` text
Capacity = 5,000 RPS
Incoming = 20,000 RPS
```

Without protection:

``` text
Threads exhausted
DB connections exhausted
Latency explodes
Everything fails
```

With controlled shedding:

``` text
Protect critical traffic
Reject excess quickly
Recover predictably
```

------------------------------------------------------------------------

## 30. Scalability

Highly scalable architecture means scaling each bottleneck
appropriately.

#### Horizontal application scaling

``` text
Load Balancer
     |
 +---+---+---+
 |   |   |   |
P1  P2  P3  P4
```

Keep APIs stateless where practical.

Session state should not force a client to one pod unless there is a
specific reason.

------------------------------------------------------------------------

## 31. HPA

Kubernetes Horizontal Pod Autoscaler can increase/decrease replicas
based on signals.

Examples:

``` text
CPU
Memory
Custom metrics
RPS
```

Conceptually:

``` text
Traffic increases
      |
HPA
      |
3 pods -> 12 pods
```

------------------------------------------------------------------------

## 32. KEDA for message consumers

Event-driven workers often scale better from backlog than CPU.

Example:

``` text
Service Bus Queue
Messages = 50,000
       |
       v
KEDA
       |
2 consumers -> 20 consumers
```

This helps drain spikes.

But check downstream capacity before scaling aggressively.

------------------------------------------------------------------------

## 33. Cluster scaling

If Kubernetes needs more pods but nodes have no capacity:

``` text
Pending pods
    |
Cluster autoscaler
    |
More nodes
```

Application scaling and infrastructure scaling are separate layers.

------------------------------------------------------------------------

## 34. Why adding pods may not improve throughput

Example:

``` text
3 pods  -> 5,000 RPS
6 pods  -> 5,100 RPS
12 pods -> 5,120 RPS
```

Likely shared bottlenecks:

-   Database CPU/IO
-   Database connection limit
-   Lock contention
-   External API limit
-   Broker throughput/quota
-   Redis saturation
-   Network
-   Thread pool
-   Connection pool
-   Node resource limits

Use traces and saturation metrics before adding more replicas.

------------------------------------------------------------------------

## 35. Database scalability

Database performance often becomes the real bottleneck.

Techniques:

-   Correct indexes
-   Query-plan analysis
-   Avoid N+1
-   Efficient pagination
-   Connection pooling
-   Short transactions
-   Batch operations
-   Read replicas
-   Partitioning
-   Archiving
-   Sharding only when necessary

Do not start with sharding if indexing/query design solves the problem.

------------------------------------------------------------------------

## 36. Read-heavy scaling

For read-heavy services:

``` text
Client
 |
CDN / Cache
 |
Read API
 |
Redis
 |
Read Replica / Read Store
```

Possible techniques:

``` text
CDN
Redis
Read replicas
CQRS read models
Denormalized projections
```

------------------------------------------------------------------------

## 37. High availability

Avoid single points of failure.

Application tier:

``` text
Multiple pods
Multiple nodes
Multiple availability zones where supported/required
```

Data tier:

``` text
HA database configuration
Backups
Restore testing
Geo-recovery where required
```

Messaging:

``` text
Durable broker
DLQ
Retry/recovery procedures
```

Availability is not only "three pods." Every critical dependency needs
an availability and recovery strategy.

------------------------------------------------------------------------

## 38. Security architecture

``` text
User
 |
 v
Azure Entra ID / Identity Provider
 |
 | OAuth2/OIDC Access Token
 v
Front Door + WAF
 |
 v
API Management
 |
 v
Microservices
 |
 | Managed Identity / Workload Identity
 +----------> Service Bus
 |
 +----------> Key Vault
 |
 +----------> Azure SQL / other Azure resources
```

------------------------------------------------------------------------

## 39. OAuth2/OIDC

For user/client authentication:

``` text
Client -> Identity Provider -> Access Token
```

API validates appropriate token properties:

-   Signature
-   Issuer
-   Audience
-   Expiration
-   Scope/role/claims

Authentication:

``` text
Who are you?
```

Authorization:

``` text
What may you do?
```

Services should enforce their own sensitive authorization rules.

------------------------------------------------------------------------

## 40. Managed Identity / Workload Identity

Avoid storing Azure resource credentials in application settings.

Instead:

``` text
Order Service
     |
Managed Identity
     |
Azure Service Bus
```

or:

``` text
Payment Service
     |
Managed Identity
     |
Key Vault
```

This reduces secret distribution and rotation burden.

------------------------------------------------------------------------

## 41. Key Vault

Store secrets that cannot be eliminated:

``` text
Third-party API keys
Certificates
Legacy credentials
```

Do not store production secrets in:

``` text
Source code
Docker image
Git repository
Plain CI YAML
```

Use least-privilege access.

------------------------------------------------------------------------

## 42. Network security

Depending on risk and requirements, use:

-   WAF
-   TLS
-   Private endpoints
-   Network policies
-   NSGs
-   Restricted ingress
-   Egress controls
-   mTLS/service mesh where justified

Do not assume "internal network" means trusted.

------------------------------------------------------------------------

## 43. Observability

A production microservices platform needs:

``` text
Logs
Metrics
Traces
```

These are complementary.

------------------------------------------------------------------------

## 44. Centralized structured logging

Prefer:

``` csharp
_logger.LogInformation(
    "Order {OrderId} created for customer {CustomerId}",
    orderId,
    customerId);
```

instead of concatenated strings.

Useful fields:

``` text
Timestamp
Service
Environment
TraceId
CorrelationId
RequestId
OrderId
Operation
Duration
Outcome
```

Centralize logs in a platform such as Application Insights/Azure Monitor
or another log analytics system.

------------------------------------------------------------------------

## 45. Distributed tracing

One request may cross:

``` text
Gateway
 |
Order
 |
Inventory
 |
Payment
 |
Database
```

Use OpenTelemetry.

``` text
Trace ID: ABC123

Gateway          Span 1
Order Service    Span 2
SQL              Span 3
Payment Service  Span 4
Provider         Span 5
```

For asynchronous messages, propagate trace context in message
headers/properties.

------------------------------------------------------------------------

## 46. Trace ID vs Correlation ID

Useful distinction:

``` text
TraceId
```

is primarily technical distributed-tracing context.

``` text
CorrelationId / SagaId / OrderId
```

can provide business correlation across long-running workflows that may
span multiple traces.

Use both where useful.

------------------------------------------------------------------------

## 47. Metrics

Track the four broad areas:

#### Traffic

``` text
Requests/sec
Messages/sec
```

#### Latency

``` text
P50
P95
P99
```

#### Errors

``` text
5xx
Timeouts
Failed messages
Dependency failures
```

## Saturation

``` text
CPU
Memory
Thread pool
Connections
DB CPU/IO
Queue depth
```

------------------------------------------------------------------------

## 48. Messaging metrics

For event-driven services, monitor:

``` text
Queue depth
Oldest message age
Consumer lag/backlog
Processing rate
Retry count
DLQ count
```

CPU alone may look healthy while the system is hours behind processing
messages.

------------------------------------------------------------------------

## 49. SLI, SLO and SLA

#### SLI

Measured indicator.

Example:

``` text
Successful request percentage
P95 latency
```

#### SLO

Internal reliability target.

Example:

``` text
99.9% successful valid requests per month
95% of reads < 300 ms
```

#### SLA

External/business commitment, often with contractual consequences.

A senior architecture answer should connect monitoring to user-visible
objectives, not just infrastructure dashboards.

------------------------------------------------------------------------

## 50. P95 and P99

Average latency can hide poor user experience.

Example:

``` text
90% requests = 100 ms
10% requests = 4 seconds
```

Average may look acceptable, while a significant group of users
experiences poor latency.

Track tail latency:

``` text
P95
P99
```

------------------------------------------------------------------------

## 51. Deployment

Each service becomes an immutable container image.

``` text
Git
 |
CI Pipeline
 |
 +-- Restore
 +-- Build
 +-- Unit Tests
 +-- Integration Tests
 +-- Contract Tests
 +-- Security Scan
 +-- Docker Build
 |
 v
Azure Container Registry
 |
 v
AKS
```

Use:

-   Readiness probes
-   Liveness probes
-   Startup probes
-   Resource requests/limits
-   HPA
-   KEDA
-   Pod disruption controls where needed
-   Graceful shutdown

------------------------------------------------------------------------

## 52. Zero-downtime deployment

During rolling deployment:

``` text
V1 Pod
V1 Pod
V2 Pod
```

Old and new versions coexist.

Therefore APIs, events and database schemas must remain compatible
during rollout.

Use:

``` text
Rolling
Blue/Green
Canary
```

based on risk and platform maturity.

------------------------------------------------------------------------

## 53. Database schema evolution

Use **Expand and Contract**.

### Expand

Add new column/table without breaking old code.

### Migrate

Deploy code capable of using the new structure.

### Contract

Remove old structures only after no active version depends on them.

Avoid:

``` text
Rename/remove column
+
deploy incompatible code
```

as one destructive step.

------------------------------------------------------------------------

## 54. API and event versioning

Prefer backward-compatible additive changes.

Example:

``` json
{
  "orderId": "O1",
  "status": "Confirmed",
  "currency": "INR"
}
```

Adding optional `currency` is generally safer than removing or changing
the meaning of `status`.

For genuinely breaking changes:

-   Introduce a new contract version
-   Run versions together during migration
-   Track old consumer usage
-   Deprecate deliberately

Use contract testing where appropriate.

------------------------------------------------------------------------

## 55. Health checks

Separate:

#### Liveness

``` text
Is the process alive?
```

If not, restart it.

#### Readiness

``` text
Can this instance currently receive traffic?
```

If not, remove it from load balancing.

Do not make health endpoints unnecessarily expensive.

Be careful about marking every instance unready because one optional
downstream dependency is unavailable; that can amplify outages.

------------------------------------------------------------------------

## 56. Example ASP.NET Core health checks

``` csharp
builder.Services.AddHealthChecks();

app.MapHealthChecks("/health/live");
app.MapHealthChecks("/health/ready");
```

Production configuration should distinguish checks and dependencies
appropriately.

------------------------------------------------------------------------

## 57. Resilience in .NET

Modern .NET applications can use resilience handlers built on Polly
concepts.

Conceptually:

``` csharp
builder.Services
    .AddHttpClient<InventoryClient>()
    .AddStandardResilienceHandler();
```

Then tune:

``` text
Timeout
Retry
Circuit breaker
Concurrency
```

to the actual dependency.

Do not copy one resilience policy to every downstream service.

------------------------------------------------------------------------

## 58. Configuration management

Separate normal configuration from secrets.

Configuration:

``` text
Feature flags
Timeouts
Service endpoints
Queue names
Logging levels
```

Possible Azure service:

``` text
Azure App Configuration
```

Secrets:

``` text
Key Vault
```

Environment-specific settings should be injected at runtime rather than
baked into Docker images.

------------------------------------------------------------------------

## 59. Failure scenario: Database is slow

``` text
DB latency increases
      |
API requests wait
      |
Connections fill
      |
Threads/tasks accumulate
      |
P99 rises
      |
Service becomes unhealthy
```

Mitigation:

-   Optimize query/index
-   Bound DB command timeout
-   Protect connection pool
-   Cache suitable reads
-   Reduce unnecessary queries
-   Load shed if required
-   Scale DB only after identifying the bottleneck

Adding API pods may make this worse by creating more DB connections.

------------------------------------------------------------------------

## 60. Failure scenario: Payment dependency is unavailable

``` text
Order -> Payment
```

Use:

``` text
Timeout
Circuit breaker
Bounded retry
Idempotency
Queue/Saga where business allows
```

Do not keep retrying indefinitely.

If payment can be asynchronous:

``` text
OrderStatus = PaymentPending
```

and continue when the dependency recovers.

------------------------------------------------------------------------

## 61. Failure scenario: Redis unavailable

The design depends on what Redis is used for.

If it is only a cache:

``` text
Redis unavailable
      |
Fallback to DB carefully
```

But protect the DB from a cache-outage stampede.

If Redis is being used for critical coordination, the failure strategy
must be stronger.

A cache should not accidentally become an undocumented single point of
failure.

------------------------------------------------------------------------

## 62. Failure scenario: Message consumer is down

Producer continues publishing to durable messaging.

``` text
Producer
  |
Service Bus
  |
Consumer unavailable
```

Messages remain queued.

When the consumer recovers:

``` text
Scale consumers
Process backlog
```

Monitor oldest-message age and queue depth so the outage is visible.

------------------------------------------------------------------------

## 63. Preventing a Distributed Monolith

Warning signs:

-   Shared database
-   Services deploy together
-   Circular dependencies
-   Long synchronous chains
-   Shared domain models everywhere
-   Breaking changes require coordinated releases
-   One service outage breaks the entire platform

Prevention:

``` text
Business-aligned boundaries
Independent data ownership
Explicit contracts
Async communication where appropriate
Independent CI/CD
Contract testing
Dependency governance
```

If two services must always change together, reconsider whether they
should actually be one bounded context.

------------------------------------------------------------------------

## 64. Multi-region considerations

For global or disaster-recovery requirements, discuss:

``` text
Active/Passive
or
Active/Active
```

Consider:

-   Data replication
-   DNS/Front Door routing
-   Messaging topology
-   Conflict resolution
-   RPO
-   RTO
-   Cost
-   Operational complexity

Do not claim multi-region is automatically required for every system.

It should follow business availability and disaster-recovery objectives.

------------------------------------------------------------------------

## 65. RPO and RTO

``` text
RPO = Recovery Point Objective
```

How much data loss is acceptable?

Example:

``` text
RPO = 5 minutes
```

``` text
RTO = Recovery Time Objective
```

How long can recovery take?

Example:

``` text
RTO = 30 minutes
```

Backup, replication and regional design should be based on these
targets.

------------------------------------------------------------------------

## 66. Cost considerations

Highly scalable architecture must also be economically scalable.

Costs can come from:

-   Overprovisioned AKS nodes
-   Excessive logs/traces
-   Large Redis tiers
-   Database over-sizing
-   Messaging throughput
-   Cross-region data transfer
-   Too many tiny services
-   Unbounded retention

Architecture decisions should balance:

``` text
Performance
Reliability
Complexity
Cost
```

------------------------------------------------------------------------

## 67. Complete architecture with scaling

``` text
                              Global Users
                                   |
                                   v
                         +---------------------+
                         | Front Door + WAF    |
                         +----------+----------+
                                    |
                                    v
                         +---------------------+
                         | API Management      |
                         +----------+----------+
                                    |
                  +-----------------+-----------------+
                  |                 |                 |
                  v                 v                 v
           +-----------+      +-----------+      +-----------+
           | Catalog   |      | Order     |      | Customer  |
           | Pods x N  |      | Pods x N  |      | Pods x N  |
           +-----+-----+      +-----+-----+      +-----+-----+
                 |                  |                  |
            +----+----+             |              Customer DB
            |         |             |
            v         v             v
          Redis   Catalog DB     Order DB
                                     |
                                  Outbox
                                     |
                                     v
                          +---------------------+
                          | Azure Service Bus   |
                          +---+-------------+---+
                              |             |
                              v             v
                      +------------+   +------------+
                      | Inventory  |   | Payment    |
                      | Workers xN |   | Workers xN |
                      +-----+------+   +-----+------+
                            |                |
                       Inventory DB      Payment DB

Scaling:
API workloads       -> HPA/custom metrics
Queue consumers     -> KEDA
Cluster capacity    -> Cluster autoscaler
Read traffic        -> CDN/Redis/read models
Database            -> indexes/read replicas/partitioning as required
```

------------------------------------------------------------------------

## 68. Architecture decision table

  ----------------------------------------------------------------------------------------------
  Area              Typical choice              Why                     Main trade-off
  ----------------- --------------------------- ----------------------- ------------------------
  Edge              Front Door + WAF            Global entry/security   Cost/configuration

  Gateway           API Management              Policies/routing/rate   Gateway dependency
                                                limits                  

  Services          ASP.NET Core                High-performance .NET   Service operations
                                                APIs                    

  Boundaries        DDD bounded contexts        Business autonomy       Requires domain analysis

  Data              Database per service        Independent ownership   Distributed consistency

  Sync              REST/gRPC                   Immediate response      Temporal coupling

  Async             Service Bus                 Durable decoupling      Eventual consistency

  Consistency       Saga + Outbox/Inbox         Reliable workflow       More application logic

  Cache             Redis/CDN                   Reduce latency/load     Invalidation/staleness

  Resilience        Timeout/retry/CB/bulkhead   Failure isolation       Configuration complexity

  Identity          OAuth2/OIDC                 Standard user/client    Identity infrastructure
                                                auth                    

  Azure access      Managed Identity            Avoid credentials       Platform dependency

  Secrets           Key Vault                   Central secret          Availability/access
                                                protection              design

  Observability     OpenTelemetry               Vendor-neutral          Telemetry cost
                                                instrumentation         

  Runtime           Docker + AKS                Independent             Operational complexity
                                                deployment/scaling      

  API scaling       HPA                         Elastic replicas        Needs good metrics

  Worker scaling    KEDA                        Backlog-based scaling   Downstream capacity
                                                                        matters
  ----------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 69. Common mistakes

### Mistake 1 --- Start with Kubernetes

Start with domain and requirements.

### Mistake 2 --- One service per table

Design around business capabilities.

### Mistake 3 --- Shared database

Creates schema-level coupling.

### Mistake 4 --- Everything synchronous

Creates cascading failures and latency.

### Mistake 5 --- Everything asynchronous

Some operations genuinely need immediate responses.

### Mistake 6 --- Cache everything

Critical mutable data may not tolerate staleness.

### Mistake 7 --- Retry everything

Retries can amplify outages and duplicate side effects.

### Mistake 8 --- Gateway contains business logic

Creates centralized coupling.

### Mistake 9 --- Assume more pods solve performance

Find the actual bottleneck.

### Mistake 10 --- Logging without correlation

Logs become difficult to reconstruct across services.

### Mistake 11 --- Monitoring only CPU

Track user-visible latency/errors plus queues, DB and dependencies.

### Mistake 12 --- Secrets in configuration files

Prefer workload identity and Key Vault.

------------------------------------------------------------------------

## 70. Two-minute interview answer

> I start by clarifying peak traffic, read/write ratio, latency and
> availability SLOs. Then I define services around DDD bounded contexts
> such as Catalog, Ordering, Inventory and Payment rather than around
> database tables.
>
> External traffic enters through Front Door/WAF and an API Gateway such
> as Azure API Management, which handles routing, token policies, rate
> limiting and other edge concerns but not business logic. Each service
> owns its database so schemas and business invariants remain
> independent.
>
> I use REST or gRPC when an immediate response is required and Azure
> Service Bus for asynchronous workflows, fan-out and load leveling.
> Cross-service transactions use local ACID transactions with Saga,
> Transactional Outbox, Inbox/idempotency and compensation rather than a
> shared distributed transaction.
>
> For read-heavy workloads I use CDN or Redis with explicit freshness
> and invalidation policies. Every remote dependency has bounded
> timeouts, carefully controlled retries, circuit breakers and resource
> isolation. Rate limiting and load shedding protect the platform under
> overload.
>
> Services run as stateless Docker containers on AKS. APIs can scale
> with HPA, event consumers with KEDA, and cluster capacity separately.
> But I first identify the real bottleneck because adding pods cannot
> fix a saturated database or external provider.
>
> Security uses OAuth2/OIDC at the user/client boundary, service-level
> authorization, Managed Identity for Azure service-to-service access
> and Key Vault for remaining secrets. For observability I use
> OpenTelemetry with centralized structured logs, metrics and
> distributed traces, monitoring P95/P99 latency, error rate,
> saturation, queue depth and consumer lag.
>
> Finally, I design APIs, events and database migrations for backward
> compatibility so rolling or canary deployments can run old and new
> versions simultaneously.

------------------------------------------------------------------------

## 71. Whiteboard interview order

Draw this first:

``` text
Users
  |
Front Door/WAF
  |
API Gateway
  |
+------+-------+-------+
|      |       |       |
Catalog Order Inventory Payment
|       |       |       |
DB      DB      DB      DB
        |
     Service Bus
```

Then add:

``` text
Redis
Outbox/Inbox
Saga
OAuth2
Managed Identity
Key Vault
OpenTelemetry
AKS
HPA/KEDA
```

Explain in this sequence:

``` text
1. Requirements and scale
2. Service boundaries
3. API Gateway
4. Data ownership
5. Sync vs async communication
6. Distributed consistency
7. Caching
8. Resilience
9. Scaling and HA
10. Security
11. Observability
12. Deployment
13. Backward compatibility
14. Disaster recovery
15. Trade-offs
```

This structure prevents the answer from becoming a random list of
technologies.

------------------------------------------------------------------------

## 72. Rapid revision cheat sheet

  Topic                  Interview point
  ---------------------- -----------------------------------------
  Service boundaries     Business capability / bounded context
  API Gateway            Routing and edge cross-cutting concerns
  Database-per-service   Independent data ownership
  REST                   Immediate/general request-response
  gRPC                   Efficient strongly typed internal calls
  Messaging              Async decoupling/load leveling
  Saga                   Distributed business workflow
  Outbox                 Reliable DB-to-message transition
  Inbox                  Consumer deduplication
  Redis                  Read performance; manage staleness
  Timeout                Bound dependency latency
  Retry                  Transient + safe operations only
  Circuit breaker        Fail fast on unhealthy dependency
  Bulkhead               Isolate resource exhaustion
  Rate limiting          Protect capacity
  HPA                    Scale API replicas
  KEDA                   Scale message consumers
  OAuth2/OIDC            User/client identity and authorization
  Managed Identity       Credential-free Azure workload access
  Key Vault              Secrets that cannot be eliminated
  OpenTelemetry          Logs/metrics/traces correlation
  P95/P99                Tail latency
  Consumer lag           Async processing health
  Zero downtime          Backward compatibility
  DR                     RPO + RTO

------------------------------------------------------------------------

## 73. Final interview statement

> A highly scalable microservices system is not created simply by
> splitting an application into many APIs or putting it on Kubernetes.
> Scalability comes from correct business boundaries, independent data
> ownership, minimizing synchronous coupling, using messaging to absorb
> and distribute work, caching suitable read workloads, isolating
> failures, scaling each tier independently and continuously measuring
> the real bottlenecks. Security and observability must be part of the
> architecture from the beginning. Every major design decision should be
> justified by its business benefit and accompanied by an explanation of
> the complexity or trade-off it introduces.

![state_management_1.png](/images/system-designs/microservice/micro_service.png)

![state_management_1.png](/images/system-designs/microservice/api_gateway.png)

![state_management_1.png](/images/system-designs/microservice/load_balancer_api_gateway.png)
