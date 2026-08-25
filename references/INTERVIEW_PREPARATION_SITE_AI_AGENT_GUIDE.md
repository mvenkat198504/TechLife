# TechLife Pro — AI Agent Development Guide

## 1\. Purpose

Build a responsive interview-preparation website named **TechLife Pro**. The site will organize technical interview questions, detailed answers, code examples, scenario-based explanations, quizzes, bookmarks, and learning progress.

The initial application must be a static site that can be hosted free through GitHub Pages. Do not build a backend, database, authentication system, or admin portal in the first release.

This document is designed to be given to GitHub Copilot, ChatGPT Codex, or another AI coding agent as the implementation specification.

\---

## 2\. Product Goals

The application must help experienced software developers prepare for interviews in these areas:

* C#
* ASP.NET Core
* Entity Framework Core
* SQL Server
* Azure
* Azure DevOps
* Microservices
* Design Patterns
* System Design
* React
* Angular
* JavaScript
* Scenario-based interview questions

The content must be easy to read, search, expand, bookmark, and maintain.

\---

## 3\. Technology Stack

Use the following stack:

|Area|Technology|
|-|-|
|Framework|React with JavaScript|
|Build tool|Vite|
|Routing|React Router with `HashRouter`|
|UI|Bootstrap 5 and custom CSS|
|Icons|Bootstrap Icons|
|Content|Markdown files with YAML front matter|
|Code highlighting|`react-syntax-highlighter`|
|Client storage|Browser `localStorage`|
|Testing|Vitest and React Testing Library|
|Code quality|ESLint and JavaScript strict mode|
|Deployment|GitHub Actions and GitHub Pages|

### Important constraints

* Do not use a .NET backend for the MVP.
* Do not use a database for the MVP.
* Do not use paid UI libraries.
* Do not add authentication during the MVP.
* Do not place secrets or API keys in the repository.
* The application must work after refreshing a GitHub Pages URL.
* The application must be usable on desktop, tablet, and mobile.

\---

## 4\. MVP Features

### 4.1 Navigation

* Sticky top navigation bar.
* Product name and logo: **TechLife Pro**.
* Desktop dropdown menus for major categories.
* Collapsible mobile navigation.
* Left sidebar for topics within the selected category.
* Breadcrumb navigation on content pages.
* Previous and Next question buttons.

### 4.2 Home page

The home page must include:

* Welcome banner.
* Global search box.
* Category cards.
* Total question count.
* Recently viewed questions.
* Bookmarked questions count.
* Completed questions count.
* Quick links to quiz and scenario-based questions.

### 4.3 Question page

Each question page must support:

* Question title.
* Category and subcategory.
* Difficulty: Basic, Intermediate, Experienced, or Architect.
* Short interview answer.
* Detailed explanation.
* Real-project scenario.
* Code example with syntax highlighting.
* Best practices.
* Common mistakes.
* Follow-up interview questions.
* Interview tip.
* Bookmark button.
* Mark as completed button.
* Copy-code button.
* Previous and Next navigation.

### 4.4 Search and filtering

Users must be able to search using:

* Question title.
* Answer text.
* Category.
* Tags.

Filters must include:

* Category.
* Difficulty.
* Completed/not completed.
* Bookmarked/not bookmarked.

Search must be case-insensitive and run completely in the browser.

### 4.5 Bookmarks and progress

Store these items in `localStorage`:

* Bookmarked question IDs.
* Completed question IDs.
* Recently viewed question IDs.
* Theme preference.
* Quiz results.

Use versioned keys such as:

```text
techlife.bookmarks.v1
techlife.completed.v1
techlife.recent.v1
techlife.theme.v1
techlife.quiz-results.v1
```

The application must handle missing or invalid stored data without crashing.

### 4.6 Theme

* Provide light and dark themes.
* Default to the operating-system theme on first use.
* Save the user's selection.
* Maintain sufficient text contrast in both themes.

### 4.7 Quiz

* Select category and difficulty.
* Allow 5, 10, or 20 questions.
* Display one question at a time.
* Show four answer options.
* Show final score and answer review.
* Store the latest results locally.
* Do not reveal the correct answer until the user submits an answer.

\---

## 5\. Recommended Application Routes

Use `HashRouter` so routing works reliably on GitHub Pages.

