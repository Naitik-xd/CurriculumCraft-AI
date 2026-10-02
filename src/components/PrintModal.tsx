import React, { useState } from 'react';
import { executePrint } from '../utils/printHelper';
import { downloadPdfFromElement } from '../utils/pdfExporter';
import { Printer, FileDown, Copy, Check, X, FileText, Loader2 } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  targetContainerId: string;
  markdownContent: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  title,
  targetContainerId,
  markdownContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    executePrint(title);
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setPdfSuccess(false);
    try {
      const cleanName = title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const ok = await downloadPdfFromElement(targetContainerId, cleanName);
      if (ok) {
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3000);
      }
    } catch (e) {
      console.error('PDF export error:', e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Download PDF & Print
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Generates authentic A4 PDF file &bull; Official CBSE Format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Options */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">
              Document: {title}
            </span>
            <span>
              Click <strong>"Download PDF Document"</strong> below to download a pristine, print-ready PDF directly to your device.
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Primary Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-md shadow-rose-500/20 disabled:opacity-60"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Converting & Downloading PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span className="text-white">PDF Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-white" />
                  <span>Download PDF Document (.pdf)</span>
                </>
              )}
            </button>

            {/* Direct Browser Print Dialog */}
            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-4 rounded-xl text-slate-800 font-bold text-xs border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Open Print Dialog (Ctrl + P / Cmd + P)</span>
            </button>

            {/* Copy markdown */}
            <button
              onClick={handleCopy}
              className="w-full py-2 px-4 rounded-xl text-slate-600 font-medium text-xs hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Markdown Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Raw Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>A4 210 x 297mm &bull; Vector Math</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
