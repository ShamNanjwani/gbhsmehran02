import React, { useState } from 'react';
import { Student, SchoolSettings } from '../../types';
import { Download, Printer, Shield, GraduationCap, User, Phone, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { downloadStudentIdCardPDF } from '../../utils/pdfGenerator';
import { printIsolatedElement } from '../../utils/printUtils';
import { SchoolLogo } from '../common/SchoolLogo';
import { SafeMediaImage } from '../common/SafeMediaImage';
import { HeadmasterSignatureDisplay } from '../common/HeadmasterSignatureDisplay';
import { DocumentPrintPreviewModal } from '../common/DocumentPrintPreviewModal';
import { IdCardQrCode } from '../common/IdCardQrCode';
import { getStudentQrData } from '../../utils/qrCodeHelper';

interface StudentIdCardProps {
  student: Student;
  settings: SchoolSettings;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({ student, settings }) => {
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const cardId = `student-id-card-${student.id}`;

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const handleDownload = () => {
    downloadStudentIdCardPDF(student, settings);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            Digital Printable Student ID Card
          </h4>
          <p className="text-xs text-slate-500">
            Official PVC standard identity badge with photo, name, and ID (G.R. / Roll number)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Card Side Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              type="button"
              onClick={() => setActiveSide('both')}
              className={`px-3 py-1 rounded-lg transition ${
                activeSide === 'both' ? 'bg-white text-emerald-900 shadow-xs' : 'hover:text-slate-950'
              }`}
            >
              Dual (Both Sides)
            </button>
            <button
              type="button"
              onClick={() => setActiveSide('front')}
              className={`px-3 py-1 rounded-lg transition ${
                activeSide === 'front' ? 'bg-white text-emerald-900 shadow-xs' : 'hover:text-slate-950'
              }`}
            >
              Front Only
            </button>
            <button
              type="button"
              onClick={() => setActiveSide('back')}
              className={`px-3 py-1 rounded-lg transition ${
                activeSide === 'back' ? 'bg-white text-emerald-900 shadow-xs' : 'hover:text-slate-950'
              }`}
            >
              Back Only
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Preview verified card details before printing"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            Verify & Print Card
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Download official ID Card as PDF"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Printing Container */}
      <div id={cardId} className="printable-card flex flex-wrap items-start justify-center gap-6 py-2">
        {/* FRONT SIDE */}
        {(activeSide === 'both' || activeSide === 'front') && (
          <div className="w-[320px] bg-white rounded-2xl border-2 border-emerald-800 shadow-xl overflow-hidden font-sans text-slate-900 flex flex-col justify-between">
            {/* Header */}
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
              <div className="mt-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold uppercase py-0.5 px-2.5 rounded-full inline-block">
                STUDENT IDENTITY CARD
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              {/* Photo & ID Badges */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-emerald-700 shadow-sm shrink-0 bg-slate-100 flex items-center justify-center">
                  {student.studentPictureUrl && student.studentPictureUrl.trim() !== '' ? (
                    <SafeMediaImage
                      src={student.studentPictureUrl}
                      alt={student.name}
                    />
                  ) : (
                    <div className="text-center p-1 text-[8px] text-slate-400 font-bold leading-tight flex flex-col items-center justify-center h-full">
                      <User className="w-6 h-6 text-slate-300 mb-0.5" />
                      <span>AFFIX PHOTO</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-lg text-center">
                    <span className="text-[8px] uppercase font-bold block tracking-wider">Student ID / G.R. NO</span>
                    <span className="text-xs font-mono font-black">{student.grNumber || 'PENDING ALLOTMENT'}</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-2 py-0.5 rounded-lg text-center">
                    <span className="text-[9px] font-bold">Class: </span>
                    <span className="text-xs font-black">{student.appliedClass}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 text-slate-800 px-2 py-0.5 rounded-lg text-center text-[10px]">
                    <span className="font-semibold">Roll No: </span>
                    <span className="font-bold">{student.rollNo || '01'} ({student.section || 'A'})</span>
                  </div>
                </div>
              </div>

              {/* Student Name */}
              <div className="text-center border-b border-slate-200 pb-2">
                <h6 className="font-black text-base text-slate-950 tracking-tight">
                  {student.name.toUpperCase()}
                </h6>
                <p className="text-xs text-slate-600 font-medium">S/O {student.fatherName}</p>
              </div>

              {/* Particulars */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">B-Form / CNIC:</span>
                  <span className="font-mono font-bold text-slate-800">{student.cnicBForm}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Date of Birth:</span>
                  <span className="font-medium text-slate-800">{student.dob}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Blood Group:</span>
                  <span className="font-bold text-red-600">{student.bloodGroup || 'B+'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Guardian Cell:</span>
                  <span className="font-mono font-bold text-slate-800">{student.fatherMobile}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-3 items-end gap-1 text-[9px] text-slate-500">
                <div className="text-center">
                  <div className="h-6 border-b border-dashed border-slate-400 w-16 mx-auto mb-0.5"></div>
                  <span>Student Sign</span>
                </div>
                <div className="flex justify-center items-center pb-0.5">
                  <IdCardQrCode
                    value={getStudentQrData(student, settings)}
                    size={42}
                    fgColor="#064e3b"
                    label="Scan QR"
                    holderName={student.name}
                    holderRole={`${student.appliedClass} (Roll: ${student.rollNo || '01'})`}
                    holderCode={student.grNumber || student.id}
                  />
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

            {/* Footer */}
            <div className="bg-emerald-950 text-white text-[8px] py-1 text-center font-mono tracking-wider">
              GBHS MEHRAND • CARD FRONT SIDE
            </div>
          </div>
        )}

        {/* BACK SIDE */}
        {(activeSide === 'both' || activeSide === 'back') && (
          <div className="w-[320px] bg-white rounded-2xl border-2 border-emerald-800 shadow-xl overflow-hidden font-sans text-slate-900 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-emerald-900 text-white p-3 text-center border-b-2 border-amber-400">
              <h6 className="font-black text-xs uppercase tracking-wider">
                RULES & REGULATIONS OF IDENTITY CARD
              </h6>
              <p className="text-[9px] text-emerald-200">
                Government Boys High School Mehrand
              </p>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 text-xs flex-1">
              <div className="space-y-1.5 text-[10px] text-slate-700 leading-relaxed list-disc">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>This ID card is non-transferable and must be worn inside school premises.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Mandatory for terminal examination entry, library, and laboratory access.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Loss of card must be reported immediately to Headmaster office.</span>
                </div>
              </div>

              {/* Residential & Emergency Contacts */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  Permanent Residence:
                </div>
                <p className="text-slate-600 pl-4">
                  {student.address.mohVillage}, {student.address.townCity}, Distt. Tharparkar
                </p>

                <div className="font-bold text-slate-900 flex items-center gap-1 pt-1">
                  <Phone className="w-3 h-3 text-emerald-700" />
                  Emergency Helpdesk:
                </div>
                <p className="text-slate-600 pl-4 font-mono">
                  {settings.phone || '+92-346-3837940'} / {settings.email}
                </p>
              </div>

              {/* Validity & Issuance */}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[9px] text-slate-500 font-mono">
                <div>
                  <span className="block font-sans font-bold text-slate-700">Issued On:</span>
                  <span>{new Date().toLocaleDateString('en-GB')}</span>
                </div>
                <div className="text-right">
                  <span className="block font-sans font-bold text-slate-700">Valid Till:</span>
                  <span>March 2027 (Session End)</span>
                </div>
              </div>
            </div>

            {/* Footer Return Notice */}
            <div className="bg-slate-900 text-amber-300 text-[8px] py-1.5 text-center font-mono">
              IF FOUND PLEASE RETURN TO HEADMASTER OFFICE GBHS MEHRAND
            </div>
          </div>
        )}
      </div>

      <div className="text-center no-print text-xs text-slate-500">
        💡 <strong>Printing Tip:</strong> Click <em>Verify & Print Card</em> to review all verified credentials before generating or printing.
      </div>

      {/* Standardized Student ID Card Print Preview Modal */}
      <DocumentPrintPreviewModal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        documentType="student-id"
        title={`Student Identity Badge Verification — ${student.name}`}
        elementIdToPrint={cardId}
        printDocumentTitle={`Student_ID_Card_${student.name.replace(/\s+/g, '_')}`}
        holderName={student.name}
        holderPhotoUrl={student.pictureUrl}
        particulars={[
          { label: 'Student Name', value: student.name, highlight: true },
          { label: "Father's Name", value: student.fatherName || 'N/A' },
          { label: 'General Register (G.R.) No', value: student.grNo, badge: 'Official G.R.' },
          { label: 'Roll Number', value: student.rollNo || 'Pending' },
          { label: 'Class / Grade', value: student.appliedClass, highlight: true },
          { label: 'Date of Birth', value: student.dob || 'N/A' },
          { label: 'Emergency Contact', value: student.mobileNo || student.guardianMobileNo || 'N/A' },
          { label: 'Enrollment Status', value: student.status === 'approved' ? 'Verified Enrolled Student' : student.status },
        ]}
        onDownloadPdf={handleDownload}
        downloadPdfLabel="Download ID Card PDF"
      >
        <div className="w-[300px] max-w-full mx-auto bg-white rounded-2xl border-2 border-emerald-900 shadow-xl overflow-hidden font-sans text-slate-900">
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-3 text-center border-b-2 border-amber-400">
            <div className="flex items-center justify-center gap-2 mb-1">
              <SchoolLogo logoUrl={settings.logoUrl} size="sm" showBorder={false} />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200">
                GOVT OF SINDH • SELD
              </span>
            </div>
            <h5 className="font-black text-xs uppercase">{settings.schoolName}</h5>
            <p className="text-[9px] text-amber-300 font-mono font-bold">
              SEMIS: {settings.semisCode} • TALUKA KALOI
            </p>
          </div>
          <div className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 rounded-lg overflow-hidden border border-emerald-700 bg-slate-100 flex items-center justify-center shrink-0">
                {student.pictureUrl ? (
                  <SafeMediaImage src={student.pictureUrl} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block truncate">
                  {student.appliedClass}
                </span>
                <p className="text-xs font-black text-slate-900 truncate">{student.name}</p>
                <p className="text-[10px] text-slate-500 truncate">S/O {student.fatherName}</p>
                <p className="text-[10px] font-mono text-emerald-900 font-bold">G.R. #{student.grNo}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
              <span>Valid: 2026–2027</span>
              <span className="font-mono text-slate-700">Roll: {student.rollNo || '—'}</span>
              <span className="font-bold text-emerald-900">GBHS Mehrand</span>
            </div>
          </div>
        </div>
      </DocumentPrintPreviewModal>
    </div>
  );
};
