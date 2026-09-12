import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  ExternalLink,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActiveTab, currentRole } = useSchool();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-emerald-700">
      {/* Upper Footer: School Info, Quick links, Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-800 p-2 text-white flex items-center justify-center border border-amber-400">
                <GraduationCap className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-sm tracking-wide">
                  GBHS MEHRAND
                </h3>
                <p className="text-amber-400 text-xs font-mono font-bold">
                  SEMIS: {settings.semisCode}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Government Boys High School Mehrand, providing secondary education in science and general groups to empower the desert youth of Taluka Kaloi and District Tharparkar.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded text-emerald-300 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registered under Govt. of Sindh</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              School Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('student-portal')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-500">›</span> Student Portal & Admission
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('teacher-portal')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-500">›</span> Teacher Portal & Daily Timetable
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-amber-400 font-semibold"
                >
                  <span className="text-amber-400">›</span> Admin Portal Control Panel
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('faculty')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-500">›</span> Faculty & Teaching Staff
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admission')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-500">›</span> Online Admission Criteria
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              School Address
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-300 font-mono">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-300 font-mono">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Designer Credit Card with Admin Picture Upload */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Lead Developer Credit
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={settings.designerPictureUrl}
                  alt={settings.designerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow"
                />
                <div>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wide">
                    Designed By
                  </p>
                  <p className="text-sm font-extrabold text-white">
                    {settings.designerName}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {settings.designerTitle}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                <span>Government High School Mehrand</span>
                {currentRole === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-amber-400 hover:underline text-[10px] font-semibold"
                  >
                    Change Picture
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Exact Copyright & Rights Claimed */}
      <div className="bg-slate-900 border-t border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              ® All rights reserved © Copyrights 2026
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-amber-400 font-medium">
              Government Boys High School Mehrand 406020752
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Designed By <strong className="text-slate-200">{settings.designerName}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">Education & Literacy Department Sindh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
