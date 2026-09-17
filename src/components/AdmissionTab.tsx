import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { FileUploadZone } from './common/FileUploadZone';
import {
  GraduationCap,
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  Home,
  FileText,
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';

export const AdmissionTab: React.FC = () => {
  const { registerStudent, loginAsStudent, setActiveTab } = useSchool();

  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Registration Form State
  const [appliedClass, setAppliedClass] = useState('Class ECCE');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnicBForm, setCnicBForm] = useState('');
  const [isBFormAvailable, setIsBFormAvailable] = useState<boolean>(true);
  const [fatherCnic, setFatherCnic] = useState('');
  const [dob, setDob] = useState('2019-03-15');
  const [fatherMobile, setFatherMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Address
  const [houseNo, setHouseNo] = useState('');
  const [streetNo, setStreetNo] = useState('');
  const [mohVillage, setMohVillage] = useState('Village Mehrand');
  const [townCity, setTownCity] = useState('Kaloi');
  const [district, setDistrict] = useState('District Tharparkar @ Mithi');

  // Uploads (PDF or Image format - clean upload interface)
  const [studentPictureUrl, setStudentPictureUrl] = useState('');
  const [bFormPictureUrl, setBFormPictureUrl] = useState('');
  const [fatherCnicFrontUrl, setFatherCnicFrontUrl] = useState('');
  const [fatherCnicBackUrl, setFatherCnicBackUrl] = useState('');
  const [leavingCertificateUrl, setLeavingCertificateUrl] = useState('');

  const isFreshEntry = appliedClass === 'Class ECCE' || appliedClass === 'Class 1';

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !fatherName || !fatherMobile || !email || !password) {
      alert('Please fill all mandatory student and parent contact details.');
      return;
    }

    if (isBFormAvailable) {
      if (!cnicBForm) {
        alert('Please enter student NADRA B-Form number.');
        return;
      }
      if (!bFormPictureUrl) {
        alert('Please upload student NADRA B-Form document in PDF or image format.');
        return;
      }
    } else {
      if (!fatherCnic) {
        alert('Please enter Father CNIC Number as B-Form is not available.');
        return;
      }
      if (!fatherCnicFrontUrl) {
        alert('Please upload Father CNIC Front Side in PDF or image format.');
        return;
      }
      if (!fatherCnicBackUrl) {
        alert('Please upload Father CNIC Back Side in PDF or image format.');
        return;
      }
    }

    if (!isFreshEntry && !leavingCertificateUrl) {
      alert('Leaving Certificate is mandatory for admission in Class 2 to 9 (not applicable for ECCE and Class 1).');
      return;
    }

    registerStudent({
      name,
      fatherName,
      cnicBForm: isBFormAvailable ? cnicBForm : fatherCnic,
      isBFormAvailable,
      fatherCnic: isBFormAvailable ? undefined : fatherCnic,
      fatherCnicFrontUrl: !isBFormAvailable ? fatherCnicFrontUrl : undefined,
      fatherCnicBackUrl: !isBFormAvailable ? fatherCnicBackUrl : undefined,
      dob,
      fatherMobile,
      email,
      password,
      address: {
        houseNo: houseNo || 'House # N/A',
        streetNo: streetNo || 'Main Street',
        mohVillage: mohVillage || 'Village Mehrand',
        townCity: townCity || 'Kaloi',
        district: district || 'Tharparkar @ Mithi',
      },
      appliedClass,
      studentPictureUrl: studentPictureUrl || '',
      bFormPictureUrl: isBFormAvailable ? (bFormPictureUrl || undefined) : undefined,
      leavingCertificateUrl: isFreshEntry ? undefined : leavingCertificateUrl,
      bloodGroup: 'B+',
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAsStudent(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-2xl p-8 shadow-xl border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/40">
              <GraduationCap className="w-3.5 h-3.5" />
              Academic Session 2026-2027
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Online Admission & Student Portal
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Apply for admission in Government Boys High School Mehrand (406020752). Register your admission profile, upload mandatory B-Form and previous School Leaving Certificate.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex bg-emerald-900/80 p-1.5 rounded-xl border border-emerald-700 shrink-0">
            <button
              onClick={() => setMode('register')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition ${
                mode === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              New Student Registration
            </button>
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition ${
                mode === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Existing Student Login
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Login Form */}
      {mode === 'login' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mx-auto mb-2 border border-blue-100">
              <Lock className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Student Portal Login</h3>
            <p className="text-xs text-slate-500">
              Access your Enrollment Card, ID Card, Result Sheet, and Daily Remarks
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Registered Email, GR Number, or CNIC/B-Form
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. student@gmail.com, GR-406020752-1001, or B-Form"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your confidential password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition"
            >
              Sign In to Student Portal
            </button>

            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-xs">
                New student applying for admission?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Register 1st here →
                </button>
              </p>
            </div>
          </form>
        </div>
      ) : (
        /* Mode 2: Full Admission Registration Form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
          {/* Rules & Requirements Alert */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1 text-xs text-amber-900">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Mandatory Admission Document Guidelines
            </h4>
            <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
              <li>
                <strong>B-Form or Father CNIC:</strong> Mandatory for all students. If student NADRA B-Form is not yet available, you must upload <strong>Father CNIC Both Sides (Front & Back)</strong> in PDF or Image format.
              </li>
              <li>
                <strong>Leaving Certificate (SLC):</strong> Mandatory for Class 2 to 9. (Exempted for fresh Class ECCE & Class 1 admissions).
              </li>
              <li>
                Upon submission, the Headmaster/Admin will verify records, issue a confirmation letter, and allot an official <strong>GR Number</strong> displayed on your Student Dashboard.
              </li>
            </ul>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs">
            {/* Class applying for */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block font-extrabold text-slate-800 text-sm mb-1.5">
                Class Applying For *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  'Class ECCE',
                  'Class 1',
                  'Class 2',
                  'Class 3',
                  'Class 4',
                  'Class 5',
                  'Class 6',
                  'Class 7',
                  'Class 8',
                  'Class 9',
                ].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setAppliedClass(cls)}
                    className={`py-2 px-3 rounded-lg font-bold border transition text-center ${
                      appliedClass === cls
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
              {isFreshEntry && (
                <p className="text-[11px] text-emerald-700 mt-2 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {appliedClass} selected: School Leaving Certificate is not applicable (Fresh Admission Entry).
                </p>
              )}
            </div>

            {/* Section 1: Basic Student Particulars */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                1. Student & Guardian Particulars
              </h3>

              {/* B-Form Availability Toggle */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 sm:p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-700" />
                      Student NADRA B-Form Status *
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Does the student currently possess an official NADRA B-Form?
                    </p>
                  </div>
                  <div className="inline-flex rounded-lg bg-slate-200 p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsBFormAvailable(true)}
                      className={`px-3 py-1.5 rounded-md font-bold text-xs transition ${
                        isBFormAvailable
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      ✓ B-Form Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsBFormAvailable(false)}
                      className={`px-3 py-1.5 rounded-md font-bold text-xs transition ${
                        !isBFormAvailable
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      ✕ B-Form Not Available
                    </button>
                  </div>
                </div>

                {!isBFormAvailable && (
                  <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Notice:</strong> As B-Form is not available, enter Father's CNIC number below and upload <strong>Father CNIC Both Sides (Front & Back)</strong> in Section 3.
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dileep Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lachhman Das"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {isBFormAvailable ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Student NADRA B-Form Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="44301-XXXXXXX-X"
                      value={cnicBForm}
                      onChange={(e) => setCnicBForm(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
                    />
                    <span className="text-[10px] text-slate-400">NADRA Birth Registration / B-Form Number</span>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-amber-900 mb-1 flex items-center gap-1">
                      <span>Father's CNIC Number (B-Form Alternative) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="44301-XXXXXXX-X"
                      value={fatherCnic}
                      onChange={(e) => {
                        setFatherCnic(e.target.value);
                        setCnicBForm(e.target.value);
                      }}
                      className="w-full p-2.5 rounded-lg border-2 border-amber-400 bg-amber-50/30 focus:outline-none focus:border-amber-600 font-mono font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-amber-700 font-semibold">
                      Father's Computerized National Identity Card Number
                    </span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth (D.O.B.) *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father / Guardian Mobile No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92-346-XXXXXXX"
                    value={fatherMobile}
                    onChange={(e) => setFatherMobile(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Account Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Create Student Portal Password *</label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      placeholder="Set strong confidential password (minimum 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-10 pl-2.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Residential Address (Explicitly requested by user: House No, Street No, Moh/Village, Town/City, District) */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-700" />
                2. Student Home Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">House Number</label>
                  <input
                    type="text"
                    placeholder="e.g. House # 14"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Street Number / Name</label>
                  <input
                    type="text"
                    placeholder="e.g. School Road"
                    value={streetNo}
                    onChange={(e) => setStreetNo(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mohalla / Village *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Village Mehrand"
                    value={mohVillage}
                    onChange={(e) => setMohVillage(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Town / City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kaloi"
                    value={townCity}
                    onChange={(e) => setTownCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. District Tharparkar @ Mithi"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Upload Pictures */}
            {/* Required by user prompt:
                "Class ECCE, 1, 2, 3, 4, 5, 6, 7, 8, 9 in class Applying for change it.
                 IF B-form Not available than upload Father CNIC Both side in PDF/ image format." */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  3. Mandatory Document Uploads
                </h3>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  All documents supported in PDF or Image (PNG/JPG) format
                </span>
              </div>

              {/* Dynamic Document Grid based on B-Form Availability */}
              <div className={`grid grid-cols-1 ${isBFormAvailable ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
                {/* 1. Student Passport Photo */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <FileUploadZone
                    id="admission-student-photo"
                    label="Student Passport Picture"
                    required
                    value={studentPictureUrl}
                    onChange={(val) => setStudentPictureUrl(val)}
                    previewShape="avatar"
                    helperText="Upload recent passport size photo in Image (PNG, JPG) or PDF"
                    badgeText="Mandatory"
                  />
                </div>

                {/* 2. B-Form OR Father CNIC Uploads */}
                {isBFormAvailable ? (
                  <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/30">
                    <FileUploadZone
                      id="admission-bform-doc"
                      label="NADRA B-Form Document"
                      required
                      value={bFormPictureUrl}
                      onChange={(val) => setBFormPictureUrl(val)}
                      previewShape="document"
                      helperText="Official NADRA B-Form in PDF or Image format (PNG/JPG)"
                      badgeText="B-Form (PDF/Image)"
                    />
                  </div>
                ) : (
                  <>
                    {/* Father CNIC Front Side */}
                    <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/40">
                      <FileUploadZone
                        id="admission-father-cnic-front"
                        label="Father CNIC (Front Side)"
                        required
                        value={fatherCnicFrontUrl}
                        onChange={(val) => setFatherCnicFrontUrl(val)}
                        previewShape="document"
                        helperText="Upload Father CNIC Front Side in PDF or Image format"
                        badgeText="CNIC Front"
                      />
                    </div>

                    {/* Father CNIC Back Side */}
                    <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/40">
                      <FileUploadZone
                        id="admission-father-cnic-back"
                        label="Father CNIC (Back Side)"
                        required
                        value={fatherCnicBackUrl}
                        onChange={(val) => setFatherCnicBackUrl(val)}
                        previewShape="document"
                        helperText="Upload Father CNIC Back Side in PDF or Image format"
                        badgeText="CNIC Back"
                      />
                    </div>
                  </>
                )}

                {/* 3. Leaving Certificate (Mandatory for Classes 2-9, Exempted for ECCE & Class 1) */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isFreshEntry
                      ? 'bg-slate-100 border-slate-200 opacity-75'
                      : 'border-blue-300 bg-blue-50/40'
                  }`}
                >
                  {isFreshEntry ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-500 text-xs space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="font-bold text-slate-800">School Leaving Certificate</p>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Exempted for {appliedClass} fresh admission.
                      </p>
                    </div>
                  ) : (
                    <FileUploadZone
                      id="admission-leaving-cert"
                      label="School Leaving Certificate (SLC)"
                      required={!isFreshEntry}
                      value={leavingCertificateUrl}
                      onChange={(val) => setLeavingCertificateUrl(val)}
                      previewShape="document"
                      helperText="Upload original SLC from previous school in PDF or Image format"
                      badgeText="Mandatory (Classes 2-9)"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                By submitting, you certify all B-Form and address particulars are correct under Sindh Education rules.
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-amber-300" />
                Submit Application for Admin Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
