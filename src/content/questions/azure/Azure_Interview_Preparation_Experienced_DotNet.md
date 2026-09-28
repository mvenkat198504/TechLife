---
id: azure-questions-001
slug:  azure-questions
title: Azure Interview Preparation for Experienced .NET Developers
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

summary: Azure Interview Preparation for Experienced .NET Developers
updatedAt: 2026-08-27
status: published
thumbnail: ""
videos: []
resources: []
---
# Azure Interview Preparation for Experienced .NET Developers

> Updated September 2026. Use the answers as speaking points. Replace proposed architecture with verified production details before claiming hands-on experience. Microsoft Entra ID is the current name for Azure AD; Azure Managed Redis is the successor to Azure Cache for Redis, so check the service and migration status in your environment.

## Hosting and deployment

### 1. What is Azure App Service and how do you deploy a .NET application to it?
Azure App Service is a managed web hosting platform for HTTP applications and APIs. Azure manages the host OS, runtime integration, load balancing and platform patching; we own application code, configuration, scaling decisions and monitoring. A plan determines compute capacity and pricing, while a web app holds deployment and runtime configuration.

**Typical release:** build and test with `dotnet restore`, `dotnet build -c Release`, `dotnet test`, and `dotnet publish -c Release -o publish`; provision an App Service plan and Web App with a supported .NET runtime; configure environment variables, managed identity, health check and Application Insights; deploy the published output through Azure DevOps, GitHub Actions, Visual Studio or ZIP deployment. In production, deploy to a staging slot, run smoke tests, then swap. The pipeline identity needs deployment permission; the application's managed identity needs data-plane access to dependencies. For Linux, match the runtime stack and target framework; for containers, configure the registry image instead of deploying DLLs.

### 2. What are the options to deploy a .NET Web API on Azure?
| Option | Best fit | Responsibility/trade-off |
| --- | --- | --- |
| App Service | Conventional HTTP API, fast managed release | Simple operations; less host-level control |
| Azure Container Apps | Containerized services, event-driven scaling, revisions | Manage images and app configuration, not a Kubernetes control plane |
| AKS | Many services requiring Kubernetes APIs, operators or custom networking | Own cluster operations, upgrades and workload security |
| Azure VM/VM Scale Sets | OS-level dependencies, legacy IIS or full control | Own OS patching, deployment, availability and scaling |
| Azure Functions | Triggered short tasks or event handlers | Execution model and hosting-plan limits matter |

Choose based on workload shape, platform control, operational capacity, network requirements, latency and cost, rather than simply whether the API runs in a container.

### 3. Why choose App Service instead of AKS or a VM?
**Interview answer:** “For a standard ASP.NET Core API with predictable HTTP traffic, App Service let us ship with managed TLS, deployment slots, autoscaling and integrated monitoring. We did not need Kubernetes scheduling or OS access. AKS would add cluster governance and upgrades; a VM would add patching, IIS operations and resilience engineering. I would revisit Container Apps for containerized services with event-driven scaling, and AKS when the platform genuinely needs Kubernetes capabilities.” Mention actual constraints and measured traffic if available.

### 4. App Service versus Azure VM?
App Service is PaaS: deploy code/container, configure runtime, and let Azure maintain hosts. VM is IaaS: manage OS, middleware, security updates, load balancer, backup and deployment. A VM offers greater control for unsupported binaries or special machine configuration. In both, you still own application security, data protection, capacity and recovery design.

### 5. How do you deploy Docker containers to App Service?
Create a multi-stage Dockerfile, build and test, push a versioned image to Azure Container Registry (ACR), configure Web App for Containers to pull the image using a managed identity with `AcrPull`, and set application settings and health checks. Deploy an immutable image tag or digest to staging, smoke-test, then swap or promote. Avoid relying on mutable `latest`; ensure the app listens on the configured port and emits logs to stdout/stderr.

