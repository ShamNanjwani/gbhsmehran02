import React, { useState } from 'react';
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  IdCard,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { printIsolatedElement } from '../../utils/printUtils';

export interface DocumentParticular {
  label: string;
  value: string | React.ReactNode;
  badge?: string;
  highlight?: boolean;
}

export interface DocumentPrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'student-id' | 'teacher-id' | 'joining-letter' | 'confirmation-letter' | 'generic';
  title: string;
  subtitle?: string;
  elementIdToPrint: string;
  printDocumentTitle: string;
  holderName?: string;
  holderPhotoUrl?: string;
  particulars: DocumentParticular[];
  onDownloadPdf?: () => void;
  downloadPdfLabel?: string;
  children: React.ReactNode;
  instructionsNote?: string;
}

export const DocumentPrintPreviewModal: React.FC<DocumentPrintPreviewModalProps> = ({
  isOpen,
  onClose,
  documentType,
  title,
  subtitle,
  elementIdToPrint,
  printDocumentTitle,
  holderName,
  holderPhotoUrl,
  particulars,
  onDownloadPdf,
  downloadPdfLabel = 'Download PDF',
  children,
  instructionsNote,
}) => {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [hasTriggeredPrint, setHasTriggeredPrint] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.15, 1.45));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 0.15, 0.75));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
  };

  const handleConfirmAndPrint = () => {
    setIsPrinting(true);
    setHasTriggeredPrint(true);
    // Brief timeout so UI registers the action before system dialog takes focus
    setTimeout(() => {
      printIsolatedElement(elementIdToPrint, printDocumentTitle);
      setIsPrinting(false);
    }, 150);
  };

  const getDocTypeBadge = () => {
    switch (documentType) {
      case 'student-id':
        return {
          label: 'Official Student PVC Identity Card',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: IdCard,
        };
      case 'teacher-id':
        return {
          label: 'Official Faculty & Staff Identity Badge',
          color: 'bg-teal-100 text-teal-900 border-teal-300',
          icon: IdCard,
        };
      case 'joining-letter':
        return {
          label: 'Official Institutional Joining & Charge Report',
          color: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: FileText,
        };
      case 'confirmation-letter':
        return {
          label: 'Official Admission Confirmation Letter',
          color: 'bg-blue-100 text-blue-950 border-blue-300',
          icon: FileText,
        };
      default:
        return {
          label: 'Official Institutional Document',
          color: 'bg-slate-100 text-slate-900 border-slate-300',
          icon: FileText,
        };
    }
  };

  const badgeInfo = getDocTypeBadge();
  const BadgeIcon = badgeInfo.icon;

  return (
    <div
      id="document-print-preview-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="document-print-preview-modal-content"
        className="bg-white rounded-3xl max-w-5xl w-full border border-slate-300 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] animate-in fade-in zoom-in duration-200"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <SchoolLogo size="sm" showLabel={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-300 uppercase font-black tracking-widest block leading-tight">
                  GBHS MEHRAND • OFFICIAL VERIFICATION & PRINT PREVIEW
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{title}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition"
              aria-label="Close preview modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Alert Banner */}
        <div className="bg-emerald-50/90 border-b border-emerald-200 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Please review and verify all official details below before triggering system print.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeInfo.color}`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{badgeInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Modal Body: Scrollable area containing Particulars & Live Document Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
          {/* Particulars Verification Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Verified Institutional Particulars
              </h4>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Authorized By Headmaster • Govt. of Sindh
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              {particulars.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition ${
                    item.highlight
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block truncate">
                    {item.label}
                  </span>
                  <div className="font-extrabold text-slate-900 mt-0.5 text-xs truncate">
                    {item.value || 'N/A'}
                  </div>
                  {item.badge && (
                    <span className="inline-block mt-1 text-[9px] font-bold font-mono px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document Preview Stage */}
          <div className="space-y-2">
            {/* Toolbar for preview zoom & orientation note */}
            <div className="flex items-center justify-between px-2 text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-600">
                Live Document Print Layout Preview
              </span>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  onClick={handleZoomOut}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold px-1.5 text-slate-700">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 rounded"
                  title="Reset 100%"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Document Render Canvas */}
            <div className="bg-slate-200/80 rounded-2xl p-4 sm:p-8 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-x-auto min-h-[340px]">
              <div
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="shadow-xl rounded-2xl"
              >
                {children}
              </div>
            </div>
          </div>

          {/* Helpful Print Dialog Instructions */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">
                System Print Tip:
              </span>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                {instructionsNote ||
                  'In the upcoming system print dialog, make sure to set Margins to "None" or "Default" and check "Background graphics" to ensure the official Sindh Government green borders and watermark seals print with crisp color.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-white px-5 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            {hasTriggeredPrint ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                System print dialog initiated. You can reprint or close when done.
              </span>
            ) : (
              <span>Verified and ready for system printer or PDF generation.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Cancel
            </button>

            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>{downloadPdfLabel}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirmAndPrint}
              disabled={isPrinting}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{isPrinting ? 'Opening Print Dialog...' : 'Confirm & Print Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
