import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { categories } from '../../content/categories';
import './Header.css';

export const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <header className="header sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="bi bi-lightbulb-fill me-2"></i>
            TechLife Pro
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMobileNav}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${mobileNavOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id} className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href={`#/category/${cat.slug}`}
                    id={`nav-${cat.id}`}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className={`bi bi-${cat.icon} me-1`}></i>
                    {cat.name}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby={`nav-${cat.id}`}>
                    <li>
                      <Link className="dropdown-item" to={`/category/${cat.slug}`}>
                        All {cat.name} Questions
                      </Link>
                    </li>
                  </ul>
                </li>
              ))}
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  <i className="bi bi-search me-1"></i>
                  Search
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bookmarks">
                  <i className="bi bi-bookmark me-1"></i>
                  Bookmarks
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <i className="bi bi-moon"></i>
                ) : (
                  <i className="bi bi-sun"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
