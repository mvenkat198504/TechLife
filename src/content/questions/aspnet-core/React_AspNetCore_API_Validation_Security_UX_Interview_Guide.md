---
id: aspnet-react-006
slug:  Validation in an ASP.NET Core API Serving React
title:  Validation in an ASP.NET Core API Serving React
categoryId: aspnet-core
subcategory:  Validation in an ASP.NET Core API Serving React
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - ASP.NET Core API Serving React
  - Responsive Grid React
  - aspnet-core
summary: Validation in an ASP.NET Core API Serving React
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---

# Interview Guide: Validation in an ASP.NET Core API Serving React

## Interview question

**How would you handle data validation in a .NET Core Web API that serves a React front-end to ensure both security and a seamless UX?**

> “.NET Core Web API” commonly refers to an **ASP.NET Core Web API**. The central principle is that React helps users correct errors quickly, while the server makes the authoritative decision.

## Strong 90-second interview answer

> I would validate at multiple boundaries. In React, I would give immediate feedback for required fields, formats and simple cross-field rules, preferably on blur or submit rather than showing errors for untouched fields. That improves UX but cannot be trusted for security. The ASP.NET Core API would validate input shape, types, lengths and ranges through request DTOs, then enforce cross-field rules, authorization, tenant scope, uniqueness and other business invariants in the application/domain layer. I would never bind client JSON directly to persistence entities.
>
> I would return a consistent field-error contract such as `ValidationProblemDetails`, with stable error codes where useful, and map those errors back to the matching React fields. For a uniqueness conflict or stale edit, I would use a suitable conflict response; unexpected errors would return a safe generic problem response and a trace ID rather than internal details. I would apply size/rate limits, parameterized database access, output encoding and context-specific protections as separate security controls, because validation alone does not prevent injection or XSS.
>
> I would test bypassing client validation, malformed JSON, boundary values, cross-field rules, concurrent submissions and accessibility. I would preserve user input on failure, focus the first invalid field, announce errors, and measure API latency so asynchronous checks do not make the form feel slow.

## 1. Divide responsibilities clearly

| Layer | Purpose | Examples |
| --- | --- | --- |
| React form | Fast feedback and guidance | Required, length, email shape, end date after start date |
| API boundary | Reject malformed/unexpected input | JSON syntax, types, nulls, max length, enum/range, request size |
| Application/domain | Enforce business invariants | Study title uniqueness, transition rules, date window, quota |
| Authorization | Restrict who may act and on which record | Tenant ownership, role, resource permission |
| Database | Final integrity under concurrency | Unique indexes, foreign keys, check constraints, row versions |

Client and server may share a documented schema or generated API types, but the server must run its own validation. A client can disable JavaScript or call an endpoint directly. Database constraints are a safety net for races; they do not replace clear API errors.

### Validation versus security controls

- **Validation** checks whether input is acceptable for a particular operation.
- **Authorization** checks whether the user may perform that operation on the target resource. A valid `studyId` is not proof of ownership.
- **Parameterized queries/EF Core** address SQL injection; do not build dynamic SQL from untrusted input. For dynamic sort/filter fields, use an allowlist.
- **Contextual output encoding** and safe HTML handling address XSS; an input rule that blocks `<` is not a general XSS defense. If rich HTML is required, apply a reviewed sanitization policy before rendering it as HTML.
- **CSRF protection** depends on authentication transport. Cookie-authenticated state-changing requests need an appropriate anti-forgery strategy; bearer-token flows have different considerations.
- **Request limits, rate limits and quotas** defend resources and abuse cases; a `[MaxLength]` annotation alone does not bound an entire HTTP body.

## 2. Define an explicit request contract

Use DTOs specific to the operation rather than exposing an EF Core entity. Specify whether fields are required, optional or nullable, and make the rules consistent with your JSON and .NET nullable-reference-type settings.

### Example: study creation request

