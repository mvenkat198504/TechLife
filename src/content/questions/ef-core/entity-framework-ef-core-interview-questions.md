---
id: entity-framework-001
slug: entity-framework-basic
categoryId: ef-core
subcategory: Entity-Framework-Core
difficulty: Basic
title: Entity Framework & EF Core Interview Questions and Answers
description: Top Entity Framework and EF Core interview questions from  beginner to experienced level, with C# examples, interview tips,  traps, performance scenarios, and senior-level answers.
tags: [C#,NET,Entity Framework,EF Core, LINQ, SQL, ASP.NET Core, Interview Questions]
updatedAt: 2026-09-09
status: published
thumbnail: ""
videos: []
resources: []
---


# Entity Framework & EF Core Interview Questions and Answers

Entity Framework (EF) and Entity Framework Core (EF Core) are
Object-Relational Mapping (ORM) technologies used in .NET applications
to work with relational databases through .NET objects.

This guide is designed for **freshers, intermediate developers, and
experienced/senior .NET candidates**.

It focuses on:

-   EF and EF Core fundamentals
-   `DbContext` and `DbSet`
-   CRUD operations
-   Code First and migrations
-   Relationships
-   Change tracking
-   `IQueryable` and LINQ translation
-   Loading strategies
-   `AsNoTracking`
-   N+1 queries
-   Projection
-   Transactions and concurrency
-   Query performance
-   Production scenarios
-   Senior-level interview traps

------------------------------------------------------------------------

# Beginner Level

## 1. What is Entity Framework?

**Answer**

Entity Framework is an ORM for .NET.

ORM stands for **Object-Relational Mapping**. It maps database tables
and relationships to .NET classes and objects.

Instead of writing SQL for every operation, developers can use C# and
LINQ.

``` csharp
var employees = await dbContext.Employees
    .Where(x => x.IsActive)
    .ToListAsync();
```

EF translates supported LINQ expressions into SQL, executes the query,
and materializes the result into .NET objects.

## Interview Tip

A concise answer:

> Entity Framework is an ORM that allows .NET applications to interact
> with relational databases using strongly typed .NET objects and LINQ
> instead of writing most data-access code manually.

------------------------------------------------------------------------

## 2. What is EF Core?

**Answer**

EF Core is the modern, cross-platform Entity Framework implementation
for .NET.

It provides features such as:

-   LINQ queries
-   Change tracking
-   Relationships
-   Migrations
-   Transactions
-   Raw SQL
-   Database provider support
-   Asynchronous database operations

Example registration:

``` csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

------------------------------------------------------------------------

## 3. What is the difference between Entity Framework and EF Core?

**Answer**

Classic Entity Framework (commonly EF6) was designed primarily for the
.NET Framework ecosystem.

EF Core is the modern implementation used with current .NET applications
and is cross-platform.

For new ASP.NET Core applications, EF Core is normally the relevant
technology.

## Interview Trap

Do not describe EF Core as simply a newer version of EF6 with identical
behavior. They have different implementations and feature histories.

------------------------------------------------------------------------

## 4. What is ORM?

**Answer**

ORM maps relational database concepts to object-oriented concepts.

``` text
Database Table    -> C# Entity Class
Row               -> Object
Column            -> Property
Foreign Key       -> Relationship / Navigation Property
```

Example:

``` csharp
public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
```

The `Employee` class can map to an `Employees` table.

------------------------------------------------------------------------

## 5. What is DbContext?

**Answer**

`DbContext` represents a session with the database and is one of the
central EF Core classes.

It is responsible for:

-   Querying entities
-   Tracking entity changes
-   Saving changes
-   Managing database interaction
-   Providing access to entity sets

``` csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();
}
```

## Interview Tip

In ASP.NET Core, `DbContext` is normally registered as a **scoped**
dependency so a request gets an appropriate context lifetime.

------------------------------------------------------------------------

## 6. What is DbSet`<T>`{=html}?

**Answer**

`DbSet<T>` represents an entity set that can be queried and modified.

``` csharp
public DbSet<Employee> Employees => Set<Employee>();
```

Typical operations include:

``` csharp
dbContext.Employees.Add(employee);

var employee = await dbContext.Employees
    .FirstOrDefaultAsync(x => x.Id == id);

dbContext.Employees.Remove(employee);
```

------------------------------------------------------------------------

## 7. How do you configure EF Core in ASP.NET Core?

**Answer**

Register the context in `Program.cs`:

``` csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

Example configuration:

``` json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=InterviewDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

Inject it through constructor injection:

``` csharp
public class EmployeeService
{
    private readonly AppDbContext _db;

