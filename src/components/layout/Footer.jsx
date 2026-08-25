import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="footer-title">TechLife Pro</h5>
            <p className="footer-text">
              Interview preparation platform for software developers preparing for technical interviews.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h6 className="footer-section-title">Quick Links</h6>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/bookmarks">Bookmarks</Link>
              </li>
              <li>
                <Link to="/quiz">Quiz</Link>
              </li>
              <li>
                <Link to="/progress">Progress</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <h6 className="footer-section-title">Resources</h6>
            <ul className="footer-links">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        <div className="text-center footer-bottom">
          <p className="mb-0">
            &copy; {currentYear} TechLife Pro. All rights reserved. | Made with{' '}
            <i className="bi bi-heart-fill text-danger"></i> for developers
          </p>
        </div>
      </div>
    </footer>
  );
};
