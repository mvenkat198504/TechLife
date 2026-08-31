import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questions } from '../content/questionLoader';
import { categories } from '../content/categories';
import { useProgress } from '../hooks/useProgress';
import { slugify } from '../utils/slugify';
import './BookmarksPage.css';

export const BookmarksPage = () => {
  const progress = useProgress();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Get bookmarked questions
  const bookmarkedQuestions = questions.filter((q) => progress.bookmarks.includes(q.id));

  // Group by category
  const groupedByCategory = bookmarkedQuestions.reduce((acc, question) => {
    if (!acc[question.categoryId]) {
      acc[question.categoryId] = [];
    }
    acc[question.categoryId].push(question);
    return acc;
  }, {});

  const getCategoryName = (categoryId) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryIcon = (categoryId) => {
    return categories.find((c) => c.id === categoryId)?.icon || 'question-circle';
  };

  const handleToggleBookmark = (questionId) => {
    progress.toggleBookmark(questionId);
  };

  return (
    <div className="bookmarks-page">
      {/* Page Header */}
      <section className="bookmarks-header mb-5">
        <h1>My Bookmarks</h1>
        <p className="text-muted">
          Questions you've saved for later review and practice
        </p>
      </section>

      {/* Statistics */}
      {bookmarkedQuestions.length > 0 && (
        <section className="statistics mb-5">
          <div className="stat-card">
            <i className="bi bi-bookmark-fill"></i>
            <h3>{bookmarkedQuestions.length}</h3>
            <p>Bookmarked Question{bookmarkedQuestions.length === 1 ? '' : 's'}</p>
          </div>
        </section>
      )}

      {/* Content */}
      {bookmarkedQuestions.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-bookmark"></i>
          <h4>No bookmarks yet</h4>
          <p className="text-muted">
            Start bookmarking questions to save them for later review
          </p>
          <Link to="/search" className="btn btn-primary">
            <i className="bi bi-search me-2"></i>
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="bookmarks-list">
          {Object.entries(groupedByCategory).map(([categoryId, categoryQuestions]) => (
            <section key={categoryId} className="category-section mb-5">
              <div className="category-header">
                <div className="category-title">
                  <i className={`bi bi-${getCategoryIcon(categoryId)}`}></i>
                  <h3>{getCategoryName(categoryId)}</h3>
                  <span className="badge bg-secondary">{categoryQuestions.length}</span>
                </div>
              </div>

              <div className="questions-grid">
                {categoryQuestions.map((question) => (
                  <div key={question.id} className="question-card">
                    <div className="card-header">
                      <Link
                        to={`/category/${question.categoryId}/${slugify(question.subcategory)}?q=${question.slug}`}
                        className="question-title"
                      >
                        {question.title}
                      </Link>
                      <button
                        className="btn-bookmark active"
                        onClick={() => handleToggleBookmark(question.id)}
                        title="Remove from bookmarks"
                        aria-label="Remove from bookmarks"
                      >
                        <i className="bi bi-bookmark-fill"></i>
                      </button>
                    </div>

                    <div className="card-meta">
                      <span className="badge bg-light text-dark">
                        {question.subcategory || 'General'}
                      </span>
                      <span className={`badge difficulty-${question.difficulty.toLowerCase()}`}>
                        {question.difficulty}
                      </span>
                      {progress.isCompleted(question.id) && (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Completed
                        </span>
                      )}
                    </div>

                    {question.shortAnswer && (
                      <p className="card-preview">
                        {question.shortAnswer.substring(0, 120)}
                        {question.shortAnswer.length > 120 ? '...' : ''}
                      </p>
                    )}

                    {question.tags && question.tags.length > 0 && (
                      <div className="card-tags">
                        {question.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