    public EmployeeService(AppDbContext db)
    {
        _db = db;
    }
}
```

------------------------------------------------------------------------

## 8. What are Code First and Database First?

**Answer**

**Code First** starts with entity classes and model configuration.
Migrations can then create or evolve the database schema.

**Database First** starts with an existing database and scaffolds entity
classes and a context from that schema.

Example scaffolding command:

``` bash
dotnet ef dbcontext scaffold \
"connection-string" \
Microsoft.EntityFrameworkCore.SqlServer
```

------------------------------------------------------------------------

## 9. What are EF Core migrations?

**Answer**

Migrations provide a versioned way to evolve the database schema as the
EF Core model changes.

Typical commands:

``` bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

After a model change:

``` bash
dotnet ef migrations add AddEmployeeEmail
dotnet ef database update
```

## Interview Tip

In production, migrations should be reviewed and deployed through a
controlled release process rather than treated as an unexamined
automatic schema change.

------------------------------------------------------------------------

## 10. How do you perform CRUD operations?

**Create**

``` csharp
var employee = new Employee
{
    Name = "Arun"
};

dbContext.Employees.Add(employee);
await dbContext.SaveChangesAsync();
```

## Read

``` csharp
var employee = await dbContext.Employees
    .FirstOrDefaultAsync(x => x.Id == id);
```

## Update

``` csharp
var employee = await dbContext.Employees.FindAsync(id);

if (employee != null)
{
    employee.Name = "John";
    await dbContext.SaveChangesAsync();
}
```

## Delete

``` csharp
var employee = await dbContext.Employees.FindAsync(id);

if (employee != null)
{
    dbContext.Employees.Remove(employee);
    await dbContext.SaveChangesAsync();
}
```

------------------------------------------------------------------------

## 11. What does SaveChanges() do?

**Answer**

`SaveChanges()` detects tracked changes and sends the required insert,
update, and delete commands to the database.

``` csharp
dbContext.Employees.Add(employee);
dbContext.SaveChanges();
```

For web applications, asynchronous I/O is commonly preferred:

``` csharp
await dbContext.SaveChangesAsync();
```

------------------------------------------------------------------------

## 12. Find vs FirstOrDefault vs SingleOrDefault

**Answer**

`Find` is primarily useful for lookup by primary key and can return an
already tracked entity without querying the database.

``` csharp
var employee = await dbContext.Employees.FindAsync(id);
```

`FirstOrDefault` returns the first matching record or the default value.

``` csharp
var employee = await dbContext.Employees
    .FirstOrDefaultAsync(x => x.Email == email);
```

`SingleOrDefault` expects zero or one matching record and throws if
multiple records match.

``` csharp
var employee = await dbContext.Employees
    .SingleOrDefaultAsync(x => x.EmployeeCode == code);
```

## Interview Trap

Do not use `SingleOrDefault` merely because you want one row. Use it
when multiple matches indicate a correctness problem.

------------------------------------------------------------------------

## 13. What are navigation properties?

**Answer**

Navigation properties represent relationships between entities.

``` csharp
public class Employee
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }

    public Department Department { get; set; } = null!;
}
```

``` csharp
public class Department
{
    public int Id { get; set; }
    public ICollection<Employee> Employees { get; set; }
        = new List<Employee>();
}
```

------------------------------------------------------------------------

## 14. What is OnModelCreating()?

**Answer**

`OnModelCreating` is used to configure the EF Core model through the
Fluent API.

``` csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Employee>()
        .HasKey(x => x.Id);

    modelBuilder.Entity<Employee>()
        .Property(x => x.Name)
        .HasMaxLength(100)
        .IsRequired();
}
```

------------------------------------------------------------------------

## 15. Data Annotations vs Fluent API

**Answer**

Data Annotations place mapping information on entity classes.

``` csharp
[Required]
[MaxLength(100)]
public string Name { get; set; } = string.Empty;
```

Fluent API keeps detailed mapping in model configuration.

``` csharp
modelBuilder.Entity<Employee>()
    .Property(x => x.Name)
    .HasMaxLength(100)
    .IsRequired();
```

For complex mappings, Fluent API is generally more expressive.

------------------------------------------------------------------------

# Intermediate Level

## 16. What is change tracking?

**Answer**

EF Core tracks entity state so it can determine what database operations
are required when `SaveChanges` executes.

Common states include:

``` text
Added
Modified
Deleted
Unchanged
Detached
```

Example:

``` csharp
var employee = await dbContext.Employees.FindAsync(id);

employee!.Name = "Updated Name";

await dbContext.SaveChangesAsync();
```

EF detects the changed property and generates an update.

------------------------------------------------------------------------

