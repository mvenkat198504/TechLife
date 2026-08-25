---
name: interview-prep-site-builder
description: Build, maintain, populate, test and deploy the TechPrep Pro React interview-preparation website. Use when working on interview categories, Markdown questions and answers, question images, YouTube resources, search, bookmarks, learning progress, quizzes, responsive UI, content validation, or GitHub Pages deployment.
---

# Interview Preparation Site Builder

Build and maintain the TechPrep Pro interview-preparation website.

## Start every task

1. Inspect the existing repository and current implementation.
2. Read `references/interview-preparation-site-specification.md`.
3. Identify the requested phase or feature.
4. List the files that need to be created or modified.
5. Preserve unrelated user code.

## Architecture

Use:

- React with JavaScript.
- Vite.
- Bootstrap 5 and custom CSS.
- React Router with `HashRouter`.
- Markdown question files with YAML front matter.
- Browser `localStorage` for bookmarks, progress and quiz history.
- GitHub Actions and GitHub Pages.

Do not introduce a backend, database or authentication unless the user
explicitly requests the future admin portal.

## Content workflow

Store questions under:

`src/content/questions/<category>/<question-slug>.md`

Store images under:

`public/content-images/<category>/<question-slug>/`

For every question:

- Generate a unique ID and slug.
- Validate required metadata.
- Preserve technically accurate content.
- Include an interview-ready answer.
- Include a detailed explanation.
- Include a real-project scenario.
- Include code examples when appropriate.
- Include best practices and common mistakes.
- Include follow-up questions and an interview tip.
- Validate image paths and YouTube metadata.
- Never expose credentials, personal information or proprietary data.

## Implementation workflow

1. Implement only the requested phase.
2. Keep components small and strongly typed.
3. Avoid `any` and duplicated content.
4. Resolve public assets using the Vite base path.
5. Do not render unsafe raw HTML.
6. Use privacy-enhanced, click-to-load YouTube embeds.
7. Update documentation when commands or behavior change.

## Validate

Run the available project commands:

```bash
npm run validate:content
npm run lint
npm run test -- --run
npm run build