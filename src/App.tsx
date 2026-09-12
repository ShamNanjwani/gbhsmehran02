import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeTab } from './components/HomeTab';
import { FacultyTab } from './components/FacultyTab';
import { AdmissionTab } from './components/AdmissionTab';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminPortal } from './components/AdminPortal';
import { AboutUsTab } from './components/AboutUsTab';
import { ContactUsTab } from './components/ContactUsTab';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Shield,
  UserCheck,
  GraduationCap,
  Sparkles,
  Wifi,
  BatteryMedium,
  RotateCcw,
  LogOut,
} from 'lucide-react';

const SchoolAppInner: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    deviceMode,
    setDeviceMode,
    alertMessage,
    clearAlert,
    currentRole,
    currentUser,
    logout,
  } = useSchool();

  // Render the current view
  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'faculty':
        return <FacultyTab />;
      case 'admission':
        return <AdmissionTab />;
      case 'student-portal':
        return <StudentDashboard />;
      case 'teacher-portal':
        return <TeacherDashboard />;
      case 'admin':
      case 'admin-portal':
        return <AdminPortal />;
      case 'about':
        return <AboutUsTab />;
      case 'contact':
        return <ContactUsTab />;
      default:
        return <HomeTab />;
    }
  };

  // Device simulation wrapper
  const isMobileFrame = deviceMode === 'android' || deviceMode === 'ios';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start text-slate-800 font-sans selection:bg-emerald-700 selection:text-white">
      {/* Global Alert Notification Popup Modal (for teacher approvals, student admissions, remarks) */}
      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-800 space-y-4 relative">
            <button
              onClick={clearAlert}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  alertMessage.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : alertMessage.type === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : alertMessage.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {alertMessage.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : alertMessage.type === 'warning' ? (
                  <AlertCircle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1 pr-4">
                <h3 className="font-black text-slate-900 text-base">{alertMessage.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{alertMessage.message}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={clearAlert}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition"
              >
                Okay, Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Fast Role-Switcher Toolbar */}
      <div className="w-full bg-slate-900 text-white text-xs py-2 px-4 shadow-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-400 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            Active Mode:
          </span>
          <span className="font-bold bg-slate-800 px-2.5 py-0.5 rounded text-[11px] border border-slate-700 text-emerald-300">
            {currentRole === 'admin'
              ? '👑 Administrator'
              : currentRole === 'teacher'
              ? '👨‍🏫 Teacher Portal'
              : currentRole === 'student'
              ? '🎓 Student Portal'
              : '🌐 Public Visitor'}
          </span>
        </div>

        {/* Quick Portal Jump Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Navigate:</span>

          <button
            onClick={() => setActiveTab('home')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              activeTab === 'home' ? 'bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('admission')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              activeTab === 'admission' ? 'bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            Admission
          </button>

          <button
            onClick={() => setActiveTab('student-portal')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
              activeTab === 'student-portal'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-950/80 text-blue-200 hover:bg-blue-900 border border-blue-700/40'
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            Student Portal
          </button>

          <button
            onClick={() => setActiveTab('teacher-portal')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
              activeTab === 'teacher-portal'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-950/80 text-teal-200 hover:bg-teal-900 border border-teal-700/40'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Teacher Portal
          </button>

          <button
            onClick={() => setActiveTab('admin-portal')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
              activeTab === 'admin-portal' || activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-amber-950/80 text-amber-300 hover:bg-amber-900 border border-amber-600/40'
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin Portal
          </button>

          {currentRole !== 'guest' && (
            <button
              onClick={logout}
              className="px-2 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-700/40 ml-1 transition"
              title="Sign Out of Session"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Main App Container: Handles Responsive Web, Android Frame, or iOS Frame */}
      {isMobileFrame ? (
        <div className="py-6 px-2 flex justify-center w-full">
          {/* Mobile Simulator Frame */}
          <div
            className={`w-full max-w-sm rounded-[42px] border-[12px] bg-white shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 ${
              deviceMode === 'android'
                ? 'border-slate-800 shadow-slate-900/40'
                : 'border-slate-900 shadow-slate-950/60'
            }`}
            style={{ height: '840px' }}
          >
            {/* Status Bar */}
            <div className="bg-emerald-950 text-white text-[10px] px-6 py-1.5 flex justify-between items-center select-none shrink-0">
              <span className="font-mono font-bold">08:00 AM</span>
              {deviceMode === 'ios' ? (
                <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto -mt-1"></div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-slate-900 mx-auto"></div>
              )}
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3" />
                <BatteryMedium className="w-3 h-3" />
              </div>
            </div>

            {/* Simulated App Content with Independent Scroll */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              <Navbar />
              <main className="flex-1 bg-slate-50">{renderActiveView()}</main>
              <Footer />
            </div>

            {/* Mobile Bottom Home Bar */}
            <div className="bg-slate-950 py-1.5 flex justify-center shrink-0">
              <div
                className={`h-1 bg-slate-500 rounded-full ${
                  deviceMode === 'ios' ? 'w-32' : 'w-16'
                }`}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop / Responsive Web Experience */
        <div className="w-full flex-1 flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1">{renderActiveView()}</main>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <SchoolAppInner />
    </SchoolProvider>
  );
}
