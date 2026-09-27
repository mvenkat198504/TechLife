---
id: system-designs-003
slug:  system-designs
title: Payment System Design --- Senior Microservices Interview Guide
categoryId: system-design
subcategory: 3. Design a Payment System
difficulty: Experienced
tags:
  - system-designs
  - Payment System Design
  - Microservices System Design 

summary:  E-Commerce / Order Management System
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Payment System Design --- Senior Microservices Interview Guide
## Payment System Design --- Senior Microservices Interview Guide

> **Scenario:** Design a Payment System. How would you prevent duplicate
> payments, implement idempotency, handle retries, reconciliation, Saga
> compensation and failures?
>
> **Target:** Senior .NET Developer / Technical Lead / Solution
> Architect interviews\
> **Reference stack:** ASP.NET Core, PostgreSQL/Azure SQL, Azure Service
> Bus, Redis where appropriate, external Payment Service Provider (PSP),
> Azure Key Vault, Managed Identity, OpenTelemetry/Application Insights,
> Docker/AKS

------------------------------------------------------------------------

## 1. What is the interviewer testing?

A payment-system question tests much more than calling a payment
gateway.

The interviewer usually wants to see whether you understand:

-   Correct payment state modeling
-   Duplicate-payment prevention
-   Idempotency
-   Concurrency and race conditions
-   Unknown outcomes after timeouts
-   Safe retry policies
-   External provider integration
-   Webhooks
-   Transactional Outbox/Inbox
-   At-least-once delivery
-   Saga compensation
-   Void vs refund
-   Reconciliation
-   Auditability
-   Recovery after crashes
-   Security
-   Observability
-   Scalability and availability

The most important principle is:

> **Never create a second financial side effect merely because the first
> request timed out.**

------------------------------------------------------------------------

## 2. Start with business requirements

Before selecting technologies, clarify the payment model.

Questions include:

``` text
Do we authorize and capture immediately?
Do we authorize first and capture later?
Which payment methods are supported?
Can payments be partially captured?
Can payments be partially refunded?
Can an order have multiple payment attempts?
How long can a payment remain Pending?
Does the PSP support idempotency keys?
How are webhooks delivered?
What are reconciliation requirements?
What audit/compliance requirements exist?
```

For this design assume:

``` text
Order Service
Payment Service
External PSP
Asynchronous events
Refund/void support
At-least-once messaging
High availability
Complete audit history
```

------------------------------------------------------------------------

## 3. High-Level Architecture

``` text
                       Web / Mobile Client
                              |
                              v
                    +--------------------+
                    | API Gateway / APIM |
                    +---------+----------+
                              |
                              v
                    +--------------------+
                    | Order Service      |
                    +---------+----------+
                              |
                    ProcessPayment Command
                              |
                              v
                    +--------------------+
                    | Azure Service Bus  |
                    +---------+----------+
                              |
                              v
                    +-------------------------+
                    | Payment Service         |
                    | ASP.NET Core            |
                    +----+---------------+----+
                         |               |
                         |               |
                         v               v
                   Payment DB       Outbox / Inbox
                         |
                         |
                         v
                 +---------------------+
                 | PSP Adapter Layer   |
                 +----------+----------+
                            |
                          HTTPS
                            |
                            v
                 +---------------------+
                 | Payment Provider    |
                 | Stripe/Adyen/etc.   |
                 +----------+----------+
                            |
                         Webhooks
                            |
                            v
                 +---------------------+
                 | Webhook Endpoint    |
                 +----------+----------+
                            |
                            v
                      Payment Service
```

Cross-cutting:

``` text
OAuth2/OIDC
Managed Identity
Key Vault
OpenTelemetry
Application Insights
Centralized logs
Metrics/alerts
AKS
```

------------------------------------------------------------------------

## 4. Payment Service responsibilities

Payment Service owns:

``` text
Payment
Payment Attempt
Authorization
Capture
Refund
Void
Provider transaction references
Idempotency records
Payment state
Webhook processing state
Reconciliation state
Audit trail
```

Order Service should not directly call PSP APIs.

Bad:

``` text
Order Service ---> Stripe
Inventory Service ---> Stripe
```

Better:

``` text
Business services ---> Payment Service ---> PSP Adapter ---> Provider
```

This centralizes payment invariants, provider integration, idempotency
and audit behavior.

------------------------------------------------------------------------

## 5. Payment data model

A conceptual model:

``` text
Payment
--------------------------------
PaymentId
OrderId
Amount
Currency
Status
Provider
ProviderPaymentId
CreatedAt
UpdatedAt
Version
```

Payment attempts:

``` text
PaymentAttempt
--------------------------------
AttemptId
PaymentId
IdempotencyKey
ProviderRequestId
Status
FailureCode
CreatedAt
UpdatedAt
```

Refunds:

``` text
Refund
--------------------------------
RefundId
PaymentId
Amount
ProviderRefundId
IdempotencyKey
Status
CreatedAt
```

Idempotency:

