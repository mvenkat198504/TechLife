import { Link, useParams } from 'react-router-dom';
import { categories } from '../../content/categories';
import './Sidebar.css';

export const Sidebar = () => {
  const { categorySlug } = useParams();

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h5 className="sidebar-title">Categories</h5>
        <nav className="category-nav">
          <Link to="/" className="nav-item-home">
            <i className="bi bi-house me-2"></i>
            Home
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`category-link ${categorySlug === cat.slug ? 'active' : ''}`}
              title={cat.description}
            >
              <i className={`bi bi-${cat.icon} me-2`}></i>
              <span>{cat.name}</span>
            </Link>
          ))}

          <div className="sidebar-section mt-4">
            <h6 className="sidebar-section-title">Resources</h6>
            <Link to="/progress" className="nav-item-link">
              <i className="bi bi-graph-up me-2"></i>
              Progress
            </Link>
            <Link to="/quiz" className="nav-item-link">
              <i className="bi bi-question-circle me-2"></i>
              Quiz
            </Link>
            <Link to="/about" className="nav-item-link">
              <i className="bi bi-info-circle me-2"></i>
              About
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
};
