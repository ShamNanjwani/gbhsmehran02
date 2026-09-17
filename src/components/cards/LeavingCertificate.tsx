import React from 'react';
import { LeavingCertificateData, SchoolSettings } from '../../types';
import { Download, Printer, Shield, FileCheck, CheckCircle2 } from 'lucide-react';
import { downloadLeavingCertificatePDF } from '../../utils/pdfGenerator';
import { printIsolatedElement } from '../../utils/printUtils';
import { HeadmasterSignatureDisplay } from '../common/HeadmasterSignatureDisplay';

interface LeavingCertificateProps {
  certificate: LeavingCertificateData;
  settings: SchoolSettings;
}

export const LeavingCertificate: React.FC<LeavingCertificateProps> = ({ certificate, settings }) => {
  const cardId = `leaving-certificate-${certificate.id || certificate.grNumber}`;

  const handlePrint = () => {
    printIsolatedElement(cardId, `School_Leaving_Certificate_${certificate.studentName.replace(/\s+/g, '_')}`);
  };

  const handleDownload = () => {
    downloadLeavingCertificatePDF(certificate, settings);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-700" />
          Official School Leaving Certificate (S.L.C)
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            title="Print only this Certificate"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Download official Certificate as PDF"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Official S.L.C Format: Sindh Government Ornate Form */}
      <div
        id={cardId}
        className="bg-amber-50/30 rounded-2xl border-4 border-double border-emerald-900 p-8 shadow-xl max-w-3xl mx-auto printable-card text-slate-900 font-serif"
      >
        {/* Crest & Header */}
        <div className="text-center border-b-2 border-emerald-800/60 pb-5 space-y-1 font-sans">
          <div className="text-xs font-black text-emerald-900 tracking-wider uppercase">
            EDUCATION & LITERACY DEPARTMENT, GOVERNMENT OF SINDH
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
            {settings.schoolName}
          </h3>
          <p className="text-xs text-slate-700 font-medium">
            TALUKA KALOI, DISTRICT THARPARKAR @ MITHI • SEMIS CODE: {settings.semisCode}
          </p>
          <div className="pt-2">
            <span className="inline-block bg-emerald-900 text-white text-xs font-bold uppercase tracking-widest px-6 py-1 rounded-full shadow-xs">
              SCHOOL LEAVING CERTIFICATE (S.L.C)
            </span>
          </div>
        </div>

        {/* Book / Serial No & GR Header */}
        <div className="flex justify-between items-center py-4 text-xs font-sans border-b border-dashed border-slate-300">
          <div>
            <span className="text-slate-500 font-bold">Book / Serial No: </span>
            <span className="font-mono font-bold text-slate-800">SLC-{certificate.id}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold">General Register (G.R.) No: </span>
            <span className="font-mono font-black text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              {certificate.grNumber}
            </span>
          </div>
        </div>

        {/* Official Sindh Education Department Form Fields */}
        <div className="py-6 space-y-3.5 text-xs text-slate-800">
          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">1. Name of Student (in full):</span>
            <span className="font-sans font-extrabold text-slate-950 uppercase text-sm w-2/3">{certificate.studentName}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">2. Father's Name:</span>
            <span className="font-sans font-bold text-slate-900 w-2/3">{certificate.fatherName}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">3. Caste / Community:</span>
            <span className="font-sans font-medium text-slate-800 w-2/3">{certificate.caste || 'Sindhi'}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">4. Residence Place:</span>
            <span className="font-sans font-medium text-slate-800 w-2/3">{certificate.residentOf}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">5. Date of Birth (Figures & Words):</span>
            <span className="font-sans font-bold text-slate-900 w-2/3">
              {certificate.dob} ({certificate.dobWords || 'As per NADRA B-Form Record'})
            </span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">6. Date of Admission in School:</span>
            <span className="font-sans font-medium text-slate-800 w-2/3">{certificate.dateOfAdmission}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">7. Last Class Attended:</span>
            <span className="font-sans font-bold text-emerald-950 w-2/3">{certificate.lastClassAttended}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">8. Date of Leaving School:</span>
            <span className="font-sans font-bold text-slate-900 w-2/3">{certificate.dateOfLeaving}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">9. Reason for Leaving:</span>
            <span className="font-sans font-medium text-slate-800 w-2/3">{certificate.reasonForLeaving}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">10. Conduct & Character:</span>
            <span className="font-sans font-bold text-emerald-800 w-2/3">{certificate.conduct}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">11. Academic Progress:</span>
            <span className="font-sans font-medium text-slate-800 w-2/3">{certificate.progress}</span>
          </div>

          <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
            <span className="font-bold w-1/3">12. Dues & Fee Clearance:</span>
            <span className="font-sans font-bold text-emerald-900 w-2/3">All Government School Dues Cleared In Full</span>
          </div>
        </div>

        {/* Certificate Closing Statement */}
        <p className="text-[11px] text-slate-600 italic text-center my-4 font-sans">
          "Certified that the above particulars are in accordance with the General Register of Government Boys High School Mehrand (SEMIS 406020752)."
        </p>

        {/* Signatures */}
        <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 items-end text-center text-[10px] text-slate-700 font-sans">
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-medium">Prepared by (Junior Clerk)</span>
          </div>
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-medium">Verified by (JEST / Class Teacher)</span>
          </div>
          <HeadmasterSignatureDisplay
            signatureUrl={settings.headmasterSignatureUrl}
            headmasterName={settings.headmasterName}
            label="Headmaster Seal & Signature"
            subLabel="Authority Official Endorsement"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
