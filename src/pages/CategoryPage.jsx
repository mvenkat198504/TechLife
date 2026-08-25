import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCategoryBySlug } from '../content/categories';
import {
  getQuestionsByCategoryAndSubcategory,
  getSubcategoriesByCategory,
} from '../content/questionLoader';
import './CategoryPage.css';

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
  const inlinePattern = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g;

  return text.split(inlinePattern).filter(Boolean).map((chunk, index) => {
    if (/^\*\*[^*]+\*\*$/.test(chunk) || /^__[^_]+__$/.test(chunk)) {
      return <strong key={index}>{chunk.slice(2, -2)}</strong>;
    }

    if (/^`[^`]+`$/.test(chunk)) {
      return <code key={index}>{chunk.slice(1, -1)}</code>;
    }

    return chunk;
  });
};

const parseTableBlock = (block) => {
  const rows = block
    .trim()
    .split('\n')
    .map((line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()));

  const [header, , ...bodyRows] = rows;

  return { header, bodyRows };
};

const renderSection = (section) => {
  const codeMatch = section.body.match(/```(\w*)\n([\s\S]*?)```/);
  let text = codeMatch ? section.body.replace(codeMatch[0], '').trim() : section.body;
  const tableMatch = text.match(/^\|.+\|\s*\n\|[\s:|-]+\|\s*\n(?:\|.+\|\s*\n?)+/m);
  const table = tableMatch ? parseTableBlock(tableMatch[0]) : null;

  if (tableMatch) {
    text = text.replace(tableMatch[0], '').trim();
  }

  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/;
  const listItems = text
    .split('\n')
    .filter((line) => (line.startsWith('- ') || /^\d+\.\s/.test(line)) && !imagePattern.test(line))
    .map((line) => line.replace(/^(?:- |\d+\.\s)/, ''));
  const images = text
    .split('\n')
    .map((line) => line.trim().match(imagePattern))
    .filter(Boolean)
    .map((match) => ({ alt: match[1], src: match[2] }));
  const paragraphs = text
    .split('\n')
    .filter((line) => line && !line.startsWith('- ') && !/^\d+\.\s/.test(line) && !imagePattern.test(line));

  return (
    <section key={section.title} className="card question-section mb-3">
      <div className="card-body">
        <h3 className="h5">{section.title}</h3>
        {paragraphs.map((paragraph, index) => <p key={index}>{renderInlineText(paragraph)}</p>)}
        {listItems.length > 0 && (
          <ul className="mb-0">
            {listItems.map((item) => <li key={item}>{renderInlineText(item)}</li>)}
          </ul>
        )}
        {table && (
          <div className="table-responsive question-table-wrapper">
            <table className="table table-bordered question-table">
              <thead>
                <tr>
                  {table.header.map((cell, index) => <th key={index}>{renderInlineText(cell)}</th>)}
                </tr>
              </thead>
              <tbody>
                {table.bodyRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => <td key={cellIndex}>{renderInlineText(cell)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {images.map((image) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="question-image"
          />
        ))}
        {codeMatch && (
          <pre className="question-code-block"><code>{codeMatch[2]}</code></pre>
        )}
      </div>
    </section>
  );
};



export const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);
  const subcategories = category ? getSubcategoriesByCategory(category.id) : [];
  const categoryQuestions = category && subcategorySlug
    ? getQuestionsByCategoryAndSubcategory(category.id, subcategorySlug)
    : [];
  const [openQuestionId, setOpenQuestionId] = useState(categoryQuestions[0]?.id ?? null);

  useEffect(() => {
    setOpenQuestionId(categoryQuestions[0]?.id ?? null);
  }, [subcategorySlug]);

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

            return (
              <article key={question.id} className={`question-accordion-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="question-accordion-header"
                  aria-expanded={isOpen}
                  onClick={() => setOpenQuestionId(isOpen ? null : question.id)}
                >
                  <span className="d-flex flex-wrap align-items-center gap-2">
                    <span className="badge text-bg-primary">{question.difficulty}</span>
                    <span className="question-accordion-title">{question.title}</span>
                  </span>
                  <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>
                {isOpen && (
                  <div className="question-accordion-body">
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

