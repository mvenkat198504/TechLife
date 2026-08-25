---
id: csharp-constructor-001
slug: constructor
title: In Parent child which constructor fires first ??
categoryId: csharp
subcategory: constructor
difficulty: Basic
tags:
  - middleware
  - request-pipeline
  - aspnet-core
summary: Understand custom middleware with a production example.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# In Parent child which constructor fires first ?

## Interview-ready answer

Parent Constructor Fires first
When an object of a child class is instantiated, the execution follows a "top-to-bottom" order: 

## Detailed explanation

**Top-Down Approach:** Object creation begins from the top of the inheritance chain down to the specific derived class.
**Dependency:** A child class often relies on fields, methods, or state defined in the parent class. The parent must be fully initialized and built before the child can safely add or modify behavior.
**Implicit Chaining** Languages like Java and C# automatically invoke the default parent constructor (via an implicit or explicit super() or base() call) as the very first step when entering the child constructor.

%%%
---
id: csharp-constructor-002
slug: initializers
title: What about initializers ? In parent child relationship which initializers fires first?
categoryId: csharp
subcategory: constructor
difficulty: Experienced
tags:
  - middleware
  - request-pipeline
  - aspnet-core
summary: Understand custom middleware with a production example.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# What about initializers ?  In parent child relationship which initializers fires first?

## Interview-ready answer

Child initializers fires first second parent initializers will fire

![alt text](/images/csharp/constructor/image.png)
