/**
 * Reliable printing and document export utility for AI Studio environments.
 */

export function executePrint(docTitle?: string): boolean {
  try {
    if (docTitle) {
      document.title = docTitle;
    }
    window.print();
    return true;
  } catch (err) {
    console.error('Direct window.print() failed:', err);
    return false;
  }
}

export function printHtmlElement(elementId?: string, docTitle?: string): boolean {
  return executePrint(docTitle);
}

export function downloadHtmlFile(contentHtml: string, filename: string = 'CBSE_Document.html') {
  const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${filename.replace('.html', '')}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>
    @page { 
      size: A4 portrait; 
      margin: 15mm 15mm 15mm 15mm; 
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
      max-width: 820px; 
      margin: 0 auto; 
      padding: 24px; 
      color: #111827; 
      background: #ffffff;
      line-height: 1.5;
      font-size: 11pt;
    }
    .no-print, button, .print-hide { display: none !important; }
    hr { border: 0; border-top: 1.5px solid #1e293b; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10.5pt; }
    th, td { border: 1px solid #334155; padding: 6px 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: bold; }
    h1 { font-size: 18pt; text-align: center; text-transform: uppercase; margin: 12px 0 6px 0; }
    h2 { font-size: 13pt; text-align: center; margin: 8px 0; }
    h3 { font-size: 11.5pt; font-weight: bold; background: #f8fafc; padding: 4px 8px; border-left: 3px solid #4f46e5; margin: 12px 0 6px 0; }
    .text-right { text-align: right; }
    .print-question-block { break-inside: avoid; page-break-inside: avoid; }
  </style>
</head>
<body>
  ${contentHtml}
  <script>
    // Auto-trigger print when opened as standalone file
    window.onload = function() {
      // User can press Ctrl+P anytime
    };
  </script>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
