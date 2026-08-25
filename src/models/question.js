// Difficulty levels for interview questions
export const DIFFICULTIES = {
  BASIC: 'Basic',
  INTERMEDIATE: 'Intermediate',
  EXPERIENCED: 'Experienced',
  ARCHITECT: 'Architect',
};

/**
 * @typedef {Object} CodeExample
 * @property {string} language - Programming language
 * @property {string} [title] - Optional title
 * @property {string} code - Code snippet
 * @property {string} [explanation] - Optional explanation
 */

/**
 * @typedef {Object} InterviewQuestion
 * @property {string} id - Unique identifier
 * @property {string} slug - URL-safe slug
 * @property {string} title - Question title
 * @property {string} categoryId - Category ID
 * @property {string} subcategory - Subcategory
 * @property {string} difficulty - Difficulty level
 * @property {string[]} tags - Tags
 * @property {string} shortAnswer - Short answer
 * @property {string[]} detailedAnswer - Detailed explanation
 * @property {string} [realProjectScenario] - Real-world scenario
 * @property {CodeExample[]} [codeExamples] - Code examples
 * @property {string[]} [bestPractices] - Best practices
 * @property {string[]} [commonMistakes] - Common mistakes
 * @property {string[]} [followUpQuestions] - Follow-up questions
 * @property {string} [interviewTip] - Interview tip
 * @property {string} updatedAt - Last updated date
 */

/**
 * @typedef {Object} InterviewCategory
 * @property {string} id - Unique identifier
 * @property {string} slug - URL-safe slug
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {string} icon - Bootstrap icon name
 * @property {number} displayOrder - Display order
 */

export {};
