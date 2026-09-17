import React from 'react';
import { Student, SchoolSettings } from '../../types';
import { Download, Printer, FileText, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { downloadConfirmationLetterPDF } from '../../utils/pdfGenerator';
import { printIsolatedElement } from '../../utils/printUtils';
import { SchoolLogo } from '../common/SchoolLogo';
import { SafeMediaImage } from '../common/SafeMediaImage';
import { HeadmasterSignatureDisplay } from '../common/HeadmasterSignatureDisplay';

interface ConfirmationLetterProps {
  student: Student;
  settings: SchoolSettings;
}

export const ConfirmationLetter: React.FC<ConfirmationLetterProps> = ({ student, settings }) => {
  const cardId = `confirmation-letter-${student.id}`;

  const handlePrint = () => {
    printIsolatedElement(cardId, `Admission_Confirmation_${student.name.replace(/\s+/g, '_')}`);
  };

  const handleDownload = () => {
    downloadConfirmationLetterPDF(student, settings);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex items-center justify-between no-print">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-700" />
          Official Admission Confirmation Letter
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            title="Print only this confirmation letter"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Download official confirmation letter as PDF"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Official Confirmation Letter Document Box */}
      <div
        id={cardId}
        className="bg-white rounded-2xl border-2 border-emerald-900 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto printable-card text-slate-900 font-sans"
      >
        {/* Header Banner */}
        <div className="text-center border-b-2 border-emerald-800 pb-4 space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <SchoolLogo logoUrl={settings.logoUrl} size="sm" showBorder={false} />
            <span>School Education & Literacy Department, Govt. of Sindh</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
            {settings.schoolName}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Taluka Kaloi, District Tharparkar @ Mithi • SEMIS Code: {settings.semisCode}
          </p>
          <div className="mt-2 inline-block bg-emerald-900 text-amber-300 font-extrabold text-xs px-5 py-1 rounded-full uppercase tracking-wider shadow-xs">
            OFFICIAL ADMISSION CONFIRMATION LETTER
          </div>
        </div>

        {/* Reference & Metadata Bar */}
        <div className="flex flex-wrap justify-between items-center text-xs font-mono py-2.5 border-b border-dashed border-slate-300 gap-2">
          <span>Letter Ref: <strong>GBHS/ADM/2026-{student.id.substring(0, 8)}</strong></span>
          <span className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded font-extrabold border border-red-200">
            ALLOTTED G.R. NO: {student.grNumber || 'PROVISIONAL'}
          </span>
          <span>Date: <strong>{student.admissionDate || new Date().toLocaleDateString('en-GB')}</strong></span>
        </div>

        {/* Particulars & Student Photo Grid */}
        <div className="my-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start justify-between">
          <div className="space-y-1.5 text-xs text-slate-800 flex-1">
            <p>
              <span className="text-slate-500 font-semibold inline-block w-32">Student Name:</span>
              <strong className="text-slate-950 text-sm">{student.name.toUpperCase()}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold inline-block w-32">Father&apos;s Name:</span>
              <strong className="text-slate-950">{student.fatherName.toUpperCase()}</strong>
            </p>
            <p>
              <span className="text-slate-500 font-semibold inline-block w-32">NADRA B-Form / CNIC:</span>
              <span className="font-mono font-bold text-slate-800">{student.cnicBForm}</span>
            </p>
            <p>
              <span className="text-slate-500 font-semibold inline-block w-32">Class & Section:</span>
              <strong className="text-emerald-800">{student.appliedClass}</strong>
              <span className="text-slate-600 font-semibold"> (Section: {student.section || 'A'}, Roll No: {student.rollNo || '01'})</span>
            </p>
            <p>
              <span className="text-slate-500 font-semibold inline-block w-32">Permanent Residence:</span>
              <span className="text-slate-700">
                {student.address?.houseNo ? `${student.address.houseNo}, ` : ''}
                {student.address?.mohVillage || student.address?.townCity || 'Village Mehrand'}, Taluka Kaloi, District Tharparkar
              </span>
            </p>
          </div>

          {/* Student Photo Box */}
          <div className="w-24 h-28 border-2 border-emerald-800 rounded-lg overflow-hidden bg-slate-100 shrink-0 self-center sm:self-start shadow-xs flex items-center justify-center">
            {student.studentPictureUrl && student.studentPictureUrl.trim() !== '' ? (
              <SafeMediaImage
                src={student.studentPictureUrl}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-1 text-[9px] text-slate-400 leading-tight">
                <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                <span>Affix Passport Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Letter Body Text */}
        <div className="text-xs text-slate-700 leading-relaxed space-y-3 py-1">
          <p className="font-bold text-emerald-950 uppercase border-b border-slate-200 pb-1">
            Subject: OFFICIAL CONFIRMATION OF ADMISSION IN {student.appliedClass.toUpperCase()}
          </p>
          <p>
            Respected Parent & Dear Student,
          </p>
          <p>
            We are pleased to inform you that following due verification of NADRA B-Form documents, educational records, and full compliance with institutional criteria established by the School Education & Literacy Department, Government of Sindh, admission has been formally <strong>APPROVED</strong> in <strong>{settings.schoolName}</strong> for the Academic Session 2026-2027.
          </p>
          <p>
            The student has been officially registered in the permanent School General Register under <strong className="text-red-700 font-mono text-xs">G.R. Number: {student.grNumber || 'PROVISIONAL'}</strong>. You are assigned to <strong>Section {student.section || 'A'}</strong> with <strong>Roll No. {student.rollNo || '01'}</strong>.
          </p>
          <p>
            By virtue of this admission, the student is entitled to government textbook distribution, classroom attendance, science and IT laboratory facilities, and eligibility for official board and annual examinations.
          </p>
        </div>

        {/* Instructions & Regulations Box */}
        <div className="my-3 bg-teal-50/60 border border-teal-200 rounded-xl p-3 text-[11px] text-slate-700 space-y-1">
          <p className="font-bold text-teal-900 uppercase">Institutional Guidelines:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
            <li>Strict compliance with the prescribed school uniform and punctuality is mandatory.</li>
            <li>A minimum of 75% attendance must be maintained for board and annual promotion eligibility.</li>
            <li>Preserve this confirmation letter and G.R. number for Identity Card, Enrollment, and Certificate issuance.</li>
          </ul>
        </div>

        {/* Signature & Seal Footer */}
        <div className="pt-6 mt-4 border-t border-slate-200 flex items-end justify-between text-xs text-slate-600">
          <div className="text-left space-y-1">
            <div className="w-32 border-b border-slate-300 pb-1"></div>
            <p className="font-bold text-slate-800">Admission Committee</p>
            <p className="text-[10px] text-slate-500">GBHS Mehrand, Taluka Kaloi</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center bg-white shadow-xs">
              <QrCode className="w-7 h-7 text-slate-800" />
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1">SEMIS: {settings.semisCode}</span>
          </div>

          <div className="text-right space-y-1">
            <HeadmasterSignatureDisplay
              signatureUrl={settings.headmasterSignatureUrl}
              headmasterName={settings.headmasterName}
              className="ml-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
