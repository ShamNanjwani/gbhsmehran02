import React from 'react';
import { SafeMediaImage } from './SafeMediaImage';
import { CheckCircle } from 'lucide-react';

interface HeadmasterSignatureDisplayProps {
  signatureUrl?: string;
  label?: string;
  subLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HeadmasterSignatureDisplay: React.FC<HeadmasterSignatureDisplayProps> = ({
  signatureUrl,
  label = 'Headmaster Official Signature & Seal',
  subLabel = 'Govt. Boys High School Mehrand',
  className = '',
  size = 'md',
}) => {
  const heightClass = size === 'sm' ? 'h-7' : size === 'lg' ? 'h-14' : 'h-10';

  return (
    <div className={`text-center flex flex-col items-center justify-end ${className}`}>
      <div className={`${heightClass} w-full max-w-[140px] flex items-center justify-center relative mb-0.5 overflow-hidden`}>
        {signatureUrl ? (
          <SafeMediaImage
            src={signatureUrl}
            alt="Headmaster Authority Signature"
            className="w-full h-full object-contain filter contrast-125"
          />
        ) : (
          <div className="text-emerald-800 font-serif italic text-xs font-black tracking-wide flex items-center gap-1 opacity-85">
            <span>M. Ghulam Rasool</span>
            <CheckCircle className="w-3 h-3 text-emerald-700 inline" />
          </div>
        )}
      </div>
      <div className="w-full border-b border-dashed border-slate-400 mb-1"></div>
      <span className="font-extrabold text-emerald-950 block text-[9px] uppercase tracking-tight leading-tight">
        {label}
      </span>
      {subLabel && (
        <span className="text-[8px] text-slate-500 block leading-tight font-medium">
          {subLabel}
        </span>
      )}
    </div>
  );
};
