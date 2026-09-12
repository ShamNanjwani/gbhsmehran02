import React from 'react';
import { Student, SchoolSettings } from '../../types';
import { Download, Printer, FileText, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { downloadEnrollmentCardPDF } from '../../utils/pdfGenerator';

interface EnrollmentCardProps {
  student: Student;
  settings: SchoolSettings;
}

export const EnrollmentCard: React.FC<EnrollmentCardProps> = ({ student, settings }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadEnrollmentCardPDF(student, settings);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-700" />
          Official Enrollment & Exam Admission Slip
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

      {/* Enrollment Card Format: Landscape Official Slip */}
      <div className="bg-white rounded-2xl border-2 border-emerald-900 p-6 shadow-xl relative overflow-hidden text-slate-900 font-sans max-w-2xl mx-auto printable-card">
        {/* Top Header */}
        <div className="border-b-2 border-emerald-800 pb-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <span>School Education & Literacy Department Sindh</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
            {settings.schoolName}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Taluka Kaloi, District Tharparkar @ Mithi • SEMIS: {settings.semisCode}
          </p>
          <div className="inline-block bg-amber-500 text-slate-950 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wide mt-1">
            ANNUAL ENROLLMENT & EXAMINATION ADMISSION CARD
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 py-6 items-start">
          {/* Photo & Validity Column */}
          <div className="sm:col-span-1 flex flex-col items-center text-center space-y-2">
            <div className="w-28 h-32 rounded-xl overflow-hidden border-2 border-emerald-700 shadow-md bg-slate-100">
              <img
                src={student.studentPictureUrl}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[10px] space-y-0.5">
              <span className="text-emerald-800 font-bold block">Status</span>
              <span className="font-extrabold text-emerald-900 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Student
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="sm:col-span-3 space-y-2 text-xs">
            <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-red-700 uppercase">General Register (GR) Number</span>
                <p className="text-sm sm:text-base font-mono font-black text-red-900">
                  {student.grNumber || 'GR-406020752-PENDING'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Class & Section</span>
                <p className="text-xs font-extrabold text-slate-900">
                  {student.appliedClass} ({student.section || 'A'})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Student Full Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{student.name}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Father's Name</span>
                <span className="font-bold text-slate-800">{student.fatherName}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">CNIC / B-Form No</span>
                <span className="font-mono font-bold text-slate-800">{student.cnicBForm}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Roll Number</span>
                <span className="font-bold text-slate-800">{student.rollNo || '01'}</span>
              </div>
            </div>

            {/* Validity date explicitly set by Admin */}
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold block uppercase text-amber-800">
                    Enrollment Validity (Set by Admin)
                  </span>
                  <span className="font-extrabold text-xs">
                    {settings.enrollmentCardValidTill}
                  </span>
                </div>
              </div>
              <QrCode className="w-7 h-7 text-amber-800" />
            </div>

            <div className="text-[11px] text-slate-500 pt-1">
              <strong>Address: </strong>
              {student.address.houseNo}, {student.address.mohVillage}, {student.address.townCity}, {student.address.district}
            </div>
          </div>
        </div>

        {/* Footer Signatures */}
        <div className="border-t border-slate-200 pt-6 mt-2 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-600">
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-medium">Class Teacher / Incharge</span>
          </div>
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-medium">Student Signature / Thumb</span>
          </div>
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-bold text-emerald-950">Headmaster Official Seal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