### 6. What is ACR?
Azure Container Registry is a private registry for OCI/Docker images and other artifacts. CI builds and pushes an image; App Service, Container Apps or AKS pulls it. Apply RBAC or repository-scoped permissions, managed identity/workload identity, scanning and retention policies. ACR stores images; it does not run them.

### 7. What is AKS, and when use it?
AKS is managed Kubernetes: Azure operates much of the control plane, while the team manages workloads, node pools, upgrades, policies, networking and observability. Use it for a genuine Kubernetes platform need: numerous independently deployed services, custom controllers, scheduling, mesh or complex traffic policies. For a small API estate, assess App Service or Container Apps first.

### 8. How do you configure autoscaling in App Service?
Use a supported paid App Service plan, enable automatic scaling where supported or configure Azure Monitor autoscale rules on plan instances. Set minimum/maximum instances, scale-out thresholds such as sustained CPU or memory, scale-in thresholds with cooldown, and schedules when traffic is predictable. The app must be stateless; put session state in a shared store and files in durable storage. Test load and monitor p95 latency, errors, CPU, memory and instance count. Distinguish plan-level autoscale from per-app automatic scaling, whose availability depends on plan/features.

### 9. What are deployment slots?
Slots are live App Service environments in supported tiers, commonly staging and production. Deploy and warm up staging, smoke-test, then swap to reduce disruption. Mark environment-specific settings such as production connection strings and Key Vault references as **slot settings** so they remain with their slot. Swap is a traffic/configuration operation, not a database rollback; make schema changes backward compatible.

### 10. Blue-green and canary deployments?
Blue-green maintains two versions/environments, validates the new version, then switches traffic; App Service slots are one implementation. Canary sends a small percentage of traffic to a new version and increases it after checking metrics; use slot traffic routing, Container Apps revision weights, or an ingress/gateway. Define success thresholds and a way to revert before release. Database compatibility and background workers need separate consideration.

### 11. How do you roll back a failed deployment?
Stop routing traffic to the bad version: swap back, reset traffic weights or redeploy the last known good immutable artifact. Validate health and telemetry, then investigate. Database rollback is separate and may be unsafe after writes; use expand-and-contract migrations, backups and a tested recovery runbook. A slot swap alone cannot undo side effects from queues or data migrations.

## Azure Functions and identity

### 12. What is Azure Functions and when use it?
Functions is event-driven compute with HTTP, timer, queue, Service Bus, Event Grid and other triggers. Use it for scheduled cleanup, document ingestion, notifications or asynchronous processing. Hosting choices affect startup, networking, duration, scale and cost. Use an API host for a large cohesive HTTP application when its lifecycle, routing and predictable latency are better served there.

### 13. How do you secure Functions with Microsoft Entra ID and JWT?
Register a protected API application in Entra ID and expose scopes or app roles. Configure Function App Authentication (Easy Auth) to require authentication and accept tokens for the correct tenant and audience; alternatively validate bearer tokens in application middleware for your hosting model. Clients obtain an **access token for this API**, not an ID token. Validate issuer, audience, signature, expiry and scopes/roles, require HTTPS, and use managed identity for outbound calls. Function keys are shared secrets, not user authorization. Gateways can add controls but do not replace token validation at the trust boundary.

### 14. How do you implement RBAC in Azure Functions?
Separate **Azure RBAC** (who may manage the Function App or access Azure resources) from **application roles** (who may call a business operation). Define Entra app roles such as `Protocol.Reviewer`, assign users/groups or client apps, require authentication, inspect the validated `roles` claim and return 403 when a role is missing. For delegated access, check `scp` scopes; for app-only calls, use `roles`. If validating in a .NET isolated worker, implement the check in appropriate middleware or endpoint code; do not trust unvalidated headers or decode a JWT without verifying it. Use least-privilege Azure RBAC for deployment and managed identities.