## 17. What is AsNoTracking()?

**Answer**

`AsNoTracking()` tells EF Core not to track returned entities.

``` csharp
var employees = await dbContext.Employees
    .AsNoTracking()
    .Where(x => x.IsActive)
    .ToListAsync();
```

It is useful for read-only queries because tracking is unnecessary when
the returned entities will not be modified and saved through the same
context.

## Interview Tip

For read-heavy APIs, `AsNoTracking()` is an important performance tool,
but it should not be applied blindly when entity tracking is required.

------------------------------------------------------------------------

## 18. Tracking vs No-Tracking queries

## Tracking

``` csharp
var employee = await dbContext.Employees.FindAsync(id);

employee!.Name = "Changed";

await dbContext.SaveChangesAsync();
```

EF knows the entity was modified.

## No Tracking

``` csharp
var employee = await dbContext.Employees
    .AsNoTracking()
    .FirstAsync(x => x.Id == id);
```

EF does not track that returned entity for normal change detection.

------------------------------------------------------------------------

## 19. Explain eager, lazy, and explicit loading

## Eager Loading

Load related data as part of the query.

``` csharp
var orders = await dbContext.Orders
    .Include(x => x.Customer)
    .ToListAsync();
```

## Explicit Loading

Load a relationship explicitly after loading the entity.

``` csharp
var customer = await dbContext.Customers.FindAsync(id);

await dbContext.Entry(customer!)
    .Collection(x => x.Orders)
    .LoadAsync();
```

## Lazy Loading

Related data is loaded when the navigation property is accessed, when
lazy-loading support is configured.

## Interview Trap

Lazy loading can make code convenient but may create hidden database
calls and the N+1 problem.

------------------------------------------------------------------------

## 20. What are Include() and ThenInclude()?

**Answer**

They eager-load related entities.

``` csharp
var orders = await dbContext.Orders
    .Include(x => x.Customer)
    .Include(x => x.OrderItems)
        .ThenInclude(x => x.Product)
    .ToListAsync();
```

`Include` loads a navigation property and `ThenInclude` continues
through another relationship.

------------------------------------------------------------------------

## 21. What is the N+1 query problem?

**Answer**

N+1 occurs when one query retrieves a set of parent records and then
additional queries are issued for related data for each parent.

Conceptually:

``` text
1 query -> Employees
N queries -> Department for each employee
```

Possible solutions include eager loading or projection.

``` csharp
var employees = await dbContext.Employees
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name,
        DepartmentName = x.Department.Name
    })
    .ToListAsync();
```

## Interview Tip

For APIs, projection is often preferable when only a small response
shape is needed.

------------------------------------------------------------------------

## 22. IEnumerable vs IQueryable in EF Core

**Answer**

`IEnumerable<T>` is commonly associated with in-memory enumeration.

`IQueryable<T>` carries an expression tree that a provider such as EF
Core can inspect and translate.

``` csharp
IQueryable<Employee> query = dbContext.Employees;

query = query.Where(x => x.Salary > 50000);

var result = await query.ToListAsync();
```

The filter can execute in the database.

Compare:

``` csharp
var employees = await dbContext.Employees.ToListAsync();

var result = employees
    .Where(x => x.Salary > 50000);
```

Here the rows were materialized before the later filtering.

## Interview Trap

Avoid calling `ToList()` too early.

------------------------------------------------------------------------

## 23. What is deferred execution?

**Answer**

Many query-building LINQ operators do not execute the database query
immediately.

``` csharp
var query = dbContext.Employees
    .Where(x => x.IsActive);
```

The database query executes when a terminal/materialization operation is
used, for example:

``` csharp
var employees = await query.ToListAsync();
```

This makes queries composable.

------------------------------------------------------------------------

## 24. Why is calling ToList() too early a problem?

## Bad

``` csharp
var employees = dbContext.Employees
    .ToList()
    .Where(x => x.Salary > 50000);
```

Rows are loaded before the salary filter is applied.

## Better

``` csharp
var employees = dbContext.Employees
    .Where(x => x.Salary > 50000)
    .ToList();
```

The provider can translate the filter into SQL.

## Interview Line

> Keep the query as `IQueryable` until useful database-side filtering,
> projection, sorting, and pagination have been applied.

------------------------------------------------------------------------

## 25. How does EF Core translate LINQ into SQL?

**Answer**

When LINQ is used over an EF Core `IQueryable`, lambda expressions are
represented in an expression tree.

EF Core analyzes that query expression and asks the database provider to
translate supported operations into SQL.

``` csharp
var employees = await dbContext.Employees
    .Where(x => x.IsActive && x.Salary > 50000)
    .Select(x => new { x.Id, x.Name })
    .ToListAsync();
```

