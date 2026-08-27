---
id: aspnet-caching-001
slug: TypeofCaching 
title: Type of Caching in .Net Core?
categoryId: aspnet-core
subcategory: caching
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

# 5. Type of Caching in .Net Core

## Type of Caching 

1.In-Memory Cache
2.Distributed Cache
3.Response Caching
4.Output Caching (modern)

## 1.In-Memory Cache
Stores data in server memory.
Best for:
- Single server applications 
- Frequently accessed data 
- Small to medium applications

![cach1](/images/aspnet-core/caching/cach1.png)

**Setup - Register in Program.cs:**
```csharp
builder.Services.AddMemoryCache();
```

**Usage Example - Inject & Use:**
```csharp
public class ProductService
{
    private readonly IMemoryCache _cache;

    public ProductService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public async Task<List<Product>> GetProducts()
    {
        const string key = "products";

        if (!_cache.TryGetValue(key, out List<Product>? products))
        {
            products = await GetProductsFromDatabase();
            _cache.Set(key, products, TimeSpan.FromMinutes(10));
        }

        return products!;
    }
}
```

**JavaScript Alternative:**
```javascript
// Simple in-memory cache using Map
class MemoryCache {
    constructor() {
        this.cache = new Map();
    }

    set(key, value, ttlMinutes = 10) {
        const expiresAt = Date.now() + (ttlMinutes * 60 * 1000);
        this.cache.set(key, { value, expiresAt });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
}

// Usage
const cache = new MemoryCache();
cache.set('products', productList, 10);
const products = cache.get('products');
```


## 2.Distributed Cache
Stores cache in external storage like:
- Redis 
- SQL Server 
- NCache 

![cach2](/images/aspnet-core/caching/cach2.png)

**Best for:**
- Load balanced applications 
- Microservices 
- Multi-server environments

**Redis Architecture:**
```text
Architecture:

          ┌── API Server 1 ──┐
Client ───┤                  ├── Redis Cache
          └── API Server 2 ──┘
                   │
               Database
```
**Setup - Register Redis in Program.cs:**

```csharp
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = "localhost:6379";
});
```

**Usage Example - Inject & Use:**
```csharp
public class OrderService
{
    private readonly IDistributedCache _cache;

    public OrderService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<Order> GetOrderAsync(string orderId)
    {
        var key = $"order_{orderId}";
        var cachedOrder = await _cache.GetStringAsync(key);

        if (string.IsNullOrEmpty(cachedOrder))
        {
            var order = await GetOrderFromDatabaseAsync(orderId);
            await _cache.SetStringAsync(key, JsonSerializer.Serialize(order), 
                new DistributedCacheEntryOptions 
                { 
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) 
                });
            return order;
        }

        return JsonSerializer.Deserialize<Order>(cachedOrder)!;
    }
}
```

**JavaScript Alternative (Redis):**
```javascript
// Using redis npm package
import { createClient } from 'redis';

const client = createClient({ host: 'localhost', port: 6379 });
await client.connect();

class DistributedCache {
    async set(key, value, ttlMinutes = 10) {
        await client.setEx(key, ttlMinutes * 60, JSON.stringify(value));
    }

    async get(key) {
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    }
}

// Usage
const cache = new DistributedCache();
await cache.set('order_123', orderData, 10);
const order = await cache.get('order_123');
```

## 3. Response Caching
Caches HTTP responses at middleware level. Useful for caching entire API responses with HTTP headers.

**Best for:**
- Public API responses
- Static or semi-static data
- Client & server caching

![cach3](/images/aspnet-core/caching/caching3.png)

**Setup - Register in Program.cs:**
```csharp
builder.Services.AddResponseCaching();
app.UseResponseCaching();
```

**Usage Example - Apply to Endpoints:**
```csharp
app.MapGet("/api/products", GetProducts)
    .WithName("GetProducts")
    .Produces<List<Product>>(StatusCodes.Status200OK)
    .CacheOutput(policy => policy.Expire(TimeSpan.FromMinutes(10)));

async Task<IResult> GetProducts(IProductRepository repo)
{
    var products = await repo.GetAllAsync();
    return Results.Ok(products);
}
```

**Response Headers:**
```csharp
[ResponseCache(Duration = 600, Location = ResponseCacheLocation.Any)]
public async Task<ActionResult<List<Product>>> GetProducts()
{
    var products = await _service.GetProductsAsync();
    return Ok(products);
}
```

**JavaScript Alternative (Express):**
```javascript
// Using express middleware for response caching
import cacheControl from 'express-cache-control';

const cacheMiddleware = cacheControl({ 
    maxAge: '10 minutes' 
});

app.get('/api/products', cacheMiddleware, async (req, res) => {
    const products = await getProductsFromDatabase();
    res.set('Cache-Control', 'public, max-age=600');
    res.json(products);
});
```