### 15. How do you handle JWT expiry and refresh tokens?
Issue short-lived access tokens and use a refresh mechanism on the **client/auth server**, not inside a resource API. With Entra ID, MSAL acquires tokens silently and manages its token cache; the API validates access tokens and returns 401 for missing/expired tokens. Browser SPAs should use authorization code with PKCE through an appropriate identity SDK, not store long-lived secrets in localStorage. For a custom JWT system, use rotating, revocable refresh tokens stored securely, hash them server-side, detect reuse and revoke on logout/compromise. For a long editing session, save drafts and refresh before submitting; a 401 triggers one controlled renew/retry, not infinite loops.

### 16. What are Durable Functions?
Durable Functions adds stateful orchestration to Functions: orchestrator, activity and entity patterns, with persisted checkpoints and replay. Use for multi-step document workflows, fan-out/fan-in processing, human approval waits or long-running operations. Keep orchestrators deterministic; do network/database work in activity functions, handle replay-safe logging, retries and idempotency. Consider queue workers or a workflow engine when orchestration features are unnecessary.

### 17. How do you monitor Functions and alert on failures?
Connect a workspace-based Application Insights resource; emit structured logs with correlation IDs and track requests, dependencies, exceptions and custom business metrics. Use Azure Monitor alert rules for failed executions, exception rate, queue age/dead-letter count and availability, wired to an action group (email, Teams/webhook or incident tool). Separate transient retry failures from final failures, examine sampling and ingestion settings, and test the alert path. Configure poison-message handling and dashboards for processing lag.

## Storage, secrets and networking

### 18. What is a Storage Account and what are its storage services?
It is an Azure namespace and configuration boundary for storage. **Blob** stores objects (documents/images); **Azure Files** exposes SMB/NFS shares where supported; **Queue Storage** stores simple asynchronous messages; **Table Storage** stores schemaless key/attribute entities. Managed disks are Azure storage resources for VMs but not a Storage Account service you create inside the account. Choose redundancy (LRS/ZRS/GRS/GZRS variants), access tier and lifecycle policies according to recovery and cost requirements.

### 19. How do you secure a Storage Account?
Prefer Entra authorization with managed identity and least-privilege data roles; disable shared key access where compatible. Disable anonymous blob access, restrict public network access or use private endpoints, enforce HTTPS/TLS, and use short-lived user delegation SAS only when direct client upload is needed. Separate control-plane and data-plane roles. Enable encryption, soft delete/versioning where appropriate, diagnostic logs and Defender recommendations. Test permissions from the actual runtime identity and network path.

### 20. What is Key Vault and why use it?
Key Vault stores and controls access to secrets, keys and certificates. It supports centralized rotation and auditing, preventing credentials from being committed in source or copied across deployment files. Use a separate vault or clear isolation per environment, role-based access and private connectivity when required. Rotation requires clients to refresh cached values or restart appropriately; moving a secret to Key Vault does not remove the need to restrict who can read it.

### 21. How do you connect ASP.NET Core to Key Vault?
Enable a managed identity on the Web App and grant it the **Key Vault Secrets User** role (for Azure RBAC permission model) on the vault at suitable scope. Option A: put `@Microsoft.KeyVault(SecretUri=https://.../secrets/...)` in App Service application settings and read the resolved value through `IConfiguration`. Option B: use `Azure.Identity` and `Azure.Extensions.AspNetCore.Configuration.Secrets`:

```csharp
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);
var vaultUri = builder.Configuration["KeyVaultUri"];
if (!string.IsNullOrWhiteSpace(vaultUri))
    builder.Configuration.AddAzureKeyVault(new Uri(vaultUri), new DefaultAzureCredential());
```

`DefaultAzureCredential` uses a developer credential locally and managed identity on Azure when configured. Avoid printing secret values; scope access tightly and verify vault firewall/private DNS rules.

