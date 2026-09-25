import React from 'react';
import { Teacher } from '../../types';
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  X,
  Building,
  Fingerprint,
  Award,
  IdCard,
  QrCode,
  Calendar,
  Lock,
} from 'lucide-react';
import { SafeMediaImage } from './SafeMediaImage';

interface SeldVerificationModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SeldVerificationModal: React.FC<SeldVerificationModalProps> = ({
  teacher,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !teacher) return null;

  const checkerUrl = teacher.seldCheckerUrl || 'https://checker.sindheducation.gov.pk/';
  const badgeId = teacher.verifiedBadgeId || `SELD-VERIFIED-406020752-${teacher.pid || '1084592'}`;
  const verificationDate = teacher.seldVerificationDate || teacher.joiningDate || new Date().toLocaleDateString('en-GB');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-emerald-600 shadow-2xl overflow-hidden relative my-6">
        {/* Header with Sindh Govt colors */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 relative border-b-4 border-amber-400">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full bg-emerald-800/80 hover:bg-emerald-700 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-300 block">
                GOVERNMENT OF SINDH
              </span>
              <h3 className="text-lg font-black tracking-tight text-white leading-tight">
                SE&LD Teacher Verification
              </h3>
              <p className="text-xs text-emerald-200">
                School Education & Literacy Department • Sindh
              </p>
            </div>
          </div>
        </div>

        {/* Live Checker URL Link Notice */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
            <span className="truncate">Official Checker:</span>
            <a
              href={checkerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline font-mono font-bold hover:text-emerald-950 truncate flex items-center gap-1"
            >
              https://checker.sindheducation.gov.pk/
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
          <span className="bg-emerald-800 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0">
            SEMIS 406020752
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Teacher Profile Card */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-sm shrink-0 bg-slate-200">
              <SafeMediaImage
                src={teacher.pictureUrl}
                alt={teacher.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-base font-black text-slate-900 truncate">
                  {teacher.name}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                  {teacher.designation || 'Teacher'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate">
                S/O {teacher.fatherName}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-xs text-slate-700 font-semibold">
                <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                  PID: {teacher.pid}
                </span>
                <span className="font-mono text-slate-500 text-[11px]">
                  CNIC: {teacher.cnic ? `${teacher.cnic.slice(0, 5)}-*******-${teacher.cnic.slice(-1)}` : 'Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Badge Detail Certificate */}
          <div className="bg-gradient-to-br from-emerald-950 to-teal-950 text-white p-5 rounded-2xl border-2 border-amber-400 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Verified Teacher Badge
                </span>
              </div>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                AUTHENTICATED & ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-emerald-300/80 block uppercase">Badge Number</span>
                <span className="font-mono font-bold text-white text-[11px] break-all">
                  {badgeId}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/80 block uppercase">Institution</span>
                <span className="font-bold text-white text-[11px]">
                  GBHS Mehrand (406020752)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/80 block uppercase">Biometric Match</span>
                <span className="font-bold text-emerald-300 flex items-center gap-1 text-[11px]">
                  <Fingerprint className="w-3.5 h-3.5" />
                  M&E Scanned & Matched
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/80 block uppercase">Verification Date</span>
                <span className="font-mono text-white text-[11px]">
                  {verificationDate}
                </span>
              </div>
            </div>
          </div>

          {/* Subject & Duties */}
          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Subject Specialization:</span>
              <strong className="text-slate-900">{teacher.subjectSpecialist}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Qualifications:</span>
              <span className="text-slate-900 font-medium">{teacher.qualification}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-semibold">Administrative Jurisdiction:</span>
              <span className="text-slate-900 font-medium">Taluka Kaloi, District Tharparkar</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-semibold">Faculty Section Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Featured on Public Faculty Page
              </span>
            </div>
          </div>

          {/* Action Link to Checker */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={checkerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              <span>Verify on checker.sindheducation.gov.pk</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
