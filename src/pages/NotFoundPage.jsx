import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="not-found-suggestions">
          <h3>What you can do:</h3>
          <ul>
            <li>
              <Link to="/">Return to Home</Link>
            </li>
            <li>
              <Link to="/search">Search Questions</Link>
            </li>
            <li>
              <Link to="/bookmarks">View Bookmarks</Link>
            </li>
          </ul>
        </div>

        <div className="not-found-image">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
      </div>
    </div>
  );
};
