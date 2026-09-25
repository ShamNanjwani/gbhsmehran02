import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SchoolLogo } from './common/SchoolLogo';
import {
  GraduationCap,
  Users,
  UserCheck,
  Shield,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Smartphone,
  Monitor,
  Apple,
  LogIn,
  LogOut,
  Sparkles,
  BookOpen,
  Database,
  Calendar,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    currentUser,
    activeTab,
    setActiveTab,
    deviceMode,
    setDeviceMode,
    settings,
    logout,
  } = useSchool();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs = [
    { id: 'home', label: 'HOME', icon: BookOpen },
    { id: 'seld-database', label: 'SE&LD DATABASE', icon: Database },
    { id: 'timetable', label: 'TIMETABLE', icon: Calendar },
    { id: 'faculty', label: 'FACULTY', icon: Users },
    { id: 'admission', label: 'ADMISSION', icon: GraduationCap },
    { id: 'about', label: 'ABOUT US', icon: Sparkles },
    { id: 'contact', label: 'CONTACT US', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-900/10 shadow-sm">
      {/* Top Govt of Sindh Notice Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-3 sm:px-6 hidden sm:flex justify-between items-center border-b border-emerald-800/40">
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            School Education & Literacy Department, Govt. of Sindh
          </span>
        </div>
        <div className="flex items-center space-x-3 text-emerald-200 text-xs">
          <span className="text-amber-300 font-semibold">Official Institutional Portal</span>
        </div>
      </div>

      {/* Main Brand & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <SchoolLogo
              logoUrl={settings.logoUrl}
              size="lg"
              className="group-hover:scale-105 transition-transform shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-300/80 shadow-xs tracking-wide">
                  Est. {settings.establishedYear || '1995'}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Govt. of Sindh
                </span>
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-emerald-800 transition-colors">
                {settings.schoolName}
              </h1>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Portal Switchers & Device Mode */}
          <div className="hidden md:flex items-center gap-2">
            {/* Device Mode Switcher (Web / Android / iOS) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs mr-2">
              <button
                onClick={() => setDeviceMode('web')}
                title="Desktop Web Mode"
                className={`p-1.5 rounded flex items-center gap-1 ${
                  deviceMode === 'web' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Web</span>
              </button>
              <button
                onClick={() => setDeviceMode('android')}
                title="Simulate Android App"
                className={`p-1.5 rounded flex items-center gap-1 ${
                  deviceMode === 'android' ? 'bg-emerald-800 shadow text-white font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setDeviceMode('ios')}
                title="Simulate iOS App"
                className={`p-1.5 rounded flex items-center gap-1 ${
                  deviceMode === 'ios' ? 'bg-slate-900 shadow text-white font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iOS</span>
              </button>
            </div>

            {/* Portal Action Buttons */}
            {currentRole === 'guest' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('student-portal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                    activeTab === 'student-portal'
                      ? 'bg-blue-700 text-white border-blue-800'
                      : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student Portal
                </button>
                <button
                  onClick={() => setActiveTab('teacher-portal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                    activeTab === 'teacher-portal'
                      ? 'bg-teal-700 text-white border-teal-800'
                      : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Teacher Portal
                </button>
                <button
                  onClick={() => setActiveTab('admin-portal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                    activeTab === 'admin-portal' || activeTab === 'admin'
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  Admin Portal
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                    {currentUser?.name}
                    <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded uppercase">
                      {currentRole}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-700">{currentUser?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setActiveTab('admin-portal')}
              className="px-2.5 py-1 text-xs bg-amber-600 text-white rounded font-bold flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 py-2 border-b border-slate-100">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm font-semibold ${
                    activeTab === tab.id ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Portals in Mobile */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab('student-portal');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-2.5 rounded-lg bg-blue-50 text-blue-900 font-bold text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                Student Portal & Admission
              </span>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">Login / Register</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('teacher-portal');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-2.5 rounded-lg bg-teal-50 text-teal-900 font-bold text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-700" />
                Teacher Portal & Timetable
              </span>
              <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded">Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin-portal');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-2.5 rounded-lg bg-amber-500 text-white font-bold text-sm flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Portal
              </span>
              <span className="text-xs bg-amber-700 px-2 py-0.5 rounded">Control Center</span>
            </button>
          </div>

          {/* Mobile device simulator toggles */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>App Mode:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setDeviceMode('web')}
                className={`px-2 py-1 rounded ${deviceMode === 'web' ? 'bg-emerald-800 text-white' : 'bg-slate-100'}`}
              >
                Web
              </button>
              <button
                onClick={() => setDeviceMode('android')}
                className={`px-2 py-1 rounded ${deviceMode === 'android' ? 'bg-emerald-800 text-white' : 'bg-slate-100'}`}
              >
                Android
              </button>
              <button
                onClick={() => setDeviceMode('ios')}
                className={`px-2 py-1 rounded ${deviceMode === 'ios' ? 'bg-emerald-800 text-white' : 'bg-slate-100'}`}
              >
                iOS
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
