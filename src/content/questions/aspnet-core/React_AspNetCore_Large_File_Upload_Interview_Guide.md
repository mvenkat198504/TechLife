---
id: aspnet-react-007
slug:  Scalable Large File Uploads from React to ASP.NET Core
title:  Scalable Large File Uploads from React to ASP.NET Core
categoryId: aspnet-core
subcategory:  AspNet_React
difficulty: Experienced
tags:
  - React + ASP.NET Core
  - Integrating a Complex
  - Responsive Grid React
  - Fast Large Tables
  - aspnet-core
summary: Scalable Large File Uploads from React to ASP.NET Core
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: ["https://marketplace.visualstudio.com/items?itemName=akamud.vscode-theme-onedark"]
---
# Interview Guide: Scalable Large File Uploads from React to ASP.NET Core

## Interview question

**How would you design a .NET Core API to efficiently support large file uploads from a React front-end, while ensuring scalability and user feedback on upload progress?**

> In current terminology, the backend is usually **ASP.NET Core**. The principles apply to .NET Core applications generally.

## Strong 90-second interview answer

> I would avoid routing every large file through the API if the storage platform supports direct browser uploads. The React client first calls an authenticated ASP.NET Core endpoint to create an upload session. The API checks authorization, expected file size/type and quota, creates a pending record, and returns a short-lived, narrowly scoped upload authorization for one storage object. The browser uploads directly to private object storage in chunks or blocks with bounded parallelism, showing byte-level progress and allowing cancellation and retry. Then it calls a completion endpoint; the server verifies the uploaded object, queues scanning and processing, and only marks the file available after validation.
>
> For unreliable networks or very large files, I would make the session resumable: persist a session ID, deterministic chunk/block IDs, the committed or staged state, and an expiry. On resume the client asks which parts are present and sends only the missing ones. If direct upload is unavailable, I would stream through ASP.NET Core to storage without buffering the whole file in memory or using a large `IFormFile` binding. I would enforce limits at the gateway, app and storage boundary, and observe transfer failures, latency, concurrency, processing queue depth and orphaned uploads. The UI would distinguish “transferring,” “verifying/scanning,” and “ready”; 100% network progress is not the same as completed processing.

## 1. Define the requirements and choose the architecture

Ask for typical and maximum size, upload frequency, user concurrency, supported formats, compliance needs, target storage, whether resume is required, and acceptable time-to-availability. Check mobile/slow networks and whether multiple files upload together.

| Approach | Appropriate when | Main tradeoff |
| --- | --- | --- |
| Buffered `IFormFile` | Small or moderate files, simple workflow | Model binding buffers content; temp disk and resource limits matter |
| Streaming via ASP.NET Core | API must inspect bytes in transit or clients cannot access storage directly | App instances carry file bandwidth and open requests; must stream end to end |
| Direct browser-to-object-storage | Large files and high concurrent volume | More session, credential, CORS, completion and cleanup logic |
| Resumable block/chunk upload | Very large files or unreliable connections | Additional state, idempotency, checksums and assembly rules |

**Default at scale:** API as the control plane, object storage as the data plane. This removes bulk file transfer from API instances. In Azure, Blob Storage block blobs are a natural example; equivalent multipart mechanisms exist in other object stores.

### Flow

```text
React ──POST /uploads──> ASP.NET Core ──create pending record──> Database
  │                              │
  │<── session + scoped URL ──────┘
  │
  ├── file blocks with progress ───────────────> Private object storage
  │
  └──POST /uploads/{id}/complete──> API ──verify/queue──> Scanner/processor
                                      │
                          GET /uploads/{id} status
```

A pending upload is not automatically an accepted file. Keep raw/unverified objects inaccessible to normal application users until validation and processing complete.

## 2. API contract and state machine

### Example endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/uploads` | Authorize user, validate declared metadata/quota, create session and return a short-lived object-scoped upload URL or upload plan |
| `GET /api/uploads/{id}` | Return ownership-checked state, expiry, received parts/bytes when supported, processing status and errors |
| `POST /api/uploads/{id}/complete` | Idempotently finalize after server-side verification, enqueue processing |
| `DELETE /api/uploads/{id}` | Cancel session and schedule cleanup of temporary objects/parts |
| `GET /api/uploads/{id}/events` or polling | Optional processing progress after the network transfer |

Example initiation request:

```json
{
  "fileName": "study-protocol.pdf",
  "contentType": "application/pdf",
  "sizeBytes": 734003200,
  "clientRequestId": "66f1c9c2-9f2c-4cb1-b365-6b461e0193b8"
}
```

Example response (illustrative):

```json
{
  "uploadId": "u_12345",
  "state": "Pending",
  "uploadUrl": "https://storage.example/...short-lived-scoped-token...",
  "expiresAt": "2026-09-28T00:00:00Z",
  "maxSizeBytes": 1073741824,
  "recommendedBlockSizeBytes": 8388608,
  "maxParallelBlocks": 4
}
```

Do not log or expose signed upload URLs beyond the authorized browser session. The `clientRequestId` or an idempotency key lets the API safely return the same session after a retry, subject to ownership and expiry.

### State transitions

```text
Pending → Uploading → Uploaded → Verifying → Processing → Ready
    │         │           │          │             │
    └─────────┴───────────┴──────────┴─────────────┴──→ Failed/Expired/Cancelled
```

Transitions should be explicit and idempotent. Prevent duplicate completion calls from launching duplicate processing jobs. Store `uploadId`, owner/tenant, object key, declared size/type, observed size/type, checksum where used, version/ETag, expiry and state. Use a conditional database update or equivalent concurrency control for finalization.

## 3. React upload progress and UX

The UI should model separate phases:

1. **Preparing:** metadata check and session creation.
2. **Uploading:** percentage based on bytes sent for the current file, plus cancel/retry.
3. **Verifying/processing:** server-side validation and scanning; display status rather than falsely claiming the file is ready.
4. **Ready or failed:** a clear link/action or recoverable error.

For multiple files, show per-file progress and aggregate progress weighted by bytes, not an average of percentages. Upload progress events often report bytes sent by the client, not durable storage confirmation; the completion check is authoritative. Provide an accessible `<progress>` element or progressbar with a label and restrained announcements rather than announcing every percentage change.

### React/Azure Blob example (illustrative)

The browser SDK supports progress callbacks for block blob uploads. This snippet assumes the initiation endpoint returned an authorized blob URL, the storage account CORS policy allows the app origin and required methods/headers, and the API later verifies the object. In a real app, handle token expiry, retries, cancellation and per-file state in a dedicated upload hook/service.

```tsx
import { BlockBlobClient } from '@azure/storage-blob';
import { useRef, useState } from 'react';

type InitResponse = { uploadId: string; uploadUrl: string };

export function UploadControl() {
  const [phase, setPhase] = useState('idle');
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  async function upload(file: File) {
    const abort = new AbortController();
    abortRef.current = abort;
    setPhase('preparing'); setPercent(0); setMessage('');

    try {
      const initResponse = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          sizeBytes: file.size,
          clientRequestId: crypto.randomUUID()
        }),
        signal: abort.signal
      });
      if (!initResponse.ok) throw new Error('Could not start upload');
      const session: InitResponse = await initResponse.json();

      setPhase('uploading');
      const blob = new BlockBlobClient(session.uploadUrl);
      await blob.uploadBrowserData(file, {
        blockSize: 8 * 1024 * 1024,
        concurrency: 4,
        abortSignal: abort.signal,
        blobHTTPHeaders: { blobContentType: file.type || 'application/octet-stream' },
        onProgress: ({ loadedBytes }) => {
          setPercent(Math.min(100, Math.round(loadedBytes / file.size * 100)));
        }
      });

      setPhase('processing');
      const completed = await fetch(`/api/uploads/${session.uploadId}/complete`, {
        method: 'POST', signal: abort.signal
      });
      if (!completed.ok) throw new Error('Upload verification failed');
      setMessage('Transfer complete. Processing is in progress.');
      // Poll the status endpoint or subscribe to server events until Ready/Failed.
    } catch (error) {
      if (abort.signal.aborted) {
        setPhase('cancelled');
      } else {
        setPhase('failed');
        setMessage(error instanceof Error ? error.message : 'Upload failed');
      }
    } finally {
      abortRef.current = null;
    }
  }

  return <div>
    <input type="file" onChange={event => {
      const file = event.target.files?.[0];
      if (file) void upload(file);
    }} />
    {phase === 'uploading' && <label>
      Uploading {percent}% <progress value={percent} max={100} />
    </label>}
    {phase === 'processing' && <p role="status">Processing uploaded file…</p>}
    {message && <p role="status">{message}</p>}
    <button type="button" disabled={!abortRef.current}
      onClick={() => abortRef.current?.abort()}>Cancel</button>
  </div>;
}
```

