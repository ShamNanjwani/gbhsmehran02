import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { SafeMediaImage } from './common/SafeMediaImage';
import {
  GraduationCap,
  Target,
  Compass,
  Award,
  BookOpen,
  Users,
  Shield,
  Building,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const AboutUsTab: React.FC = () => {
  const { settings, leaderMessages, setActiveTab } = useSchool();
  const headmasterMsg = leaderMessages.find((m) => m.id === 'headmaster');
  const activeHeadmasterName = settings.headmasterName || headmasterMsg?.name || 'Headmaster';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          School Education & Literacy Department Sindh
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About Government Boys High School Mehrand
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
          SEMIS Code: <strong className="font-mono text-emerald-900">{settings.semisCode}</strong> • Located in Village Mehrand, Taluka Kaloi, District Tharparkar @ Mithi, Sindh.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-amber-300">Our Mission</h2>
          <p className="text-sm text-emerald-100 leading-relaxed">
            {settings.mission}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Equal education access for rural Tharparkar
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {settings.vision}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Nurturing leaders in STEM and humanity
          </div>
        </div>
      </div>

      {/* History & Background Section */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <Building className="w-6 h-6 text-emerald-800" />
          <h3 className="text-xl font-extrabold text-slate-900">
            Institutional Legacy & Facilities
          </h3>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {settings.aboutHistory}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h4 className="font-extrabold text-slate-900 text-sm">Science & IT Lab</h4>
            <p className="text-xs text-slate-500">Fully equipped high school physics, chemistry, biology and computer labs.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <Users className="w-5 h-5 text-teal-700" />
            <h4 className="font-extrabold text-slate-900 text-sm">Qualified JEST & HST Faculty</h4>
            <p className="text-xs text-slate-500">Government gazetted subject specialists and educators dedicated to student progress.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <Shield className="w-5 h-5 text-amber-600" />
            <h4 className="font-extrabold text-slate-900 text-sm">Online Digital Portal</h4>
            <p className="text-xs text-slate-500">Modern real-time portal for admissions, ID cards, result sheets, and remarks.</p>
          </div>
        </div>
      </div>

      {/* Institutional Leadership & Headmaster Administration Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-emerald-800/20 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <ShieldCheck className="w-6 h-6 text-emerald-800" />
          <h3 className="text-xl font-extrabold text-slate-900">
            Institutional Leadership & Governance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Headmaster & Incharge Principal
            </span>
            <h4 className="text-2xl font-black text-slate-900">
              {activeHeadmasterName}
            </h4>
            <p className="text-xs font-semibold text-amber-900">
              Head of Institution • Government Boys High School Mehrand
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {headmasterMsg?.message ||
                'Dedicated to student-centric education, faculty excellence, scientific exploration, and moral growth under School Education & Literacy Department, Govt. of Sindh.'}
            </p>
          </div>

          <div className="bg-emerald-950 text-white border border-emerald-800/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2.5 shadow-md">
            <span className="text-[10px] font-extrabold uppercase text-amber-300 tracking-wider">
              Institutional Authority
            </span>
            <div className="bg-emerald-900/80 p-3 rounded-xl border border-emerald-700/50 w-full text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>SELD Govt. of Sindh</span>
              </div>
              <div className="text-[11px] text-emerald-200 font-mono">
                Taluka Kaloi • SEMIS {settings.semisCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-black">Want to join GBHS Mehrand?</h3>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          Admissions are open for academic session 2026-2027. Register online today through our digital student admission portal.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveTab('admission')}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition"
          >
            Apply for Admission Now
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-600 transition"
          >
            Meet Our Faculty
          </button>
        </div>
      </div>
    </div>
  );
};
