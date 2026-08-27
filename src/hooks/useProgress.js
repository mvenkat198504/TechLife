import { useState, useCallback } from 'react';
import {
  getBookmarks,
  toggleBookmark,
  isBookmarked,
  getCompleted,
  toggleCompleted,
  isCompleted,
  getRecent,
  addToRecent,
} from '../utils/storageService';

/**
 * Hook for managing user progress: bookmarks, completed questions, and recent views
 * @returns {Object} Progress state and methods
 */
export const useProgress = () => {
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [completed, setCompleted] = useState(() => getCompleted());
  const [recent, setRecent] = useState(() => getRecent());

  // Toggle bookmark
  const handleToggleBookmark = useCallback((questionId) => {
    const newBookmarked = toggleBookmark(questionId);
    setBookmarks(getBookmarks());
    return newBookmarked;
  }, []);

  // Check if bookmarked
  const checkIsBookmarked = useCallback((questionId) => {
    return isBookmarked(questionId);
  }, []);

  // Toggle completed
  const handleToggleCompleted = useCallback((questionId) => {
    const newCompleted = toggleCompleted(questionId);
    setCompleted(getCompleted());
    return newCompleted;
  }, []);

  // Check if completed
  const checkIsCompleted = useCallback((questionId) => {
    return isCompleted(questionId);
  }, []);

  // Add to recent
  const handleAddToRecent = useCallback((questionId) => {
    addToRecent(questionId);
    setRecent(getRecent());
  }, []);

  return {
    bookmarks,
    completed,
    recent,
    toggleBookmark: handleToggleBookmark,
    isBookmarked: checkIsBookmarked,
    toggleCompleted: handleToggleCompleted,
    isCompleted: checkIsCompleted,
    addToRecent: handleAddToRecent,
  };
};
