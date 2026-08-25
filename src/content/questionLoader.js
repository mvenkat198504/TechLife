import { slugify } from '../utils/slugify';

const questionFiles = import.meta.glob('./questions/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const parseValue = (value) => {
  const trimmedValue = value.trim();

  if (trimmedValue === '[]') {
    return [];
  }

  if ((trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
      (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
};

const parseQuestion = (source) => {
  const normalizedSource = source.replace(/\r\n/g, '\n');
  const frontMatterMatch = normalizedSource.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

  if (!frontMatterMatch) {
    return null;
  }

  const metadata = {};
  let activeListKey = null;

  frontMatterMatch[1].split('\n').forEach((line) => {
    const listItemMatch = line.match(/^\s*-\s+(.+)$/);
    const keyValueMatch = line.match(/^([\w]+):\s*(.*)$/);

    if (listItemMatch && activeListKey) {
      metadata[activeListKey].push(listItemMatch[1].trim());
    } else if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      const parsedValue = parseValue(value);
      metadata[key] = Array.isArray(parsedValue) ? parsedValue : parsedValue;
      activeListKey = value.trim() === '' ? key : null;

      if (activeListKey) {
        metadata[activeListKey] = [];
      }
    }
  });

  return {
    ...metadata,
    content: frontMatterMatch[2].replace(/<!--[\s\S]*?-->/g, '').trim(),
  };
};

// A file can hold several questions; blocks are separated by a line containing only %%%
const parseQuestions = (source) =>
  source
    .replace(/\r\n/g, '\n')
    .split(/\n%%%\n/)
    .map(parseQuestion)
    .filter(Boolean);

export const questions = Object.values(questionFiles)
  .flatMap(parseQuestions)
  .filter((question) => question.status === 'published');

export const getQuestionsByCategory = (categoryId) =>
  questions.filter((question) => question.categoryId === categoryId);

export const getQuestionsByCategoryAndSubcategory = (categoryId, subcategorySlug) =>
  getQuestionsByCategory(categoryId).filter(
    (question) => slugify(question.subcategory) === subcategorySlug
  );

export const getSubcategoriesByCategory = (categoryId) => {
  const counts = new Map();

  getQuestionsByCategory(categoryId).forEach((question) => {
    const name = question.subcategory || 'General';
    counts.set(name, (counts.get(name) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};