import React from 'react';
import { Student, SchoolSettings } from '../../types';
import { Download, Printer, Shield, GraduationCap, QrCode } from 'lucide-react';
import { downloadStudentIdCardPDF } from '../../utils/pdfGenerator';
import { SchoolLogo } from '../common/SchoolLogo';
import { SafeMediaImage } from '../common/SafeMediaImage';

interface StudentIdCardProps {
  student: Student;
  settings: SchoolSettings;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({ student, settings }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadStudentIdCardPDF(student, settings);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-700" />
          Official Student Identity Card
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download PDF
          </button>
        </div>
      </div>

      {/* ID Card Box: Dimension formatted to standard plastic badge */}
      <div className="max-w-xs mx-auto bg-white rounded-2xl border-2 border-emerald-800 shadow-xl overflow-hidden font-sans text-slate-900 printable-card">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-3 text-center border-b-2 border-amber-400 relative">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <SchoolLogo logoUrl={settings.logoUrl} size="sm" showBorder={false} />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200">
              GOVERNMENT OF SINDH
            </span>
          </div>
          <h5 className="font-black text-xs sm:text-sm tracking-tight leading-tight uppercase">
            {settings.schoolName}
          </h5>
          <p className="text-[9px] text-amber-300 font-mono font-bold">
            SEMIS CODE: {settings.semisCode} • KALOI
          </p>
          <div className="mt-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold uppercase py-0.5 px-2 rounded-full inline-block">
            STUDENT IDENTITY CARD
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Photo & GR Badge */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-emerald-700 shadow-sm shrink-0 bg-slate-100">
              <SafeMediaImage
                src={student.studentPictureUrl}
                alt={student.name}
              />
            </div>
            <div className="space-y-1 flex-1">
              <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded text-center">
                <span className="text-[9px] uppercase font-bold block">G.R. Number</span>
                <span className="text-xs font-mono font-extrabold">{student.grNumber || 'PENDING'}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-center">
                <span className="text-[9px] font-bold">Class: </span>
                <span className="text-xs font-extrabold">{student.appliedClass}</span>
              </div>
            </div>
          </div>

          {/* Student Name */}
          <div className="text-center border-b border-slate-200 pb-2">
            <h6 className="font-extrabold text-base text-slate-950 tracking-tight">
              {student.name.toUpperCase()}
            </h6>
            <p className="text-xs text-slate-600 font-medium">S/O {student.fatherName}</p>
          </div>

          {/* Field Details */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Roll No:</span>
              <span className="font-bold text-slate-800">{student.rollNo || '01'} (Section: {student.section || 'A'})</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">B-Form / CNIC:</span>
              <span className="font-mono font-bold text-slate-800">{student.cnicBForm}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">D.O.B:</span>
              <span className="font-medium text-slate-800">{student.dob}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Blood Group:</span>
              <span className="font-bold text-red-600">{student.bloodGroup || 'B+'}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Emergency Cell:</span>
              <span className="font-mono font-bold text-slate-800">{student.fatherMobile}</span>
            </div>
            <div className="pt-0.5 text-[10px] text-slate-600 leading-tight">
              <span className="text-slate-400 font-semibold">Address: </span>
              {student.address.mohVillage}, {student.address.townCity}
            </div>
          </div>

          {/* Signatures & Barcode */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
            <div className="text-center">
              <div className="h-6 border-b border-dashed border-slate-400 w-16 mb-0.5"></div>
              <span>Student Sign</span>
            </div>
            <div className="w-7 h-7 text-slate-700">
              <QrCode className="w-full h-full text-emerald-800" />
            </div>
            <div className="text-center">
              <div className="h-6 border-b border-dashed border-slate-400 w-20 mb-0.5"></div>
              <span className="font-bold text-emerald-900">Headmaster Seal</span>
            </div>
          </div>
        </div>

        {/* Card Footer Stripe */}
        <div className="bg-emerald-950 text-white text-[8px] py-1 text-center font-mono">
          GBHS MEHRAND • IF FOUND RETURN TO SCHOOL OFFICE
        </div>
      </div>
    </div>
  );
};
