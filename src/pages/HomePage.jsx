import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../content/categories';
import { questions } from '../content/questionLoader';
import { useProgress } from '../hooks/useProgress';
import './HomePage.css';

export const HomePage = () => {
  const progress = useProgress();
  const totalQuestions = questions.length;
  const completedCount = progress.completed.length;
  const bookmarkedCount = progress.bookmarks.length;

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="home-page">
      {/* Welcome Banner */}
      <section className="welcome-banner mb-5">
        <div className="banner-content">
          <h1 className="banner-title">Welcome to TechLife Pro</h1>
          <p className="banner-subtitle">
            Master technical interviews with comprehensive questions, detailed explanations, and real-world scenarios.
          </p>
          <div className="banner-actions">
            <Link to="/search" className="btn btn-primary btn-lg me-3">
              <i className="bi bi-search me-2"></i>
              Search Questions
            </Link>
            <Link to="/quiz" className="btn btn-outline-primary btn-lg">
              <i className="bi bi-question-circle me-2"></i>
              Start Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="statistics mb-5">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="stat-card">
              <i className="bi bi-question-circle"></i>
              <h3>{totalQuestions}</h3>
              <p>Questions</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <i className="bi bi-bookmark"></i>
              <h3>{bookmarkedCount}</h3>
              <p>Bookmarks</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <i className="bi bi-graph-up"></i>
              <h3>{completedCount}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <i className="bi bi-fire"></i>
              <h3>Quiz</h3>
              <p>Practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="categories-section mb-5">
        <h2 className="section-title">Explore Categories</h2>
        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.id} className="col-md-6 col-lg-4">
              <Link
                to={`/category/${category.slug}`}
                className="category-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="category-card-header">
                  <i className={`bi bi-${category.icon}`}></i>
                  <h3>{category.name}</h3>
                </div>
                <p className="category-card-description">{category.description}</p>
                <div className="category-card-footer">
                  <span className="view-questions">
                    View Questions
                    <i className="bi bi-arrow-right ms-2"></i>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links mb-5">
        <div className="row">
          <div className="col-md-6 mb-3">
            <Link to="/bookmarks" className="quick-link-card">
              <i className="bi bi-bookmark-fill"></i>
              <div>
                <h4>My Bookmarks</h4>
                <p>{bookmarkedCount} saved question{bookmarkedCount === 1 ? '' : 's'}</p>
              </div>
              <i className="bi bi-chevron-right"></i>
            </Link>
          </div>
          <div className="col-md-6 mb-3">
            <Link to="/progress" className="quick-link-card">
              <i className="bi bi-graph-up-arrow"></i>
              <div>
                <h4>My Progress</h4>
                <p>{completedCount} completed, {totalQuestions - completedCount} remaining</p>
              </div>
              <i className="bi bi-chevron-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
