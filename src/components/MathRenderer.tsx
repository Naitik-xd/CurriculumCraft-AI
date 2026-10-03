import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Enhanced MathRenderer:
 * - Groups each question with its options/sub-parts and marks into an atomic .print-question-block
 * - Prevents mid-question page slicing in PDF exports and print dialogs
 * - Full KaTeX inline ($...$) and display ($$...$$) math parsing
 * - Markdown tables (| col | col |) into responsive styled tables
 * - Headings, blockquotes, lists, and CBSE right-aligned mark badges
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Pre-clean raw HTML tags like <div class="..."> or </div> or <span>
    const sanitized = content
      .replace(/<div class="[^"]*text-right[^"]*">\[(.*?)\]<\/div>/gi, '\n[RIGHT_MARK: $1]\n')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '')
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n');

    const lines = sanitized.split('\n');

    // Group lines into semantic blocks: Question blocks, Section blocks, and Standard blocks
    type BlockType = 'section' | 'question' | 'table' | 'blockquote' | 'general' | 'hr';
    interface Block {
      type: BlockType;
      lines: string[];
    }

    const blocks: Block[] = [];
    let currentBlock: Block | null = null;

    const isQuestionStart = (line: string): boolean => {
      const trimmed = line.trim();
      return (
        /^\*{0,2}Q\d+[\.\:]/i.test(trimmed) ||
        /^\*{0,2}Question\s+\d+[\.\:]/i.test(trimmed) ||
        /^\*{0,2}Assertion\s*-\s*Reason/i.test(trimmed) ||
        /^\*{0,2}Case\s*-\s*Based/i.test(trimmed)
      );
    };

    const isSectionStart = (line: string): boolean => {
      const trimmed = line.trim();
      return /^#{1,4}\s*SECTION\s+[A-E]/i.test(trimmed) || /^SECTION\s+[A-E]/i.test(trimmed);
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Check Section header
      if (isSectionStart(trimmed)) {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'section', lines: [trimmed] };
        return;
      }

      // Check Question start
      if (isQuestionStart(trimmed)) {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'question', lines: [trimmed] };
        return;
      }

      // Check Table line
      if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
        if (currentBlock && currentBlock.type === 'table') {
          currentBlock.lines.push(trimmed);
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = { type: 'table', lines: [trimmed] };
        }
        return;
      }

      // Check Blockquote line
      if (trimmed.startsWith('>')) {
        if (currentBlock && currentBlock.type === 'blockquote') {
          currentBlock.lines.push(trimmed.replace(/^>\s*/, ''));
        } else {
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = { type: 'blockquote', lines: [trimmed.replace(/^>\s*/, '')] };
        }
        return;
      }

      // Check Horizontal rule
      if (trimmed === '---' || trimmed === '***') {
        if (currentBlock) blocks.push(currentBlock);
        blocks.push({ type: 'hr', lines: [trimmed] });
        currentBlock = null;
        return;
      }

      // If we are currently inside a question block, continue appending options, sub-parts, or marks
      if (currentBlock && currentBlock.type === 'question') {
        currentBlock.lines.push(trimmed);
        return;
      }

      // Otherwise general line
      if (currentBlock && currentBlock.type === 'general') {
        currentBlock.lines.push(trimmed);
      } else {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'general', lines: [trimmed] };
      }
    });

    if (currentBlock) blocks.push(currentBlock);

    // Now render each block
    return blocks.map((block, bIdx) => {
      if (block.type === 'hr') {
        return <hr key={`hr-${bIdx}`} className="my-4 border-slate-300 print:border-black" />;
      }

      if (block.type === 'section') {
        const text = block.lines[0].replace(/^#{1,4}\s*/, '');
        return (
          <div key={`sec-${bIdx}`} className="mt-5 mb-3 print-section-header">
            <div className="text-xs sm:text-sm font-black uppercase bg-slate-100 text-slate-800 px-3.5 py-2 rounded-lg border-l-4 border-indigo-600 print:bg-slate-200 print:border-black">
              {renderInlineMathAndStyles(text)}
            </div>
          </div>
        );
      }

      if (block.type === 'table') {
        return renderMarkdownTable(block.lines, bIdx);
      }

      if (block.type === 'blockquote') {
        return (
          <blockquote
            key={`bq-${bIdx}`}
            className="my-3 pl-4 border-l-4 border-indigo-400 bg-indigo-50/60 py-2.5 pr-3 rounded-r-lg italic text-slate-700 text-sm md:text-base leading-relaxed print-question-block"
          >
            {block.lines.map((l, lIdx) => (
              <p key={lIdx} className="my-1">
                {renderInlineMathAndStyles(l)}
              </p>
            ))}
          </blockquote>
        );
      }

      if (block.type === 'question') {
        return (
          <div
            key={`qblock-${bIdx}`}
            className="print-question-block my-3 p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
          >
            {block.lines.map((line, lIdx) => renderQuestionLine(line, lIdx))}
          </div>
        );
      }

      // General block (e.g. Instructions, headings, introductory text)
      return (
        <div key={`gen-${bIdx}`} className="my-2 space-y-1.5">
          {block.lines.map((line, lIdx) => renderGeneralLine(line, lIdx))}
        </div>
      );
    });
  }, [content]);

  return <div className={`academic-prose ${className}`}>{renderedElements}</div>;
};