Conceptually the SQL can resemble:

``` sql
SELECT Id, Name
FROM Employees
WHERE IsActive = 1
  AND Salary > 50000;
```

Exact SQL depends on the provider and EF Core version.

------------------------------------------------------------------------

## 26. Why can't every C# method be used in an EF Core query?

**Answer**

A database provider can translate only expressions it understands.

Problematic example:

``` csharp
var employees = await dbContext.Employees
    .Where(x => MyCustomCheck(x.Name))
    .ToListAsync();
```

A custom C# method may have no SQL translation.

A deliberate approach is to perform supported filtering first and switch
to in-memory processing only for a suitably small result set.

``` csharp
var employees = dbContext.Employees
    .Where(x => x.IsActive)
    .AsEnumerable()
    .Where(x => MyCustomCheck(x.Name))
    .ToList();
```

## Interview Trap

Do not use `AsEnumerable()` early on a huge table just to bypass
translation limitations.

------------------------------------------------------------------------

## 27. What is an expression tree?

**Answer**

An expression tree represents code as data.

``` csharp
Expression<Func<Employee, bool>> filter =
    x => x.Salary > 50000;
```

EF Core can inspect the structure and translate supported expressions.

A useful distinction:

``` csharp
Func<Employee, bool>
```

is executable delegate code, while:

``` csharp
Expression<Func<Employee, bool>>
```

represents the expression structure.

------------------------------------------------------------------------

## 28. AsEnumerable() vs ToList()

**Answer**

`AsEnumerable()` switches subsequent LINQ processing to `IEnumerable`
semantics without itself being a list materialization operation.

``` csharp
var result = dbContext.Employees
    .Where(x => x.IsActive)
    .AsEnumerable()
    .Where(x => CustomCheck(x));
```

`ToList()` materializes the query result into a list.

``` csharp
var employees = await dbContext.Employees
    .Where(x => x.IsActive)
    .ToListAsync();
```

------------------------------------------------------------------------

## 29. How do you use raw SQL in EF Core?

**Answer**

Raw SQL can be useful when SQL is the clearest or most appropriate
solution.

Example entity query:

``` csharp
var employees = await dbContext.Employees
    .FromSqlInterpolated(
        $"SELECT * FROM Employees WHERE DepartmentId = {departmentId}")
    .ToListAsync();
```

## Interview Tip

Prefer parameterized/interpolated EF APIs rather than constructing SQL
by concatenating untrusted input.

------------------------------------------------------------------------

## 30. How do transactions work in EF Core?

**Answer**

A single `SaveChanges` call is normally transactional for providers that
support transactions.

For multiple operations that must succeed or fail together, an explicit
transaction can be used.

``` csharp
await using var transaction =
    await dbContext.Database.BeginTransactionAsync();

try
{
    dbContext.Orders.Add(order);
    await dbContext.SaveChangesAsync();

    dbContext.Payments.Add(payment);
    await dbContext.SaveChangesAsync();

    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

------------------------------------------------------------------------

# Experienced / Senior Level

## 31. How do you improve a slow EF Core query?

**Answer**

Investigate the whole database path rather than changing LINQ randomly.

Check:

-   Generated SQL
-   Number of SQL queries
-   Returned rows and columns
-   N+1 behavior
-   Unnecessary `Include`
-   Missing projection
-   Tracking overhead
-   Client-side processing
-   Pagination
-   Database indexes
-   Execution plan
-   Expensive joins
-   Sorting
-   Network payload

A typical optimized read query:

``` csharp
var employees = await dbContext.Employees
    .AsNoTracking()
    .Where(x => x.IsActive)
    .OrderBy(x => x.Id)
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name,
        DepartmentName = x.Department.Name
    })
    .Take(100)
    .ToListAsync();
```

------------------------------------------------------------------------

## 32. How can you inspect generated SQL?

**Answer**

For a query, `ToQueryString()` is useful during diagnosis:

``` csharp
var query = dbContext.Employees
    .Where(x => x.IsActive);

var sql = query.ToQueryString();
```

Logging can also be configured so database commands can be observed
during development and diagnostics.

## Interview Tip

For a serious performance problem, do not stop at the generated SQL.
Examine the database execution plan and indexes too.

------------------------------------------------------------------------

# 33. What are AsSingleQuery() and AsSplitQuery()?

**Answer**

When loading multiple related collections, one large joined SQL query
can create substantial row duplication.

`AsSplitQuery()` can split related collection loading into multiple SQL
queries.

``` csharp
var departments = await dbContext.Departments
    .Include(x => x.Employees)
    .Include(x => x.Projects)
    .AsSplitQuery()
    .ToListAsync();
