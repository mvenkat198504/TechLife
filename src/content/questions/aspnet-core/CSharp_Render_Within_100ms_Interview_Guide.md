---
id: aspnet-react-010
slug:  Return Components Whose `Render()` Completes Within 100 ms
title: Return Components Whose `Render()` Completes Within 100 ms
categoryId: aspnet-core
subcategory: AspNet_React
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Dependency Injection
  - React-Facing API
  - aspnet-core
summary: Return Components Whose `Render()` Completes Within 100 ms
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---
# Interview Guide: Return Components Whose `Render()` Completes Within 100 ms

## Interview question

**Write a C# method using .NET Core that receives a list of UI component objects and returns only those components whose `Render()` method completes within 100 ms. Assume each component has a `Render()` method returning a `Task`. Show how you would implement this efficiently.**

## Clarify the contract first

A strong candidate states the assumptions before coding:

- The 100 ms budget starts **when that component's `Render()` is invoked**, not when the entire list processing begins.
- “Completes” means **successful** completion. A faulted or canceled task is excluded even if it ends quickly.
- Preserve the order of the input list in the output.
- Decide a maximum number of concurrent renders to avoid starting thousands at once.
- `Render()` has no `CancellationToken`. A timeout stops **waiting**; it does **not** cancel or terminate the underlying render. This limitation matters if timed-out tasks consume CPU, threads or external resources.
- A synchronous block inside `Render()` before it returns a `Task` cannot be preempted by `WaitAsync`.

For the exact signature in the question, the following is a practical bounded-*waiting* solution on .NET 6 or later. A production design should change the rendering contract to accept a cancellation token if strict resource bounds are required.

## Interview-ready implementation

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public interface IUiComponent
{
    Task Render();
}

public static class ComponentFilter
{
    private static readonly TimeSpan RenderLimit =
        TimeSpan.FromMilliseconds(100);

    public static async Task<IReadOnlyList<IUiComponent>>
        GetFastComponentsAsync(
            IReadOnlyList<IUiComponent> components,
            int maxConcurrency = 8,
            CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(components);
        if (maxConcurrency <= 0)
            throw new ArgumentOutOfRangeException(nameof(maxConcurrency));

        var passed = new bool[components.Count];

        await Parallel.ForEachAsync(
            Enumerable.Range(0, components.Count),
            new ParallelOptions
            {
                MaxDegreeOfParallelism = maxConcurrency,
                CancellationToken = cancellationToken
            },
            async (index, token) =>
            {
                var component = components[index]
                    ?? throw new ArgumentException(
                        "The component list cannot contain null values.",
                        nameof(components));

                try
                {
                    Task renderTask = component.Render();
                    if (renderTask is null)
                        throw new InvalidOperationException(
                            "Render() returned a null Task.");

                    // If our wait times out, the original task may later fault.
                    // Observe that exception without retaining/awaiting it here.
                    _ = renderTask.ContinueWith(
                        static task => _ = task.Exception,
                        CancellationToken.None,
                        TaskContinuationOptions.OnlyOnFaulted |
                        TaskContinuationOptions.ExecuteSynchronously,
                        TaskScheduler.Default);

                    await renderTask.WaitAsync(RenderLimit, token);
                    passed[index] = true;
                }
                catch (TimeoutException)
                {
                    // Exclude a render that did not complete within the budget.
                }
                catch (OperationCanceledException)
                    when (cancellationToken.IsCancellationRequested)
                {
                    // Propagate cancellation requested for the whole operation.
                    throw;
                }
                catch (Exception)
                {
                    // A faulted, internally canceled, or invalid render is excluded.
                    // In production, log failures with component identity.
                }
            });

        var result = new List<IUiComponent>();
        for (int i = 0; i < components.Count; i++)
        {
            if (passed[i]) result.Add(components[i]);
        }
        return result;
    }
}
```

### How it works

1. `Parallel.ForEachAsync` limits the number of **workers awaiting** renders to `maxConcurrency` and propagates caller cancellation.
2. The 100 ms `WaitAsync` timeout is started separately for each `Render()` call.
3. A successfully completed task marks its input index as accepted. Timeout, fault or cancellation leaves it false.
4. An array indexed by input position preserves order even though renders finish out of order. Each worker writes a distinct index, and `Parallel.ForEachAsync` is awaited before reading the array.
5. The fault-only continuation observes exceptions from renders that continue after a timeout. Logging can be added to the fault path, but avoid logging sensitive data or flooding logs under load.

**Critical limitation:** `MaxDegreeOfParallelism` limits the number of tasks this method is *waiting for* at once. Once a render times out, its worker moves on, but the original render can still be running. Therefore it is **not a strict cap on active underlying render operations**. `WaitAsync` does not cancel the original task. If many renders ignore timeouts or never finish, they can accumulate; no wrapper around `Task Render()` can guarantee both prompt completion and a hard active-work limit.

### Example invocation

```csharp
IReadOnlyList<IUiComponent> components = GetComponents();