```csharp
using System.ComponentModel.DataAnnotations;

public sealed class CreateStudyRequest : IValidatableObject
{
    [Required(ErrorMessage = "Study title is required.")]
    [StringLength(120, MinimumLength = 3,
        ErrorMessage = "Study title must be 3 to 120 characters.")]
    public string? Title { get; init; }

    [Required]
    public DateOnly? StartDate { get; init; }

    [Required]
    public DateOnly? EndDate { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (StartDate is not null && EndDate is not null && EndDate < StartDate)
        {
            yield return new ValidationResult(
                "End date must be on or after the start date.",
                new[] { nameof(EndDate) });
        }
    }
}
```

This illustrates shape and cross-field validation. The service should still trim/normalize the title according to an explicit policy and check domain rules and authorization. Test the exact serialized field names: the default model-state keys may be CLR property names such as `EndDate`, while React may use `endDate`. Agree on a stable mapping or customize the response; do not rely on accidental casing.

### Controller and domain validation

```csharp
[ApiController]
[Route("api/studies")]
[Authorize]
public sealed class StudiesController : ControllerBase
{
    private readonly IStudyService _studies;

    public StudiesController(IStudyService studies) => _studies = studies;

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateStudyRequest request,
        CancellationToken cancellationToken)
    {
        // [ApiController] returns HTTP 400 with ValidationProblemDetails
        // automatically for invalid model state before this action runs.
        var tenantId = User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrEmpty(tenantId)) return Forbid();

        var normalizedTitle = request.Title!.Trim();
        if (string.IsNullOrWhiteSpace(normalizedTitle))
        {
            ModelState.AddModelError(nameof(request.Title), "Study title is required.");
            return ValidationProblem(ModelState);
        }

        var result = await _studies.CreateAsync(
            tenantId, normalizedTitle,
            request.StartDate!.Value, request.EndDate!.Value,
            cancellationToken);

        if (result.TitleAlreadyExists)
        {
            ModelState.AddModelError(nameof(request.Title),
                "A study with this title already exists.");
            return ValidationProblem(ModelState); // 400 field-level error by design
        }

        return CreatedAtAction(nameof(GetById),
            new { id = result.StudyId }, new { id = result.StudyId });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        // Placeholder: resolve tenant-scoped study with authorization.
        var study = await _studies.GetAuthorizedAsync(id, User, ct);
        return study is null ? NotFound() : Ok(study);
    }
}
```

**Important production details:** `CreateAsync` must enforce uniqueness atomically with a database unique index and translate that specific constraint failure to a safe error. The preliminary existence check alone races with concurrent requests. Some APIs choose `409 Conflict` with a field error for duplicates; choose a documented convention and make React handle it. Do not return arbitrary database exception text to users. The sample's `GetById` shows the required ownership check but the exact interface is application-specific.

For complex rules and many endpoints, a dedicated validator/service can be preferable to large annotation classes. Keep domain invariants in the domain/service layer so background jobs and other entry points cannot bypass them.

## 3. Return consistent, safe errors

ASP.NET Core `[ApiController]` automatically handles invalid model state and normally returns a `400` `ValidationProblemDetails` body. Use `ValidationProblem(ModelState)` for additional field-level rules. A typical response shape is:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Title": ["Study title must be 3 to 120 characters."],
    "EndDate": ["End date must be on or after the start date."]
  },
  "traceId": "00-example-trace-id"
}
```

The exact `type` and `traceId` representation are framework/configuration-dependent; treat this as illustrative. In a real API, document the schema and preserve it across endpoints and versions.

| Failure | Typical status | UI action |
| --- | --- | --- |
| Malformed JSON or invalid field | `400 Bad Request` | Show field/form errors, preserve input |
| Missing/invalid authentication | `401 Unauthorized` | Reauthenticate as appropriate |
| Authenticated but forbidden | `403 Forbidden` | Explain lack of access safely |
| Target no longer exists | `404 Not Found` | Show stale-resource state |
| Uniqueness or optimistic concurrency conflict | `409 Conflict` if API convention calls for it | Show actionable conflict and refresh option |
| Unsupported file/media type | `415 Unsupported Media Type` where applicable | Ask for accepted format |
| Request too large | `413 Content Too Large` | Explain size limit |
| Rate limit | `429 Too Many Requests` | Show retry timing if supplied |
| Unexpected failure | `500` problem response | Generic message plus support/trace reference |

Avoid leaking internal field names, SQL, stack traces or sensitive identifiers in production error responses. For highly sensitive values, even echoing an invalid submitted value can be unsafe. Keep logs structured and redact secrets and personal data.

### Stable error codes versus messages

Human-readable messages may change or be localized. For complex UIs, add stable application error codes (for example, `STUDY_TITLE_DUPLICATE`) in a documented extension or field-error object while still giving useful text. Avoid forcing React to parse English sentences to decide what to do. Keep a consistent mapping of JSON field paths to UI controls, including nested arrays such as `contacts[0].email`.

## 4. React form UX: local and server validation

Client checks should provide early guidance while avoiding aggressive error display. A useful pattern is:

1. Validate essential rules on blur and submit; show a field error after it is touched or the form is submitted.
2. For expensive uniqueness checks, debounce, cancel stale requests, and still recheck on final submit. Do not announce “available” based on an old response.
3. Disable duplicate submits while a request is pending, but preserve values and make retry possible.
4. Map API `errors` to fields; put non-field errors in a form summary. Focus the first invalid field and connect text with `aria-describedby` and `aria-invalid`.
5. Clear or revalidate a server error when the corresponding field changes. Preserve unrelated server errors until appropriate.

### Example React form (simplified)

```tsx
import { FormEvent, useRef, useState } from 'react';