|Route|Purpose|
|-|-|
|`#/`|Home page|
|`#/category/:categorySlug`|Questions for one category|
|`#/question/:questionSlug`|Question details|
|`#/search`|Search results|
|`#/bookmarks`|Bookmarked questions|
|`#/progress`|Completed topics and progress|
|`#/quiz`|Quiz configuration|
|`#/quiz/result`|Latest quiz result|
|`#/about`|About the website|
|`#/\*`|Not-found page|

\---

## 6\. Suggested Folder Structure

```text
techplife/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ScrollToTop.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNavigation.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── questions/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── QuestionContent.tsx
│   │   │   ├── QuestionFilters.tsx
│   │   │   └── QuestionNavigation.tsx
│   │   └── quiz/
│   │       ├── QuizQuestion.tsx
│   │       ├── QuizSetup.tsx
│   │       └── QuizSummary.tsx
│   ├── content/
│   │   ├── categories.ts
│   │   ├── questions/
│   │   │   ├── csharp/
│   │   │   ├── aspnet-core/
│   │   │   ├── ef-core/
│   │   │   ├── sql-server/
│   │   │   ├── azure/
│   │   │   ├── devops/
│   │   │   ├── react/
│   │   │   ├── angular/
│   │   │   └── javascript/
│   │   └── quizzes.ts
│   ├── context/
│   │   ├── ProgressContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useProgress.ts
│   │   └── useQuestionSearch.ts
│   ├── models/
│   │   ├── category.ts
│   │   ├── question.ts
│   │   └── quiz.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── BookmarksPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ProgressPage.tsx
│   │   ├── QuestionPage.tsx
│   │   ├── QuizPage.tsx
│   │   └── SearchPage.tsx
│   ├── services/
│   │   ├── contentService.ts
│   │   └── storageService.ts
│   ├── styles/
│   │   ├── components.css
│   │   ├── theme.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── search.ts
│   │   └── slug.ts
│   ├── App.tsx
│   └── main.tsx
├── .editorconfig
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

\---

## 7\. Data Models

Create `src/models/question.ts`:

```ts
export type Difficulty =
  | "Basic"
  | "Intermediate"
  | "Experienced"
  | "Architect";

export interface CodeExample {
  language: string;
  title?: string;
  code: string;
  explanation?: string;
}

