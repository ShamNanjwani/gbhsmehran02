import React, { useState } from 'react';
import { GraduationCap, Shield, FileText } from 'lucide-react';

interface SchoolLogoProps {
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  logoUrl,
  size = 'md',
  className = '',
  showBorder = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const isPdf =
    logoUrl?.startsWith('data:application/pdf') ||
    logoUrl?.toLowerCase().includes('.pdf');

  // If valid image provided and no loading error
  if (logoUrl && !imgError && !isPdf) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-sm shrink-0 ${
          showBorder ? 'border-2 border-amber-400/90' : ''
        } ${className}`}
      >
        <img
          src={logoUrl}
          alt="School Official Logo"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // If PDF was uploaded as logo
  if (isPdf) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white flex flex-col items-center justify-center p-1 shadow-md shrink-0 border-2 border-rose-400 ${className}`}
        title="Official School Emblem (PDF Uploaded)"
      >
        <FileText className={`${iconSizes[size]} text-amber-300`} />
        {size !== 'sm' && (
          <span className="text-[7px] font-black uppercase text-amber-200 tracking-tighter">
            SEAL
          </span>
        )}
      </div>
    );
  }

  // Official Fallback Emblem
  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-1.5 text-white shadow-md flex items-center justify-center shrink-0 ${
        showBorder ? 'border-2 border-amber-400/90' : ''
      } ${className}`}
      title="Government Boys High School Mehrand"
    >
      <GraduationCap className={`${iconSizes[size]} text-amber-300`} />
    </div>
  );
};
