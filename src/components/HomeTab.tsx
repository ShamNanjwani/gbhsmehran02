import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { SchoolLogo } from './common/SchoolLogo';
import { SafeMediaImage } from './common/SafeMediaImage';
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowRight,
  Shield,
  UserCheck,
  Building,
  Laptop,
  Flame,
  FileText,
  Star,
  Quote,
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { settings, leaderMessages, setActiveTab } = useSchool();

  const minister = leaderMessages.find((m) => m.id === 'minister');
  const secretary = leaderMessages.find((m) => m.id === 'secretary');
  const headmaster = leaderMessages.find((m) => m.id === 'headmaster');

  const stats = [
    { label: 'SEMIS Code', value: settings.semisCode, icon: Shield, note: 'School Education Dept' },
    { label: 'Enrolled Students', value: '450+', icon: GraduationCap, note: 'Classes 1st to 10th' },
    { label: 'Teaching Faculty', value: '18', icon: Users, note: 'HST, JEST, PST Officers' },
    { label: 'Matric Pass Rate', value: '96.8%', icon: Award, note: 'BISE Mirpurkhas Board' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Background watermark badge */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-white" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-5 max-w-3xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Government of Sindh School Education & Literacy Department</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                {settings.schoolName}
              </h1>

              <p className="text-amber-400 font-mono text-sm sm:text-base font-bold tracking-wide">
                SEMIS CODE: 406020752 • TALUKA KALOI • DISTRICT THARPARKAR @ MITHI
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Empowering the boys of rural Tharparkar with contemporary scientific knowledge, digital competence, and moral leadership. Complete computerized school administration portal for students, teachers, and administration.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('admission')}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  Apply Online Admission 2026
                </button>

                <button
                  onClick={() => setActiveTab('student-portal')}
                  className="px-5 py-3 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-sm border border-emerald-600/50 shadow transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-300" />
                  Student Portal & Cards
                </button>

                <button
                  onClick={() => setActiveTab('teacher-portal')}
                  className="px-5 py-3 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-bold text-sm border border-teal-600/50 shadow transition flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-teal-300" />
                  Teacher Timetable & Remarks
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 font-bold text-sm border border-amber-500/40 shadow transition flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Login
                </button>
              </div>
            </div>

            {/* School Emblem & Quick Card */}
            <div className="w-full sm:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4 shadow-2xl">
              <div className="flex justify-center">
                <SchoolLogo logoUrl={settings.logoUrl} size="xl" className="shadow-xl" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">GBHS MEHRAND</h3>
                <p className="text-xs text-amber-300 font-medium">Kaloi, Tharparkar (Sindh)</p>
              </div>
              <div className="bg-emerald-950/80 rounded-xl p-3 text-left space-y-1.5 text-xs border border-emerald-800/50 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>SEMIS ID:</span>
                  <span className="font-bold text-amber-300">{settings.semisCode}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Session:</span>
                  <span className="font-bold text-white">2026-2027</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-400">Govt. High School</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-200/80 italic">
                "Seek knowledge from the cradle to the grave"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metric Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-md flex items-center gap-4 hover:border-emerald-500 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Icon className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700">{stat.label}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{stat.note}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Announcements Marquee & Notice Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded font-black tracking-wider">
              LATEST NOTICES
            </span>
          </div>
          <div className="flex-1 flex flex-wrap items-center gap-3 text-xs text-slate-700">
            {settings.announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-amber-200/60 shadow-xs">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                  {ann.tag}
                </span>
                <span className="font-semibold text-slate-800">{ann.title}</span>
                <span className="text-[10px] text-slate-400">({ann.date})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIRED CORE SECTION: 3 KEY LEADERSHIP MESSAGES */}
      {/* 1. Minister Message, 2. Secretary Message, 3. Headmaster Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Leadership & Vision
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Official Dignitary Messages
          </h2>
          <p className="text-sm text-slate-600">
            Guiding principles and vision for Government Boys High School Mehrand from Sindh Education leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Minister Message */}
          {minister && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col hover:border-emerald-600 transition-all">
              <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                    SINDH GOVERNMENT
                  </span>
                  <h3 className="text-base font-extrabold">{minister.title}</h3>
                </div>
                <Quote className="w-8 h-8 text-amber-400/40" />
              </div>

              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-700 shadow-md shrink-0 bg-slate-100">
                    <SafeMediaImage
                      src={minister.pictureUrl}
                      alt={minister.name}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {minister.name}
                    </h4>
                    <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                      {minister.designation}
                    </p>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      Govt. of Sindh
                    </span>
                  </div>
                </div>

                <div className="relative pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed italic border-t border-slate-100 flex-1">
                  "{minister.message}"
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between font-medium">
                  <span>School Education & Literacy Dept</span>
                  <span className="text-emerald-700 font-bold">Sindh Secretariat</span>
                </div>
              </div>
            </div>
          )}

          {/* Secretary Message */}
          {secretary && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col hover:border-emerald-600 transition-all">
              <div className="bg-gradient-to-r from-teal-900 to-emerald-900 p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">
                    ADMINISTRATIVE HEAD
                  </span>
                  <h3 className="text-base font-extrabold">{secretary.title}</h3>
                </div>
                <Quote className="w-8 h-8 text-teal-400/40" />
              </div>

              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-teal-700 shadow-md shrink-0 bg-slate-100">
                    <SafeMediaImage
                      src={secretary.pictureUrl}
                      alt={secretary.name}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {secretary.name}
                    </h4>
                    <p className="text-xs text-teal-800 font-semibold mt-0.5">
                      {secretary.designation}
                    </p>
                    <span className="inline-block mt-1 text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                      Policy & Administration
                    </span>
                  </div>
                </div>

                <div className="relative pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed italic border-t border-slate-100 flex-1">
                  "{secretary.message}"
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between font-medium">
                  <span>SELD Government of Sindh</span>
                  <span className="text-teal-700 font-bold">Karachi</span>
                </div>
              </div>
            </div>
          )}

          {/* Headmaster Message */}
          {headmaster && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col hover:border-emerald-600 transition-all">
              <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    INSTITUTIONAL LEADERSHIP
                  </span>
                  <h3 className="text-base font-extrabold">{headmaster.title}</h3>
                </div>
                <Quote className="w-8 h-8 text-amber-400/40" />
              </div>

              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md shrink-0 bg-slate-100">
                    <SafeMediaImage
                      src={headmaster.pictureUrl}
                      alt={headmaster.name}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {headmaster.name}
                    </h4>
                    <p className="text-xs text-amber-900 font-semibold mt-0.5">
                      {headmaster.designation}
                    </p>
                    <span className="inline-block mt-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      GBHS Mehrand
                    </span>
                  </div>
                </div>

                <div className="relative pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed italic border-t border-slate-100 flex-1">
                  "{headmaster.message}"
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between font-medium">
                  <span>Taluka Kaloi, District Tharparkar</span>
                  <span className="text-amber-700 font-bold">Station Mehrand</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Highlights & Campus Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-extrabold text-slate-900">
              Campus Facilities & Educational Pillars
            </h3>
            <p className="text-xs text-slate-500">
              Ensuring rural students receive world-class education right at Village Mehrand, Taluka Kaloi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Laptop className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Digital IT & Computer Lab</h4>
                <p className="text-xs text-slate-600">
                  Equipped with modern computer workstations, high-speed solar connectivity, and programming fundamentals guided by JEST faculty.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-teal-700" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Science & Chemistry Laboratory</h4>
                <p className="text-xs text-slate-600">
                  Fully operational apparatus for Physics experiments, chemical demonstrations, and Biology specimens for matriculation board preparation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Solar Electrification & Clean Water</h4>
                <p className="text-xs text-slate-600">
                  Uninterrupted 24/7 solar power backup for fans, lights, and water filtration facilities to beat the Thar desert climate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Services CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-emerald-600/40">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight text-white">
              Ready to Enroll Your Child for 2026?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Apply online in minutes. Submit student details, B-form copy, and track admission status in real-time. Once approved, download the official Enrollment Card and Student ID Card.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('admission')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition"
            >
              Start Admission Form
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition"
            >
              Contact School
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