**Caveats:** This is a basic transfer example, not cross-restart resumability. `uploadBrowserData` may split and parallelize internally, but to resume after a tab closes you need a durable session and deterministic staged block IDs (or a storage-native resumable protocol). A cancelled client request does not automatically delete the blob or cancel processing; call the cancel endpoint when possible and run server-side expiry cleanup. Also refresh or reissue a scoped authorization before it expires during a long upload. Do not treat a user-supplied MIME type as verified content.

If posting to the API rather than using a storage SDK, `XMLHttpRequest.upload` provides upload progress events. Be aware that browser Fetch does not universally expose a simple portable upload-progress callback; choose a supported transport for the target browsers. In either approach, percentages reflect transfer, not scanning or availability.

## 4. Resumable uploads and reliable retries

A robust resumable protocol needs more than `Content-Range` headers:

- Assign a stable `uploadId` and object key. Split the file into predetermined block sizes and deterministic block IDs, or use the storage provider's multipart protocol.
- Persist session metadata on the server, not in an API instance's memory. On resume, query which parts are safely staged/committed and upload only missing parts. Keep local file metadata/fingerprint only as a convenience; the user may need to reselect the file after a browser restart.
- Retry transient part failures with exponential backoff and jitter, bounded concurrency, and a retry cap. Do not retry authorization, validation or permanent 4xx failures blindly.
- Make part upload and completion idempotent. Validate ownership, part numbers/sizes, final size and checksum/ETag where applicable. A checksum verifies integrity but is not a malware scan or file-type guarantee.
- Use a session lease/expiry and periodic cleanup for abandoned blocks, temporary objects and pending database rows.
- Decide who commits blocks: the browser with narrowly scoped rights or the server after checking parts. If the browser commits, the server must still verify the final blob before publishing it.

An 8 MiB block size and concurrency of four are illustrative, not universal defaults. Tune for file size, network, storage limits, browser memory, and concurrent users; cap the total active uploads across files.

## 5. ASP.NET Core streaming fallback

If direct-to-storage upload is disallowed by network/security constraints, stream rather than copying the entire body to a `MemoryStream`. For raw-body uploads, the basic shape is:

```csharp
app.MapPut("/api/uploads/{uploadId}/content", async (
    string uploadId, HttpRequest request,
    IUploadSessionService sessions, IObjectStore store,
    CancellationToken cancellationToken) =>
{
    var session = await sessions.AuthorizeAndLoadAsync(
        uploadId, request.HttpContext.User, cancellationToken);
    if (session is null) return Results.NotFound();

    // A real implementation limits bytes while reading, not only via Content-Length.
    if (request.ContentLength is > 0 && request.ContentLength > session.MaxBytes)
        return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);

    await store.WriteStreamAsync(
        session.ObjectKey, request.Body, session.MaxBytes, cancellationToken);
    await sessions.MarkUploadedAsync(uploadId, cancellationToken);
    return Results.Accepted($"/api/uploads/{uploadId}");
});
```

`IObjectStore.WriteStreamAsync` is an application abstraction, **not** a built-in ASP.NET Core API; it must stream in bounded buffers, enforce the byte limit even if `Content-Length` is missing or false, propagate cancellation, and clean up partial output. The route also needs configured request-size limits, authorization, content validation, concurrency control and exception handling. Multipart streaming requires parsing multipart sections safely; do not assume default `IFormFile` model binding is fully unbuffered. Check limits at the reverse proxy, load balancer, server, endpoint and storage layer, plus timeout/idle-timeout behavior.

## 6. Security and compliance checks

- Authenticate before session issuance; enforce tenant ownership, allowed destination, quotas, rate limits and maximum sizes.
- Generate opaque object names. Never use the original filename as a storage path without sanitization. Retain the display filename separately.
- Use a private bucket/container and a short-lived object-scoped upload grant with the minimum permissions. Protect the token as a credential; configure storage CORS only for trusted origins and necessary methods/headers. CORS is not authorization.
- Validate extension, actual content/signature, declared and observed MIME type, size and any domain-specific document rules. Scan for malware where required; quarantine until checks pass.
- Treat decompression bombs, archive nesting, duplicate files and parser vulnerabilities as separate processing risks. Keep document extraction in a bounded background worker.
- Encrypt in transit and at rest, apply retention/deletion policies, audit ownership and access, and keep processing status visible.
- Do not trust client-reported completion or checksum alone. Inspect storage properties and validate against the session before making the file available.