```

`AsSingleQuery()` requests the single-query behavior.

## Interview Trap

Split queries are not automatically faster. They trade one large joined
result for multiple database round trips/queries. Measure the actual
workload.

------------------------------------------------------------------------

## 34. Why is projection important?

**Answer**

Projection fetches the data shape the caller actually needs.

Less efficient for a small DTO requirement:

``` csharp
var employees = await dbContext.Employees
    .Include(x => x.Department)
    .ToListAsync();
```

More targeted:

``` csharp
var employees = await dbContext.Employees
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name,
        DepartmentName = x.Department.Name
    })
    .ToListAsync();
```

Projection can reduce:

-   Selected columns
-   Network payload
-   Entity materialization
-   Tracking needs

------------------------------------------------------------------------

## 35. Include() vs Select() projection

## Include

Use when the application genuinely needs entity graphs.

``` csharp
var order = await dbContext.Orders
    .Include(x => x.OrderItems)
    .FirstAsync(x => x.Id == id);
```

## Projection

Use when only a response/read model is required.

``` csharp
var order = await dbContext.Orders
    .Where(x => x.Id == id)
    .Select(x => new OrderDto
    {
        Id = x.Id,
        Total = x.Total,
        ItemCount = x.OrderItems.Count
    })
    .FirstAsync();
```

------------------------------------------------------------------------

## 36. What is optimistic concurrency?

**Answer**

Optimistic concurrency assumes conflicts are uncommon and detects
whether data changed between read and update.

A SQL Server row-version column can be configured:

``` csharp
public class Employee
{
    public int Id { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
```

When another process has changed the row, `SaveChanges` can throw:

``` csharp
DbUpdateConcurrencyException
```

The application then decides whether to reload, merge, retry, or reject
the update.

------------------------------------------------------------------------

## 37. How do you implement soft delete?

**Answer**

Instead of physically deleting a row, mark it deleted.

``` csharp
public bool IsDeleted { get; set; }
```

A global query filter can hide deleted rows by default:

``` csharp
modelBuilder.Entity<Employee>()
    .HasQueryFilter(x => !x.IsDeleted);
```

Delete operation:

``` csharp
employee.IsDeleted = true;
await dbContext.SaveChangesAsync();
```

When necessary, the filter can be deliberately bypassed:

``` csharp
var all = await dbContext.Employees
    .IgnoreQueryFilters()
    .ToListAsync();
```

------------------------------------------------------------------------

## 38. What are global query filters?

**Answer**

Global query filters automatically apply a predicate to queries for an
entity.

``` csharp
modelBuilder.Entity<Order>()
    .HasQueryFilter(x => !x.IsDeleted);
```

They are commonly considered for:

-   Soft delete
-   Tenant filtering

## Interview Trap

Remember that filters can affect queries implicitly.
Administrative/reporting operations may need carefully controlled use of
`IgnoreQueryFilters()`.

------------------------------------------------------------------------

## 39. How would you implement auditing?

**Answer**

A common design stores fields such as:

``` csharp
CreatedAt
CreatedBy
ModifiedAt
ModifiedBy
```

One approach is to inspect tracked entries before saving.

``` csharp
public override Task<int> SaveChangesAsync(
    CancellationToken cancellationToken = default)
{
    var entries = ChangeTracker
        .Entries<AuditableEntity>();

    foreach (var entry in entries)
    {
        if (entry.State == EntityState.Added)
        {
            entry.Entity.CreatedAt = DateTime.UtcNow;
        }

        if (entry.State == EntityState.Modified)
        {
            entry.Entity.ModifiedAt = DateTime.UtcNow;
        }
    }

    return base.SaveChangesAsync(cancellationToken);
}
```

For enterprise systems, user identity, immutable audit history,
compliance requirements, and bulk operations also need consideration.

------------------------------------------------------------------------

## 40. How do you implement multi-tenancy?

**Answer**

A shared-database approach can store `TenantId` on tenant-owned entities
and use a global query filter.

``` csharp
modelBuilder.Entity<Order>()
    .HasQueryFilter(x => x.TenantId == _tenantId);
```

The tenant ID must come from a trusted server-side context, not blindly
from a client-provided value.

## Interview Trap

Multi-tenancy is a security boundary. Filtering alone is not enough
unless tenant identity and all data-access paths are carefully
controlled.

------------------------------------------------------------------------

## 41. ExecuteUpdate and ExecuteDelete

**Answer**

For set-based changes, modern EF Core supports operations that can
update or delete matching rows without loading each entity first.

``` csharp
await dbContext.Employees
    .Where(x => !x.IsActive)
    .ExecuteUpdateAsync(setters =>
        setters.SetProperty(
            x => x.Status,
            "Inactive"));
```

Delete:

``` csharp
await dbContext.Logs
    .Where(x => x.CreatedAt < cutoff)
    .ExecuteDeleteAsync();
```

These are valuable when normal per-entity change tracking is
unnecessary.

## Interview Trap

Because these operations bypass normal tracked-entity modification
workflows, consider effects on tracked state, auditing logic,
concurrency expectations, and domain behavior.

------------------------------------------------------------------------

## 42. Why should DbContext normally be Scoped?

**Answer**

In an ASP.NET Core request/response application, a scoped context
provides a natural unit-of-work boundary.

``` csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));
```

A singleton context would live across requests, causing problems with
long-lived tracking state, concurrency, lifetime management, and
cross-request behavior.

## Critical Rule

Do not inject a scoped `DbContext` directly into a singleton service.

------------------------------------------------------------------------

## 43. Is DbContext thread-safe?

**Answer**

No. A `DbContext` should not be used concurrently by multiple
threads/parallel operations.

Bad idea:

``` csharp
var task1 = dbContext.Employees.ToListAsync();
var task2 = dbContext.Departments.ToListAsync();

