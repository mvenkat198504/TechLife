import { Link } from 'react-router-dom';
import { questions } from '../content/questionLoader';
import { categories } from '../content/categories';
import { useProgress } from '../hooks/useProgress';
import './ProgressPage.css';

export const ProgressPage = () => {
  const progress = useProgress();

  // Calculate statistics
  const totalQuestions = questions.length;
  const completedCount = progress.completed.length;
  const bookmarkedCount = progress.bookmarks.length;
  const progressPercentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  // Get recently viewed questions
  const recentlyViewed = progress.recent.slice(0, 5).map((id) => questions.find((q) => q.id === id)).filter(Boolean);

  // Group completed questions by category
  const completedByCategory = questions
    .filter((q) => progress.completed.includes(q.id))
    .reduce((acc, question) => {
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

  const getCategoryTotal = (categoryId) => {
    return questions.filter((q) => q.categoryId === categoryId).length;
  };

  return (
    <div className="progress-page">
      {/* Page Header */}
      <section className="progress-header mb-5">
        <h1>My Learning Progress</h1>
        <p className="text-muted">
          Track your interview preparation journey
        </p>
      </section>

      {/* Overall Statistics */}
      <section className="progress-stats mb-5">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="stat-card">
              <i className="bi bi-question-circle"></i>
              <h3>{totalQuestions}</h3>
              <p>Total Questions</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card success">
              <i className="bi bi-check-circle"></i>
              <h3>{completedCount}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card primary">
              <i className="bi bi-bookmark"></i>
              <h3>{bookmarkedCount}</h3>
              <p>Bookmarked</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <i className="bi bi-percent"></i>
              <h3>{progressPercentage}%</h3>
              <p>Progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="progress-bar-section mb-5">
        <h4>Overall Completion</h4>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="progress-text">
          {completedCount} of {totalQuestions} questions completed
        </p>
      </section>

      <div className="row g-4">
        {/* Recently Viewed */}
        <div className="col-lg-6">
          <section className="recent-section">
            <h4>Recently Viewed</h4>
            {recentlyViewed.length === 0 ? (
              <div className="empty-list">
                <p className="text-muted">No recently viewed questions</p>
                <Link to="/search" className="btn btn-sm btn-primary">
                  Explore Questions
                </Link>
              </div>
            ) : (
              <div className="recent-list">
                {recentlyViewed.map((question) => (
                  <Link
                    key={question.id}
                    to={`/category/${question.categoryId}?q=${question.slug}`}
                    className="recent-item"
                  >
                    <div className="recent-item-content">
                      <h6>{question.title}</h6>
                      <p className="text-muted">{getCategoryName(question.categoryId)}</p>
                    </div>
                    <i className="bi bi-chevron-right"></i>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Category Progress */}
        <div className="col-lg-6">
          <section className="category-progress-section">
            <h4>Progress by Category</h4>
            <div className="category-progress-list">
              {categories.map((category) => {
                const categoryTotal = getCategoryTotal(category.id);
                const categoryCompleted = completedByCategory[category.id]?.length || 0;
                const categoryProgress = categoryTotal > 0 ? Math.round((categoryCompleted / categoryTotal) * 100) : 0;

                return (
                  <div key={category.id} className="category-progress-item">
                    <div className="category-info">
                      <i className={`bi bi-${category.icon}`}></i>
                      <div>
                        <h6>{category.name}</h6>
                        <span className="text-muted">{categoryCompleted}/{categoryTotal}</span>
                      </div>
                    </div>
                    <div className="progress-bar-small">
                      <div className="progress-bar-fill" style={{ width: `${categoryProgress}%` }}></div>
                    </div>
                    <span className="progress-percent">{categoryProgress}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Completed Questions */}
      {completedCount > 0 && (
        <section className="completed-section mt-5">
          <h4>Completed Questions</h4>
          <div className="completed-grid">
            {Object.entries(completedByCategory).map(([categoryId, categoryQuestions]) => (
              <div key={categoryId} className="completed-category">
                <h6 className="completed-category-title">
                  <i className={`bi bi-${getCategoryIcon(categoryId)}`}></i>
                  {getCategoryName(categoryId)}
                </h6>
                <div className="completed-list">
                  {categoryQuestions.map((question) => (
                    <Link
                      key={question.id}
                      to={`/category/${question.categoryId}?q=${question.slug}`}
                      className="completed-item"
                      title={question.title}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      <span>{question.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <section className="action-section mt-5 mb-5">
        <div className="action-buttons">
          {completedCount < totalQuestions && (
            <Link to="/search" className="btn btn-primary btn-lg">
              <i className="bi bi-search me-2"></i>
              Continue Learning
            </Link>
          )}
          {completedCount > 0 && (
            <Link to="/bookmarks" className="btn btn-outline-primary btn-lg">
              <i className="bi bi-bookmark me-2"></i>
              View Bookmarks
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};