### 22. What is Managed Identity?
An Azure-managed service identity registered in Entra ID, used by an Azure resource to request tokens without managing a client secret. **System-assigned** follows one resource's lifetime; **user-assigned** can be shared and retained independently. Grant the identity a data-plane role on Key Vault, Blob, ACR or other target; acquire tokens through Azure SDK credential providers. Identity answers “who am I?”; RBAC answers “what can I do?”; network rules still govern connectivity.

### 23. How do you store secrets without appsettings.json?
Store nonsecret settings as environment variables or Azure App Configuration; secrets in Key Vault, referenced by App Service settings or SDK. In CI/CD use federated workload identity where supported, scoped service connections and secret variables only when unavoidable. Local development can use user secrets and developer Entra login. Never put a production secret in source, logs, Docker layers or a frontend bundle.

### 24. Private Endpoints versus VNet Integration?
A **private endpoint** gives a PaaS resource such as Storage or Key Vault a private IP in your VNet for inbound access to that resource; configure private DNS and restrict public access. **App Service VNet Integration** enables the app's outbound traffic to reach VNet resources/private endpoints; it does not by itself make the Web App's inbound endpoint private. For private inbound access to App Service, use its private endpoint or another appropriate ingress design. Validate DNS resolution as well as firewall rules.

### 25. How do you secure service-to-service communication?
Use TLS and private network paths where justified. Give each workload its own managed identity, grant only required data roles, and request tokens for the destination service. For custom APIs, validate Entra tokens for the API's audience and application roles/scopes; for Azure SDK services, use `DefaultAzureCredential`. Put APIM/gateway policies at the edge, rotate any unavoidable credentials, and correlate and audit calls. Private networking alone does not authenticate callers.

## CI/CD and containers

### 26. How do you implement CI/CD using Azure DevOps?
Commit YAML pipeline and infrastructure definitions to source control. CI triggers on PRs/main: restore, compile, unit/integration tests, dependency/security checks and publish a versioned artifact or container image. CD uses an Azure service connection, environment approvals where required, deploys the same immutable artifact to staging, applies safe migrations, smoke-tests, promotes to production and monitors post-release. Use workload identity federation rather than stored service-principal secrets where possible. Store secrets in Key Vault and restrict pipeline permissions.

### 27. Explain stages of an Azure DevOps pipeline.
A **stage** is a logical boundary containing jobs and steps. Example: `Validate` (restore, build, test), `Package` (publish and retain artifact), `Deploy_Staging` (configure and deploy), `Verify` (health/smoke tests), `Deploy_Production` (approval and promote), and `Observe` (post-release checks). Jobs run on agents or deployment environments; stages express dependencies and conditions. Keep build-once/deploy-many so production receives exactly the tested artifact. Release approvals protect production but do not substitute for automated validation.

## Messaging and API gateway

### 28. What is Azure Service Bus?
A managed broker for durable business messages with queues and publish/subscribe topics, dead-lettering, scheduled delivery, duplicate detection, sessions/ordering and transactions within supported scope. Producers and consumers are decoupled in time. Consumers must handle retries and duplicate delivery; “exactly once business effect” requires application idempotency.

### 29. Queue versus Topic?
A **queue** has one logical work stream and competing consumers: one consumer processes each delivered message. A **topic** fans a published message to subscriptions; each subscription has its own consumer stream and optional filters. Use a queue for one document-processing worker pool; a topic when audit, notification and analytics independently react to the same business event. Both require dead-letter handling and monitoring.

### 30. When choose Service Bus instead of REST?
Use REST when the caller needs an immediate answer or synchronous validation. Use Service Bus when work can be asynchronous, when services must absorb spikes or remain loosely coupled during temporary outages, or when retries/durable delivery are essential. For example, an upload API persists document metadata, enqueues a processing command and returns `202 Accepted` with a status URL. Define idempotency, poison-message handling and eventual-consistency semantics. A queue does not make an operation transactional with a separate database by itself; use an outbox or equivalent reliability pattern.