export interface InterviewQuestion {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  subcategory: string;
  difficulty: Difficulty;
  tags: string\[];
  shortAnswer: string;
  detailedAnswer: string\[];
  realProjectScenario?: string;
  codeExamples?: CodeExample\[];
  bestPractices?: string\[];
  commonMistakes?: string\[];
  followUpQuestions?: string\[];
  interviewTip?: string;
  updatedAt: string;
}
```

Create `src/models/category.ts`:

```ts
export interface InterviewCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
}
```

Create `src/models/quiz.ts`:

```ts
export interface QuizQuestion {
  id: string;
  categoryId: string;
  difficulty: string;
  question: string;
  options: string\[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizResult {
  attemptedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  selectedAnswers: Record<string, number>;
}
```

\---

## 8\. Example Interview Content

Use this format for every question:

```ts
import type { InterviewQuestion } from "../../models/question";

export const aspNetCoreQuestions: InterviewQuestion\[] = \[
  {
    id: "aspnet-middleware-001",
    slug: "middleware-and-custom-middleware",
    title: "What is middleware in ASP.NET Core?",
    categoryId: "aspnet-core",
    subcategory: "Request Pipeline",
    difficulty: "Experienced",
    tags: \["middleware", "pipeline", "aspnet-core"],
    shortAnswer:
      "Middleware is a component in the ASP.NET Core request pipeline that can inspect, modify, handle, or pass an HTTP request to the next component.",
    detailedAnswer: \[
      "ASP.NET Core processes an HTTP request through an ordered middleware pipeline.",
      "Each middleware can run logic before and after the next component.",
      "A middleware can short-circuit the pipeline by producing a response without calling the next component.",
      "Ordering is important because authentication, authorization, routing, exception handling, and endpoint execution depend on their position."
    ],
    realProjectScenario:
      "A custom correlation-ID middleware can read or generate a correlation ID, attach it to logs and response headers, and make production troubleshooting easier.",
    codeExamples: \[
      {
        language: "csharp",
        title: "Custom correlation middleware",
        code: `public sealed class CorrelationIdMiddleware
{
    private readonly RequestDelegate \_next;

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        \_next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        const string header = "X-Correlation-ID";
        var correlationId = context.Request.Headers\[header].FirstOrDefault()
                            ?? Guid.NewGuid().ToString();

        context.Response.Headers\[header] = correlationId;
        await \_next(context);
    }
}`
      }
    ],
    bestPractices: \[
      "Keep middleware focused on one responsibility.",
      "Register exception handling near the beginning of the pipeline.",
      "Avoid blocking calls inside middleware."
    ],
    commonMistakes: \[
      "Registering authentication after authorization.",
      "Calling the next middleware after the response has already been completed.",
      "Putting business logic directly in middleware."
    ],
    followUpQuestions: \[
      "What is middleware short-circuiting?",
      "How is middleware different from an MVC filter?",
      "Why is middleware order important?"
    ],
    interviewTip:
      "Explain the request pipeline first, and then provide a production example such as exception handling, logging, or correlation IDs.",
    updatedAt: "2026-08-25"
  }
];
```

Never use personal names, real email addresses, credentials, connection strings, or proprietary project data in sample content.

\---

## 8A. Content Upload and Management Requirements

### 8A.1 How content is added in the static version

GitHub Pages cannot receive uploaded files or save changes because it hosts only the built static application. In the MVP, authors add or update content through the GitHub repository:

1. Create a Markdown question file in the appropriate category folder.
2. Add related images under `public/content-images/<category>/<question-slug>/`.
3. Add optional external resources and YouTube video metadata to the Markdown front matter.
4. Preview the site locally.
5. Run content validation, tests, and the production build.
6. Commit and push the changes, preferably through a pull request.
7. GitHub Actions rebuilds and publishes the site.

Do not implement an Upload button in the public static site. A real browser-based content upload or admin screen requires a secured backend, authentication, authorization, persistent storage, file validation, and an audit trail. Treat that as a future phase.

### 8A.2 Question Markdown location

Store one interview question per Markdown file:

```text
src/content/questions/<category-slug>/<question-slug>.md
```

Example:

```text
src/content/questions/aspnet-core/middleware-and-custom-middleware.md
```

Use lowercase kebab-case for category folders, filenames, question slugs, and image folders.

### 8A.3 Required Markdown format

Every Markdown file must contain YAML front matter followed by the question content:

````markdown
---
id: aspnet-middleware-001
slug: middleware-and-custom-middleware
title: What is middleware in ASP.NET Core?
categoryId: aspnet-core
subcategory: Request Pipeline
difficulty: Experienced
tags:
  - middleware
  - request-pipeline
  - aspnet-core
summary: Middleware is a component in the ASP.NET Core HTTP request pipeline.
updatedAt: 2026-08-25
author: TechLife Pro Team
status: published
thumbnail: /content-images/aspnet-core/middleware-and-custom-middleware/pipeline-overview.webp
videos:
  - title: ASP.NET Core middleware overview
    provider: youtube
    videoId: YOUR\_VIDEO\_ID
    url: https://www.youtube.com/watch?v=YOUR\_VIDEO\_ID
    startSeconds: 0
    description: Optional supporting explanation of the request pipeline.
resources:
  - title: Official ASP.NET Core middleware documentation
    url: https://learn.microsoft.com/aspnet/core/fundamentals/middleware/
    type: documentation
---

# What is middleware in ASP.NET Core?

## Interview-ready answer

Middleware is a component in the ASP.NET Core request pipeline that can inspect,
modify, handle, or pass an HTTP request to the next component.

## Detailed explanation

Explain the request pipeline, ordering, short-circuiting, and before/after logic.

## Architecture image

!\[ASP.NET Core middleware request pipeline](/content-images/aspnet-core/middleware-and-custom-middleware/pipeline-overview.webp)

## Code example

```csharp
public sealed class CorrelationIdMiddleware
{
    private readonly RequestDelegate \_next;

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        \_next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await \_next(context);
    }
}
```

## Real-project scenario

Describe how correlation IDs, exception handling, or request logging are used in production.

## Best practices

- Keep middleware focused on one responsibility.
- Avoid synchronous blocking calls.
- Register middleware in the correct order.

## Common mistakes

- Registering authorization before authentication.
- Adding business logic directly to middleware.

## Follow-up questions

1. What is middleware short-circuiting?
2. How is middleware different from an MVC filter?
3. Why is middleware order important?

## Interview tip

Explain the pipeline first and then provide one production example.
````

### 8A.4 Front-matter fields

|Field|Required|Rule|
|-|-|-|
|`id`|Yes|Globally unique and never changed after publication|
|`slug`|Yes|Unique, lowercase, URL-safe kebab-case|
|`title`|Yes|Clear interview question|
|`categoryId`|Yes|Must match an existing category|
|`subcategory`|Yes|Display grouping within a category|
|`difficulty`|Yes|Basic, Intermediate, Experienced, or Architect|
|`tags`|Yes|At least one normalized tag|
|`summary`|Yes|Short search-result description|
|`updatedAt`|Yes|ISO date in `YYYY-MM-DD` format|
|`author`|No|Content author or team name|
|`status`|Yes|`draft` or `published`|
|`thumbnail`|No|Site-root-relative image path|
|`videos`|No|Zero or more verified video records|
|`resources`|No|Zero or more trusted external references|

The production build must include only questions with `status: published`. Draft content may appear only in local development when a draft-preview flag is enabled.

### 8A.5 Image requirements

Store question images under:

```text
public/content-images/<category-slug>/<question-slug>/
```

Example:

```text
public/content-images/aspnet-core/middleware-and-custom-middleware/pipeline-overview.webp
```

Rules:

* Prefer WebP for screenshots and diagrams; use SVG for simple original vector diagrams.
* Use PNG only when transparency or screenshot fidelity requires it.
* Use lowercase kebab-case filenames.
* Keep an individual image below 500 KB where practical.
* Resize large screenshots before committing them.
* Provide meaningful Markdown alternative text for every informative image.
* Decorative images must use empty alternative text.
* Do not link to local Windows paths such as `C:\\images\\diagram.png`.
* Do not embed base64 image data in question files.
* Do not hotlink random external images.
* Use only original, licensed, or properly attributed images.
* Never publish screenshots containing tokens, passwords, connection strings, personal data, internal hostnames, or proprietary customer information.

Because the application is deployed below a GitHub repository base path, create an image URL helper that prefixes `import.meta.env.BASE\_URL` for runtime image sources. Markdown image rendering must also resolve site-root-relative content paths against `import.meta.env.BASE\_URL` so images work locally and on GitHub Pages.

Example helper:

```ts
export function getPublicAssetUrl(path: string): string {
  const cleanPath = path.replace(/^\\/+/, "");
  return `${import.meta.env.BASE\_URL}${cleanPath}`;
}
```

### 8A.6 YouTube video requirements

Authors may add an optional YouTube video to a question by storing the full URL and the extracted `videoId` in front matter. Do not paste arbitrary iframe HTML into Markdown.

Supported URL formats:

```text
https://www.youtube.com/watch?v=VIDEO\_ID
https://youtu.be/VIDEO\_ID
```

The application must:

* Validate that the hostname is `youtube.com`, `www.youtube.com`, `m.youtube.com`, or `youtu.be`.
* Validate the extracted video ID before rendering.
* Render the title, description, thumbnail, and a clear **Watch video** action.
* Open normal video links in a new tab using `rel="noopener noreferrer"`.
* Use a responsive 16:9 container when embedding.
* Use `https://www.youtube-nocookie.com/embed/<videoId>` for privacy-enhanced embeds.
* Add `loading="lazy"` to the iframe.
* Give every iframe a meaningful `title` attribute.
* Add `allowFullScreen`.
* Never render raw user-provided HTML.
* Show a graceful fallback link if embedding is unavailable.
* Prefer click-to-load video embeds so YouTube resources are not loaded until the user chooses to play the video.

Example component interface:

```ts
export interface ContentVideo {
  title: string;
  provider: "youtube";
  videoId: string;
  url: string;
  startSeconds?: number;
  description?: string;
}
```

Example privacy-enhanced embed URL builder:

```ts
export function getYouTubeEmbedUrl(video: ContentVideo): string {
  const start = video.startSeconds ? `?start=${video.startSeconds}` : "";
  return `https://www.youtube-nocookie.com/embed/${video.videoId}${start}`;
}
```

Only link or embed videos that are relevant, publicly available, and permitted by the video owner. Display external videos as supplementary material; the written interview answer must remain complete without requiring the user to watch a video.

### 8A.7 External resource links

Optional external links may point to official documentation, standards, research papers, or other credible learning material.

Rules:

* Allow only `https://` URLs.
* Validate URLs during the build.
* Prefer official documentation.
* Clearly display the source title and resource type.
* Open external links in a new tab with `rel="noopener noreferrer"`.
* Do not make external content necessary to understand the main answer.
* Periodically check links for broken or redirected URLs.

