import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  GraduationCap,
  FileText,
  IdCard,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Star,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  FileCheck,
  LogOut,
  Eye,
  EyeOff,
  User,
  Shield,
  KeyRound,
} from 'lucide-react';
import { StudentIdCard } from './cards/StudentIdCard';
import { EnrollmentCard } from './cards/EnrollmentCard';
import { ResultSheet } from './cards/ResultSheet';
import { LeavingCertificate } from './cards/LeavingCertificate';
import { StudentReportCard } from './cards/StudentReportCard';
import { DocumentViewerModal } from './common/DocumentViewerModal';
import { SafeMediaImage } from './common/SafeMediaImage';
import { SchoolLogo } from './common/SchoolLogo';
import { Student } from '../types';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentRole,
    students,
    settings,
    remarks,
    attendance,
    results,
    leavingCertificates,
    timetable,
    logout,
    loginAsStudent,
    setActiveTab,
  } = useSchool();

  // Student login form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'idcard' | 'enrollment' | 'result' | 'slc' | 'remarks' | 'attendance' | 'timetable'
  >('overview');

  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAsStudent(loginIdentifier, loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'Invalid credentials.');
    }
  };

  const handleQuickStudentLogin = (student: Student) => {
    setLoginError('');
    const identifier = student.grNumber || student.email || student.cnicBForm;
    const pass = student.password || 'Student@123';
    setLoginIdentifier(identifier);
    setLoginPassword(pass);
    const res = loginAsStudent(identifier, pass);
    if (!res.success) {
      setLoginError(res.message || 'Login failed.');
    }
  };

  const handleStudentSignOut = () => {
    logout();
    setActiveTab('student-portal');
  };

  // Find logged in student object
  const currentStudent: Student | undefined =
    currentUser && currentRole === 'student'
      ? students.find((s) => s.id === currentUser.id || s.email === currentUser.email)
      : undefined;

  // IF NOT LOGGED IN AS STUDENT, SHOW LOGIN VIEW
  if (!currentStudent || currentRole !== 'student') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
        <div className="bg-white rounded-3xl border-2 border-emerald-800/20 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <SchoolLogo logoUrl={settings.logoUrl} size="lg" className="shadow-lg" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full uppercase tracking-wider">
                Student & Parent Portal
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Sign In to Student Account
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Access your Official Admission Record, Allotted GR Number, ID Card, Enrollment Card, Timetable & Result Sheet.
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleStudentLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Student Email / GR Number / B-Form
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. GR-406020752-0081 or student@gbhsmehrand.edu.pk"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter student password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-medium"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              Sign In to Student Dashboard
            </button>

            {/* Quick 1-click Demo logins */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block text-center">
                Quick 1-Click Access for Enrolled Students:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {students.slice(0, 2).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleQuickStudentLogin(s)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left flex items-center gap-2 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 truncate">{s.name}</div>
                      <div className="text-[10px] text-emerald-800 font-mono truncate">
                        {s.grNumber || s.appliedClass}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                New student applying for admission?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('admission')}
                  className="font-bold text-emerald-800 hover:underline"
                >
                  Fill Online Admission Form →
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const isApproved = currentStudent.status === 'approved';
  const isPending = currentStudent.status === 'pending';

  // Student specific remarks
  const studentRemarks = remarks.filter(
    (r) => r.studentId === currentStudent.id || r.studentName.toLowerCase() === currentStudent.name.toLowerCase()
  );

  // Student specific attendance
  const studentAttendance = attendance.filter(
    (a) => a.personId === currentStudent.id || a.personName.toLowerCase() === currentStudent.name.toLowerCase()
  );
  const presentDays = studentAttendance.filter((a) => a.status === 'Present').length;
  const totalDays = studentAttendance.length || 1;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  // Student result
  const studentResult = results.find(
    (r) => r.studentId === currentStudent.id || r.studentName.toLowerCase() === currentStudent.name.toLowerCase()
  );

  // Student leaving certificate
  const studentSLC = leavingCertificates.find(
    (c) => c.studentId === currentStudent.id || c.studentName.toLowerCase() === currentStudent.name.toLowerCase()
  );

  // Student class timetable
  const classTimetable = timetable.filter(
    (t) => t.className.toLowerCase().includes(currentStudent.appliedClass.toLowerCase().replace('class ', ''))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Admission Status */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-slate-800">
              <SafeMediaImage
                src={currentStudent.studentPictureUrl}
                alt={currentStudent.name}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-400/30">
                  {currentStudent.appliedClass} (Section: {currentStudent.section || 'A'})
                </span>
                {isApproved ? (
                  <span className="text-xs font-extrabold text-emerald-300 bg-emerald-800 px-2.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Enrolled
                  </span>
                ) : (
                  <span className="text-xs font-extrabold text-amber-200 bg-amber-800/80 px-2.5 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    Pending Admin Approval
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{currentStudent.name}</h2>
              <p className="text-xs text-emerald-100">
                S/O {currentStudent.fatherName} • Roll No: {currentStudent.rollNo || '01'}
              </p>
              <div className="pt-1 flex items-center gap-3 text-xs font-mono">
                <span className="bg-emerald-800/60 px-2 py-0.5 rounded text-amber-300 font-bold">
                  GR NO: {currentStudent.grNumber || 'PENDING ALLOTMENT'}
                </span>
                <span className="text-slate-300 hidden sm:inline">SEMIS: {settings.semisCode}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubTab('idcard')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow transition flex items-center gap-1.5"
            >
              <IdCard className="w-4 h-4" />
              Print ID Card
            </button>
            <button
              onClick={() => setActiveSubTab('enrollment')}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-600 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              Enrollment Card
            </button>
            <button
              onClick={() => setActiveSubTab('report')}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-amber-300 font-bold text-xs border border-teal-600 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={handleStudentSignOut}
              className="px-3 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-bold text-xs border border-rose-700/60 transition flex items-center gap-1.5"
              title="Sign out of student account"
            >
              <LogOut className="w-4 h-4 text-rose-300" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Pending status notification box */}
      {isPending && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-start gap-3 text-amber-900">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="text-sm font-extrabold text-amber-950">
                Admission Application Submitted & Under Admin Review
              </h4>
              <p className="text-slate-700">
                Your admission particulars and B-Form documents have been received by the Headmaster office.
                Once approved, your official <strong>General Register (GR) Number</strong> will be issued, and your Enrollment Card, ID Card, and Class Timetable will be automatically activated.
              </p>
              <p className="text-[11px] text-amber-800 font-medium">
                Please contact the school office or await administrative approval to access all student services.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'overview', label: 'Dashboard & Admission Letter', icon: FileCheck },
          { id: 'idcard', label: 'Official ID Card', icon: IdCard },
          { id: 'enrollment', label: 'Enrollment Card', icon: FileText },
          { id: 'report', label: 'Export Report Card', icon: Printer },
          { id: 'result', label: 'Result Sheet', icon: Award },
          { id: 'slc', label: 'Leaving Certificate (SLC)', icon: GraduationCap },
          { id: 'remarks', label: 'Teachers Daily Remarks & Work', icon: Star },
          { id: 'attendance', label: 'Daily Attendance', icon: Calendar },
          { id: 'timetable', label: 'Class Timetable', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 shrink-0 transition ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: Overview & Confirmation Letter */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Class & Section</span>
              <div className="text-xl font-black text-slate-900">{currentStudent.appliedClass}</div>
              <span className="text-xs text-emerald-700 font-semibold">Section {currentStudent.section || 'A'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Attendance Rate</span>
              <div className="text-xl font-black text-emerald-800">{attendancePercentage}%</div>
              <span className="text-xs text-slate-500 font-medium">{presentDays} of {totalDays} days</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Teacher Remarks</span>
              <div className="text-xl font-black text-amber-600">{studentRemarks.length}</div>
              <span className="text-xs text-slate-500 font-medium">Recent evaluations</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Latest Exam Grade</span>
              <div className="text-xl font-black text-blue-700">{studentResult?.finalGrade || 'A-1'}</div>
              <span className="text-xs text-slate-500 font-medium">{studentResult?.position || 'Top 5'}</span>
            </div>
          </div>

          {/* Official Admission Confirmation Letter */}
          {/* Required by user prompt:
              "after approved by admin and confirmation letter issue with GR Allotted to student
               and displayed on Students Dashboard" */}
          <div className="bg-white rounded-2xl border-2 border-emerald-900 p-6 sm:p-8 shadow-md space-y-4 printable-card">
            <div className="text-center border-b border-slate-200 pb-4">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                OFFICIAL ADMISSION CONFIRMATION LETTER
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase">
                {settings.schoolName}
              </h3>
              <p className="text-xs text-slate-500">
                Taluka Kaloi, District Tharparkar @ Mithi • SEMIS: {settings.semisCode}
              </p>
            </div>

            <div className="flex justify-between items-center text-xs font-mono py-1 border-b border-dashed border-slate-200">
              <span>Letter Ref: GBHS/ADM/2026-{currentStudent.id.substring(2)}</span>
              <span className="font-bold text-red-700">GR NO: {currentStudent.grNumber || 'PROVISIONAL'}</span>
              <span>Date: {currentStudent.admissionDate}</span>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-2">
              <p>
                To: <strong>{currentStudent.name}</strong> S/O <strong>{currentStudent.fatherName}</strong>,
                <br />
                Resident of: {currentStudent.address.houseNo}, {currentStudent.address.mohVillage}, {currentStudent.address.townCity}, {currentStudent.address.district}.
              </p>
              <p>
                Subject: <strong>OFFICIAL CONFIRMATION OF ADMISSION IN {currentStudent.appliedClass.toUpperCase()}</strong>
              </p>
              <p>
                Dear Student & Parent,
              </p>
              <p>
                We are pleased to inform you that upon careful review of your application, verification of NADRA B-Form records, and compliance with School Education & Literacy Department guidelines, admission has been formally approved in <strong>{settings.schoolName}</strong> for the Academic Session 2026-2027.
              </p>
              <p>
                You have been allotted official General Register Number: <strong className="text-red-700 font-mono text-sm">{currentStudent.grNumber || 'GR-406020752-0142'}</strong>.
                You are assigned to <strong>Section {currentStudent.section || 'A'}</strong> with <strong>Roll No. {currentStudent.rollNo || '01'}</strong>.
              </p>
              <p>
                You may now access and download your official <strong>Student Identity Card</strong>, <strong>Annual Enrollment Card</strong>, and view daily classwork remarks and attendance records.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-800">Admission Committee</p>
                <p className="text-[11px] text-slate-500">GBHS Mehrand</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-emerald-900">Headmaster</p>
                <p className="text-[11px] text-slate-500">Seal & Signature</p>
              </div>
            </div>
          </div>

          {/* Uploaded Documents Verification Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Submitted Verification Documents (PDF / Image Uploads)
                </h4>
                <p className="text-xs text-slate-500">
                  Documents submitted during admission for government records
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Verified Records
              </span>
            </div>

            <div className={`grid grid-cols-1 ${currentStudent.isBFormAvailable === false ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
              {/* NADRA B-Form OR Father CNIC Both Sides */}
              {currentStudent.isBFormAvailable !== false && currentStudent.bFormPictureUrl ? (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide block">
                      NADRA B-Form / Birth Cert
                    </span>
                    <p className="font-mono text-xs text-slate-700 font-bold mt-0.5">
                      {currentStudent.cnicBForm}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        url: currentStudent.bFormPictureUrl!,
                        title: `${currentStudent.name} - NADRA B-Form Document`,
                      })
                    }
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> View B-Form Document
                  </button>
                </div>
              ) : (
                <>
                  {/* Father CNIC Front */}
                  <div className="p-3.5 rounded-xl border-2 border-amber-300 bg-amber-50/40 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wide block">
                        Father CNIC (Front Side)
                      </span>
                      <p className="font-mono text-xs text-slate-700 font-bold mt-0.5">
                        {currentStudent.fatherCnic || currentStudent.cnicBForm}
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold block">
                        (B-Form Unavailable Alternative)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewDoc({
                          url: currentStudent.fatherCnicFrontUrl || currentStudent.bFormPictureUrl || '',
                          title: `${currentStudent.name} - Father CNIC (Front Side)`,
                        })
                      }
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> View CNIC Front
                    </button>
                  </div>

                  {/* Father CNIC Back */}
                  <div className="p-3.5 rounded-xl border-2 border-amber-300 bg-amber-50/40 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wide block">
                        Father CNIC (Back Side)
                      </span>
                      <p className="font-mono text-xs text-slate-700 font-bold mt-0.5">
                        {currentStudent.fatherCnic || currentStudent.cnicBForm}
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold block">
                        (Official Address & Issue Date)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewDoc({
                          url: currentStudent.fatherCnicBackUrl || currentStudent.bFormPictureUrl || '',
                          title: `${currentStudent.name} - Father CNIC (Back Side)`,
                        })
                      }
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> View CNIC Back
                    </button>
                  </div>
                </>
              )}

              {/* School Leaving Certificate */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wide block">
                    Previous School Leaving Cert
                  </span>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">
                    {currentStudent.leavingCertificateUrl ? 'Attached & Verified' : 'N/A (Fresh Admission)'}
                  </p>
                </div>
                {currentStudent.leavingCertificateUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        url: currentStudent.leavingCertificateUrl!,
                        title: `${currentStudent.name} - Previous School Leaving Certificate`,
                      })
                    }
                    className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Leaving Certificate
                  </button>
                ) : (
                  <div className="w-full py-2 bg-slate-100 text-slate-400 rounded-lg font-medium text-xs text-center border border-slate-200">
                    Not Required (ECCE / Class 1 Entry)
                  </div>
                )}
              </div>

              {/* Student Passport Photo */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wide block">
                    Official Student Photo
                  </span>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">
                    Passport size format
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewDoc({
                      url: currentStudent.studentPictureUrl,
                      title: `${currentStudent.name} - Official Student Photo`,
                    })
                  }
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> View Student Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Student ID Card */}
      {activeSubTab === 'idcard' && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <StudentIdCard student={currentStudent} settings={settings} />
        </div>
      )}

      {/* SUB-TAB 3: Enrollment Card */}
      {activeSubTab === 'enrollment' && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <EnrollmentCard student={currentStudent} settings={settings} />
        </div>
      )}

      {/* SUB-TAB: Export Student Comprehensive Report */}
      {activeSubTab === 'report' && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <StudentReportCard
            student={currentStudent}
            settings={settings}
            attendance={attendance}
            results={results}
            remarks={remarks}
          />
        </div>
      )}

      {/* SUB-TAB 4: Result Sheet */}
      {activeSubTab === 'result' && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          {studentResult ? (
            <ResultSheet result={studentResult} settings={settings} />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 space-y-2">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No Result Sheet Published Yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Term examination results are compiled by the Headmaster and will appear here once marked.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: School Leaving Certificate */}
      {activeSubTab === 'slc' && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          {studentSLC ? (
            <LeavingCertificate certificate={studentSLC} settings={settings} />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 space-y-2">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Currently Active Student</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                School Leaving Certificates are issued by the Headmaster upon passing matriculation or transfer.
              </p>
              {results.length > 0 && (
                <button
                  onClick={() => setActiveSubTab('result')}
                  className="mt-2 px-4 py-2 rounded-lg bg-emerald-800 text-white font-bold text-xs"
                >
                  View Academic Result Instead
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 6: Teachers Daily Remarks & Classwork Performance */}
      {/* Required by user prompt:
          "Students can check teachers' daily remarks class work performance." */}
      {activeSubTab === 'remarks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Daily Teacher Remarks & Homework Tasks
            </h3>
            <span className="text-xs text-slate-500">Reflected in real-time for parents & students</span>
          </div>

          <div className="space-y-3">
            {studentRemarks.length > 0 ? (
              studentRemarks.map((rem) => (
                <div
                  key={rem.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{rem.subject}</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rem.teacherName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rem.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                        Classwork Covered in Period
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">{rem.classWork}</p>
                    </div>

                    <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-100">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block mb-1">
                        Assigned Homework Task
                      </span>
                      <p className="text-amber-950 leading-relaxed font-medium">{rem.homeworkTask}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">Teacher's Evaluation:</span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                        {rem.performanceRemark}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rem.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No teacher remarks recorded for today yet.</p>
                <p className="text-xs text-slate-400">Teachers log classwork and homework daily after Period 1.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: Daily Attendance */}
      {/* Required by user prompt: "Students can see their own attendance daily." */}
      {activeSubTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Daily Attendance Record
              </h3>
              <p className="text-xs text-slate-500">Official attendance marked daily by Period 1 Class Teacher</p>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900">Monthly Attendance:</span>
              <span className="text-lg font-black text-emerald-800">{attendancePercentage}%</span>
            </div>
          </div>

          {/* List of daily attendance records */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Class & Period</th>
                  <th className="py-2.5 px-3">Attendance Status</th>
                  <th className="py-2.5 px-3">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{rec.date}</td>
                    <td className="py-2.5 px-3 text-slate-600">{rec.className || currentStudent.appliedClass} (Period {rec.period || 1})</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                          rec.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : rec.status === 'Leave'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{rec.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: Timetable */}
      {activeSubTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Class Schedule & Teaching Timetable
            </h3>
            <p className="text-xs text-slate-500">
              Period 1 to Period 6 timetable for {currentStudent.appliedClass}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {classTimetable.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 hover:border-emerald-500 transition"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="bg-emerald-800 text-white px-2 py-0.5 rounded">
                    Period {slot.period}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{slot.time}</span>
                </div>

                <div>
                  <h5 className="font-extrabold text-slate-900 text-sm">{slot.subject}</h5>
                  <p className="text-xs text-slate-600 font-medium">{slot.teacherName}</p>
                </div>

                {slot.isSubstituted && (
                  <div className="text-[10px] bg-amber-100 text-amber-900 px-2 py-1 rounded font-bold">
                    Proxy Teacher Today: {slot.substitutedTeacherName} ({slot.substitutionReason})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Document Viewer for Student Records */}
      {previewDoc && (
        <DocumentViewerModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          fileUrl={previewDoc.url}
          title={previewDoc.title}
        />
      )}
    </div>
  );
};
