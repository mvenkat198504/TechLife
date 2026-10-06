import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

let mermaidModulePromise = null;

// Load mermaid lazily so its large diagram-type bundles don't inflate the main chunk.
const loadMermaid = () => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        flowchart: { useMaxWidth: true, htmlLabels: true, wrap: true },
        themeVariables: {
          fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
          // fontSize: '16px',
          // fontWeight: 'bold',
          // primaryColor: '#e8f4ff',
          // primaryTextColor: '#24569a',
          mainBkg: '#e8f4ff',
          nodeBorder: '#d5e1eb',
          nodeTextColor: '#24569a',
          textColor: '#24569a',
          // primaryBorderColor: '#d5e1eb',
          // lineColor: '#9aa3ad',
          // secondaryColor: '#f5faff',
          // tertiaryColor: '#f5faff',
        //themeCSS: '.node rect { rx: 16px; ry: 16px; } .node polygon { fill: #f5faff; stroke-dasharray: 3 3; }',
        },
      });
      return mermaid;
    });
  }
  return mermaidModulePromise;
};

// Renders a ```mermaid code fence as an SVG diagram instead of raw text.
export const MermaidDiagram = ({ chart }) => {
  const containerRef = useRef(null);
  const expandedContainerRef = useRef(null);
  const expandButtonRef = useRef(null);
  const renderId = useId().replace(/:/g, '-');
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedReady, setIsExpandedReady] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let isCancelled = false;

    loadMermaid()
      .then((mermaid) => mermaid.render(`mermaid-${renderId}`, chart))
      .then(({ svg }) => {
        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      })
      .catch((renderError) => {
        if (!isCancelled) {
          setError(renderError?.message || 'Unable to render diagram.');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [chart, renderId]);

  useEffect(() => {
    if (!isExpanded) return undefined;

    let isCancelled = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    loadMermaid()
      .then((mermaid) => mermaid.render(`mermaid-expanded-${renderId}`, chart))
      .then(({ svg }) => {
        if (!isCancelled && expandedContainerRef.current) {
          expandedContainerRef.current.innerHTML = svg;
          setIsExpandedReady(true);
        }
      })
      .catch((renderError) => {
        if (!isCancelled) {
          setError(renderError?.message || 'Unable to render diagram.');
          setIsExpanded(false);
        }
      });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isCancelled = true;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [chart, isExpanded, renderId]);

  const closeExpandedView = () => {
    setIsExpanded(false);
    requestAnimationFrame(() => expandButtonRef.current?.focus());
  };

  const openExpandedView = () => {
    setZoom(1);
    setIsExpandedReady(false);
    setIsExpanded(true);
  };

  if (error) {
    return (
      <div className="mermaid-diagram-error">
        <p>Diagram failed to render: {error}</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  return (
    <>
      <div className="mermaid-diagram">
        <div className="mermaid-diagram-toolbar">
          <button
            ref={expandButtonRef}
            type="button"
            className="mermaid-expand-button"
            onClick={openExpandedView}
            aria-label="Enlarge diagram"
            title="Enlarge diagram"
          >
            <i className="bi bi-arrows-fullscreen" aria-hidden="true" />
          </button>
        </div>
        <div
          className="mermaid-diagram-content"
          ref={containerRef}
          role="button"
          tabIndex={0}
          aria-label="Open enlarged diagram"
          onClick={openExpandedView}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openExpandedView();
            }
          }}
        />
      </div>
      {isExpanded && createPortal(
        <div
          className="mermaid-zoom-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeExpandedView();
          }}
        >
          <section
            className="mermaid-zoom-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Diagram viewer"
          >
            <div className="mermaid-zoom-toolbar">
              <div className="mermaid-zoom-controls">
                <button
                  type="button"
                  onClick={() => setZoom((currentZoom) => Math.max(0.5, currentZoom - 0.2))}
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <i className="bi bi-dash-lg" aria-hidden="true" />
                </button>
                <span aria-live="polite">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((currentZoom) => Math.min(3, currentZoom + 0.2))}
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <i className="bi bi-plus-lg" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setZoom(1)} title="Reset zoom">
                  Reset
                </button>
              </div>
              <button
                type="button"
                className="mermaid-zoom-close"
                onClick={closeExpandedView}
                aria-label="Close diagram viewer"
                title="Close"
                autoFocus
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="mermaid-zoom-stage">
              <div
                ref={expandedContainerRef}
                className="mermaid-zoom-svg"
                style={{ transform: `scale(${zoom})` }}
              />
              {!isExpandedReady && (
                <div className="mermaid-zoom-loading" role="status">Loading diagram...</div>
              )}
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  );
};
