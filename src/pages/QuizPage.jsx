import { useEffect } from 'react';

export const QuizPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div>
      <h2>Quiz</h2>
      <p>Quiz functionality coming in Phase 4</p>
    </div>
  );
};
