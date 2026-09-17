import React from 'react';
import { Student, SchoolSettings, AttendanceRecord, StudentResult, DailyRemark } from '../../types';
import { Download, Printer, FileText, CheckCircle2, Award, Calendar, Clock, UserCheck } from 'lucide-react';
import { downloadStudentReportPDF } from '../../utils/pdfGenerator';
import { printIsolatedElement } from '../../utils/printUtils';
import { SchoolLogo } from '../common/SchoolLogo';
import { SafeMediaImage } from '../common/SafeMediaImage';
import { HeadmasterSignatureDisplay } from '../common/HeadmasterSignatureDisplay';

interface StudentReportCardProps {
  student: Student;
  settings: SchoolSettings;
  attendance: AttendanceRecord[];
  results: StudentResult[];
  remarks: DailyRemark[];
  onClose?: () => void;
}

export const StudentReportCard: React.FC<StudentReportCardProps> = ({
  student,
  settings,
  attendance,
  results,
  remarks,
  onClose,
}) => {
  const cardId = `student-report-card-${student.id}`;

  // Compute student-specific attendance
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const totalDays = studentAttendance.length || 1;
  const presentDays = studentAttendance.filter((a) => a.status === 'Present').length;
  const absentDays = studentAttendance.filter((a) => a.status === 'Absent').length;
  const leaveDays = studentAttendance.filter((a) => a.status === 'Leave').length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  // Student specific results
  const studentResult = results.find((r) => r.studentId === student.id || r.grNumber === student.grNumber);
  
  // Student specific remarks
  const studentRemarks = remarks.filter((r) => r.studentId === student.id);

  const handlePrint = () => {
    printIsolatedElement(cardId, `Student_Record_Report_${student.grNumber || student.id}`);
  };

  const handleDownload = () => {
    downloadStudentReportPDF(student, settings, attendance, results, remarks);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-xl border border-slate-200 no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Official Student Academic & School Record Report
            </h4>
            <p className="text-[11px] text-slate-500">
              Comprehensive report including enrollment, attendance, results, and teacher conduct log
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
            title="Print only this report"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            title="Download PDF report"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download PDF Report
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-bold"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Printable Sheet */}
      <div
        id={cardId}
        className="max-w-3xl mx-auto bg-white border-2 border-emerald-900 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 printable-card text-slate-900 font-sans"
      >
        {/* Header */}
        <div className="border-b-2 border-emerald-800 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SchoolLogo logoUrl={settings.logoUrl} size="md" showBorder={false} />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                GOVERNMENT OF SINDH • SCHOOL EDUCATION & LITERACY DEPARTMENT
              </span>
              <h3 className="font-black text-lg sm:text-xl text-emerald-950 uppercase tracking-tight">
                {settings.schoolName}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                TALUKA KALOI, DISTRICT THARPARKAR @ MITHI • SEMIS CODE: {settings.semisCode}
              </p>
            </div>
          </div>
          <div className="inline-block bg-emerald-800 text-amber-300 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider mt-1">
            OFFICIAL STUDENT COMPREHENSIVE SCHOOL RECORD
          </div>
        </div>

        {/* Student Profile Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-center sm:justify-start">
            <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-emerald-800 bg-white shadow-xs flex items-center justify-center">
              {student.studentPictureUrl && student.studentPictureUrl.trim() !== '' ? (
                <SafeMediaImage src={student.studentPictureUrl} alt={student.name} />
              ) : (
                <div className="text-center p-1 text-[8px] text-slate-400 font-bold leading-tight flex flex-col items-center justify-center h-full border border-dashed border-slate-300 w-full">
                  <span>AFFIX</span>
                  <span>PASSPORT</span>
                  <span>PHOTO</span>
                </div>
              )}
            </div>
          </div>
          <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Student Name:</span>
              <span className="font-extrabold text-sm text-slate-950">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Father's Name:</span>
              <span className="font-bold text-slate-800">{student.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">General Register (G.R) No:</span>
              <span className="font-mono font-black text-emerald-900">{student.grNumber || 'PENDING'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Class & Roll Number:</span>
              <span className="font-extrabold text-slate-800">
                {student.appliedClass} (Sec: {student.section || 'A'} - Roll: {student.rollNo || '01'})
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">B-Form / CNIC:</span>
              <span className="font-mono font-medium text-slate-800">{student.cnicBForm}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Date of Birth:</span>
              <span className="font-medium text-slate-800">{student.dob} (Blood: {student.bloodGroup || 'B+'})</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Residential Address:</span>
              <span className="text-slate-700">
                {student.address.mohVillage}, {student.address.townCity}, {student.address.district} • Contact: {student.fatherMobile}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Attendance Record */}
        <div className="space-y-2">
          <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 border-b border-emerald-200 pb-1">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            1. Attendance & Discipline Record
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Attendance Rate</span>
              <span className="text-lg font-black text-emerald-950">{attendanceRate}%</span>
            </div>
            <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
              <span className="text-[10px] uppercase font-bold text-green-800 block">Days Present</span>
              <span className="text-lg font-black text-green-950">{presentDays}</span>
            </div>
            <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
              <span className="text-[10px] uppercase font-bold text-red-800 block">Days Absent</span>
              <span className="text-lg font-black text-red-950">{absentDays}</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Leave Granted</span>
              <span className="text-lg font-black text-amber-950">{leaveDays}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Examination Results */}
        <div className="space-y-2">
          <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 border-b border-emerald-200 pb-1">
            <Award className="w-4 h-4 text-emerald-700" />
            2. Annual Academic Performance & Examination Scores
          </h5>
          {studentResult ? (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Subject</th>
                      <th className="py-2 px-3 text-center">Total Marks</th>
                      <th className="py-2 px-3 text-center">Obtained</th>
                      <th className="py-2 px-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentResult.subjects.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-semibold text-slate-900">{s.subject}</td>
                        <td className="py-1.5 px-3 text-center text-slate-600">{s.totalMarks}</td>
                        <td className="py-1.5 px-3 text-center font-bold text-emerald-800">{s.obtainedMarks}</td>
                        <td className="py-1.5 px-3 text-center font-black text-slate-800">{s.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t border-emerald-200">
                    <tr>
                      <td className="py-2 px-3 font-black">Total / Aggregate</td>
                      <td className="py-2 px-3 text-center font-black">{studentResult.totalMaxMarks}</td>
                      <td className="py-2 px-3 text-center font-black text-emerald-900">{studentResult.totalObtainedMarks}</td>
                      <td className="py-2 px-3 text-center font-black text-amber-800">
                        {studentResult.finalGrade} ({studentResult.percentage}%)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="flex items-center justify-between text-xs px-2">
                <span className="font-bold text-slate-700">Exam Term: {studentResult.examTerm}</span>
                <span className="font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Position in Class: {studentResult.position}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-200">
              Examination results for the current academic session are under compilation by the Examination Incharge.
            </p>
          )}
        </div>

        {/* Section 3: Teacher Conduct & Classroom Remarks */}
        <div className="space-y-2">
          <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 border-b border-emerald-200 pb-1">
            <Clock className="w-4 h-4 text-emerald-700" />
            3. Faculty Feedback & Classroom Observations
          </h5>
          {studentRemarks.length > 0 ? (
            <div className="space-y-1.5">
              {studentRemarks.slice(0, 3).map((r) => (
                <div key={r.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span className="font-bold text-emerald-800">{r.subject} • By {r.teacherName}</span>
                    <span>{r.date}</span>
                  </div>
                  <p className="font-medium text-slate-800 mt-0.5">"{r.performanceRemark}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              "Student exhibits satisfactory conduct, regular punctuality, and active participation in classroom sessions."
            </p>
          )}
        </div>

        {/* Footer Official Authority Signatures */}
        <div className="border-t-2 border-slate-200 pt-6 mt-4 grid grid-cols-3 gap-4 items-end text-center text-[10px]">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-bold text-slate-700">Class Teacher Incharge</span>
            <span className="text-[8px] text-slate-400 block">Verification of Records</span>
          </div>

          <div>
            <div className="h-10 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-bold text-slate-700">Examination Incharge</span>
            <span className="text-[8px] text-slate-400 block">Tabulation & Marks Check</span>
          </div>

          {/* Headmaster Official Seal & Signature */}
          <HeadmasterSignatureDisplay
            signatureUrl={settings.headmasterSignatureUrl}
            headmasterName={settings.headmasterName}
            label="Headmaster Official Seal"
            subLabel="Authority / GBHS Mehrand"
            size="md"
          />
        </div>

        <div className="bg-slate-100 text-slate-500 text-[9px] py-1 text-center font-mono rounded">
          Report Generated from GBHS Mehrand Official School Management System • Valid with Headmaster Stamp
        </div>
      </div>
    </div>
  );
};