await Task.WhenAll(task1, task2);
```

If true parallel database work is required, use separate context
instances with appropriate lifetime management.

## Interview Line

> A DbContext represents a unit of work and is not thread-safe; don't
> share one context across concurrent operations.

------------------------------------------------------------------------

## 44. Repository Pattern on top of EF Core --- should we use it?

**Answer**

There is no universal yes/no answer.

EF Core already provides repository/unit-of-work-like capabilities
through `DbSet` and `DbContext`.

An additional repository layer can be useful when it:

-   Encapsulates meaningful domain queries
-   Creates a boundary around persistence
-   Supports a chosen architecture
-   Prevents duplicated query logic

It can become harmful when it only wraps every EF method mechanically:

``` csharp
GetAll()
GetById()
Add()
Update()
Delete()
```

without adding meaningful abstraction.

## Senior Interview Answer

> I use repositories when they provide a useful application/domain
> boundary, not merely because every EF Core project must have a generic
> repository.

------------------------------------------------------------------------

## 45. How do you handle millions of rows?

**Answer**

Never load the whole table merely to filter or paginate in application
memory.

Use database-side:

-   Filtering
-   Projection
-   Pagination
-   Aggregation
-   Appropriate indexes

Example:

``` csharp
var page = await dbContext.Orders
    .AsNoTracking()
    .Where(x => x.Status == "Open")
    .OrderBy(x => x.Id)
    .Select(x => new OrderListDto
    {
        Id = x.Id,
        Total = x.Total
    })
    .Take(100)
    .ToListAsync();
```

For large sequential result sets, keyset pagination is often worth
considering.

------------------------------------------------------------------------

# 46. Offset vs keyset pagination

## Offset Pagination

``` csharp
var page = await dbContext.Orders
    .OrderBy(x => x.Id)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

Easy to implement and supports jumping to arbitrary page numbers, but
deep offsets can become expensive.

## Keyset Pagination

``` csharp
var page = await dbContext.Orders
    .Where(x => x.Id > lastSeenId)
    .OrderBy(x => x.Id)
    .Take(pageSize)
    .ToListAsync();
```

This can be much more efficient for sequential navigation over large
datasets when the ordering and index design support it.

------------------------------------------------------------------------

## 47. How do indexes affect EF Core performance?

**Answer**

EF Core generates database queries, but the database still needs an
efficient access path.

If an API frequently executes:

``` csharp
dbContext.Orders
    .Where(x => x.CustomerId == customerId &&
                x.Status == status)
```

appropriate database indexes may dramatically affect performance.

## Interview Tip

EF Core optimization is not only a C# problem. Always consider generated
SQL, indexes, statistics, and the execution plan.

------------------------------------------------------------------------

## 48. What is Cartesian explosion?

**Answer**

Loading several collection navigations in one joined query can duplicate
parent data across many rows.

Example:

``` csharp
var departments = await dbContext.Departments
    .Include(x => x.Employees)
    .Include(x => x.Projects)
    .ToListAsync();
```

If a department has many employees and projects, the joined result can
become much larger than expected.

Possible responses include:

-   Projection
-   `AsSplitQuery()`
-   Redesigning the requested data shape

------------------------------------------------------------------------

## 49. How do you prevent over-fetching?

**Answer**

Project only required fields.

Bad for a list endpoint:

``` csharp
var employees = await dbContext.Employees
    .Include(x => x.Department)
    .Include(x => x.Projects)
    .ToListAsync();
```

