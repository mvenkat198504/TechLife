import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getCategoryBySlug } from '../content/categories';
import {
  getQuestionsByCategoryAndSubcategory,
  getSubcategoriesByCategory,
} from '../content/questionLoader';
import { useProgress } from '../hooks/useProgress';
import './CategoryPage.css';

// Helper function to fix image paths with base URL
const fixImagePath = (src) => {
  if (src.startsWith('/')) {
    const base = import.meta.env.BASE_URL;
    const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${basePath}/images${src.startsWith('/images') ? src.substring(7) : src}`;
  }
  return src;
};

const getSections = (content) => {
  const sections = [];
  const sectionPattern = /^##\s+(.+)\n([\s\S]*?)(?=^##\s+|(?![\s\S]))/gm;
  let match;

  while ((match = sectionPattern.exec(content)) !== null) {
    sections.push({ title: match[1], body: match[2].trim() });
  }

  return sections;
};

const renderInlineText = (text) => {
  const inlinePattern = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|!\[[^\]]*\]\([^)]+\))/g;

  return text.split(inlinePattern).filter(Boolean).map((chunk, index) => {
    if (/^\*\*[^*]+\*\*$/.test(chunk) || /^__[^_]+__$/.test(chunk)) {
      return <strong key={index}>{chunk.slice(2, -2)}</strong>;
    }

    if (/^`[^`]+`$/.test(chunk)) {
      return <code key={index}>{chunk.slice(1, -1)}</code>;
    }

    const imageMatch = chunk.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      return <img key={index} src={fixImagePath(imageMatch[2])} alt={imageMatch[1]} className="question-image-inline" style={{ maxWidth: '100%', height: 'auto' }} />;
    }

    return chunk;
  });
};

