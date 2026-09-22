import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, ShieldCheck, Download, Copy, Check, ExternalLink, X, ZoomIn } from 'lucide-react';

interface IdCardQrCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  label?: string;
  holderName?: string;
  holderRole?: string;
  holderCode?: string; // GR# or PID
  className?: string;
  showModalOnClick?: boolean;
}

export const IdCardQrCode: React.FC<IdCardQrCodeProps> = ({
  value,
  size = 40,
  fgColor = '#064e3b',
  bgColor = '#ffffff',
  level = 'M',
  label,
  holderName,
  holderRole,
  holderCode,
  className = '',
  showModalOnClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const targetCanvas = modalCanvasRef.current || canvasRef.current;
    if (!targetCanvas) return;
    const dataUrl = targetCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `QR_${(holderName || 'Identity').replace(/\s+/g, '_')}_${holderCode || 'Badge'}.png`;
    link.click();
  };

  return (
    <>
      <div
        className={`relative inline-flex flex-col items-center justify-center group ${showModalOnClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={showModalOnClick ? () => setIsOpen(true) : undefined}
        title={showModalOnClick ? 'Click to inspect & scan QR verification' : 'Official Identity QR Code'}
      >
        <div className="bg-white p-0.5 rounded border border-slate-300 shadow-2xs group-hover:border-emerald-600 transition-colors">
          <QRCodeCanvas
            ref={canvasRef}
            value={value}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
            level={level}
            marginSize={1}
          />
        </div>
        {label && (
          <span className="text-[7px] text-slate-500 font-mono mt-0.5 tracking-tight uppercase group-hover:text-emerald-800 font-bold">
            {label}
          </span>
        )}
        {showModalOnClick && (
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5 text-emerald-800 drop-shadow" />
          </div>
        )}
      </div>

      {/* Interactive QR Verification & Quick Scan Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn no-print"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 animate-scaleUp text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    Official Identity QR Code
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Quick Verification & Attendance Scanning
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Holder Badge */}
            {(holderName || holderCode) && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-0.5">
                <div className="font-extrabold text-sm text-slate-950">
                  {holderName}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  {holderRole && <span>{holderRole} • </span>}
                  <span className="font-mono font-bold text-emerald-800">
                    ID: {holderCode}
                  </span>
                </div>
              </div>
            )}

            {/* Enlarged QR Code Canvas */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-300">
              <div className="bg-white p-3 rounded-xl shadow-md border border-slate-200">
                <QRCodeCanvas
                  ref={modalCanvasRef}
                  value={value}
                  size={180}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="Q"
                  marginSize={2}
                />
              </div>
              <span className="mt-2 text-[9px] text-slate-500 font-mono text-center flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Scannable by any mobile camera or USB barcode reader
              </span>
            </div>

            {/* Actions: Download QR & Copy Payload */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Data</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Save PNG</span>
              </button>
            </div>

            {/* Quick explanation */}
            <div className="text-[10px] text-slate-400 text-center leading-tight">
              Encoded data contains official Sindh Education & Literacy Department credentials for rapid terminal attendance and identity validation.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