``` text
IdempotencyRecord
--------------------------------
Key
Operation
RequestHash
ResourceId
Status
ResponsePayload
CreatedAt
ExpiresAt
```

------------------------------------------------------------------------

## 6. Payment state machine

Do not model payment as only:

``` text
Success / Failed
```

A realistic state machine may contain:

``` text
Created
   |
   v
Pending
   |
   +------> Authorized
   |           |
   |           v
   |        Captured
   |
   +------> Failed
   |
   +------> Unknown
```

Later:

``` text
Captured
   |
   +------> RefundPending
                  |
             +----+----+
             |         |
             v         v
          Refunded   RefundFailed
```

Other systems may need:

``` text
PartiallyCaptured
PartiallyRefunded
Cancelled
Voided
RequiresAction
```

Explicit states make failure recovery possible.

------------------------------------------------------------------------

## 7. Duplicate payment problem

Duplicates can happen for many reasons.

### User double-clicks Pay

``` text
Click
Click
```

## Browser retries

A network interruption can cause the client to resend.

### API Gateway retries

An infrastructure layer may retry.

### Service retry

Order Service retries `ProcessPayment`.

### Broker redelivery

A message can arrive more than once.

### PSP timeout

Payment succeeded externally but response was lost.

### Webhook duplication

PSPs commonly deliver webhook events more than once.

Therefore:

> Duplicate requests are normal distributed-system behavior, not an
> exceptional edge case.

------------------------------------------------------------------------

### 8. Idempotency

An operation is idempotent when repeating the same logical request does
not create additional business effects.

For payment:

``` text
Same logical payment request
       |
       v
At most one intended charge
```

The client or upstream service sends:

``` http
Idempotency-Key: ORD-1001-PAYMENT-1
```

The Payment Service stores it.

------------------------------------------------------------------------

## 9. Idempotency flow

``` text
Request arrives
     |
     v
Check IdempotencyKey
     |
 +---+---+
 |       |
Found   Not Found
 |       |
 v       v
Return  Create processing record
saved       |
result      v
          Process payment
             |
             v
          Store result
```

The same key returns the same logical outcome.

------------------------------------------------------------------------

## 10. Why a unique database constraint matters

Application code alone is insufficient.

Imagine two requests arrive simultaneously:

``` text
Request A --------\
                   > both check "key does not exist"
Request B --------/
```

Both could attempt payment.

Use a database unique constraint:

``` text
UNIQUE(IdempotencyKey)
```

or a scoped uniqueness rule such as:

``` text
UNIQUE(MerchantId, IdempotencyKey)
```

depending on the API contract.

The database protects against races between application instances.

------------------------------------------------------------------------

## 11. Request hash

An idempotency key should represent the same operation.

Suppose:

``` text
Key = PAY-123
Request 1 amount = 1,000
Request 2 amount = 10,000
```

Do not silently return Request 1's result for a semantically different
request.

Store a normalized request hash:

``` text
IdempotencyKey
RequestHash
```

If the key is reused with different critical parameters:

``` text
Reject the request
```

------------------------------------------------------------------------

## 12. Conceptual ASP.NET Core idempotency logic

``` csharp
public async Task<PaymentResult> ProcessAsync(
    PaymentRequest request,
    string idempotencyKey,
    CancellationToken cancellationToken)
{
    var requestHash = ComputeHash(request);

    var existing = await _idempotencyRepository
        .GetAsync(idempotencyKey, cancellationToken);

    if (existing is not null)
    {
        if (existing.RequestHash != requestHash)
            throw new IdempotencyConflictException();

        return existing.ToPaymentResult();
    }

    // Insert a uniquely constrained processing record.
    // Concurrent duplicate inserts must resolve to one logical operation.

    // Call provider using a stable provider idempotency/reference key.

    // Persist final/known state and response.

    // Return the same logical result for future retries.
}
```

The exact transaction boundaries depend on the provider interaction. Do
not hold a database transaction open across a slow external network call
unless the design deliberately requires it.

------------------------------------------------------------------------

## 13. Provider-level idempotency

Application idempotency is essential, but if the PSP supports
idempotency, use it too.

``` text
Internal IdempotencyKey
        |
        v
Stable PSP IdempotencyKey
        |
        v
Payment Provider
```

This provides another layer of duplicate protection when the external
call must be retried.

------------------------------------------------------------------------

## 14. Timeout is not failure

This is one of the most important interview points.

Scenario:

``` text
Payment Service
      |
      | Charge ₹5,000
      v
Payment Provider
      |
      | Provider charges card
      X Response lost
```

Payment Service sees:

``` text
Timeout
```

But actual provider state is:

``` text
PAID
```

If the service says:

``` text
"Timeout means failure, retry the charge"
```

the customer may be charged twice.

Correct interpretation:

``` text
Timeout = UNKNOWN outcome
```

------------------------------------------------------------------------

## 15. Handling an unknown payment outcome

``` text
Payment call times out
       |
       v
Mark Payment = Unknown/PendingVerification
       |
       v
Query provider using stable merchant/provider reference
       |
 +-----+-------+----------------+
 |             |                |
Paid         Failed           Unknown
 |             |                |
 v             v                v
Complete     Fail         Reconcile later
```

