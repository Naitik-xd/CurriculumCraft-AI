import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

/**
 * Client-side high-fidelity PDF generator using html2canvas-pro (with full oklch / lab support)
 * and jsPDF for authentic A4 downloadable PDF documents.
 */
export async function downloadPdfFromElement(elementId: string, filename: string): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element #${elementId} not found for PDF export.`);
      return false;
    }

    const cleanFilename = filename.endsWith('.pdf')
      ? filename
      : `${filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_')}.pdf`;

    // High-resolution canvas capture with oklch and modern CSS color gamut support
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    const pageContentHeight = pdfHeight - margin * 2;

    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    // Add first page
    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= pageContentHeight;

    // Multi-page document handling for comprehensive CBSE papers
    while (heightLeft > 2) {
      position = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageContentHeight;
    }

    pdf.save(cleanFilename);
    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  }
}
