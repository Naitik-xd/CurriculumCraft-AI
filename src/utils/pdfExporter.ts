import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

/**
 * Intelligent multi-page A4 PDF exporter:
 * - Collects atomic question blocks and section headers
 * - Paginates cleanly onto 210mm x 297mm A4 sheets
 * - Eliminates horizontal question cutting / slicing across page boundaries
 * - Preserves KaTeX equations and high-DPI math formatting
 * - Fully supports Tailwind v4 modern oklch / lab color spaces via html2canvas-pro
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

  // Create staging container offscreen
  const stage = document.createElement('div');
  stage.style.position = 'fixed';
  stage.style.left = '-9999px';
  stage.style.top = '0';
  stage.style.width = '794px'; // 210mm at 96 DPI
  stage.style.zIndex = '-9999';
  stage.style.opacity = '1';
  document.body.appendChild(stage);

  try {
    // Collect printable chunks from source element
    const chunks: HTMLElement[] = [];

    // Look for header element
    const headerBlock = sourceEl.querySelector('.border-b-2');
    if (headerBlock) {
      chunks.push(headerBlock.cloneNode(true) as HTMLElement);
    }

    // Look for academic prose children (instructions, sections, questions)
    const prose = sourceEl.querySelector('.academic-prose');
    if (prose && prose.children.length > 0) {
      Array.from(prose.children).forEach((child) => {
        chunks.push(child.cloneNode(true) as HTMLElement);
      });
    } else {
      // Fallback: use direct children of source
      Array.from(sourceEl.children).forEach((child) => {
        if (child !== headerBlock) {
          chunks.push(child.cloneNode(true) as HTMLElement);
        }
      });
    }

    // If no chunks found, fallback to cloning source
    if (chunks.length === 0) {
      chunks.push(sourceEl.cloneNode(true) as HTMLElement);
    }

    // Extract school info for running header on subsequent pages
    const schoolNameEl = sourceEl.querySelector('h1');
    const schoolName = schoolNameEl ? schoolNameEl.textContent || 'CBSE ASSESSMENT' : 'CBSE ASSESSMENT';

    // A4 dimensions: 794px width x 1123px height
    const PAGE_HEIGHT = 1123;
    const MAX_CONTENT_HEIGHT = 1000; // Leaving room for page header/footer and padding

    interface PageContainer {
      pageDiv: HTMLDivElement;
      contentDiv: HTMLDivElement;
      footerDiv: HTMLDivElement;
    }

    const pages: PageContainer[] = [];

    const createNewPage = (pageNumber: number): PageContainer => {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'pdf-a4-page';
      pageDiv.style.width = '794px';
      pageDiv.style.height = `${PAGE_HEIGHT}px`;
      pageDiv.style.maxHeight = `${PAGE_HEIGHT}px`;
      pageDiv.style.backgroundColor = '#ffffff';
      pageDiv.style.color = '#0f172a';
      pageDiv.style.padding = '34px 40px 24px 40px';
      pageDiv.style.boxSizing = 'border-box';
      pageDiv.style.display = 'flex';
      pageDiv.style.flexDirection = 'column';
      pageDiv.style.justifyContent = 'space-between';
      pageDiv.style.overflow = 'hidden';
      pageDiv.style.fontFamily = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

      // Top running header for Page 2+
      if (pageNumber > 1) {
        const runningHeader = document.createElement('div');
        runningHeader.style.borderBottom = '1.5px solid #0f172a';
        runningHeader.style.paddingBottom = '4px';
        runningHeader.style.marginBottom = '12px';
        runningHeader.style.fontSize = '10px';
        runningHeader.style.fontWeight = 'bold';
        runningHeader.style.textTransform = 'uppercase';
        runningHeader.style.letterSpacing = '0.05em';
        runningHeader.style.color = '#334155';
        runningHeader.style.display = 'flex';
        runningHeader.style.justifyContent = 'space-between';
        runningHeader.innerHTML = `<span>${schoolName}</span><span>CBSE Assessment Examination</span>`;
        pageDiv.appendChild(runningHeader);
      }

      const contentDiv = document.createElement('div');
      contentDiv.className = 'pdf-content-area';
      contentDiv.style.flex = '1';
      contentDiv.style.display = 'flex';
      contentDiv.style.flexDirection = 'column';
      contentDiv.style.overflow = 'hidden';
      pageDiv.appendChild(contentDiv);

      const footerDiv = document.createElement('div');
      footerDiv.className = 'pdf-page-footer';
      footerDiv.style.paddingTop = '8px';
      footerDiv.style.borderTop = '1px solid #cbd5e1';
      footerDiv.style.fontSize = '10px';
      footerDiv.style.color = '#64748b';
      footerDiv.style.fontWeight = '500';
      footerDiv.style.display = 'flex';
      footerDiv.style.justifyContent = 'space-between';
      pageDiv.appendChild(footerDiv);

      stage.appendChild(pageDiv);
      return { pageDiv, contentDiv, footerDiv };
    };

    let currentPage = createNewPage(1);
    pages.push(currentPage);

    // Distribute chunks across pages without splitting questions
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      currentPage.contentDiv.appendChild(chunk);

      // Check if chunk causes overflow
      if (currentPage.contentDiv.scrollHeight > MAX_CONTENT_HEIGHT && currentPage.contentDiv.children.length > 1) {
        // Remove from current page and create next page
        currentPage.contentDiv.removeChild(chunk);

        currentPage = createNewPage(pages.length + 1);
        pages.push(currentPage);

        currentPage.contentDiv.appendChild(chunk);
      }
    }

    // Set page footers with total count
    const totalPages = pages.length;
    pages.forEach((p, idx) => {
      const pageNum = idx + 1;
      p.footerDiv.innerHTML = `
        <span>CBSE Affiliated Standard &bull; Official Evaluation</span>
        <span>Page ${pageNum} of ${totalPages}</span>
      `;
    });

    // Initialize jsPDF A4 document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Render each page into jsPDF
    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      const pageContainer = pages[pIdx];

      const canvas = await html2canvas(pageContainer.pageDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        windowHeight: PAGE_HEIGHT,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (pIdx > 0) {
        pdf.addPage();
      }

      // Add full A4 page: 210mm x 297mm
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    pdf.save(cleanFilename);
    return true;
  } catch (err) {
    console.error('Intelligent PDF generation error:', err);
    return false;
  } finally {
    stage.remove();
  }
}
