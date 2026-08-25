import { useState } from 'react';

/**
 * Hook to manage localStorage values with React state
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - Initial value
 * @returns {[T, (value: T) => void]} - Current value and setter
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      console.error(`Error reading from localStorage key "${key}"`);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Error writing to localStorage key "${key}"`);
    }
  };

  return [storedValue, setValue];
};
