---
id: design-patterns-saga-pattern
slug: saga-pattern
title: SAGA Pattern
categoryId: design-patterns
subcategory: saga pattern-basics
difficulty: Basic
tags:
  - saga pattern
  - design pattern
  - Choreography
  - Orchestration
summary: SAGA Pattern
updatedAt: 2026-09-25
status: published
thumbnail: ""
videos: []
resources: []
---

# SAGA Pattern

## SAGA Patttern

The Saga pattern is a design pattern used to manage distributed transactions and maintain data consistency across multiple independent microservices using a sequence of local transactions

Instead of locking databases across services (like traditional two-phase commit or 2PC protocols), a Saga executes local transactions independently in each service. If a step fails, the Saga runs compensating transactions to undo the changes made by preceding steps

The Saga pattern is a design pattern used to manage distributed transactions and maintain eventual data consistency across multiple microservices

In a traditional monolithic application, ACID transactions ensure data integrity via a single database. In a microservices architecture, each microservice owns its own database. Since you cannot easily perform a standard database rollback across separate databases, the Saga pattern breaks a long-running business transaction into a sequence of smaller, independent local transactions. Each step updates its own database and triggers the next step. If a step fails, the saga executes compensating transactions to explicitly undo the changes made by previous steps

**How It Works: An E-Commerce Example**
Imagine a customer placing an order:

1.Order Service: Creates an order with a "Pending" status
2.Inventory Service: Reserves the product stock
3.Payment Service: Processes the customer's credit card
4.Delivery Service: Ships the product

Payment Service fails (e.g., insufficient funds), the system triggers compensating actions in reverse order: the Inventory Service releases the reserved stock, and the Order Service marks the order as cancelled. This achieves eventual consistency rather than immediate ACID consistency.

Popular Frameworks for .NET CoreWhile you can write custom code using raw message brokers like **RabbitMQ or Azure Service Bus**, production-grade .NET systems typically leverage specialized open-source libraries that handle state preservation, outbox patterns, and timeouts out of the box:

#### Two Ways to Coordinate Sagas
**1. Choreography (Event-Driven)**

- **What it is:** There is no central coordinator. Each service performs its local transaction and publishes a domain event. Other services listen to these events and decide whether to trigger their own local actions.
- **Best for:** Simple workflows with few participants.
- **Drawback:** Harder to track the flow; can lead to cyclic dependencies or tight coupling via event channels if not carefully managed.

**2. Orchestration (Centralized Coordinator)**

- **What it is:** A central coordinator—known as an orchestrator or Saga Execution Coordinator—tells each participant which command/local transaction to execute
- **Best for:** Complex business processes where dependencies are intricate.
- **Drawback:** The orchestrator can become a single point of logic centralization, though it avoids tight coupling between individual microservices.

#### Key Benefits & Considerations

**High Availability & Scalability:** Services operate independently without holding blocking database locks.

**Compensating Actions Required:** Every operation must have a logical reversal step (e.g., Refund for Charge, Restock for Reserve).

**Idempotency is Critical:** Because network failures can cause messages or events to be delivered more than once, every local step and compensation must be idempotent (safe to run multiple times without changing the final result beyond the initial execution).

**Eventual Consistency:** Systems using Sagas must tolerate a brief window where data across microservices is temporarily inconsistent before compensations or completions finish.

![saga_pattern_1.png](/images/design-patterns/saga-pattern-basics/saga_pattern_1.png)
![saga_pattern_2.png](/images/design-patterns/saga-pattern-basics/saga_pattern_2.png)
![saga_pattern_3.png](/images/design-patterns/saga-pattern-basics/saga_pattern_3.png)
![saga_pattern_4.png](/images/design-patterns/saga-pattern-basics/saga_pattern_4.png)
![saga_pattern_5.png](/images/design-patterns/saga-pattern-basics/saga_pattern_5.png)
![saga_pattern_6.png](/images/design-patterns/saga-pattern-basics/saga_pattern_6.png)
![saga_pattern_7.png](/images/design-patterns/saga-pattern-basics/saga_pattern_7.png)