function renderQuestionLine(line: string, index: number): React.ReactNode {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Custom Right-aligned mark badge
  if (trimmed.startsWith('[RIGHT_MARK:') && trimmed.endsWith(']')) {
    const markVal = trimmed.replace('[RIGHT_MARK:', '').replace(']', '').trim();
    return (
      <div key={`rmark-${index}`} className="flex justify-end text-xs font-bold text-slate-700 mt-2">
        <span className="bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded text-slate-800 print:border-none print:p-0">
          [{markVal}]
        </span>
      </div>
    );
  }

  // Display math $$ ... $$
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) {
    const mathExpr = trimmed.slice(2, -2).trim();
    try {
      const html = katex.renderToString(mathExpr, { displayMode: true, throwOnError: false });
      return (
        <div
          key={`math-${index}`}
          className="my-2 overflow-x-auto py-1 text-center font-serif text-slate-900"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return <div key={`math-err-${index}`} className="my-1 font-mono text-xs">{trimmed}</div>;
    }
  }

  // Question header e.g. Q1. or **Q1.**
  const isQuestionHeader = /^\*{0,2}Q\d+[\.\:]/i.test(trimmed);

  // Mark in brackets at end of line: [1 Mark], [2 Marks], [3 + 2 = 5 Marks]
  const hasEndMark = /\[([0-9\s\+\=½\.\/]+(?:Marks?|Mark))\]$/i.test(trimmed);

  return (
    <div
      key={`ql-${index}`}
      className={`text-slate-800 text-sm md:text-[14.5px] leading-relaxed my-1 ${
        isQuestionHeader ? 'font-bold text-slate-900 mt-0.5' : ''
      } ${hasEndMark && !isQuestionHeader ? 'flex items-center justify-between' : ''}`}
    >
      <div>{renderInlineMathAndStyles(trimmed)}</div>
    </div>
  );
}

function renderGeneralLine(line: string, index: number): React.ReactNode {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('# ')) {
    return (
      <h1 key={`h1-${index}`} className="text-xl md:text-2xl font-black tracking-tight text-slate-900 text-center uppercase border-b-2 border-slate-900 pb-2 mb-3 mt-4 print:text-lg">
        {renderInlineMathAndStyles(trimmed.slice(2))}
      </h1>
    );
  }
  if (trimmed.startsWith('## ')) {
    return (
      <h2 key={`h2-${index}`} className="text-lg md:text-xl font-bold text-slate-900 text-center uppercase tracking-wide mb-2 mt-3 print:text-base">
        {renderInlineMathAndStyles(trimmed.slice(3))}
      </h2>
    );
  }
  if (trimmed.startsWith('### ')) {
    return (
      <h3 key={`h3-${index}`} className="text-sm sm:text-base font-bold text-slate-900 mt-3 mb-1">
        {renderInlineMathAndStyles(trimmed.slice(4))}
      </h3>
    );
  }
  if (trimmed.startsWith('#### ')) {
    return (
      <h4 key={`h4-${index}`} className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mt-3 mb-1">
        {renderInlineMathAndStyles(trimmed.slice(5))}
      </h4>
    );
  }

  // Bullet list
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return (
      <div key={`li-${index}`} className="flex items-start space-x-2 my-1 pl-3 text-slate-700 text-sm leading-relaxed">
        <span className="text-indigo-500 font-bold text-base leading-none print:text-black mt-1">•</span>
        <div className="flex-1">{renderInlineMathAndStyles(trimmed.slice(2))}</div>
      </div>
    );
  }

  // Numbered list
  const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
  if (numMatch) {
    return (
      <div key={`ol-${index}`} className="flex items-start space-x-2 my-1 pl-2 text-slate-700 text-sm leading-relaxed">
        <span className="font-semibold text-slate-900 text-xs min-w-5">{numMatch[1]}.</span>
        <div className="flex-1">{renderInlineMathAndStyles(numMatch[2])}</div>
      </div>
    );
  }

  return (
    <div key={`p-${index}`} className="text-slate-800 text-sm leading-relaxed my-1">
      {renderInlineMathAndStyles(trimmed)}
    </div>
  );
}

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

  const isDivider = (row: string[]) => row.every(c => /^:?-+:?$/.test(c));
  const dataRows = rows.filter(r => !isDivider(r));

  if (dataRows.length === 0) return null;

  const headers = dataRows[0];
  const bodyRows = dataRows.slice(1);

  return (
    <div key={`table-${keyPrefix}`} className="my-4 overflow-x-auto border border-slate-200 rounded-xl shadow-2xs print:border-black print-question-block">
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
    } catch {
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
  const clean = text.replace(/&nbsp;/g, ' ');
  const boldTokens = clean.split(/(\*\*[\s\S]*?\*\*)/g);

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

        const italicTokens = token.split(/(\*[^*]+?\*)/g);
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
