import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
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
  const [appliedClass, setAppliedClass] = useState('Class 9th');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnicBForm, setCnicBForm] = useState('');
  const [dob, setDob] = useState('2010-01-15');
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

  // Uploads
  const [studentPictureUrl, setStudentPictureUrl] = useState(
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
  );
  const [bFormPictureUrl, setBFormPictureUrl] = useState(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  );
  const [leavingCertificateUrl, setLeavingCertificateUrl] = useState(
    'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=400&q=80'
  );

  const isClass1 = appliedClass === 'Class 1' || appliedClass === 'Class 1st';

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !fatherName || !cnicBForm || !fatherMobile || !email || !password) {
      alert('Please fill all mandatory student and parent contact details.');
      return;
    }

    if (!bFormPictureUrl) {
      alert('B-Form Picture is mandatory for all classes!');
      return;
    }

    if (!isClass1 && !leavingCertificateUrl) {
      alert('Leaving Certificate is mandatory for admission in Class 2 to 10 (not applicable for Class 1).');
      return;
    }

    registerStudent({
      name,
      fatherName,
      cnicBForm,
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
      studentPictureUrl,
      bFormPictureUrl,
      leavingCertificateUrl: isClass1 ? undefined : leavingCertificateUrl,
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
                <strong>B-Form Picture:</strong> Mandatory for all students (Class 1 to 10).
              </li>
              <li>
                <strong>Leaving Certificate (SLC):</strong> Mandatory for Class 2nd to 10th. (Not applicable for fresh Class 1 admissions).
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
                  'Class 1',
                  'Class 6th',
                  'Class 7th',
                  'Class 8th',
                  'Class 9th',
                  'Class 10th',
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
              {isClass1 && (
                <p className="text-[11px] text-emerald-700 mt-2 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Primary Class 1 selected: School Leaving Certificate is not applicable.
                </p>
              )}
            </div>

            {/* Section 1: Basic Student Particulars */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                1. Student & Guardian Particulars
              </h3>

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

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNIC / B-Form Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="44301-XXXXXXX-X"
                    value={cnicBForm}
                    onChange={(e) => setCnicBForm(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

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
                "Upload Picture = B-Form Picture Mandatory for all classes and
                 Leaving Certificate (2 to 9 & Class not applicable for 1)" */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-700" />
                3. Mandatory Document Uploads
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Student Passport Photo */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="block font-bold text-slate-800">
                    Student Passport Picture *
                  </label>
                  <div className="w-24 h-28 mx-auto rounded-lg overflow-hidden border border-slate-300 bg-white shadow-xs">
                    <img
                      src={studentPictureUrl}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={studentPictureUrl}
                    onChange={(e) => setStudentPictureUrl(e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-200 text-[10px] font-mono"
                    placeholder="Photo URL"
                  />
                  <span className="text-[10px] text-slate-400 block text-center">Blue / White background</span>
                </div>

                {/* 2. B-Form Picture (Mandatory for ALL classes) */}
                <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-emerald-950">
                      B-Form Picture *
                    </label>
                    <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">
                      Mandatory (All Classes)
                    </span>
                  </div>
                  <div className="w-full h-28 rounded-lg overflow-hidden border border-emerald-200 bg-white shadow-xs flex items-center justify-center">
                    <img
                      src={bFormPictureUrl}
                      alt="B-Form Document"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    required
                    value={bFormPictureUrl}
                    onChange={(e) => setBFormPictureUrl(e.target.value)}
                    className="w-full p-1.5 rounded border border-emerald-300 text-[10px] font-mono"
                    placeholder="B-Form Image URL"
                  />
                  <span className="text-[10px] text-emerald-700 block text-center">NADRA Official B-Form</span>
                </div>

                {/* 3. Leaving Certificate (Mandatory for 2-10, NOT applicable for 1) */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isClass1 ? 'bg-slate-100 border-slate-200 opacity-60' : 'border-amber-300 bg-amber-50/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800">
                      School Leaving Certificate *
                    </label>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isClass1 ? 'bg-slate-300 text-slate-600' : 'bg-amber-600 text-white'
                    }`}>
                      {isClass1 ? 'Not Applicable for Class 1' : 'Mandatory (Classes 2-10)'}
                    </span>
                  </div>

                  {isClass1 ? (
                    <div className="h-28 flex flex-col items-center justify-center text-center p-3 text-slate-500 text-xs">
                      <CheckCircle2 className="w-8 h-8 text-slate-400 mb-1" />
                      <span>Exempted for fresh Class 1 admissions.</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-28 rounded-lg overflow-hidden border border-amber-200 bg-white shadow-xs">
                        <img
                          src={leavingCertificateUrl}
                          alt="Leaving Certificate"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        type="url"
                        required={!isClass1}
                        value={leavingCertificateUrl}
                        onChange={(e) => setLeavingCertificateUrl(e.target.value)}
                        className="w-full p-1.5 rounded border border-amber-300 text-[10px] font-mono"
                        placeholder="SLC Document Image URL"
                      />
                      <span className="text-[10px] text-amber-800 block text-center">Previous school certificate</span>
                    </>
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
