import React from 'react';
import { StudentResult, SchoolSettings } from '../../types';
import { Download, Printer, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import { downloadResultSheetPDF } from '../../utils/pdfGenerator';

interface ResultSheetProps {
  result: StudentResult;
  settings: SchoolSettings;
}

export const ResultSheet: React.FC<ResultSheetProps> = ({ result, settings }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadResultSheetPDF(result, settings);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-700" />
          Official Academic Result Sheet / Marksheet
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

      {/* Result Marksheet Container */}
      <div className="bg-white rounded-2xl border-2 border-emerald-900 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto printable-card text-slate-900 font-sans">
        {/* Header */}
        <div className="text-center border-b-2 border-emerald-800 pb-4 space-y-1">
          <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
            Government of Sindh • School Education & Literacy Department
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
            {settings.schoolName}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Taluka Kaloi, District Tharparkar @ Mithi • SEMIS Code: {settings.semisCode}
          </p>
          <div className="mt-2 inline-block bg-emerald-900 text-amber-300 font-extrabold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
            {result.examTerm} ({result.year})
          </div>
        </div>

        {/* Student Particulars Header Bar */}
        <div className="my-5 bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Student Name</span>
            <span className="font-extrabold text-slate-900">{result.studentName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Father Name</span>
            <span className="font-bold text-slate-800">{result.fatherName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">G.R. Number</span>
            <span className="font-mono font-extrabold text-red-700">{result.grNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Class & Stream</span>
            <span className="font-bold text-emerald-900">{result.className}</span>
          </div>
        </div>

        {/* Subject-Wise Marks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-emerald-900 text-white font-bold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 text-center">Max Marks</th>
                <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {result.subjects.map((sub, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="py-2.5 px-3 text-slate-500 font-medium">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{sub.subject}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{sub.totalMarks}</td>
                  <td className="py-2.5 px-3 text-center font-extrabold text-emerald-900">
                    {sub.obtainedMarks}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-black text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {sub.grade}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Grand Total Row */}
              <tr className="bg-emerald-50/80 font-extrabold text-emerald-950 border-t-2 border-emerald-700">
                <td colSpan={2} className="py-3 px-3 uppercase tracking-wider">
                  Grand Total
                </td>
                <td className="py-3 px-3 text-center">{result.totalMaxMarks}</td>
                <td className="py-3 px-3 text-center text-base text-emerald-900">
                  {result.totalObtainedMarks}
                </td>
                <td className="py-3 px-3 text-center text-base text-amber-600">
                  {result.finalGrade}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Academic Analytics Cards */}
        <div className="grid grid-cols-3 gap-3 my-5 text-center">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Overall Percentage</span>
            <span className="text-lg sm:text-xl font-black text-emerald-950">{result.percentage}%</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Final Grade</span>
            <span className="text-lg sm:text-xl font-black text-amber-900">{result.finalGrade}</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <span className="text-[10px] uppercase font-bold text-blue-800 block">Class Position</span>
            <span className="text-lg sm:text-xl font-black text-blue-900">{result.position}</span>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
          <span className="font-bold text-slate-900 block">Headmaster / Class Incharge Remarks:</span>
          <p className="italic text-slate-600">"{result.remarks}"</p>
        </div>

        {/* Official Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-600">
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-medium">Class Teacher</span>
          </div>
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-medium">Incharge Examination</span>
          </div>
          <div>
            <div className="h-8 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-bold text-emerald-950">Headmaster Stamp & Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
