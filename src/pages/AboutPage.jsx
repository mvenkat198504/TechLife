import { useEffect } from 'react';

export const AboutPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div>
      <h2>About TechLife Pro</h2>
      <p>About page coming soon</p>
    </div>
  );
};