A signed URL usually does **not** by itself enforce every application-level constraint such as final file size or content type. Validate these at completion, restrict scope and lifetime, and clean up rejected objects.

## 7. Scalability and operations

- Keep API servers stateless; store upload-session state in a durable database and bytes in object storage. Scale API and workers independently.
- Offload CPU-heavy scanning, PDF parsing, thumbnails, virus scanning or embedding generation to a queue and workers. Completion should return promptly with a status resource rather than hold a request for minutes.
- Tune per-user and system-wide concurrency, storage request limits, retry behavior and queue capacity. Use backpressure rather than letting thousands of active streams exhaust sockets, memory or temp disk.
- Watch upload initiation rate, successful bytes/sec, failure and retry rates, p95 completion time, abandoned sessions, orphaned storage, worker queue age and scan failures.
- Correlate `uploadId` across React telemetry, API logs, storage operations and worker jobs. Avoid logging signed URLs or file contents.
- Test large and small files, slow networks, connection drops, browser cancellation, token expiry, duplicate completion, out-of-order parts, concurrent users and malicious files.

## Follow-up interview questions

**Why not just accept `IFormFile` and call `CopyToAsync`?** It can be appropriate for smaller uploads, but the common model-binding path buffers file content and consumes server resources. For large/high-volume transfers, use unbuffered streaming or direct storage uploads and evaluate infrastructure limits.

**How does the React UI show progress?** Use the storage SDK's progress callback or XHR upload events to track bytes sent. Show a separate server-processing status after transfer; poll a status endpoint or receive a server event. Keep progress per file and offer cancel/retry.

**How do you resume a 2 GB upload after a network interruption?** Keep a durable upload session and stable part IDs, check which parts exist, resend missing parts, then finalize idempotently. A one-shot upload callback is not a resumable protocol.

**What if the client says 100% but the document is missing?** Treat progress as advisory. Verify the object, size and integrity server-side; only the status endpoint decides when it is ready. Handle transient storage visibility or processing failures according to the storage provider's guarantees.

**How do you prevent duplicate processing?** Use an idempotent completion endpoint, an atomic state transition and a uniquely keyed processing job/outbox record. Workers should also be idempotent.

**When would you proxy through ASP.NET Core?** When server-side inspection during transfer, private network rules or client limitations make direct storage access impractical. Stream end to end with resource limits and scale for the extra bandwidth.

**How would this fit an Azure Blob-based clinical document system?** The API creates a study-scoped pending document and issues a short-lived blob-scoped upload permission. React uploads blocks directly, the API verifies final size and ownership, a worker scans/extracts/chunks the file, and document status progresses from `Uploading` to `Processing` to `Ready` or `Failed`. Unverified files are not offered to RAG or export workflows.

## Common mistakes to avoid

- Buffering multi-gigabyte files in memory or keeping them on an API instance's local disk.
- Equating client progress reaching 100% with a validated, available document.
- Allowing unrestricted signed URLs or trusting client filenames and MIME types.
- Relying only on `Content-Length` for a size limit.
- Retrying entire files for every transient part failure.
- Claiming SDK chunking automatically provides resume after browser restart.
- Synchronously scanning or parsing large files inside the upload request.
- Forgetting cleanup for cancelled/expired sessions and staged blocks.

## Closing statement

> The API should authorize and coordinate uploads, object storage should carry the bytes, and background workers should validate and process them. React reports transfer progress and later processing status. Resumable parts, idempotent completion, strict scope and quotas, and end-to-end observability make the design reliable at scale.

## Official references

- [ASP.NET Core file uploads](https://learn.microsoft.com/aspnet/core/mvc/models/file-uploads)
- [Azure Blob Storage JavaScript upload](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-upload-javascript)
- [Azure `BlockBlobClient` upload methods](https://learn.microsoft.com/en-us/javascript/api/%40azure/storage-blob/blockblobclient)
- [Azure Blob staged blocks and commit list](https://learn.microsoft.com/en-us/rest/api/storageservices/put-block-list)
- [MDN `XMLHttpRequest.upload` progress](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload)
- [MDN files and upload progress](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