### 31. What is Event Grid?
Azure's event-routing service for discrete events such as BlobCreated, resource changes or custom domain events. It offers subscriptions, filtering, retry/dead-letter options and push/event delivery to handlers. A handler should be idempotent; an event announces something happened and commonly contains a reference, not a large document payload.

### 32. What is Event Hubs?
A high-throughput event streaming/ingestion service with partitions and retention, where consumer groups independently read a stream at their own pace. Use for telemetry, clickstreams, IoT or large-scale log ingestion. Consumers track offsets/checkpoints. It is not a replacement for a business work queue with rich command semantics.

### 33. Event Grid versus Event Hubs?
| | Event Grid | Event Hubs |
| --- | --- | --- |
| Primary use | Route discrete events to handlers | Ingest and replay high-volume event streams |
| Consumption | Event subscriptions and delivery | Partitioned pull stream, consumer groups |
| Example | Blob upload triggers processor | Millions of device readings for analytics |

Service Bus adds brokered business messaging when delivery workflow, sessions or dead-letter queues matter.

### 34. What is APIM and why use it?
Azure API Management is a managed gateway and API publication platform. It provides routing, authentication/JWT validation policies, quotas, rate limits, transformations, versioning, developer access and analytics. Place it in front of Web APIs when central API governance helps. Continue authorization inside the API for business rules, protect the backend from bypass where appropriate, and understand that subscription keys identify subscriptions rather than replacing user authentication.

## API security and observability

### 35. How do you secure an ASP.NET Core Web API hosted in Azure?
Enforce HTTPS; use Entra ID or another trusted issuer; validate issuer, audience, signature and expiry with JWT bearer middleware; authorize by scopes, roles and resource ownership. Use managed identity for dependencies, Key Vault for secrets, least-privilege RBAC, private endpoints/access restrictions as needed, and APIM/WAF/rate limiting for public exposure. Apply input validation, secure CORS, patch dependencies, avoid sensitive logging, and monitor 401/403 spikes. CORS is a browser policy, not server authentication.

### 36. How do you authenticate Azure APIs using Entra ID?
Register an API in Entra, expose a delegated scope or application role, and register the calling app. The caller acquires an access token for the API audience. In ASP.NET Core, configure Microsoft.Identity.Web or `JwtBearer` with authority/tenant and audience; add `UseAuthentication()` before `UseAuthorization()` and `[Authorize]` with policies. For user-delegated flows inspect `scp`; for daemon/app-only flows inspect `roles`, consent and assignments. A 401 means authentication failed; a 403 means authenticated but insufficient permission.

### 37. What is Azure Monitor?
The observability platform for Azure metrics, logs, traces, alerts and dashboards. Collect platform metrics/resource logs and application telemetry, use Log Analytics/KQL to investigate, and set alerts/action groups. Plan retention and sampling, since telemetry ingestion and retention have cost.

### 38. What is Application Insights?
An Azure Monitor application performance monitoring capability for requests, dependencies, exceptions, traces and distributed transactions. It can reveal slow SQL/HTTP calls, failing endpoints and dependency errors. Use workspace-based resources, SDK/OpenTelemetry-based instrumentation as appropriate, and correlation across services. Sampling can affect raw event counts; use suitable metrics for alerting.

### 39. How do you configure centralized logging with Application Insights?
Connect every app/service to the intended workspace-based Application Insights and instrument ASP.NET Core or Functions. Emit structured `ILogger<T>` logs with fields such as `StudyId`, `DocumentId` and a correlation/trace ID; propagate W3C trace context across HTTP and messaging boundaries. Capture dependencies, configure log levels and sampling, mask PHI/PII and secrets, and define retention/access policies. Search by operation ID to follow an upload through API, queue and worker. Application Insights does not automatically guarantee every custom message carries your business correlation key.