Do not create a second independent payment attempt until the first
attempt's outcome is known or the business/provider contract proves it
is safe.

------------------------------------------------------------------------

## 16. Retry strategy

Retries are appropriate only when:

1.  The failure is transient.
2.  Retrying is safe.
3.  The operation is idempotent or otherwise protected.

Potentially retryable:

``` text
HTTP 503
Connection reset
Transient DNS/network issue
Temporary throttling
```

Usually not blindly retryable:

``` text
Card declined
Insufficient funds
Invalid CVV
Invalid request
Unauthorized operation
Business-rule rejection
```

Use:

``` text
Bounded retries
+
Exponential backoff
+
Jitter
```

------------------------------------------------------------------------

## 17. Why jitter?

Without jitter:

``` text
10,000 requests fail
       |
all retry after exactly 1 second
       |
10,000 requests hit provider again
```

This creates a retry storm.

With jitter:

``` text
Retry times are distributed
```

reducing synchronized load spikes.

------------------------------------------------------------------------

## 18. Retry ownership

Do not configure retries independently at every layer.

Bad:

``` text
Gateway retries x3
Order retries x3
Payment retries x3
HTTP client retries x3
```

One user operation can explode into many attempts.

Define which layer owns retry behavior.

For financial side effects, the Payment Service should normally control
payment-specific retry/reconciliation logic because it understands
idempotency and provider semantics.

------------------------------------------------------------------------

## 19. Circuit Breaker

If PSP is failing continuously:

``` text
Payment requests
      |
      v
Provider fails repeatedly
      |
Circuit opens
      |
Fail fast / mark Pending / queue according to business policy
```

States:

``` text
Closed -> Open -> Half-Open -> Closed
```

Circuit breaker prevents resource exhaustion and repeated calls to a
known unhealthy dependency.

It does not itself solve payment correctness. Unknown outcomes still
require reconciliation.

------------------------------------------------------------------------

## 20. Payment commands and events

Commands:

``` text
AuthorizePayment
CapturePayment
ProcessPayment
RefundPayment
VoidPayment
```

Events:

``` text
PaymentAuthorized
PaymentCaptured
PaymentFailed
PaymentRefunded
PaymentVoided
PaymentRequiresReview
```

Commands request an action.

Events describe something that already happened.

------------------------------------------------------------------------

## 21. Reliable event publishing: dual-write problem

Bad flow:

``` text
1. Save Payment = Captured
2. Publish PaymentCompleted
```

Failure:

``` text
DB commit succeeds
Process crashes
Event never publishes
```

Order Saga remains stuck even though payment succeeded.

------------------------------------------------------------------------

## 22. Transactional Outbox

Use one local DB transaction:

``` text
BEGIN

UPDATE Payment
SET Status = 'Captured'

INSERT OutboxMessage(PaymentCompleted)

COMMIT
```

Then a separate publisher sends the Outbox message.

``` text
Payment DB
+----------------+
| Payments       |
| OutboxMessages |
+-------+--------+
        |
        v
Outbox Publisher
        |
        v
Azure Service Bus
```

------------------------------------------------------------------------

## 23. Why Outbox can still publish duplicates

Scenario:

``` text
Publisher -> Service Bus : SUCCESS
        |
        X publisher crashes
        |
PublishedAt never updated
```

After restart:

``` text
same Outbox row is published again
```

Therefore consumers must be idempotent.

Outbox gives reliable publication semantics but does not eliminate
duplicate delivery.

------------------------------------------------------------------------

## 24. Inbox Pattern

Consumer stores processed message identity:

``` text
InboxMessage
-----------------------------
MessageId
Consumer
ProcessedAt
```

Consumer:

``` text
BEGIN

IF MessageId already exists
    ignore duplicate

Perform business operation

INSERT InboxMessage

INSERT resulting Outbox event

COMMIT
```

Use a unique database constraint to handle concurrent duplicate
deliveries safely.

------------------------------------------------------------------------

## 25. At-least-once vs exactly-once

A strong interview answer avoids casually claiming:

> "Our distributed payment system guarantees exactly once."

Instead:

> We design around at-least-once delivery and make financial operations
> idempotent, deduplicated and reconcilable so duplicate transport
> attempts do not create duplicate business effects.

This is a much more practical production model.

------------------------------------------------------------------------

## 26. Webhooks

PSPs often send asynchronous notifications:

``` text
payment.succeeded
payment.failed
refund.completed
```

Webhook architecture:

``` text
PSP
 |
 v
Webhook Endpoint
 |
Verify authenticity
 |
Persist event/deduplication
 |
Process asynchronously
 |
Update Payment state
```

------------------------------------------------------------------------

## 27. Webhook security

Validate according to provider capabilities:

``` text
Signature
Timestamp
Replay window
Expected endpoint secret/certificate
Event format
```

Do not trust a webhook simply because it contains a valid-looking
`PaymentId`.

