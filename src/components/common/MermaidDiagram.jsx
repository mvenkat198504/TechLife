import { useEffect, useId, useRef, useState } from 'react';

let mermaidModulePromise = null;

// Load mermaid lazily so its large diagram-type bundles don't inflate the main chunk.
const loadMermaid = () => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'strict',
        flowchart: { useMaxWidth: true, htmlLabels: true, wrap: true },
        themeVariables: { fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif' },
      });
      return mermaid;
    });
  }
  return mermaidModulePromise;
};

// Renders a ```mermaid code fence as an SVG diagram instead of raw text.
export const MermaidDiagram = ({ chart }) => {
  const containerRef = useRef(null);
  const renderId = useId().replace(/:/g, '-');
  const [error, setError] = useState(null);

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

  if (error) {
    return (
      <div className="mermaid-diagram-error">
        <p>Diagram failed to render: {error}</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  return <div className="mermaid-diagram" ref={containerRef} />;
};
