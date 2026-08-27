/**
 * Storage service for managing bookmarks, completed questions, recent views and other user data
 * Uses versioned localStorage keys for safe upgrades
 */

const STORAGE_VERSION = 'v1';

const STORAGE_KEYS = {
  bookmarks: `techlife.bookmarks.${STORAGE_VERSION}`,
  completed: `techlife.completed.${STORAGE_VERSION}`,
  recent: `techlife.recent.${STORAGE_VERSION}`,
  theme: `techlife.theme.${STORAGE_VERSION}`,
  quizResults: `techlife.quiz-results.${STORAGE_VERSION}`,
};

/**
 * Safely read from localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist or is invalid
 * @returns {*} Stored value or default
 */
const safeRead = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from storage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely write to localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful, false otherwise
 */
const safeWrite = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to storage key "${key}":`, error);
    return false;
  }
};

/**
 * Get bookmarked question IDs
 * @returns {Array<string>} Array of bookmarked question IDs
 */
export const getBookmarks = () => {
  const bookmarks = safeRead(STORAGE_KEYS.bookmarks, []);
  return Array.isArray(bookmarks) ? bookmarks : [];
};

/**
 * Toggle bookmark for a question
 * @param {string} questionId - Question ID
 * @returns {boolean} True if bookmarked, false if unbookmarked
 */
export const toggleBookmark = (questionId) => {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(questionId);

  if (index === -1) {
    bookmarks.push(questionId);
  } else {
    bookmarks.splice(index, 1);
  }

  safeWrite(STORAGE_KEYS.bookmarks, bookmarks);
  return index === -1; // Return whether it's now bookmarked
};

/**
 * Check if a question is bookmarked
 * @param {string} questionId - Question ID
 * @returns {boolean} True if bookmarked
 */
export const isBookmarked = (questionId) => {
  return getBookmarks().includes(questionId);
};

/**
 * Get completed question IDs
 * @returns {Array<string>} Array of completed question IDs
 */
export const getCompleted = () => {
  const completed = safeRead(STORAGE_KEYS.completed, []);
  return Array.isArray(completed) ? completed : [];
};

/**
 * Toggle completed status for a question
 * @param {string} questionId - Question ID
 * @returns {boolean} True if marked as completed, false if unmarked
 */
export const toggleCompleted = (questionId) => {
  const completed = getCompleted();
  const index = completed.indexOf(questionId);

  if (index === -1) {
    completed.push(questionId);
  } else {
    completed.splice(index, 1);
  }

  safeWrite(STORAGE_KEYS.completed, completed);
  return index === -1; // Return whether it's now completed
};

/**
 * Check if a question is marked as completed
 * @param {string} questionId - Question ID
 * @returns {boolean} True if completed
 */
export const isCompleted = (questionId) => {
  return getCompleted().includes(questionId);
};

/**
 * Get recently viewed question IDs (most recent first)
 * @returns {Array<string>} Array of recently viewed question IDs
 */
export const getRecent = () => {
  const recent = safeRead(STORAGE_KEYS.recent, []);
  return Array.isArray(recent) ? recent : [];
};

/**
 * Add a question to recently viewed
 * @param {string} questionId - Question ID
 * @param {number} maxItems - Maximum recent items to keep (default 20)
 */
export const addToRecent = (questionId, maxItems = 20) => {
  const recent = getRecent();
  
  // Remove if already exists
  const index = recent.indexOf(questionId);
  if (index !== -1) {
    recent.splice(index, 1);
  }

  // Add to beginning
  recent.unshift(questionId);

  // Keep only maxItems
  if (recent.length > maxItems) {
    recent.splice(maxItems);
  }

  safeWrite(STORAGE_KEYS.recent, recent);
};

/**
 * Get quiz results
 * @returns {Object|null} Latest quiz result or null
 */
export const getQuizResults = () => {
  return safeRead(STORAGE_KEYS.quizResults, null);
};

/**
 * Save quiz results
 * @param {Object} result - Quiz result object
 * @returns {boolean} True if successful
 */
export const saveQuizResults = (result) => {
  return safeWrite(STORAGE_KEYS.quizResults, result);
};

/**
 * Get theme preference
 * @returns {string|null} 'light' or 'dark' or null
 */
export const getTheme = () => {
  return safeRead(STORAGE_KEYS.theme, null);
};

/**
 * Save theme preference
 * @param {string} theme - 'light' or 'dark'
 * @returns {boolean} True if successful
 */
export const saveTheme = (theme) => {
  return safeWrite(STORAGE_KEYS.theme, theme);
};

/**
 * Clear all user data (useful for debugging or reset)
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Get storage statistics
 * @returns {Object} Statistics about stored data
 */
export const getStorageStats = () => {
  return {
    bookmarksCount: getBookmarks().length,
    completedCount: getCompleted().length,
    recentCount: getRecent().length,
    hasQuizResults: getQuizResults() !== null,
    theme: getTheme(),
  };
};
