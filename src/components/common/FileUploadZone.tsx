import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  File,
  Image as ImageIcon,
} from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';

export interface FileUploadZoneProps {
  id?: string;
  label: string;
  value: string;
  onChange: (dataUrl: string, meta?: { name: string; size: number; type: string }) => void;
  accept?: string; // defaults to "image/*,application/pdf"
  required?: boolean;
  helperText?: string;
  previewShape?: 'square' | 'avatar' | 'banner' | 'document';
  badgeText?: string;
  maxSizeMB?: number; // defaults to 15MB
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  id,
  label,
  value,
  onChange,
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml,application/pdf',
  required = false,
  helperText = 'Upload in Image (PNG, JPG, WebP) or PDF format — no links needed',
  previewShape = 'square',
  badgeText,
  maxSizeMB = 15,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showViewer, setShowViewer] = useState(false);

  const isPdf =
    value?.startsWith('data:application/pdf') ||
    value?.toLowerCase().includes('.pdf');

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError('');

    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return;
    }

    // Determine type
    const isPdfType = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImageType = file.type.startsWith('image/');

    if (!isPdfType && !isImageType) {
      setError('Please upload an image (PNG, JPG, WebP) or PDF file.');
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setFileName(file.name);
    setFileSize(formattedSize);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result, {
        name: file.name,
        size: file.size,
        type: isPdfType ? 'application/pdf' : file.type,
      });
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileName('');
    setFileSize('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-1.5 text-xs w-full">
      {/* Label and Badge */}
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-800 flex items-center gap-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {badgeText && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            {badgeText}
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-1.5 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone / Preview Card */}
      {value ? (
        <div className="p-3 bg-white rounded-xl border-2 border-emerald-600/60 shadow-xs space-y-2.5 transition-all">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            {isPdf ? (
              <div
                onClick={() => setShowViewer(true)}
                className="w-14 h-16 rounded-lg bg-rose-50 border-2 border-rose-300 flex flex-col items-center justify-center p-1 cursor-pointer hover:bg-rose-100 transition shrink-0 shadow-xs"
                title="Click to preview PDF"
              >
                <FileText className="w-6 h-6 text-rose-600" />
                <span className="text-[9px] font-black text-rose-800 tracking-wider mt-0.5 uppercase">
                  PDF
                </span>
              </div>
            ) : previewShape === 'avatar' ? (
              <div
                onClick={() => setShowViewer(true)}
                className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-600 cursor-pointer hover:opacity-90 transition shrink-0 bg-slate-100 shadow-xs"
                title="Click to preview"
              >
                <img src={value} alt={label} className="w-full h-full object-cover" />
              </div>
            ) : previewShape === 'banner' ? (
              <div
                onClick={() => setShowViewer(true)}
                className="w-24 h-14 rounded-lg overflow-hidden border border-slate-300 cursor-pointer hover:opacity-90 transition shrink-0 bg-slate-100 shadow-xs"
                title="Click to preview"
              >
                <img src={value} alt={label} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                onClick={() => setShowViewer(true)}
                className="w-14 h-16 rounded-lg overflow-hidden border border-slate-300 cursor-pointer hover:opacity-90 transition shrink-0 bg-slate-100 shadow-xs"
                title="Click to preview"
              >
                <img src={value} alt={label} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                    isPdf
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isPdf ? 'PDF File' : 'Image File'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Attached
                </span>
              </div>
              <p className="font-bold text-slate-800 text-xs truncate">
                {fileName || `${label} (${isPdf ? 'Document.pdf' : 'Image.jpg'})`}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {fileSize ? fileSize : 'Uploaded to Portal'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowViewer(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Document
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={triggerSelect}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition"
                title="Select another file from device"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                Replace File
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                title="Remove file"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onClick={triggerSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-4 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-600 bg-slate-50/60 hover:bg-emerald-50/30'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
            <Upload className="w-5 h-5 text-emerald-700" />
          </div>

          <div className="space-y-0.5">
            <p className="font-extrabold text-slate-800 text-xs">
              <span className="text-emerald-700 underline">Click to Browse</span> or drag & drop file
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Supported formats: <strong className="text-slate-700 font-semibold">PDF, PNG, JPG, WebP</strong> (Max {maxSizeMB}MB)
            </p>
          </div>

          <div className="inline-flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              <FileText className="w-3 h-3 text-rose-500" /> PDF Document
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              <ImageIcon className="w-3 h-3 text-emerald-600" /> Image File
            </span>
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-[10px] text-slate-500 font-medium px-0.5">
        {helperText}
      </p>

      {/* Full Preview Modal */}
      {showViewer && (
        <DocumentViewerModal
          isOpen={showViewer}
          onClose={() => setShowViewer(false)}
          fileUrl={value}
          title={fileName || label}
        />
      )}
    </div>
  );
};
