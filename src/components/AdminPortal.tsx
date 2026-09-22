import React, { useState, useEffect } from 'react';
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
  Printer,
  IdCard,
  Globe,
  RefreshCw,
  ExternalLink,
  Check,
  BarChart3,
  TrendingUp,
  UserX,
  CheckSquare,
  Search,
  Filter,
  Megaphone,
  QrCode,
} from 'lucide-react';
import { Student, Teacher, TimetableSlot, StudentResult, LeavingCertificateData, SchoolSettings, AttendanceRecord, LeaderMessage } from '../types';
import { FileUploadZone } from './common/FileUploadZone';
import { DocumentViewerModal } from './common/DocumentViewerModal';
import { EditStudentModal } from './admin/EditStudentModal';
import { EditTeacherModal } from './admin/EditTeacherModal';
import { StudentIdCard } from './cards/StudentIdCard';
import { TeacherIdCard } from './cards/TeacherIdCard';
import { EnrollmentCard } from './cards/EnrollmentCard';
import { StudentReportCard } from './cards/StudentReportCard';
import { TeacherReportCard } from './cards/TeacherReportCard';
import { HeadmasterSignatureDisplay } from './common/HeadmasterSignatureDisplay';
import { AttendanceTrendChart } from './charts/AttendanceTrendChart';
import { RechartsAttendanceSummary } from './charts/RechartsAttendanceSummary';
import { StudentIdCardGenerator } from './admin/StudentIdCardGenerator';
import { AdminAnnouncementManager } from './AdminAnnouncementManager';
import { AnnouncementBanner } from './common/AnnouncementBanner';
import { QrAttendanceScannerModal } from './admin/QrAttendanceScannerModal';