### 8A.8 Content loading and build processing

Use Vite `import.meta.glob` to discover Markdown files at build time. Parse YAML front matter with `gray-matter` and render Markdown with `react-markdown`, `remark-gfm`, and an approved syntax-highlighting solution.

Suggested dependencies:

```bash
npm install react-markdown remark-gfm gray-matter
```

The content loader must:

* Discover all question Markdown files.
* Validate front matter before exposing content.
* Exclude drafts from production.
* Sort questions deterministically.
* Detect duplicate IDs and slugs.
* Return a typed `InterviewQuestion` model.
* Generate category counts and search data.
* Produce a clear build error that includes the invalid filename and field.

Do not enable raw HTML rendering in Markdown. If HTML support is introduced later, sanitize it with an allowlist before rendering.

### 8A.9 Content validation

Add a validation script named `npm run validate:content`. It must fail when:

* A required field is missing.
* An ID or slug is duplicated.
* A category does not exist.
* Difficulty or status contains an unsupported value.
* A referenced local image does not exist.
* An image exceeds the configured maximum size.
* A YouTube URL or video ID is invalid.
* An external resource uses an unsafe protocol.
* A published question has no interview-ready answer.

Run this command before tests and build in GitHub Actions:

```bash
npm run validate:content
```

### 8A.10 Recommended author workflow