------------------------------------------------------------------------

# 28. Duplicate webhooks

Assume:

``` text
Webhook A
Webhook A
Webhook A
```

may arrive multiple times.

Use:

``` text
ProviderEventId
```

with a unique constraint or Inbox-style record.

Processing the same provider event twice must not create duplicate
refunds, captures or business events.

------------------------------------------------------------------------

## 29. Out-of-order webhooks

You may receive events in an unexpected order.

Example:

``` text
payment.captured
payment.authorized
```

Use:

-   Provider sequence/version if available
-   State-machine validation
-   Event timestamps carefully
-   Provider status lookup
-   Ignore stale transitions

Never blindly overwrite:

``` text
Captured -> Authorized
```

just because a late event arrived.

------------------------------------------------------------------------

## 30. Reconciliation

Reconciliation compares your internal ledger/payment state with the
external provider's authoritative records.

Example:

``` text
Internal DB               PSP
-----------               ---
Payment A = Captured      Captured
Payment B = Pending       Captured
Payment C = Captured      Refunded
```

B and C require investigation/correction.

------------------------------------------------------------------------

## 31. Why reconciliation is necessary

Even with:

``` text
Idempotency
Outbox
Inbox
Retries
Webhooks
```

rare failures remain possible:

-   Webhook never arrives
-   Network outage
-   Manual PSP operation
-   Internal processing bug
-   Crash during a state transition
-   Provider delay
-   Operational intervention

Reconciliation is the final safety net.

------------------------------------------------------------------------

## 32. Reconciliation process

``` text
Scheduled Reconciliation Worker
          |
          v
Find unresolved/relevant payments
          |
          v
Query PSP / obtain settlement report
          |
          v
Compare internal vs provider state
          |
   +------+------+
   |             |
Match         Mismatch
 |             |
Done       Repair/escalate
```

Possible actions:

-   Update stale internal state
-   Publish missing business event through Outbox
-   Trigger refund review
-   Alert operations
-   Create manual investigation case

Every correction should be auditable.

------------------------------------------------------------------------

# 33. Real-time vs batch reconciliation

Use both where appropriate.

### Real-time reconciliation

For ambiguous individual transactions:

``` text
Payment timeout -> query provider
```

### Scheduled reconciliation

For broader assurance:

``` text
Every N minutes/hours/day
```

depending on business and provider capabilities.

### Settlement reconciliation

Compare financial settlement reports with internal records.

Payment correctness is not complete until money movement and system
records agree.

------------------------------------------------------------------------

# 34. Saga integration

Consider:

``` text
Order
  |
Reserve Inventory
  |
Payment
  |
Shipping
```

Payment is one Saga participant.

Example:

``` text
Saga -> ProcessPayment
          |
          v
Payment Service
          |
          v
PaymentCompleted
```

The Saga should not directly know PSP-specific APIs.

------------------------------------------------------------------------

## 35. Payment succeeds but later Saga step fails

Example:

``` text
Inventory Reserved
Payment Captured
Shipping Failed Permanently
```

The Saga may send:

``` text
CompensatePayment
```

Payment Service decides the correct financial compensation.

------------------------------------------------------------------------

## 36. Void vs Refund

If:

``` text
Payment Authorized
but not captured
```

compensation may be:

``` text
Void Authorization
```

If:

``` text
Payment Captured
```

compensation is usually:

``` text
Refund
```

Therefore the orchestrator should not implement provider-specific logic.

It requests compensation; Payment Service owns payment-domain behavior.

------------------------------------------------------------------------

## 37. Compensation is not rollback

Original:

``` text
Charge +₹5,000
```

Compensation:

``` text
Refund -₹5,000
```

Both remain as financial records.

Never delete the original successful payment to make it look as if it
never happened.

This preserves:

-   Audit history
-   Customer support evidence
-   Financial reconciliation
-   Compliance records

------------------------------------------------------------------------

## 38. What if Refund fails?

``` text
Saga
 |
RefundPayment
 |
 X Provider unavailable
```

Do not mark compensation complete.

Persist:

``` text
RefundPending
```

or:

``` text
CompensationPending
```

Then:

``` text
Safe retry
Provider reconciliation
Alert
DLQ/exception workflow
Manual operations
```

The system must make unresolved money visible.

------------------------------------------------------------------------

## 39. Refund idempotency

Refund operations also require idempotency.

Example:

``` text
RefundKey = ORD-1001-REFUND-1
```

If the refund command is redelivered:

``` text
same key -> same logical refund
```

Do not issue multiple refunds because a message was delivered twice.

------------------------------------------------------------------------

# 40. Partial refunds

A real system may support:

``` text
Payment = ₹10,000

Refund 1 = ₹2,000
Refund 2 = ₹3,000

Remaining captured amount = ₹5,000
```

Validate:

``` text
Total successful refunds <= Captured amount
```

Concurrency controls are essential if multiple refund requests can occur
simultaneously.

------------------------------------------------------------------------

## 41. Concurrency control

Two processes may try to update the same payment.

Use techniques such as:

