import React from 'react';
import { Teacher, SchoolSettings } from '../../types';
import { Download, Printer, Shield, QrCode, Award } from 'lucide-react';
import { downloadTeacherIdCardPDF } from '../../utils/pdfGenerator';
import { SchoolLogo } from '../common/SchoolLogo';
import { SafeMediaImage } from '../common/SafeMediaImage';
import { HeadmasterSignatureDisplay } from '../common/HeadmasterSignatureDisplay';

interface TeacherIdCardProps {
  teacher: Teacher;
  settings: SchoolSettings;
}

export const TeacherIdCard: React.FC<TeacherIdCardProps> = ({ teacher, settings }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadTeacherIdCardPDF(teacher, settings);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-700" />
          Official Teacher & Staff Identity Card
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print ID Card
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download PDF
          </button>
        </div>
      </div>

      {/* ID Card Box: Formatted to official standard staff badge */}
      <div className="max-w-xs mx-auto bg-white rounded-2xl border-2 border-teal-900 shadow-xl overflow-hidden font-sans text-slate-900 printable-card">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-900 text-white p-3 text-center border-b-2 border-amber-400 relative">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <SchoolLogo logoUrl={settings.logoUrl} size="sm" showBorder={false} />
            <span className="text-[9px] font-black uppercase tracking-widest text-teal-200">
              GOVERNMENT OF SINDH
            </span>
          </div>
          <h5 className="font-black text-xs sm:text-sm tracking-tight leading-tight uppercase">
            {settings.schoolName}
          </h5>
          <p className="text-[9px] text-amber-300 font-mono font-bold">
            SEMIS CODE: {settings.semisCode} • TALUKA KALOI
          </p>
          <div className="mt-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold uppercase py-0.5 px-2.5 rounded-full inline-block">
            FACULTY IDENTITY CARD
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Photo & Designation Badge */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-teal-700 shadow-sm shrink-0 bg-slate-100">
              <SafeMediaImage
                src={teacher.pictureUrl}
                alt={teacher.name}
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="bg-teal-50 border border-teal-200 text-teal-900 px-2 py-1 rounded text-center">
                <span className="text-[9px] uppercase font-bold text-teal-700 block">Cadre / Post</span>
                <span className="text-xs font-black">{teacher.designation}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded text-center">
                <span className="text-[9px] font-bold block text-amber-700">PID Number:</span>
                <span className="text-xs font-mono font-black">{teacher.pid}</span>
              </div>
            </div>
          </div>

          {/* Teacher Name */}
          <div className="text-center border-b border-slate-200 pb-2">
            <h6 className="font-extrabold text-base text-slate-950 tracking-tight">
              {teacher.name.toUpperCase()}
            </h6>
            <p className="text-xs text-slate-600 font-medium">S/O {teacher.fatherName}</p>
          </div>

          {/* Field Details */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Specialization:</span>
              <span className="font-bold text-teal-900 text-right">{teacher.subjectSpecialist}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Qualification:</span>
              <span className="font-medium text-slate-800 text-right">{teacher.qualification}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">CNIC Number:</span>
              <span className="font-mono font-bold text-slate-800">{teacher.cnic}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Mobile Number:</span>
              <span className="font-mono font-bold text-slate-800">{teacher.mobileNo}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Official Email:</span>
              <span className="font-mono text-[10px] text-slate-800 truncate max-w-[170px]">{teacher.email}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Status:</span>
              <span className="font-black text-teal-800 uppercase text-[10px]">
                {teacher.status === 'approved' ? 'Verified Government Faculty' : teacher.status}
              </span>
            </div>
          </div>

          {/* Signatures with Headmaster Signature / Stamp */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-3 items-end gap-1 text-[9px] text-slate-500">
            <div className="text-center">
              <div className="h-6 border-b border-dashed border-slate-400 w-16 mx-auto mb-0.5"></div>
              <span>Teacher Sign</span>
            </div>
            <div className="flex justify-center items-center pb-1">
              <div className="w-8 h-8 text-teal-900">
                <QrCode className="w-full h-full text-teal-900" />
              </div>
            </div>
            <HeadmasterSignatureDisplay
              signatureUrl={settings.headmasterSignatureUrl}
              headmasterName={settings.headmasterName}
              label="Headmaster Seal"
              subLabel="Authority Sign"
              size="sm"
            />
          </div>
        </div>

        {/* Card Footer Stripe */}
        <div className="bg-teal-950 text-white text-[8px] py-1 text-center font-mono">
          SCHOOL EDUCATION & LITERACY DEPT • SINDH
        </div>
      </div>
    </div>
  );
};
