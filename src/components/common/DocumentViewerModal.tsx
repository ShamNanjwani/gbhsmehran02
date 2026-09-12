import React from 'react';
import { X, Download, ExternalLink, FileText, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  title: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  title,
}) => {
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  if (!isOpen || !fileUrl) return null;

  const isPdf =
    fileUrl.startsWith('data:application/pdf') ||
    fileUrl.toLowerCase().includes('.pdf');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    const ext = isPdf ? 'pdf' : 'png';
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_document.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    // For data URLs or external links
    const win = window.open();
    if (win) {
      if (isPdf) {
        win.document.write(
          `<html><head><title>${title}</title></head><body style="margin:0;"><iframe width="100%" height="100%" src="${fileUrl}" frameborder="0"></iframe></body></html>`
        );
      } else {
        win.document.write(
          `<html><head><title>${title}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#111;"><img src="${fileUrl}" style="max-width:100%;max-height:100vh;" /></body></html>`
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPdf ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isPdf ? 'PDF Official Document' : 'High Resolution Image File'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPdf && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg mr-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono px-1 font-bold">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleOpenNewTab}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Download Document"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-slate-900/5 flex items-center justify-center min-h-[350px]">
          {isPdf ? (
            <div className="w-full h-[68vh] rounded-xl overflow-hidden bg-white border border-slate-300 shadow-inner flex flex-col">
              <object
                data={fileUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="p-8 text-center space-y-4 my-auto">
                  <FileText className="w-16 h-16 text-rose-600 mx-auto" />
                  <p className="font-extrabold text-slate-900">PDF Document Ready</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your browser does not support inline PDF preview. You can download or open the PDF in a new window.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Download PDF File
                  </button>
                </div>
              </object>
            </div>
          ) : (
            <div className="max-w-full max-h-[70vh] flex items-center justify-center overflow-hidden p-2">
              <img
                src={fileUrl}
                alt={title}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-lg border border-slate-300 bg-white"
              />
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-600 flex justify-between items-center">
          <span className="font-semibold text-emerald-900">
            Government Boys High School Mehrand (SEMIS: 406020752)
          </span>
          <span className="text-slate-500">Official Document Verification View</span>
        </div>
      </div>
    </div>
  );
};