-   Optimistic concurrency/version columns
-   Atomic conditional updates
-   Unique constraints
-   Carefully scoped transactions

Example:

``` text
UPDATE Payment
SET Status = 'Captured',
    Version = Version + 1
WHERE PaymentId = @id
AND Version = @expectedVersion
```

If zero rows update:

``` text
Concurrent modification occurred
```

Reload and evaluate the current state.

------------------------------------------------------------------------

## 42. Ledger concept

For mature payment systems, prefer an append-oriented financial ledger
rather than relying only on a mutable `Payment.Status`.

Conceptually:

``` text
Payment Operations
--------------------------------
Authorization +5000
Capture       +5000
Refund        -2000
Refund        -3000
```

The exact accounting model depends on the business.

The key interview point is:

> Financial history should be auditable and should not be reconstructed
> solely from overwritten status fields.

------------------------------------------------------------------------

## 43. Payment Adapter Pattern

Do not scatter provider-specific code throughout Payment Service.

``` text
Payment Service
       |
       v
IPaymentProvider
       |
 +-----+------+------+
 |            |      |
PSP A        PSP B  PSP C
```

Conceptual interface:

``` csharp
public interface IPaymentProvider
{
    Task<ProviderPaymentResult> AuthorizeAsync(...);
    Task<ProviderPaymentResult> CaptureAsync(...);
    Task<ProviderRefundResult> RefundAsync(...);
    Task<ProviderPaymentStatus> GetStatusAsync(...);
}
```

This isolates:

-   Authentication
-   Request mapping
-   Provider error codes
-   Idempotency support
-   Webhook differences

------------------------------------------------------------------------

## 44. Provider error classification

Translate provider-specific errors into internal categories.

Example:

``` text
Provider error                 Internal classification
-------------------------------------------------------
Card declined                  PermanentBusinessFailure
Insufficient funds             PermanentBusinessFailure
HTTP 503                       TransientFailure
Network timeout                UnknownOutcome
Rate limit                     Transient/Throttled
Invalid credentials            Configuration/SecurityFailure
```

Retry policy should operate on **meaning**, not merely HTTP status.

------------------------------------------------------------------------

## 45. Dead-Letter Queue

If a payment-related message repeatedly fails:

``` text
ProcessPayment
    |
 retry
    |
 retry
    |
 DLQ
```

For payment workflows, DLQ monitoring must be high priority.

DLQ operations should include:

``` text
Alert
Inspect
Correct root cause
Reconcile financial state
Controlled replay
Audit replay action
```

Never automatically replay financial messages without considering
idempotency and current provider state.

------------------------------------------------------------------------

## 46. Crash scenarios

#### Crash before PSP call

Payment remains:

``` text
Created/Pending
```

Safe recovery can retry.

#### Crash after PSP call but before response

Outcome:

``` text
Unknown
```

Reconcile before retrying.

#### Crash after PSP success but before DB update

Use provider transaction/reference lookup plus reconciliation/webhook to
recover.

## Crash after DB commit but before event publish

Transactional Outbox ensures event remains publishable.

#### Crash after event publish but before Outbox marked published

Duplicate event may occur; consumers use Inbox/idempotency.

This sequence is excellent to explain in interviews.

------------------------------------------------------------------------

## 47. Complete failure matrix

  -----------------------------------------------------------------------
  Failure                             Correct response
  ----------------------------------- -----------------------------------
  User double-clicks Pay              Same idempotency key returns same
                                      logical result

  Two duplicate requests arrive       Unique DB constraint prevents two
  concurrently                        logical operations

  PSP returns card declined           Mark failed; do not retry blindly

  PSP returns transient 503           Bounded idempotent retry

  PSP request times out               Mark unknown/pending verification;
                                      query/reconcile

  PSP charged but response lost       Reconciliation/webhook confirms
                                      success

  Payment DB updated but event not    Outbox publishes later
  published                           

  Outbox event published twice        Consumer Inbox/idempotency handles
                                      duplicate

  Duplicate PSP webhook               ProviderEventId deduplication

  Out-of-order webhook                State/version validation or
                                      provider lookup

  Shipping fails after payment        Saga requests void/refund
  capture                             compensation

  Refund command delivered twice      Refund idempotency key prevents
                                      double refund

  Refund fails temporarily            RefundPending +
                                      retry/reconciliation

  Refund repeatedly fails             Alert + exception/DLQ + manual
                                      recovery

  Payment Service pod crashes         Durable DB/message state allows
                                      recovery
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 48. Security

Payment security must be designed from the beginning.

Use:

``` text
TLS
OAuth2/OIDC
Service authorization
Managed Identity
Key Vault
Least privilege
Network restrictions
Audit logging
```

Never store:

``` text
Raw card data
CVV
Sensitive secrets
```

unless the system is explicitly designed and certified to handle that
data.

Prefer provider-hosted/tokenized payment flows to reduce sensitive data
exposure where the product architecture allows it.

------------------------------------------------------------------------

## 49. Secrets

Store unavoidable secrets such as:

``` text
PSP API credentials
Webhook signing secrets
Certificates
```

in:

``` text
Azure Key Vault
```

Prefer Managed Identity for Azure-resource access so many infrastructure
credentials disappear entirely.

------------------------------------------------------------------------

# 50. Observability

Every payment should be traceable without exposing sensitive financial
data.

Useful identifiers:

``` text
PaymentId
OrderId
AttemptId
IdempotencyKey hash/reference
ProviderTransactionId
CorrelationId
TraceId
MessageId
```

Do not log full card data, tokens or secret credentials.

------------------------------------------------------------------------

## 51. Distributed tracing

Use OpenTelemetry.

``` text
Trace
 |
Order Service
 |
Service Bus
 |
Payment Consumer
 |
PSP HTTP Call
 |
Payment DB
 |
Outbox
```

For asynchronous messages, propagate tracing context through message
metadata.

------------------------------------------------------------------------

## 52. Important payment metrics

Track:

``` text
Payment attempts/sec
Authorization success rate
Capture success rate
Payment failure rate
Timeout rate
Unknown-state count
P95/P99 PSP latency
Refund success/failure rate
Pending refund age
Webhook processing lag
Queue depth
DLQ count
Reconciliation mismatch count
```

Business metrics matter as much as CPU/memory.

------------------------------------------------------------------------

## 53. Alerts

High-value alerts include:

``` text
Sudden payment success-rate drop
PSP latency increase
Unknown payments above threshold
Refund failures
DLQ growth
Webhook backlog
Reconciliation mismatch
Outbox backlog
```

Alert on user/business impact rather than every minor infrastructure
fluctuation.

------------------------------------------------------------------------

## 54. Scalability

Keep Payment API/worker instances stateless where practical.

``` text
Payment Workers

Pod 1
Pod 2
Pod 3
...
```

Scale consumers using queue backlog/KEDA where appropriate.

But PSP throughput limits may be the bottleneck.

Adding 100 pods does not help if the provider allows:

``` text
500 requests/sec
```

Use backpressure, queueing and rate limits.

------------------------------------------------------------------------

## 55. High availability

Design for:

``` text
Multiple service replicas
Multiple AKS nodes/zones where required
Highly available database
Durable messaging
Backups
Restore testing
Provider failover strategy if business supports multiple PSPs
```

Multi-PSP architecture is possible but introduces routing,
reconciliation and behavioral complexity. Do not add it unless
availability/business requirements justify it.

------------------------------------------------------------------------

## 56. Example payment endpoint

Conceptually:

``` http
POST /api/payments
Idempotency-Key: ORD-1001-PAYMENT-1
Authorization: Bearer ...
```

Request:

``` json
{
  "orderId": "ORD-1001",
  "amount": 5000,
  "currency": "INR",
  "paymentMethodToken": "token-from-provider"
}
```

Possible response:

``` json
{
  "paymentId": "PAY-9001",
  "status": "Pending"
}
```

The API should not imply final success until final state is actually
known.

------------------------------------------------------------------------

# 57. Why not use OrderId alone as idempotency key?

One order may legitimately have multiple payment attempts.

Example:

``` text
Attempt 1 -> Card A declined
Attempt 2 -> Card B succeeds
```

Therefore distinguish:

``` text
OrderId
PaymentId
PaymentAttemptId
IdempotencyKey
```

The exact idempotency scope must match the business operation.

------------------------------------------------------------------------

## 58. Idempotency-key lifecycle

Decide:

``` text
Scope
Retention
Expiration
Conflict behavior
Response storage
```

Do not delete idempotency records so quickly that a delayed retry can
create a second charge.

Retention should reflect business/provider retry windows and operational
requirements.

------------------------------------------------------------------------

## 59. Payment + Order Saga example

``` text
Order Created
     |
Reserve Inventory
     |
Inventory Reserved
     |
Process Payment
     |
Payment Captured
     |
Create Shipment
     |
Shipment Failed Permanently
     |
Compensate Payment
     |
Refund Completed
     |
Release Inventory
     |
Order Cancelled
```

Every transition should be durable and observable.

------------------------------------------------------------------------

## 60. What if compensation order matters?

Suppose shipping failed.

Potential compensation:

``` text
Refund Payment
Release Inventory
Cancel Order
```

The exact order depends on business invariants.

For example, you may want to keep inventory reserved until refund
initiation succeeds, or release it immediately to improve availability.

There is no universal sequence.

Explain the trade-off and define explicit workflow states.

------------------------------------------------------------------------

## 61. Payment API status endpoint

Expose:

``` http
GET /api/payments/{paymentId}
```

Possible states:

``` text
Pending
Authorized
Captured
Failed
Unknown
RefundPending
PartiallyRefunded
Refunded
```

This lets clients and internal systems retrieve authoritative state
instead of repeatedly creating payment requests.

------------------------------------------------------------------------

## 62. Reconciliation example

Suppose internal state:

``` text
PAY-100 = Unknown
```

Provider query returns:

``` text
Captured
ProviderTransactionId = PSP-789
```

