---
title: "Sample Markdown Guide"
categoryId: "javascript"
subcategory: "Fundamentals"
difficulty: "Medium"
tags: ["markdown", "design", "ui", "parser"]
status: "published"
---

## Introduction

This is a sample markdown file to test how your page handles different text styles.

You can use **bold text**, __strong emphasis__, and `inline code` in the same paragraph.

A normal paragraph can also contain a [link](https://example.com) and a blockquote like this:

> This is an important note.  
> You can style this block as a callout or warning.

---

## Heading styles

### Subheading example

#### Smaller heading

You can use multiple heading levels to create structure in the page.

---

## Bullet list

- First item
- Second item
- Third item with **bold** text
- Fourth item with `code`

---

## Ordered list

1. Step one
2. Step two
3. Step three
4. Final step with inline `value`

---

## Table example

| Feature | Status | Notes |
| --- | --- | --- |
| Bold text | Yes | `**text**` |
| Inline code | Yes | `` `code` `` |
| Links | Yes | `[text](url)` |
| Images | Yes | `![alt](image-url)` |
| Lists | Yes | Bullet and numbered |

---

## Before / After style

### Before

```js
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### After

```ts
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Code blocks

### JavaScript example

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Developer"));

