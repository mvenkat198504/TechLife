import { useEffect, useMemo, useState } from 'react';
import { categories } from '../content/categories';
import { DIFFICULTIES } from '../models/question';
import { slugify } from '../utils/slugify';
import './ContributePage.css';

const emptyForm = {
  title: '',
  categoryId: categories[0]?.id || '',
  subcategory: '',
  difficulty: DIFFICULTIES.BASIC,
  tags: '',
  summary: '',
  content: '',
};

// Builds the exact frontmatter block consumed by src/content/questionLoader.js
const buildMarkdown = (form) => {
  const slug = slugify(form.title);
  const id = `${form.categoryId}-${slug}`;
  const tagList = form.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const today = new Date().toISOString().slice(0, 10);

  const tagsBlock = tagList.length
    ? `tags:\n${tagList.map((tag) => `  - ${tag}`).join('\n')}`
    : 'tags: []';

  return [
    '---',
    `id: ${id}`,
    `slug: ${slug}`,
    `title: ${form.title}`,
    `categoryId: ${form.categoryId}`,
    `subcategory: ${form.subcategory}`,
    `difficulty: ${form.difficulty}`,
    tagsBlock,
    `summary: ${form.summary}`,
    `updatedAt: ${today}`,
    'status: published',
    'thumbnail: ""',
    'videos: []',
    'resources: []',
    '---',
    '',
    `# ${form.title}`,
    '',
    form.content,
    '',
  ].join('\n');
};

export const ContributePage = () => {
  const [form, setForm] = useState(emptyForm);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const markdown = useMemo(() => buildMarkdown(form), [form]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugify(form.title) || 'question'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => setForm(emptyForm);

  return (
    <div className="contribute-page">
      <div className="contribute-header">
        <h1>Contribute a Question</h1>
        <p>
          Fill out the form to generate a markdown block matching the site&apos;s
          frontmatter schema, then copy or download it into{' '}
          <code>src/content/questions/&lt;category&gt;/</code>.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <form className="contribute-form" onSubmit={(event) => event.preventDefault()}>
            <div className="mb-3">
              <label className="form-label" htmlFor="cf-title">Title</label>
              <input
                id="cf-title"
                className="form-control"
                type="text"
                value={form.title}
                onChange={handleChange('title')}
                placeholder="e.g. Explain the difference between let and var"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="cf-category">Category</label>
                <select
                  id="cf-category"
                  className="form-select"
                  value={form.categoryId}
                  onChange={handleChange('categoryId')}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="cf-difficulty">Difficulty</label>
                <select
                  id="cf-difficulty"
                  className="form-select"
                  value={form.difficulty}
                  onChange={handleChange('difficulty')}
                >
                  {Object.values(DIFFICULTIES).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="cf-subcategory">Subcategory</label>
              <input
                id="cf-subcategory"
                className="form-control"
                type="text"
                value={form.subcategory}
                onChange={handleChange('subcategory')}
                placeholder="e.g. coding-questions"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="cf-tags">Tags (comma-separated)</label>
              <input
                id="cf-tags"
                className="form-control"
                type="text"
                value={form.tags}
                onChange={handleChange('tags')}
                placeholder="e.g. closures, scope, javascript"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="cf-summary">Summary</label>
              <input
                id="cf-summary"
                className="form-control"
                type="text"
                value={form.summary}
                onChange={handleChange('summary')}
                placeholder="One-line summary shown in listings"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="cf-content">Answer (markdown)</label>
              <textarea
                id="cf-content"
                className="form-control"
                rows={12}
                value={form.content}
                onChange={handleChange('content')}
                placeholder={'Write the answer body here, including ```code blocks``` as needed.'}
              />
            </div>

            <div className="contribute-actions">
              <button type="button" className="btn btn-primary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleDownload}>
                Download .md
              </button>
              <button type="button" className="btn btn-outline-danger" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-6">
          <label className="form-label">Generated Markdown Preview</label>
          <pre className="contribute-preview">{markdown}</pre>
        </div>
      </div>
    </div>
  );
};