Reconciliation transaction:

``` text
BEGIN

UPDATE Payment
SET Status = 'Captured',
    ProviderPaymentId = 'PSP-789'

INSERT AuditRecord

INSERT OutboxMessage(PaymentCaptured)

COMMIT
```

Now downstream systems receive the missing event reliably.

------------------------------------------------------------------------

## 63. Webhook + API response race

Possible sequence:

``` text
1. PSP processes payment
2. PSP webhook arrives quickly
3. Original API response arrives later
```

Both paths may attempt to update the same Payment.

Use:

``` text
State-machine validation
Provider transaction identity
Optimistic concurrency
Idempotent processing
```

Do not assume the synchronous API response always arrives before the
webhook.

------------------------------------------------------------------------

## 64. Why Redis alone should not provide payment idempotency

Redis can be useful for fast coordination or caching, but financial
idempotency should normally have a durable source of truth.

If Redis loses/evicts the key:

``` text
duplicate payment could be processed
```

Prefer durable DB uniqueness/state for the authoritative idempotency
guarantee.

Redis may supplement it, not replace it blindly.

------------------------------------------------------------------------

## 65. Database transaction boundaries

Use local ACID transactions for internal state:

``` text
Payment state
Inbox
Outbox
Audit/ledger entries
```

Do not normally hold a DB transaction open while waiting several seconds
for an external PSP.

A common design is:

``` text
1. Persist PaymentAttempt = Processing
2. Commit
3. Call PSP
4. Persist known result + Outbox atomically
```

If step 3's outcome is ambiguous, move to `Unknown/PendingVerification`
and reconcile.

------------------------------------------------------------------------

## 66. Rate limiting

Protect:

``` text
Payment API
PSP quota
Refund endpoint
Webhook endpoint
```

Rate limits can be applied by:

``` text
API Gateway
Payment Service
Provider adapter
```

Use separate limits for different operation costs.

Payment submission and payment-status reads should not necessarily have
identical limits.

------------------------------------------------------------------------

## 67. Fraud and risk boundary

A production payment architecture may have:

``` text
Payment Service
Risk/Fraud Service
```

The exact ordering depends on the business:

``` text
Risk check
   |
Authorize
```

or provider-managed risk evaluation.

Keep fraud rules separate when they form an independently evolving
business capability.

------------------------------------------------------------------------

## 68. Testing strategy

#### Unit tests

Test:

``` text
State transitions
Idempotency conflicts
Retry classification
Refund calculations
Saga compensation rules
```

#### Integration tests

Test:

``` text
Database uniqueness
Outbox
Inbox
Service Bus
PSP adapter sandbox
Webhook verification
```

#### Failure tests

Simulate:

``` text
Timeout after provider success
Duplicate request
Concurrent duplicate request
Duplicate webhook
Out-of-order webhook
Crash after PSP success
Crash after DB commit
Duplicate Outbox publish
Refund failure
Reconciliation mismatch
```

#### Load tests

Measure:

``` text
Throughput
P95/P99
DB contention
Queue lag
Provider throttling
```

------------------------------------------------------------------------

## 69. Architecture trade-offs

  ----------------------------------------------------------------------------
  Decision                Benefit                 Trade-off
  ----------------------- ----------------------- ----------------------------
  Dedicated Payment       Central payment         Service complexity
  Service                 rules/audit             

  Durable idempotency     Prevent duplicate       Storage/lifecycle management
                          financial effects       

  PSP idempotency         Extra duplicate         Provider-specific behavior
                          protection              

  Outbox                  Reliable event          Publisher/cleanup complexity
                          publication             

  Inbox                   Duplicate event         Additional storage
                          protection              

  Async messaging         Decoupling/recovery     Eventual consistency

  Saga                    Distributed workflow    Compensation complexity
                          consistency             

  Reconciliation          Detects rare mismatches Operational cost

  Append-style ledger     Strong auditability     More modeling/reporting
                                                  complexity

  Circuit breaker         Protects unhealthy      Must handle open-state
                          dependency              business flow

  AKS autoscaling         Elastic workers         Cannot exceed PSP/DB limits

  Multiple PSPs           Potential               Major
                          availability/routing    reconciliation/integration
                          flexibility             complexity
  ----------------------------------------------------------------------------

------------------------------------------------------------------------

## 70. Common interview mistakes

### Mistake 1

> "If payment times out, retry."

Better:

> Timeout means unknown outcome. Reconcile or retry using the same
> provider idempotency identity.

### Mistake 2

> "The broker guarantees exactly once."

Better:

> Design for at-least-once delivery with idempotent business effects.

### Mistake 3

> "If shipping fails, rollback payment."

Better:

> Execute an auditable void/refund compensation.

### Mistake 4

> "Redis prevents duplicate payments."

Better:

> Use durable idempotency and database uniqueness; Redis can be
> supplementary.

### Mistake 5

> "Webhook tells us the truth, so just update status."

Better:

> Authenticate, deduplicate and validate state transitions because
> webhooks can be duplicated or out of order.