### 40. How do you write KQL for troubleshooting?
Start with a narrow time range, filter early, project useful columns, summarize, then join on operation/correlation ID. Table names depend on whether querying Application Insights directly or its Log Analytics workspace (`requests`/`dependencies` versus `AppRequests`/`AppDependencies`). Examples for workspace-based tables:

```kusto
AppRequests
| where TimeGenerated > ago(1h)
| where Success == false
| summarize Failures=count() by Name, ResultCode
| order by Failures desc
```

```kusto
AppDependencies
| where TimeGenerated > ago(2h) and Success == false
| project TimeGenerated, OperationId, Target, Name, ResultCode, DurationMs
| order by TimeGenerated desc
```

```kusto
AppExceptions
| where TimeGenerated > ago(24h)
| summarize Count=count() by ProblemId
| order by Count desc
```

Check actual schema and column names in your workspace; telemetry schema and ingestion mapping vary.

### 41. How do you troubleshoot App Service performance?
Define the symptom (latency, 5xx, cold start or throughput) and time window. Compare App Service metrics (CPU, memory, requests, HTTP errors, instance count) with Application Insights p50/p95/p99, dependencies and exceptions. Check deployment changes, scale-out, thread pool starvation, sync-over-async, GC/memory, connection pool exhaustion, slow SQL, N+1 queries and downstream throttling. Use profiler/diagnostics if available, reproduce with load tests, make one controlled fix, and compare before/after telemetry. Scale-out cannot fix a blocking dependency or shared database bottleneck.

## Caching, cost and resilience

### 42. How do you implement distributed caching?
Place cache behind an application abstraction (`IDistributedCache` or a suitable Redis client); use deterministic tenant-aware keys, serialization/versioning, TTL, cache-aside reads and invalidation on writes. Protect against cache stampedes with locking or jitter where justified. Treat cache as disposable: the database remains source of truth; failures degrade gracefully. Do not cache sensitive cross-tenant responses under shared keys.

### 43. What is Azure Redis Cache and when use it?
Redis is a low-latency shared data store for distributed caching, session state, rate-limiting counters or ephemeral coordination. Azure's managed Redis offerings and retirement/migration status evolve; assess the current Azure Managed Redis options for a new design. Use it when multiple app instances need the same hot data and database reads are costly. Set expirations and memory policy, monitor hit ratio/evictions/latency and do not assume cache persistence is your system of record.

### 44. How do you optimize Azure cloud cost?
Measure cost per workload/environment with tags and budgets. Right-size App Service plans and database tiers based on utilization, tune autoscaling minimums, shut down nonproduction resources when unused, move old blobs to cheaper access tiers and apply lifecycle rules, and set log retention/sampling intentionally. Compare Functions/Container Apps versus always-on compute based on actual demand; use reservations or savings options for steady capacity where suitable. Recheck network egress, backup/replication and AI token/search index costs. Never cut redundancy or telemetry without measuring the reliability effect.

### 45. How do you design highly available Azure architecture?
Set availability SLO, RTO and RPO first. Use multiple App Service instances, health checks, zone redundancy where supported by selected plan/region, resilient database tier and backups, retry with exponential backoff and circuit breaking for transient dependencies, queues for asynchronous work, and monitoring with tested alerts. For region failures, deploy to a second region and route through Front Door or another global entry point, with replicated data and a tested failover procedure. Every dependency, including identity, DNS and storage, belongs in the failure analysis.

### 46. How do you implement disaster recovery?
Document RTO/RPO and identify critical data and dependencies. Enable appropriate database backup/geo-replication, storage redundancy and versioning, preserve infrastructure/pipelines as code, replicate artifacts/configuration to a secondary region and plan traffic failover. Test restoring data, credentials and network/DNS; run failover drills and verify consistency of queued work. Availability zones protect against a zone failure; they do not alone provide cross-region disaster recovery. Backups are only useful if restore time meets the target.

## Azure AI and your project story

