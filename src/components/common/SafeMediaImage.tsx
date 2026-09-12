import React, { useState } from 'react';
import { FileText, User, Eye } from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';

interface SafeMediaImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackIcon?: 'user' | 'doc';
  allowPdfPreview?: boolean;
}

export const SafeMediaImage: React.FC<SafeMediaImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackIcon = 'user',
  allowPdfPreview = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const isPdf =
    src?.startsWith('data:application/pdf') ||
    src?.toLowerCase().includes('.pdf');

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
        {fallbackIcon === 'user' ? (
          <User className="w-1/2 h-1/2 text-slate-400" />
        ) : (
          <FileText className="w-1/2 h-1/2 text-slate-400" />
        )}
      </div>
    );
  }

  if (isPdf) {
    return (
      <>
        <div
          onClick={(e) => {
            if (allowPdfPreview) {
              e.stopPropagation();
              setIsViewerOpen(true);
            }
          }}
          className={`w-full h-full flex flex-col items-center justify-center bg-rose-50 text-rose-700 p-2 text-center select-none ${
            allowPdfPreview ? 'cursor-pointer hover:bg-rose-100 transition' : ''
          }`}
          title={`${alt} (Uploaded PDF Document - Click to view)`}
        >
          <FileText className="w-6 h-6 text-rose-600 mb-1" />
          <span className="text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white px-1.5 py-0.5 rounded">
            PDF
          </span>
          {allowPdfPreview && (
            <span className="text-[8px] text-rose-800 font-semibold mt-0.5 flex items-center gap-0.5">
              <Eye className="w-2.5 h-2.5" /> View
            </span>
          )}
        </div>

        {allowPdfPreview && (
          <DocumentViewerModal
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            fileUrl={src}
            title={alt}
          />
        )}
      </>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
