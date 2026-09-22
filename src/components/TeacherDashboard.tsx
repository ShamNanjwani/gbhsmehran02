import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { FileUploadZone } from './common/FileUploadZone';
import { SafeMediaImage } from './common/SafeMediaImage';
import {
  UserCheck,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  PlusCircle,
  Users,
  Search,
  Sparkles,
  Lock,
  Mail,
  Award,
  Eye,
  EyeOff,
  UserPlus,
  Phone,
  IdCard,
  LogOut,
  Printer,
  FileText,
  Download,
} from 'lucide-react';
import { Teacher, TimetableSlot, Student, AttendanceRecord } from '../types';
import { TeacherIdCard } from './cards/TeacherIdCard';
import { TeacherReportCard } from './cards/TeacherReportCard';
import { AttendanceTrendChart } from './charts/AttendanceTrendChart';
import { downloadTeacherJoiningLetterPDF, downloadTeacherConfirmationLetterPDF } from '../utils/pdfGenerator';
import { printIsolatedElement } from '../utils/printUtils';
import { HeadmasterSignatureDisplay } from './common/HeadmasterSignatureDisplay';
import { SchoolLogo } from './common/SchoolLogo';
import { DocumentViewerModal } from './common/DocumentViewerModal';
import { DocumentPrintPreviewModal } from './common/DocumentPrintPreviewModal';
import { TeacherTimetableSection } from './TeacherTimetableSection';
import { AnnouncementBanner } from './common/AnnouncementBanner';
import { FileCheck, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';
import { QrAttendanceScannerModal } from './admin/QrAttendanceScannerModal';

export const TeacherDashboard: React.FC = () => {
  const {
    currentRole,
    currentUser,
    settings,
    teachers,
    students,
    timetable,
    remarks,
    attendance,
    loginAsTeacher,
    registerTeacher,
    markDailyAttendance,
    postDailyRemark,
    logout,
  } = useSchool();

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regFatherName, setRegFatherName] = useState('');
  const [regDesignation, setRegDesignation] = useState('JEST');
  const [regPid, setRegPid] = useState('');
  const [regCnic, setRegCnic] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regMobileNo, setRegMobileNo] = useState('');
  const [regQualification, setRegQualification] = useState('');
  const [regSubject, setRegSubject] = useState('');
  const [regPictureUrl, setRegPictureUrl] = useState('');
  const [regCnicFileUrl, setRegCnicFileUrl] = useState('');
  const [regCnicFileName, setRegCnicFileName] = useState('');
  const [regAppointmentOrderUrl, setRegAppointmentOrderUrl] = useState('');
  const [regAppointmentOrderFileName, setRegAppointmentOrderFileName] = useState('');

  // Selected teacher
  const currentTeacher: Teacher | undefined =
    teachers.find((t) => t.id === currentUser?.id || t.email?.toLowerCase() === currentUser?.email?.toLowerCase());

  // Document preview modals
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);
  const [showJoiningLetterPreview, setShowJoiningLetterPreview] = useState(false);
  const [showConfirmationLetterPreview, setShowConfirmationLetterPreview] = useState(false);

  // Tabs within Teacher Portal
  const [subTab, setSubTab] = useState<
    'timetable' | 'attendance' | 'remarks' | 'proxy' | 'joining-letter' | 'confirmation-letter' | 'idcard' | 'report'
  >('timetable');

  // Attendance marking state
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState('Class 9th');
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<Record<string, 'Present' | 'Absent' | 'Leave'>>({});
  const [showQrAttendanceScanner, setShowQrAttendanceScanner] = useState(false);

  // Remarks posting state
  const [remarkStudentId, setRemarkStudentId] = useState('');
  const [remarkSubject, setRemarkSubject] = useState(currentTeacher?.subjectSpecialist?.split('&')[0]?.trim() || 'Computer Science');
  const [classWorkText, setClassWorkText] = useState('');
  const [homeworkText, setHomeworkText] = useState('');
  const [remarkPerformance, setRemarkPerformance] = useState('Excellent performance, quick grasp.');
  const [remarkRating, setRemarkRating] = useState(5);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regQualification || !regSubject) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const assignedPid = regPid.trim() || `PID-${Math.floor(1000000 + Math.random() * 9000000)}`;
    registerTeacher({
      name: regName,
      fatherName: regFatherName || 'N/A',
      pid: assignedPid,
      cnic: regCnic || '44301-XXXXXXX-X',
      email: regEmail,
      password: regPassword,
      mobileNo: regMobileNo || '+92-346-XXXXXXX',
      qualification: regQualification,
      subjectSpecialist: regSubject,
      pictureUrl: regPictureUrl,
      designation: regDesignation,
      isAvailableToday: true,
      cnicFileUrl: regCnicFileUrl,
      cnicFileName: regCnicFileName,
      appointmentOrderUrl: regAppointmentOrderUrl,
      appointmentOrderFileName: regAppointmentOrderFileName,
    });

    setRegSuccessMsg(
      `Registration submitted for ${regName}! Your account and uploaded documents (CNIC & Appointment Order) are currently pending Headmaster/Admin scrutiny. Once approved and Joining Letter is issued, you can log in with your email (${regEmail}) or PID (${assignedPid}) and password.`
    );
    setEmail(regEmail);
    setPassword(regPassword);
    setAuthMode('login');
  };

  // If not logged in as teacher, show teacher login / register screen
  if (currentRole !== 'teacher' || !currentTeacher) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        {/* School-Wide Urgent Advisories & Faculty Notices */}
        <AnnouncementBanner role="teacher" />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white p-6 text-center space-y-2 border-b-4 border-amber-400">
            <div className="w-14 h-14 rounded-2xl bg-teal-800 text-amber-300 flex items-center justify-center mx-auto shadow-md border border-teal-700">
              <UserCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black">Teacher & Faculty Portal</h2>
            <p className="text-xs text-teal-100">
              Government Boys High School Mehrand (SEMIS: 406020752)
            </p>

            {/* Auth Switcher */}
            <div className="flex bg-teal-900/80 p-1 rounded-xl border border-teal-700/60 max-w-xs mx-auto mt-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition ${
                  authMode === 'login' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-teal-200 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setLoginError('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition ${
                  authMode === 'register' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-teal-200 hover:text-white'
                }`}
              >
                Register 1st
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {regSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{regSuccessMsg}</span>
              </div>
            )}

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              /* Teacher Login Form */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setLoginError('');
                  const res = loginAsTeacher(email, password);
                  if (!res.success) {
                    setLoginError(res.message);
                  }
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Registered Email or Government PID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 font-mono"
                      placeholder="e.g. teacher@gmail.com or PID-10884920"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teacher Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                      placeholder="Enter your confidential password"
                    />
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
                  className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-sm shadow-md transition"
                >
                  Sign In to Teacher Dashboard
                </button>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500">
                    New teacher joining GBHS Mehrand?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setLoginError('');
                      }}
                      className="text-teal-700 font-black hover:underline"
                    >
                      Register 1st here →
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* Teacher Registration Form (Register 1st) */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-[11px] leading-relaxed">
                  <strong>Faculty Registration Process:</strong> Register your credentials first. Your application is reviewed by the Headmaster/Admin. Once approved, you can log in with your email or PID and chosen password.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Teacher Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Father's name"
                      value={regFatherName}
                      onChange={(e) => setRegFatherName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designation *</label>
                    <select
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 font-bold text-slate-800"
                    >
                      <option value="JEST">JEST (Junior Elementary School Teacher)</option>
                      <option value="PST">PST (Primary School Teacher)</option>
                      <option value="HST">HST (High School Teacher)</option>
                      <option value="SS">SS (Subject Specialist)</option>
                      <option value="Headmaster">Headmaster / Senior HM</option>
                      <option value="PTI">PTI (Physical Training Instructor)</option>
                      <option value="Lab Assistant">Laboratory Assistant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Govt Personal ID (PID)</label>
                    <input
                      type="text"
                      placeholder="PID-10884920 (or auto-generated)"
                      value={regPid}
                      onChange={(e) => setRegPid(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CNIC Number</label>
                    <input
                      type="text"
                      placeholder="44301-XXXXXXX-X"
                      value={regCnic}
                      onChange={(e) => setRegCnic(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp No</label>
                    <input
                      type="tel"
                      placeholder="+92-346-XXXXXXX"
                      value={regMobileNo}
                      onChange={(e) => setRegMobileNo(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official / Personal Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="teacher@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                    <div className="relative">
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        required
                        placeholder="Set strong password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pr-9 pl-2.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {regShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Highest Qualification *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. M.Sc (Computer Science), B.Ed"
                      value={regQualification}
                      onChange={(e) => setRegQualification(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject Specialization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mathematics & Physics"
                      value={regSubject}
                      onChange={(e) => setRegSubject(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <FileUploadZone
                    id="teacher-reg-photo"
                    label="Teacher Profile Picture / Official Photo"
                    required
                    value={regPictureUrl}
                    onChange={(val) => setRegPictureUrl(val)}
                    previewShape="avatar"
                    helperText="Upload official passport size photo in PDF or Image format (PNG, JPG, WebP) — no links needed"
                    badgeText="Govt Teacher Photo"
                  />
                </div>

                <div>
                  <FileUploadZone
                    id="teacher-reg-cnic"
                    label="Teacher CNIC (Front / Back or Combined PDF / Image) *"
                    required
                    value={regCnicFileUrl}
                    fileName={regCnicFileName}
                    onChange={(val, name) => {
                      setRegCnicFileUrl(val);
                      if (name) setRegCnicFileName(name);
                    }}
                    previewShape="banner"
                    helperText="Upload official CNIC copy (scanned image or PDF). Reviewed by Admin/HM for verification."
                    badgeText="Govt. CNIC Document"
                  />
                </div>

                <div>
                  <FileUploadZone
                    id="teacher-reg-appointment-order"
                    label="Transfer / Appointment Order (SELD Official Order PDF / Image) *"
                    required
                    value={regAppointmentOrderUrl}
                    fileName={regAppointmentOrderFileName}
                    onChange={(val, name) => {
                      setRegAppointmentOrderUrl(val);
                      if (name) setRegAppointmentOrderFileName(name);
                    }}
                    previewShape="box"
                    helperText="Upload SELD official appointment or transfer order document (PDF or scanned image)."
                    badgeText="Govt. Appointment Order"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Submit Teacher Registration (Register 1st)
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setLoginError('');
                    }}
                    className="text-xs text-teal-700 font-bold hover:underline"
                  >
                    Already registered? Sign In to Teacher Dashboard →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Teacher is logged in!
  // Filter timetable for this teacher
  const myTimetable = timetable.filter(
    (t) => t.teacherId === currentTeacher.id || t.teacherName.toLowerCase() === currentTeacher.name.toLowerCase()
  );

  // Filter proxy slots assigned to this teacher
  const proxySlots = timetable.filter(
    (t) => t.isSubstituted && t.substitutedTeacherId === currentTeacher.id
  );

  // Students of the selected class
  const classStudents = students.filter(
    (s) => s.status === 'approved' && s.appliedClass.toLowerCase().includes(selectedClassForAttendance.toLowerCase().replace('class ', ''))
  );

  // Handle save attendance
  const handleSaveAttendance = () => {
    const records: AttendanceRecord[] = classStudents.map((s) => ({
      id: `att-${Date.now()}-${s.id}`,
      date: attendanceDate,
      personId: s.id,
      personName: s.name,
      type: 'student',
      className: selectedClassForAttendance,
      period: selectedPeriod,
      status: attendanceStatusMap[s.id] || 'Present',
      markedBy: currentTeacher.name,
    }));

    markDailyAttendance(records);
  };

  // Handle post remark
  const handlePostRemarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkStudentId) {
      alert('Please select a student.');
      return;
    }
    const student = students.find((s) => s.id === remarkStudentId);
    if (!student) return;

    postDailyRemark({
      date: new Date().toISOString().split('T')[0],
      studentId: student.id,
      studentName: student.name,
      className: student.appliedClass,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      subject: remarkSubject,
      classWork: classWorkText || 'Classroom textbook exercises and concept discussions.',
      homeworkTask: homeworkText || 'Revision of unit questions and notebook completion.',
      performanceRemark: remarkPerformance,
      rating: remarkRating,
    });

    setClassWorkText('');
    setHomeworkText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Official School-Wide Announcements & Faculty Broadcasts */}
      <AnnouncementBanner role="teacher" />

      {/* Teacher Profile Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-slate-900">
              <SafeMediaImage
                src={currentTeacher.pictureUrl}
                alt={currentTeacher.name}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  {currentTeacher.pid}
                </span>
                <span className="text-xs font-bold text-teal-200 bg-teal-800 px-2 py-0.5 rounded">
                  {currentTeacher.designation || 'Teacher'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{currentTeacher.name}</h2>
              <p className="text-xs text-teal-100">
                Specialist: <strong>{currentTeacher.subjectSpecialist}</strong> • {currentTeacher.qualification}
              </p>
              <p className="text-[11px] text-teal-300 font-mono">
                CNIC: {currentTeacher.cnic} • Cell: {currentTeacher.mobileNo}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSubTab('joining-letter')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                subTab === 'joining-letter'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-teal-900/80 hover:bg-teal-800 text-amber-300 border border-amber-400/40'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Joining Letter (HM)</span>
            </button>

            <button
              onClick={() => setSubTab('confirmation-letter')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                subTab === 'confirmation-letter'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-teal-900/80 hover:bg-teal-800 text-amber-300 border border-amber-400/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Confirmation Letter</span>
            </button>

            <button
              onClick={() => setSubTab('idcard')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                subTab === 'idcard'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-teal-900/80 hover:bg-teal-800 text-amber-300 border border-amber-400/40'
              }`}
            >
              <IdCard className="w-3.5 h-3.5" />
              <span>Print ID Card</span>
            </button>

            <button
              onClick={() => setSubTab('report')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                subTab === 'report'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-teal-900/80 hover:bg-teal-800 text-amber-300 border border-amber-400/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-200 font-bold text-xs border border-teal-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Substitution Notice Banner (if any substitute class assigned by admin!) */}
      {proxySlots.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce" />
            <span>Class Engagement / Substitution Notice (Admin Assigned)</span>
          </div>
          <div className="space-y-1 text-xs text-slate-700">
            {proxySlots.map((slot) => (
              <div key={slot.id} className="p-2 bg-white rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <strong>{slot.day} - Period {slot.period} ({slot.time})</strong>: {slot.className} - {slot.subject}
                  <span className="text-amber-800 block text-[11px]">
                    Covering for: {slot.teacherName} (Reason: {slot.substitutionReason})
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-1 rounded">
                  Active Proxy Class
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setSubTab('joining-letter')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            subTab === 'joining-letter'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-700" />
          Joining Letter (HM)
          {currentTeacher.joiningLetterIssued && (
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              Issued
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('confirmation-letter')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            subTab === 'confirmation-letter'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          Confirmation Letter
        </button>

        <button
          onClick={() => setSubTab('timetable')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            subTab === 'timetable'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          My Teaching Timetable ({myTimetable.length} periods)
        </button>

        <button
          onClick={() => setSubTab('attendance')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            subTab === 'attendance'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Mark Student Attendance (Period 1)
        </button>

        <button
          onClick={() => setSubTab('remarks')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            subTab === 'remarks'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Assign Classwork & Homework Remarks
        </button>

        <button
          onClick={() => setSubTab('idcard')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            subTab === 'idcard'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <IdCard className="w-4 h-4" />
          Print ID Card
        </button>

        <button
          onClick={() => setSubTab('report')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            subTab === 'report'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Export Service Report
        </button>
      </div>

      {/* SUB-TAB 1: Dynamic Timetable Management Section */}
      {subTab === 'timetable' && (
        <TeacherTimetableSection currentTeacher={currentTeacher} />
      )}

      {/* SUB-TAB 2: Mark Students Attendance class-wise from Period 1 */}
      {/* Required by user prompt:
          "Teachers can mark students’ attendance class-wise from period 1." */}
      {subTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Mark Student Attendance Class-Wise (Period 1)
              </h3>
              <p className="text-xs text-slate-500">
                Select class and date to record official Sindh Government school attendance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQrAttendanceScanner(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-amber-300 font-black text-xs shadow-md transition flex items-center gap-1.5 border border-emerald-600/30"
              >
                <QrCode className="w-4 h-4 text-amber-300" />
                <span>Scan Student QR</span>
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Save Attendance Record
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Class</label>
              <select
                value={selectedClassForAttendance}
                onChange={(e) => setSelectedClassForAttendance(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 bg-white"
              >
                <option value="Class 6th">Class 6th</option>
                <option value="Class 7th">Class 7th</option>
                <option value="Class 8th">Class 8th</option>
                <option value="Class 9th">Class 9th</option>
                <option value="Class 10th">Class 10th</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Attendance Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 bg-white"
              >
                <option value={1}>Period 1 (Morning Roll Call)</option>
                <option value={2}>Period 2</option>
                <option value={3}>Period 3</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Students list */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">G.R. Number</th>
                  <th className="py-2.5 px-3">Student Full Name</th>
                  <th className="py-2.5 px-3">Father Name</th>
                  <th className="py-2.5 px-3 text-center">Mark Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classStudents.map((st) => {
                  const status = attendanceStatusMap[st.id] || 'Present';
                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{st.rollNo || '01'}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-red-700">{st.grNumber}</td>
                      <td className="py-2.5 px-3 font-extrabold text-slate-900">{st.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{st.fatherName}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceStatusMap({ ...attendanceStatusMap, [st.id]: 'Present' })
                            }
                            className={`px-3 py-1 transition ${
                              status === 'Present' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceStatusMap({ ...attendanceStatusMap, [st.id]: 'Absent' })
                            }
                            className={`px-3 py-1 transition border-l border-r border-slate-200 ${
                              status === 'Absent' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceStatusMap({ ...attendanceStatusMap, [st.id]: 'Leave' })
                            }
                            className={`px-3 py-1 transition ${
                              status === 'Leave' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAttendance}
              className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-xs shadow-md transition"
            >
              Submit & Sync with Student Portal
            </button>
          </div>

          {/* D3.js 30-Day Attendance Trend Analysis Chart */}
          <div className="pt-4 border-t border-slate-200">
            <AttendanceTrendChart
              attendance={attendance}
              selectedClass={selectedClassForAttendance}
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Review assignments, assign tasks, classwork remarks */}
      {/* Required by user prompt:
          "Teachers can review assignments and assign tasks for homework and remarks;
           classwork reflected; parents can see on student’s dashboard." */}
      {subTab === 'remarks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Post New Remarks Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Assign Classwork & Homework Remarks
              </h3>
              <p className="text-xs text-slate-500">
                Directly reflected on the student’s and parent’s dashboard.
              </p>
            </div>

            <form onSubmit={handlePostRemarkSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  required
                  value={remarkStudentId}
                  onChange={(e) => setRemarkStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 bg-white"
                >
                  <option value="">-- Choose enrolled student --</option>
                  {students
                    .filter((s) => s.status === 'approved')
                    .map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} S/O {st.fatherName} ({st.appliedClass} - GR: {st.grNumber})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={remarkSubject}
                  onChange={(e) => setRemarkSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                  placeholder="e.g. Computer Science / Mathematics"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Classwork Covered Today</label>
                <textarea
                  rows={2}
                  value={classWorkText}
                  onChange={(e) => setClassWorkText(e.target.value)}
                  placeholder="e.g. Practiced Binary arithmetic and flowchart logic in computer lab."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Homework Task</label>
                <textarea
                  rows={2}
                  value={homeworkText}
                  onChange={(e) => setHomeworkText(e.target.value)}
                  placeholder="e.g. Solve textbook questions 4.1 to 4.5 in homework register."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Performance Evaluation</label>
                  <select
                    value={remarkPerformance}
                    onChange={(e) => setRemarkPerformance(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 bg-white"
                  >
                    <option value="Outstanding & Quick Grasp">Outstanding & Quick Grasp</option>
                    <option value="Very Good & Attentive">Very Good & Attentive</option>
                    <option value="Good, Regular in Class">Good, Regular in Class</option>
                    <option value="Needs Focus on Homework">Needs Focus on Homework</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={remarkRating}
                    onChange={(e) => setRemarkRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-600 bg-white"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Satisfactory)</option>
                    <option value={2}>2 Stars (Needs Improvement)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                Publish Remarks to Student Dashboard
              </button>
            </form>
          </div>

          {/* Recent Posted Remarks Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Recent Class Remarks Log
            </h4>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {remarks.map((rem) => (
                <div key={rem.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">{rem.studentName} ({rem.className})</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rem.date}</span>
                  </div>
                  <div className="text-slate-600">
                    <strong>Classwork:</strong> {rem.classWork}
                  </div>
                  <div className="text-amber-900">
                    <strong>Homework:</strong> {rem.homeworkTask}
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-teal-800 font-bold">{rem.performanceRemark}</span>
                    <span className="text-amber-500 font-bold">★ {rem.rating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Printable Faculty ID Card */}
      {subTab === 'idcard' && (
        <div className="space-y-4">
          <TeacherIdCard teacher={currentTeacher} settings={settings} />
        </div>
      )}

      {/* SUB-TAB 5: Printable Faculty Service Report */}
      {subTab === 'report' && (
        <div className="space-y-4">
          <TeacherReportCard
            teacher={currentTeacher}
            settings={settings}
            timetable={timetable}
            attendance={attendance}
            remarks={remarks}
          />
        </div>
      )}

      {/* SUB-TAB 6: Official Joining Letter & Joining Report (Issued by HM) */}
      {subTab === 'joining-letter' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <FileCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Official Joining Letter & Report (Issued by Headmaster)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Government of Sindh • School Education & Literacy Department (SELD)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentTeacher.joiningLetterType === 'manual' && currentTeacher.manualJoiningLetterUrl ? (
                <>
                  <a
                    href={currentTeacher.manualJoiningLetterUrl}
                    download={currentTeacher.manualJoiningLetterFileName || `${currentTeacher.name.replace(/\s+/g, '_')}_Joining_Letter.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    Download Original PDF (Admin Uploaded)
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        url: currentTeacher.manualJoiningLetterUrl!,
                        title: `Official Joining Letter - ${currentTeacher.name}`,
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview Full Document
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => downloadTeacherJoiningLetterPDF(currentTeacher, settings)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  Download Joining Letter (PDF)
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowJoiningLetterPreview(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                title="Preview joining report before printing"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Verify & Print Letter</span>
              </button>
            </div>
          </div>

          {/* If manual file was uploaded by Admin, show direct banner and preview */}
          {currentTeacher.joiningLetterType === 'manual' && currentTeacher.manualJoiningLetterUrl && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                  <FileCheck className="w-5 h-5 text-amber-700" />
                  <span>Physical Official Joining Letter Uploaded by Admin / HM</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-mono">
                  {currentTeacher.manualJoiningLetterFileName || 'Joining_Letter_Signed.pdf'}
                </span>
              </div>
              <p className="text-xs text-amber-900">
                The school administration has reviewed your original credentials and uploaded this signed physical joining document. You can download this exact PDF/file or preview it below.
              </p>
              <div className="flex gap-2">
                <a
                  href={currentTeacher.manualJoiningLetterUrl}
                  download={currentTeacher.manualJoiningLetterFileName || 'Joining_Letter.pdf'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Uploaded PDF File
                </a>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewDoc({
                      url: currentTeacher.manualJoiningLetterUrl!,
                      title: `HM Uploaded Joining Letter - ${currentTeacher.name}`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-lg hover:bg-amber-100"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Open Fullscreen Document Viewer
                </button>
              </div>
            </div>
          )}

          {/* Formatted Official Joining Letter Document */}
          <div
            id="official-teacher-joining-letter-paper"
            className="bg-white rounded-2xl border-2 border-slate-300 p-8 sm:p-12 shadow-lg max-w-4xl mx-auto space-y-6 text-slate-900 font-serif"
          >
            {/* Document Institutional Header */}
            <div className="border-b-2 border-slate-900 pb-5 text-center relative space-y-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <SchoolLogo logoUrl={settings.logoUrl} size="md" />
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-600 font-sans">
                    GOVERNMENT OF SINDH
                  </h5>
                  <h4 className="text-xs font-black uppercase text-emerald-950 font-sans">
                    SCHOOL EDUCATION & LITERACY DEPARTMENT
                  </h4>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase font-sans">
                OFFICE OF THE HEADMASTER
              </h2>
              <h3 className="text-base sm:text-lg font-extrabold text-emerald-900 font-sans">
                {settings.schoolName}
              </h3>
              <p className="text-[11px] text-slate-600 font-sans">
                SEMIS CODE: <strong className="font-mono">{settings.semisCode}</strong> • {settings.address}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700 font-sans border-t border-slate-200 mt-3 font-semibold">
                <span>Dispatch No: <strong className="font-mono text-slate-950">{currentTeacher.joiningLetterDispatchNo || 'GBHS-MHR/JON/2026/0142'}</strong></span>
                <span>Dated: <strong className="text-slate-950">{currentTeacher.joiningLetterIssuedAt || new Date().toISOString().split('T')[0]}</strong></span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center py-2">
              <span className="inline-block border-2 border-slate-900 px-6 py-1 text-sm sm:text-base font-black uppercase tracking-wide bg-slate-50 font-sans">
                OFFICIAL JOINING & CHARGE ASSUMPTION REPORT
              </span>
            </div>

            {/* Directive Text */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 font-sans">
              <p>
                In pursuance of Government of Sindh, School Education & Literacy Department (SELD) appointment / transfer orders and upon physical scrutiny and verification of original credentials, the joining report of the following faculty member is hereby officially accepted and endorsed:
              </p>

              {/* Particulars Table */}
              <div className="rounded-xl border border-slate-300 overflow-hidden my-4">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-600 w-1/3">Faculty Name</td>
                      <td className="py-2 px-4 font-black text-slate-950">{currentTeacher.name}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-bold text-slate-600">Father's Name</td>
                      <td className="py-2 px-4 text-slate-900 font-semibold">{currentTeacher.fatherName || 'N/A'}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-600">Designation / Post</td>
                      <td className="py-2 px-4 font-bold text-emerald-900">{currentTeacher.designation} (BPS-{currentTeacher.designation === 'HST' ? '16' : currentTeacher.designation === 'Subject Specialist' ? '17' : '14'})</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-bold text-slate-600">Personal ID (PID)</td>
                      <td className="py-2 px-4 font-mono font-bold text-slate-900">{currentTeacher.pid}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-600">CNIC Number</td>
                      <td className="py-2 px-4 font-mono text-slate-900">{currentTeacher.cnic}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-bold text-slate-600">Subject Specialization</td>
                      <td className="py-2 px-4 font-bold text-slate-900">{currentTeacher.subjectSpecialist}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-600">Academic Qualifications</td>
                      <td className="py-2 px-4 text-slate-900">{currentTeacher.qualification}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-bold text-slate-600">Effective Date of Joining</td>
                      <td className="py-2 px-4 font-black text-emerald-900">{currentTeacher.joiningDate || '2026-03-01'} (Forenoon)</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2 px-4 font-bold text-slate-600">Administrative Remarks</td>
                      <td className="py-2 px-4 text-slate-700 italic">{currentTeacher.joiningRemarks || 'Original CNIC & Appointment order verified and found authentic. Taken on duty.'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                The said faculty member has physically reported on duty at <strong>{settings.schoolName}</strong> on the date specified above. They are hereby directed to assume regular teaching assignments and timetable duties as scheduled.
              </p>
            </div>

            {/* Signatures & Seal Box */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 items-end font-sans">
              <div className="text-center space-y-2">
                <div className="h-16 flex items-center justify-center font-cursive text-slate-600 italic">
                  {currentTeacher.name}
                </div>
                <div className="border-t border-slate-400 pt-1 text-xs">
                  <div className="font-extrabold text-slate-900">{currentTeacher.name}</div>
                  <div className="text-[10px] text-slate-500">Signature of Incumbent / Teacher</div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <HeadmasterSignatureDisplay
                  signatureUrl={settings.headmasterSignatureUrl}
                  headmasterName={settings.headmasterName || 'Headmaster'}
                  label="Headmaster Official Seal & Stamp"
                  subLabel={settings.schoolName}
                  size="md"
                />
              </div>
            </div>

            {/* Copy Forwarded */}
            <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-500 font-sans space-y-1">
              <div className="font-bold uppercase text-slate-700">A copy is forwarded for information and necessary action to:</div>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>The Director of Schools Education (Elementary/Secondary & Higher Secondary), Mirpurkhas Division.</li>
                <li>The District Education Officer (DEO), Tharparkar @ Mithi.</li>
                <li>The District Accounts Officer (DAO), Tharparkar @ Mithi.</li>
                <li>Personal Service Book / File of the official concerned.</li>
                <li>Office order file.</li>
              </ol>
            </div>
          </div>

          {/* Standardized Joining Letter Print Preview Modal */}
          <DocumentPrintPreviewModal
            isOpen={showJoiningLetterPreview}
            onClose={() => setShowJoiningLetterPreview(false)}
            documentType="joining-letter"
            title={`Joining Report Verification — ${currentTeacher.name}`}
            elementIdToPrint="official-teacher-joining-letter-paper"
            printDocumentTitle={`Joining_Letter_${currentTeacher.name.replace(/\s+/g, '_')}`}
            holderName={currentTeacher.name}
            holderPhotoUrl={currentTeacher.pictureUrl}
            particulars={[
              { label: 'Faculty Name', value: currentTeacher.name, highlight: true },
              { label: "Father's Name", value: currentTeacher.fatherName || 'N/A' },
              { label: 'Designation / Post', value: `${currentTeacher.designation} (BPS-${currentTeacher.designation === 'HST' ? '16' : currentTeacher.designation === 'Subject Specialist' ? '17' : '14'})`, highlight: true },
              { label: 'Personal ID (PID)', value: currentTeacher.pid, badge: 'SELD Verified' },
              { label: 'CNIC Number', value: currentTeacher.cnic },
              { label: 'Dispatch Number', value: currentTeacher.joiningLetterDispatchNo || 'GBHS-MHR/JON/2026/0142' },
              { label: 'Reported Joining Date', value: currentTeacher.joiningDate || '2026-03-01' },
              { label: 'Issuing Authority', value: settings.headmasterName || 'Headmaster, GBHS Mehrand' },
            ]}
            onDownloadPdf={() => downloadTeacherJoiningLetterPDF(currentTeacher, settings)}
            downloadPdfLabel="Download Joining Letter PDF"
          >
            <div className="bg-white rounded-xl border border-slate-300 p-6 max-w-xl mx-auto space-y-4 text-xs font-sans text-slate-800">
              <div className="text-center border-b pb-3">
                <span className="text-[10px] uppercase font-bold text-slate-500">Government of Sindh • SELD</span>
                <h4 className="font-black text-sm text-slate-900">{settings.schoolName}</h4>
                <div className="mt-1 inline-block bg-slate-900 text-white text-[10px] font-extrabold px-3 py-0.5 rounded">
                  OFFICIAL JOINING & CHARGE ASSUMPTION REPORT
                </div>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <p><strong>Faculty:</strong> {currentTeacher.name} (S/O {currentTeacher.fatherName || 'N/A'})</p>
                <p><strong>Cadre:</strong> {currentTeacher.designation} • <strong>PID:</strong> {currentTeacher.pid}</p>
                <p><strong>CNIC:</strong> {currentTeacher.cnic}</p>
                <p><strong>Joining Date:</strong> {currentTeacher.joiningDate || '2026-03-01'} (Forenoon)</p>
                <p><strong>SELD Status:</strong> Taken on duty at GBHS Mehrand pursuant to verified appointment order.</p>
              </div>
              <div className="pt-3 border-t flex justify-between items-end text-[10px] text-slate-500">
                <span>Teacher Signature</span>
                <span className="font-bold text-slate-800">Headmaster Seal & Stamp</span>
              </div>
            </div>
          </DocumentPrintPreviewModal>

          {/* Submitted Verification Documents Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Teacher Scrutinized Verification Documents
                </h4>
                <p className="text-xs text-slate-500">
                  Original records scrutinized and verified by the Administration prior to issuing this Joining Letter
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Verified & Archived
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* CNIC */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Government CNIC Document</span>
                  <div className="font-mono font-bold text-slate-900 mt-1">{currentTeacher.cnic}</div>
                  <div className="text-slate-500 text-[11px] truncate mt-0.5">
                    {currentTeacher.cnicFileName || 'CNIC_Document.pdf'}
                  </div>
                </div>

                {currentTeacher.cnicFileUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        url: currentTeacher.cnicFileUrl!,
                        title: `CNIC Document - ${currentTeacher.name}`,
                      })
                    }
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    View Real CNIC Document
                  </button>
                ) : (
                  <span className="text-slate-400 italic">No CNIC file uploaded</span>
                )}
              </div>

              {/* Appointment Order */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Transfer / Appointment Order</span>
                  <div className="font-mono font-bold text-slate-900 mt-1">{currentTeacher.pid}</div>
                  <div className="text-slate-500 text-[11px] truncate mt-0.5">
                    {currentTeacher.appointmentOrderFileName || 'Appointment_Order.pdf'}
                  </div>
                </div>

                {currentTeacher.appointmentOrderUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        url: currentTeacher.appointmentOrderUrl!,
                        title: `Appointment / Transfer Order - ${currentTeacher.name}`,
                      })
                    }
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    View Real Appointment Order
                  </button>
                ) : (
                  <span className="text-slate-400 italic">No Appointment order file uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: Faculty Confirmation Letter */}
      {subTab === 'confirmation-letter' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                Faculty Appointment & Confirmation Letter
              </h3>
              <p className="text-xs text-slate-500">
                Official institutional verification document issued by Government Boys High School Mehrand
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => downloadTeacherConfirmationLetterPDF(currentTeacher, settings)}
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                Download Confirmation Letter (PDF)
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmationLetterPreview(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                title="Preview confirmation letter before printing"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Verify & Print Letter</span>
              </button>
            </div>
          </div>

          <div
            id="official-teacher-confirmation-letter-paper"
            className="bg-white rounded-2xl border-2 border-slate-300 p-8 sm:p-12 shadow-lg max-w-4xl mx-auto space-y-6 text-slate-900 font-sans"
          >
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-5 text-center relative space-y-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <SchoolLogo logoUrl={settings.logoUrl} size="md" />
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                    GOVERNMENT OF SINDH
                  </h5>
                  <h4 className="text-xs font-black uppercase text-emerald-950">
                    SCHOOL EDUCATION & LITERACY DEPARTMENT
                  </h4>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                {settings.schoolName}
              </h2>
              <p className="text-[11px] text-slate-600">
                SEMIS CODE: <strong className="font-mono">{settings.semisCode}</strong> • {settings.address}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700 border-t border-slate-200 mt-3 font-semibold">
                <span>Ref: <strong className="font-mono text-slate-950">GBHS-MHR/CONF/{currentTeacher.pid}</strong></span>
                <span>Date: <strong className="text-slate-950">{new Date().toLocaleDateString('en-GB')}</strong></span>
              </div>
            </div>

            {/* Letter Title */}
            <div className="text-center py-2">
              <span className="inline-block border-2 border-slate-900 px-6 py-1 text-sm sm:text-base font-black uppercase tracking-wide bg-slate-50">
                TO WHOM IT MAY CONCERN / SERVICE CONFIRMATION LETTER
              </span>
            </div>

            {/* Letter Body */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4">
              <p>
                This is to officially certify that <strong>Mr./Ms. {currentTeacher.name}</strong>, S/O / D/O <strong>{currentTeacher.fatherName || 'N/A'}</strong>, holding Government Personal ID <strong>{currentTeacher.pid}</strong> and CNIC No. <strong>{currentTeacher.cnic}</strong>, is a bonafide regular faculty member at <strong>{settings.schoolName}</strong> (SEMIS: {settings.semisCode}).
              </p>

              <p>
                The incumbent is actively appointed as <strong>{currentTeacher.designation}</strong> and serves as <strong>Subject Specialist ({currentTeacher.subjectSpecialist})</strong>. According to official institutional records, their joining at this institution stands confirmed with effect from <strong>{currentTeacher.joiningDate || '01-03-2026'}</strong>.
              </p>

              <p>
                During their tenure at this institution, their character, conduct, and professional devotion to academic instruction have been exemplary.
              </p>
            </div>

            {/* Headmaster Signature */}
            <div className="pt-10 border-t border-slate-200 flex justify-end">
              <div className="text-center w-64">
                <HeadmasterSignatureDisplay
                  signatureUrl={settings.headmasterSignatureUrl}
                  headmasterName={settings.headmasterName || 'Headmaster'}
                  label="Headmaster Official Seal & Stamp"
                  subLabel={settings.schoolName}
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Standardized Confirmation Letter Print Preview Modal */}
          <DocumentPrintPreviewModal
            isOpen={showConfirmationLetterPreview}
            onClose={() => setShowConfirmationLetterPreview(false)}
            documentType="confirmation-letter"
            title={`Faculty Confirmation Letter Verification — ${currentTeacher.name}`}
            elementIdToPrint="official-teacher-confirmation-letter-paper"
            printDocumentTitle={`Confirmation_Letter_${currentTeacher.name.replace(/\s+/g, '_')}`}
            holderName={currentTeacher.name}
            holderPhotoUrl={currentTeacher.pictureUrl}
            particulars={[
              { label: 'Faculty Name', value: currentTeacher.name, highlight: true },
              { label: "Father's Name", value: currentTeacher.fatherName || 'N/A' },
              { label: 'Cadre / Designation', value: currentTeacher.designation, highlight: true },
              { label: 'Personal ID (PID)', value: currentTeacher.pid, badge: 'SELD Sindh' },
              { label: 'CNIC Number', value: currentTeacher.cnic },
              { label: 'Subject Specialization', value: currentTeacher.subjectSpecialist },
              { label: 'Academic Qualification', value: currentTeacher.qualification },
              { label: 'Verified Duty Date', value: currentTeacher.joiningDate || '2026-03-01' },
              { label: 'Issuing Institution', value: `${settings.schoolName} (SEMIS: ${settings.semisCode})` },
            ]}
            onDownloadPdf={() => downloadTeacherConfirmationLetterPDF(currentTeacher, settings)}
            downloadPdfLabel="Download Confirmation Letter PDF"
          >
            <div className="bg-white rounded-xl border border-slate-300 p-6 max-w-xl mx-auto space-y-4 text-xs font-sans text-slate-800">
              <div className="text-center border-b pb-3">
                <span className="text-[10px] uppercase font-bold text-slate-500">Government of Sindh • SELD</span>
                <h4 className="font-black text-sm text-slate-900">{settings.schoolName}</h4>
                <div className="mt-1 inline-block bg-teal-900 text-white text-[10px] font-extrabold px-3 py-0.5 rounded">
                  FACULTY APPOINTMENT & CONFIRMATION CERTIFICATE
                </div>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <p>This is to certify that <strong>{currentTeacher.name}</strong> (PID: <span className="font-mono font-bold">{currentTeacher.pid}</span>, CNIC: <span className="font-mono">{currentTeacher.cnic}</span>) is a confirmed and verified faculty member serving as <strong>{currentTeacher.designation}</strong> ({currentTeacher.subjectSpecialist}) at {settings.schoolName}.</p>
                <p>This credential certificate is issued under the authority of the Headmaster for official service record and verification purposes.</p>
              </div>
              <div className="pt-3 border-t flex justify-between items-end text-[10px] text-slate-500">
                <span>SELD Verification</span>
                <span className="font-bold text-slate-800">Headmaster Seal & Stamp</span>
              </div>
            </div>
          </DocumentPrintPreviewModal>
        </div>
      )}

      {/* Document Viewer Modal */}
      {previewDoc && (
        <DocumentViewerModal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          documentUrl={previewDoc.url}
          title={previewDoc.title}
        />
      )}

      {/* QR Attendance & Verification Scanner Modal */}
      <QrAttendanceScannerModal
        isOpen={showQrAttendanceScanner}
        onClose={() => setShowQrAttendanceScanner(false)}
        defaultMode="student"
      />
    </div>
  );
};