### 47. What Azure AI services have you worked with?
**Tailored answer based on your Protocol Pro work:** “I integrated Azure OpenAI embeddings (`text-embedding-3-small`) with Azure AI Search to build source-grounded retrieval for clinical protocol authoring. Study and knowledge documents are stored in Azure Blob Storage, metadata and chunks in PostgreSQL, and the .NET API coordinates extraction, chunking, embedding and indexing. The next step is returning cited chunks with document/page/section metadata and using them for generated sections.” Adjust tense to your actual deployment state. Do not describe a planned search endpoint or PDF extraction as already delivered.

### 48. How do you integrate Azure OpenAI or Azure AI Services into .NET?
Configure service endpoint/deployment names outside source and authenticate with managed identity where the chosen SDK/service supports it; otherwise keep keys in Key Vault. Extract and normalize documents, chunk with overlap, request embeddings, store chunk IDs/source metadata, and index vectors plus searchable fields in Azure AI Search. At query time embed the query, retrieve relevant chunks with filtering (tenant/study/access), build a bounded prompt, call the chat model and return grounded citations. Add timeouts, retries honoring throttling, token budgets, content safety and monitoring. Evaluate retrieval quality, hallucinations, data isolation and cost. Never let retrieved text silently override system instructions.

### 49. Describe the Azure architecture used in your current project.
**Interview version, constrained to known implementation:** “Protocol Pro is an ASP.NET Core/.NET 9 API with a React frontend and PostgreSQL data store. We upload study documents and knowledge-base documents to Azure Blob Storage and retain document metadata and extracted chunks in PostgreSQL. The processing API downloads a DOCX, extracts text, creates overlapping chunks, and persists chunk metadata. We create embeddings with Azure OpenAI and have provisioned an Azure AI Search index for vector retrieval. The authoring workflow is based on study sections and role-based review. We use a GitHub Actions build/test pipeline; Azure hosting and a self-hosted IIS deployment path were evaluated/planned, so I would describe the actual deployed environment explicitly in an interview.”

**Design extension, clearly labeled:** “For a production Azure deployment, I would host the API on App Service, the React bundle on a suitable static host, PostgreSQL on a managed database, and run document processing asynchronously via Service Bus/Functions or a worker. Managed identity would connect to Blob, Key Vault and Search where supported; private endpoints/VNet Integration would protect data services. App Insights would trace requests and processing; slots and health checks would support releases. This is a proposed target architecture, not a claim that every component is already deployed.”

**Follow-up questions to prepare:** Why chunk size/overlap? How do you avoid duplicate processing and index stale chunks? How is study-level access enforced in retrieval? How are sources/page numbers presented? What happens when embedding or Search is unavailable? What is the actual hosting and recovery plan? Be ready with concrete measurements where you have them.

## Source notes (Microsoft Learn)

- [Azure App Service architecture guidance](https://learn.microsoft.com/azure/well-architected/service-guides/app-service-web-apps)
- [Compute choices for microservices](https://learn.microsoft.com/azure/architecture/microservices/design/compute-options)
- [Secure Azure Functions](https://learn.microsoft.com/azure/azure-functions/security-concepts)
- [Monitor Azure Functions](https://learn.microsoft.com/azure/azure-functions/configure-monitoring)
- [App Service managed identity](https://learn.microsoft.com/azure/app-service/overview-managed-identity)
- [App Service Key Vault references](https://learn.microsoft.com/azure/app-service/app-service-key-vault-references)
- [Compare Azure messaging services](https://learn.microsoft.com/azure/service-bus-messaging/compare-messaging-services)
- [Event Hubs overview](https://learn.microsoft.com/azure/event-hubs/event-hubs-about)
- [Application Insights architecture guidance](https://learn.microsoft.com/azure/well-architected/service-guides/application-insights)
- [Azure reliability guidance](https://learn.microsoft.com/azure/well-architected/reliability/)