Better when only summary data is needed:

``` csharp
var employees = await dbContext.Employees
    .AsNoTracking()
    .Select(x => new EmployeeListDto
    {
        Id = x.Id,
        Name = x.Name,
        DepartmentName = x.Department.Name
    })
    .ToListAsync();
```

------------------------------------------------------------------------

## 50. How would you design EF Core for a high-traffic API?

**Answer**

A strong design considers EF Core and the database together.

Typical principles:

-   Correct `DbContext` lifetime
-   Async database calls
-   Read-only no-tracking queries where appropriate
-   DTO projection
-   Database-side filtering
-   Pagination
-   Avoid N+1
-   Avoid excessive `Include`
-   Efficient indexes
-   Inspect generated SQL
-   Short-lived transactions
-   Connection resiliency where appropriate
-   Cache only where consistency requirements permit it
-   Measure before and after optimization

------------------------------------------------------------------------

# Senior Scenario Questions

## 51. An API takes 8 seconds to return 10,000 records. What do you do?

**Answer**

First determine whether 10,000 records should be returned at all.

Then investigate:

``` text
1. Measure endpoint/database timing
2. Inspect generated SQL
3. Inspect execution plan
4. Check returned row/column count
5. Check Includes and N+1
6. Check indexes
7. Use projection
8. Use AsNoTracking for read-only entities
9. Apply database-side filtering
10. Add pagination
11. Retest and measure
```

A common improvement:

``` csharp
var result = await dbContext.Employees
    .AsNoTracking()
    .Where(x => x.IsActive)
    .OrderBy(x => x.Id)
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name
    })
    .Take(100)
    .ToListAsync();
```

------------------------------------------------------------------------

## 52. Your LINQ query generates inefficient SQL. What do you do?

**Answer**

Inspect the generated SQL with `ToQueryString()` and database logging.

Then check:

-   LINQ expression shape
-   Unnecessary navigation loading
-   Client-side transitions
-   Projection
-   Joins
-   Subqueries
-   Indexes
-   Execution plan

Do not optimize based only on how elegant the LINQ looks.

------------------------------------------------------------------------

## 53. One API request generates hundreds of SQL queries. What is likely happening?

**Answer**

A common cause is N+1 behavior, often involving repeated related-data
access.

Investigate database command logs.

Then consider:

``` csharp
Include()
```

when full entities are required, or preferably a targeted projection for
read APIs:

``` csharp
.Select(x => new EmployeeDto
{
    Id = x.Id,
    DepartmentName = x.Department.Name
})
```

------------------------------------------------------------------------

## 54. When would you choose projection over Include?

**Answer**

Choose projection when the caller needs a DTO/read model containing only
selected fields.

Choose `Include` when the application genuinely needs the related entity
graph.

For APIs, projection is frequently a strong default because response
models normally require only part of the entity graph.

------------------------------------------------------------------------

## 55. When would you use raw SQL instead of LINQ?

**Answer**

Consider raw SQL when:

-   A query is significantly clearer in SQL
-   Database-specific functionality is required
-   A carefully optimized query cannot be represented suitably with LINQ
-   Existing SQL must be reused

Do not choose raw SQL merely because EF-generated SQL looks unfamiliar.
Compare correctness, maintainability, safety, and measured performance.

------------------------------------------------------------------------

## 56. How do you handle transactions across repositories?

**Answer**

Repositories participating in the same unit of work should normally
share the appropriate scoped `DbContext`.

Then the application/service layer can coordinate the transaction.

``` csharp
await using var transaction =
    await dbContext.Database.BeginTransactionAsync();

try
{
    await orderRepository.AddAsync(order);
    await paymentRepository.AddAsync(payment);

    await dbContext.SaveChangesAsync();
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

Avoid giving each repository an unrelated context when the operations
must be committed atomically.

------------------------------------------------------------------------

## 57. How do you handle concurrency conflicts?

**Answer**

Catch `DbUpdateConcurrencyException` and apply the business rule.

Possible strategies:

-   Reload and ask the user to retry
-   Client wins
-   Database wins
-   Merge changes
-   Retry after re-reading

The correct strategy depends on the domain.

For financial or workflow systems, silently overwriting newer data is
usually unacceptable.

------------------------------------------------------------------------

## 58. What is AsNoTrackingWithIdentityResolution()?

**Answer**

It provides no-tracking query behavior while still resolving repeated
occurrences of the same entity identity within the query result to the
same materialized instance.

It can be useful when:

-   Results are read-only
-   Tracking is not needed
-   The result graph contains repeated entity identities
-   Identity consistency in the materialized graph is useful

Use it when the data shape justifies the additional identity-resolution
work.

------------------------------------------------------------------------

## 59. What are compiled queries?

**Answer**

EF Core supports explicitly compiled queries for scenarios where the
same query shape is executed very frequently and query compilation
overhead is worth optimizing.

Conceptually:

``` csharp
private static readonly Func<AppDbContext, int, Employee?> GetEmployee =
    EF.CompileQuery(
        (AppDbContext db, int id) =>
            db.Employees.FirstOrDefault(x => x.Id == id));
