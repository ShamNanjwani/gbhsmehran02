import React, { useState, useEffect, useMemo } from 'react';
import {
  Megaphone,
  AlertTriangle,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  Calendar,
  Building2,
  CheckCircle2,
  Printer,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  Pin,
  FileText,
  Volume2,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AnnouncementItem } from '../../types';
import { SchoolLogo } from './SchoolLogo';

interface AnnouncementBannerProps {
  role?: 'student' | 'teacher' | 'admin' | 'guest';
  targetClass?: string;
  variant?: 'full' | 'compact';
  showControls?: boolean;
  className?: string;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  role = 'guest',
  targetClass,
  variant = 'full',
  showControls = true,
  className = '',
}) => {
  const { settings } = useSchool();
  const announcements = settings.announcements || [];

  // Filter announcements for current audience
  const relevantAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      // Must be active
      if (item.isActive === false) return false;

      // Filter by role
      if (role === 'student') {
        const matchesRole = !item.targetAudience || item.targetAudience === 'all' || item.targetAudience === 'students';
        if (!matchesRole) return false;
        if (targetClass && item.targetClass && item.targetClass !== 'All Classes') {
          const cleanTarget = item.targetClass.toLowerCase();
          const cleanStudentClass = targetClass.toLowerCase();
          if (!cleanStudentClass.includes(cleanTarget.replace('class ', '')) && !cleanTarget.includes(cleanStudentClass.replace('class ', ''))) {
            return false;
          }
        }
        return true;
      }

      if (role === 'teacher') {
        return !item.targetAudience || item.targetAudience === 'all' || item.targetAudience === 'teachers';
      }

      if (role === 'admin') {
        return true; // Admin views all
      }

      // Guest / general visitors
      return !item.targetAudience || item.targetAudience === 'all';
    }).sort((a, b) => {
      // Pinned first, then urgent, then important, then date
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
      return 0;
    });
  }, [announcements, role, targetClass]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState<AnnouncementItem | null>(null);
  const [showAllNoticesModal, setShowAllNoticesModal] = useState(false);

  // If new announcement arrives, reset index
  useEffect(() => {
    if (currentIndex >= relevantAnnouncements.length) {
      setCurrentIndex(0);
    }
  }, [relevantAnnouncements.length, currentIndex]);

  // Check if any urgent announcement exists
  const hasUrgent = useMemo(() => {
    return relevantAnnouncements.some((a) => a.priority === 'urgent');
  }, [relevantAnnouncements]);

  // Auto cycle announcements every 7 seconds if not paused
  useEffect(() => {
    if (relevantAnnouncements.length <= 1 || isPaused || isMinimized) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % relevantAnnouncements.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [relevantAnnouncements.length, isPaused, isMinimized]);

  if (relevantAnnouncements.length === 0) {
    return null;
  }

  const currentNotice = relevantAnnouncements[currentIndex] || relevantAnnouncements[0];
  const isCurrentUrgent = currentNotice.priority === 'urgent';
  const isCurrentImportant = currentNotice.priority === 'important';

  // Format print copy of official circular
  const handlePrintCircular = (notice: AnnouncementItem) => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Notification - ${notice.title}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #111827;
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #064e3b;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .crest-text {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: bold;
            color: #065f46;
          }
          .school-title {
            font-size: 20px;
            font-weight: 900;
            color: #064e3b;
            margin: 5px 0;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 25px;
            border-bottom: 1px dashed #cbd5e1;
            padding-bottom: 10px;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            background: #fef3c7;
            color: #92400e;
            font-weight: bold;
            font-size: 11px;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 15px;
          }
          .body {
            font-size: 14px;
            text-align: justify;
            white-space: pre-line;
            margin-bottom: 40px;
          }
          .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature-box {
            text-align: center;
            min-width: 220px;
          }
          .signature-line {
            border-top: 1px solid #111827;
            margin-top: 40px;
            padding-top: 5px;
            font-weight: bold;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="crest-text">School Education & Literacy Department • Government of Sindh</div>
          <div class="school-title">${settings.schoolName || 'GOVERNMENT BOYS HIGH SCHOOL MEHRAND'}</div>
          <div style="font-size: 12px; color: #475569;">
            SEMIS Code: ${settings.semisCode || '406020752'} • Taluka Kaloi, District Tharparkar
          </div>
        </div>

        <div class="meta-row">
          <div>Ref No: <strong>GBHS-MHR/NOTIF-${notice.id.toUpperCase()}</strong></div>
          <div>Date: <strong>${notice.date}</strong></div>
        </div>

        <div style="margin-bottom: 10px;">
          <span class="badge">${notice.priority || 'Normal'} Priority</span> &nbsp;
          <span class="badge" style="background:#e0f2fe; color:#0369a1;">Audience: ${notice.targetAudience?.toUpperCase() || 'ALL'}</span>
        </div>

        <h3 class="title">SUBJECT: ${notice.title.toUpperCase()}</h3>

        <div class="body">
          ${notice.message || notice.title}
        </div>

        <div style="font-size: 12px; color: #64748b; margin-top: 20px;">
          <strong>Issued By:</strong> ${notice.issuedBy || 'Office of the Headmaster, GBHS Mehrand'}<br />
          <strong>System Generated Document:</strong> Verified via Sindh School Portal SEMIS 406020752.
        </div>

        <div class="footer">
          <div style="font-size: 11px; color: #64748b;">
            Copy forwarded for information to:<br />
            1. District Education Officer (DEO) Tharparkar<br />
            2. Taluka Education Officer (TEO) Kaloi<br />
            3. School Notice Board & Digital Portal<br />
            4. Office Record File
          </div>
          <div class="signature-box">
            <div style="font-size: 13px; font-weight: bold; color: #064e3b;">(MASTER TANU MAL)</div>
            <div class="signature-line">
              Headmaster / Drawing & Disbursing Officer<br />
              Govt Boys High School Mehrand
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  // If minimized, display a sleek floating chip bar
  if (isMinimized) {
    return (
      <div
        className={`w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl px-4 py-2.5 shadow-md border ${
          hasUrgent ? 'border-red-500/80 ring-2 ring-red-500/20' : 'border-slate-700'
        } flex items-center justify-between gap-3 text-xs transition-all ${className}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              hasUrgent
                ? 'bg-red-600 text-white animate-pulse shadow-xs shadow-red-500/50'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {hasUrgent ? <AlertTriangle className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
          </div>

          <span className="font-bold text-amber-400 shrink-0">
            {hasUrgent ? 'Urgent Alert:' : 'Notice:'}
          </span>

          <span className="truncate font-medium text-slate-200">
            {currentNotice.title}
          </span>

          <span className="hidden sm:inline-block text-[10px] bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded font-mono shrink-0">
            {currentIndex + 1}/{relevantAnnouncements.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSelectedNoticeForModal(currentNotice)}
            className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] shadow-xs transition"
          >
            Read Notice
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
            title="Expand Full Announcement Banner"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Full Banner Mode
  return (
    <div
      className={`relative w-full rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 ${
        isCurrentUrgent
          ? 'bg-gradient-to-r from-red-950 via-rose-950 to-amber-950 border-red-500/80 ring-2 ring-red-500/30 text-white'
          : isCurrentImportant
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-amber-400/60 ring-1 ring-amber-400/20 text-white'
          : 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/40 text-white'
      } ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Urgent Flash Accent Bar */}
      {isCurrentUrgent && (
        <div className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white text-[11px] font-black uppercase tracking-widest px-4 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>🚨 FLASH BROADCAST • URGENT SCHOOL ADVISORY</span>
          </div>
          <span className="text-[10px] text-red-100 font-mono hidden sm:inline">
            SEMIS 406020752 • Kaloi Belt
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Icon & Content */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Badge Icon */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              isCurrentUrgent
                ? 'bg-gradient-to-br from-red-500 to-rose-700 text-white ring-2 ring-red-400/50 animate-bounce duration-1000'
                : isCurrentImportant
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 ring-2 ring-amber-300/40'
                : 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white ring-2 ring-emerald-400/30'
            }`}
          >
            {isCurrentUrgent ? (
              <AlertTriangle className="w-6 h-6" />
            ) : isCurrentImportant ? (
              <Megaphone className="w-6 h-6" />
            ) : (
              <Bell className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Priority Badge */}
              <span
                className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                  isCurrentUrgent
                    ? 'bg-red-500 text-white shadow-xs'
                    : isCurrentImportant
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {currentNotice.priority ? currentNotice.priority.toUpperCase() : 'NOTICE'}
              </span>

              {/* Tag / Category */}
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-bold border border-white/15">
                {currentNotice.tag || 'General'}
              </span>

              {/* Pinned Marker */}
              {currentNotice.pinned && (
                <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                  <Pin className="w-2.5 h-2.5 fill-amber-300" />
                  Pinned
                </span>
              )}

              {/* Target Audience Badge */}
              <span className="text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full font-mono">
                For: {currentNotice.targetAudience === 'teachers' ? 'Faculty & Staff' : currentNotice.targetAudience === 'students' ? 'Students & Parents' : 'All School Members'}
              </span>

              {/* Date */}
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {currentNotice.date}
              </span>
            </div>

            {/* Announcement Title */}
            <h4
              onClick={() => setSelectedNoticeForModal(currentNotice)}
              className="text-base sm:text-lg font-black tracking-tight text-white hover:text-amber-300 cursor-pointer transition line-clamp-2 md:line-clamp-1"
            >
              {currentNotice.title}
            </h4>

            {/* Snippet message */}
            {currentNotice.message && (
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-4xl">
                {currentNotice.message}
              </p>
            )}

            {/* Issuing Authority footer */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
              <span className="text-amber-300/90 font-medium">
                Authority: {currentNotice.issuedBy || 'Office of the Headmaster, GBHS Mehrand'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Actions & Carousel Navigation */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedNoticeForModal(currentNotice)}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs shadow-md transition flex items-center gap-1.5 transform hover:-translate-y-0.5 ${
                isCurrentUrgent
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  : 'bg-white hover:bg-slate-100 text-slate-950'
              }`}
            >
              <span>Full Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowAllNoticesModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 hidden sm:flex items-center gap-1"
              title="View all school notices and archives"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>All ({relevantAnnouncements.length})</span>
            </button>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              title="Minimize announcement banner"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Carousel Navigation (if multiple notices) */}
          {relevantAnnouncements.length > 1 && showControls && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-black/30 px-2.5 py-1 rounded-full border border-white/10">
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? relevantAnnouncements.length - 1 : prev - 1
                  )
                }
                className="p-0.5 hover:text-amber-300 transition"
                title="Previous Notice"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-[11px] font-bold text-amber-300">
                {currentIndex + 1}/{relevantAnnouncements.length}
              </span>

              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    (prev + 1) % relevantAnnouncements.length
                  )
                }
                className="p-0.5 hover:text-amber-300 transition"
                title="Next Notice"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots Indicator if multiple */}
      {relevantAnnouncements.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-2">
          {relevantAnnouncements.map((item, idx) => (
            <button
              key={item.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-amber-400'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              title={item.title}
            />
          ))}
        </div>
      )}

      {/* MODAL 1: Official Notice View Modal */}
      {selectedNoticeForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div
              className={`p-6 text-white flex items-center justify-between ${
                selectedNoticeForModal.priority === 'urgent'
                  ? 'bg-gradient-to-r from-red-900 via-red-800 to-rose-950'
                  : selectedNoticeForModal.priority === 'important'
                  ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900'
                  : 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <SchoolLogo size="sm" showBorder={false} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                    Government of Sindh • School Education Department
                  </div>
                  <h3 className="text-lg font-black leading-tight">
                    Official Notice & School Notification
                  </h3>
                  <div className="text-xs text-slate-200 font-mono">
                    SEMIS: {settings.semisCode || '406020752'} • GBHS Mehrand
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedNoticeForModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
              {/* Reference & Date Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold">Circular Dispatch:</span>{' '}
                  <strong className="font-mono text-slate-900">
                    GBHS-MHR/NOTIF-{selectedNoticeForModal.id.toUpperCase()}
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Date of Issuance:</span>{' '}
                  <strong className="text-slate-900">{selectedNoticeForModal.date}</strong>
                </div>
              </div>

              {/* Priority & Tag Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    selectedNoticeForModal.priority === 'urgent'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : selectedNoticeForModal.priority === 'important'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {selectedNoticeForModal.priority || 'Normal'} Priority
                </span>

                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  Category: {selectedNoticeForModal.tag || 'General Announcement'}
                </span>

                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  Target: {selectedNoticeForModal.targetAudience === 'teachers' ? 'Faculty & Staff' : selectedNoticeForModal.targetAudience === 'students' ? 'Students & Guardians' : 'Whole School Community'}
                </span>
              </div>

              {/* Notice Title */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Subject</span>
                <h4 className="text-xl font-black text-slate-900 leading-snug">
                  {selectedNoticeForModal.title}
                </h4>
              </div>

              {/* Notice Detailed Content */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-slate-800 leading-relaxed text-sm space-y-3">
                <p className="whitespace-pre-line font-medium">
                  {selectedNoticeForModal.message || 'Please follow regular school schedules and consult the administration office for any urgent queries.'}
                </p>
              </div>

              {/* Issuing Office Footnote */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900">Issuing Authority:</span>
                  <p>{selectedNoticeForModal.issuedBy || 'Office of the Headmaster, GBHS Mehrand'}</p>
                  <p className="text-[11px] text-slate-400">Taluka Kaloi, District Tharparkar, Sindh</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                    SELD Verified Circular
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handlePrintCircular(selectedNoticeForModal)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Print Official Circular</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedNoticeForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: All Notices Directory Modal */}
      {showAllNoticesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">School Announcements & Circulars</h3>
                  <p className="text-xs text-teal-200">
                    Active notifications issued by Administration & Headmaster Office
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllNoticesModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
              {relevantAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-3 rounded-xl transition"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          ann.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : ann.priority === 'important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ann.priority || 'Normal'}
                      </span>
                      <span className="text-slate-500 font-bold text-[11px]">{ann.tag}</span>
                      <span className="text-slate-400 text-[11px]">• {ann.date}</span>
                    </div>

                    <h5 className="font-extrabold text-slate-900 text-sm">{ann.title}</h5>
                    {ann.message && (
                      <p className="text-xs text-slate-600 line-clamp-1">{ann.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setShowAllNoticesModal(false);
                        setSelectedNoticeForModal(ann);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      View Notice
                    </button>
                    <button
                      onClick={() => handlePrintCircular(ann)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                      title="Print Circular"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowAllNoticesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