```bash
git checkout -b content/add-aspnet-middleware

# Add the Markdown file and related images.

npm run validate:content
npm run dev
npm run lint
npm run test -- --run
npm run build

git add src/content public/content-images
git commit -m "Add ASP.NET Core middleware interview content"
git push -u origin content/add-aspnet-middleware
```

Review the content and preview before merging the pull request into `main`.

### 8A.11 Future admin upload capability

If a browser-based admin portal is required later, build it as a separate secured phase with:

* ASP.NET Core API.
* Authentication and role-based authorization.
* Draft, review, approve, publish, and archive workflow.
* Database storage for structured question metadata.
* Object storage for images.
* MIME type, extension, file-signature, dimension, and malware validation.
* Server-side image resizing and safe filename generation.
* YouTube and external-URL allowlist validation.
* Audit history and content versioning.
* Preview before publication.
* Rate limiting and upload-size limits.

Do not directly write uploaded files into the deployed GitHub Pages site at runtime.

\---

## 9\. UI and Design Requirements

### 9.1 Visual style

* Clean professional learning-platform appearance.
* Primary color: indigo/purple.
* Neutral page background.
* White content cards in light mode.
* Dark charcoal content cards in dark mode.
* Rounded corners and subtle shadows.
* Clear typography and comfortable line spacing.
* Code blocks must use a dark background in both themes.

### 9.2 Desktop layout

* Sticky header at the top.
* Sidebar width between 260 and 300 pixels.
* Main content centered with a readable maximum width.
* Question content should not become excessively wide on large screens.

### 9.3 Mobile layout

* Convert navigation into an off-canvas menu.
* Collapse the sidebar.
* Ensure code blocks scroll horizontally.
* Make action buttons large enough for touch.
* Do not allow horizontal page scrolling.

### 9.4 Accessibility

* Use semantic HTML.
* All interactive controls must be keyboard accessible.
* Add visible focus states.
* Add accessible names to icon-only buttons.
* Use `aria-expanded` for dropdowns and collapsible panels.
* Do not communicate state using color alone.

\---

## 10\. GitHub Pages Configuration

### 10.1 Vite configuration

