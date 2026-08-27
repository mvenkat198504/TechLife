/**
 * Search service for filtering interview questions
 * Supports searching by title, short answer, detailed answer, category, and tags
 * Case-insensitive client-side search
 */

/**
 * Search questions by term across multiple fields
 * @param {Array} questions - Array of interview questions
 * @param {string} searchTerm - Search term (case-insensitive)
 * @returns {Array} Filtered questions
 */
export const searchQuestions = (questions, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return questions;
  }

  const term = searchTerm.toLowerCase().trim();

  return questions.filter((question) => {
    // Search in title
    if (question.title && question.title.toLowerCase().includes(term)) {
      return true;
    }

    // Search in short answer
    if (question.shortAnswer && question.shortAnswer.toLowerCase().includes(term)) {
      return true;
    }

    // Search in detailed answers
    if (question.detailedAnswer && Array.isArray(question.detailedAnswer)) {
      if (question.detailedAnswer.some((answer) => 
        answer && answer.toLowerCase().includes(term)
      )) {
        return true;
      }
    }

    // Search in category name
    if (question.categoryId && question.categoryId.toLowerCase().includes(term)) {
      return true;
    }

    // Search in tags
    if (question.tags && Array.isArray(question.tags)) {
      if (question.tags.some((tag) => tag.toLowerCase().includes(term))) {
        return true;
      }
    }

    // Search in subcategory
    if (question.subcategory && question.subcategory.toLowerCase().includes(term)) {
      return true;
    }

    return false;
  });
};

/**
 * Filter questions by category
 * @param {Array} questions - Array of interview questions
 * @param {string} categoryId - Category ID to filter by
 * @returns {Array} Filtered questions
 */
export const filterByCategory = (questions, categoryId) => {
  if (!categoryId) {
    return questions;
  }
  return questions.filter((question) => question.categoryId === categoryId);
};

/**
 * Filter questions by difficulty
 * @param {Array} questions - Array of interview questions
 * @param {string} difficulty - Difficulty level to filter by
 * @returns {Array} Filtered questions
 */
export const filterByDifficulty = (questions, difficulty) => {
  if (!difficulty) {
    return questions;
  }
  return questions.filter((question) => question.difficulty === difficulty);
};

/**
 * Filter questions by completion status
 * @param {Array} questions - Array of interview questions
 * @param {Array} completedIds - Array of completed question IDs
 * @param {boolean} isCompleted - True to show only completed, false for not completed
 * @returns {Array} Filtered questions
 */
export const filterByCompletion = (questions, completedIds, isCompleted) => {
  if (isCompleted === null || isCompleted === undefined) {
    return questions;
  }

  return questions.filter((question) => {
    const isQuestionCompleted = completedIds.includes(question.id);
    return isCompleted ? isQuestionCompleted : !isQuestionCompleted;
  });
};

/**
 * Filter questions by bookmark status
 * @param {Array} questions - Array of interview questions
 * @param {Array} bookmarkedIds - Array of bookmarked question IDs
 * @param {boolean} isBookmarked - True to show only bookmarked, false for not bookmarked
 * @returns {Array} Filtered questions
 */
export const filterByBookmark = (questions, bookmarkedIds, isBookmarked) => {
  if (isBookmarked === null || isBookmarked === undefined) {
    return questions;
  }

  return questions.filter((question) => {
    const isQuestionBookmarked = bookmarkedIds.includes(question.id);
    return isBookmarked ? isQuestionBookmarked : !isQuestionBookmarked;
  });
};

/**
 * Apply multiple filters to questions
 * @param {Array} questions - Array of interview questions
 * @param {Object} filters - Filter options
 * @param {string} filters.searchTerm - Search term
 * @param {string} filters.categoryId - Category ID
 * @param {string} filters.difficulty - Difficulty level
 * @param {boolean} filters.isCompleted - Show only completed (true), not completed (false), or all (null)
 * @param {boolean} filters.isBookmarked - Show only bookmarked (true), not bookmarked (false), or all (null)
 * @param {Array} filters.completedIds - Array of completed question IDs
 * @param {Array} filters.bookmarkedIds - Array of bookmarked question IDs
 * @returns {Array} Filtered questions
 */
export const applyFilters = (questions, filters = {}) => {
  let filtered = questions;

  if (filters.searchTerm) {
    filtered = searchQuestions(filtered, filters.searchTerm);
  }

  if (filters.categoryId) {
    filtered = filterByCategory(filtered, filters.categoryId);
  }

  if (filters.difficulty) {
    filtered = filterByDifficulty(filtered, filters.difficulty);
  }

  if (filters.isCompleted !== null && filters.isCompleted !== undefined) {
    filtered = filterByCompletion(filtered, filters.completedIds || [], filters.isCompleted);
  }

  if (filters.isBookmarked !== null && filters.isBookmarked !== undefined) {
    filtered = filterByBookmark(filtered, filters.bookmarkedIds || [], filters.isBookmarked);
  }

  return filtered;
};