const renderSection = (section) => {
  const lines = section.body.split('\n');
  const elements = [];
  let currentList = [];
  let currentParagraph = [];
  let i = 0;

  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for code block start
    if (trimmedLine.startsWith('```')) {
      // Flush current content
      if (currentParagraph.length > 0) {
        elements.push({ type: 'paragraph', content: currentParagraph.join('\n').trim() });
        currentParagraph = [];
      }
      if (currentList.length > 0) {
        elements.push({ type: 'list', items: currentList });
        currentList = [];
      }

      // Extract language identifier
      const languageRaw = trimmedLine.substring(3).trim() || 'plaintext';
      // Map common language variations
      const languageMap = {
        'js': 'javascript',
        'ts': 'typescript',
        'cs': 'csharp',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'xml': 'xml',
        'sql': 'sql',
        'bash': 'bash',
        'sh': 'bash'
      };
      const language = languageMap[languageRaw] || languageRaw;
      let codeContent = [];
      i++;

      // Collect code lines until closing ```
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeContent.push(lines[i]);
        i++;
      }

      const codeText = codeContent.join('\n').trim();
      if (codeText.length > 0 || (i < lines.length && lines[i].trim().startsWith('```'))) {
        elements.push({
          type: 'code',
          language,
          content: codeText
        });
      }
      i++;
      continue;
    }

    // Check for table start
    if (trimmedLine.startsWith('|')) {
      // Flush current content
      if (currentParagraph.length > 0) {
        elements.push({ type: 'paragraph', content: currentParagraph.join('\n').trim() });
        currentParagraph = [];
      }
      if (currentList.length > 0) {
        elements.push({ type: 'list', items: currentList });
        currentList = [];
      }

      // Collect table lines
      const tableLines = [trimmedLine];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      const rows = tableLines.map((tableLine) =>
        tableLine.replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())
      );
      const [header, , ...bodyRows] = rows;

      elements.push({
        type: 'table',
        header,
        bodyRows
      });
      continue;
    }

    // Empty line
    if (!trimmedLine) {
      if (currentParagraph.length > 0) {
        elements.push({ type: 'paragraph', content: currentParagraph.join('\n').trim() });
        currentParagraph = [];
      }
      if (currentList.length > 0) {
        elements.push({ type: 'list', items: currentList });
        currentList = [];
      }
      i++;
      continue;
    }

    // List item
    if (trimmedLine.startsWith('- ') || /^\d+\.\s/.test(trimmedLine)) {
      if (currentParagraph.length > 0) {
        elements.push({ type: 'paragraph', content: currentParagraph.join('\n').trim() });
        currentParagraph = [];
      }
      currentList.push(trimmedLine.replace(/^(?:- |\d+\.\s)/, ''));
      i++;
      continue;
    }

    // Image line
    if (imagePattern.test(trimmedLine)) {
      if (currentParagraph.length > 0) {
        elements.push({ type: 'paragraph', content: currentParagraph.join('\n').trim() });
        currentParagraph = [];
      }
      if (currentList.length > 0) {
        elements.push({ type: 'list', items: currentList });
        currentList = [];
      }
      const match = trimmedLine.match(imagePattern);
      if (match) {
        elements.push({ type: 'image', alt: match[1], src: match[2] });
      }
      i++;
      continue;
    }

    // Regular paragraph text
    if (currentList.length > 0) {
      elements.push({ type: 'list', items: currentList });
      currentList = [];
    }
    currentParagraph.push(trimmedLine);
    i++;
  }

  // Flush remaining content
  if (currentParagraph.length > 0) {
    elements.push({ type: 'paragraph', content: currentParagraph.join('\n').trim() });
  }
  if (currentList.length > 0) {
    elements.push({ type: 'list', items: currentList });
  }

  return (
    <section key={section.title} className="card question-section mb-3">
      <div className="card-body">
        <h3 className="h5">{section.title}</h3>
        {elements.map((element, index) => {
          if (element.type === 'paragraph') {
            return <p key={index}>{renderInlineText(element.content)}</p>;
          } else if (element.type === 'list') {
            return (
              <ul key={index} className="mb-3">
                {element.items.map((item) => <li key={item}>{renderInlineText(item)}</li>)}
              </ul>
            );
          } else if (element.type === 'image') {
            return (
              <img
                key={index}
                src={fixImagePath(element.src)}
                alt={element.alt}
                loading="lazy"
                className="question-image"
              />
            );
          } else if (element.type === 'code') {
            // Regular code blocks
            const showLabel = element.language && element.language !== 'plaintext';
            const languageLabel = showLabel 
              ? element.language === 'csharp' 
                ? 'C# EXAMPLE' 
                : element.language === 'javascript'
                ? 'JAVASCRIPT EXAMPLE'
                : `${element.language.toUpperCase()} EXAMPLE`
              : null;

            if (showLabel) {
              return (
                <div key={index} style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      backgroundColor: '#282a36',
                      color: '#50fa7b',
                      padding: '8px 16px',
                      borderRadius: '8px 8px 0 0',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    {languageLabel}
                  </div>
                  <SyntaxHighlighter
                    language={element.language || 'plaintext'}
                    style={dracula}
                    className="question-code-block"
                    customStyle={{
                      borderRadius: '0 0 8px 8px',
                      padding: '16px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      margin: 0
                    }}
                  >
                    {element.content}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // No label - just code
            return (
              <SyntaxHighlighter
                key={index}
                language={element.language || 'plaintext'}
                style={dracula}
                className="question-code-block"
                customStyle={{
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}
              >
                {element.content}
              </SyntaxHighlighter>
            );
          } else if (element.type === 'table') {
            return (
              <div key={index} className="table-responsive question-table-wrapper">
                <table className="table table-bordered question-table">
                  <thead>
                    <tr>
                      {element.header.map((cell, idx) => <th key={idx}>{renderInlineText(cell)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {element.bodyRows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => <td key={cellIndex}>{renderInlineText(cell)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
};



export const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const progress = useProgress();
  
  const category = getCategoryBySlug(categorySlug);
  const subcategories = category ? getSubcategoriesByCategory(category.id) : [];
  const categoryQuestions = category && subcategorySlug
    ? getQuestionsByCategoryAndSubcategory(category.id, subcategorySlug)
    : [];
  
  // Use lazy initialization to avoid setState in effect
  const [openQuestionId, setOpenQuestionId] = useState(() => {
    const queryQuestionSlug = searchParams.get('q');
    return queryQuestionSlug
      ? categoryQuestions.find((q) => q.slug === queryQuestionSlug)?.id ?? categoryQuestions[0]?.id ?? null
      : categoryQuestions[0]?.id ?? null;
  });

  // Ref to track the opened question element
  const openedQuestionRef = useRef(null);

  // Track recently viewed when question is opened
  const { addToRecent } = progress;
  useEffect(() => {
    if (openQuestionId) {
      addToRecent(openQuestionId);
    }
  }, [openQuestionId, addToRecent]);

  // Scroll to the opened question element
  useEffect(() => {
    if (openedQuestionRef.current && openQuestionId) {
      setTimeout(() => {
        openedQuestionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100); // Small delay to ensure DOM has updated
    }
  }, [openQuestionId]);

  // Scroll to top when category or subcategory changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [categorySlug, subcategorySlug]);

  if (!category) {
    return <p>Category not found.</p>;
  }

  if (!subcategorySlug) {
    return (
      <div className="category-page">
        <div className="mb-4">
          <h1>{category.name} Questions</h1>
          <p>{category.description}</p>
        </div>

        {subcategories.length === 0 ? (
          <div className="alert alert-primary mb-0">Questions for this category are coming soon.</div>
        ) : (
          <div className="row g-4">
            {subcategories.map((subcategory) => (
              <div key={subcategory.slug} className="col-md-6 col-lg-4">
                <Link
                  to={`/category/${category.slug}/${subcategory.slug}`}
                  className="subcategory-card"
                  style={{ textDecoration: 'none' }}
                >
                  <h3>{subcategory.name}</h3>
                  <p className="subcategory-card-count">
                    {subcategory.count} question{subcategory.count === 1 ? '' : 's'}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const activeSubcategory = subcategories.find((subcategory) => subcategory.slug === subcategorySlug);

  return (
    <div className="category-page">
      <div className="mb-4">
        <Link to={`/category/${category.slug}`} className="back-to-subcategories">
          <i className="bi bi-arrow-left me-1"></i>
          {category.name}
        </Link>
        <h1>{activeSubcategory ? activeSubcategory.name : category.name} Questions</h1>
        <p>{category.description}</p>
      </div>

      {categoryQuestions.length === 0 ? (
        <div className="alert alert-primary mb-0">Questions for this subcategory are coming soon.</div>
      ) : (
        <div className="question-accordion">
          {categoryQuestions.map((question) => {
            const isOpen = question.id === openQuestionId;
            const isBookmarked = progress.isBookmarked(question.id);
            const isCompleted = progress.isCompleted(question.id);

            return (
              <article 
                key={question.id} 
                className={`question-accordion-item${isOpen ? ' is-open' : ''}`}
                ref={isOpen ? openedQuestionRef : null}
              >
                <button
                  type="button"
                  className="question-accordion-header"
                  aria-expanded={isOpen}
                  onClick={() => setOpenQuestionId(isOpen ? null : question.id)}
                >
                  <span className="d-flex flex-wrap align-items-center gap-2">
                    <span className="badge text-bg-primary">{question.difficulty}</span>
                    <span className="question-accordion-title">{question.title}</span>
                    {isCompleted && (
                      <span className="badge bg-success" title="Completed">
                        <i className="bi bi-check-circle"></i>
                      </span>
                    )}
                    {isBookmarked && (
                      <span className="badge bg-info" title="Bookmarked">
                        <i className="bi bi-bookmark-fill"></i>
                      </span>
                    )}
                  </span>
                  <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>
                {isOpen && (
                  <div className="question-accordion-body">
                    {/* Question Actions */}
                    <div className="question-actions mb-4">
                      <button
                        className={`btn btn-sm ${isBookmarked ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => progress.toggleBookmark(question.id)}
                        title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                      >
                        <i className={`bi bi-bookmark${isBookmarked ? '-fill' : ''}`}></i>
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </button>
                      <button
                        className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => progress.toggleCompleted(question.id)}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                      >
                        <i className={`bi bi-check-circle${isCompleted ? '-fill' : ''}`}></i>
                        {isCompleted ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>

                    <p className="lead mb-4">{question.summary}</p>
                    {getSections(question.content).map(renderSection)}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