```

## Interview Tip

Compiled queries are an advanced optimization. Do not use them before
measuring a real bottleneck.

------------------------------------------------------------------------

## 60. How would you structure EF Core in Clean Architecture / DDD?

**Answer**

A common design keeps persistence concerns in infrastructure while
application/domain code works through meaningful boundaries.

Possible structure:

``` text
Domain
  Entities
  Value Objects
  Domain Rules

Application
  Use Cases
  DTOs
  Interfaces

Infrastructure
  AppDbContext
  EF Configurations
  Repository Implementations
  Migrations

API
  Controllers / Endpoints
```

The important goal is not folder names. It is keeping business rules
from becoming unnecessarily coupled to persistence implementation
details.

------------------------------------------------------------------------

## Practical Interview Coding Exercise

Consider:

``` csharp
public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public bool IsActive { get; set; }

    public int DepartmentId { get; set; }
    public Department Department { get; set; } = null!;
}
```

Write a query that returns only active employees earning more than
50,000, including only ID, name, and department name.

## Strong Answer

``` csharp
var employees = await dbContext.Employees
    .AsNoTracking()
    .Where(x =>
        x.IsActive &&
        x.Salary > 50000)
    .OrderBy(x => x.Name)
    .Select(x => new EmployeeDto
    {
        Id = x.Id,
        Name = x.Name,
        DepartmentName = x.Department.Name
    })
    .ToListAsync();
```

## Why this is a good answer

It demonstrates:

``` text
Database-side filtering
+
No tracking for read-only data
+
Projection
+
Relationship navigation
+
Deferred query composition
+
Async materialization
```

------------------------------------------------------------------------

## Most Important EF Core Questions to Prepare

Before an experienced .NET interview, make sure you can confidently
explain:

``` text
1. DbContext and DbSet
2. DbContext lifetime
3. Change tracking
4. AsNoTracking
5. IEnumerable vs IQueryable
6. Deferred execution
7. ToList called too early
8. LINQ-to-SQL translation
9. Include and ThenInclude
10. Eager vs Lazy vs Explicit loading
11. N+1 query problem
12. Projection into DTOs
13. Include vs Select
14. Migrations
15. Relationships
16. Transactions
17. Optimistic concurrency
18. Global query filters
19. Soft delete
20. Auditing
21. Raw SQL
22. Generated SQL
23. Split queries
24. Pagination
25. Database indexes
26. Cartesian explosion
27. DbContext thread safety
28. Repository pattern trade-offs
29. Bulk/set-based update and delete
30. Production query performance
```

------------------------------------------------------------------------

## Experienced Candidate Answer Template

When an interviewer asks:

> How do you use EF Core in your project?

A strong answer is:

> I use EF Core as the data-access ORM in ASP.NET Core applications,
> with `DbContext` registered using an appropriate scoped lifetime. I
> use LINQ for queries and keep database queries as `IQueryable` until
> filtering, projection, sorting, and pagination have been applied. For
> read-only endpoints I use `AsNoTracking()` where appropriate, and I
> normally project directly into DTOs to avoid over-fetching. I watch
> for N+1 queries and unnecessary `Include` calls, inspect generated SQL
> for performance-sensitive operations, and validate database indexes
> and execution plans. For updates I rely on change tracking where it is
> useful, use transactions around atomic business operations, and use
> optimistic concurrency where simultaneous edits are possible.

------------------------------------------------------------------------

## Final Interview Tip

For a beginner, knowing CRUD, `DbContext`, `DbSet`, migrations, and
relationships is important.

For an experienced developer, interviewers expect more:

``` text
Correct EF Core usage
+
LINQ / IQueryable understanding
+
SQL awareness
+
Change tracking awareness
+
Performance
+
Concurrency
+
Transactions
+
Production scenarios
```

A senior answer should be able to explain:

> Where does this query execute? When does it execute? What SQL is
> generated? How many queries are executed? How many rows and columns
> are transferred? Is tracking required? Could N+1 or Cartesian
> explosion occur? Are the right indexes available? Can the query be
> made more efficient?

That mindset is more valuable than memorizing API names.
