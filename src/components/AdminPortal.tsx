import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Shield,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  FileCheck,
  FileText,
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Edit3,
  Save,
  Lock,
  Upload,
  Sparkles,
  Inbox,
  UserCheck,
  HelpCircle,
  Eye,
  EyeOff,
  PhoneCall,
  MailCheck,
  Building2,
} from 'lucide-react';
import { Student, Teacher, TimetableSlot, StudentResult, LeavingCertificateData } from '../types';
import { FileUploadZone } from './common/FileUploadZone';
import { DocumentViewerModal } from './common/DocumentViewerModal';
import { EditStudentModal } from './admin/EditStudentModal';
import { EditTeacherModal } from './admin/EditTeacherModal';

export const AdminPortal: React.FC = () => {
  const {
    currentRole,
    loginAsAdmin,
    logout,
    settings,
    updateSettings,
    leaderMessages,
    updateLeaderMessage,
    students,
    updateStudent,
    approveStudent,
    rejectStudent,
    deleteStudent,
    teachers,
    updateTeacher,
    approveTeacher,
    rejectTeacher,
    deleteTeacher,
    timetable,
    updateTimetableSlot,
    assignProxyTeacher,
    clearProxySubstitution,
    attendance,
    markDailyAttendance,
    results,
    issueOrUpdateResult,
    leavingCertificates,
    issueLeavingCertificate,
    inquiries,
    markInquiryRead,
  } = useSchool();

  // Login credentials state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Admin Active Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'admissions' | 'teachers' | 'timetable' | 'attendance' | 'certificates' | 'cms' | 'messages'
  >('overview');

  // State for allotting GR No modal
  const [selectedStudentForApproval, setSelectedStudentForApproval] = useState<Student | null>(null);
  const [allottedGrNo, setAllottedGrNo] = useState('');
  const [allottedSection, setAllottedSection] = useState('A');
  const [allottedRollNo, setAllottedRollNo] = useState('01');

  // State for editing student & teacher records (Required: "Admin can edit Teacher and student records")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // State for adding/editing timetable slot
  const [editSlot, setEditSlot] = useState<TimetableSlot | null>(null);

  // State for substituting a class (if teacher on leave)
  const [proxySlotId, setProxySlotId] = useState<string>('');
  const [proxyTeacherId, setProxyTeacherId] = useState<string>('');
  const [proxyReason, setProxyReason] = useState<string>('Regular teacher on leave');

  // CMS state (Required: Logo upload option, School time, Official Email, Official Helpline & Mobile)
  const [cmsSchoolName, setCmsSchoolName] = useState(settings.schoolName);
  const [cmsLogoUrl, setCmsLogoUrl] = useState(settings.logoUrl);
  const [cmsHeroBannerUrl, setCmsHeroBannerUrl] = useState(settings.heroBannerUrl);
  const [cmsMission, setCmsMission] = useState(settings.mission);
  const [cmsVision, setCmsVision] = useState(settings.vision);
  const [cmsAbout, setCmsAbout] = useState(settings.aboutHistory);
  const [cmsEnrollmentValidTill, setCmsEnrollmentValidTill] = useState(settings.enrollmentCardValidTill);
  const [cmsDesignerName, setCmsDesignerName] = useState(settings.designerName);
  const [cmsDesignerPicture, setCmsDesignerPicture] = useState(settings.designerPictureUrl);
  const [cmsSchoolTiming, setCmsSchoolTiming] = useState(
    settings.schoolTiming || '08:00 AM - 01:30 PM (Mon - Sat, Friday: 08:00 AM - 12:00 PM)'
  );
  const [cmsEmail, setCmsEmail] = useState(settings.email || 'info.gbhsmehrand@gmail.com');
  const [cmsOfficialHelpline, setCmsOfficialHelpline] = useState(
    settings.officialHelpline || '+92-232-920045'
  );
  const [cmsOfficialMobile, setCmsOfficialMobile] = useState(
    settings.officialMobile || '+92-346-3847836'
  );
  const [cmsPhone, setCmsPhone] = useState(settings.phone || '+92-346-3847836');
  const [cmsAddress, setCmsAddress] = useState(
    settings.address || 'Village Mehrand P.O Kaloi Taluka Kaloi District Tharparkar @ Mithi'
  );
  const [cmsSemisCode, setCmsSemisCode] = useState(settings.semisCode || '406020752');

  // Document Viewer modal state
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);

  // If not logged in as admin, show login box
  if (currentRole !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <div className="bg-white rounded-2xl border-2 border-amber-400 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center mx-auto shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Admin Control Center</h2>
            <p className="text-xs text-slate-500">
              Government Boys High School Mehrand (SEMIS: 406020752)
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginAsAdmin(adminUsername, adminPassword);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Username</label>
              <input
                type="text"
                required
                placeholder="Sham Nanjwani"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  placeholder="Sham@580"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition"
            >
              Sign In to Master Control
            </button>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-center space-y-2">
              <p className="text-[11px] text-amber-950 font-semibold">
                Authorized Administrator: <span className="font-mono font-bold">Sham Nanjwani</span> | Password: <span className="font-mono font-bold">Sham@580</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setAdminUsername('Sham Nanjwani');
                  setAdminPassword('Sham@580');
                }}
                className="w-full py-1.5 px-3 bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-xs transition"
              >
                Auto-Fill Admin Credentials (Sham Nanjwani)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Pending admissions count
  const pendingAdmissions = students.filter((s) => s.status === 'pending');
  const pendingTeachers = teachers.filter((t) => t.status === 'pending');

  const handleOpenApproveStudent = (st: Student) => {
    setSelectedStudentForApproval(st);
    setAllottedGrNo(`GR-406020752-${Math.floor(1000 + Math.random() * 9000)}`);
    setAllottedSection('A');
    setAllottedRollNo('01');
  };

  const handleConfirmApproval = () => {
    if (!selectedStudentForApproval) return;
    approveStudent(selectedStudentForApproval.id, allottedGrNo, allottedSection, allottedRollNo);
    setSelectedStudentForApproval(null);
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName: cmsSchoolName,
      logoUrl: cmsLogoUrl,
      heroBannerUrl: cmsHeroBannerUrl,
      mission: cmsMission,
      vision: cmsVision,
      aboutHistory: cmsAbout,
      enrollmentCardValidTill: cmsEnrollmentValidTill,
      designerName: cmsDesignerName,
      designerPictureUrl: cmsDesignerPicture,
      schoolTiming: cmsSchoolTiming,
      email: cmsEmail,
      officialHelpline: cmsOfficialHelpline,
      officialMobile: cmsOfficialMobile,
      phone: cmsPhone,
      address: cmsAddress,
      semisCode: cmsSemisCode,
    });
    alert('School Settings, Timings, Official Helpline, Email & Uploaded Logo successfully saved!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-b-4 border-amber-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 p-3 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded uppercase">
                  Super Admin
                </span>
                <span className="text-amber-400 font-mono text-xs font-bold">
                  SEMIS: {settings.semisCode}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">GBHS Mehrand Administration Panel</h2>
              <p className="text-xs text-slate-300">
                Full authority over admissions, teachers, timetable auto-assignment, ID cards, certificates, and school CMS.
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/40 transition"
          >
            Sign Out Admin
          </button>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: Shield },
          {
            id: 'admissions',
            label: `Student Admissions (${pendingAdmissions.length} Pending)`,
            icon: GraduationCap,
            badge: pendingAdmissions.length > 0 ? pendingAdmissions.length : undefined,
          },
          {
            id: 'teachers',
            label: `Faculty & Staff (${pendingTeachers.length} Review)`,
            icon: Users,
            badge: pendingTeachers.length > 0 ? pendingTeachers.length : undefined,
          },
          { id: 'timetable', label: 'Timetable & Proxy Substitution', icon: Clock },
          { id: 'attendance', label: 'Attendance Hub', icon: Calendar },
          { id: 'certificates', label: 'ID Cards & Certificate Formats', icon: FileCheck },
          { id: 'cms', label: 'School CMS & Messages (Minister/Sec/HM)', icon: SettingsIcon },
          { id: 'messages', label: `Inquiries (${inquiries.filter((i) => i.status === 'unread').length})`, icon: Inbox },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ADMIN TAB 1: Overview */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered Students</span>
              <div className="text-2xl font-black text-slate-900">{students.length}</div>
              <span className="text-xs text-emerald-700 font-semibold">
                {students.filter((s) => s.status === 'approved').length} Approved & Enrolled
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Teaching Faculty</span>
              <div className="text-2xl font-black text-teal-800">{teachers.length}</div>
              <span className="text-xs text-slate-500 font-semibold">
                {teachers.filter((t) => t.status === 'approved').length} Active on Faculty Page
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pending Admission Queue</span>
              <div className="text-2xl font-black text-amber-600">{pendingAdmissions.length}</div>
              <button
                onClick={() => setActiveAdminTab('admissions')}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                Review Applications →
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Timetable Slots</span>
              <div className="text-2xl font-black text-blue-700">{timetable.length}</div>
              <span className="text-xs text-slate-500">Periods 1-6 across classes</span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Review New Admissions</h4>
              <p className="text-xs text-slate-500">
                Check uploaded B-Form copies and school leaving certificates, allot official GR Numbers, and generate confirmation letters.
              </p>
              <button
                onClick={() => setActiveAdminTab('admissions')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Go to Admissions ({pendingAdmissions.length})
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Class Substitution & Timetable</h4>
              <p className="text-xs text-slate-500">
                If any teacher is on leave today, assign any other teacher as proxy to engage the class with instant timetable notice.
              </p>
              <button
                onClick={() => setActiveAdminTab('timetable')}
                className="px-3 py-1.5 rounded-lg bg-teal-800 text-white font-bold text-xs hover:bg-teal-700"
              >
                Manage Timetable & Proxy
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Edit Dignitary Messages</h4>
              <p className="text-xs text-slate-500">
                Edit Minister Message, Secretary Message, Headmaster Message, School Mission & Vision, and Designer details.
              </p>
              <button
                onClick={() => setActiveAdminTab('cms')}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700"
              >
                CMS Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 2: Admissions & Allot GR */}
      {/* Required by user prompt:
          "after approved by admin and confirmation letter issue with GR Allotted to student
           and displayed on Students Dashboard, Student Can see Enrollment Card, ID Card Result Sheet
           and School Leaving certificate and also student download in pdf form" */}
      {activeAdminTab === 'admissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Student Admission Control & GR Number Allotment
              </h3>
              <p className="text-xs text-slate-500">
                Review submitted B-Form and School Leaving Certificates, approve with GR No, or reject.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
              Total: {students.length} Students ({pendingAdmissions.length} Pending Approval)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Student Name & Father</th>
                  <th className="py-2.5 px-3">Applied Class</th>
                  <th className="py-2.5 px-3">B-Form / CNIC</th>
                  <th className="py-2.5 px-3">B-Form Doc</th>
                  <th className="py-2.5 px-3">Leaving Cert (SLC)</th>
                  <th className="py-2.5 px-3">G.R. Number</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="font-extrabold text-slate-900">{st.name}</div>
                      <div className="text-slate-500 text-[11px]">S/O {st.fatherName}</div>
                      <div className="text-[10px] text-slate-400">{st.address.mohVillage}, {st.address.townCity}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-800">{st.appliedClass}</td>
                    <td className="py-2.5 px-3 font-mono">
                      <div>{st.cnicBForm}</div>
                      {st.isBFormAvailable === false && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                          Father CNIC (Alt)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {st.isBFormAvailable !== false && st.bFormPictureUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              url: st.bFormPictureUrl,
                              title: `${st.name}'s NADRA B-Form Document`,
                            })
                          }
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded font-semibold text-[11px] transition"
                        >
                          <Eye className="w-3 h-3" /> View B-Form
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {st.fatherCnicFrontUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDoc({
                                  url: st.fatherCnicFrontUrl,
                                  title: `${st.name}'s Father CNIC (Front Side)`,
                                })
                              }
                              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded font-semibold text-[10px] transition border border-amber-200"
                            >
                              <Eye className="w-3 h-3" /> CNIC Front
                            </button>
                          )}
                          {st.fatherCnicBackUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDoc({
                                  url: st.fatherCnicBackUrl,
                                  title: `${st.name}'s Father CNIC (Back Side)`,
                                })
                              }
                              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded font-semibold text-[10px] transition border border-amber-200"
                            >
                              <Eye className="w-3 h-3" /> CNIC Back
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {st.leavingCertificateUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              url: st.leavingCertificateUrl!,
                              title: `${st.name}'s School Leaving Certificate`,
                            })
                          }
                          className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded font-semibold text-[11px] transition"
                        >
                          <Eye className="w-3 h-3" /> View SLC
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          {st.appliedClass.includes('ECCE') || st.appliedClass === 'Class 1'
                            ? 'Exempted (Fresh Entry)'
                            : 'Not Provided'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-700">
                      {st.grNumber || 'Not Allotted'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                          st.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {st.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingStudent(st)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs flex items-center gap-1 transition"
                          title="Edit Student Record"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        {st.status === 'pending' && (
                          <button
                            onClick={() => handleOpenApproveStudent(st)}
                            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-bold text-xs"
                          >
                            Allot GR & Approve
                          </button>
                        )}
                        {st.status !== 'rejected' && (
                          <button
                            onClick={() => rejectStudent(st.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-red-600 rounded text-xs"
                            title="Reject"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => deleteStudent(st.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALLOT GR NUMBER MODAL */}
      {selectedStudentForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-base font-black text-slate-900">
                Allot Official GR Number & Section
              </h4>
              <p className="text-slate-500">
                Approving admission for: <strong>{selectedStudentForApproval.name}</strong> ({selectedStudentForApproval.appliedClass})
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  General Register (GR) Number *
                </label>
                <input
                  type="text"
                  required
                  value={allottedGrNo}
                  onChange={(e) => setAllottedGrNo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold text-red-700"
                />
                <span className="text-[10px] text-slate-400">e.g. GR-406020752-0145</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={allottedSection}
                    onChange={(e) => setAllottedSection(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="Section A"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={allottedRollNo}
                    onChange={(e) => setAllottedRollNo(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="01"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedStudentForApproval(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-4 py-1.5 rounded-lg bg-emerald-800 text-white font-black hover:bg-emerald-700"
              >
                Approve & Issue Confirmation Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 3: Faculty & Teacher Approvals */}
      {/* Required by user prompt:
          "Teacher registers via email and password... Then submit and review by Admin;
           after approval by admin and confirmation pop-up to teacher, display teacher on Main Faculty section" */}
      {activeAdminTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Faculty & Teacher Registration Review
              </h3>
              <p className="text-xs text-slate-500">
                Approve teacher applications to feature them on the main Faculty section and grant dashboard access.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              Total: {teachers.length} Teachers ({pendingTeachers.length} Pending Review)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Teacher Name</th>
                  <th className="py-2.5 px-3">PID Number</th>
                  <th className="py-2.5 px-3">CNIC & Cell</th>
                  <th className="py-2.5 px-3">Qualifications</th>
                  <th className="py-2.5 px-3">Subject Specialist</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teachers.map((tch) => (
                  <tr key={tch.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 flex items-center gap-2.5">
                      <img
                        src={tch.pictureUrl}
                        alt={tch.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900">{tch.name}</div>
                        <div className="text-slate-400 text-[10px]">{tch.email}</div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{tch.pid}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      <div>{tch.cnic}</div>
                      <div className="text-[10px] text-slate-400">{tch.mobileNo}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{tch.qualification}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">{tch.subjectSpecialist}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                          tch.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tch.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tch.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingTeacher(tch)}
                          className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 rounded font-bold text-xs flex items-center gap-1 transition"
                          title="Edit Teacher Record"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        {tch.status === 'pending' ? (
                          <button
                            onClick={() => approveTeacher(tch.id)}
                            className="px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-white rounded font-bold text-xs"
                          >
                            Approve Teacher
                          </button>
                        ) : (
                          <button
                            onClick={() => rejectTeacher(tch.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded text-xs"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => deleteTeacher(tch.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN TAB 4: Timetable & Proxy Substitution */}
      {/* Required by user prompt:
          "real-time class teaching timetable, assign to teacher auto subject-wise set time
           on a daily basis, teacher attendance, student attendance;
           if any students/teachers are on leave, then assign any other teacher to engage the class." */}
      {activeAdminTab === 'timetable' && (
        <div className="space-y-6">
          {/* Proxy / Teacher on Leave Substitution Box */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Teacher Leave & Class Proxy Substitution Manager</span>
            </div>
            <p className="text-xs text-slate-700">
              When a regular teacher is on casual leave or official duty, assign another available teacher to engage the class so students' instruction is not disrupted.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Timetable Slot</label>
                <select
                  value={proxySlotId}
                  onChange={(e) => setProxySlotId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="">-- Choose scheduled slot --</option>
                  {timetable.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.day} - Period {slot.period} ({slot.className} - {slot.subject}) [Teacher: {slot.teacherName}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Substitute Teacher</label>
                <select
                  value={proxyTeacherId}
                  onChange={(e) => setProxyTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="">-- Select proxy teacher --</option>
                  {teachers
                    .filter((t) => t.status === 'approved')
                    .map((tch) => (
                      <option key={tch.id} value={tch.id}>
                        {tch.name} ({tch.subjectSpecialist})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                <input
                  type="text"
                  value={proxyReason}
                  onChange={(e) => setProxyReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Regular teacher on medical leave"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!proxySlotId || !proxyTeacherId) {
                      alert('Please select both a timetable slot and a proxy teacher.');
                      return;
                    }
                    assignProxyTeacher(proxySlotId, proxyTeacherId, proxyReason);
                  }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-lg shadow-sm transition"
                >
                  Assign Proxy Teacher
                </button>
              </div>
            </div>
          </div>

          {/* Timetable Slot List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Master Teaching Timetable (Period 1 to Period 6)
              </h4>
              <span className="text-xs text-slate-500">Auto-assigned daily across grades</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3">Period & Time</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Assigned Teacher</th>
                    <th className="py-2.5 px-3">Substitution Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {timetable.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{slot.day}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className="font-bold text-amber-700">P{slot.period}</span> ({slot.time})
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-800">{slot.className}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{slot.subject}</td>
                      <td className="py-2.5 px-3 text-slate-700">{slot.teacherName}</td>
                      <td className="py-2.5 px-3">
                        {slot.isSubstituted ? (
                          <div className="inline-block bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                            Substituted: {slot.substitutedTeacherName}
                          </div>
                        ) : (
                          <span className="text-emerald-700 font-bold">Regular</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {slot.isSubstituted && (
                          <button
                            onClick={() => clearProxySubstitution(slot.id)}
                            className="text-xs text-red-600 hover:underline font-bold"
                          >
                            Clear Proxy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 5: Attendance Hub */}
      {activeAdminTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              School-Wide Daily Attendance Hub
            </h3>
            <p className="text-xs text-slate-500">
              Comprehensive log of student and faculty attendance records.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Person Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Class & Period</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{att.date}</td>
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{att.personName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        att.type === 'teacher' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {att.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{att.className || 'General'} {att.period ? `(P${att.period})` : ''}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                        att.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{att.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN TAB 6: Certificates & ID Card Settings */}
      {/* Required by user prompt:
          "Issue GR No ID card, students' leaving certificate with school name and LOGO display,
           and Format can be uploaded by admin; Enrollment Card (same as ID Card but differ some
           assigned only GR No and till final exam can be set by admin)" */}
      {activeAdminTab === 'certificates' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Cards & Certificates Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Set Enrollment Card validity date, ID Card design templates, and issue School Leaving Certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900">Enrollment Card Settings</h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Enrollment Validity ("Till Final Exam Set by Admin")
                </label>
                <input
                  type="text"
                  value={cmsEnrollmentValidTill}
                  onChange={(e) => setCmsEnrollmentValidTill(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 31st May 2027 (Annual Final Exams)"
                />
              </div>
              <button
                onClick={() => updateSettings({ enrollmentCardValidTill: cmsEnrollmentValidTill })}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
              >
                Save Validity Date
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900">ID Card Graphics & AI Template</h4>
              <p className="text-slate-600">
                Official Sindh School Education Department ID Card layout with high-contrast crest and QR code verification.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs">
                  Sindh Emerald Prestige Template (Active)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 7: CMS & Dignitary Messages */}
      {/* Required by user prompt:
          "HOME: Minister Message, Secretary Message, Headmaster Message (all contain name and Picture)"
          "About Us section Mission and Vision. This section can be edited by the admin"
          "Footer Displayed Designed By Ghanshamdas JEST & add picture option by admin uploaded" */}
      {activeAdminTab === 'cms' && (
        <div className="space-y-8">
          {/* Form for School Mission, Vision, and Developer Picture */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Edit School Identity, Logo, About Us, Mission & Designer Picture
            </h3>

            <form onSubmit={handleSaveCMS} className="space-y-5">
              {/* School Official Logo & Campus Hero Banner Uploads */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border-2 border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    Official School Logo & Campus Banner (PDF or Image Upload)
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    No External Links Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                    <FileUploadZone
                      id="cms-school-logo-upload"
                      label="Official School Logo / Seal"
                      value={cmsLogoUrl}
                      onChange={(val) => setCmsLogoUrl(val)}
                      previewShape="square"
                      helperText="Upload official emblem in PDF or Image format (PNG, JPG, SVG, WebP)"
                      badgeText="Displays in Header & ID Cards"
                    />
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                    <FileUploadZone
                      id="cms-hero-banner-upload"
                      label="Campus Hero Banner Image"
                      value={cmsHeroBannerUrl}
                      onChange={(val) => setCmsHeroBannerUrl(val)}
                      previewShape="banner"
                      helperText="Upload school building / campus photo in PDF or Image format"
                      badgeText="Homepage Banner"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">School Official Name</label>
                <input
                  type="text"
                  value={cmsSchoolName}
                  onChange={(e) => setCmsSchoolName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mission Statement</label>
                <textarea
                  rows={2}
                  value={cmsMission}
                  onChange={(e) => setCmsMission(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vision Statement</label>
                <textarea
                  rows={2}
                  value={cmsVision}
                  onChange={(e) => setCmsVision(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">School History & About Us</label>
                <textarea
                  rows={3}
                  value={cmsAbout}
                  onChange={(e) => setCmsAbout(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Official School Timing, Email, Helpline, Mobile & Address (Required by User) */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-950 text-sm">
                      Official Timings, Helpline, Email & Contact Settings
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      These values populate the Contact Us page, Footer, and Official School Notices.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      Official School Timing *
                    </label>
                    <input
                      type="text"
                      required
                      value={cmsSchoolTiming}
                      onChange={(e) => setCmsSchoolTiming(e.target.value)}
                      placeholder="08:00 AM - 01:30 PM (Mon - Sat)"
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MailCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Official School Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={cmsEmail}
                      onChange={(e) => setCmsEmail(e.target.value)}
                      placeholder="info.gbhsmehrand@gmail.com"
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                      Official Helpline Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={cmsOfficialHelpline}
                      onChange={(e) => setCmsOfficialHelpline(e.target.value)}
                      placeholder="+92-232-920045"
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                      Official Mobile / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={cmsOfficialMobile}
                      onChange={(e) => setCmsOfficialMobile(e.target.value)}
                      placeholder="+92-346-3847836"
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      Official SEMIS Code
                    </label>
                    <input
                      type="text"
                      value={cmsSemisCode}
                      onChange={(e) => setCmsSemisCode(e.target.value)}
                      placeholder="406020752"
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      School Campus Full Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={cmsAddress}
                      onChange={(e) => setCmsAddress(e.target.value)}
                      placeholder="Village Mehrand P.O Kaloi Taluka Kaloi District Tharparkar @ Mithi"
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Developer Credit & Upload Picture */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                <h4 className="font-extrabold text-amber-950">
                  Footer Developer Credit & Picture Upload (Designed By Ghanshamdas JEST)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designer / Developer Name</label>
                    <input
                      type="text"
                      value={cmsDesignerName}
                      onChange={(e) => setCmsDesignerName(e.target.value)}
                      className="w-full p-2.5 rounded border border-slate-200"
                    />
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <FileUploadZone
                      id="cms-designer-picture-upload"
                      label="Designer / Developer Picture"
                      value={cmsDesignerPicture}
                      onChange={(val) => setCmsDesignerPicture(val)}
                      previewShape="avatar"
                      helperText="Upload designer portrait in PDF or Image format (PNG, JPG)"
                      badgeText="Footer Credit"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition"
              >
                Save All CMS Changes
              </button>
            </form>
          </div>

          {/* Edit Leadership Messages (Minister, Secretary, Headmaster) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Edit Dignitary Messages (Minister, Secretary, Headmaster)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaderMessages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-extrabold text-emerald-900 uppercase block">{msg.title}</span>
                    <input
                      type="text"
                      value={msg.name}
                      onChange={(e) => updateLeaderMessage(msg.id, { name: e.target.value })}
                      className="w-full p-2 bg-white rounded border border-slate-200 font-bold"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={msg.designation}
                      onChange={(e) => updateLeaderMessage(msg.id, { designation: e.target.value })}
                      className="w-full p-2 bg-white rounded border border-slate-200 text-[11px]"
                      placeholder="Designation"
                    />
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <FileUploadZone
                        id={`dignitary-photo-${msg.id}`}
                        label="Dignitary Portrait"
                        value={msg.pictureUrl}
                        onChange={(val) => updateLeaderMessage(msg.id, { pictureUrl: val })}
                        previewShape="avatar"
                        helperText="Upload portrait in PDF or Image format (PNG, JPG)"
                        badgeText={msg.title}
                      />
                    </div>
                    <textarea
                      rows={4}
                      value={msg.message}
                      onChange={(e) => updateLeaderMessage(msg.id, { message: e.target.value })}
                      className="w-full p-2 bg-white rounded border border-slate-200 text-[11px]"
                      placeholder="Message content"
                    />
                  </div>
                  <button
                    onClick={() => alert(`Saved ${msg.title}!`)}
                    className="w-full py-1.5 bg-emerald-800 text-white font-bold rounded"
                  >
                    Update {msg.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB 8: Inquiries */}
      {activeAdminTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Incoming Contact Us Inquiries ({inquiries.length})
          </h3>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className={`p-4 rounded-xl border space-y-2 ${
                  inq.status === 'unread' ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{inq.name}</span>
                    <span className="font-mono text-slate-500">({inq.phone} • {inq.email})</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{inq.createdAt}</span>
                </div>
                <div className="font-bold text-emerald-900">{inq.subject}</div>
                <p className="text-slate-700 leading-relaxed">{inq.message}</p>
                {inq.status === 'unread' && (
                  <button
                    onClick={() => markInquiryRead(inq.id)}
                    className="text-amber-800 font-bold hover:underline text-[11px]"
                  >
                    Mark as Read ✓
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Document Viewer for Admin Verification */}
      {previewDoc && (
        <DocumentViewerModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          fileUrl={previewDoc.url}
          title={previewDoc.title}
        />
      )}

      {/* Admin Edit Student Record Modal */}
      {editingStudent && (
        <EditStudentModal
          isOpen={!!editingStudent}
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={(studentId, updatedData) => {
            updateStudent(studentId, updatedData);
            setEditingStudent(null);
            alert('Student record successfully updated!');
          }}
        />
      )}

      {/* Admin Edit Teacher Record Modal */}
      {editingTeacher && (
        <EditTeacherModal
          isOpen={!!editingTeacher}
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSave={(teacherId, updatedData) => {
            updateTeacher(teacherId, updatedData);
            setEditingTeacher(null);
            alert('Teacher record successfully updated!');
          }}
        />
      )}
    </div>
  );
};
