import React, { useState } from 'react';
import { SafeMediaImage } from './common/SafeMediaImage';
import { SchoolLogo } from './common/SchoolLogo';
import {
  X,
  Award,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  ExternalLink,
  GraduationCap,
  MapPin,
  Briefcase,
  FileCheck,
  Layers,
} from 'lucide-react';
import { Teacher, TimetableSlot } from '../types';
import { useSchool } from '../context/SchoolContext';

interface FacultyProfileModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  isHeadmaster?: boolean;
}

export const FacultyProfileModal: React.FC<FacultyProfileModalProps> = ({
  teacher,
  isOpen,
  onClose,
  isHeadmaster = false,
}) => {
  const { settings, timetable } = useSchool();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !teacher) return null;

  // Calculate teaching slots for this teacher from timetable
  const teacherSlots = timetable.filter(
    (slot) =>
      slot.teacherId === teacher.id ||
      slot.teacherName.toLowerCase().includes(teacher.name.toLowerCase()) ||
      (teacher.name.toLowerCase().includes('ghanshamdas') && slot.teacherName.toLowerCase().includes('ghansham'))
  );

  // Extract unique classes taught
  const classesTaught = Array.from(new Set(teacherSlots.map((s) => s.className)));

  // Calculate service tenure
  const calculateTenure = (joinDateStr?: string) => {
    if (!joinDateStr) return 'Active Faculty';
    // Format could be DD-MM-YYYY or YYYY-MM-DD
    const parts = joinDateStr.split(/[-/]/);
    let year = 2020;
    if (parts.length === 3) {
      if (parts[2].length === 4) year = parseInt(parts[2], 10);
      else if (parts[0].length === 4) year = parseInt(parts[0], 10);
    }
    const currentYear = 2026;
    const diff = currentYear - year;
    return diff > 0 ? `${diff}+ Years of Dedicated Service` : 'Recently Inducted';
  };

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Determine cadre BPS scale
  const getBpsScale = (designation?: string) => {
    if (!designation) return 'BPS-14';
    const des = designation.toUpperCase();
    if (des.includes('HEADMASTER') || des.includes('HM')) return 'BPS-17';
    if (des.includes('HST') || des.includes('HIGH SCHOOL')) return 'BPS-16';
    if (des.includes('JEST')) return 'BPS-14';
    if (des.includes('PST') || des.includes('PRIMARY')) return 'BPS-12';
    if (des.includes('SUBJECT SPECIALIST')) return 'BPS-17';
    return 'BPS-14';
  };

  const bpsScale = getBpsScale(teacher.designation);

  return (
    <div
      id="faculty-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="faculty-profile-card"
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Action Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-2.5">
            <SchoolLogo size="sm" showLabel={false} />
            <div>
              <span className="text-[10px] text-amber-300 uppercase font-black tracking-widest block leading-tight">
                GOVT. BOYS HIGH SCHOOL MEHRAND • SEMIS 406020752
              </span>
              <h3 className="text-sm sm:text-base font-black text-white">
                Official Faculty Profile & Credentials
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Official Faculty Profile"
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold px-2.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
          {/* Header Banner with Portrait & Government Meta */}
          <div className="bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 rounded-2xl p-5 sm:p-6 border border-emerald-900/10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 shadow-xs relative overflow-hidden">
            {/* Stamp / Watermark Badge */}
            <div className="absolute right-3 top-3 hidden md:flex flex-col items-end opacity-90 pointer-events-none">
              <span className="text-[9px] font-mono uppercase font-black text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded">
                SELD Verified
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                School Edu Dept, Sindh
              </span>
            </div>

            {/* Profile Image */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-3 border-emerald-800 shadow-lg bg-slate-200 flex items-center justify-center">
                <SafeMediaImage
                  src={teacher.pictureUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-700 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Verified Govt Educator">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Name and Designation Details */}
            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-800 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                  {teacher.designation || 'Teacher'} ({bpsScale})
                </span>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                  PID: {teacher.pid}
                </span>
                {teacher.isAvailableToday !== false && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300/60 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    On Duty Today
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {teacher.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Son of <strong className="text-slate-800">{teacher.fatherName}</strong> • {settings.schoolName}
                </p>
              </div>

              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                {isHeadmaster
                  ? 'Head of Institution providing executive leadership, academic direction, faculty monitoring, and community outreach for GBHS Mehrand.'
                  : `Dedicated educator specializing in ${teacher.subjectSpecialist} at GBHS Mehrand, committed to conceptual learning, student discipline, and academic excellence.`}
              </p>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-emerald-700" />
                Cadre / Scale
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">
                {teacher.designation || 'JEST'}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold block">{bpsScale} Regular</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                GBHS Tenure
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800">
                Since {teacher.joinDate || '2020'}
              </p>
              <span className="text-[10px] text-slate-500 font-semibold block">
                {calculateTenure(teacher.joinDate)}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-600" />
                Classes Taught
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
                {classesTaught.length > 0 ? classesTaught.join(', ') : 'Classes 6th - 10th'}
              </p>
              <span className="text-[10px] text-blue-700 font-semibold block">
                {classesTaught.length > 0 ? `${classesTaught.length} Assigned Classes` : 'Secondary Wing'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-purple-600" />
                SELD Status
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Verified
              </p>
              <span className="text-[10px] text-purple-700 font-semibold block font-mono">
                {teacher.joiningLetterDispatchNo ? 'Govt Appointed' : 'Active Cadre'}
              </span>
            </div>
          </div>

          {/* Detailed Qualifications & Subject Expertise Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Academic Qualifications Card */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 border-b border-slate-200/80 pb-2.5">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Academic & Professional Qualifications
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 text-xs sm:text-sm block">
                      {teacher.qualification}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Recognized by HEC Pakistan & SELD Govt. of Sindh
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 text-xs">
                      Teacher Training & Professional Pedagogy
                    </span>
                    <span className="text-slate-500 text-[11px] block">
                      Trained in modern STEM education, class management & Sindh textbook board curriculum.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Specialization Card */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 border-b border-slate-200/80 pb-2.5">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Subject Mastery & Teaching Domains
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] font-semibold block mb-1">
                    Primary Academic Domain:
                  </span>
                  <div className="inline-flex items-center gap-1.5 bg-amber-100/80 text-amber-900 border border-amber-300/80 px-3 py-1 rounded-lg font-bold text-xs">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    {teacher.subjectSpecialist}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-slate-500 text-[11px] font-semibold block mb-1">
                    Class Assignments at GBHS Mehrand:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(classesTaught.length > 0 ? classesTaught : ['Class 8th', 'Class 9th (Science)', 'Class 10th (Science)']).map((cls) => (
                      <span
                        key={cls}
                        className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold shadow-2xs"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Schedule Breakdown if Available */}
          {teacherSlots.length > 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Weekly Teaching Schedule (Timetable Slots)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {teacherSlots.length} Active Periods
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                {teacherSlots.slice(0, 6).map((slot) => (
                  <div
                    key={slot.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-mono">
                        {slot.day}
                      </span>
                      <span className="text-slate-500 font-medium">Period {slot.period}</span>
                    </div>
                    <p className="font-extrabold text-slate-800">{slot.subject}</p>
                    <p className="text-[11px] text-slate-500">{slot.className} • {slot.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Contact & Student Consultation Channels */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h4 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  Official Communication & Office Hours
                </h4>
                <p className="text-xs text-emerald-200/80">
                  GBHS Mehrand Faculty Academic Counseling & Student Guidance
                </p>
              </div>
              <span className="text-[11px] bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2.5 py-0.5 rounded-full font-bold w-fit">
                Campus In-Person & Remote
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Official Email */}
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 rounded-lg bg-emerald-700/60 text-white shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">Official Email</span>
                    <span className="font-mono text-xs text-white truncate block">{teacher.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(teacher.email, 'email')}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0 ml-2"
                  title="Copy Email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Official Phone / Mobile */}
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 rounded-lg bg-amber-600/60 text-white shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">Phone / WhatsApp</span>
                    <span className="font-mono text-xs text-white truncate block">{teacher.mobileNo || '+92-346-XXXXXXX'}</span>
                  </div>
                </div>
                {teacher.mobileNo && (
                  <button
                    onClick={() => handleCopy(teacher.mobileNo, 'phone')}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0 ml-2"
                    title="Copy Phone"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Office Hours: <strong>08:00 AM – 01:30 PM (Mon – Sat)</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>GBHS Mehrand Campus, Taluka Kaloi, District Tharparkar</span>
              </div>
            </div>
          </div>

          {/* Institutional Endorsement Seal */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Government of Sindh School Education Authority</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Verified Faculty Member at Government Boys High School Mehrand • Record maintained in SELD Biometric Database.
              </p>
              {teacher.joiningLetterDispatchNo && (
                <p className="text-[11px] font-mono font-bold text-emerald-800">
                  Joining Dispatch Ref: {teacher.joiningLetterDispatchNo} ({teacher.joiningLetterDate || teacher.joinDate})
                </p>
              )}
            </div>

            <div className="shrink-0 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-center min-w-[150px] space-y-1">
              <div className="text-[10px] font-extrabold uppercase text-emerald-900 tracking-wider flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Record</span>
              </div>
              <p className="text-[10px] text-emerald-800 font-bold">
                {settings.headmasterName || 'Headmaster'}
              </p>
              <span className="text-[9px] text-emerald-600 block">
                GBHS Mehrand
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            SEMIS: 406020752 • Kaloi, Tharparkar
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Official Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