Configure `vite.config.ts` using the repository name:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: \[react()],
  base: "/techlife-pro/"
});
```

If the repository is named `<username>.github.io`, use `base: "/"`.

### 10.2 GitHub Actions workflow

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy TechLife Pro to GitHub Pages

on:
  push:
    branches: \[main]
  workflow\_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Validate interview content
        run: npm run validate:content

      - name: Run tests
        run: npm run test -- --run

      - name: Build
        run: npm run build

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      - name: Deploy Pages
        uses: actions/deploy-pages@v4
```

In the repository, open **Settings → Pages → Build and deployment** and select **GitHub Actions**.

\---

## 11\. AI Agent Operating Instructions

The AI coding agent must follow these rules:

1. Inspect the repository before changing files.
2. Do not overwrite working user code without reviewing it.
3. Implement only one phase at a time.
4. Keep components small and reusable.
5. Use JavaScript strict typing and avoid `any`.
6. Do not duplicate navigation or question data.
7. Use one shared source for categories and navigation.
8. Do not hardcode repository URLs in multiple files.
9. Do not introduce a backend during the MVP.
10. Do not add a dependency when a small native solution is sufficient.
11. Run lint, tests, and production build after every phase.
12. Fix all JavaScript and build errors before completing a phase.
13. Update `README.md` when setup or behavior changes.
14. Summarize changed files and verification results after each phase.
15. Ask before making a major architecture change.

### Definition of done for every phase

* Code compiles.
* Tests pass.
* ESLint passes.
* Production build succeeds.
* No browser console errors appear.
* Desktop and mobile layouts work.
* Existing behavior is not broken.
* README instructions remain accurate.

\---

## 12\. Phased Implementation Plan

### Phase 1 — Project foundation

Tasks:

* Create the React JavaScript Vite project.
* Install approved dependencies.
* Configure Bootstrap and global CSS.
* Configure `HashRouter`.
* Create the layout, header, sidebar, footer, and not-found page.
* Add category definitions.
* Add responsive light/dark theme.
* Add Error Boundary.

Acceptance criteria:

* The application starts locally.
* Header and sidebar display correctly.
* Mobile navigation works.
* Theme selection persists after refresh.
* Unknown routes show the not-found page.

### Phase 2 — Interview content

Tasks:

* Add strongly typed question models.
* Add the Markdown content loader and content service.
* Add front-matter, image, external-resource, and YouTube validation.
* Add `npm run validate:content`.
* Add at least three Markdown questions each for C#, ASP.NET Core, EF Core, and SQL Server.
* Build category, question list, and question detail pages.
* Add syntax-highlighted code blocks and copy button.
* Add responsive images and privacy-enhanced click-to-load YouTube support.
* Add Previous and Next navigation.

Acceptance criteria:

* A user can browse categories and open questions.
* Direct question links work.
* Code is formatted and copyable.
* Images work locally and from the GitHub Pages repository base path.
* Valid YouTube resources render safely, and invalid URLs are rejected.
* No duplicate slugs or IDs exist.
* Content validation succeeds.

### Phase 3 — Search, bookmarks, and progress

Tasks:

* Add browser-based search.
* Add category and difficulty filters.
* Add bookmark and completed actions.
* Add recently viewed questions.
* Store all progress safely in `localStorage`.
* Add bookmark and progress pages.

Acceptance criteria:

* Search returns matches from titles, answers, categories, and tags.
* Filters combine correctly.
* Bookmark and completed states persist after browser refresh.
* Invalid stored data does not crash the application.

### Phase 4 — Quiz

Tasks:

* Add quiz models and sample quiz data.
* Add category, difficulty, and question-count setup.
* Display one question at a time.
* Calculate results.
* Show correct answers and explanations after completion.
* Save recent results locally.

Acceptance criteria:

* A quiz can be completed from start to finish.
* Score calculation is correct.
* Users cannot accidentally reveal answers before submitting.
* Results remain available after refresh.

### Phase 5 — Testing and GitHub Pages

Tasks:

* Add unit tests for search, storage, progress, and quiz scoring.
* Add component tests for essential pages.
* Set the correct Vite `base` value.
* Add the GitHub Pages workflow.
* Update the README with local and deployment instructions.

Acceptance criteria:

