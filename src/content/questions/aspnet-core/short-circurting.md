---
id: aspnet-custom-middleware-002
slug: short-circuiting
title: What is middleware short-circuiting?
categoryId: aspnet-core
subcategory: Request Pipeline
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

# What is middleware short-circuiting?

## Interview-ready answer

Middleware short-circuiting means a middleware ends the HTTP request 
pipeline early by generating a response without calling the next middleware.

## Code example

```csharp
app.Use(async (context, next) =>
{
    if (!context.Request.Headers.ContainsKey("X-API-Key"))
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsync("API key is missing");

        return; // Pipeline stops here
    }

    await next(); // Continues to the next middleware
});

```
- If the API key is missing:

- The response is returned immediately.
- next() is not called.
- Remaining middleware and controller actions do not execute.

- Common use cases include authentication failure, authorization failure,  rate limiting, maintenance mode, caching, request validation, and
-  returning static files.

## Interview answer:

“Middleware short-circuiting occurs when middleware handles the request and returns a response without invoking the next middleware in the ASP.NET Core pipeline.”

%%%
---
id: aspnet-custom-middleware-004
slug: middleware-vs-filters
title: What is the difference between middleware and filters?
categoryId: aspnet-core
subcategory: Request Pipeline
difficulty: Experienced
tags:
  - middleware
  - request-pipeline
  - aspnet-core
summary: Understand why the registration order of middleware changes app behavior.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# What is the difference between middleware and filters?

## Interview-ready answer

Middleware and filters both handle cross-cutting concerns, but they operate at different stages and scopes.

## Detailed explanation

Each middleware wraps the next one. If authentication runs after
authorization, every request will be denied because there is no identity yet.
Order also affects performance-sensitive middleware like response caching or
compression.

<!--
/*First row = header, second row must be the ---|--- separator, remaining rows = data.
Each row must start/end with |.
Inline code like `next()` works inside cells.*/
-->

| Middleware | Filters |
|---|---|
| Runs in the ASP.NET Core HTTP pipeline | Runs inside the MVC/controller action pipeline |
| Applies to nearly all HTTP requests | Applies to controllers or actions |
| Executes before routing/endpoints and around downstream middleware, depending on its order | Executes before or after controller action execution |
| Has access mainly to `HttpContext` | Has access to MVC details such as action arguments, model state, controller and action results |
| Can short-circuit by not calling **`next()`** | Can short-circuit by assigning a result to the filter context |
| Registered in `Program.cs` | Registered globally or using attributes/controller configuration |
| Suitable for general request-level concerns | Suitable for MVC/action-specific concerns |

## Code example

```csharp
app.Use(async (context, next) =>
{
    // Before the remaining pipeline
    Console.WriteLine($"Request: {context.Request.Path}");

    await next();

    // After the remaining pipeline
    Console.WriteLine($"Status: {context.Response.StatusCode}");
});
```
## Real-project scenario

A production bug caused all requests to return 401 because the CORS
middleware was registered after authorization. Reordering it fixed access for
legitimate cross-origin clients.

## Best practices

- Register exception handling and HTTPS redirection first.
- Place authentication before authorization.
- Register CORS before authentication/authorization when needed by clients.

## Common mistakes

- Registering authorization before authentication.
- Adding logging middleware after the response has already been written.

## Interview tip

Walk through the standard ASP.NET Core middleware order and explain the
consequence of swapping two of them.
