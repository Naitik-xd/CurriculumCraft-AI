import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

/**
 * High-fidelity, multi-page A4 CBSE PDF Exporter:
 * - Solves single-question-per-page explosion by accurately measuring rendered chunk heights
 * - Avoids orphan section headers by keeping sections coupled with their first question
 * - Fully eliminates horizontal question slicing across page splits
 * - Supports modern Tailwind v4 oklch / lab color gamut via html2canvas-pro
 */
export async function downloadPdfFromElement(elementId: string, filename: string): Promise<boolean> {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    console.warn(`Element #${elementId} not found for PDF export.`);
    return false;
  }

  const cleanFilename = filename.endsWith('.pdf')
    ? filename
    : `${filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_')}.pdf`;

  // Create an offscreen measurement container with fixed A4 content width
  const A4_PAGE_WIDTH = 794; // 210mm at 96 DPI
  const A4_PAGE_HEIGHT = 1123; // 297mm at 96 DPI
  const HORIZONTAL_PADDING = 40;
  const CONTENT_WIDTH = A4_PAGE_WIDTH - HORIZONTAL_PADDING * 2; // 714px

  const stage = document.createElement('div');
  stage.style.position = 'fixed';
  stage.style.left = '-9999px';
  stage.style.top = '0';
  stage.style.width = `${A4_PAGE_WIDTH}px`;
  stage.style.zIndex = '-9999';
  stage.style.opacity = '1';
  document.body.appendChild(stage);

  const measureBox = document.createElement('div');
  measureBox.style.width = `${CONTENT_WIDTH}px`;
  measureBox.style.boxSizing = 'border-box';
  stage.appendChild(measureBox);

  try {
    // 1. Extract and clone Header Block (Letterhead + Roll Number Grid + Metadata table)
    const headerEl = sourceEl.querySelector('.border-b-2');
    let headerClone: HTMLElement | null = null;
    let headerHeight = 0;

    if (headerEl) {
      headerClone = headerEl.cloneNode(true) as HTMLElement;
      // Ensure clean academic borders and spacing
      headerClone.style.marginBottom = '16px';
      measureBox.appendChild(headerClone);
      headerHeight = Math.ceil(headerClone.getBoundingClientRect().height);
      measureBox.removeChild(headerClone);
    }

    // 2. Extract School & Exam info for running headers on subsequent pages
    const schoolNameEl = sourceEl.querySelector('h1');
    const schoolName = schoolNameEl ? schoolNameEl.textContent?.trim() || 'ABC PUBLIC SCHOOL' : 'ABC PUBLIC SCHOOL';
    
    // Extract metadata labels from details grid
    const metaDivs = sourceEl.querySelectorAll('.grid > div');
    let examLabel = 'CBSE ASSESSMENT';
    if (metaDivs.length >= 2) {
      const classText = metaDivs[0]?.textContent?.replace('Class:', '').trim() || '';
      const subjectText = metaDivs[1]?.textContent?.replace('Subject:', '').trim() || '';
      examLabel = `${classText} • ${subjectText}`;
    }

    // 3. Extract and filter content chunks from .academic-prose
    interface PreparedChunk {
      element: HTMLElement;
      height: number;
      isSectionHeader: boolean;
    }

    const preparedChunks: PreparedChunk[] = [];
    const prose = sourceEl.querySelector('.academic-prose');
    const rawNodes: Element[] = [];

    if (prose && prose.children.length > 0) {
      Array.from(prose.children).forEach(child => rawNodes.push(child));
    } else {
      Array.from(sourceEl.children).forEach(child => {
        if (child !== headerEl) rawNodes.push(child);
      });
    }

    // Also look for verification note at bottom
    const verificationNote = sourceEl.querySelector('.border-t.border-slate-200:last-child');

    for (let i = 0; i < rawNodes.length; i++) {
      const raw = rawNodes[i];
      // Skip the verification note if it was captured in rawNodes to place it at the very end
      if (raw === verificationNote) continue;

      // Skip horizontal rule lines to avoid blank gaps
      if (raw.tagName && raw.tagName.toLowerCase() === 'hr') continue;

      const text = raw.textContent?.trim() || '';
      // Skip empty spacer divs or redundant PART 1 title
      if (!text && raw.children.length === 0) continue;
      if (/^#{0,3}\s*PART\s*1\s*:\s*STUDENT\s*QUESTION\s*PAPER/i.test(text)) continue;

      const clone = raw.cloneNode(true) as HTMLElement;
      // Add subtle academic margin
      clone.style.marginTop = '4px';
      clone.style.marginBottom = '4px';

      // If this is a question card, format it cleanly and compactly for A4 printing
      if (clone.classList.contains('print-question-block')) {
        clone.style.padding = '8px 12px';
        clone.style.borderRadius = '8px';
        clone.style.boxShadow = 'none';
        clone.style.border = '1px solid #cbd5e1';
        clone.style.backgroundColor = '#ffffff';
      }

      // Identify section headers (e.g. SECTION A, SECTION B)
      const isSectionHeader =
        clone.classList.contains('print-section-header') ||
        /^SECTION\s+[A-E]/i.test(text) ||
        /^#{1,4}\s*SECTION\s+[A-E]/i.test(text);

      measureBox.appendChild(clone);
      const measuredHeight = Math.ceil(clone.getBoundingClientRect().height);
      measureBox.removeChild(clone);

      if (measuredHeight > 0) {
        preparedChunks.push({
          element: clone,
          height: measuredHeight,
          isSectionHeader,
        });
      }
    }

    // Add verification note chunk
    if (verificationNote) {
      const noteClone = verificationNote.cloneNode(true) as HTMLElement;
      noteClone.style.marginTop = '16px';
      noteClone.style.marginBottom = '4px';
      measureBox.appendChild(noteClone);
      const noteHeight = Math.ceil(noteClone.getBoundingClientRect().height);
      measureBox.removeChild(noteClone);
      if (noteHeight > 0) {
        preparedChunks.push({
          element: noteClone,
          height: noteHeight,
          isSectionHeader: false,
        });
      }
    }

    // Clean up measurement box
    stage.removeChild(measureBox);

    // 4. Distribute chunks into A4 Pages using exact height budgeting
    const TOP_PADDING = 34; // px
    const BOTTOM_PADDING = 28; // px
    const FOOTER_HEIGHT = 22; // px
    const RUNNING_HEADER_HEIGHT = 26; // px for Page 2+

    // Available heights
    const PAGE_TOTAL_USABLE = A4_PAGE_HEIGHT - TOP_PADDING - BOTTOM_PADDING - FOOTER_HEIGHT; // ~1039px
    const PAGE1_USABLE = PAGE_TOTAL_USABLE - headerHeight - 12; // remaining height on Page 1
    const SUBSEQUENT_PAGE_USABLE = PAGE_TOTAL_USABLE - RUNNING_HEADER_HEIGHT - 12; // ~975px

    interface PageData {
      isFirstPage: boolean;
      chunks: HTMLElement[];
    }

    const pagesData: PageData[] = [];
    let currentPageIndex = 0;
    let currentRemaining = PAGE1_USABLE;

    pagesData.push({ isFirstPage: true, chunks: [] });

    for (let i = 0; i < preparedChunks.length; i++) {
      const chunk = preparedChunks[i];
      const neededHeight = chunk.height + 8; // chunk height + inter-chunk margin

      // Section Header Orphan Prevention:
      // If this is a section header, ensure it fits TOGETHER with the first question that follows!
      if (chunk.isSectionHeader && i + 1 < preparedChunks.length) {
        const nextQ = preparedChunks[i + 1];
        const combinedNeeded = chunk.height + nextQ.height + 20;

        if (combinedNeeded > currentRemaining && pagesData[currentPageIndex].chunks.length > 0) {
          // Does not fit together -> push section header to next page
          currentPageIndex++;
          currentRemaining = SUBSEQUENT_PAGE_USABLE;
          pagesData.push({ isFirstPage: false, chunks: [] });
        }
      }

      // Check if chunk exceeds remaining space on current page
      if (neededHeight > currentRemaining && pagesData[currentPageIndex].chunks.length > 0) {
        currentPageIndex++;
        currentRemaining = SUBSEQUENT_PAGE_USABLE;
        pagesData.push({ isFirstPage: false, chunks: [] });
      }

      pagesData[currentPageIndex].chunks.push(chunk.element);
      currentRemaining -= neededHeight;
    }

    const totalPages = pagesData.length;

    // 5. Construct DOM for each A4 Page container
    const pageContainers: HTMLElement[] = [];

    pagesData.forEach((pageData, pIdx) => {
      const pageNum = pIdx + 1;

      const pageDiv = document.createElement('div');
      pageDiv.className = 'pdf-a4-page';
      pageDiv.style.width = `${A4_PAGE_WIDTH}px`;
      pageDiv.style.height = `${A4_PAGE_HEIGHT}px`;
      pageDiv.style.maxHeight = `${A4_PAGE_HEIGHT}px`;
      pageDiv.style.backgroundColor = '#ffffff';
      pageDiv.style.color = '#0f172a';
      pageDiv.style.padding = `${TOP_PADDING}px ${HORIZONTAL_PADDING}px ${BOTTOM_PADDING}px ${HORIZONTAL_PADDING}px`;
      pageDiv.style.boxSizing = 'border-box';
      pageDiv.style.display = 'flex';
      pageDiv.style.flexDirection = 'column';
      pageDiv.style.justifyContent = 'space-between';
      pageDiv.style.overflow = 'hidden';
      pageDiv.style.fontFamily = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

      // Top container
      const topArea = document.createElement('div');
      topArea.style.flex = '1';
      topArea.style.display = 'flex';
      topArea.style.flexDirection = 'column';
      topArea.style.overflow = 'hidden';

      // Add full letterhead on Page 1
      if (pageData.isFirstPage && headerClone) {
        topArea.appendChild(headerClone.cloneNode(true));
      } else if (!pageData.isFirstPage) {
        // Add running header on Page 2+
        const runningHeader = document.createElement('div');
        runningHeader.style.borderBottom = '1.5px solid #0f172a';
        runningHeader.style.paddingBottom = '4px';
        runningHeader.style.marginBottom = '12px';
        runningHeader.style.fontSize = '10px';
        runningHeader.style.fontWeight = 'bold';
        runningHeader.style.textTransform = 'uppercase';
        runningHeader.style.letterSpacing = '0.04em';
        runningHeader.style.color = '#1e293b';
        runningHeader.style.display = 'flex';
        runningHeader.style.justifyContent = 'space-between';
        runningHeader.innerHTML = `<span>${schoolName}</span><span>${examLabel}</span>`;
        topArea.appendChild(runningHeader);
      }

      // Append content chunks
      pageData.chunks.forEach(chunkEl => {
        topArea.appendChild(chunkEl);
      });

      pageDiv.appendChild(topArea);

      // Bottom footer
      const footerDiv = document.createElement('div');
      footerDiv.style.paddingTop = '6px';
      footerDiv.style.borderTop = '1px solid #cbd5e1';
      footerDiv.style.fontSize = '10px';
      footerDiv.style.color = '#64748b';
      footerDiv.style.fontWeight = '600';
      footerDiv.style.display = 'flex';
      footerDiv.style.justifyContent = 'space-between';
      footerDiv.innerHTML = `
        <span>CBSE Affiliated Standard &bull; Official Academic Evaluation</span>
        <span>Page ${pageNum} of ${totalPages}</span>
      `;
      pageDiv.appendChild(footerDiv);

      stage.appendChild(pageDiv);
      pageContainers.push(pageDiv);
    });

    // 6. Render each page container into jsPDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let pIdx = 0; pIdx < pageContainers.length; pIdx++) {
      const pageEl = pageContainers[pIdx];

      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: A4_PAGE_WIDTH,
        windowHeight: A4_PAGE_HEIGHT,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (pIdx > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    pdf.save(cleanFilename);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  } finally {
    stage.remove();
  }
}