* `npm run lint` passes.
* `npm run test -- --run` passes.
* `npm run build` succeeds.
* The GitHub Actions workflow succeeds.
* The deployed site loads CSS, JavaScript, icons, and routes correctly.

\---

## 13\. Copy-Ready Master Prompt for GitHub Copilot

Copy the following prompt into GitHub Copilot Agent mode:

```text
Read INTERVIEW\_PREPARATION\_SITE\_AI\_AGENT\_GUIDE.md completely before making changes.

Implement only Phase 1 — Project Foundation.

Requirements:
- Use React, JavaScript, Vite, Bootstrap 5, Bootstrap Icons and React Router.
- Use HashRouter for GitHub Pages compatibility.
- Create a responsive sticky header, desktop sidebar, mobile off-canvas navigation, app layout, home page, about page and not-found page.
- Add strongly typed category data for C#, ASP.NET Core, EF Core, SQL Server, Azure, Azure DevOps, Microservices, React, Angular and JavaScript.
- Add light/dark theme with system preference as the initial value and localStorage persistence.
- Add an Error Boundary.
- Do not create a backend, database, authentication or quiz implementation in this phase.
- Use JavaScript .
- Use accessible semantic HTML and visible keyboard focus states.
- Do not overwrite unrelated existing code.

Before coding, inspect the repository and provide a short implementation plan.
After coding, run lint, tests if available, and production build. Fix all errors.
Finally summarize the changed files, validation commands and any remaining Phase 1 items.
```

\---

## 14\. Follow-up Prompts

### Prompt for Phase 2

```text
Read INTERVIEW\_PREPARATION\_SITE\_AI\_AGENT\_GUIDE.md and inspect the current repository.
Verify that Phase 1 is complete, then implement only Phase 2 — Interview Content.

Create the typed content model, Markdown loader and content service. Add at least three high-quality experienced-level Markdown questions each for C#, ASP.NET Core, EF Core and SQL Server. Implement category pages, question cards, question detail pages, breadcrumb navigation, code syntax highlighting, copy-code action and Previous/Next navigation.

Implement the image path helper, responsive Markdown images, safe external resources and privacy-enhanced click-to-load YouTube videos exactly as specified in Section 8A. Do not render raw HTML from Markdown. Add content validation for required fields, duplicate IDs/slugs, categories, image existence and size, YouTube metadata and HTTPS resource URLs. Do not implement bookmarks, quiz, backend, database or authentication in this phase.

Run content validation, lint, tests and production build. Fix all errors and summarize the result.
```

### Prompt for Phase 3

```text
Read INTERVIEW\_PREPARATION\_SITE\_AI\_AGENT\_GUIDE.md and inspect the completed Phase 1 and Phase 2 code. Implement only Phase 3 — Search, Bookmarks and Progress.

Add case-insensitive client-side search over question title, short answer, detailed answer, category and tags. Add category and difficulty filters. Implement bookmarks, completed questions and recently viewed questions using versioned localStorage keys. Add dedicated search, bookmarks and progress pages.

Create safe storage utilities that recover from malformed JSON. Add tests for search, combined filters and localStorage behavior. Do not add a backend, database or authentication.

Run lint, tests and production build. Fix all errors and summarize the result.
```

### Prompt for Phase 4

```text
Read INTERVIEW\_PREPARATION\_SITE\_AI\_AGENT\_GUIDE.md and inspect the repository. Implement only Phase 4 — Quiz.

Add typed quiz data and a quiz setup page with category, difficulty and 5/10/20 question options. Present one question at a time with four answer options. Do not show the correct answer before submission. Add final score, answer review, explanations and recent-result persistence in localStorage.

Add unit tests for scoring and result persistence. Do not add a backend, database or authentication.

Run lint, tests and production build. Fix all errors and summarize the result.
```

### Prompt for Phase 5

```text
Read INTERVIEW\_PREPARATION\_SITE\_AI\_AGENT\_GUIDE.md and inspect the complete application. Implement only Phase 5 — Testing and GitHub Pages Deployment.

Add or complete tests for search, filters, storage, progress and quiz scoring. Configure the Vite base path for the repository named techlife-pro. Add a GitHub Actions Pages workflow that installs dependencies using npm ci, runs tests, builds the application, uploads the dist directory and deploys it to GitHub Pages.

Update README.md with prerequisites, local setup, available scripts, content contribution instructions, GitHub Pages settings and troubleshooting for missing assets or route refresh errors.

Run lint, tests and production build. Fix all errors. Review the workflow YAML for correct permissions and summarize the result.
```