### Mistake 6

> "Retry three times everywhere."

Better:

> Retry only transient, safe operations and coordinate retry ownership.

### Mistake 7

> "Payment status is one mutable row."

Better:

> Preserve attempts, provider references, refunds and auditable
> financial history.

------------------------------------------------------------------------

## 71. Whiteboard answer

Draw:

``` text
Order Service
     |
     | ProcessPayment
     v
Service Bus
     |
     v
+----------------------+
| Payment Service      |
|                      |
| Idempotency          |
| State Machine        |
| Outbox / Inbox       |
| Reconciliation       |
+----+-------------+---+
     |             |
     v             v
 Payment DB      PSP Adapter
                     |
                     v
               Payment Provider
                     |
                  Webhook
                     |
                     v
               Payment Service
```

Then explain in this order:

``` text
1. Payment state model
2. Idempotency key
3. DB unique constraint
4. Provider idempotency
5. Timeout = unknown
6. Retry policy
7. Outbox/Inbox
8. Webhook deduplication
9. Reconciliation
10. Saga compensation
11. Refund idempotency
12. Crash recovery
13. Security
14. Observability
15. Scaling
```

------------------------------------------------------------------------

## 72. Two-minute interview answer

> I design Payment as a dedicated bounded context that owns payment
> attempts, provider references, authorization/capture, refunds,
> idempotency and reconciliation. The most important requirement is
> preventing duplicate financial side effects.
>
> Every logical payment operation receives an idempotency key. I persist
> it durably with a request hash and enforce uniqueness in the database,
> so concurrent duplicate requests cannot create two logical payments.
> If the PSP supports idempotency, I propagate a stable provider
> idempotency key as an additional layer.
>
> I treat timeouts carefully. A timeout does not mean the payment
> failed; the provider may have captured the money while the response
> was lost. In that case I mark the payment as Unknown or
> PendingVerification and query/reconcile the PSP using the
> merchant/provider reference rather than blindly issuing another
> charge.
>
> I retry only transient and idempotent operations using bounded
> exponential backoff and jitter. For asynchronous communication I use
> Transactional Outbox for reliable publishing and Inbox/idempotent
> consumers for duplicate delivery. PSP webhooks are authenticated,
> deduplicated and validated against the payment state machine.
>
> Payment participates in the Order Saga. If a later step such as
> Shipping permanently fails after capture, the Saga requests
> compensation. Payment Service performs a void if only authorized or an
> auditable refund if already captured. Refund commands are idempotent
> as well. If refund fails, I keep the workflow in
> RefundPending/CompensationPending and use retries, reconciliation,
> alerts and manual recovery.
>
> Finally, I continuously reconcile internal payment state with provider
> records because idempotency and messaging reduce failures but cannot
> eliminate every ambiguous external-system outcome.

------------------------------------------------------------------------

## 73. Rapid revision

``` text
DUPLICATE PAYMENT PREVENTION
=
Idempotency Key
+
Request Hash
+
Unique DB Constraint
+
Stable PSP Reference/Idempotency
```

``` text
TIMEOUT
!=
PAYMENT FAILED

TIMEOUT
=
OUTCOME UNKNOWN
```

``` text
RELIABLE EVENTS
=
Local Transaction
+
Outbox
+
At-Least-Once Delivery
+
Inbox / Idempotent Consumer
```

``` text
SHIPPING FAILED AFTER CAPTURE
=
Void/Refund Payment
+
Release Inventory
+
Cancel Order
```

``` text
REFUND FAILED
=
CompensationPending
+
Safe Retry
+
Reconciliation
+
Alert
+
Manual Recovery
```

``` text
PAYMENT CORRECTNESS
=
Idempotency
+
State Machine
+
Audit/Ledger
+
Reconciliation
+
Observability
```

------------------------------------------------------------------------

## Final Interview Statement

> A production payment system must assume requests, messages and
> webhooks can be duplicated, responses can be lost, and
> external-provider outcomes can become temporarily unknown. I therefore
> build correctness around durable idempotency, database uniqueness,
> explicit payment states, provider references, Outbox/Inbox, safe
> retries and reconciliation. I never interpret a timeout as proof of
> failure, and I never describe a refund as a rollback. Saga
> compensation creates a new auditable financial transaction, while
> reconciliation provides the final safety net when distributed state
> differs from the payment provider.

![payment_system.png](/images/system-designs/payment_system/payment_system.png)

![prevent_duplicate_payement.png](/images/system-designs/payment_system/prevent_duplicate_payement.png)

![prevent_duplicate_payement.png](/images/system-designs/payment_system/duplicate_invoice_payement.png)

![prevent_duplicate_payement.png](/images/system-designs/payment_system/prevent_duplicate_payement_1.png)

![prevent_duplicate_payement.png](/images/system-designs/payment_system/prevent_duplicate_payement_2.png)

![prevent_duplicate_payement.png](/images/system-designs/payment_system/idempotency.png)

![prevent_duplicate_payement.png](/images/system-designs/payment_system/idempotency_2.png)