IReadOnlyList<IUiComponent> fast = await ComponentFilter
    .GetFastComponentsAsync(components, maxConcurrency: 8);

Console.WriteLine($"{fast.Count} components rendered successfully within 100 ms.");
```

`GetComponents()` is an illustrative source method. The component objects themselves are returned, not their rendered output, because the question specifies `Task` rather than `Task<TResult>`.

## Better production API: cooperative cancellation

If you can change the interface, pass a cancellation token into `RenderAsync`. This lets the implementation stop I/O, abandon expensive work and release resources when its budget expires. It still depends on components honoring cancellation; .NET cannot safely kill an arbitrary task.

```csharp
public interface ICancellableUiComponent
{
    Task RenderAsync(CancellationToken cancellationToken);
}

public static async Task<IReadOnlyList<ICancellableUiComponent>>
    GetFastCancellableComponentsAsync(
        IReadOnlyList<ICancellableUiComponent> components,
        int maxConcurrency = 8,
        CancellationToken cancellationToken = default)
{
    ArgumentNullException.ThrowIfNull(components);
    if (maxConcurrency <= 0)
        throw new ArgumentOutOfRangeException(nameof(maxConcurrency));

    var passed = new bool[components.Count];

    await Parallel.ForEachAsync(
        Enumerable.Range(0, components.Count),
        new ParallelOptions
        {
            MaxDegreeOfParallelism = maxConcurrency,
            CancellationToken = cancellationToken
        },
        async (index, token) =>
        {
            var component = components[index]
                ?? throw new ArgumentException("Null component.", nameof(components));

            using var budget = CancellationTokenSource.CreateLinkedTokenSource(token);
            budget.CancelAfter(TimeSpan.FromMilliseconds(100));

            try
            {
                // Cooperative: the component must observe this token promptly.
                await component.RenderAsync(budget.Token);
                if (!budget.IsCancellationRequested)
                    passed[index] = true;
            }
            catch (OperationCanceledException)
                when (token.IsCancellationRequested)
            {
                throw; // The caller canceled the entire operation.
            }
            catch (OperationCanceledException)
                when (budget.IsCancellationRequested)
            {
                // This component exceeded its time budget.
            }
            catch (Exception)
            {
                // This render failed; log and exclude according to policy.
            }
        });

    return Enumerable.Range(0, components.Count)
        .Where(index => passed[index])
        .Select(index => components[index])
        .ToArray();
}
```

**Important nuance:** `CancelAfter` requests cancellation; if a component ignores the token or blocks synchronously, the worker still waits. For a hard 100 ms wait deadline, you can combine cooperative cancellation with `WaitAsync`, but if the underlying work ignores cancellation it may continue in the background. A strict hard resource bound requires a trusted implementation or a separate process/service with enforceable limits.

## Why not just use `Task.WhenAll(components.Select(c => c.Render()))`?

`Task.WhenAll` waits for every render and will not filter by elapsed time. Starting all renders immediately can overwhelm CPU, sockets or external services for a large list. A timeout must be applied **per component**, and concurrency should be chosen based on workload. For CPU-bound rendering, a small limit is usually sensible; for asynchronous I/O, a different limit may be appropriate. Measure rather than hard-code eight for every system.

## Alternative concise answer for a small list

If the interviewer wants the core idea and the list is small, this simple version demonstrates it. It starts all renders immediately, so it is not suitable for a very large list or costly renders.

```csharp
public static async Task<IReadOnlyList<IUiComponent>> FilterSmallListAsync(
    IReadOnlyList<IUiComponent> components)
{
    var checks = components.Select(async component =>
    {
        try
        {
            Task task = component.Render();
            _ = task.ContinueWith(
                static t => _ = t.Exception,
                CancellationToken.None,
                TaskContinuationOptions.OnlyOnFaulted |
                TaskContinuationOptions.ExecuteSynchronously,
                TaskScheduler.Default);

            await task.WaitAsync(TimeSpan.FromMilliseconds(100));
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }).ToArray();

    bool[] passed = await Task.WhenAll(checks);
    return components.Where((_, index) => passed[index]).ToArray();
}
```

`Task.WhenAll` preserves the ordering of the `checks` input array in its result array, even if tasks finish in another order. For production, validate nulls and propagate caller cancellation as in the main implementation.

## Edge cases and tradeoffs an experienced candidate should mention

| Case | Expected behavior |
| --- | --- |
| Completes successfully in 50 ms | Include component |
| Faults in 20 ms | Exclude and log the failure |
| Returns a canceled task in 20 ms | Exclude unless whole-operation cancellation was requested |
| Exceeds 100 ms | Exclude; original task may keep running |
| Caller cancels | Stop the filtering operation and propagate cancellation |
| Null component or null `Task` | Treat as invalid input/implementation; define policy |
| Completion exactly at timer boundary | Scheduling/timer granularity makes the boundary race-sensitive |
| `Render()` blocks before returning `Task` | Cannot be timed out by `WaitAsync` until it returns |
| Thousands of nonterminating renders | Timeout wrappers alone cannot enforce an active-work cap |

### Time measurement and precision

`WaitAsync(TimeSpan.FromMilliseconds(100))` is an appropriate practical deadline for asynchronous operations, but it is not a real-time scheduler or an exact stopwatch proof that CPU execution took at most 100.000 ms. Task completion, timer callbacks and continuations race near the boundary. If the requirement is a strict measured duration, define whether the limit is wall-clock time from invocation to task completion or from invocation to observation, use a monotonic clock such as `Stopwatch`, and design deterministic tests around the policy. OS scheduling can still affect results.

### UI rendering nuance

If these are **React UI components**, their `Render()` does not normally run as a C# `Task`; this is a C# abstraction used by the interview question. In a real web app, C# may render server-side templates or prepare component data, while React rendering happens in the browser. Clarify the domain without losing the coding exercise.

## Test plan

Test the method with controllable `TaskCompletionSource`-based components or a fake clock/time provider where supported, rather than relying entirely on actual `Task.Delay(99)` versus `Task.Delay(101)` (such timing tests are flaky). Verify:

1. Fast success is included and slow success is excluded.
2. Fast fault and internal cancellation are excluded; caller cancellation propagates.
3. Input order is preserved even when completions occur in a different order.
4. A late fault after timeout is observed.
5. The configured number of *waiting workers* is bounded.
6. The cooperative version releases resources when components honor cancellation.

## Follow-up interview questions

**Does `Task.WhenAny(render, Task.Delay(100))` cancel `render`?** No. It chooses whichever task finishes first. You must separately request cancellation and rely on the operation to honor it.

**Could I use `WaitAsync` instead of `WhenAny`?** Yes. `WaitAsync(timeout)` is concise on supported .NET versions and throws `TimeoutException` if the wait expires; the original task remains alive.

**Why use `Parallel.ForEachAsync`?** It limits concurrent waiting and avoids starting the whole list at once. It does not limit still-running tasks abandoned after timeout if `Render()` cannot be canceled.

**How would you guarantee that no more than eight actual renders run?** Redesign `RenderAsync` to support and honor cancellation, or hold a capacity slot until the underlying operation truly finishes. The latter may prevent the overall method from completing if a task never finishes. For untrusted or non-cooperative work, isolate it in a process/service with resource and execution limits.

**Should a faulted render count as “completed”?** A task may be technically completed in the Faulted state, but the typical business reading is that only a successful render qualifies. State that policy explicitly.

**What if the 100 ms includes queue time?** Then start a single overall deadline before queueing each item or use a common deadline for the batch. The code above measures from each component's invocation.

## Common mistakes

- Calling `.Result` or `.Wait()` and blocking threads.
- Starting every render with no concurrency limit for a huge list.
- Treating a timeout as cancellation of the underlying task.
- Ignoring late faults from timed-out tasks.
- Returning results in completion order when input order was expected.
- Including a faulted task merely because it ended within 100 ms.
- Promising an exact hard deadline from a general-purpose .NET task scheduler.

## Closing answer

> I would apply a per-render asynchronous timeout, handle faults, preserve input order, and bound concurrent attempts. I would explicitly point out that `Task Render()` cannot be forcibly canceled; for a scalable production guarantee, the component should accept a cancellation token and honor it promptly.

## Official references

- [`Task.WaitAsync` API](https://learn.microsoft.com/dotnet/api/system.threading.tasks.task.waitasync)
- [`Task.WhenAny` API](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.whenany)
- [`SemaphoreSlim` and concurrency](https://learn.microsoft.com/en-us/dotnet/standard/threading/semaphore-and-semaphoreslim)
- [Task exception handling](https://learn.microsoft.com/en-us/dotnet/standard/parallel-programming/exception-handling-task-parallel-library)
- [.NET `TimeProvider` testing](https://learn.microsoft.com/en-us/dotnet/core/extensions/timeprovider-testing)
