---
id: csharp-fundamental-001
slug: csharp-fundamental
categoryId: csharp
subcategory: Fundamentals
title: C# Fundamental Interview Preparation — 30 Core Questions
description: Crisp answers, interview tips, traps and follow-up questions for the 30 most-asked .NET/C# fundamentals.
difficulty: Basic
level: "Fresher to 3 years"
tags: [.NET, C#, CLR, Interview]
last_updated: "2026-09-15"
status: published
thumbnail: ""
videos: []
resources: []
---

# .NET & C# Interview Preparation

> **How to use this**: Read the **Answer** to understand, memorise the **One-liner** for the interview, and scan the **Trap** section before you walk in. The **Follow-up** questions are what the interviewer will actually ask next — prepare those too.

## Table of Contents

| # | Question |
|---|---|
| [1](#1-difference-between-net-and-c) | Difference between .NET and C# |
| [2](#2-net-framework-vs-net-core-vs-net-5) | .NET Framework vs .NET Core vs .NET 5+ |
| [3](#3-what-is-il-intermediate-language-code) | What is IL code |
| [4](#4-what-is-the-use-of-jit-just-in-time-compiler) | Use of JIT compiler |
| [5](#5-is-it-possible-to-view-il-code) | Can we view IL code |
| [6](#6-what-is-the-benefit-of-compiling-into-il-code) | Benefit of compiling to IL |
| [7](#7-does-net-support-multiple-programming-languages) | Does .NET support multiple languages |
| [8](#8-what-is-clr-common-language-runtime) | What is CLR |
| [9](#9-what-is-managed-and-unmanaged-code) | Managed vs unmanaged code |
| [10](#10-explain-the-importance-of-garbage-collector) | Importance of Garbage Collector |
| [11](#11-can-garbage-collector-claim-unmanaged-objects) | Can GC claim unmanaged objects |
| [12](#12-what-is-the-importance-of-cts) | Importance of CTS |
| [13](#13-explain-cls) | Explain CLS |
| [14](#14-difference-between-stack-vs-heap) | Stack vs Heap |
| [15](#15-what-are-value-types--reference-types) | Value types vs Reference types |
| [16](#16-explain-boxing-and-unboxing) | Boxing and unboxing |
| [17](#17-what-is-the-consequence-of-boxing-and-unboxing) | Consequence of boxing/unboxing |
| [18](#18-explain-casting-implicit-casting-and-explicit-casting) | Casting, implicit, explicit |
| [19](#19-what-can-happen-during-explicit-casting) | What can happen during explicit casting |
| [20](#20-differentiate-between-array-and-arraylist) | Array vs ArrayList |
| [21](#21-whose-performance-is-better-array-or-arraylist) | Array or ArrayList — performance |
| [22](#22-what-are-generic-collections) | Generic collections |
| [23](#23-what-are-threads-multithreading) | Threads / Multithreading |
| [24](#24-how-are-threads-different-from-tpl) | Threads vs TPL |
| [25](#25-how-do-we-handle-exceptions-in-c-trycatch) | Exception handling (try/catch) |
| [26](#26-what-is-the-need-of-finally) | Need of `finally` |
| [27](#27-why-do-we-need-the-out-keyword) | Why `out` keyword |
| [28](#28-what-is-the-need-of-delegates) | Need of delegates |
| [29](#29-what-are-events) | What are events |
| [30](#30-whats-the-difference-between-abstract-class-and-interface) | Abstract class vs Interface |

---

## 1. Difference between .NET and C#

**One-liner:** C# is a programming language; .NET is the platform (runtime + libraries) that runs it.

**Answer**

.NET is a development *platform*. It consists of:
- the **CLR** (the runtime that executes your code),
- the **BCL/FCL** (thousands of ready-made classes — collections, file I/O, networking, JSON, LINQ),
- tooling (compilers, SDK, MSBuild, NuGet).

C# is one of the *languages* you can use to write code targeting that platform. VB.NET and F# are others. All of them compile to the same IL and run on the same CLR.

An analogy that lands well: **C# is the language you speak, .NET is the country you speak it in.** Or — C# is to .NET what Java the language is to the JVM plus the Java class libraries.

> **Interview tip:** Say the words "language" and "platform/framework" explicitly. Interviewers are literally listening for that distinction.

> **Trap:** Candidates say ".NET is a language too" or "C# and .NET are the same thing, just different names." Both are instant red flags. Also don't say ".NET is an IDE" — that's Visual Studio.

**Follow-up:** *"Can a language other than C# use the .NET base class library?"* → Yes, because all .NET languages compile to IL and share the CTS.

---

## 2. .NET Framework vs .NET Core vs .NET 5+

**One-liner:** .NET Framework is Windows-only and legacy; .NET Core was the cross-platform rewrite; .NET 5+ is the unified successor to both.

**Answer**

| Aspect | .NET Framework (1.0–4.8) | .NET Core (1.0–3.1) | .NET 5 / 6 / 7 / 8+ |
|---|---|---|---|
| Platform | Windows only | Windows, Linux, macOS | Windows, Linux, macOS, mobile, WASM |
| Open source | No (mostly) | Yes | Yes |
| Deployment | Machine-wide install, single version | Side-by-side, self-contained possible | Side-by-side, self-contained, AOT |
| Performance | Slowest | Much faster | Fastest |
| Web stack | ASP.NET (Web Forms, MVC 5) | ASP.NET Core | ASP.NET Core |
| Status | Maintenance only — no new features | Discontinued / EOL | Active, current |

**The story to tell:** .NET Framework was tied to Windows and shipped with the OS, which made it slow to evolve. Microsoft rewrote it as .NET Core — cross-platform, open source, modular NuGet packages, side-by-side versioning. Once .NET Core reached feature parity, Microsoft dropped the word "Core" and unified everything under **.NET 5** (Nov 2020). There is no ".NET 4" because that would clash with .NET Framework 4.x.

**Which to pick today?** Any new project → latest LTS .NET (8 is the LTS most shops are on). Only stay on Framework if you're locked to Web Forms, WCF server, or a Windows-only COM dependency.

> **Interview tip:** Mention the **LTS vs STS** release cadence — even-numbered releases (6, 8, 10) are LTS with 3 years of support, odd-numbered (7, 9) are 18-month STS. Very few candidates know this and it signals real-world experience.

> **Trap:** Saying ".NET 5 is just .NET Core 4 renamed" is close but sloppy. The precise statement: .NET 5 is the *unification* of .NET Framework, .NET Core and Xamarin/Mono into one base class library and one runtime lineage.

**Follow-up:** *"Why is .NET Core faster?"* → Kestrel web server, Span&lt;T&gt;/Memory&lt;T&gt; low-allocation types, tiered JIT compilation, and a rewritten GC.

---

## 3. What is IL (Intermediate Language) Code?

**One-liner:** IL is the CPU-independent, half-compiled output of a .NET compiler that the CLR later converts to machine code.

**Answer**

When you build a C# project, the Roslyn compiler does **not** produce x86/x64 machine code. It produces an assembly (`.dll` or `.exe`) containing:

1. **IL** — also called MSIL or CIL — a stack-based, assembly-like instruction set (`ldarg.0`, `add`, `callvirt`, `ret`).
2. **Metadata** — a full description of every type, method, field and attribute in the assembly.

At runtime, the CLR's JIT compiler turns IL into native code for whatever CPU it is actually running on.

```
C# / VB.NET / F#  →  [Compiler]  →  IL + Metadata (assembly)  →  [JIT]  →  Native machine code
```

> **Interview tip:** Always mention **metadata** alongside IL. Metadata is what makes reflection, IntelliSense and cross-language inheritance possible — it's why .NET assemblies are self-describing and don't need header files.

> **Trap:** Calling IL "bytecode that is interpreted." It is **not interpreted** in .NET — it is JIT-compiled to native code and then executed directly by the CPU.

**Follow-up:** *"Is IL human-readable?"* → Not as shipped (it's binary), but tools disassemble it into readable IL assembly text.

---

## 4. What is the use of JIT (Just In Time compiler)?

**One-liner:** The JIT converts IL into native machine code at runtime, method by method, optimised for the actual machine.

**Answer**

The JIT sits inside the CLR. When a method is called for the *first time*, the JIT:

1. Takes that method's IL,
2. Verifies it for type safety,
3. Compiles it to native instructions for the current CPU architecture,
4. Patches the method's stub so **subsequent calls jump straight to the compiled native code** — no recompilation.

This is why the first hit on an endpoint is slow and the rest are fast ("warm-up" / "cold start").

**Why JIT instead of compiling everything ahead of time?**
- **Portability** — one assembly runs on x86, x64, ARM64.
- **Machine-specific optimisation** — it can emit AVX2/SSE instructions if the CPU supports them.
- **Lazy compilation** — methods never called are never compiled, so startup does less work.

**Flavours worth naming:**
- **Tiered compilation** (default since .NET Core 3.0): Tier 0 compiles fast with few optimisations to get you running; hot methods are recompiled at Tier 1 with full optimisation.
- **NGen / ReadyToRun (R2R)** — ahead-of-time pre-compilation to cut startup cost.
- **Native AOT** (.NET 7+) — compiles the whole app to a native binary, no JIT at runtime. Fast startup, small footprint, but no runtime code-gen or full reflection.

> **Interview tip:** The phrase *"compiles per method, on first call, and caches the result for the process lifetime"* covers almost every follow-up in one sentence.

> **Trap:** Saying "JIT compiles the whole assembly when the app starts." It doesn't — it's per-method and lazy. Also, JIT output is **not** persisted to disk between runs (that's NGen's job).

**Follow-up:** *"What's the downside of JIT?"* → Startup latency and memory used by the compiler itself — which is exactly what Native AOT solves.

---

## 5. Is it possible to view IL code?

**One-liner:** Yes — with ILDASM, ILSpy, dnSpy, dotPeek, or online at sharplab.io.

**Answer**

| Tool | Notes |
|---|---|
| **ILDASM** | Ships with Visual Studio / Windows SDK. The classic MSIL disassembler. |
| **ILSpy** | Free, open source, cross-platform. Shows IL *and* decompiles back to readable C#. |
| **dnSpy** | ILSpy-based, adds debugging and assembly editing. |
| **dotPeek** | JetBrains, free. |
| **sharplab.io** | Browser-based — paste C#, instantly see IL, JIT asm, or the lowered C#. Great for demos. |
| **`ildasm` / `monodis`** | CLI options. |

Because assemblies carry full metadata, decompilers can reconstruct near-original C#. That means **shipped .NET code is easy to reverse-engineer** — which is why obfuscators (Dotfuscator, ConfuserEx) exist.

> **Interview tip:** Mention **sharplab.io** by name. It shows you actually poke at IL out of curiosity, not just from a textbook. Bonus: mention that it's how you'd *prove* whether `foreach` on a `List<T>` allocates, or what `async/await` desugars into.

> **Trap:** The interviewer's real follow-up is usually about IP protection. Have the answer ready: obfuscation raises the cost of reverse-engineering; it does **not** make it impossible. For true secrecy, keep the logic server-side.

**Follow-up:** *"Can you edit IL and re-assemble?"* → Yes, ILDASM → edit → ILASM round-trip, or dnSpy directly. Breaks strong-name signatures though.

---

## 6. What is the benefit of compiling into IL code?

**One-liner:** IL gives you platform independence, language interoperability, type safety and runtime optimisation — all at once.

**Answer**

1. **Platform / CPU independence.** One compiled DLL runs on x64 Windows, ARM64 Linux and macOS. The JIT handles the difference.
2. **Language interoperability.** C#, VB.NET and F# all reduce to the same IL, so a C# class can inherit from an F# class and consume a VB.NET library seamlessly.
3. **Runtime optimisation.** The JIT knows the exact CPU and can use instruction sets that didn't exist when you shipped.
4. **Type safety and verification.** The CLR verifies IL before execution, catching unsafe memory access and preventing whole classes of exploits.
5. **Rich metadata.** Enables reflection, serialisation, dependency injection, ORMs, IntelliSense, attributes.
6. **Managed services.** Because the runtime understands your code, it can provide GC, exception handling and security transparently.

> **Interview tip:** Rank them. Lead with *portability* and *language interoperability* — those are the two the interviewer is scoring you on. The rest are bonus points.

> **Trap:** Don't claim "it makes code faster than C++." It usually doesn't at peak. The honest framing: IL costs you a little at startup, buys you portability and safety, and the JIT can sometimes beat AOT-compiled native code on long-running processes because it optimises for the real hardware and real call patterns.

---

## 7. Does .NET support multiple programming languages?

**One-liner:** Yes — C#, VB.NET and F# are first-class, and any language that emits CLS-compliant IL can join.

**Answer**

.NET is deliberately language-agnostic. Officially supported by Microsoft: **C#**, **VB.NET**, **F#**. Historically/community: C++/CLI, IronPython, IronRuby, Boo, Nemerle, and more.

This works because every compiler targets the **same IL**, the **same CTS** (common type system) and the **same CLR**. So:

- A VB.NET class can inherit from a C# base class.
- An F# library can be referenced from a C# project as a normal NuGet package.
- A C# `try/catch` can catch an exception thrown by VB.NET code.

For this to be reliable across languages, public APIs should be **CLS-compliant** (see Q13).

> **Interview tip:** Give the *inheritance across languages* example. Saying "you can inherit a C# class in VB.NET" demonstrates you understand it's genuine interop, not just "they both exist."

> **Trap:** Don't confuse this with "runs on multiple platforms" (Q6). Multiple **languages** ≠ multiple **OSes**. Interviewers sometimes ask both to see if you mix them up.

---

## 8. What is CLR (Common Language Runtime)?

**One-liner:** The CLR is .NET's execution engine — it JIT-compiles IL and provides GC, type safety, exception handling and security.

**Answer**

The CLR is the virtual machine / runtime environment that actually runs your code. Its responsibilities:

| Service | What it does |
|---|---|
| **JIT compilation** | Converts IL → native code |
| **Garbage collection** | Automatic memory management on the managed heap |
| **Type safety & verification** | Verifies IL, enforces CTS rules |
| **Exception handling** | Structured, cross-language exception model |
| **Thread management** | Thread pool, synchronisation primitives |
| **Assembly loading** | Resolves and loads assemblies and their dependencies |
| **Security** | Code access checks, sandboxing (largely legacy now) |
| **Interop** | P/Invoke and COM interop to unmanaged code |

Code that runs under the CLR is **managed code**. The modern runtime is called **CoreCLR** (the .NET Core/.NET 5+ implementation); **Mono** is the alternative runtime used for mobile and WebAssembly.

> **Interview tip:** Structure the answer as a list of *services*. Rattling off five or six concrete CLR jobs sounds far stronger than a vague "it runs your code."

> **Trap:** Two things people conflate:
> - **CLR ≠ .NET** — the CLR is one component of .NET, alongside the class libraries.
> - **CLR ≠ JIT** — the JIT is a component *inside* the CLR.

**Follow-up:** *"What is CoreCLR?"* → The open-source, cross-platform CLR implementation powering .NET Core and .NET 5+.

---

## 9. What is managed and unmanaged code?

**One-liner:** Managed code runs under CLR supervision with GC and type safety; unmanaged code runs directly on the OS and manages its own memory.

**Answer**

**Managed code** — C#, VB.NET, F# compiled to IL. The CLR controls it: it allocates memory, garbage-collects it, verifies types, handles exceptions, enforces security.

**Unmanaged code** — native C/C++, COM components, Win32 API calls. It compiles straight to machine code, allocates with `malloc`/`new`, and *you* are responsible for freeing memory.

| | Managed | Unmanaged |
|---|---|---|
| Runs under | CLR | OS directly |
| Memory freed by | Garbage Collector | You (`free`, `delete`, `Release()`) |
| Type safety | Verified | Not verified |
| Compiled to | IL, then JIT'd | Native machine code |
| Memory leaks | Rare (but possible) | Easy |
| Examples | C# classes, `List<T>` | Win32 handles, DB connections, `FileStream`'s OS handle, COM objects |

**They meet via:**
- **P/Invoke** — `[DllImport("user32.dll")]` to call Win32 functions.
- **COM Interop** — using COM components (e.g. Office automation) from .NET.
- **`unsafe` / pointers** — raw pointer code inside C#, compiled with `/unsafe`.

> **Interview tip:** Have a real example ready: *"A `SqlConnection` is a managed object, but it wraps an unmanaged network socket handle — that's exactly why it implements `IDisposable`."* That single sentence chains Q9 → Q10 → Q11 and makes you look like you've actually debugged this.

> **Trap:** "Unmanaged code is always C++." Not true — managed C++/CLI exists. What matters is whether the code runs under CLR control, not which language wrote it.

---

## 10. Explain the importance of Garbage Collector

**One-liner:** The GC automatically reclaims unreachable managed memory, so you get no leaks, no dangling pointers, and no manual `delete`.

**Answer**

**Why it matters:**
- **No manual memory management.** No `delete`, no `free`, no reference counting by hand.
- **Prevents common bugs** — memory leaks, double-free, dangling pointers, use-after-free.
- **Developer productivity** — you write business logic, not allocation bookkeeping.
- **Heap compaction** — moving survivors together reduces fragmentation and improves cache locality.

**How it works (the part that earns points):**

The GC uses **generations** based on the observation that most objects die young:

| Generation | Contains | Collected |
|---|---|---|
| **Gen 0** | Newly allocated small objects | Very frequently, very cheap |
| **Gen 1** | Gen 0 survivors — a buffer between short- and long-lived | Less frequently |
| **Gen 2** | Long-lived objects (statics, caches) | Rarely, expensive |
| **LOH** | Objects ≥ 85,000 bytes (Large Object Heap) | With Gen 2; not compacted by default |

The algorithm is **mark-and-sweep-and-compact**: starting from *roots* (static fields, local variables on stacks, CPU registers, GC handles), the GC marks everything reachable; anything unmarked is garbage; then survivors are compacted and promoted to the next generation.

> **Interview tip:** Say the words **"generational," "mark and compact,"** and **"roots."** Then add the killer line: *"The GC collects objects that are **unreachable**, not objects that are 'unused' — reachability is the only criterion."*

> **Traps:**
> - **Never say "call `GC.Collect()` to improve performance."** Forcing a collection is almost always harmful — it promotes surviving objects to Gen 2 where they're expensive to reclaim. It's for niche benchmarking scenarios only.
> - **Managed code can still leak.** A static `List<T>` or an un-unsubscribed event handler keeps objects reachable forever. The GC can't help — the objects aren't garbage, they're *referenced*. This is the #1 real-world .NET memory leak and mentioning it is a big tick.
> - Setting a variable to `null` does not "delete" the object; it just removes one reference.

**Follow-up:** *"What is a finalizer and why avoid it?"* → A `~ClassName()` destructor. Objects with finalizers survive an extra collection cycle (they go on the finalization queue), so they're slower to reclaim. Prefer `IDisposable` + `using`.

---

## 11. Can Garbage Collector claim unmanaged objects?

**One-liner:** No — the GC only manages the managed heap. Unmanaged resources must be released explicitly via `IDisposable` (or, as a backstop, a finalizer).

**Answer**

The GC has no knowledge of memory allocated outside the CLR — file handles, sockets, database connections, COM objects, `Marshal.AllocHGlobal` blocks. If you don't release them, they leak for the lifetime of the process (or until the OS reclaims them at exit).

**The correct pattern — `IDisposable` + `using`:**

```csharp
using (var conn = new SqlConnection(connectionString))
{
    conn.Open();
    // ... work ...
}   // Dispose() called automatically, even if an exception is thrown

// C# 8+ "using declaration" — disposed at end of enclosing scope
using var file = new StreamReader("data.txt");
```

**The Dispose pattern** (for classes that own unmanaged resources directly):

```csharp
public class ResourceHolder : IDisposable
{
    private IntPtr _handle;          // unmanaged
    private Stream _stream;          // managed, itself disposable
    private bool _disposed;

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);   // finalizer no longer needed
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;
        if (disposing)
        {
            _stream?.Dispose();      // release managed resources
        }
        ReleaseHandle(_handle);      // release unmanaged resources
        _handle = IntPtr.Zero;
        _disposed = true;
    }

    ~ResourceHolder() => Dispose(false);   // safety net only
}
```

**Why both `Dispose` and a finalizer?** `Dispose` is deterministic — it runs exactly when you say. The finalizer is a **safety net** in case a caller forgets. `GC.SuppressFinalize(this)` tells the GC "already cleaned up, skip the finalizer" so the object can be reclaimed in one cycle instead of two.

> **Interview tip:** The sentence to deliver: *"`Dispose` is deterministic cleanup; the finalizer is non-deterministic and only a backstop. In modern code you rarely write a finalizer yourself — you wrap the handle in a `SafeHandle`."* Mentioning `SafeHandle` is a strong signal.

> **Traps:**
> - Saying "the GC eventually cleans up unmanaged resources through finalizers, so it's fine." Technically the finalizer *may* run — but non-deterministically, possibly minutes later, and you'll exhaust the connection pool long before that.
> - Forgetting that `using` compiles down to `try/finally`, which is why it's exception-safe.
> - `await` inside a `using` is fine; use `await using` for `IAsyncDisposable`.

---

## 12. What is the importance of CTS?

**One-liner:** CTS (Common Type System) defines how types are declared and used in the CLR, so all .NET languages agree on what an "integer" or a "class" is.

**Answer**

CTS is the specification that says: here is the complete set of type constructs the runtime understands, and here is exactly how they behave.

It defines:
- The **type categories** — value types and reference types.
- The **primitive types** — `System.Int32`, `System.String`, `System.Boolean`, etc.
- **Members** — fields, methods, properties, events.
- **Visibility rules** — public, private, protected, internal.
- **Inheritance rules** — single class inheritance, multiple interface implementation, and `System.Object` as the universal root.

**Why it matters:** C# `int`, VB.NET `Integer` and F# `int` are all **aliases for the same `System.Int32`**. That's CTS at work. Without it, cross-language inheritance and parameter passing would be impossible — each language would have its own incompatible notion of a 32-bit integer.

```csharp
int a = 10;
System.Int32 b = 10;   // identical — 'int' is a C# alias for System.Int32
```

> **Interview tip:** The `int` ↔ `Integer` ↔ `System.Int32` example is the cleanest possible proof. Use it.

> **Trap:** Confusing **CTS** with **CLS** — they're asked back-to-back for exactly this reason. Memorise:
> - **CTS = the full set of types the runtime supports** (superset).
> - **CLS = the safe subset every .NET language must support** (subset).
> CLS ⊂ CTS.

---

## 13. Explain CLS

**One-liner:** CLS (Common Language Specification) is a subset of CTS containing only the features every .NET language must support — write CLS-compliant public APIs and any .NET language can consume them.

**Answer**

Not every language supports every CTS feature. VB.NET, for example, is **case-insensitive** and historically had no unsigned integer types. So if your C# library exposes:

```csharp
public void Process(int value) { }
public void process(int value) { }   // differs only by case → not CLS-compliant
public uint Count { get; set; }      // unsigned → not CLS-compliant
```

…VB.NET cannot consume it correctly. CLS is the set of rules that prevents this.

**Common CLS rules:**
- No public members differing only by case.
- No unsigned types (`uint`, `ulong`, `ushort`, `sbyte`) in public signatures.
- No pointers in public signatures.
- Don't overload only by `ref`/`out`.
- Array elements must be CLS-compliant; arrays must have a zero lower bound.

**Enforcing it:**

```csharp
[assembly: CLSCompliant(true)]   // usually in AssemblyInfo.cs

[CLSCompliant(false)]
public uint LegacyCount { get; set; }   // opt this one out
```

Now the compiler *warns* you when you break the rules.

> **Interview tip:** Emphasise **"CLS rules apply only to members visible outside the assembly."** Private and internal members can use `uint`, pointers, whatever you like — the rules only govern the public surface. Most candidates miss this.

> **Trap:** Don't say "CLS makes your code cross-platform." It's about cross-**language**, not cross-OS. Also, CLS compliance is opt-in via attribute — the compiler does not enforce it by default.

---

## 14. Difference between Stack vs Heap

**One-liner:** Stack is fast, LIFO, thread-local memory for value types and call frames; heap is larger, GC-managed memory for objects.

**Answer**

| | Stack | Heap |
|---|---|---|
| Structure | LIFO (last in, first out) | Free-form allocation |
| Stores | Value types, method parameters, local variables, return addresses, **references** to heap objects | Objects (reference-type instances), arrays, strings |
| Allocation | Move a pointer — extremely fast | Find/reserve space — slower |
| Deallocation | Automatic when the method returns | Garbage Collector |
| Size | Small (default ~1 MB per thread) | Large (limited by available memory) |
| Scope | Per thread | Shared across all threads |
| Access speed | Faster (contiguous, cache-friendly) | Slower (scattered, pointer chasing) |
| Failure mode | `StackOverflowException` (uncatchable) | `OutOfMemoryException` |

```csharp
void Example()
{
    int x = 10;                  // x (value) on the stack
    Customer c = new Customer(); // the Customer object on the heap,
                                 // the reference 'c' on the stack
}   // stack frame popped; the Customer becomes unreachable → eligible for GC
```

> **Interview tip:** The one sentence interviewers want: *"For a reference type, the **object** lives on the heap but the **reference variable** lives on the stack."* Draw it if you're at a whiteboard — two boxes and an arrow wins this question.

> **Traps:**
> - "Value types are always on the stack" is **wrong**. A value type that is a *field of a class* lives on the heap inside that object. A captured local in a lambda gets hoisted to a heap closure. An `int[]` is on the heap. The correct rule is: **the storage location determines where it lives, not the type.**
> - `StackOverflowException` cannot be caught in .NET — the process dies. Usually caused by unbounded recursion.
> - `string` is a reference type, so it's on the heap — even a short literal (it's interned).

---

## 15. What are Value types & Reference types?

**One-liner:** Value types hold the data directly and copy by value; reference types hold a pointer to heap data and copy the reference.

**Answer**

| | Value Type | Reference Type |
|---|---|---|
| Keyword examples | `int`, `double`, `bool`, `char`, `decimal`, `DateTime`, `struct`, `enum` | `class`, `interface`, `delegate`, `string`, `object`, arrays |
| Base type | `System.ValueType` | `System.Object` |
| Stores | The actual value | A reference (address) to the object |
| Assignment | Copies the **value** | Copies the **reference** |
| Default value | Zero/`false`/empty struct | `null` |
| Nullable? | Only via `int?` / `Nullable<T>` | Yes, natively |

**The behavioural difference — this is what gets tested:**

```csharp
// Value type
int a = 5;
int b = a;
b = 10;
Console.WriteLine(a);   // 5  — a is untouched

// Reference type
var p1 = new Person { Name = "Alice" };
var p2 = p1;
p2.Name = "Bob";
Console.WriteLine(p1.Name);   // "Bob" — both point to the same object
```

> **Interview tip:** Lead with the copy-semantics demo above; it proves understanding far better than reciting a table. Then add: *"`struct` for small, short-lived, immutable data (a `Point`, a `Money`); `class` for everything with identity and behaviour."*

> **Traps:**
> - **`string` is a reference type** — but because it's **immutable**, it *behaves* like a value type in everyday use. Very common gotcha question.
> - Mutable structs are a known footgun — modifying a struct returned from a property or stored in a collection often mutates a copy silently. Say "I keep structs immutable" and you sound experienced.
> - `record` (C# 9+) is a reference type with value-based equality; `record struct` (C# 10+) is a value type. Good bonus mention.

---

## 16. Explain boxing and unboxing

**One-liner:** Boxing wraps a value type into an object on the heap; unboxing extracts the value back out, with a runtime type check.

**Answer**

```csharp
int i = 123;

object o = i;        // BOXING   — value copied to a new heap object
int j = (int)o;      // UNBOXING — heap value copied back to the stack
```

**Boxing** (implicit): the CLR allocates an object on the heap, copies the value into it, and returns a reference. Value → reference.

**Unboxing** (explicit — requires a cast): the CLR checks the boxed object really holds that exact type, then copies the value out. Reference → value.

**Where it happens without you noticing:**
```csharp
ArrayList list = new ArrayList();
list.Add(42);                    // boxed — ArrayList stores object

object obj = 3.14;               // boxed

string s = string.Format("{0}", 42);   // boxed (int → object param)

IComparable c = 5;               // boxed — value type to interface
```

> **Interview tip:** Add the memory picture: *"Boxing is a heap allocation plus a copy. Unboxing is a type check plus a copy. Neither is free."* Then connect it to generics: *"`List<int>` doesn't box; `ArrayList` does — that's the main reason generics were added in .NET 2.0."*

> **Traps:**
> - Unboxing requires an **exact** type match. `object o = 5; long l = (long)o;` throws `InvalidCastException` — even though int→long is normally a widening conversion. You must unbox to `int` first, then convert.
> - Assigning a value type to an **interface** boxes it. Easy to miss.
> - Boxing is implicit (no syntax), unboxing is explicit (needs a cast). Don't reverse this.

---

## 17. What is the consequence of boxing and unboxing?

**One-liner:** Performance cost — heap allocations, memory copies, GC pressure — plus the risk of `InvalidCastException` on unboxing.

**Answer**

**1. Performance**
- Each boxing = a heap allocation + a value copy.
- Each unboxing = a type check + a value copy.
- Roughly an order of magnitude slower than direct value access. Irrelevant once; catastrophic in a loop over a million elements.

**2. GC pressure**
- Boxed objects are garbage as soon as you're done with them. Millions of short-lived boxes mean frequent Gen 0 collections and possible promotion to Gen 1/Gen 2.

**3. Loss of type safety at compile time**
```csharp
object o = 5;
string s = (string)o;   // compiles fine, throws InvalidCastException at runtime
```

**4. Value semantics surprises**
- The box is a *copy*. Mutating the original doesn't change the box and vice versa.

**How to avoid it:**
- Use **generic collections** — `List<int>` not `ArrayList`.
- Use `Equals(T)` / `IEquatable<T>` instead of `Equals(object)`.
- Use string interpolation or `.ToString()` rather than passing value types as `object`.
- Use `Span<T>`, `struct` constraints (`where T : struct`) in hot paths.

```csharp
// Boxes 1,000,000 times
ArrayList list = new ArrayList();
for (int i = 0; i < 1_000_000; i++) list.Add(i);

// Zero boxing
List<int> list2 = new List<int>();
for (int i = 0; i < 1_000_000; i++) list2.Add(i);
```

> **Interview tip:** "GC pressure" is the phrase that separates good answers from great ones. Anyone can say "it's slow." Explaining *why* — allocation churn → more Gen 0 collections → possible promotions → longer pauses — shows depth.

> **Trap:** Don't over-claim. Boxing is not "always terrible"; premature micro-optimisation is also a smell. The mature answer: *"It matters in hot paths and tight loops. I'd profile before rewriting anything."*

---

## 18. Explain casting, implicit casting and explicit casting

**One-liner:** Casting converts one type to another; implicit casts are safe and automatic, explicit casts are potentially lossy and require a cast operator.

**Answer**

**Implicit casting** — compiler does it automatically because no data can be lost (widening):

```csharp
int i = 100;
long l = i;        // int → long
double d = l;      // long → double
float f = 'A';     // char → float

Dog d2 = new Dog();
Animal a = d2;     // derived → base (upcasting), always safe
```

**Explicit casting** — you must write the cast; data loss or failure is possible (narrowing):

```csharp
double d = 3.99;
int i = (int)d;          // 3 — fractional part truncated, not rounded

long big = 5_000_000_000;
int small = (int)big;    // overflow, silently wraps (unless in a checked block)

Animal a = new Dog();
Dog dog = (Dog)a;        // base → derived (downcasting), may throw
```

**Safer alternatives to a raw cast:**

```csharp
// as — returns null instead of throwing (reference types / nullables only)
Dog dog = animal as Dog;
if (dog != null) { ... }

// is with pattern matching (C# 7+) — the idiomatic modern form
if (animal is Dog d) { d.Bark(); }

// Convert / TryParse — for cross-family conversions and strings
int n = Convert.ToInt32("123");
if (int.TryParse(input, out int value)) { ... }
```

**Cast vs `Convert` vs `Parse`:**
- **Cast `(int)x`** — for compatible types; truncates doubles.
- **`Convert.ToInt32(x)`** — works across families, handles `null` → 0, and **rounds** (banker's rounding) rather than truncating.
- **`int.Parse` / `TryParse`** — strings only; `TryParse` never throws.

> **Interview tip:** The `(int)3.99 == 3` vs `Convert.ToInt32(3.99) == 4` difference is a favourite gotcha. Volunteer it — you'll stand out immediately.

> **Traps:**
> - `as` cannot be used with non-nullable value types (`int x = o as int;` won't compile — use `o as int?`).
> - Modern style prefers `is T t` pattern matching over `as` + null check.
> - Integer overflow is **silent by default** in C#. Wrap in `checked { }` (or enable it project-wide) to get an `OverflowException`.

---

## 19. What can happen during explicit casting?

**One-liner:** Data loss, silent overflow, or a runtime `InvalidCastException`.

**Answer**

**1. Loss of precision / truncation**
```csharp
double d = 9.99;
int i = (int)d;          // 9 — everything after the decimal is discarded

decimal m = 1.123456789M;
float f = (float)m;      // precision lost
```

**2. Overflow (silent by default)**
```csharp
int big = 300;
byte b = (byte)big;      // 44 — wraps around (300 - 256)

checked
{
    byte b2 = (byte)big; // now throws OverflowException
}
```

**3. `InvalidCastException`**
```csharp
object o = "hello";
int i = (int)o;          // compiles, throws at runtime

Animal a = new Cat();
Dog d = (Dog)a;          // throws — a Cat is not a Dog
```

**4. `NullReferenceException` downstream**
```csharp
Dog d = someAnimal as Dog;   // null if the cast fails
d.Bark();                    // NullReferenceException
```

**5. Unboxing type mismatch**
```csharp
object o = 5;            // boxed as int
long l = (long)o;        // InvalidCastException — must unbox to int first
```

**Defensive patterns:**
```csharp
if (animal is Dog dog) dog.Bark();                  // preferred
if (int.TryParse(s, out int n)) { /* use n */ }     // for strings
var dog2 = animal as Dog; if (dog2 is not null) ... // null-safe
```

> **Interview tip:** Name the exceptions precisely — `InvalidCastException`, `OverflowException`, `FormatException`, `NullReferenceException`. Vague answers like "it might crash" score poorly; naming the exact exception type scores well.

> **Trap:** Many candidates think narrowing conversions throw automatically. In C# they **silently wrap** unless you're in a `checked` context. That surprise is the whole point of the question.

---

## 20. Differentiate between Array and ArrayList

**One-liner:** Array is fixed-size and strongly typed; ArrayList is dynamically sized but stores `object`, so it boxes and isn't type-safe. Use `List<T>` instead of both, in practice.

**Answer**

| | `Array` (`int[]`) | `ArrayList` |
|---|---|---|
| Namespace | `System` | `System.Collections` |
| Size | **Fixed** at creation | **Dynamic** — grows automatically |
| Type safety | **Strongly typed** — compile-time checked | Stores `object` — no compile-time checking |
| Boxing | **None** for value types | **Boxes** every value type |
| Performance | Faster | Slower |
| Mixed types | Not allowed | Allowed (usually a bug) |
| Status | Current | **Legacy** — pre-generics (.NET 1.x) |

```csharp
// Array
int[] numbers = new int[3];
numbers[0] = 10;
// numbers[3] = 40;        // IndexOutOfRangeException
// numbers[1] = "hello";   // compile-time error — good

// ArrayList
ArrayList list = new ArrayList();
list.Add(10);              // boxed
list.Add("hello");         // allowed! no compile-time error
list.Add(true);
int x = (int)list[1];      // InvalidCastException at runtime — the bug
```

**What to use today:**

| Need | Use |
|---|---|
| Fixed-size, known length, max performance | `int[]` |
| Dynamic, type-safe list | `List<T>` |
| Key/value lookup | `Dictionary<TKey, TValue>` |
| Unique items | `HashSet<T>` |
| Never | `ArrayList`, `Hashtable` |

> **Interview tip:** Close with: *"I'd use neither in new code — `List<T>` gives you ArrayList's flexibility with Array's type safety and no boxing."* That turns a trivia question into an opinion, which interviewers like.

> **Traps:**
> - `Array.Resize()` doesn't actually resize — it creates a **new** array and copies. The original is unchanged.
> - Arrays are reference types even when holding value types, so `int[]` lives on the heap.
> - Arrays support multi-dimensional (`int[,]`) and jagged (`int[][]`) forms; `List<T>` doesn't.

---

## 21. Whose performance is better — Array or ArrayList?

**One-liner:** Array, clearly — no boxing, no casting, contiguous typed memory.

**Answer**

**Array wins because:**
1. **No boxing/unboxing.** `ArrayList` stores `object`, so every `int` you add is a heap allocation. `int[]` stores raw values inline.
2. **No casting on read.** Every `ArrayList` read needs an explicit cast; `Array` doesn't.
3. **Better memory locality.** `int[]` is a contiguous block of 4-byte values — cache-friendly. `ArrayList` is a contiguous block of *references* pointing to scattered boxed objects — pointer chasing and cache misses.
4. **Lower memory footprint.** A boxed `int` costs far more than 4 bytes once you add object header and pointer overhead.

**Rough magnitude:** for value types, `ArrayList` is typically several times slower and uses several times more memory than `int[]` or `List<int>`. For *reference* types the gap narrows considerably — there's no boxing — but the casting overhead remains.

**Where ArrayList "wins":** only convenience — dynamic resizing. And `List<T>` gives you that with none of the cost.

```csharp
// Best of both worlds
List<int> list = new List<int>(capacity: 1000);  // pre-size to avoid regrowth
for (int i = 0; i < 1000; i++) list.Add(i);      // no boxing, dynamic, type-safe
```

> **Interview tip:** Add the nuance about reference types — *"the boxing penalty only applies to value types; with `ArrayList<object-like>` contents the difference is mostly the cast."* Nuance beats absolutes.

> **Extra credit:** Mention pre-sizing. `new List<int>(1000)` avoids repeated doubling-and-copying as the internal array regrows. Also worth naming `Span<T>` / `ArrayPool<T>` for allocation-sensitive code.

> **Trap:** Don't just say "Array is faster" and stop. The interviewer wants the **mechanism** — boxing, casting, cache locality.

---

## 22. What are generic collections?

**One-liner:** Type-safe collections parameterised by type (`List<T>`, `Dictionary<K,V>`) that eliminate boxing and runtime cast errors.

**Answer**

Generics arrived in .NET 2.0 to fix exactly the problems of `ArrayList`/`Hashtable`. `<T>` is a placeholder filled in at compile time.

**Benefits:**
1. **Type safety** — errors caught at compile time, not runtime.
2. **No boxing** — `List<int>` stores ints directly.
3. **No casting** — `list[0]` is already an `int`.
4. **Code reuse** — write the algorithm once, use it with any type.
5. **Better performance** — the JIT generates specialised native code per value type.

**The main generic collections:**

| Collection | Use case | Lookup |
|---|---|---|
| `List<T>` | Ordered, dynamic list | O(n) by value, O(1) by index |
| `Dictionary<TKey,TValue>` | Key → value lookup | O(1) average |
| `HashSet<T>` | Unique items, set operations | O(1) average |
| `Queue<T>` | FIFO | — |
| `Stack<T>` | LIFO | — |
| `LinkedList<T>` | Fast insert/remove in the middle | O(n) |
| `SortedList<K,V>` / `SortedDictionary<K,V>` | Sorted by key | O(log n) |
| `ConcurrentDictionary<K,V>` | Thread-safe dictionary | O(1) average |

```csharp
List<string> names = new List<string> { "Alice", "Bob" };
names.Add("Charlie");
// names.Add(42);              // compile-time error — caught early
string first = names[0];       // no cast needed

Dictionary<int, string> users = new()
{
    [1] = "Alice",
    [2] = "Bob"
};
if (users.TryGetValue(1, out string name)) Console.WriteLine(name);
```

**Generic constraints** — a strong bonus topic:
```csharp
public class Repository<T> where T : class, IEntity, new()
{
    public T Create() => new T();
}
// where T : struct | class | new() | BaseClass | IInterface | notnull | unmanaged
```

> **Interview tip:** Mention that the **JIT creates a separate native code copy per value type argument** (`List<int>` and `List<double>` get distinct code) but **shares one copy for all reference types** (since they're all pointer-sized). That's a genuinely advanced detail.

> **Traps:**
> - "Generics are just syntactic sugar over `object`." **False** — that's Java (type erasure). .NET generics are **reified**: the type argument survives into IL and is available at runtime via reflection.
> - Don't confuse `IEnumerable<T>` (lazy, forward-only) with `List<T>` (materialised).
> - `Dictionary<K,V>` is **not** thread-safe; `ConcurrentDictionary` is.

---

## 23. What are threads (Multithreading)?

**One-liner:** A thread is the smallest unit of execution; multithreading runs several of them concurrently to keep the UI responsive and use multiple cores.

**Answer**

A **process** is a running program with its own memory space. A **thread** is a path of execution inside that process. All threads in a process share the heap but each gets its own **stack** (default ~1 MB).

**Why multithread?**
- **Responsiveness** — keep the UI alive while work happens in the background.
- **Parallelism** — use all CPU cores for CPU-bound work.
- **Throughput** — a server handling many requests at once.

```csharp
Thread t = new Thread(() => Console.WriteLine("Running on a worker thread"));
t.Start();
t.Join();         // block until t finishes
// t.IsBackground = true;  // won't keep the process alive
```

**Foreground vs background threads:** foreground threads keep the process alive until they complete; background threads are killed when all foreground threads exit. Thread-pool threads are always background.

**The hard part — shared state.** Two threads touching the same data cause **race conditions**:

```csharp
private static int _counter = 0;
private static readonly object _lock = new object();

void Increment()
{
    lock (_lock)          // only one thread at a time
    {
        _counter++;       // ++ is read-modify-write: NOT atomic without a lock
    }
}

// Lock-free alternative for simple counters
Interlocked.Increment(ref _counter);
```

**Synchronisation primitives:** `lock` (Monitor), `Mutex` (cross-process), `SemaphoreSlim` (limit concurrency, async-friendly), `ReaderWriterLockSlim`, `Interlocked`.

> **Interview tip:** Distinguish **concurrency** (dealing with many things at once, interleaved) from **parallelism** (doing many things at once, truly simultaneous on multiple cores). Interviewers love this.

> **Traps:**
> - **Deadlock** — two threads each hold a lock the other wants. Prevent by always acquiring locks in the same order.
> - **Never `lock(this)` or `lock(typeof(X))` or `lock("string")`** — external code can lock the same object. Use a `private static readonly object`.
> - `counter++` is **not atomic** — it's three operations.
> - Creating threads is expensive (~1 MB stack each). For short tasks use the thread pool / `Task`.
> - For **I/O-bound** work, threads are the wrong tool — use `async/await`, which uses **no thread at all** while waiting.

---

## 24. How are threads different from TPL?

**One-liner:** `Thread` is a low-level OS thread you manage yourself; TPL (`Task`) is a higher-level abstraction over a thread pool that adds scheduling, continuations, cancellation and exception propagation.

**Answer**

| | `Thread` | TPL (`Task` / `Parallel`) |
|---|---|---|
| Level | Low-level, 1:1 with an OS thread | High-level abstraction |
| Thread management | You create and destroy each one | Thread pool reuses threads |
| Return a value | No — you need shared state | `Task<TResult>` |
| Chaining | Manual | `ContinueWith`, `await` |
| Exceptions | Lost / crashes the process | Captured in the `Task`, rethrown on `await` |
| Cancellation | No built-in mechanism | `CancellationToken` |
| Work stealing | No | Yes — better load balancing |
| Async support | No | `async/await` built on it |
| Introduced | .NET 1.0 | .NET 4.0 |

```csharp
// Old way
Thread t = new Thread(DoWork);
t.Start();
t.Join();

// TPL
Task<int> task = Task.Run(() => Compute());
int result = await task;              // non-blocking, exceptions propagate

// Parallel loop — TPL partitions and balances automatically
Parallel.For(0, 1000, i => Process(i));
Parallel.ForEach(items, item => Process(item));

// Composition
Task[] all = { FetchA(), FetchB(), FetchC() };
await Task.WhenAll(all);

// Cancellation
var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
await Task.Run(() => LongWork(cts.Token), cts.Token);
```

**Crucial distinction — `Task` ≠ thread.** A `Task` is a *promise of future work*. `Task.Run` puts CPU-bound work on a pool thread. But an **async I/O** task (`await httpClient.GetAsync(...)`) occupies **no thread at all** while waiting — the thread is returned to the pool and resumed via an I/O completion callback.

**Rule of thumb:**
- **CPU-bound** work → `Task.Run` / `Parallel.For`
- **I/O-bound** work → `async/await` with truly async APIs (never `Task.Run(() => File.ReadAllText(...))`)

> **Interview tip:** The line that impresses: *"`async` doesn't mean 'on another thread' — for I/O there is no thread. That's why async scales servers so much better than thread-per-request."*

> **Traps:**
> - **Never call `.Result` or `.Wait()` on a task in ASP.NET or a UI app** — classic deadlock via the synchronization context. Use `await` all the way up.
> - `async void` is only for event handlers; exceptions in it can't be caught and will crash the process. Use `async Task`.
> - Don't wrap sync-over-async: `Task.Run(() => SyncMethod())` on a web server just burns a pool thread.
> - Use `ConfigureAwait(false)` in library code to avoid capturing the context.

---

## 25. How do we handle exceptions in C# (try/catch)?

**One-liner:** Wrap risky code in `try`, handle specific exception types in ordered `catch` blocks, and clean up in `finally`.

**Answer**

```csharp
try
{
    int result = Divide(10, 0);
}
catch (DivideByZeroException ex)          // most specific first
{
    _logger.LogError(ex, "Division by zero");
}
catch (ArithmeticException ex)            // broader
{
    _logger.LogError(ex, "Arithmetic problem");
}
catch (Exception ex)                      // most general last
{
    _logger.LogError(ex, "Unexpected");
    throw;                                // rethrow, preserving the stack trace
}
finally
{
    // always runs — cleanup
}
```

**Key rules:**
- Catch blocks are checked **in order**, so go **specific → general**. Putting `catch (Exception)` first makes the rest unreachable (compile error).
- `throw;` preserves the original stack trace. **`throw ex;` resets it** — a classic bug.
- **Exception filters** (C# 6+) let you catch conditionally *without* unwinding the stack:
  ```csharp
  catch (SqlException ex) when (ex.Number == 1205)   // deadlock victim → retry
  {
      await RetryAsync();
  }
  ```
- **Custom exceptions** — derive from `Exception`, keep the three standard constructors, suffix the name with `Exception`.
  ```csharp
  public class InsufficientFundsException : Exception
  {
      public decimal Shortfall { get; }
      public InsufficientFundsException(string message, decimal shortfall)
          : base(message) => Shortfall = shortfall;
  }
  ```
- **`InnerException`** preserves the original cause when you wrap: `throw new DataAccessException("Load failed", ex);`

**The exception hierarchy:** `Exception` → `SystemException` (framework: `NullReferenceException`, `InvalidOperationException`, `ArgumentException`, `IndexOutOfRangeException`) and `ApplicationException` (intended for user code, now discouraged — derive directly from `Exception`).

> **Interview tip:** Say **"exceptions are for exceptional cases, not control flow."** Then give the concrete alternative: `int.TryParse` instead of `try { int.Parse } catch`. Throwing is expensive — stack unwinding costs microseconds, not nanoseconds.

> **Traps:**
> - **Empty catch blocks** (`catch { }`) — swallowing exceptions is the single worst practice in this area. Interviewers actively probe for it.
> - `throw ex;` vs `throw;` — expect to be asked. `throw;` preserves; `throw ex;` destroys the original stack trace.
> - Some exceptions can't be caught: `StackOverflowException`. `OutOfMemoryException` can be caught but usually can't be recovered from.
> - Don't catch an exception only to log and rethrow at every layer — log once, at the boundary.
> - Prefer validating (`if (x is null) throw new ArgumentNullException(nameof(x));`) over letting a `NullReferenceException` surface deep in the stack.

---

## 26. What is the need of `finally`?

**One-liner:** `finally` guarantees cleanup code runs whether or not an exception was thrown — it's the only reliable place to release resources.

**Answer**

Without `finally`, an exception jumps out of the method and your cleanup line never executes:

```csharp
// BROKEN — connection leaks if the query throws
var conn = new SqlConnection(cs);
conn.Open();
RunQuery(conn);       // throws → next line never runs
conn.Close();

// CORRECT
var conn = new SqlConnection(cs);
try
{
    conn.Open();
    RunQuery(conn);
}
finally
{
    conn.Close();     // runs on success, on exception, and on early return
}
```

**`finally` runs when:**
- The `try` block completes normally.
- An exception is thrown (caught or not — it runs before propagating).
- The method `return`s from inside `try`.
- `break` / `continue` exits the block.

**`finally` does NOT run when:**
- `Environment.Exit()` / `Process.Kill()` is called.
- A `StackOverflowException` occurs.
- The process crashes or power is lost.

**`using` is `try/finally` in disguise** — this is the point worth making:

```csharp
using (var conn = new SqlConnection(cs)) { ... }

// compiles to roughly:
var conn = new SqlConnection(cs);
try { ... }
finally { conn?.Dispose(); }
```

You can also have `try/finally` with **no catch** — perfectly valid when you want guaranteed cleanup but don't want to handle the exception here.

> **Interview tip:** Deliver: *"In practice I rarely write `finally` by hand — `using` does it for me and expresses intent better. I reach for explicit `finally` for non-`IDisposable` cleanup, like releasing a semaphore or restoring UI state."*

> **Traps:**
> - **Never `return` from inside `finally`** — it silently swallows any in-flight exception. (C# actually forbids `return` in `finally`, but throwing from it has the same destructive effect.)
> - If both `try` and `finally` return values, `finally`'s side effects still run but can't change an already-evaluated return value on reference-type mutation — a known confusion. Just don't put control flow in `finally`.
> - `finally` runs **before** the exception propagates to the outer caller, not after.

---

## 27. Why do we need the `out` keyword?

**One-liner:** `out` lets a method return multiple values by writing into caller-supplied variables — the method **must** assign them before returning.

**Answer**

```csharp
if (int.TryParse("123", out int number))
{
    Console.WriteLine(number);   // 123 — C# 7+ inline declaration
}

// Custom
public bool TryDivide(int a, int b, out int result, out string error)
{
    result = 0;
    error = null;
    if (b == 0) { error = "Cannot divide by zero"; return false; }
    result = a / b;
    return true;
}
```

**`out` vs `ref` vs `in` — the table interviewers want:**

| | `out` | `ref` | `in` |
|---|---|---|---|
| Must be initialised **before** the call | No | **Yes** | Yes |
| Must be assigned **inside** the method | **Yes** | No | N/A (read-only) |
| Direction | Out only | In and out | In only |
| Method can modify | Yes (must) | Yes | **No** |
| Typical use | `TryParse` pattern | Swap, in-place mutation | Pass large structs without copying |

**The `Try` pattern** is the main reason `out` exists: return a `bool` for success plus the value, avoiding the cost and noise of exceptions for expected failures.

**Modern alternatives** — worth naming, because `out` is often not the best choice anymore:
```csharp
// Tuples (C# 7+) — usually cleaner than multiple out params
public (bool Success, int Value, string Error) Divide(int a, int b) =>
    b == 0 ? (false, 0, "Cannot divide by zero") : (true, a / b, null);

var (ok, value, err) = Divide(10, 2);

// Nullable return
public int? TryDivide(int a, int b) => b == 0 ? null : a / b;
```

> **Interview tip:** Say *"I'd use `out` when implementing the `Try` pattern for consistency with the BCL, but reach for a tuple or nullable return when I need more than one meaningful output."* That's a design opinion, which is what senior interviewers are listening for.

> **Traps:**
> - `out`/`ref` parameters **cannot be used with `async` methods** or iterators (`yield`). Common gotcha.
> - `out` doesn't make a reference type "more by reference" — reference types are already passed by reference value. `ref` on a reference type means you can reassign *the caller's variable itself*.
> - `out _` (discard) when you don't need the value: `if (int.TryParse(s, out _)) { ... }`.

---

## 28. What is the need of Delegates?

**One-liner:** A delegate is a type-safe function pointer — it lets you pass methods as arguments, enabling callbacks, events and plug-in behaviour.

**Answer**

A delegate defines a **method signature**; any method matching it can be assigned to a variable of that delegate type.

```csharp
public delegate int Operation(int a, int b);

int Add(int a, int b) => a + b;
int Multiply(int a, int b) => a * b;

Operation op = Add;
Console.WriteLine(op(3, 4));      // 7
op = Multiply;
Console.WriteLine(op(3, 4));      // 12
```

**Why they matter:**
1. **Callbacks** — "call me back when you're done."
2. **Events** — events are built on delegates (Q29).
3. **Loose coupling / strategy pattern** — inject behaviour instead of hard-coding it.
4. **LINQ** — `Where`, `Select`, `OrderBy` all take delegates.
5. **Multicast** — one delegate can hold a chain of methods, all invoked in order.

**Built-in generic delegates (use these, don't declare your own):**

| Delegate | Signature |
|---|---|
| `Action` | no params, returns void |
| `Action<T>`, `Action<T1,T2>`… | params, returns void |
| `Func<TResult>` | no params, returns `TResult` |
| `Func<T, TResult>`, … | params, returns `TResult` — **last type arg is always the return type** |
| `Predicate<T>` | takes `T`, returns `bool` |

```csharp
Func<int, int, int> add = (a, b) => a + b;
Action<string> log = msg => Console.WriteLine(msg);
Predicate<int> isEven = n => n % 2 == 0;

// Strategy injection — no if/else chain
void ProcessOrder(Order o, Action<Order> notify) { /* ... */ notify(o); }
ProcessOrder(order, o => SendEmail(o));
ProcessOrder(order, o => SendSms(o));

// Multicast
Action pipeline = Validate;
pipeline += Save;
pipeline += Notify;
pipeline();          // all three, in order
```

> **Interview tip:** The phrase **"type-safe function pointer"** is the expected opening. Then immediately connect to LINQ: *"Every LINQ lambda is a delegate — `Where` takes a `Func<T, bool>`."* That grounds an abstract concept in code they use daily.

> **Traps:**
> - A multicast delegate with a return type only returns the **last** method's value; the rest are discarded.
> - If one method in a multicast chain throws, the remaining ones **don't run**.
> - `Func<T, bool>` vs `Expression<Func<T, bool>>` — the first is compiled code (LINQ to Objects), the second is a **parsable expression tree** that EF Core translates to SQL. Knowing this difference is a strong signal.
> - Lambdas capturing loop variables: fine since C# 5 for `foreach`, still a trap for `for` loops.

---

## 29. What are events?

**One-liner:** An event is a delegate with restricted access — publishers raise it, subscribers listen, and subscribers can't invoke or overwrite it.

**Answer**

Events implement the **publisher/subscriber (observer)** pattern.

```csharp
public class Order
{
    // 1. Declare the event using the standard EventHandler<T> pattern
    public event EventHandler<OrderPlacedEventArgs> OrderPlaced;

    public void Place()
    {
        // ... business logic ...
        OnOrderPlaced(new OrderPlacedEventArgs { OrderId = Id });
    }

    // 2. Protected virtual raiser — allows derived classes to override
    protected virtual void OnOrderPlaced(OrderPlacedEventArgs e)
    {
        OrderPlaced?.Invoke(this, e);   // null-conditional: no subscribers = no NRE
    }
}

public class OrderPlacedEventArgs : EventArgs
{
    public int OrderId { get; set; }
}

// 3. Subscribe
order.OrderPlaced += (sender, e) => Console.WriteLine($"Order {e.OrderId} placed");
order.OrderPlaced += emailService.SendConfirmation;

// 4. Unsubscribe — important!
order.OrderPlaced -= emailService.SendConfirmation;
```

**Event vs delegate — the core exam question:**

| | Delegate | Event |
|---|---|---|
| Who can invoke | Anyone with access | **Only the declaring class** |
| Assignment | `d = method` (overwrites everything) | `+=` / `-=` only — **`=` is a compile error** |
| Purpose | General method reference | Notification contract |

That encapsulation is the whole point: a delegate field is a public mutable variable any caller could null out or fire; `event` adds `add`/`remove` accessors and locks down everything else.

**The standard .NET event pattern:**
- Use `EventHandler` (no data) or `EventHandler<TEventArgs>` (with data).
- Signature: `(object sender, TEventArgs e)`.
- Name the raiser method `On` + event name, `protected virtual`.
- Raise with `?.Invoke(...)`.

> **Interview tip:** Deliver the encapsulation line crisply: *"An event is a delegate wrapped in `add`/`remove` accessors — it's the `private` of the delegate world. Outside code can subscribe and unsubscribe, but only the owner can raise it."*

> **Traps — memory leaks are the #1 follow-up:**
> - **A subscriber that never unsubscribes is kept alive by the publisher forever.** The publisher's delegate list holds a strong reference to the subscriber. If a long-lived publisher (a static service) holds a short-lived subscriber (a UI form), the form can never be garbage collected. **Always `-=` in `Dispose`.** Naming this is the single highest-value thing you can say on this question.
> - Thread safety: `if (OrderPlaced != null) OrderPlaced(this, e);` has a race — another thread can unsubscribe between the check and the call. Use `OrderPlaced?.Invoke(...)`, which compiles to a safe local copy.
> - An exception in one handler stops the remaining handlers from running.
> - Weak event patterns and `WeakEventManager` exist for the leak problem in WPF.

---

## 30. What's the difference between Abstract class and Interface?

**One-liner:** An abstract class is an incomplete base class defining an "is-a" relationship with shared state and implementation; an interface is a pure contract defining a "can-do" capability, and a class can implement many.

**Answer**

| | Abstract Class | Interface |
|---|---|---|
| Multiple inheritance | **No** — one base class only | **Yes** — implement many |
| Fields / state | Yes | No (no instance fields) |
| Constructors | Yes | No |
| Access modifiers on members | Yes | Implicitly public (C# 8+ allows more) |
| Implementation | Can have full method bodies | Contract only (default impls since C# 8) |
| Static members | Yes | C# 8+ yes; C# 11 static abstract members |
| Relationship | **"is-a"** | **"can-do" / capability** |
| Versioning | Add a member without breaking implementers | Adding a member breaks all implementers (pre-default-impl) |

```csharp
public abstract class Animal
{
    public string Name { get; set; }             // shared state

    protected Animal(string name) => Name = name; // constructor

    public void Sleep() => Console.WriteLine($"{Name} sleeps");  // shared impl

    public abstract void MakeSound();             // subclass must implement
    public virtual void Move() => Console.WriteLine("Walking");  // can override
}

public interface ISwimmable { void Swim(); }
public interface IFlyable   { void Fly();  }

public class Duck : Animal, ISwimmable, IFlyable   // ONE class + MANY interfaces
{
    public Duck(string name) : base(name) { }
    public override void MakeSound() => Console.WriteLine("Quack");
    public void Swim() => Console.WriteLine("Swimming");
    public void Fly()  => Console.WriteLine("Flying");
}
```

**When to choose which:**

| Use an **abstract class** when | Use an **interface** when |
|---|---|
| Types share a genuine "is-a" relationship | Unrelated types share a capability |
| You have common state or implementation to share | You only need a contract |
| You want to control the construction of subclasses | You need multiple inheritance |
| You expect to add members later without breaking implementers | You're defining an API boundary for DI/testing/mocking |

**Modern C# nuance worth raising:**
- **C# 8 default interface methods** blur the line — interfaces can now carry implementation. But they still can't hold instance state, which remains the fundamental distinction.
- **C# 11 static abstract members** enable generic math (`where T : INumber<T>`).
- Real codebases lean on interfaces for **dependency injection and unit testing** — you mock `IRepository`, not `RepositoryBase`.

> **Interview tip:** Lead with the conceptual difference, not the table: *"Abstract class models what something **is**; interface models what something **can do**. A `Duck` **is an** `Animal` but **can** swim and **can** fly."* Then give the composition rule of thumb: *"Favour interfaces for API boundaries and testability; use an abstract class when subclasses genuinely share state and implementation."*

> **Traps:**
> - "You can't have method bodies in an interface" — **outdated since C# 8**. Say "traditionally no; since C# 8 default implementations exist, but interfaces still cannot hold instance fields."
> - Abstract classes **cannot be instantiated**, but they **do** have constructors — called via `base()` from derived classes. People get this wrong constantly.
> - An abstract class may contain zero abstract members and still be abstract.
> - Explicit interface implementation (`void IFlyable.Fly() { }`) hides the member from the class's public surface — useful for resolving name collisions across two interfaces.
> - The classic prompt: *"Can an abstract class implement an interface?"* → **Yes**, and it can even leave the interface's members abstract for subclasses to implement.

---

## Quick Revision Sheet

Print this. Read it in the lobby.

| Concept | Nail it in one line |
|---|---|
| .NET vs C# | Platform vs language |
| .NET 5+ | Unification of Framework + Core + Xamarin |
| IL | CPU-independent code + metadata, produced by the compiler |
| JIT | IL → native, **per method, on first call**, cached |
| CLR | Execution engine: JIT, GC, type safety, exceptions, threads |
| Managed vs unmanaged | Under CLR control vs direct on the OS |
| GC | Generational mark-and-compact; collects **unreachable**, not unused |
| Unmanaged cleanup | `IDisposable` + `using`; finalizer only as a backstop |
| CTS vs CLS | CTS = all runtime types; CLS = safe cross-language subset. CLS ⊂ CTS |
| Stack vs Heap | Stack = per-thread, fast, auto-freed; heap = shared, GC'd |
| Value vs Reference | Copies the value vs copies the reference |
| Boxing | Value → heap object. Costs an allocation + copy |
| Implicit vs explicit cast | Safe/automatic vs lossy/requires cast |
| Array vs ArrayList | Fixed + typed vs dynamic + boxing. Use `List<T>` |
| Generics | Type safety + no boxing + reified at runtime |
| Thread vs Task | OS thread you manage vs pooled abstraction with continuations |
| async I/O | Uses **no thread** while waiting |
| `throw;` vs `throw ex;` | Preserves stack trace vs resets it |
| `finally` | Guaranteed cleanup; `using` is `try/finally` sugar |
| `out` vs `ref` | Must assign inside vs must initialise before |
| Delegate | Type-safe function pointer |
| Event | Delegate + `add`/`remove` only — publisher alone can raise |
| Abstract vs Interface | "is-a" with state vs "can-do" contract, many allowed |

---

## Ten Things That Sink Candidates

1. Saying `.NET` and `C#` are interchangeable.
2. "Value types are always on the stack."
3. Recommending `GC.Collect()` for performance.
4. Claiming the GC cleans up unmanaged resources.
5. `throw ex;` instead of `throw;`.
6. Empty `catch { }` blocks.
7. Calling `.Result` / `.Wait()` on a Task in web or UI code.
8. Not knowing events can leak memory without `-=`.
9. "Interfaces can't have implementations" (outdated since C# 8).
10. Reciting a memorised table with no code example or real-world reason behind it.

---

## Likely Follow-Ups to Prepare Separately

- `IEnumerable` vs `IQueryable` vs `ICollection` vs `IList`
- `string` vs `StringBuilder`, and string immutability/interning
- `const` vs `readonly` vs `static readonly`
- `==` vs `.Equals()` vs `ReferenceEquals`, and `GetHashCode` contract
- SOLID principles with a C# example each
- Dependency injection lifetimes: Singleton / Scoped / Transient
- LINQ deferred vs immediate execution
- `async/await` state machine and `SynchronizationContext`
- `record` vs `class` vs `struct`
- Nullable reference types (C# 8+)

---

*Good luck. Explain the **why**, give a two-line code example, and name one real trade-off you've hit — that's what separates a pass from an offer.*