export const AdminPortal: React.FC = () => {
  const {
    currentRole,
    setActiveTab,
    isSyncing,
    lastSyncedAt,
    syncStatus,
    isLiveConnected,
    syncWithWebsite,
    refreshFromWebsite,
    loginAsAdmin,
    loginDirectAsAdmin,
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
    approveTeacherWithJoiningLetter,
    rejectTeacher,
    deleteTeacher,
    timetable,
    updateTimetableSlot,
    assignProxyTeacher,
    clearProxySubstitution,
    attendance,
    markDailyAttendance,
    remarks,
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
    'overview' | 'admissions' | 'teachers' | 'timetable' | 'attendance' | 'id_cards' | 'certificates' | 'announcements' | 'cms' | 'messages'
  >('overview');

  // State for allotting GR No modal
  const [selectedStudentForApproval, setSelectedStudentForApproval] = useState<Student | null>(null);
  const [allottedGrNo, setAllottedGrNo] = useState('');
  const [allottedSection, setAllottedSection] = useState('A');
  const [allottedRollNo, setAllottedRollNo] = useState('01');

  // State for teacher approval & HM joining letter issuance modal
  const [selectedTeacherForApproval, setSelectedTeacherForApproval] = useState<Teacher | null>(null);
  const [approvalLetterType, setApprovalLetterType] = useState<'auto' | 'manual'>('auto');
  const [manualJoiningLetterUrl, setManualJoiningLetterUrl] = useState<string>('');
  const [manualJoiningLetterFileName, setManualJoiningLetterFileName] = useState<string>('');
  const [joiningDispatchNo, setJoiningDispatchNo] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>('');
  const [joiningRemarks, setJoiningRemarks] = useState<string>('');

  // State for editing student & teacher records (Required: "Admin can edit Teacher and student records")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // State for adding/editing timetable slot
  const [editSlot, setEditSlot] = useState<TimetableSlot | null>(null);

  // State for substituting a class (if teacher on leave)
  const [proxySlotId, setProxySlotId] = useState<string>('');
  const [proxyTeacherId, setProxyTeacherId] = useState<string>('');
  const [proxyReason, setProxyReason] = useState<string>('Regular teacher on leave');

  // Admin Card & Report Preview state
  const [adminSelectedStudentId, setAdminSelectedStudentId] = useState<string>('');
  const [adminSelectedTeacherId, setAdminSelectedTeacherId] = useState<string>('');
  const [adminPreviewType, setAdminPreviewType] = useState<
    'student_id' | 'enrollment' | 'student_report' | 'teacher_id' | 'teacher_report' | null
  >(null);

  // CMS state (Required: Logo upload option, School time, Official Email, Official Helpline & Mobile)
  const [cmsSchoolName, setCmsSchoolName] = useState(settings.schoolName);
  const [cmsHeadmasterName, setCmsHeadmasterName] = useState(
    settings.headmasterName || ''
  );
  const [cmsLogoUrl, setCmsLogoUrl] = useState(settings.logoUrl);
  const [cmsHeroBannerUrl, setCmsHeroBannerUrl] = useState(settings.heroBannerUrl);
  const [cmsHeadmasterSignature, setCmsHeadmasterSignature] = useState(
    settings.headmasterSignatureUrl || ''
  );
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
  const [cmsAdminUsername, setCmsAdminUsername] = useState(settings.adminUsername || 'Sham Nanjwani');
  const [cmsAdminPassword, setCmsAdminPassword] = useState(settings.adminPassword || 'Sham@580');
  const [showCmsPassword, setShowCmsPassword] = useState(false);

  // Document Viewer modal state
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);

  // CMS form dirty tracking to avoid background poll clobbering input
  const [isCmsDirty, setIsCmsDirty] = useState(false);
  const [dignitaryDrafts, setDignitaryDrafts] = useState<Record<string, Partial<LeaderMessage>>>({});

  // Admin Attendance Command Center State
  const [adminAttendanceTarget, setAdminAttendanceTarget] = useState<'students' | 'teachers' | 'analytics' | 'log'>('students');
  const [adminAttendanceDate, setAdminAttendanceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [adminAttendanceClass, setAdminAttendanceClass] = useState<string>('All Classes');
  const [adminAttendancePeriod, setAdminAttendancePeriod] = useState<number>(1);
  const [adminStudentStatusMap, setAdminStudentStatusMap] = useState<Record<string, 'Present' | 'Absent' | 'Leave' | 'Late'>>({});
  const [adminTeacherStatusMap, setAdminTeacherStatusMap] = useState<Record<string, 'Present' | 'Absent' | 'Leave' | 'Late'>>({});
  const [adminAttendanceSearch, setAdminAttendanceSearch] = useState<string>('');
  const [adminAttendanceFilterType, setAdminAttendanceFilterType] = useState<'all' | 'student' | 'teacher'>('all');
  const [adminAttendanceFilterStatus, setAdminAttendanceFilterStatus] = useState<string>('all');
  const [showQrAttendanceScanner, setShowQrAttendanceScanner] = useState(false);

  // Picture direct save feedback states
  const [pictureSaveFeedback, setPictureSaveFeedback] = useState<Record<string, string>>({});
  const [adminToast, setAdminToast] = useState<{ title: string; message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showAlert = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setAdminToast({ title, message, type });
    setTimeout(() => setAdminToast(null), 5000);
  };

  // Keep local CMS state synced with latest context and server database settings
  useEffect(() => {
    if (settings && !isCmsDirty) {
      if (settings.schoolName) setCmsSchoolName(settings.schoolName);
      if (settings.headmasterName) setCmsHeadmasterName(settings.headmasterName);
      if (settings.logoUrl !== undefined) setCmsLogoUrl(settings.logoUrl);
      if (settings.heroBannerUrl !== undefined) setCmsHeroBannerUrl(settings.heroBannerUrl);
      if (settings.headmasterSignatureUrl !== undefined) setCmsHeadmasterSignature(settings.headmasterSignatureUrl);
      if (settings.mission) setCmsMission(settings.mission);
      if (settings.vision) setCmsVision(settings.vision);
      if (settings.aboutHistory) setCmsAbout(settings.aboutHistory);
      if (settings.enrollmentCardValidTill) setCmsEnrollmentValidTill(settings.enrollmentCardValidTill);
      if (settings.designerName) setCmsDesignerName(settings.designerName);
      if (settings.designerPictureUrl !== undefined) setCmsDesignerPicture(settings.designerPictureUrl);
      if (settings.schoolTiming) setCmsSchoolTiming(settings.schoolTiming);
      if (settings.email) setCmsEmail(settings.email);
      if (settings.officialHelpline) setCmsOfficialHelpline(settings.officialHelpline);
      if (settings.officialMobile) setCmsOfficialMobile(settings.officialMobile);
      if (settings.phone) setCmsPhone(settings.phone);
      if (settings.address) setCmsAddress(settings.address);
      if (settings.semisCode) setCmsSemisCode(settings.semisCode);
      if (settings.adminUsername) setCmsAdminUsername(settings.adminUsername);
      if (settings.adminPassword) setCmsAdminPassword(settings.adminPassword);
    }
  }, [settings, isCmsDirty]);

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
              <label className="block font-bold text-slate-700 mb-1">
                Admin Username / Email
              </label>
              <input
                type="text"
                required
                placeholder="Enter admin username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Password</label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  title={showAdminPassword ? 'Hide password' : 'Show password'}
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

  const handleOpenApproveTeacher = (tch: Teacher) => {
    setSelectedTeacherForApproval(tch);
    setApprovalLetterType(tch.joiningLetterType || 'auto');
    setManualJoiningLetterUrl(tch.joiningLetterUrl || tch.manualJoiningLetterUrl || '');
    setManualJoiningLetterFileName(tch.joiningLetterFileName || tch.manualJoiningLetterFileName || '');
    setJoiningDispatchNo(tch.joiningLetterDispatchNo || `GBHS-MHR/JON/2026/${Math.floor(1000 + Math.random() * 9000)}`);
    setJoiningDate(tch.joiningLetterDate || tch.joinDate || new Date().toLocaleDateString('en-GB'));
    setJoiningRemarks(tch.joiningLetterRemarks || 'Verified original credentials, CNIC, and appointment orders. Appointed to active teaching roster.');
  };

  const handleConfirmTeacherApproval = () => {
    if (!selectedTeacherForApproval) return;
    if (approvalLetterType === 'manual' && !manualJoiningLetterUrl) {
      alert('Please upload the scanned PDF or image copy of the signed Joining Letter from Headmaster office.');
      return;
    }
    approveTeacherWithJoiningLetter(selectedTeacherForApproval.id, {
      type: approvalLetterType,
      manualPdfUrl: manualJoiningLetterUrl || undefined,
      manualFileName: manualJoiningLetterFileName || undefined,
      dispatchNo: joiningDispatchNo,
      date: joiningDate,
      remarks: joiningRemarks,
    });
    setSelectedTeacherForApproval(null);
  };

  const handleHeaderSaveAndSync = async () => {
    const cleanHeadmasterName = cmsHeadmasterName.trim();
    const updatedSettings: Partial<SchoolSettings> = {
      ...settings,
      headmasterName: cleanHeadmasterName || settings.headmasterName,
      schoolName: cmsSchoolName.trim() || settings.schoolName,
      logoUrl: cmsLogoUrl,
      heroBannerUrl: cmsHeroBannerUrl,
      headmasterSignatureUrl: cmsHeadmasterSignature,
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
      adminUsername: cmsAdminUsername,
      adminPassword: cmsAdminPassword,
    };

    const updatedLeaderMessages = leaderMessages.map((m) => {
      const draft = dignitaryDrafts[m.id];
      const merged = draft ? { ...m, ...draft } : m;
      if (merged.id === 'headmaster' && cleanHeadmasterName) {
        return { ...merged, name: cleanHeadmasterName };
      }
      return merged;
    });

    setIsCmsDirty(false);
    const ok = await syncWithWebsite(true, {
      settings: updatedSettings,
      leaderMessages: updatedLeaderMessages,
    });
    if (ok) {
      await refreshFromWebsite(true);
      showAlert(
        'Saved & Broadcast to Website',
        'All CMS settings, Headmaster credentials, and school records have been saved to the server and are now live for all visitors across all devices.',
        'success'
      );
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleHeaderSaveAndSync();
  };

  const handleQuickSaveHeadmaster = async () => {
    const cleanName = cmsHeadmasterName.trim();
    if (!cleanName) {
      showAlert('Headmaster Name Required', 'Please enter a valid Headmaster name before saving.', 'error');
      return;
    }
    setPictureSaveFeedback((prev) => ({ ...prev, hmSignature: 'Saving...' }));

    const updatedLeaderMessages = leaderMessages.map((m) =>
      m.id === 'headmaster' ? { ...m, name: cleanName } : m
    );

    const ok = await updateSettings({
      headmasterName: cleanName,
      headmasterSignatureUrl: cmsHeadmasterSignature,
    });

    if (ok) {
      setIsCmsDirty(false);
      await refreshFromWebsite(true);
      setPictureSaveFeedback((prev) => ({ ...prev, hmSignature: 'Saved & Synced!' }));
      showAlert(
        'Headmaster Name & Signature Saved!',
        `Headmaster "${cleanName}" and official signature have been permanently saved to the server. The new name is now displayed on all ID cards, certificates, reports, and website pages.`,
        'success'
      );
    } else {
      setPictureSaveFeedback((prev) => ({ ...prev, hmSignature: 'Saved locally' }));
    }

    setTimeout(() => {
      setPictureSaveFeedback((prev) => ({ ...prev, hmSignature: '' }));
    }, 4000);
  };

  // Direct save option for individual picture uploads with instant synchronization
  const handleSavePicture = async (
    type: 'logo' | 'heroBanner' | 'designer',
    url: string
  ) => {
    let partialSettings: Partial<SchoolSettings> = {};
    let label = 'Picture';

    if (type === 'logo') {
      partialSettings = { logoUrl: url };
      label = 'School Logo';
    } else if (type === 'heroBanner') {
      partialSettings = { heroBannerUrl: url };
      label = 'Campus Hero Banner';
    } else if (type === 'designer') {
      partialSettings = { designerPictureUrl: url, designerName: cmsDesignerName };
      label = 'Designer Profile Picture';
    }

    setPictureSaveFeedback((prev) => ({ ...prev, [type]: 'Saving...' }));
    const ok = await updateSettings(partialSettings);
    if (ok) {
      await refreshFromWebsite(true);
      setPictureSaveFeedback((prev) => ({ ...prev, [type]: 'Saved & Synced!' }));
      showAlert(
        `${label} Saved & Synced!`,
        `The ${label.toLowerCase()} has been saved to the server and will display for all users across all devices.`,
        'success'
      );
    } else {
      setPictureSaveFeedback((prev) => ({ ...prev, [type]: 'Saved locally' }));
    }

    setTimeout(() => {
      setPictureSaveFeedback((prev) => ({ ...prev, [type]: '' }));
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header Bar with Website Sync Controls */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border-b-4 border-amber-500 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 p-3 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded uppercase">
                  Super Admin
                </span>
                <span className="text-amber-400 font-mono text-xs font-bold">
                  SEMIS: {settings.semisCode}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-900/80 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Website Live Sync: Active</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">GBHS Mehrand Administration Panel</h2>
              <p className="text-xs text-slate-300">
                Full authority over admissions, faculty, timetable auto-assignment, ID cards, certificates, and school CMS.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                <span>Last Synced to Website:</span>
                <strong className="text-amber-300 font-mono">
                  {lastSyncedAt
                    ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : 'Ready'}
                </strong>
                <span className="hidden sm:inline text-slate-500">• All saved data displays live on main page for all users</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons (Save & Sync to Website, Refresh, View Main Page, Sign Out) */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <button
              type="button"
              onClick={handleHeaderSaveAndSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-2 border border-emerald-400/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              title="Save and synchronize complete school records and CMS changes to the website server so all visitors see updates"
            >
              <Globe className={`w-4 h-4 ${isSyncing ? 'animate-spin' : 'text-amber-300'}`} />
              <span>{isSyncing ? 'Syncing to Website...' : 'Save & Sync to Website (Display All Users)'}</span>
            </button>

            <button
              type="button"
              onClick={() => refreshFromWebsite(true)}
              disabled={isSyncing}
              className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
              title="Pull latest live records from website server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Refresh Live</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition flex items-center gap-1.5"
              title="Preview public main page as visitors and students see it"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Main Page</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs border border-rose-500/30 transition"
            >
              Sign Out Admin
            </button>
          </div>
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
          { id: 'id_cards', label: 'Student ID Cards (PDF)', icon: IdCard, badge: 'Auto' },
          { id: 'certificates', label: 'Certificates & Formats', icon: FileCheck },
          {
            id: 'announcements',
            label: 'Announcements & Urgent Broadcasts',
            icon: Megaphone,
            badge:
              (settings.announcements || []).filter(
                (a) => a.priority === 'urgent' && a.isActive !== false
              ).length > 0
                ? `${(settings.announcements || []).filter((a) => a.priority === 'urgent' && a.isActive !== false).length} Flash`
                : undefined,
          },
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
          {/* Live School Announcement Banner in Overview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                Live Broadcast Feed (Synced across Student & Teacher Portals)
              </span>
              <button
                onClick={() => setActiveAdminTab('announcements')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>Manage Announcements & Circulars →</span>
              </button>
            </div>
            <AnnouncementBanner role="admin" />
          </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <IdCard className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Auto-Generate ID Cards (PDF)</h4>
              <p className="text-xs text-slate-500">
                Generate printable PDF ID cards for all students or by class. Supports 2x2 A4 batch sheets or individual badges.
              </p>
              <button
                onClick={() => setActiveAdminTab('id_cards')}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700"
              >
                Auto-Generate Cards →
              </button>
            </div>

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

          {/* Daily Attendance Summary by Class (Recharts) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Daily Attendance Patterns by Class (Last 30 Days)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveAdminTab('attendance');
                  setAdminAttendanceTarget('analytics');
                }}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
              >
                Attendance Command Center →
              </button>
            </div>
            <RechartsAttendanceSummary
              attendance={attendance}
              students={students}
            />
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

      {/* ALLOT TEACHER APPROVAL & JOINING LETTER MODAL */}
      {selectedTeacherForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                Approve Teacher & Issue Joining Letter
              </h4>
              <p className="text-slate-500">
                Approving: <strong>{selectedTeacherForApproval.name}</strong> • PID: <span className="font-mono font-bold text-slate-700">{selectedTeacherForApproval.pid}</span> • Subject: <strong>{selectedTeacherForApproval.subjectSpecialist}</strong>
              </p>
            </div>

            {/* Document Verification Check Section */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>Uploaded Verification Credentials:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedTeacherForApproval.cnicFileUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        url: selectedTeacherForApproval.cnicFileUrl!,
                        title: `${selectedTeacherForApproval.name} - CNIC Document (${selectedTeacherForApproval.cnicFileName || 'Attached'})`,
                      })
                    }
                    className="px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-emerald-50 transition shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    Inspect CNIC Document
                  </button>
                ) : (
                  <span className="text-amber-800 bg-amber-50 px-2 py-1 rounded text-xs border border-amber-200">
                    ⚠ CNIC Document Not Uploaded
                  </span>
                )}

                {selectedTeacherForApproval.appointmentOrderUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        url: selectedTeacherForApproval.appointmentOrderUrl!,
                        title: `${selectedTeacherForApproval.name} - Appointment/Transfer Order (${selectedTeacherForApproval.appointmentOrderFileName || 'Attached'})`,
                      })
                    }
                    className="px-2.5 py-1.5 bg-white border border-blue-300 text-blue-900 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-blue-50 transition shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-700" />
                    Inspect Appointment Order
                  </button>
                ) : (
                  <span className="text-amber-800 bg-amber-50 px-2 py-1 rounded text-xs border border-amber-200">
                    ⚠ Appointment Order Not Uploaded
                  </span>
                )}
              </div>
            </div>

            {/* Joining Letter Issuance Method: Auto vs Manual */}
            <div className="space-y-3">
              <label className="block font-black text-slate-900">
                Official Joining Letter Issuance Method *
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApprovalLetterType('auto')}
                  className={`p-3 rounded-xl border-2 text-left transition ${
                    approvalLetterType === 'auto'
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-black text-xs text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Auto-Generated (Official HM Format)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                    Official Sindh Education Department format with school SEMIS code, seal, dispatch ref, and digital signature.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setApprovalLetterType('manual')}
                  className={`p-3 rounded-xl border-2 text-left transition ${
                    approvalLetterType === 'manual'
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-black text-xs text-emerald-900">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Manual Upload (Scanned Signed PDF/Image)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                    Upload scanned copy of physical joining order signed and stamped by Headmaster office.
                  </p>
                </button>
              </div>

              {/* If Manual is chosen, provide FileUploadZone */}
              {approvalLetterType === 'manual' && (
                <div className="space-y-2 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                  <FileUploadZone
                    label="Upload Signed Headmaster Joining Letter (PDF or Image) *"
                    accept=".pdf,image/*"
                    maxSizeMB={10}
                    onFileSelected={(fileDataUrl, fileName) => {
                      setManualJoiningLetterUrl(fileDataUrl);
                      setManualJoiningLetterFileName(fileName);
                    }}
                    helpText="Upload the official scanned Joining Order / Report signed by Headmaster"
                  />
                  {manualJoiningLetterFileName && (
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-bold">
                      <span className="truncate max-w-[280px]">✓ Selected: {manualJoiningLetterFileName}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc({
                            url: manualJoiningLetterUrl,
                            title: 'Scanned Joining Letter Preview',
                          })
                        }
                        className="text-emerald-700 underline text-[11px] shrink-0 hover:text-emerald-900"
                      >
                        Preview File
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Letter Metadata Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dispatch Reference No *
                  </label>
                  <input
                    type="text"
                    required
                    value={joiningDispatchNo}
                    onChange={(e) => setJoiningDispatchNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Date of Joining *
                  </label>
                  <input
                    type="text"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Headmaster Remarks & Endorsement
                </label>
                <textarea
                  rows={2}
                  value={joiningRemarks}
                  onChange={(e) => setJoiningRemarks(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-medium"
                  placeholder="e.g. Credentials authenticated. Reported for active duty in morning session."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTeacherForApproval(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTeacherApproval}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black shadow-md flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Approve & Issue Joining Letter
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
                Approve teacher applications with Headmaster Joining Letter (Auto/Manual) to feature them on the main Faculty section and grant dashboard access.
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
                  <th className="py-2.5 px-3">CNIC Document</th>
                  <th className="py-2.5 px-3">Appointment Order</th>
                  <th className="py-2.5 px-3">Joining Letter</th>
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
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-700">{tch.qualification}</div>
                      <div className="font-bold text-emerald-800 text-[11px]">{tch.subjectSpecialist}</div>
                    </td>
                    {/* CNIC Document verification */}
                    <td className="py-2.5 px-3">
                      {tch.cnicFileUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              url: tch.cnicFileUrl!,
                              title: `${tch.name} - CNIC Document (${tch.cnicFileName || 'Both Sides'})`,
                            })
                          }
                          className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded font-bold text-[11px] transition"
                        >
                          <Eye className="w-3 h-3 text-emerald-700" /> View CNIC
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Not Uploaded</span>
                      )}
                    </td>
                    {/* Appointment / Transfer Order verification */}
                    <td className="py-2.5 px-3">
                      {tch.appointmentOrderUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              url: tch.appointmentOrderUrl!,
                              title: `${tch.name} - Appointment / Transfer Order (${tch.appointmentOrderFileName || 'Order Doc'})`,
                            })
                          }
                          className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded font-bold text-[11px] transition"
                        >
                          <Eye className="w-3 h-3 text-blue-600" /> View Order
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Not Uploaded</span>
                      )}
                    </td>
                    {/* Joining Letter Status */}
                    <td className="py-2.5 px-3">
                      {tch.joiningLetterIssued ? (
                        <div className="space-y-0.5">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                            {tch.joiningLetterType === 'manual' ? 'HM Scanned' : 'Auto Issued'}
                          </span>
                          {(tch.joiningLetterUrl || tch.manualJoiningLetterUrl) && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDoc({
                                  url: (tch.joiningLetterUrl || tch.manualJoiningLetterUrl)!,
                                  title: `${tch.name} - HM Joining Letter`,
                                })
                              }
                              className="block text-[10px] text-teal-800 hover:underline font-bold"
                            >
                              View Letter
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Pending Approval</span>
                      )}
                    </td>
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
                            onClick={() => handleOpenApproveTeacher(tch)}
                            className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-xs"
                          >
                            Approve & Issue Letter
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenApproveTeacher(tch)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs"
                              title="Reissue / Update Joining Letter"
                            >
                              Joining Letter
                            </button>
                            <button
                              onClick={() => rejectTeacher(tch.id)}
                              className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded text-xs"
                            >
                              Revoke
                            </button>
                          </>
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

      {/* ADMIN TAB 5: Attendance Hub & Marking Command Center */}
      {/* Required by user prompt:
          "Admin can mark attendance for Teacher and student also"
          "Integrate a d3-based line chart to visualize student attendance trends over the last 30 days"
          "website where admin control everything save edit and after saved data will be live" */}
      {activeAdminTab === 'attendance' && (() => {
        const approvedStudentsList = students.filter((s) => s.status === 'approved');
        const approvedTeachersList = teachers.filter((t) => t.status === 'approved');

        const studentsForMarking = approvedStudentsList.filter((st) => {
          const matchesClass = adminAttendanceClass === 'All Classes' || st.appliedClass === adminAttendanceClass;
          const matchesSearch =
            !adminAttendanceSearch ||
            st.name.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
            st.grNumber.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
            st.fatherName.toLowerCase().includes(adminAttendanceSearch.toLowerCase());
          return matchesClass && matchesSearch;
        });

        const teachersForMarking = approvedTeachersList.filter((tc) => {
          const matchesSearch =
            !adminAttendanceSearch ||
            tc.name.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
            tc.pid.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
            tc.designation.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
            tc.subjectSpecialist.toLowerCase().includes(adminAttendanceSearch.toLowerCase());
          return matchesSearch;
        });

        const setAllStudentsStatus = (status: 'Present' | 'Absent' | 'Leave' | 'Late') => {
          const newMap = { ...adminStudentStatusMap };
          studentsForMarking.forEach((st) => {
            newMap[st.id] = status;
          });
          setAdminStudentStatusMap(newMap);
        };

        const setAllTeachersStatus = (status: 'Present' | 'Absent' | 'Leave' | 'Late') => {
          const newMap = { ...adminTeacherStatusMap };
          teachersForMarking.forEach((tc) => {
            newMap[tc.id] = status;
          });
          setAdminTeacherStatusMap(newMap);
        };

        const handleAdminSaveStudentAttendance = () => {
          if (studentsForMarking.length === 0) {
            showAlert('No Students Found', 'No approved students found for the selected class criteria.', 'error');
            return;
          }
          const records: AttendanceRecord[] = studentsForMarking.map((st) => {
            const status = adminStudentStatusMap[st.id] || 'Present';
            return {
              id: `att-st-${st.id}-${adminAttendanceDate}-p${adminAttendancePeriod}`,
              date: adminAttendanceDate,
              personId: st.id,
              personName: st.name,
              type: 'student',
              className: st.appliedClass,
              period: adminAttendancePeriod,
              status,
              markedBy: `Headmaster / Admin (${settings.headmasterName || 'Admin Authority'})`,
            };
          });
          markDailyAttendance(records);
          showAlert(
            'Student Attendance Published Live',
            `Official attendance for ${records.length} students recorded for ${adminAttendanceDate} (Period ${adminAttendancePeriod}) and synced live to the database.`,
            'success'
          );
        };

        const handleAdminSaveTeacherAttendance = () => {
          if (teachersForMarking.length === 0) {
            showAlert('No Faculty Found', 'No approved teachers found matching the criteria.', 'error');
            return;
          }
          const records: AttendanceRecord[] = teachersForMarking.map((tc) => {
            const status = adminTeacherStatusMap[tc.id] || 'Present';
            return {
              id: `att-tc-${tc.id}-${adminAttendanceDate}`,
              date: adminAttendanceDate,
              personId: tc.id,
              personName: tc.name,
              type: 'teacher',
              className: tc.designation,
              status,
              markedBy: `Headmaster / Admin (${settings.headmasterName || 'Admin Authority'})`,
            };
          });
          markDailyAttendance(records);
          showAlert(
            'Faculty Attendance Published Live',
            `Official attendance for ${records.length} teachers recorded for ${adminAttendanceDate} and synced live to the database.`,
            'success'
          );
        };

        // Summary stats for today
        const todayRecords = attendance.filter((a) => a.date === adminAttendanceDate);
        const todayStudentsPresent = todayRecords.filter((a) => a.type === 'student' && a.status === 'Present').length;
        const todayStudentsTotal = todayRecords.filter((a) => a.type === 'student').length;
        const todayTeachersPresent = todayRecords.filter((a) => a.type === 'teacher' && a.status === 'Present').length;
        const todayTeachersTotal = todayRecords.filter((a) => a.type === 'teacher').length;

        // Filtered attendance log
        const filteredLog = attendance.filter((a) => {
          const matchesType = adminAttendanceFilterType === 'all' || a.type === adminAttendanceFilterType;
          const matchesStatus = adminAttendanceFilterStatus === 'all' || a.status === adminAttendanceFilterStatus;
          const matchesSearch =
            !adminAttendanceSearch ||
            a.personName.toLowerCase().includes(adminAttendanceSearch.toLowerCase()) ||
            (a.className && a.className.toLowerCase().includes(adminAttendanceSearch.toLowerCase())) ||
            a.markedBy.toLowerCase().includes(adminAttendanceSearch.toLowerCase());
          return matchesType && matchesStatus && matchesSearch;
        });

        return (
          <div className="space-y-6">
            {/* Header & Mode Switcher */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-teal-800 text-amber-300 shadow-sm">
                      <UserCheck className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Attendance Command Center
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Official Administrative Authority: mark, verify, and publish real-time attendance for both Students and Faculty.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowQrAttendanceScanner(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-amber-300 font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 border border-emerald-600/30"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>Scan ID Card (QR Scanner)</span>
                  </button>

                  {/* Quick Status Pill */}
                  <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-xs">
                    <div className="text-right">
                      <div className="font-extrabold text-slate-800">
                        {todayStudentsPresent} / {todayStudentsTotal || approvedStudentsList.length} Students Present
                      </div>
                      <div className="text-[11px] text-teal-700 font-bold">
                        {todayTeachersPresent} / {todayTeachersTotal || approvedTeachersList.length} Faculty on Duty
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Modes */}
              <div className="flex flex-wrap gap-2 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => setAdminAttendanceTarget('students')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    adminAttendanceTarget === 'students'
                      ? 'bg-teal-800 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Mark Student Attendance
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
                    {approvedStudentsList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminAttendanceTarget('teachers')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    adminAttendanceTarget === 'teachers'
                      ? 'bg-teal-800 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Mark Faculty / Teacher Attendance
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
                    {approvedTeachersList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminAttendanceTarget('analytics')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    adminAttendanceTarget === 'analytics'
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  30-Day Attendance Patterns (Recharts)
                </button>

                <button
                  type="button"
                  onClick={() => setAdminAttendanceTarget('log')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    adminAttendanceTarget === 'log'
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Live Attendance Records Log
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
                    {attendance.length}
                  </span>
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: MARK STUDENT ATTENDANCE */}
            {adminAttendanceTarget === 'students' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-teal-700" />
                      Mark Students Attendance (Admin Override)
                    </h4>
                    <p className="text-xs text-slate-500">
                      As School Administrator, mark or adjust student attendance for any class or period. Changes persist immediately live to the database.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdminSaveStudentAttendance}
                    className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    Save & Sync Student Attendance ({studentsForMarking.length})
                  </button>
                </div>

                {/* Filters & Selector Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Attendance Date</label>
                    <input
                      type="date"
                      value={adminAttendanceDate}
                      onChange={(e) => setAdminAttendanceDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Class</label>
                    <select
                      value={adminAttendanceClass}
                      onChange={(e) => setAdminAttendanceClass(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 bg-white"
                    >
                      <option value="All Classes">All Classes ({approvedStudentsList.length} Students)</option>
                      <option value="Class ECCE">Class ECCE</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6th">Class 6th</option>
                      <option value="Class 7th">Class 7th</option>
                      <option value="Class 8th">Class 8th</option>
                      <option value="Class 9th">Class 9th</option>
                      <option value="Class 10th">Class 10th</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Period</label>
                    <select
                      value={adminAttendancePeriod}
                      onChange={(e) => setAdminAttendancePeriod(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 bg-white"
                    >
                      <option value={1}>Period 1 (Morning Roll Call)</option>
                      <option value={2}>Period 2</option>
                      <option value={3}>Period 3</option>
                      <option value={4}>Period 4</option>
                      <option value={5}>Period 5</option>
                      <option value={6}>Period 6</option>
                      <option value={7}>Period 7</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Search Student</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={adminAttendanceSearch}
                        onChange={(e) => setAdminAttendanceSearch(e.target.value)}
                        placeholder="Search name, GR #..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bulk Action Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-700">Quick Bulk Action:</span>
                    <button
                      type="button"
                      onClick={() => setAllStudentsStatus('Present')}
                      className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition"
                    >
                      Mark All Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllStudentsStatus('Absent')}
                      className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition"
                    >
                      Mark All Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllStudentsStatus('Leave')}
                      className="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold transition"
                    >
                      Mark All Leave
                    </button>
                  </div>

                  <span className="text-slate-500 font-bold">
                    Showing {studentsForMarking.length} student(s)
                  </span>
                </div>

                {/* Students Attendance Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Roll</th>
                        <th className="py-3 px-4">GR Number</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Father Name</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4 text-center">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {studentsForMarking.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No approved students found matching the selected class and filter.
                          </td>
                        </tr>
                      ) : (
                        studentsForMarking.map((st) => {
                          const status = adminStudentStatusMap[st.id] || 'Present';
                          return (
                            <tr key={st.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-4 font-bold text-slate-700">{st.rollNo || '01'}</td>
                              <td className="py-3 px-4 font-mono font-extrabold text-teal-800">{st.grNumber}</td>
                              <td className="py-3 px-4">
                                <div className="font-extrabold text-slate-900">{st.name}</div>
                              </td>
                              <td className="py-3 px-4 text-slate-600">{st.fatherName}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {st.appliedClass}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-[11px] font-bold shadow-sm">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminStudentStatusMap({ ...adminStudentStatusMap, [st.id]: 'Present' })
                                    }
                                    className={`px-3 py-1.5 transition ${
                                      status === 'Present'
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Present
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminStudentStatusMap({ ...adminStudentStatusMap, [st.id]: 'Absent' })
                                    }
                                    className={`px-3 py-1.5 transition border-l border-r border-slate-200 ${
                                      status === 'Absent'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Absent
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminStudentStatusMap({ ...adminStudentStatusMap, [st.id]: 'Leave' })
                                    }
                                    className={`px-3 py-1.5 transition border-r border-slate-200 ${
                                      status === 'Leave'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Leave
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminStudentStatusMap({ ...adminStudentStatusMap, [st.id]: 'Late' })
                                    }
                                    className={`px-3 py-1.5 transition ${
                                      status === 'Late'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Late
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAdminSaveStudentAttendance}
                    className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    Save & Sync Student Attendance ({studentsForMarking.length})
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: MARK TEACHER / FACULTY ATTENDANCE */}
            {adminAttendanceTarget === 'teachers' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-teal-700" />
                      Mark Faculty & Staff Attendance (Official HM Register)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Record official government attendance for teaching and administrative faculty. Data immediately saves to server and reflects across service reports.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdminSaveTeacherAttendance}
                    className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    Save & Sync Faculty Attendance ({teachersForMarking.length})
                  </button>
                </div>

                {/* Filters & Selector Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Attendance Date</label>
                    <input
                      type="date"
                      value={adminAttendanceDate}
                      onChange={(e) => setAdminAttendanceDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Duty Session</label>
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-700" />
                      Morning Shift (08:00 AM - 01:30 PM)
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Search Faculty Member</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={adminAttendanceSearch}
                        onChange={(e) => setAdminAttendanceSearch(e.target.value)}
                        placeholder="Search name, PID, subject..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-700 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bulk Action Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-700">Quick Bulk Action:</span>
                    <button
                      type="button"
                      onClick={() => setAllTeachersStatus('Present')}
                      className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition"
                    >
                      Mark All Faculty Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllTeachersStatus('Absent')}
                      className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition"
                    >
                      Mark All Faculty Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllTeachersStatus('Leave')}
                      className="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold transition"
                    >
                      Mark All Official Leave
                    </button>
                  </div>

                  <span className="text-slate-500 font-bold">
                    Showing {teachersForMarking.length} faculty member(s)
                  </span>
                </div>

                {/* Faculty Attendance Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Faculty Member</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4">Govt. PID</th>
                        <th className="py-3 px-4">Subject Specialist</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4 text-center">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {teachersForMarking.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No approved faculty members found matching your search.
                          </td>
                        </tr>
                      ) : (
                        teachersForMarking.map((tc) => {
                          const status = adminTeacherStatusMap[tc.id] || 'Present';
                          return (
                            <tr key={tc.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-4">
                                <div className="font-extrabold text-slate-900">{tc.name}</div>
                                <div className="text-[11px] text-slate-500">{tc.fatherName ? `S/O ${tc.fatherName}` : ''}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                  {tc.designation}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-slate-700">{tc.pid}</td>
                              <td className="py-3 px-4 text-slate-600">{tc.subjectSpecialist}</td>
                              <td className="py-3 px-4 font-mono text-slate-600">{tc.mobileNo || 'N/A'}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-[11px] font-bold shadow-sm">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminTeacherStatusMap({ ...adminTeacherStatusMap, [tc.id]: 'Present' })
                                    }
                                    className={`px-3 py-1.5 transition ${
                                      status === 'Present'
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Present
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminTeacherStatusMap({ ...adminTeacherStatusMap, [tc.id]: 'Absent' })
                                    }
                                    className={`px-3 py-1.5 transition border-l border-r border-slate-200 ${
                                      status === 'Absent'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Absent
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminTeacherStatusMap({ ...adminTeacherStatusMap, [tc.id]: 'Leave' })
                                    }
                                    className={`px-3 py-1.5 transition border-r border-slate-200 ${
                                      status === 'Leave'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Leave
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminTeacherStatusMap({ ...adminTeacherStatusMap, [tc.id]: 'Late' })
                                    }
                                    className={`px-3 py-1.5 transition ${
                                      status === 'Late'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Late
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAdminSaveTeacherAttendance}
                    className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    Save & Sync Faculty Attendance ({teachersForMarking.length})
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: RECHARTS ATTENDANCE SUMMARY & CLASS PATTERNS */}
            {adminAttendanceTarget === 'analytics' && (
              <div className="space-y-6">
                <RechartsAttendanceSummary
                  attendance={attendance}
                  students={students}
                  initialClass={adminAttendanceClass}
                />

                {/* Collapsible / Supplementary D3 Continuous Curve */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal-700" />
                      Supplementary D3.js Mathematical Continuous Curve
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      High-frequency vector curve visualization with interactive data point inspection.
                    </p>
                  </div>

                  <AttendanceTrendChart
                    attendance={attendance}
                    selectedClass={adminAttendanceClass}
                  />
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: COMPREHENSIVE ATTENDANCE LOG */}
            {adminAttendanceTarget === 'log' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-700" />
                      Live Attendance Records Log ({filteredLog.length} Records)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Real-time register log of all student and teacher attendances recorded in the system.
                    </p>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Filter by Type</label>
                    <select
                      value={adminAttendanceFilterType}
                      onChange={(e) => setAdminAttendanceFilterType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="all">All Records (Students & Faculty)</option>
                      <option value="student">Students Only</option>
                      <option value="teacher">Faculty / Teachers Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Filter by Status</label>
                    <select
                      value={adminAttendanceFilterStatus}
                      onChange={(e) => setAdminAttendanceFilterStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                      <option value="Late">Late</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Search Records</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={adminAttendanceSearch}
                        onChange={(e) => setAdminAttendanceSearch(e.target.value)}
                        placeholder="Search name, class, marked by..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Person Name</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Class / Role</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Marked By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredLog.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No attendance records match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filteredLog.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50 transition">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{att.date}</td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900">{att.personName}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  att.type === 'teacher' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {att.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {att.className || 'General'} {att.period ? `(Period ${att.period})` : ''}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                                  att.status === 'Present'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : att.status === 'Absent'
                                    ? 'bg-red-100 text-red-800'
                                    : att.status === 'Leave'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {att.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-medium">{att.markedBy}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}

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

          {/* Official Authority / Headmaster Signature Status */}
          <div className="p-5 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Official Headmaster (HM) Signature & Seal Placement Status
                </h4>
                <p className="text-slate-600 mt-0.5">
                  This signature is automatically affixed to all Student ID Cards, Teacher ID Cards, Enrollment Slips, Result Sheets, and Academic/Service Reports.
                </p>
              </div>
              <button
                onClick={() => setActiveAdminTab('cms')}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
              >
                Upload / Change Sign in CMS →
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Active Signature on File:</span>
                <p className="font-bold text-slate-800">
                  {settings.headmasterSignatureUrl ? 'Custom Authority Signature Active' : 'Default Official Seal Active'}
                </p>
                <span className="text-[11px] text-emerald-800">
                  Placed as: <strong>Headmaster / Official Authority Signature & Seal</strong>
                </span>
              </div>
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 min-w-[180px] flex justify-center">
                <HeadmasterSignatureDisplay
                  signatureUrl={settings.headmasterSignatureUrl}
                  label="Headmaster Official Seal"
                  subLabel="GBHS Mehrand (Kaloi)"
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Admin ID Card & Report Print Center */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 text-xs">
            {/* Auto-Generator Callout Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-emerald-700/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-800/90 rounded-lg text-amber-300 shrink-0 border border-emerald-600/60">
                  <IdCard className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-black text-sm text-white flex items-center gap-2">
                    Auto-Generate Printable Student ID Cards (PDF)
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Batch PDF Engine
                    </span>
                  </h5>
                  <p className="text-xs text-emerald-200">
                    Auto-generate multi-card A4 sheets (2x2 grid with cutting crop marks) or download individual badges for any class.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveAdminTab('id_cards')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-md transition"
              >
                <span>Launch Auto-Generator</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-700" />
                Individual Card & Report Print Desk
              </h4>
              <p className="text-slate-500 mt-0.5">
                Generate and print instant PDF cards or comprehensive records for any registered student or teacher.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Print Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  Student Cards & Academic Reports
                </h5>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Enrolled Student</label>
                  <select
                    value={adminSelectedStudentId}
                    onChange={(e) => {
                      setAdminSelectedStudentId(e.target.value);
                      if (!adminPreviewType) setAdminPreviewType('student_id');
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-medium text-xs"
                  >
                    <option value="">-- Choose a Student --</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.appliedClass} - GR: {st.grNumber || 'Pending'})
                      </option>
                    ))}
                  </select>
                </div>

                {adminSelectedStudentId && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setAdminPreviewType('student_id')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${
                        adminPreviewType === 'student_id'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <IdCard className="w-3.5 h-3.5" /> ID Card
                    </button>
                    <button
                      onClick={() => setAdminPreviewType('enrollment')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${
                        adminPreviewType === 'enrollment'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Enrollment
                    </button>
                    <button
                      onClick={() => setAdminPreviewType('student_report')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${
                        adminPreviewType === 'student_report'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" /> Comprehensive Report
                    </button>
                  </div>
                )}
              </div>

              {/* Teacher Print Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Users className="w-4 h-4 text-teal-700" />
                  Teacher ID Cards & Service Reports
                </h5>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Faculty Member</label>
                  <select
                    value={adminSelectedTeacherId}
                    onChange={(e) => {
                      setAdminSelectedTeacherId(e.target.value);
                      if (!adminPreviewType) setAdminPreviewType('teacher_id');
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-medium text-xs"
                  >
                    <option value="">-- Choose a Teacher --</option>
                    {teachers.map((tc) => (
                      <option key={tc.id} value={tc.id}>
                        {tc.name} ({tc.designation} - PID: {tc.pid})
                      </option>
                    ))}
                  </select>
                </div>

                {adminSelectedTeacherId && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setAdminPreviewType('teacher_id')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${
                        adminPreviewType === 'teacher_id'
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <IdCard className="w-3.5 h-3.5" /> Staff ID Card
                    </button>
                    <button
                      onClick={() => setAdminPreviewType('teacher_report')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${
                        adminPreviewType === 'teacher_report'
                          ? 'bg-teal-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" /> Service Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Render selected card/report preview for Admin */}
            {adminPreviewType && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-slate-900 text-sm">
                    Print / Export Preview
                  </span>
                  <button
                    onClick={() => setAdminPreviewType(null)}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Close Preview ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-center">
                  {adminPreviewType === 'student_id' && (
                    (() => {
                      const st = students.find((s) => s.id === adminSelectedStudentId) || students[0];
                      return st ? <StudentIdCard student={st} settings={settings} /> : null;
                    })()
                  )}

                  {adminPreviewType === 'enrollment' && (
                    (() => {
                      const st = students.find((s) => s.id === adminSelectedStudentId) || students[0];
                      return st ? <EnrollmentCard student={st} settings={settings} /> : null;
                    })()
                  )}

                  {adminPreviewType === 'student_report' && (
                    (() => {
                      const st = students.find((s) => s.id === adminSelectedStudentId) || students[0];
                      return st ? (
                        <StudentReportCard
                          student={st}
                          settings={settings}
                          attendance={attendance}
                          results={results}
                          remarks={remarks}
                        />
                      ) : null;
                    })()
                  )}

                  {adminPreviewType === 'teacher_id' && (
                    (() => {
                      const tc = teachers.find((t) => t.id === adminSelectedTeacherId) || teachers[0];
                      return tc ? <TeacherIdCard teacher={tc} settings={settings} /> : null;
                    })()
                  )}

                  {adminPreviewType === 'teacher_report' && (
                    (() => {
                      const tc = teachers.find((t) => t.id === adminSelectedTeacherId) || teachers[0];
                      return tc ? (
                        <TeacherReportCard
                          teacher={tc}
                          settings={settings}
                          timetable={timetable}
                          attendance={attendance}
                          remarks={remarks}
                        />
                      ) : null;
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN TAB: Dedicated Auto-Generate Printable Student ID Cards (PDF) */}
      {activeAdminTab === 'id_cards' && (
        <StudentIdCardGenerator
          students={students}
          settings={settings}
        />
      )}

      {/* ADMIN TAB 7: CMS & Dignitary Messages */}
      {/* Required by user prompt:
          "HOME: Minister Message, Secretary Message, Headmaster Message (all contain name and Picture)"
          "About Us section Mission and Vision. This section can be edited by the admin"
          "Footer Displayed Designed By Ghanshamdas JEST & add picture option by admin uploaded" */}
      {activeAdminTab === 'cms' && (
        <div className="space-y-8">
          {/* Global Database Persistence & All-User Sync Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-amber-300 text-sm sm:text-base">
                    Centralized Live Website Storage
                  </h4>
                  <span className="bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600">
                    Live Everywhere
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Every picture, Headmaster profile, and school setting saved here is stored in the persistent database and automatically delivered to all visitors accessing via link on any smartphone, tablet, or computer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => syncWithWebsite(true)}
              disabled={isSyncing}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-md border border-emerald-400/40 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : 'text-amber-300'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Save & Sync All Changes'}</span>
            </button>
          </div>

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
                  {/* Logo Upload Box with Individual Save Option */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs flex flex-col justify-between space-y-3">
                    <FileUploadZone
                      id="cms-school-logo-upload"
                      label="Official School Logo / Seal"
                      value={cmsLogoUrl}
                      onChange={(val) => setCmsLogoUrl(val)}
                      previewShape="square"
                      helperText="Upload official emblem in PDF or Image format (PNG, JPG, SVG, WebP)"
                      badgeText="Displays in Header & ID Cards"
                    />

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-semibold">
                        {pictureSaveFeedback.logo ? (
                          <span className="text-emerald-700 font-bold animate-pulse flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {pictureSaveFeedback.logo}
                          </span>
                        ) : cmsLogoUrl && cmsLogoUrl === settings.logoUrl ? (
                          <span className="text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Saved on Website
                          </span>
                        ) : cmsLogoUrl && cmsLogoUrl !== settings.logoUrl ? (
                          <span className="text-amber-700 font-bold">
                            ⚠️ New file selected
                          </span>
                        ) : (
                          <span className="text-slate-400">Default Logo</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSavePicture('logo', cmsLogoUrl)}
                        disabled={!cmsLogoUrl || pictureSaveFeedback.logo === 'Saving...'}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white rounded-lg font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                        title="Save and synchronize logo to website for all visitors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save & Sync Logo</span>
                      </button>
                    </div>
                  </div>

                  {/* Campus Banner Upload Box with Individual Save Option */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs flex flex-col justify-between space-y-3">
                    <FileUploadZone
                      id="cms-hero-banner-upload"
                      label="Campus Hero Banner Image"
                      value={cmsHeroBannerUrl}
                      onChange={(val) => setCmsHeroBannerUrl(val)}
                      previewShape="banner"
                      helperText="Upload school building / campus photo in PDF or Image format"
                      badgeText="Homepage Banner"
                    />

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-semibold">
                        {pictureSaveFeedback.heroBanner ? (
                          <span className="text-emerald-700 font-bold animate-pulse flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {pictureSaveFeedback.heroBanner}
                          </span>
                        ) : cmsHeroBannerUrl && cmsHeroBannerUrl === settings.heroBannerUrl ? (
                          <span className="text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Saved on Website
                          </span>
                        ) : cmsHeroBannerUrl && cmsHeroBannerUrl !== settings.heroBannerUrl ? (
                          <span className="text-amber-700 font-bold">
                            ⚠️ New banner selected
                          </span>
                        ) : (
                          <span className="text-slate-400">Default Banner</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSavePicture('heroBanner', cmsHeroBannerUrl)}
                        disabled={!cmsHeroBannerUrl || pictureSaveFeedback.heroBanner === 'Saving...'}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white rounded-lg font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                        title="Save and synchronize banner to website for all visitors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save & Sync Banner</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Headmaster (HM) Official Profile & Authority Signature (Required by User: Update HeadMaster Name by Admin and Upload Sign) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm mt-3 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Headmaster (HM) Official Name & Authority Signature
                        </span>
                        <span className="text-[10px] font-black bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full shrink-0">
                          HM Master Seal
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Configure the Headmaster's official name and digitized signature. Both are automatically printed on all <strong>Student ID Cards, Teacher ID Cards, Enrollment Cards, Result Sheets, and Leaving Certificates</strong>.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickSaveHeadmaster}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white rounded-lg font-extrabold text-xs shadow-sm transition shrink-0"
                      title="Quick Save & Publish Headmaster Profile to Website"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{pictureSaveFeedback.hmSignature || 'Save & Publish HM Info'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    {/* Headmaster Name Input */}
                    <div className="space-y-3">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                        <label className="block font-extrabold text-slate-900 text-xs">
                          Headmaster Official Full Name *
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            required
                            value={cmsHeadmasterName}
                            onChange={(e) => setCmsHeadmasterName(e.target.value)}
                            placeholder="Enter official Headmaster name"
                            className="flex-1 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 font-bold text-slate-900 text-xs bg-slate-50 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleQuickSaveHeadmaster}
                            className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white rounded-lg font-black text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                            title="Save Headmaster name and display everywhere across the site"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Name</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-600">
                            Active in System: <strong className="text-emerald-950">{settings.headmasterName || 'Not Set'}</strong>
                          </span>
                          {cmsHeadmasterName !== settings.headmasterName ? (
                            <span className="text-amber-700 font-bold">
                              ⚠️ Unsaved changes
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Live Everywhere
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Headmaster Signature Upload with Direct Save & Sync Option */}
                      <div className="space-y-2">
                        <FileUploadZone
                          id="cms-headmaster-signature-upload"
                          label="Upload Headmaster Official Signature & Stamp (PDF or Image)"
                          value={cmsHeadmasterSignature}
                          onChange={(val) => setCmsHeadmasterSignature(val)}
                          previewShape="signature"
                          helperText="Upload official signature file (PNG, JPG, SVG, or scanned PDF). Transparent background PNG recommended."
                          badgeText="Auto-placed on all Cards & Reports"
                        />

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                          <div className="text-[11px] font-semibold">
                            {pictureSaveFeedback.hmSignature ? (
                              <span className="text-emerald-700 font-bold animate-pulse flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {pictureSaveFeedback.hmSignature}
                              </span>
                            ) : cmsHeadmasterSignature && cmsHeadmasterSignature === settings.headmasterSignatureUrl ? (
                              <span className="text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Saved on All Cards
                              </span>
                            ) : cmsHeadmasterSignature && cmsHeadmasterSignature !== settings.headmasterSignatureUrl ? (
                              <span className="text-amber-700 font-bold">
                                ⚠️ New signature uploaded
                              </span>
                            ) : (
                              <span className="text-slate-400">Digital Seal Active</span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleQuickSaveHeadmaster}
                            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white rounded-lg font-extrabold text-xs shadow-xs transition flex items-center gap-1.5"
                            title="Save and synchronize signature for all certificates and ID cards"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save & Sync Signature</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Live Certificate & Card Preview Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-black uppercase text-slate-700 block tracking-wider mb-1">
                          Live Authority Signature Preview
                        </span>
                        <p className="text-[10px] text-slate-500 mb-3">
                          How the Headmaster's name & signature will appear at the bottom of student ID cards, certificates, and official school reports:
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center my-auto min-h-[110px]">
                        <HeadmasterSignatureDisplay
                          signatureUrl={cmsHeadmasterSignature}
                          headmasterName={cmsHeadmasterName}
                          label="Headmaster Official Seal"
                          subLabel="Govt. Boys High School Mehrand"
                          size="md"
                        />
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Status: {cmsHeadmasterSignature ? 'Custom Signature Loaded' : 'Digital Default Fallback Active'}</span>
                        {cmsHeadmasterSignature && (
                          <button
                            type="button"
                            onClick={() => setCmsHeadmasterSignature('')}
                            className="text-red-600 hover:underline font-bold"
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>
                    </div>
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
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designer / Developer Name</label>
                      <input
                        type="text"
                        value={cmsDesignerName}
                        onChange={(e) => setCmsDesignerName(e.target.value)}
                        className="w-full p-2.5 rounded border border-slate-200 font-bold"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Displays in the website footer across all pages: &quot;Designed By {cmsDesignerName}&quot; with uploaded portrait picture.
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-amber-200 flex flex-col justify-between space-y-3">
                    <FileUploadZone
                      id="cms-designer-picture-upload"
                      label="Designer / Developer Picture"
                      value={cmsDesignerPicture}
                      onChange={(val) => setCmsDesignerPicture(val)}
                      previewShape="avatar"
                      helperText="Upload designer portrait in PDF or Image format (PNG, JPG)"
                      badgeText="Footer Credit"
                    />

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-semibold">
                        {pictureSaveFeedback.designer ? (
                          <span className="text-emerald-700 font-bold animate-pulse flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {pictureSaveFeedback.designer}
                          </span>
                        ) : cmsDesignerPicture && cmsDesignerPicture === settings.designerPictureUrl ? (
                          <span className="text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Saved in Footer
                          </span>
                        ) : cmsDesignerPicture && cmsDesignerPicture !== settings.designerPictureUrl ? (
                          <span className="text-amber-700 font-bold">
                            ⚠️ New photo selected
                          </span>
                        ) : (
                          <span className="text-slate-400">Default Avatar</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSavePicture('designer', cmsDesignerPicture)}
                        disabled={!cmsDesignerPicture || pictureSaveFeedback.designer === 'Saving...'}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white rounded-lg font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                        title="Save and synchronize designer picture to footer for all visitors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save & Sync Picture</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Master Credentials Configuration */}
              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-amber-950 text-sm">
                        Admin Portal Login Credentials & Password
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        View or customize your Admin Master username and password. Changes take effect on next login.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    Master Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Admin Master Username / Identifier
                    </label>
                    <input
                      type="text"
                      required
                      value={cmsAdminUsername}
                      onChange={(e) => setCmsAdminUsername(e.target.value)}
                      placeholder="Sham Nanjwani"
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Default: <code className="font-bold">Sham Nanjwani</code> (also accepts: <code className="font-bold">admin</code>)
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Admin Master Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCmsPassword ? 'text' : 'password'}
                        required
                        value={cmsAdminPassword}
                        onChange={(e) => setCmsAdminPassword(e.target.value)}
                        placeholder="Sham@580"
                        className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCmsPassword(!showCmsPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showCmsPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCmsPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Default: <code className="font-bold">Sham@580</code>
                    </span>
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
              {leaderMessages.map((msg) => {
                const draft = dignitaryDrafts[msg.id];
                const currentName = draft?.name !== undefined ? draft.name : msg.name;
                const currentDesignation = draft?.designation !== undefined ? draft.designation : msg.designation;
                const currentPicture = draft?.pictureUrl !== undefined ? draft.pictureUrl : msg.pictureUrl;
                const currentMessage = draft?.message !== undefined ? draft.message : msg.message;

                return (
                  <div key={msg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="font-extrabold text-emerald-900 uppercase block">{msg.title}</span>
                      <input
                        type="text"
                        value={currentName}
                        onChange={(e) => {
                          setIsCmsDirty(true);
                          setDignitaryDrafts((prev) => ({
                            ...prev,
                            [msg.id]: { ...prev[msg.id], name: e.target.value },
                          }));
                        }}
                        className="w-full p-2 bg-white rounded border border-slate-200 font-bold"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={currentDesignation}
                        onChange={(e) => {
                          setIsCmsDirty(true);
                          setDignitaryDrafts((prev) => ({
                            ...prev,
                            [msg.id]: { ...prev[msg.id], designation: e.target.value },
                          }));
                        }}
                        className="w-full p-2 bg-white rounded border border-slate-200 text-[11px]"
                        placeholder="Designation"
                      />
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <FileUploadZone
                          id={`dignitary-photo-${msg.id}`}
                          label="Dignitary Portrait"
                          value={currentPicture}
                          onChange={(val) => {
                            setIsCmsDirty(true);
                            setDignitaryDrafts((prev) => ({
                              ...prev,
                              [msg.id]: { ...prev[msg.id], pictureUrl: val },
                            }));
                          }}
                          previewShape="avatar"
                          helperText="Upload portrait in PDF or Image format (PNG, JPG)"
                          badgeText={msg.title}
                        />
                      </div>
                      <textarea
                        rows={4}
                        value={currentMessage}
                        onChange={(e) => {
                          setIsCmsDirty(true);
                          setDignitaryDrafts((prev) => ({
                            ...prev,
                            [msg.id]: { ...prev[msg.id], message: e.target.value },
                          }));
                        }}
                        className="w-full p-2 bg-white rounded border border-slate-200 text-[11px]"
                        placeholder="Message content"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const finalName = currentName.trim();
                        const finalMsg = {
                          ...msg,
                          name: finalName,
                          designation: currentDesignation.trim(),
                          pictureUrl: currentPicture,
                          message: currentMessage.trim(),
                        };

                        if (msg.id === 'headmaster' && finalName) {
                          setCmsHeadmasterName(finalName);
                          await updateSettings({ headmasterName: finalName });
                        }
                        await updateLeaderMessage(msg.id, finalMsg);
                        await refreshFromWebsite(true);
                        setIsCmsDirty(false);
                        showAlert(
                          `${msg.title} Saved & Live!`,
                          `The portrait photo, name, and message for ${finalName || msg.title} have been saved to the server and will display for all visitors across all devices.`,
                          'success'
                        );
                      }}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white font-extrabold rounded-lg text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Sync {msg.title}</span>
                    </button>
                  </div>
                );
              })}
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

      {/* ADMIN TAB: School-Wide Announcements & Flash Broadcasts */}
      {activeAdminTab === 'announcements' && (
        <AdminAnnouncementManager />
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

      {/* Admin QR Code Attendance & Verification Scanner Modal */}
      <QrAttendanceScannerModal
        isOpen={showQrAttendanceScanner}
        onClose={() => setShowQrAttendanceScanner(false)}
      />
      {/* Floating Admin Action Toast */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border-2 border-amber-400 animate-bounce flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <h5 className="font-extrabold text-sm text-amber-300">{adminToast.title}</h5>
            <p className="text-xs text-slate-200 leading-snug">{adminToast.message}</p>
          </div>
          <button
            onClick={() => setAdminToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