\---

## 15\. Content Generation Prompt

Use this prompt when adding interview questions:

```text
Add 10 experienced-level \[CATEGORY] interview questions to the existing techlife Pro content model.

For every question provide:
- A unique ID and URL-safe slug.
- Category, subcategory, difficulty and tags.
- A concise interview-ready answer.
- A detailed technical explanation.
- A realistic enterprise project scenario.
- A compilable code or SQL example where appropriate.
- Best practices.
- Common mistakes.
- Three follow-up questions.
- One interview tip.

Requirements:
- Follow the existing InterviewQuestion JavaScript interface exactly.
- Do not duplicate existing questions, IDs or slugs.
- Use current secure development practices.
- Do not include real credentials, personal information or proprietary code.
- Keep answers suitable for a senior developer or technical lead interview.
- Run formatting, lint and production build after adding the content.
```

\---

## 16\. Testing Checklist

### Functional testing

* \[ ] Home page loads.
* \[ ] Every category opens.
* \[ ] Every question opens using its unique URL.
* \[ ] Breadcrumb links work.
* \[ ] Previous and Next buttons work.
* \[ ] Search finds title, answer, and tag matches.
* \[ ] Multiple filters work together.
* \[ ] Bookmark state persists.
* \[ ] Completed state persists.
* \[ ] Recently viewed questions update.
* \[ ] Theme persists.
* \[ ] Quiz score is correct.
* \[ ] Invalid routes display the not-found page.

### Responsive testing

* \[ ] 360-pixel mobile layout.
* \[ ] 768-pixel tablet layout.
* \[ ] 1366-pixel desktop layout.
* \[ ] Mobile menu opens and closes.
* \[ ] Code blocks scroll without breaking the layout.
* \[ ] No unwanted horizontal page scroll exists.

### Accessibility testing

* \[ ] Keyboard navigation works.
* \[ ] Focus states are visible.
* \[ ] Buttons have meaningful accessible names.
* \[ ] Form fields have labels.
* \[ ] Light and dark themes have readable contrast.

### Deployment testing

* \[ ] GitHub Actions completes successfully.
* \[ ] The deployed home page loads.
* \[ ] CSS and JavaScript assets load.
* \[ ] Direct hash routes load after refresh.
* \[ ] No secrets are committed.
* \[ ] Browser console has no errors.

\---

## 17\. Future Enhancements

Implement these only after the static MVP is stable:

* Git-based content preview workflow for editors.
* Full-text search indexing.
* Spaced-repetition flashcards.
* Interview timer and mock-interview mode.
* Company-specific question collections.
* Export selected questions to PDF.
* Progressive Web App and offline support.
* ASP.NET Core API.
* PostgreSQL database.
* User authentication and cloud progress synchronization.
* Admin portal for managing questions.
* AI-generated practice questions with server-side API protection.

Never expose an AI provider key from a React application. Any future AI integration must call a secured backend endpoint.

\---

## 18\. Local Setup Commands

```bash
npm create vite@latest techlife-pro -- --template react-ts
cd **TechLife**-pro
npm install
npm install react-router-dom bootstrap bootstrap-icons
npm install react-syntax-highlighter
npm install react-markdown remark-gfm gray-matter
npm install -D @types/react-syntax-highlighter vitest jsdom
npm run dev
```

Before pushing changes:

```bash
npm run lint
npm run validate:content
npm run test -- --run
npm run build
```

Git commands:

```bash
git init
git add .
git commit -m "Create **TechLife** Pro interview preparation site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/**TechLife**-pro.git
git push -u origin main
```

\---

## 19\. Final Delivery Requirements

The completed MVP must contain:

* Working React JavaScript source code.
* Responsive Bootstrap UI.
* Interview question content.
* Search and filtering.
* Bookmarks and progress.
* Quiz functionality.
* Light/dark theme.
* Automated tests.
* GitHub Pages deployment workflow.
* Complete README documentation.
* No build, lint, test, or browser-console errors.

The result should feel like a professional interview-preparation product, not a collection of disconnected HTML pages.

