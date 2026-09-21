import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { FileUploadZone } from './common/FileUploadZone';
import { SafeMediaImage } from './common/SafeMediaImage';
import { SchoolLogo } from './common/SchoolLogo';
import { FacultyProfileModal } from './FacultyProfileModal';
import {
  Users,
  Mail,
  Phone,
  Award,
  BookOpen,
  UserPlus,
  Search,
  CheckCircle,
  IdCard,
  Briefcase,
  X,
  Upload,
  Eye,
  EyeOff,
  ShieldCheck,
  Grid,
  List,
  Filter,
  RotateCcw,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Teacher } from '../types';

export const FacultyTab: React.FC = () => {
  const { teachers, registerTeacher, setActiveTab, settings, leaderMessages, timetable } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCadre, setSelectedCadre] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);

  // Professional profile modal state
  const [selectedTeacherForProfile, setSelectedTeacherForProfile] = useState<Teacher | null>(null);
  const [isHeadmasterProfileModal, setIsHeadmasterProfileModal] = useState(false);

  const headmasterMsg = leaderMessages.find((m) => m.id === 'headmaster');
  const activeHeadmasterName = settings.headmasterName || headmasterMsg?.name || 'Headmaster';

  // Form state for teacher registration popup
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    pid: '',
    cnic: '',
    email: '',
    password: '',
    mobileNo: '',
    qualification: '',
    subjectSpecialist: '',
    designation: 'JEST',
    pictureUrl: '',
    cnicFileUrl: '',
    cnicFileName: '',
    appointmentOrderUrl: '',
    appointmentOrderFileName: '',
  });

  // Filter approved teachers for public faculty page
  const approvedTeachers = useMemo(() => {
    return teachers.filter((t) => t.status === 'approved');
  }, [teachers]);

  // Subject categories list with counts
  const subjectList = [
    { id: 'All', label: 'All Subjects' },
    { id: 'Computer Science', label: 'Computer Science' },
    { id: 'Mathematics', label: 'Mathematics' },
    { id: 'Physics', label: 'Physics' },
    { id: 'English', label: 'English' },
    { id: 'Chemistry', label: 'Chemistry & Biology' },
    { id: 'Sindhi', label: 'Sindhi Literature' },
    { id: 'General Science', label: 'General Science' },
  ];

  // Cadre designations
  const cadres = ['All', 'JEST', 'HST', 'PST'];

  // Filtered teachers logic
  const filteredTeachers = useMemo(() => {
    return approvedTeachers.filter((t) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        t.name.toLowerCase().includes(term) ||
        t.fatherName.toLowerCase().includes(term) ||
        t.subjectSpecialist.toLowerCase().includes(term) ||
        t.qualification.toLowerCase().includes(term) ||
        (t.pid && t.pid.toLowerCase().includes(term)) ||
        (t.designation && t.designation.toLowerCase().includes(term));

      const matchesSubject =
        selectedSubject === 'All' ||
        t.subjectSpecialist.toLowerCase().includes(selectedSubject.toLowerCase());

      const matchesCadre =
        selectedCadre === 'All' ||
        (t.designation && t.designation.toUpperCase().includes(selectedCadre.toUpperCase()));

      return matchesSearch && matchesSubject && matchesCadre;
    });
  }, [approvedTeachers, searchTerm, selectedSubject, selectedCadre]);

  // Subject counts for badge indicators
  const getSubjectCount = (subId: string) => {
    if (subId === 'All') return approvedTeachers.length;
    return approvedTeachers.filter((t) =>
      t.subjectSpecialist.toLowerCase().includes(subId.toLowerCase())
    ).length;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('All');
    setSelectedCadre('All');
  };

  // Construct Headmaster pseudo-teacher object for profile modal
  const headmasterAsTeacher: Teacher = useMemo(() => {
    return {
      id: 'headmaster-gov-profile',
      name: activeHeadmasterName,
      fatherName: 'Institutional Incharge',
      pid: 'PID-HM-406020752',
      cnic: '44301-XXXXXXX-1',
      email: settings.contactEmail || 'headmaster.gbhsmehrand@seld.gos.pk',
      mobileNo: settings.contactPhone || '+92-346-3847836',
      qualification: 'M.A (Edu), M.Ed, Sindh School Leadership Certified (BPS-17)',
      subjectSpecialist: 'School Governance, Educational Leadership & Institutional Administration',
      pictureUrl:
        headmasterMsg?.pictureUrl ||
        settings.logoUrl ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80',
      status: 'approved',
      joinDate: '10-04-2012',
      designation: 'Headmaster (BPS-17)',
      isAvailableToday: true,
      joiningLetterIssued: true,
      joiningLetterDispatchNo: 'SELD-DIR/SE/HYD/2012/0014',
      joiningLetterDate: '10-04-2012',
      joiningRemarks: 'Confirmed Head of Institution under School Education & Literacy Department, Sindh.',
    };
  }, [activeHeadmasterName, headmasterMsg, settings]);

  const handleOpenProfile = (teacher: Teacher, isHeadmaster = false) => {
    setSelectedTeacherForProfile(teacher);
    setIsHeadmasterProfileModal(isHeadmaster);
  };

  const handleSubmitTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.qualification || !formData.subjectSpecialist) {
      alert('Please fill out all mandatory fields including your password.');
      return;
    }

    registerTeacher({
      name: formData.name,
      fatherName: formData.fatherName,
      pid: formData.pid || `PID-${Math.floor(1000000 + Math.random() * 9000000)}`,
      cnic: formData.cnic || '44301-XXXXXXX-X',
      email: formData.email,
      password: formData.password,
      mobileNo: formData.mobileNo || '+92-346-XXXXXXX',
      qualification: formData.qualification,
      subjectSpecialist: formData.subjectSpecialist,
      pictureUrl: formData.pictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      designation: formData.designation,
      isAvailableToday: true,
      cnicFileUrl: formData.cnicFileUrl,
      cnicFileName: formData.cnicFileName,
      appointmentOrderUrl: formData.appointmentOrderUrl,
      appointmentOrderFileName: formData.appointmentOrderFileName,
    });

    alert(
      `Faculty registration submitted for ${formData.name}! Your account is pending Headmaster review. Once approved, you can log in with your email or PID and password.`
    );
    setShowRegisterModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Registration CTA */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-amber-400 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Government Secondary Educators • Tharparkar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Interactive Faculty Directory
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Explore verified government teaching personnel at Government Boys High School Mehrand (SEMIS: 406020752). Filter by subject specialist, search by name or PID, and view comprehensive professional credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Join Faculty / Register
          </button>
          <button
            onClick={() => setActiveTab('teacher-portal')}
            className="px-4 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm border border-emerald-600 transition flex items-center justify-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-emerald-300" />
            Teacher Portal Login
          </button>
        </div>
      </div>

      {/* Head of Institution / Headmaster Official Authority Card */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-slate-900 shrink-0 flex items-center justify-center relative">
              {headmasterMsg?.pictureUrl ? (
                <SafeMediaImage
                  src={headmasterMsg.pictureUrl}
                  alt={activeHeadmasterName}
                  className="w-full h-full object-cover"
                />
              ) : settings.logoUrl ? (
                <img src={settings.logoUrl} alt="School Seal" className="w-full h-full object-contain p-2" />
              ) : (
                <Award className="w-10 h-10 text-amber-400" />
              )}
              <span className="absolute bottom-1 right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Head of Institution</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {activeHeadmasterName}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 font-semibold">
                Headmaster & Administrative Incharge (BPS-17) • {settings.schoolName}
              </p>
              <p className="text-xs text-slate-300 max-w-xl pt-0.5 leading-relaxed">
                Supervising academic quality, faculty duties, student evaluations, admissions, and institutional governance under School Education & Literacy Department, Govt. of Sindh.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/20 text-center w-full sm:w-auto min-w-[170px]">
              <span className="text-[10px] uppercase font-extrabold text-amber-300 block mb-1">
                Institutional Authority
              </span>
              <div className="bg-emerald-950/70 rounded-xl p-2.5 border border-emerald-700/50 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>SELD Govt. of Sindh</span>
                </div>
                <div className="text-[10px] text-emerald-300/90 font-mono">
                  SEMIS: {settings.semisCode}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenProfile(headmasterAsTeacher, true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Headmaster Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Directory Search & Filtering Console */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
        {/* Row 1: Search, Cadre Selector, View Mode */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search by Name, Subject, or PID */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty by teacher name, father's name, subject, or PID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cadre Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Cadre:
            </span>
            {cadres.map((cadre) => (
              <button
                key={cadre}
                onClick={() => setSelectedCadre(cadre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  selectedCadre === cadre
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cadre === 'All' ? 'All Cadres' : cadre}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="flex items-center justify-end gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'grid'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'list'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Row 2: Subject Filter Pills */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Subject:
            </span>
            {subjectList.map((sub) => {
              const count = getSubjectCount(sub.id);
              const isSelected = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{sub.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected
                        ? 'bg-emerald-950 text-amber-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Summary & Active Criteria Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              Showing <strong className="text-emerald-800 font-bold">{filteredTeachers.length}</strong> of{' '}
              {approvedTeachers.length} approved teachers
            </span>
            {(searchTerm || selectedSubject !== 'All' || selectedCadre !== 'All') && (
              <span className="text-slate-400">
                (Filtered by:{' '}
                {[
                  searchTerm ? `"${searchTerm}"` : null,
                  selectedSubject !== 'All' ? selectedSubject : null,
                  selectedCadre !== 'All' ? selectedCadre : null,
                ]
                  .filter(Boolean)
                  .join(', ')}
                )
              </span>
            )}
          </div>

          {(searchTerm || selectedSubject !== 'All' || selectedCadre !== 'All') && (
            <button
              onClick={resetFilters}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 text-[11px] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Teachers Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group hover:border-emerald-500 relative"
            >
              {/* Top Card Banner */}
              <div className="h-20 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 relative p-3 flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-800/80 text-emerald-200 px-2.5 py-0.5 rounded border border-emerald-700/50">
                  GBHS Mehrand
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-2xs">
                  {teacher.pid}
                </span>
              </div>

              {/* Profile Content */}
              <div className="p-6 pt-0 flex-1 flex flex-col -mt-10">
                <div className="flex items-end justify-between mb-3">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform shrink-0 bg-slate-100 relative">
                    <SafeMediaImage
                      src={teacher.pictureUrl}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {teacher.designation || 'Teacher'}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Son of {teacher.fatherName}
                  </p>
                </div>

                {/* Professional Details Badges */}
                <div className="mt-3.5 space-y-2 text-xs flex-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold truncate">{teacher.qualification}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700">
                    <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 text-[11px] block">Specialization:</span>
                      <strong className="text-slate-900 font-bold">{teacher.subjectSpecialist}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600 pt-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{teacher.email}</span>
                  </div>

                  {teacher.mobileNo && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px]">{teacher.mobileNo}</span>
                    </div>
                  )}
                </div>

                {/* Status & CTA footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Joined: {teacher.joinDate}
                  </span>
                  <button
                    onClick={() => handleOpenProfile(teacher, false)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teachers List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-emerald-800/30 shadow-xs shrink-0 bg-slate-100">
                  <SafeMediaImage
                    src={teacher.pictureUrl}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 truncate">
                      {teacher.name}
                    </h3>
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {teacher.designation || 'Teacher'}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {teacher.pid}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    S/O {teacher.fatherName} • <span className="font-semibold text-slate-700">{teacher.qualification}</span>
                  </p>
                  <p className="text-xs text-emerald-900 font-bold">
                    Specialist in: {teacher.subjectSpecialist}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right hidden md:block">
                  <span className="text-[11px] text-slate-400 block">Inducted</span>
                  <span className="text-xs font-bold text-slate-700">{teacher.joinDate}</span>
                </div>
                <button
                  onClick={() => handleOpenProfile(teacher, false)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Profile</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
            <Users className="w-8 h-8 text-emerald-700" />
          </div>
          {approvedTeachers.length === 0 ? (
            <div className="space-y-3 max-w-md mx-auto">
              <h3 className="text-base font-black text-slate-800">
                No Faculty Members Approved Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                By default, teachers appear here only after submitting their credentials and receiving official approval from the Headmaster / Admin.
              </p>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>Submit Teacher Registration</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-w-md mx-auto">
              <h3 className="text-base font-black text-slate-800">
                No Faculty Members Found
              </h3>
              <p className="text-xs text-slate-500">
                No approved teachers match the current search keyword "{searchTerm}" or selected filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all search filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Brief Professional Profile Modal */}
      <FacultyProfileModal
        teacher={selectedTeacherForProfile}
        isOpen={!!selectedTeacherForProfile}
        onClose={() => setSelectedTeacherForProfile(null)}
        isHeadmaster={isHeadmasterProfileModal}
      />

      {/* TEACHER REGISTRATION POP-UP MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-bold tracking-widest">
                  GOVT BOYS HIGH SCHOOL MEHRAND
                </span>
                <h3 className="text-lg font-black">Teacher Registration Portal</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitTeacher} className="p-6 space-y-4 text-xs">
              <p className="text-slate-500 text-xs">
                Please provide your official credentials. Upon submission, your record will be reviewed and approved by the Headmaster/Admin before appearing on the public faculty section.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Morio Mal"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PID (Personal ID Number) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PID-10998822"
                    value={formData.pid}
                    onChange={(e) => setFormData({ ...formData, pid: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNIC Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="44301-XXXXXXX-X"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@gbhsmehrand.edu.pk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Login Password *</label>
                  <div className="relative">
                    <input
                      type={showModalPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pr-9 pl-2.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPassword(!showModalPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="+92-346-XXXXXXX"
                    value={formData.mobileNo}
                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="JEST">JEST (Junior Elementary School Teacher)</option>
                    <option value="HST">HST (High School Teacher)</option>
                    <option value="PST">PST (Primary School Teacher)</option>
                    <option value="Subject Specialist">Subject Specialist</option>
                    <option value="Headmaster">Headmaster</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Academic & Professional Qualifications *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc (Physics), B.Ed (Hons), University of Sindh"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Subject Specialist *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics & Computer Science"
                    value={formData.subjectSpecialist}
                    onChange={(e) => setFormData({ ...formData, subjectSpecialist: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <FileUploadZone
                    id="teacher-profile-picture"
                    label="Teacher Profile Picture / Photo"
                    required
                    value={formData.pictureUrl}
                    onChange={(val) => setFormData({ ...formData, pictureUrl: val })}
                    previewShape="avatar"
                    helperText="Upload teacher official portrait in PDF or Image format (PNG, JPG, WebP) — no links needed"
                    badgeText="Govt. Official ID"
                  />
                </div>

                <div className="sm:col-span-2">
                  <FileUploadZone
                    id="teacher-cnic-document"
                    label="Teacher CNIC (Front / Back or Combined PDF / Image) *"
                    required
                    value={formData.cnicFileUrl}
                    fileName={formData.cnicFileName}
                    onChange={(val, name) =>
                      setFormData({
                        ...formData,
                        cnicFileUrl: val,
                        cnicFileName: name || 'CNIC_Document.pdf',
                      })
                    }
                    previewShape="banner"
                    helperText="Upload official CNIC document (PDF or scanned image). Admin verifies authenticity before approval."
                    badgeText="Govt. CNIC Document"
                  />
                </div>

                <div className="sm:col-span-2">
                  <FileUploadZone
                    id="teacher-appointment-order"
                    label="Transfer / Appointment Order (SELD Official Order PDF / Image) *"
                    required
                    value={formData.appointmentOrderUrl}
                    fileName={formData.appointmentOrderFileName}
                    onChange={(val, name) =>
                      setFormData({
                        ...formData,
                        appointmentOrderUrl: val,
                        appointmentOrderFileName: name || 'Appointment_Order.pdf',
                      })
                    }
                    previewShape="box"
                    helperText="Upload School Education & Literacy Department (SELD) appointment or transfer order."
                    badgeText="Govt. Appointment Order"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Submit for Admin Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
