import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Enhanced MathRenderer:
 * - Full KaTeX inline ($...$) and display ($$...$$) math parsing
 * - Markdown tables (| col | col |) into responsive, beautifully styled tables
 * - Headings (#, ##, ###, ####)
 * - Blockquotes (>)
 * - Lists (*, -, 1.)
 * - Filters out raw HTML tags like <div>, <span class="...">, etc.
 * - Right-aligned CBSE mark badges ([1 Mark], [2 Marks], [3 Marks], etc.)
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Pre-clean raw HTML tags like <div class="..."> or </div> or <span>
    // (Replace common mark divs with markdown markers, strip others)
    const sanitized = content
      .replace(/<div class="[^"]*text-right[^"]*">\[(.*?)\]<\/div>/gi, '\n[RIGHT_MARK: $1]\n')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '')
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n');

    const lines = sanitized.split('\n');
    const elements: React.ReactNode[] = [];

    let inBlockquote = false;
    let blockquoteLines: string[] = [];

    let inTable = false;
    let tableLines: string[] = [];

    const flushBlockquote = (key: number) => {
      if (blockquoteLines.length > 0) {
        elements.push(
          <blockquote
            key={`bq-${key}`}
            className="my-3 pl-4 border-l-4 border-indigo-400 bg-indigo-50/60 py-2.5 pr-3 rounded-r-lg italic text-slate-700 text-sm md:text-base leading-relaxed"
          >
            {blockquoteLines.map((line, bIdx) => (
              <p key={bIdx} className="my-1">
                {renderInlineMathAndStyles(line)}
              </p>
            ))}
          </blockquote>
        );
        blockquoteLines = [];
        inBlockquote = false;
      }
    };

    const flushTable = (key: number) => {
      if (tableLines.length > 0) {
        elements.push(renderMarkdownTable(tableLines, key));
        tableLines = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check Table line (starts with |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
        if (inBlockquote) flushBlockquote(index);
        inTable = true;
        tableLines.push(trimmed);
        return;
      } else if (inTable) {
        flushTable(index);
      }

      // Check blockquote
      if (trimmed.startsWith('>')) {
        inBlockquote = true;
        blockquoteLines.push(trimmed.replace(/^>\s*/, ''));
        return;
      } else if (inBlockquote) {
        flushBlockquote(index);
      }

      // Empty line
      if (!trimmed) {
        elements.push(<div key={`empty-${index}`} className="h-2" />);
        return;
      }

      // Custom Right-aligned mark marker
      if (trimmed.startsWith('[RIGHT_MARK:') && trimmed.endsWith(']')) {
        const markVal = trimmed.replace('[RIGHT_MARK:', '').replace(']', '').trim();
        elements.push(
          <div key={`rmark-${index}`} className="flex justify-end text-xs md:text-sm font-bold text-slate-700 mt-1 mb-2.5">
            <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-slate-800 print:border-none print:p-0">
              [{markVal}]
            </span>
          </div>
        );
        return;
      }

      // Display math $$ ... $$
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) {
        const mathExpr = trimmed.slice(2, -2).trim();
        try {
          const html = katex.renderToString(mathExpr, { displayMode: true, throwOnError: false });
          elements.push(
            <div
              key={`math-${index}`}
              className="my-3 overflow-x-auto py-1 text-center font-serif text-slate-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
          return;
        } catch (e) {
          elements.push(<div key={`math-err-${index}`} className="my-2 font-mono text-sm">{trimmed}</div>);
          return;
        }
      }

      // Headings
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} className="text-xl md:text-2xl font-black tracking-tight text-slate-900 text-center uppercase border-b-2 border-slate-900 pb-2 mb-3 mt-4 print:text-lg">
            {renderInlineMathAndStyles(trimmed.slice(2))}
          </h1>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-lg md:text-xl font-bold text-slate-900 text-center uppercase tracking-wide mb-2 mt-3 print:text-base">
            {renderInlineMathAndStyles(trimmed.slice(3))}
          </h2>
        );
        return;
      }
      if (trimmed.startsWith('### ')) {
        const text = trimmed.slice(4);
        const isSection = /SECTION\s+[A-E]/i.test(text);
        elements.push(
          <h3
            key={`h3-${index}`}
            className={`font-bold mt-4 mb-2 ${
              isSection
                ? 'text-sm md:text-base uppercase bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border-l-4 border-indigo-600 print:bg-slate-200 print:border-black'
                : 'text-sm sm:text-base font-bold text-slate-900'
            }`}
          >
            {renderInlineMathAndStyles(text)}
          </h3>
        );
        return;
      }
      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${index}`} className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mt-3 mb-1">
            {renderInlineMathAndStyles(trimmed.slice(5))}
          </h4>
        );
        return;
      }

      // Horizontal rule
      if (trimmed === '---' || trimmed === '***') {
        elements.push(<hr key={`hr-${index}`} className="my-4 border-slate-300 print:border-black" />);
        return;
      }

      // Mark detection in brackets like [1 Mark] or [2 Marks] at end of line
      const endMarkMatch = trimmed.match(/\[([0-9\s\+\=½\.\/]+(?:Marks?|Mark))\]$/i);
      const isQuestionStart = /^\*\*Q\d+[\.\:]\*\*/.test(trimmed) || /^Q\d+[\.\:]/.test(trimmed);

      // Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={`li-${index}`} className="flex items-start space-x-2 my-1 pl-3 text-slate-700 text-sm md:text-base leading-relaxed">
            <span className="text-indigo-500 font-bold text-base leading-none print:text-black mt-1">•</span>
            <div className="flex-1">{renderInlineMathAndStyles(trimmed.slice(2))}</div>
          </div>
        );
        return;
      }

      // Numbered lists e.g. 1. or 2.
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch && !isQuestionStart) {
        elements.push(
          <div key={`ol-${index}`} className="flex items-start space-x-2 my-1 pl-2 text-slate-700 text-sm md:text-base leading-relaxed">
            <span className="font-semibold text-slate-900 text-sm min-w-5">{numMatch[1]}.</span>
            <div className="flex-1">{renderInlineMathAndStyles(numMatch[2])}</div>
          </div>
        );
        return;
      }

      // Paragraph / Question Body
      elements.push(
        <div
          key={`p-${index}`}
          className={`text-slate-800 text-sm md:text-[15px] leading-relaxed my-1.5 ${
            isQuestionStart ? 'font-medium mt-3 print-question-block' : ''
          }`}
        >
          {renderInlineMathAndStyles(trimmed)}
        </div>
      );
    });

    if (inBlockquote) flushBlockquote(lines.length);
    if (inTable) flushTable(lines.length);

    return elements;
  }, [content]);

  return <div className={`academic-prose ${className}`}>{renderedElements}</div>;
};

/**
 * Render Markdown Tables into responsive HTML tables
 */
function renderMarkdownTable(lines: string[], keyPrefix: number): React.ReactNode {
  if (lines.length === 0) return null;

  const rows = lines.map(line =>
    line
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim())
  );

  // Filter out divider row (e.g. |:---|:---|)
  const isDivider = (row: string[]) => row.every(c => /^:?-+:?$/.test(c));
  const dataRows = rows.filter(r => !isDivider(r));

  if (dataRows.length === 0) return null;

  const headers = dataRows[0];
  const bodyRows = dataRows.slice(1);

  return (
    <div key={`table-${keyPrefix}`} className="my-4 overflow-x-auto border border-slate-200 rounded-xl shadow-2xs print:border-black">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-800 print:bg-slate-200 print:border-black">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-2.5 sm:p-3 border-r last:border-r-0 border-slate-200 print:border-black">
                {renderInlineMathAndStyles(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white print:divide-black">
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-2.5 sm:p-3 border-r last:border-r-0 border-slate-100 print:border-black">
                  {renderInlineMathAndStyles(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Splits string by $...$ inline LaTeX, **bold**, *italic*, and &nbsp;
 */
function renderInlineMathAndStyles(text: string): React.ReactNode {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  const mathRegex = /\$([^\$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plainText = text.substring(lastIndex, match.index);
      parts.push(renderFormatting(plainText, `txt-${lastIndex}`));
    }

    const latexExpr = match[1];
    try {
      const mathHtml = katex.renderToString(latexExpr, {
        displayMode: false,
        throwOnError: false,
      });
      parts.push(
        <span
          key={`math-${match.index}`}
          className="inline-math px-0.5"
          dangerouslySetInnerHTML={{ __html: mathHtml }}
        />
      );
    } catch (e) {
      parts.push(<span key={`math-err-${match.index}`} className="font-mono text-xs">${latexExpr}$</span>);
    }

    lastIndex = mathRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(renderFormatting(text.substring(lastIndex), `txt-${lastIndex}`));
  }

  return <>{parts}</>;
}

function renderFormatting(text: string, keyPrefix: string): React.ReactNode {
  let clean = text.replace(/&nbsp;/g, ' ');

  const boldTokens = clean.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span key={keyPrefix}>
      {boldTokens.map((token, bIdx) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          const inner = token.slice(2, -2);
          return (
            <strong key={`${keyPrefix}-b-${bIdx}`} className="font-bold text-slate-900">
              {inner}
            </strong>
          );
        }

        const italicTokens = token.split(/(\*[^*]+\*)/g);
        return (
          <React.Fragment key={`${keyPrefix}-frag-${bIdx}`}>
            {italicTokens.map((itToken, itIdx) => {
              if (itToken.startsWith('*') && itToken.endsWith('*')) {
                return (
                  <em key={`${keyPrefix}-it-${itIdx}`} className="italic text-slate-800">
                    {itToken.slice(1, -1)}
                  </em>
                );
              }
              return itToken;
            })}
          </React.Fragment>
        );
      })}
    </span>
  );
}
