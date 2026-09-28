---
id: azure-questions-002
slug:  azure-questions
title: Azure Interview Questions and Answers for Experienced
categoryId: azure
subcategory: Azure Interview Preparation for Experienced .NET Developers
difficulty: Experienced
tags:
  - azure
  -  Azure Functions
  - App Service
  - AKS
  - Azure Container Apps
  - Azure App Service
  - Azure Service Bus
  - Queue and Topic 
  - Event Grid
  - Azure AD
  - Azure AI Services
  - Azure architecture

summary: Azure Interview Questions and Answers for Experienced
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---

# Azure Interview Questions and Answers for Experienced .NET Developers

> Updated September 2026. Designed for a Markdown static site. Answers are talking points: explain the trade-off, describe an implementation, then name a failure mode. Service capabilities and plan limits change; verify the selected tier and region before designing production systems. Microsoft Entra ID is the current name for Azure AD.

## Contents

- [Azure Functions](#azure-functions)
- [Azure Service Bus](#azure-service-bus)
- [Azure Event Grid](#azure-event-grid)
- [Azure Event Hubs](#azure-event-hubs)
- [Azure API Management](#azure-api-management-apim)
- [Azure Security](#azure-security)
- [Azure Authentication](#azure-authentication)
- [Azure Monitoring](#azure-monitoring)
- [Azure Storage](#azure-storage)
- [Azure Kubernetes Service](#azure-kubernetes-service-aks)
- [Architecture scenarios](#azure-architecture-and-scenario-questions)
- [Top 15 quick review](#top-15-quick-review)
- [Microsoft Learn references](#microsoft-learn-references)

## Azure Functions

### 1. What is Azure Functions?
Azure Functions is event-driven compute: code runs in response to an HTTP request, message, timer or other trigger. The platform handles host startup and scaling according to the selected plan. A function is suitable for a bounded unit of work, such as processing a document-upload event. It is not automatically a good fit for a large, cohesive Web API. In .NET, distinguish the isolated worker programming model from legacy in-process code; check the current runtime support for your chosen .NET version.

### 2. Azure Functions versus App Service?
| Concern | Functions | App Service Web API |
| --- | --- | --- |
| Main model | Triggered handlers | Continuously hosted HTTP application |
| Scale | Trigger-based, plan-dependent | App/plan scaling rules |
| Best fit | Background events, schedules, small endpoints | Related API endpoints and conventional web hosting |
| Costs | Consumption-based or provisioned, depending on plan | Provisioned plan capacity |

A Function App itself runs on Azure App Service infrastructure, so these aren't completely separate technologies. Choose based on workload, latency, execution duration, networking and operations. For Protocol Pro, an API could handle authoring while a Function processes queued documents.

### 3. What are triggers?
A trigger starts a function invocation. Common examples: `HttpTrigger`, `TimerTrigger`, `ServiceBusTrigger`, `QueueTrigger`, `BlobTrigger` and Event Grid trigger. Exactly one trigger starts a given function. Triggers differ in delivery and retry behavior; an HTTP caller expects a response, while a broker trigger may redeliver after a failure. Make side effects idempotent.

### 4. What are bindings?
Bindings declaratively connect a function to input or output services. A trigger is a special input binding; additional input bindings read data and output bindings write it. For complex transactions and error handling, use Azure SDK clients directly, because output bindings may hide the point of failure or settlement. Never assume a binding gives a transaction spanning your database and messaging service.

### 5. What are Durable Functions?
An extension for stateful workflows built from orchestrator, activity and entity functions. Runtime checkpoints let an orchestration survive restarts and wait for events. Patterns include fan-out/fan-in, chaining and human approval. Orchestrator code replays: keep it deterministic, move I/O to activities, use replay-aware logging and design idempotent activities. For example, process 100 uploaded documents in parallel, collect results, then notify the writer.

### 6. How do you secure Functions?
Require HTTPS, authenticate HTTP endpoints through App Service Authentication with Entra ID or validate JWTs in the application, and enforce scopes/roles for operations. A function key is a shared secret, not a user identity. Give the Function App a managed identity for outbound access; apply least-privilege data RBAC, Key Vault, network restrictions/private endpoints and safe logging. Differentiate Azure RBAC for managing the app from application authorization for calling it.

### 7. How do you monitor Functions?
Connect workspace-based Application Insights; inspect invocations, duration, failures, exceptions and dependency calls. Add structured business identifiers and distributed trace context. Track queue lag and dead letters for triggered processing; an invocation success metric alone cannot establish that a document was correctly indexed. Configure sampling and retention deliberately.

### 8. How do you alert on failure?
Create Azure Monitor metric or log alert rules scoped to the Function App/Application Insights workspace. Alert on sustained failed executions, exceptions, duration, queue age and DLQ size; link an action group for email/webhook/incident management. Set a threshold and evaluation window that avoids noise, and test a deliberate failure. For critical work, alert on absence of successful processing as well as explicit errors.

### 9. How do recurring jobs work?
Use a timer-triggered function with an NCRONTAB expression, e.g. `0 0 2 * * *` for 02:00 in the configured schedule timezone (Azure defaults commonly use UTC). Verify hosting-plan and OS support for timezone settings. Timer scheduling is not a business guarantee of exactly-once completion: persist a job-run key, make work idempotent, monitor missed executions, and separate long batches into queued items.

### 10. How do you manage state?
Ordinary Functions should be stateless between invocations. Store durable business state in SQL/Cosmos DB/Storage, intermediate work in Service Bus or Blob, and shared ephemeral data in Redis. Durable Functions persists orchestration state through its provider; it is not a substitute for your domain database. Pass identifiers rather than large payloads and use optimistic concurrency or idempotency keys on updates.

### 11. How do you deploy Functions?
Build/test with .NET and Functions-compatible tooling, publish the correct project and runtime artifacts, configure settings per environment, then deploy using Azure DevOps, GitHub Actions, Azure CLI or Core Tools. Use a protected service connection/workload federation, deployment slots where supported by the hosting plan, smoke tests and rollback strategy. Validate trigger indexing, storage connectivity, identity/RBAC and networking after deployment; a successful package upload alone is insufficient.

### 12. Consumption versus Premium versus Dedicated?
| Hosting | Scaling/cost | Typical choice |
| --- | --- | --- |
| Consumption | Event-driven, pay for executions/resources, possible cold start and limits | Intermittent workloads without stringent latency |
| Flex Consumption | Newer Linux consumption model with flexible scaling and optional always-ready capacity | New event-driven workloads needing its capabilities |
| Elastic Premium | Event scaling plus prewarmed instances and advanced networking | Low cold-start tolerance or sustained/event bursts |
| Dedicated/App Service plan | Existing provisioned App Service capacity, scaling configured on plan | Continuous load or shared plan capacity |

Check current plan-specific timeout, VNet, slot, OS and scale constraints. “Premium is always faster” is too vague: warm capacity, dependencies and code determine latency.

## Azure Service Bus

### 1. What is Service Bus?
A managed enterprise broker for durable messages. Queues support competing consumers; topics support subscription fan-out. Features include peek-lock settlement, retry/redelivery, dead-letter queues, sessions, scheduled messages and duplicate detection. Use the current `Azure.Messaging.ServiceBus` SDK in .NET; older SDKs/protocols have retirement dates. The broker decouples producer and consumer availability but does not guarantee exactly-once business effects.

### 2. Queue versus Topic?
A queue represents one logical work stream; multiple workers compete and one receives each delivery. A topic copies each published message into matching subscriptions; each subscription has its own queue-like delivery path and filters. Example: `ProcessDocument` command to a queue; `DocumentProcessed` event to a topic with search-index, notification and audit subscriptions.

### 3. Service Bus versus Event Hubs?
Service Bus brokers individual business messages with settlement, DLQ, sessions and targeted workflow. Event Hubs ingests high-volume partitioned event streams with retention and consumer offsets. Choose Service Bus for payment commands and document jobs; Event Hubs for millions of telemetry readings. Event Hubs consumers can replay retained events; completing a Service Bus message removes it from the active entity.

### 4. When use a Queue?
When one logical worker group should perform a task asynchronously: generate PDF, send email, process a file. It absorbs spikes and tolerates temporary worker outages. Scale consumers while controlling concurrency and downstream load. Put a reference and stable message ID in the message, not a large file body.

### 5. When use a Topic?
When several independent systems must react to the same published fact. Each subscription has separate delivery state and optional SQL/correlation filters. For `StudyApproved`, notifications, compliance audit and reporting each consume independently. Model topics around events that happened; do not pretend a single transactional command was executed by all subscribers atomically.

### 6. What is a Dead Letter Queue?
A secondary subqueue holding messages that cannot be delivered or processed, for example after maximum delivery count, TTL expiration when configured, or explicit dead-lettering. Capture dead-letter reason/description, alert on accumulation, diagnose and replay safely after correction. It is not a trash bin: ownership, retention and replay procedures matter.

### 7. How do you ensure reliability?
Persist the producer's business change and outgoing message intent with an outbox when both must succeed; publish asynchronously. Give messages stable IDs and consumers an inbox/idempotency record. Use peek-lock, complete only after successful side effects, abandon on transient failure and dead-letter poison messages. Define TTL, retry bounds, lock renewal, monitoring and recovery. No cross-resource transaction is implied by sending to Service Bus.

### 8. How do retries work?
The client SDK retries transient transport errors, but business-processing retries are different. Under peek-lock, an exception/abandon or expired lock leads to redelivery; delivery count rises and eventually reaches DLQ at `MaxDeliveryCount`. For downstream outages, use bounded exponential backoff or scheduled retry messages to avoid hot loops; dead-letter non-retryable validation errors. Ensure repeated calls do not duplicate side effects.

### 9. How do you deduplicate?
Enable broker duplicate detection on supported tiers/entities and send a deterministic `MessageId` within its configured detection window. This filters duplicate **sends**, not duplicate **processing** after lock loss, beyond-window sends or downstream writes. Keep an idempotency key in the consumer's database and use a unique constraint/transaction to protect the business effect.

### 10. What is Peek Lock?
A receive mode that locks a message temporarily without deleting it. After successful work, call `Complete`; otherwise `Abandon`, `DeadLetter`, `Defer`, or let the lock expire. Use auto lock renewal or appropriately sized tasks for long processing. `Peek` for browsing is different from `PeekLock` receive mode. A lost lock can cause redelivery even if the first attempt completed an external side effect.

### 11. What is a session-enabled Queue?
Messages sharing a `SessionId` are grouped for ordered, exclusive processing by one session receiver at a time. Use for per-order or per-study workflows requiring order. Session state can store small workflow context, but the domain database remains authoritative. Sessions reduce parallelism within one key; a hot session can bottleneck throughput.

### 12. How do multiple subscribers consume messages?
Publish once to a topic; create a subscription per independent consumer. Each gets matching messages and manages its own lock, retry and DLQ. Multiple instances *within the same subscription* compete; they do not each get a copy. Filters can select event types or tenants, but enforce actual tenant authorization in the receiving service too.

**.NET sketch:**

```csharp
using Azure.Identity;
using Azure.Messaging.ServiceBus;

await using var client = new ServiceBusClient(
    "my-namespace.servicebus.windows.net", new DefaultAzureCredential());
await using var sender = client.CreateSender("document-jobs");
await sender.SendMessageAsync(new ServiceBusMessage("{\"documentId\":\"123\"}")
{
    MessageId = "process-document-123-v2",
    ContentType = "application/json",
    CorrelationId = "study-456"
});
```

Grant the producer **Azure Service Bus Data Sender** on the entity/namespace; the consumer needs Data Receiver. A production handler also needs schema validation, idempotency, correlation and a poison-message policy.

## Azure Event Grid

### 1. What is Event Grid?
An event-routing service for notifications that something happened. Sources publish events; subscriptions filter and deliver them to endpoints such as Functions, webhooks or Service Bus. It suits reactive integration, for example BlobCreated prompting document ingestion. Send small event metadata and retrieve large content from its source.

### 2. Event Grid versus Service Bus?
Event Grid routes discrete events to subscribers, with filtering and delivery retry. Service Bus brokers durable work messages and supplies lock/settlement, sessions, DLQ and richer workflow semantics. If a BlobCreated event should trigger a durable multi-step processor, Event Grid can route it into Service Bus; they can complement one another.

### 3. When use Event Grid?
For reactive notifications from Azure resources or custom domains: file added, resource changed or business event published. It is useful when several handlers need to react quickly and filtering avoids polling. Handlers must tolerate duplicate delivery, retry and out-of-order events. If the work requires ordered per-customer commands, consider Service Bus sessions.

### 4. How does Pub/Sub work?
A publisher emits an event to a topic (system, custom or partner); Event Grid matches subscriptions and delivers a copy to each matching destination. Publishers need not know consumers. Each subscription has its own filtering and delivery configuration. A subscriber should acknowledge quickly and hand long-running work to a queue or durable orchestrator.

### 5. What are Event Subscriptions?
Resources describing where events go, which event types/subjects/advanced filters match, and delivery/dead-letter settings. Subscription validation confirms webhook ownership. Monitor delivery failures, configure retry/dead-letter destination where supported, and ensure endpoints authenticate and verify events according to the integration mode.

### 6. Which Azure services can publish?
Examples include Blob Storage, Event Hubs, Service Bus, Azure Resource Manager and many other Azure resource providers; custom applications can publish to custom topics/domains. Supported event types vary by resource and change over time. For Blob uploads, select the precise event type, container subject filter and storage account scope; verify whether the event is emitted at the point your workflow expects.

## Azure Event Hubs

### 1. What is Event Hubs?
A managed ingestion service for high-volume event streams. Producers append to partitions; consumer groups read retained events and maintain checkpoints. Use for telemetry, IoT and clickstreams. It is an event log, not a broker that individually completes/deletes business commands.

### 2. Event Hubs versus Service Bus?
Event Hubs optimizes throughput, partitions, retention and independent stream readers. Service Bus optimizes individual business messages, completion/dead-lettering and workflow features. If the requirement says “replay last hour of sensor data for a new analytics model,” Event Hubs; if it says “process this invoice exactly once at the business level with retries and DLQ,” Service Bus plus idempotency.

### 3. Event Hubs versus Kafka?
Both use partitioned append-only logs and consumer offsets. Event Hubs is an Azure-managed service that offers a Kafka-compatible endpoint for supported Kafka clients, avoiding operation of Kafka brokers. Compare protocol feature compatibility, retention, ecosystem needs, pricing and operational control; do not assume all Kafka broker/admin capabilities map one-to-one.

### 4. What is a Partition?
An ordered append-only event sequence and unit of parallelism. Events with the same partition key route consistently to a partition, preserving order **within** that partition, not across the hub. More partitions allow more parallel readers but increase management/cost considerations and do not fix a hot partition key.

### 5. What is a Consumer Group?
An independent view of the same event stream. Analytics and anomaly detection can each have their own group and checkpoints. Within one group, processors divide partitions so only one active processor owns a partition at a time in typical processor coordination. Separate groups for genuinely independent applications.

### 6. How do you process millions of events?
Partition by a well-distributed stable key, choose appropriate throughput capacity, batch sends, and use `EventProcessorClient` with Blob checkpoint storage or a managed downstream stream processor. Scale consumers up to partition count for a group, apply backpressure, batch writes downstream, and monitor incoming/outgoing throughput, lag, throttling and checkpoint age. Plan for duplicate processing around failures and idempotent sinks.

### 7. Real IoT scenario?
Millions of sensors send readings through IoT Hub or directly to Event Hubs according to device-management needs. Partition by device/site key, ingest to an anomaly-detection processor and an archival consumer group. Archive raw data to Blob/Data Lake, compute rolling windows, and send actionable anomalies to Service Bus for notification workflows. Handle out-of-order readings using event time and tolerate duplicate arrivals.

## Azure API Management (APIM)

### 1. What is APIM?
A managed API gateway and publication platform. The gateway processes inbound/backend/outbound/on-error policies; the management plane defines products, APIs and versions, and a developer portal can support consumers. It centralizes cross-cutting policies but does not replace application authorization and domain logic.

### 2. Why use it?
Centralize external API exposure, authentication checks, quotas, transformations, caching, versioning and analytics across services. It reduces repeated gateway concerns in each API. Evaluate tier, network requirements, cost and operational overhead; a small internal API might not need the platform.

### 3. How secure APIs with APIM?
Enforce HTTPS, validate Entra access tokens and required claims, limit rates, restrict origin/IP where appropriate, and authenticate APIM to private backends using managed identity. Keep the backend inaccessible except through trusted routes when that is the design, and enforce resource authorization at the backend. Subscription keys can meter consumers but are not a substitute for JWT authentication.

### 4. How validate JWT in APIM?
For Microsoft Entra tokens, use `validate-azure-ad-token` where appropriate; `validate-jwt` supports OIDC metadata/issuer/audience and required claims. Example shape (adjust tenant, audience, policy capability and claim rules to your issuer):

```xml
<policies>
  <inbound>
    <base />
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401"
                  require-scheme="Bearer">
      <openid-config url="https://login.microsoftonline.com/TENANT_ID/v2.0/.well-known/openid-configuration" />
      <audiences><audience>api://YOUR_API_APP_ID</audience></audiences>
    </validate-jwt>
  </inbound>
  <backend><base /></backend>
  <outbound><base /></outbound>
  <on-error><base /></on-error>
</policies>
```

Validate tenant/issuer and scope/role as well as audience. Policies should be tested with expired, wrong-audience and wrong-tenant tokens. The API must still check business-level access.

### 5. How implement rate limiting?
Use APIM `rate-limit-by-key` with an authenticated user/client-derived key and suitable calls/renewal period, and optionally `quota-by-key` for longer-term limits. A per-subscription key may allow many users to share a quota; choose the actual fairness boundary. Return 429 with useful retry guidance and monitor throttling. Distributed rate-limit behavior and feature availability depend on gateway tier and deployment topology.

### 6. How validate requests without code?
Import an OpenAPI definition and apply policies such as `validate-parameters`, `validate-headers`, `validate-content` with JSON/XML schemas, payload size limits and JWT claims. These catch malformed requests at the gateway. The backend still validates business invariants, authorization and any schema details APIM does not express.

### 7. How do policies work?
XML policy statements execute in pipeline sections: inbound, backend, outbound and on-error. Scope can be global, workspace, product, API or operation as supported; `<base />` includes inherited policies. Common policies rewrite URLs, set headers, validate tokens, limit rates, authenticate managed identity and transform responses. Keep policy changes in source control and test effective inheritance to avoid accidentally bypassing security.

### 8. Public API with private backend?
Expose APIM's public gateway endpoint while connecting it to a private App Service/AKS backend using a supported APIM tier/network mode, VNet connectivity, private endpoint and DNS. Restrict backend public ingress or require APIM identity so clients cannot bypass the gateway. Network modes differ by APIM tier and generation; verify exact feature/region. An APIM public endpoint does not automatically give the gateway reachability to a private backend.

### 9. APIM in multiple regions?
Use a tier supporting multi-region gateway deployment, add regions and route users to nearby gateways, or deploy separate regional APIM instances behind Front Door depending on requirements. Deploy backends regionally, align policies/certificates, account for control-plane and configuration propagation, and test regional failure. The gateway being multi-region does not make a single-region database resilient.

### 10. How version APIs?
Use APIM version sets with URL path, header or query-string versioning, and revisions for nonbreaking changes to one API version. For major incompatible changes expose `/v2` (or documented header strategy) while keeping `/v1` for a deprecation period. Version DTOs/contracts and backend behavior, publish migration guidance and monitor usage before retiring old versions.

## Azure Security

### 1. What is Key Vault?
A managed store for secrets, cryptographic keys and certificates, with identity-based access and auditing. Secrets may be read by authorized applications; keys can support cryptographic operations and certificate management handles lifecycle. Set access through Azure RBAC or vault access policies according to configured permission model; do not grant broad Contributor access as a replacement for data-plane roles.

### 2. Why use it?
Avoid hardcoded credentials and centralize access/rotation/audit. Separate environments and grant each workload only what it needs. Key Vault does not automatically rotate application database passwords or refresh every in-memory cache; plan the entire rotation process and availability dependencies.

### 3. What is Managed Identity?
An Entra service principal lifecycle managed by Azure for a supported resource. The application gets tokens from the Azure identity endpoint/SDK without holding a client secret. Grant resource-specific RBAC to that principal and use `DefaultAzureCredential` on Azure. Authentication, authorization and network access are three distinct requirements.

### 4. System-assigned versus user-assigned?
System-assigned identity belongs to one resource and is deleted with it; ideal for straightforward one-app permissions. User-assigned identity is an independent resource attachable to multiple supported hosts; useful when identity must persist across redeployment or be shared deliberately. Sharing expands blast radius, so prefer one identity per workload/security boundary.

### 5. How do Functions access Key Vault?
Enable Function App managed identity, grant `Key Vault Secrets User` for RBAC-based vaults, configure vault network/DNS access, then use Key Vault references in app settings or `SecretClient` with `DefaultAzureCredential`. For a user-assigned identity, set the appropriate identity selection in configuration/credential. Never write retrieved secrets to logs. Check refresh semantics when rotating.

### 6. How does a .NET API access Key Vault?
In App Service, use managed identity with `@Microsoft.KeyVault(SecretUri=...)` app-setting references, or add the Key Vault configuration provider/use `SecretClient`. The API reads a configuration key normally without storing the value in code. Local developers authenticate through their own Entra accounts; production identity receives scoped access. Validate vault firewall/private endpoint access separately.

### 7. How do you secure secrets?
Keep them out of repositories, frontend assets, pipeline logs and container layers. Prefer secretless Entra auth; otherwise Key Vault with least privilege, rotation, soft delete/purge protection, private networking if required and audit alerts. Use workload identity federation for CI/CD where possible. Scan source/history for accidental exposure and rotate exposed values, not merely delete a commit.

### 8. How secure connection strings?
Prefer Entra authentication for Azure SQL/Storage where supported, eliminating passwords. If a password is unavoidable, keep it in Key Vault, reference it from the host, restrict DB firewall/private access, encrypt traffic and rotate it. App Service settings are environment configuration, but Key Vault gives centralized lifecycle/audit. Do not return connection strings in diagnostic endpoints.

### 9. How secure Azure SQL?
Use Entra authentication and contained database users/groups with minimum SQL permissions, disable or restrict SQL authentication where possible, configure private endpoint/firewall, require encrypted connections, enable auditing/Defender and protect backups. Encrypt sensitive columns where justified, segregate environments and use migrations through a narrow deployment identity. An Azure Owner role does not automatically equal a SQL data user.

### 10. What is Microsoft Entra ID?
Microsoft's identity platform for users, groups, applications and managed identities. It issues tokens and supports SSO, Conditional Access and app registrations. It authenticates principals; your API still decides permissions through delegated scopes, app roles and domain-level checks. “Azure AD” is the former name.

## Azure Authentication

### 1. OAuth 2.0 versus OpenID Connect?
OAuth 2.0 is a framework for delegated authorization and access tokens to call APIs. OpenID Connect layers authentication on OAuth and introduces the ID token for the client to learn who signed in. Send an **access token** to a Web API; do not accept an ID token as API authorization. JWT is a token format, not a synonym for OAuth or OIDC.

### 2. Client credentials flow?
A daemon or service authenticates itself to Entra using certificate, federated credential or client secret, then requests an access token for the target API (`/.default` application permissions). No end user is present, so authorization uses app roles rather than delegated user scopes. On Azure, managed identity is often preferable to storing a client secret. Example: a scheduled processor calls a compliance API.

### 3. Authorization code flow?
An interactive client redirects the user to Entra, gets an authorization code, and exchanges it for tokens. Public clients/SPAs use PKCE; a confidential server app authenticates appropriately and protects its credentials. The client requests the API scope, caches tokens safely and renews them via the identity library. The API never handles the user's password.

### 4. How does Entra authentication work?
Register client and API, configure redirect URIs and exposed scopes/app roles, obtain consent, redirect or acquire token through the appropriate flow, then send a bearer access token to the API. The API validates issuer, audience, signature and lifetime and applies authorization. For multi-tenant apps, explicitly validate allowed tenants and permissions; an authenticated tenant is not automatically an authorized customer.

### 5. How do you secure Web APIs?
Use ASP.NET Core JWT bearer or Microsoft.Identity.Web configured with Entra authority/audience, `[Authorize]` policies, required scopes/roles and resource ownership checks. Add HTTPS, safe CORS, request validation, throttling and managed identity for outbound calls. For app-only calls check `roles`; for delegated calls check `scp`. Return 401 for invalid/missing token and 403 for insufficient permissions.

### 6. JWT validation flow?
Read the bearer token, discover trusted signing keys via issuer metadata, verify cryptographic signature and allowed algorithm, check `iss`, `aud`, `exp`/`nbf`, then evaluate scope/role and tenant claims. Use middleware/library rather than hand-written JWT parsing; cache and refresh signing keys. A signed token can still lack permission for a particular study or resource.

### 7. Access versus Refresh Tokens?
A short-lived access token is presented to the API for a specific audience and permissions. A refresh token, where issued, is handled by the client/identity provider to obtain new access tokens; the resource API should not receive it. Use MSAL's token cache and silent acquisition rather than coding refresh-token storage casually. A custom auth server needs secure storage, rotation, revocation and reuse detection.

### 8. How implement SSO?
Integrate each trusted app with the same Entra tenant/identity platform using OIDC and suitable app registrations. After one interactive sign-in, Entra session and token cache can enable silent sign-in/consent-aware token acquisition in another app. Still request an access token for each API's audience and check application authorization. Conditional Access, browser cookie policies and tenant boundaries can affect the experience.

## Azure Monitoring

### 1. What is Application Insights?
Azure Monitor's application performance monitoring capability: request traces, dependencies, exceptions, logs, availability and distributed operations. Use a workspace-based resource and instrument .NET services with the supported SDK/OpenTelemetry integration. It helps identify slow SQL calls, failed requests and the path of a transaction.

### 2. What is Azure Monitor?
The broader observability platform for metrics, logs, traces, alerts and visualizations across Azure and applications. Application Insights is part of this ecosystem; Log Analytics workspaces hold queryable logs, and Azure Monitor alerts notify action groups. Plan cost/retention and access control.

### 3. How troubleshoot production incidents?
Start with impact and time window: error rate, p95 latency, affected users and recent deployments. Follow a failing operation ID from gateway to API to dependencies; check App Insights exceptions, Azure metrics, logs and Service Bus lag/DLQ. Compare healthy and failing instances, check SQL/query plans and external throttling, mitigate safely (rollback, scale or disable a feature), then document root cause and add a targeted alert/test.

### 4. How centralize multiple apps' logs?
Send telemetry from API, Functions and workers to appropriately scoped Application Insights/workspace resources; use structured fields and common trace context. Cross-resource/workspace queries may be needed depending on design. Restrict PHI/PII, set retention/sampling and role access. A shared workspace can simplify correlation, but separate workloads/tenants might need isolation.

### 5. Which telemetry?
Requests (status, latency, rate), dependency calls (SQL, HTTP, Redis), exceptions, structured logs, traces, queue depth/age/DLQ, CPU/memory, availability and business outcomes such as documents processed. Attach safe dimensions such as study/document IDs and deployment version. Avoid logging tokens, document content or patient data. Measure SLOs with latency percentiles and success rates.

### 6. Trace across microservices?
Propagate W3C `traceparent` and baggage carefully through HTTP, and carry a correlation/diagnostic ID in message metadata for asynchronous hops. Instrument OpenTelemetry/Application Insights for inbound/outbound dependencies; keep business IDs as structured fields. A new queue worker operation may be linked rather than a simple child span, depending on instrumentation. Search by trace ID and message ID to distinguish retry attempts.

### 7. Configure alerts?
Use Azure Monitor metric/log/availability alerts with meaningful threshold, aggregation window and severity; send to action groups. Include links to dashboard/runbook, suppress duplicate noise, and test alert delivery. Alert on symptoms (5xx, latency, unprocessed queue age) as well as cause metrics (CPU, dependency failures). Review false positives after incidents.

### 8. Monitor Functions?
Connect App Insights, inspect execution duration/failures/dependencies, add operation IDs, and alert on failure trends and missing expected timer runs. Watch source queue age, DLQ and poison messages. Log enough to distinguish trigger failure, application error and downstream timeout; sampling may omit individual traces.

**KQL examples (workspace schema; inspect your actual columns):**

```kusto
AppRequests
| where TimeGenerated > ago(1h) and Success == false
| summarize Failures=count() by Name, ResultCode
| order by Failures desc
```

```kusto
AppDependencies
| where TimeGenerated > ago(2h) and Success == false
| project TimeGenerated, OperationId, Name, Target, ResultCode, DurationMs
| order by TimeGenerated desc
```

## Azure Storage

### 1. What is Blob Storage?
Azure object storage for unstructured data such as PDFs, images, backups and exports. Organize objects in containers, choose hot/cool/cold/archive access according to usage and apply lifecycle/retention/versioning as appropriate. Blob metadata and tags help classification; a relational database can store ownership and workflow metadata. A blob is not a shared filesystem path.

### 2. Blob versus Azure Files?
Blob exposes object APIs for upload/download and massive object scale; Azure Files provides managed SMB/NFS file shares in supported configurations for applications needing file-system semantics. Choose Blob for web document upload and asynchronous processing. Choose Files for legacy software requiring a mounted share; examine locking, protocol and access model.

### 3. How secure Blob?
Use managed identity and Storage Blob Data roles, restrict public network access/private endpoints where needed, disable anonymous access, enforce HTTPS and prevent use of account keys when feasible. Issue short-lived user-delegation SAS for direct browser upload, scope to one blob/container and required permissions. Enable soft delete/versioning, logging and malware scanning where your risk model needs it.

### 4. .NET access to Blob?
Install `Azure.Storage.Blobs` and `Azure.Identity`; use service URI plus `DefaultAzureCredential`. Grant the runtime identity a data-plane role and verify network access. Stream uploads/downloads to avoid loading large documents in memory; handle cancellation, content type and ETags for concurrency.

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

var service = new BlobServiceClient(
    new Uri("https://mystorage.blob.core.windows.net"),
    new DefaultAzureCredential());
var blob = service.GetBlobContainerClient("studies")
                  .GetBlobClient("study-123/protocol.docx");
await blob.UploadAsync(stream, overwrite: false);
```

### 5. What are SAS tokens?
Shared Access Signatures grant limited resource permissions until an expiry, often for direct client upload/download. Prefer user delegation SAS signed through Entra credentials for Blob when possible; account/service SAS rely on shared keys. Constrain permissions, resource, protocol and expiry; treat URL as a secret and avoid logging it. SAS is bearer access: anyone who has it can use it within scope until expiry/revocation strategy takes effect.

### 6. What is a Storage Account?
An Azure resource/namespace containing Blob, Files, Queue and Table services, configured with redundancy, networking, security and billing. Azure managed disks are separate resources rather than a subservice created inside the account. Select LRS/ZRS/geo-redundant options based on availability and recovery goals; geo-redundancy does not replace backup/versioning.

### 7. What are Storage Account types?
Modern general-purpose v2 (`StorageV2`) supports Blob, Files, Queue and Table with access tiers. Specialized premium accounts exist for block blobs, file shares and page blobs, with different performance/features. Legacy general-purpose v1/BlobStorage types may exist but are not the normal new default. Distinguish **account kind** from **service type** and from **redundancy** (LRS/ZRS/GRS/GZRS).

## Azure Kubernetes Service (AKS)

### 1. What is AKS?
Azure-managed Kubernetes orchestration. Azure manages much control-plane infrastructure; teams still own workloads, node pools, upgrade policy, policies, networking, security and monitoring. Useful for substantial container platforms requiring Kubernetes features. Evaluate operational cost against Container Apps or App Service.

### 2. AKS versus App Service?
AKS offers Kubernetes API, scheduling, sidecars/operators, diverse workloads and deep network/runtime control, with more operations. App Service offers simpler managed web/API hosting with slots and built-in deployment/scale features. A microservices label alone does not require Kubernetes; choose based on actual orchestration need and team capacity.

### 3. What is a Pod?
The smallest deployable Kubernetes unit: one or more containers sharing network namespace and volumes. Pods are ephemeral; a Deployment reconciles desired replicas and replaces failed Pods. Do not keep important local state inside a Pod. Readiness and liveness probes serve different purposes.

### 4. What is a Node?
A worker VM that runs Pods, kubelet and container runtime. Node resources and OS/architecture must support scheduled Pods. Plan capacity, patching/upgrades, zones, taints and system overhead. A Pod restart and a node replacement are different failures.

### 5. What is a Node Pool?
A group of AKS nodes with similar VM size/OS/configuration. Separate system and user workloads, or use pools for CPU-intensive, memory-intensive or GPU needs. Pools can scale independently and carry taints/labels. Avoid too many pools for a tiny workload because each adds cost and operations.

### 6. What is Ingress?
Kubernetes routing configuration for external HTTP(S) traffic to Services, implemented by an ingress controller. The Ingress object alone does nothing without a controller. Configure TLS termination, DNS and network policy; alternatives include Gateway API, Application Gateway integration or other managed ingress choices. Keep internal services private.

### 7. What are Helm Charts?
Versioned templates packaging Kubernetes resources with configurable values. Use Helm to release deployments, services, config, ingress and autoscaling consistently across environments. Review rendered YAML, manage secrets outside plain values, pin chart/image versions and plan chart rollback separately from database rollback.

### 8. How deploy to AKS?
Build/test a container, scan and push immutable image to ACR, give cluster pull permissions, deploy Kubernetes manifests/Helm through CI/CD, and set resource requests/limits, probes, secrets/workload identity, HPA and network policies. Roll out gradually and watch `kubectl rollout status`, logs and telemetry. Keep cluster credentials tightly scoped; use Entra/RBAC rather than broad admin kubeconfig in pipelines.

### 9. How do Pods access Key Vault?
Prefer AKS Workload Identity: federate a Kubernetes service account with a user-assigned managed identity and grant that identity vault data permissions; the app SDK retrieves secrets. Alternatively use the Azure Key Vault provider for Secrets Store CSI Driver to mount secrets as files, with an appropriately authorized identity. Mounting is not the same as refreshing an app's in-memory configuration; test rotation, RBAC and private DNS.

### 10. How do Pods access Storage Accounts?
For Blob API access, use workload identity plus Storage Blob Data role and `BlobServiceClient`/`DefaultAzureCredential`; enforce private endpoint and DNS if required. For mounted shared files use Azure Files CSI driver/PersistentVolumeClaims where appropriate. Don't pass account keys in Kubernetes Secret unless necessary; RBAC and network access must both succeed.

### 11. How scale AKS?
Horizontal Pod Autoscaler adds Pods based on CPU/custom metrics; KEDA can scale on events such as queue depth; cluster autoscaler adds/removes nodes when Pods cannot fit. Vertical Pod Autoscaler adjusts resource sizing in supported modes, and node auto-provisioning can be an option. Set requests/limits, replicas, disruption budgets and capacity quotas. More Pods cannot help when every request is blocked on the same database.

### 12. What is ACR?
Azure Container Registry stores private OCI container images and artifacts. CI pushes signed/scanned immutable image tags or digests; AKS pulls using scoped identity/`AcrPull` permissions. ACR is a registry, not a runtime. Set retention and network access appropriate to the supply chain.

## Azure Architecture and Scenario Questions

### 1. Design a scalable high-traffic Azure application.
Start with traffic profile, latency SLO, availability/RPO/RTO, data sensitivity and budget. Place Front Door/WAF at the edge, host stateless .NET APIs on zone-capable App Service or Container Apps/AKS where justified, autoscale on demand, use managed database with indexes/read strategy, Redis for hot disposable data, Blob for objects and Service Bus for slow jobs. Entra/managed identity, Key Vault/private networking and APIM may protect integration boundaries. Instrument App Insights, load-test, and identify the database and external APIs as likely limits. Partition tenants or workloads only after measuring contention.

### 2. Make an application highly available.
Remove single points of failure: multiple app instances, health probes, supported availability zones, resilient data tier, retries with jitter/circuit breakers and queue buffering. Define whether zone or region failure is in scope; for regional resilience replicate deployment and data and route via Front Door. Exercise failures and restoration. HA reduces outage probability; backups and DR address recovery from corruption/disaster.

### 3. Achieve zero downtime deployment.
Deploy a backward-compatible API/database change to staging slot or canary revision, warm and smoke-test it, switch traffic, then monitor p95 latency/errors. Use expand-and-contract migrations: add new columns first, run compatible versions, migrate data, remove old schema later. Long-lived connections and background workers need draining/version handling. “Zero downtime” is an objective verified by probes, not an automatic property of a slot swap.

### 4. Implement observability.
Define SLOs and key user journeys; collect metrics, logs and distributed traces using Azure Monitor/Application Insights/OpenTelemetry. Propagate operation IDs through HTTP and messages, add safe business context, build dashboards and alerts for latency, errors, queue lag and business completion. Limit sensitive fields and manage sampling/retention. A runbook should link alerts to queries and likely mitigations.

### 5. Handle sudden traffic spikes.
Use WAF/rate limits and autoscaling to protect entry points, cache hot reads, enqueue slow writes and cap consumer concurrency to match DB capacity. Review service quotas and prewarm/scale minimums if cold starts matter. Shed nonessential work gracefully with 429/503 and retry guidance rather than exhausting downstream pools. Load-test burst and recovery, not merely steady throughput.

### 6. App Service versus AKS versus Functions?
App Service for conventional API/web workloads and simpler operations; Functions for event/timer-driven discrete work; AKS when Kubernetes capabilities and operational team justify it. Container Apps fills the gap for managed container services with revisions and event scaling. Compare expected scale, network topology, latency, platform control and skills; different parts of one system can use different hosts.

### 7. Secure microservice communication.
Use TLS plus workload identities and audience-specific access tokens. Enforce scopes/app roles at service boundaries, resource-level authorization in application code, private networking and least-privilege RBAC for data services. APIM can enforce edge policies; internal authorization remains necessary. Rotate keys if unavoidable, propagate trace context without leaking tokens and avoid sharing one identity across all services.

### 8. Design event-driven architecture.
Publish domain events from an outbox after the database transaction commits; route discrete notifications via Event Grid or broker workflows via Service Bus topics. Each subscriber owns its data and processes at least-once delivery idempotently. Use DLQ, schema versioning, correlation, replay strategy and eventual-consistency UX. Event Hubs serves high-throughput telemetry streams. Draw boundaries around commands, events and streams before picking a service.

### 9. Optimize Azure costs.
Measure workload cost and utilization with tags/budgets; right-size plans/databases, schedule nonproduction shutdown, tune autoscale minimums and storage lifecycle, remove unused resources and set telemetry retention. Compare serverless bills with provisioned compute for steady load; account for network egress, redundancy, backups and AI token/search costs. Preserve SLO/RPO requirements when reducing cost.

### 10. Multi-region Azure solution.
Define active-passive or active-active and data consistency expectations. Deploy stateless APIs in two regions, route with Front Door health probes, configure regional dependencies and secrets, and use supported database replication/failover and storage redundancy. Plan split-brain prevention, write ownership, queue behavior and DNS/identity dependencies. Test failover and failback against measurable RTO/RPO; infrastructure replication alone is insufficient.

**Example answer for your Protocol Pro project:** The known implementation uses a .NET 9 API, React, PostgreSQL, Blob document storage, Azure OpenAI embeddings and an Azure AI Search index. DOCX chunking and embeddings are implemented; do not claim the planned Search API, PDF extraction or full production Azure hosting as delivered. A proposed production design could use App Service for the API, a queue/worker for document processing, managed identity and Key Vault, and App Insights for traces. State what is live versus proposed during interviews.

## Top 15 Quick Review

| # | Question | Interview answer in one sentence | Full answer |
| --- | --- | --- | --- |
| 1 | Functions vs App Service | Triggered handlers versus conventional hosted API; compare plan/latency/operations. | Functions 2 |
| 2 | Queue vs Topic | One work stream with competing workers versus independent subscription copies. | Service Bus 2 |
| 3 | Service Bus vs Event Hubs | Business-message workflow versus high-volume retained event stream. | Service Bus 3 |
| 4 | Event Grid vs Service Bus | Event routing versus brokered work and settlement. | Event Grid 2 |
| 5 | Key Vault | Controlled secrets, keys and certificates with rotation/audit strategy. | Security 1 |
| 6 | Managed Identity | Azure-managed principal obtains tokens without client secrets. | Security 3 |
| 7 | APIM | Gateway for publication, policy, quotas and API governance. | APIM 1 |
| 8 | JWT in APIM | Validate issuer, audience, signature/lifetime and required claims. | APIM 4 |
| 9 | Entra authentication | Client obtains API access token; API validates and authorizes. | Authentication 4 |
| 10 | Application Insights | Application requests, dependencies, exceptions and traces. | Monitoring 1 |
| 11 | Azure Monitor | Platform metrics/logs/traces and alerting umbrella. | Monitoring 2 |
| 12 | AKS vs App Service | Kubernetes control versus simpler PaaS web hosting. | AKS 2 |
| 13 | Blob Storage | Managed object storage with identity-based access and lifecycle. | Storage 1 |
| 14 | Client credentials | App-only OAuth token, no user; use app roles/managed identity. | Authentication 2 |
| 15 | Zero downtime | Warm a compatible version, shift traffic, observe and roll back. | Architecture 3 |

## Microsoft Learn references

- [Azure Functions hosting and scale](https://learn.microsoft.com/azure/azure-functions/functions-scale)
- [Azure Functions security](https://learn.microsoft.com/azure/azure-functions/security-concepts)
- [Azure Functions monitoring](https://learn.microsoft.com/azure/azure-functions/configure-monitoring)
- [Service Bus message settlement](https://learn.microsoft.com/azure/service-bus-messaging/message-transfers-locks-settlement)
- [Service Bus dead-letter queues](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-dead-letter-queues)
- [Service Bus duplicate detection](https://learn.microsoft.com/azure/service-bus-messaging/duplicate-detection)
- [Compare Azure messaging services](https://learn.microsoft.com/azure/service-bus-messaging/compare-messaging-services)
- [Event Hubs overview](https://learn.microsoft.com/azure/event-hubs/event-hubs-about)
- [APIM policies](https://learn.microsoft.com/azure/api-management/api-management-policies)
- [APIM JWT policy](https://learn.microsoft.com/azure/api-management/validate-jwt-policy)
- [APIM content validation](https://learn.microsoft.com/azure/api-management/validate-content-policy)
- [AKS overview](https://learn.microsoft.com/azure/aks/what-is-aks)
- [AKS workload identities](https://learn.microsoft.com/azure/aks/managed-identity-overview)
- [AKS Key Vault CSI identity](https://learn.microsoft.com/azure/aks/csi-secrets-store-identity-access)
