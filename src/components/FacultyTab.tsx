import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { FileUploadZone } from './common/FileUploadZone';
import { SafeMediaImage } from './common/SafeMediaImage';
import { HeadmasterSignatureDisplay } from './common/HeadmasterSignatureDisplay';
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
} from 'lucide-react';
import { Teacher } from '../types';

export const FacultyTab: React.FC = () => {
  const { teachers, registerTeacher, setActiveTab, settings, leaderMessages } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);

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
  });

  // Filter approved teachers for public faculty page
  const approvedTeachers = teachers.filter((t) => t.status === 'approved');

  // Subjects for filter
  const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'English', 'Chemistry', 'Sindhi'];

  const filteredTeachers = approvedTeachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjectSpecialist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      selectedSubject === 'All' ||
      t.subjectSpecialist.toLowerCase().includes(selectedSubject.toLowerCase());

    return matchesSearch && matchesSubject;
  });

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
    });

    alert(
      `Faculty registration submitted for ${formData.name}! Your account is pending Headmaster review. Once approved, you can log in with your email or PID and password.`
    );
    setShowRegisterModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Registration CTA */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-amber-400">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Dedicated Educators of Tharparkar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Faculty & Teaching Staff
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
            Meet the esteemed educators at Government Boys High School Mehrand (SEMIS: 406020752), fostering academic rigor, moral character, and scientific advancement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Teacher Registration / Join Faculty
          </button>
          <button
            onClick={() => setActiveTab('teacher-portal')}
            className="px-4 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm border border-emerald-600 transition"
          >
            Teacher Portal Login
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search teacher by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Subject pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-400 font-semibold mr-1 shrink-0">Subject:</span>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition ${
                selectedSubject === sub
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Head of Institution / Headmaster Official Authority Card */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-slate-900 shrink-0 flex items-center justify-center">
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
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Head of Institution</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {activeHeadmasterName}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 font-semibold">
                Headmaster & Administrative Incharge • {settings.schoolName}
              </p>
              <p className="text-xs text-slate-300 max-w-xl pt-0.5 leading-relaxed">
                Supervising academic quality, faculty duties, student evaluations, admissions, and institutional governance under School Education & Literacy Department, Govt. of Sindh.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 text-center shrink-0 w-full sm:w-auto min-w-[170px]">
            <span className="text-[10px] uppercase font-extrabold text-amber-300 block mb-1">
              Institutional Authority Seal
            </span>
            <div className="bg-white rounded-xl p-2.5 shadow-inner">
              <HeadmasterSignatureDisplay
                signatureUrl={settings.headmasterSignatureUrl}
                headmasterName={activeHeadmasterName}
                label="Authority Signature & Seal"
                subLabel="GBHS Mehrand"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group hover:border-emerald-500"
          >
            {/* Top Card Banner */}
            <div className="h-20 bg-gradient-to-r from-emerald-900 to-teal-800 relative">
              <div className="absolute top-2 right-3">
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-xs">
                  {teacher.pid}
                </span>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 pt-0 flex-1 flex flex-col -mt-10">
              <div className="flex items-end justify-between mb-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform shrink-0 bg-slate-100">
                  <SafeMediaImage
                    src={teacher.pictureUrl}
                    alt={teacher.name}
                  />
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  {teacher.designation || 'Teacher'}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {teacher.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                S/O {teacher.fatherName}
              </p>

              {/* Badges */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-semibold">{teacher.qualification}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-slate-600">Specialist:</span>
                  <strong className="text-slate-800">{teacher.subjectSpecialist}</strong>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate font-mono text-[11px]">{teacher.email}</span>
                </div>

                {teacher.mobileNo && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{teacher.mobileNo}</span>
                  </div>
                )}
              </div>

              {/* Status footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Joined: {teacher.joinDate}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Govt. Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No teachers found matching criteria.</p>
          <p className="text-xs text-slate-400">Try changing the subject filter or search keyword.</p>
        </div>
      )}

      {/* TEACHER REGISTRATION POP-UP MODAL */}
      {/* Required by user prompt:
          "Teacher registers via email and password. After registration, a pop-up form contains
           Name, F Name, PID, CNIC, Email, Mobile No, Qualification, Subject Specialist, and upload Profile Picture.
           Then submit and review by Admin; after approval by admin and confirmation pop-up to teacher,
           display teacher on Main Faculty section with Name, Qualification, and Picture." */}
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
