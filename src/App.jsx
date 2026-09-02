import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizPage } from './pages/QuizPage';
import { AboutPage } from './pages/AboutPage';
import { CategoryPage } from './pages/CategoryPage';
import { ContributePage } from './pages/ContributePage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/theme.css';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Intentionally not linked from Header/Sidebar; reachable only via direct URL */}
              <Route path="/admin/contribute" element={<ContributePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
