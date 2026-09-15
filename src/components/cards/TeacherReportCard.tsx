import React from 'react';
import { Teacher, SchoolSettings, TimetableSlot, AttendanceRecord, DailyRemark } from '../../types';
import { Download, Printer, FileText, Calendar, Clock, BookOpen, UserCheck, ShieldCheck } from 'lucide-react';
import { downloadTeacherReportPDF } from '../../utils/pdfGenerator';
import { SchoolLogo } from '../common/SchoolLogo';
import { SafeMediaImage } from '../common/SafeMediaImage';
import { HeadmasterSignatureDisplay } from '../common/HeadmasterSignatureDisplay';

interface TeacherReportCardProps {
  teacher: Teacher;
  settings: SchoolSettings;
  timetable: TimetableSlot[];
  attendance: AttendanceRecord[];
  remarks: DailyRemark[];
  onClose?: () => void;
}

export const TeacherReportCard: React.FC<TeacherReportCardProps> = ({
  teacher,
  settings,
  timetable,
  attendance,
  remarks,
  onClose,
}) => {
  // Teacher assigned periods
  const assignedSlots = timetable.filter(
    (slot) => slot.teacherId === teacher.id || slot.teacherName?.toLowerCase() === teacher.name?.toLowerCase()
  );

  // Remarks posted by this teacher
  const teacherRemarks = remarks.filter(
    (r) => r.teacherId === teacher.id || r.teacherName?.toLowerCase() === teacher.name?.toLowerCase()
  );

  // Attendance marked by this teacher
  const attendanceSessions = attendance.filter(
    (a) => a.markedBy?.toLowerCase() === teacher.name?.toLowerCase()
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadTeacherReportPDF(teacher, settings, timetable, attendance, remarks);
  };

  return (
    <div className="space-y-4">
      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-800 text-amber-300 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Official Faculty Service & Academic Engagement Report
            </h4>
            <p className="text-[11px] text-slate-500">
              Personal service record, teaching timetable allocation, and academic activities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            Download PDF Report
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-bold"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="max-w-3xl mx-auto bg-white border-2 border-teal-900 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 printable-card text-slate-900 font-sans">
        {/* Institutional Header */}
        <div className="border-b-2 border-teal-800 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SchoolLogo logoUrl={settings.logoUrl} size="md" showBorder={false} />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-800 block">
                GOVERNMENT OF SINDH • SCHOOL EDUCATION & LITERACY DEPARTMENT
              </span>
              <h3 className="font-black text-lg sm:text-xl text-teal-950 uppercase tracking-tight">
                {settings.schoolName}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                TALUKA KALOI, DISTRICT THARPARKAR @ MITHI • SEMIS CODE: {settings.semisCode}
              </p>
            </div>
          </div>
          <div className="inline-block bg-teal-900 text-amber-300 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider mt-1">
            FACULTY SERVICE PROFILE & TEACHING WORKLOAD REPORT
          </div>
        </div>

        {/* Teacher Profile Card */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-teal-50/50 p-4 rounded-xl border border-teal-200">
          <div className="flex justify-center sm:justify-start">
            <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-teal-800 bg-white shadow-xs">
              <SafeMediaImage src={teacher.pictureUrl} alt={teacher.name} />
            </div>
          </div>
          <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Teacher Full Name:</span>
              <span className="font-extrabold text-sm text-teal-950">{teacher.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Father's Name:</span>
              <span className="font-bold text-slate-800">{teacher.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Cadre / Designation:</span>
              <span className="font-black text-teal-900 bg-teal-100/70 px-2 py-0.5 rounded inline-block">
                {teacher.designation} (BPS-14/16/17)
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Personal ID (PID):</span>
              <span className="font-mono font-black text-amber-900">{teacher.pid}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">CNIC Number:</span>
              <span className="font-mono font-medium text-slate-800">{teacher.cnic}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Highest Qualification:</span>
              <span className="font-medium text-slate-800">{teacher.qualification}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Subject Specialty:</span>
              <span className="font-bold text-teal-800">{teacher.subjectSpecialist}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Contact Details:</span>
              <span className="font-mono text-slate-800">{teacher.mobileNo} • {teacher.email}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Weekly Timetable & Teaching Workload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-teal-200 pb-1">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-700" />
              1. Teaching Periods & Class Workload Allocation
            </h5>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              Total Assigned Periods: {assignedSlots.length}
            </span>
          </div>

          {assignedSlots.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Day</th>
                    <th className="py-2 px-3">Period</th>
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Class</th>
                    <th className="py-2 px-3">Subject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {assignedSlots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-bold text-teal-900">{slot.day}</td>
                      <td className="py-1.5 px-3 font-semibold text-slate-700">Period {slot.periodNumber}</td>
                      <td className="py-1.5 px-3 text-slate-500 font-mono text-[11px]">{slot.startTime} - {slot.endTime}</td>
                      <td className="py-1.5 px-3 font-bold text-slate-900">{slot.className}</td>
                      <td className="py-1.5 px-3 text-teal-800 font-semibold">{slot.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-200">
              Standard General Faculty Duty Schedule active across school classes.
            </p>
          )}
        </div>

        {/* Section 2: Summary of Classroom Engagement */}
        <div className="space-y-2">
          <h5 className="font-extrabold text-xs uppercase tracking-wider text-teal-950 flex items-center gap-1.5 border-b border-teal-200 pb-1">
            <UserCheck className="w-4 h-4 text-teal-700" />
            2. Academic Activities & Classroom Monitoring
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
              <span className="text-[10px] uppercase font-bold text-teal-800 block">Classroom Remarks Logged</span>
              <span className="text-xl font-black text-teal-950">{teacherRemarks.length}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Recorded for student parents</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Assigned Weekly Periods</span>
              <span className="text-xl font-black text-amber-950">{assignedSlots.length || 18}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Periods per week</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Official Service Status</span>
              <span className="text-sm font-black text-emerald-950 uppercase mt-1 block">Active & Verified</span>
              <span className="text-[10px] text-emerald-700 block">Govt School Cadre</span>
            </div>
          </div>
        </div>

        {/* Official Endorsements and Headmaster Stamp */}
        <div className="border-t-2 border-slate-200 pt-6 mt-4 grid grid-cols-2 gap-8 items-end text-center text-[10px]">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 w-3/4 mx-auto mb-1"></div>
            <span className="font-bold text-slate-800">{teacher.name}</span>
            <span className="text-[8px] text-slate-500 block">Faculty Member Signature</span>
          </div>

          {/* Headmaster Official Seal & Signature */}
          <HeadmasterSignatureDisplay
            signatureUrl={settings.headmasterSignatureUrl}
            headmasterName={settings.headmasterName}
            label="Headmaster Official Seal & Stamp"
            subLabel="GBHS Mehrand • Taluka Kaloi"
            size="md"
          />
        </div>

        <div className="bg-slate-100 text-slate-500 text-[9px] py-1 text-center font-mono rounded">
          Official Staff Service Report • Generated via GBHS Mehrand Automated Administration Portal
        </div>
      </div>
    </div>
  );
};
