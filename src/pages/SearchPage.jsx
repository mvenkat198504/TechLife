import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { questions } from '../content/questionLoader';
import { categories } from '../content/categories';
import { applyFilters } from '../utils/searchService';
import { useProgress } from '../hooks/useProgress';
import { DIFFICULTIES } from '../models/question';
import { slugify } from '../utils/slugify';
import './SearchPage.css';

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(null);
  const [filterBookmarked, setFilterBookmarked] = useState(null);

  const progress = useProgress();

  // Apply filters to questions
  const filteredQuestions = useMemo(() => {
    return applyFilters(questions, {
      searchTerm,
      categoryId: selectedCategory || null,
      difficulty: selectedDifficulty || null,
      isCompleted: filterCompleted,
      isBookmarked: filterBookmarked,
      completedIds: progress.completed,
      bookmarkedIds: progress.bookmarks,
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, filterCompleted, filterBookmarked, progress.completed, progress.bookmarks]);

  const getCategoryName = (categoryId) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId;
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setFilterCompleted(null);
    setFilterBookmarked(null);
  };

  return (
    <div className="search-page">
      {/* Search Header */}
      <section className="search-header mb-5">
        <h1>Search Interview Questions</h1>
        <p className="text-muted">Find the perfect interview question by searching, filtering, and exploring</p>
      </section>

      {/* Search Input */}
      <section className="search-input-section mb-5">
        <div className="search-box-container">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by title, category, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="row g-4">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="filters-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Filters</h5>
              {(searchTerm || selectedCategory || selectedDifficulty || filterCompleted !== null || filterBookmarked !== null) && (
                <button
                  className="btn btn-sm btn-link p-0"
                  onClick={handleClearFilters}
                  title="Clear all filters"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="filter-group mb-4">
              <h6 className="filter-title">Category</h6>
              <div className="category-options">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="category-all"
                    name="category"
                    value=""
                    checked={!selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="category-all">
                    All Categories
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`category-${category.id}`}
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={`category-${category.id}`}>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="filter-group mb-4">
              <h6 className="filter-title">Difficulty</h6>
              <div className="difficulty-options">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="difficulty-all"
                    name="difficulty"
                    value=""
                    checked={!selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="difficulty-all">
                    All Levels
                  </label>
                </div>
                {Object.values(DIFFICULTIES).map((difficulty) => (
                  <div key={difficulty} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`difficulty-${slugify(difficulty)}`}
                      name="difficulty"
                      value={difficulty}
                      checked={selectedDifficulty === difficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={`difficulty-${slugify(difficulty)}`}>
                      {difficulty}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Status Filter */}
            <div className="filter-group mb-4">
              <h6 className="filter-title">Completion Status</h6>
              <div className="status-options">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="status-all"
                    name="status"
                    value="all"
                    checked={filterCompleted === null}
                    onChange={() => setFilterCompleted(null)}
                  />
                  <label className="form-check-label" htmlFor="status-all">
                    All Questions
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="status-completed"
                    name="status"
                    value="completed"
                    checked={filterCompleted === true}
                    onChange={() => setFilterCompleted(true)}
                  />
                  <label className="form-check-label" htmlFor="status-completed">
                    <i className="bi bi-check-circle me-2 text-success"></i>
                    Completed
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="status-pending"
                    name="status"
                    value="pending"
                    checked={filterCompleted === false}
                    onChange={() => setFilterCompleted(false)}
                  />
                  <label className="form-check-label" htmlFor="status-pending">
                    <i className="bi bi-circle me-2 text-warning"></i>
                    Not Completed
                  </label>
                </div>
              </div>
            </div>

            {/* Bookmark Filter */}
            <div className="filter-group">
              <h6 className="filter-title">Bookmarks</h6>
              <div className="bookmark-options">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="bookmark-all"
                    name="bookmark"
                    value="all"
                    checked={filterBookmarked === null}
                    onChange={() => setFilterBookmarked(null)}
                  />
                  <label className="form-check-label" htmlFor="bookmark-all">
                    All Questions
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="bookmark-bookmarked"
                    name="bookmark"
                    value="bookmarked"
                    checked={filterBookmarked === true}
                    onChange={() => setFilterBookmarked(true)}
                  />
                  <label className="form-check-label" htmlFor="bookmark-bookmarked">
                    <i className="bi bi-bookmark-fill me-2 text-primary"></i>
                    Bookmarked
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="bookmark-not-bookmarked"
                    name="bookmark"
                    value="not-bookmarked"
                    checked={filterBookmarked === false}
                    onChange={() => setFilterBookmarked(false)}
                  />
                  <label className="form-check-label" htmlFor="bookmark-not-bookmarked">
                    <i className="bi bi-bookmark me-2 text-muted"></i>
                    Not Bookmarked
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="col-lg-9">
          <div className="results-section">
            {/* Results Header */}
            <div className="results-header mb-4">
              <h5>
                {filteredQuestions.length === 0
                  ? 'No questions found'
                  : `${filteredQuestions.length} question${filteredQuestions.length === 1 ? '' : 's'} found`}
              </h5>
              {filteredQuestions.length > 0 && (
                <p className="text-muted">Total available: {questions.length}</p>
              )}
            </div>

            {/* Results List */}
            {filteredQuestions.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-search"></i>
                <h4>No questions match your criteria</h4>
                <p className="text-muted">Try adjusting your search or filters to find more questions</p>
                <button className="btn btn-primary" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="results-list">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="result-card">
                    <div className="result-card-header">
                      <Link
                        to={`/category/${question.categoryId}?q=${question.slug}`}
                        className="result-title"
                      >
                        {question.title}
                      </Link>
                    </div>

                    <div className="result-meta">
                      <span className="badge bg-light text-dark">
                        {getCategoryName(question.categoryId)}
                      </span>
                      <span className={`badge difficulty-${question.difficulty.toLowerCase()}`}>
                        {question.difficulty}
                      </span>
                      {progress.isBookmarked(question.id) && (
                        <span className="badge bg-primary">
                          <i className="bi bi-bookmark-fill me-1"></i>
                          Bookmarked
                        </span>
                      )}
                      {progress.isCompleted(question.id) && (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Completed
                        </span>
                      )}
                    </div>

                    <p className="result-preview">
                      {question.shortAnswer && (
                        <>
                          {question.shortAnswer.substring(0, 150)}
                          {question.shortAnswer.length > 150 ? '...' : ''}
                        </>
                      )}
                    </p>

                    {question.tags && question.tags.length > 0 && (
                      <div className="result-tags">
                        {question.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag">
                            #{tag}
                          </span>
                        ))}
                        {question.tags.length > 3 && (
                          <span className="tag text-muted">+{question.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