type Fields = { title: string; startDate: string; endDate: string };
type FieldName = keyof Fields;
type ErrorMap = Partial<Record<FieldName, string>>;
type ApiProblem = { status?: number; title?: string; errors?: Record<string, string[]> };

function validate(values: Fields): ErrorMap {
  const errors: ErrorMap = {};
  const title = values.title.trim();
  if (title.length < 3 || title.length > 120)
    errors.title = 'Enter a title of 3 to 120 characters.';
  if (!values.startDate) errors.startDate = 'Select a start date.';
  if (!values.endDate) errors.endDate = 'Select an end date.';
  if (values.startDate && values.endDate && values.endDate < values.startDate)
    errors.endDate = 'End date must be on or after the start date.';
  return errors;
}

function mapApiErrors(problem: ApiProblem): ErrorMap {
  const source = problem.errors ?? {};
  return {
    title: source.Title?.[0] ?? source.title?.[0],
    startDate: source.StartDate?.[0] ?? source.startDate?.[0],
    endDate: source.EndDate?.[0] ?? source.endDate?.[0]
  };
}

export function CreateStudyForm() {
  const [values, setValues] = useState<Fields>({ title: '', startDate: '', endDate: '' });
  const [errors, setErrors] = useState<ErrorMap>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  function update(field: FieldName, value: string) {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
  }

  function focusFirst(errorMap: ErrorMap) {
    if (errorMap.title) titleRef.current?.focus();
    else if (errorMap.startDate) startRef.current?.focus();
    else if (errorMap.endDate) endRef.current?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const localErrors = validate(values);
    setErrors(localErrors); setFormError('');
    if (Object.values(localErrors).some(Boolean)) {
      focusFirst(localErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title.trim(),
          startDate: values.startDate,
          endDate: values.endDate
        })
      });
      if (!response.ok) {
        const problem: ApiProblem = await response.json();
        const apiErrors = mapApiErrors(problem);
        setErrors(apiErrors);
        focusFirst(apiErrors);
        if (!Object.values(apiErrors).some(Boolean))
          setFormError(problem.title ?? 'Could not save the study. Try again.');
        return;
      }
      // Navigate using the returned resource ID.
    } catch {
      setFormError('Network error. Your entries are still here; try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return <form onSubmit={submit} noValidate>
    {formError && <p role="alert">{formError}</p>}
    <label htmlFor="study-title">Study title</label>
    <input id="study-title" ref={titleRef} value={values.title}
      onChange={e => update('title', e.target.value)}
      aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} />
    {errors.title && <p id="title-error">{errors.title}</p>}

    <label htmlFor="start-date">Start date</label>
    <input id="start-date" ref={startRef} type="date" value={values.startDate}
      onChange={e => update('startDate', e.target.value)}
      aria-invalid={!!errors.startDate}
      aria-describedby={errors.startDate ? 'start-error' : undefined} />
    {errors.startDate && <p id="start-error">{errors.startDate}</p>}

    <label htmlFor="end-date">End date</label>
    <input id="end-date" ref={endRef} type="date" value={values.endDate}
      onChange={e => update('endDate', e.target.value)}
      aria-invalid={!!errors.endDate}
      aria-describedby={errors.endDate ? 'end-error' : undefined} />
    {errors.endDate && <p id="end-error">{errors.endDate}</p>}

    <button type="submit" disabled={submitting}>
      {submitting ? 'Saving…' : 'Create study'}
    </button>
  </form>;
}
```

**Implementation notes:** The `noValidate` attribute avoids browser-native messages competing with the custom example; teams may instead use native validation deliberately. The simplified `fetch` handler assumes JSON on non-success responses; production code should handle an empty/non-JSON body and `401`/`429` distinctly. React state updates and focus timing may need a ref or effect if the target control mounts only after an error state change. A form library can reduce boilerplate for larger forms, but the API error contract remains the same.

## 5. Async validation without race conditions

For a field such as study code or email uniqueness:

- Debounce the request after input settles, and cancel prior requests with `AbortController`.
- Associate the result with the exact value checked; ignore a late response for an older value.
- Do not expose whether a sensitive account exists if that would enable enumeration.
- Treat the availability check as advisory. The final write must enforce uniqueness atomically at the database and return a recoverable error if another user wins the race.
- Rate-limit expensive checks and consider server-side caching where safe.

## 6. Boundary and adversarial tests

| Test | Expected result |
| --- | --- |
| Empty, whitespace-only, too-short/long title | Correct field error; no database write |
| Malformed JSON, wrong type, null and oversized body | Safe 4xx response without stack trace |
| End date before start date | Cross-field error mapped to end-date control |
| Duplicate title from concurrent requests | Unique constraint protects data; one request gets actionable error |
| Direct API call bypassing React checks | Server rejects invalid input |
| Unauthorized tenant/study ID | No cross-tenant access, regardless of syntactically valid ID |
| SQL/script-looking text | Safe parameterized storage and context-appropriate rendering; no naive blanket filtering |
| Stale edit | Concurrency conflict with a refresh/merge path |
| Slow uniqueness check and network loss | No stale “valid” state; preserved user input and retry |
| Keyboard/screen reader | Errors are associated, announced and focusable |

Use unit tests for pure rules and integration tests for model binding, error shape, database uniqueness, authorization and concurrency. A small end-to-end test should verify the React form maps a real server validation response to the right field.

## 7. Practical application example

For a clinical study workspace, React can check title length and dates immediately. ASP.NET Core validates the DTO, ensures the user may create in the organization, checks the allowed template and phase, and enforces a unique `(TenantId, StudyCode)` database constraint. If the title or code conflicts, the API returns a field-level response. If the study is submitted for approval, workflow rules validate the current section status and the actor's role at the server, even if React hides the Submit button. Uploaded documents follow a separate file validation and scanning pipeline rather than being trusted because their extension says `.pdf`.

## Common mistakes to avoid

- Trusting React validation as a security boundary.
- Binding EF entities directly and allowing over-posting of fields such as `TenantId`, `Role` or `Approved`.
- Returning different error shapes from every endpoint or parsing error message strings in React.
- Treating an existence check as protection against concurrent duplicates.
- Using one restrictive regex to “prevent SQL injection” instead of parameterized queries and correct output handling.
- Showing errors before a user has interacted with the form or clearing all input after a 400 response.
- Sending database errors, stack traces or sensitive values in public validation messages.
- Checking input syntax but forgetting resource-level authorization.

## Closing statement

> React validation makes the form helpful, ASP.NET Core validation and authorization make the API trustworthy, and database constraints preserve correctness under concurrency. A stable field-error contract connects these layers so users can recover from mistakes without losing their work.

## Official references

- [ASP.NET Core model validation](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation)
- [ASP.NET Core API error handling and validation problem details](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api)
- [ASP.NET Core Web API controllers](https://learn.microsoft.com/en-us/aspnet/core/web-api/)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
- [React input component](https://react.dev/reference/react-dom/components/input)
