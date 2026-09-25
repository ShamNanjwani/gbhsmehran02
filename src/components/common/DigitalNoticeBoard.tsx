import React, { useState, useMemo, useEffect } from 'react';
import {
  Megaphone,
  AlertTriangle,
  Bell,
  Pin,
  Calendar,
  Building2,
  Users,
  GraduationCap,
  Search,
  Filter,
  Printer,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Plus,
  Clock,
  FileText,
  X,
  Send,
  Eye,
  RefreshCw,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AnnouncementItem } from '../../types';
import { SchoolLogo } from './SchoolLogo';

export interface DigitalNoticeBoardProps {
  role?: 'student' | 'teacher' | 'admin' | 'guest';
  targetClass?: string;
  variant?: 'full' | 'compact' | 'widget';
  className?: string;
  title?: string;
  allowAdminPost?: boolean;
}

export const DigitalNoticeBoard: React.FC<DigitalNoticeBoardProps> = ({
  role = 'guest',
  targetClass,
  variant = 'full',
  className = '',
  title = 'Digital Notice Board',
  allowAdminPost = true,
}) => {
  const {
    settings,
    currentRole,
    addAnnouncement,
    isSyncing,
    showAlert,
  } = useSchool();

  const announcements = settings.announcements || [];

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'important'>('all');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  // Text to Speech
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal States
  const [selectedNoticeForCircular, setSelectedNoticeForCircular] = useState<AnnouncementItem | null>(null);
  const [showAdminPostModal, setShowAdminPostModal] = useState(false);

  // Admin Post Form States inside Notice Board
  const [postTitle, setPostTitle] = useState('');
  const [postMessage, setPostMessage] = useState('');
  const [postTag, setPostTag] = useState('Urgent');
  const [postPriority, setPostPriority] = useState<'urgent' | 'important' | 'normal'>('urgent');
  const [postAudience, setPostAudience] = useState<'all' | 'students' | 'teachers'>('all');
  const [postTargetClass, setPostTargetClass] = useState('All Classes');
  const [postPinned, setPostPinned] = useState(true);
  const [postIssuedBy, setPostIssuedBy] = useState('Office of the Headmaster, GBHS Mehrand');
  const [postSubmitting, setPostSubmitting] = useState(false);

  // Quick preset templates for admin
  const adminTemplates = [
    {
      title: 'Monsoon Heavy Rain Alert: Modified School Timings',
      tag: 'Weather',
      priority: 'urgent' as const,
      audience: 'all' as const,
      targetClass: 'All Classes',
      message: 'In compliance with District Disaster Management Authority (DDMA) Tharparkar weather warnings, school timings are flexible. Students and teachers facing travel difficulty in rural routes should exercise safety first.',
    },
    {
      title: 'Annual Board Examination 2026: Date Sheet Notification',
      tag: 'Exam',
      priority: 'urgent' as const,
      audience: 'students' as const,
      targetClass: 'Class 9th & 10th',
      message: 'BISE Mirpurkhas Matriculation Annual Examinations 2026 roll number slips and examination timetable are now officially active. All registered students must verify their CNIC/B-Form particulars.',
    },
    {
      title: 'Emergency Staff Meeting: Academic Progress & Biometrics',
      tag: 'Faculty',
      priority: 'urgent' as const,
      audience: 'teachers' as const,
      targetClass: 'All Classes',
      message: 'Mandatory faculty review meeting on Friday at 01:15 PM in the Headmaster Office. All JEST, PST, and HST teaching officers must attend with their lesson plans and attendance logs.',
    },
    {
      title: 'Sindh Public Holiday: Official School Closure Notice',
      tag: 'Holiday',
      priority: 'important' as const,
      audience: 'all' as const,
      targetClass: 'All Classes',
      message: 'As per notification from the School Education & Literacy Department (SELD) Government of Sindh, the institution will observe a public holiday tomorrow. Regular classes will resume the following working day.',
    },
    {
      title: 'Parent-Teacher Meeting (PTM) & Quarterly Evaluation',
      tag: 'Academic',
      priority: 'important' as const,
      audience: 'students' as const,
      targetClass: 'All Classes',
      message: 'Quarterly academic progress cards and daily teacher remarks review meeting will be held on Saturday. Parents and guardians are cordially invited to review student performance.',
    },
  ];

  const applyTemplate = (tpl: typeof adminTemplates[0]) => {
    setPostTitle(tpl.title);
    setPostMessage(tpl.message);
    setPostTag(tpl.tag);
    setPostPriority(tpl.priority);
    setPostAudience(tpl.audience);
    setPostTargetClass(tpl.targetClass);
    setPostPinned(tpl.priority === 'urgent');
  };

  // Filter announcements for the intended role & filters
  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((item) => {
        // Must be active
        if (item.isActive === false) return false;

        // Role filtering
        if (role === 'student') {
          const matches = !item.targetAudience || item.targetAudience === 'all' || item.targetAudience === 'students';
          if (!matches) return false;
          if (targetClass && item.targetClass && item.targetClass !== 'All Classes') {
            const cleanTarget = item.targetClass.toLowerCase();
            const cleanCurrent = targetClass.toLowerCase();
            if (!cleanCurrent.includes(cleanTarget.replace('class ', '')) && !cleanTarget.includes(cleanCurrent.replace('class ', ''))) {
              return false;
            }
          }
        } else if (role === 'teacher') {
          const matches = !item.targetAudience || item.targetAudience === 'all' || item.targetAudience === 'teachers';
          if (!matches) return false;
        }

        // Tag filter
        if (selectedTag !== 'all' && item.tag?.toLowerCase() !== selectedTag.toLowerCase()) {
          return false;
        }

        // Priority filter
        if (priorityFilter === 'urgent' && item.priority !== 'urgent') return false;
        if (priorityFilter === 'important' && item.priority !== 'important' && item.priority !== 'urgent') return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchMsg = item.message ? item.message.toLowerCase().includes(q) : false;
          const matchTag = item.tag ? item.tag.toLowerCase().includes(q) : false;
          const matchBy = item.issuedBy ? item.issuedBy.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchMsg && !matchTag && !matchBy) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned first, then urgent, then by date descending
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });
  }, [announcements, role, targetClass, selectedTag, priorityFilter, searchQuery]);

  // Urgent notices subset
  const urgentNotices = useMemo(() => {
    return filteredAnnouncements.filter((a) => a.priority === 'urgent');
  }, [filteredAnnouncements]);

  // Unique tags for filter pills
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    announcements.forEach((a) => {
      if (a.tag && a.isActive !== false) {
        set.add(a.tag);
      }
    });
    return Array.from(set);
  }, [announcements]);

  // Stop SpeechSynthesis when unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = (notice: AnnouncementItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text to speech is not supported in this browser environment.');
      return;
    }

    if (speakingId === notice.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${notice.title}. Issued by ${notice.issuedBy || 'Office of the Headmaster'}. ${notice.message || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(notice.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyNotice = (notice: AnnouncementItem) => {
    const text = `*OFFICIAL NOTICE - ${settings.schoolName}*\n\n📌 *${notice.title}*\n📅 Date: ${notice.date}\n🏛️ Issued by: ${notice.issuedBy || 'Headmaster Office'}\n\n${notice.message || ''}\n\nSEMIS Code: ${settings.semisCode}`;
    navigator.clipboard.writeText(text);
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

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
            border-bottom: 3px double #064e3b;
            padding-bottom: 14px;
            margin-bottom: 24px;
          }
          .crest {
            font-size: 13px;
            font-weight: bold;
            color: #064e3b;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .school {
            font-size: 20px;
            font-weight: bold;
            margin: 4px 0;
            color: #0f172a;
          }
          .meta {
            font-size: 11px;
            color: #475569;
          }
          .circular-title {
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            text-decoration: underline;
            margin: 20px 0 15px;
            text-transform: uppercase;
          }
          .subject-box {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 12px 16px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
          .subject-box strong {
            font-size: 14px;
          }
          .content {
            font-size: 13.5px;
            text-align: justify;
            white-space: pre-line;
            line-height: 1.7;
          }
          .signatures {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .sign-block {
            text-align: center;
            width: 220px;
            border-top: 1px solid #334155;
            padding-top: 6px;
            font-size: 11.5px;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            background: #fef3c7;
            color: #92400e;
            border: 1px solid #f59e0b;
            font-size: 10px;
            font-weight: bold;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="crest">Government of Sindh • School Education & Literacy Department</div>
          <div class="school">${settings.schoolName}</div>
          <div class="meta">SEMIS CODE: ${settings.semisCode} • TALUKA KALOI • DISTRICT THARPARKAR</div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 12px;">
          <div><strong>Dispatch No:</strong> GBHS-MHR/NOTIF/${notice.date?.replace(/-/g, '') || '2026'}/${Math.floor(1000 + Math.random() * 9000)}</div>
          <div><strong>Date of Issuance:</strong> ${notice.date || new Date().toLocaleDateString('en-GB')}</div>
        </div>

        <div class="circular-title">OFFICIAL SCHOOL CIRCULAR / NOTIFICATION</div>

        <div class="subject-box">
          <div style="margin-bottom: 4px;"><span class="badge">${notice.priority?.toUpperCase() || 'OFFICIAL'}</span> <strong>SUBJECT: ${notice.title}</strong></div>
          <div style="font-size: 11px; color: #64748b;">Target Recipient: ${notice.targetAudience === 'teachers' ? 'All Teaching Faculty' : notice.targetAudience === 'students' ? 'All Enrolled Students & Guardians' : 'All Students, Parents & Teaching Staff'} | ${notice.targetClass || 'All Classes'}</div>
        </div>

        <div class="content">
          ${notice.message || 'No additional instructions recorded.'}
        </div>

        <div class="signatures">
          <div class="sign-block">
            <strong>Head Clerk / Section Incharge</strong><br />
            GBHS Mehrand, Kaloi
          </div>
          <div class="sign-block">
            <strong>${settings.headmasterName || 'Headmaster'}</strong><br />
            GBHS Mehrand (Kaloi)<br />
            SELD Govt. of Sindh
          </div>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 400);
  };

  const handleAdminPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      alert('Please enter an announcement title.');
      return;
    }

    setPostSubmitting(true);
    try {
      const success = await addAnnouncement({
        title: postTitle.trim(),
        message: postMessage.trim(),
        tag: postTag.trim() || 'Urgent',
        priority: postPriority,
        targetAudience: postAudience,
        targetClass: postTargetClass,
        pinned: postPinned,
        isActive: true,
        issuedBy: postIssuedBy.trim() || 'Office of the Headmaster, GBHS Mehrand',
      });

      if (success) {
        showAlert(
          'Notice Published Successfully!',
          `"${postTitle}" has been posted to the Digital Notice Board and is now visible on student and teacher dashboards.`,
          'success'
        );
        // Reset
        setPostTitle('');
        setPostMessage('');
        setPostTag('Urgent');
        setPostPriority('urgent');
        setPostAudience('all');
        setShowAdminPostModal(false);
      }
    } finally {
      setPostSubmitting(false);
    }
  };

  const isUserAdmin = currentRole === 'admin';

  return (
    <div
      className={`bg-white rounded-3xl border-2 border-emerald-800/30 shadow-xl overflow-hidden transition-all ${className}`}
      id="digital-notice-board"
    >
      {/* NOTICE BOARD DIGITAL MARQUEE HEADER */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white p-5 sm:p-6 border-b-4 border-amber-400 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20 shrink-0">
              <Megaphone className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/90 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Live Digital Bulletin
                </span>
                <span className="text-[11px] font-mono text-amber-300 font-bold hidden sm:inline">
                  SEMIS: {settings.semisCode}
                </span>
                <span className="text-[11px] font-semibold text-slate-300">
                  Govt. Boys High School Mehrand
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                <span>{title}</span>
                <span className="text-xs font-normal text-amber-300 font-serif hidden lg:inline">
                  (سرڪاري نوٽيس بورڊ)
                </span>
              </h2>
            </div>
          </div>

          {/* Quick Header Actions: Post Notice Button & Status Stats */}
          <div className="flex flex-wrap items-center gap-2.5">
            {urgentNotices.length > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-red-600/90 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md border border-red-400/50 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <span>{urgentNotices.length} Urgent Alert{urgentNotices.length > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Admin Quick Post Trigger Button */}
            {allowAdminPost && (
              <button
                type="button"
                onClick={() => setShowAdminPostModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 transform hover:-translate-y-0.5"
                title="Post new urgent announcement or circular as administrator"
              >
                <Plus className="w-4 h-4" />
                <span>Post Urgent Notice</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Emergency Alert Ribbon (if urgent notices exist) */}
        {urgentNotices.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-red-950/90 via-red-900/90 to-rose-950/90 border border-red-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="p-1 rounded-lg bg-red-500 text-white shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <div>
                <span className="font-black text-red-200 uppercase tracking-wider text-[10px] block sm:inline sm:mr-2">
                  Emergency Broadcast:
                </span>
                <span className="font-extrabold text-white">
                  {urgentNotices[0].title}
                </span>
                {urgentNotices[0].message && (
                  <p className="text-[11px] text-red-100 line-clamp-1 mt-0.5 font-normal">
                    {urgentNotices[0].message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNoticeForCircular(urgentNotices[0])}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] shrink-0 self-start sm:self-auto transition shadow-xs"
            >
              View Urgent Circular →
            </button>
          </div>
        )}
      </div>

      {/* CONTROLS BAR: SEARCH, FILTERS & STATS */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements by subject, keyword, tag, or issuing office..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white text-xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setPriorityFilter('all');
                setSelectedTag('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                priorityFilter === 'all' && selectedTag === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All ({filteredAnnouncements.length})
            </button>

            <button
              type="button"
              onClick={() => setPriorityFilter(priorityFilter === 'urgent' ? 'all' : 'urgent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 ${
                priorityFilter === 'urgent'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Urgent Only</span>
            </button>

            {availableTags.slice(0, 4).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedTag === tag
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NOTICE CARDS FEED */}
      <div className="p-4 sm:p-6 space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
              <Megaphone className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-800">
              No Notices Match Your Selection
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedTag !== 'all' || priorityFilter !== 'all'
                ? 'Try resetting your search query or filters to display all official school circulars.'
                : 'There are currently no active announcements published on the notice board.'}
            </p>
            {(searchQuery || selectedTag !== 'all' || priorityFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('all');
                  setPriorityFilter('all');
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAnnouncements.map((notice) => {
              const isUrgent = notice.priority === 'urgent';
              const isImportant = notice.priority === 'important';
              const isExpanded = expandedNoticeId === notice.id;
              const isSpeaking = speakingId === notice.id;
              const isCopied = copiedId === notice.id;

              return (
                <div
                  key={notice.id}
                  className={`rounded-2xl p-5 border-2 transition-all shadow-xs relative ${
                    isUrgent
                      ? 'bg-gradient-to-r from-red-50/80 via-white to-rose-50/40 border-red-400 hover:border-red-500'
                      : isImportant
                      ? 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/30 border-amber-300 hover:border-amber-400'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Notice Badges Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Priority Tag */}
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          isUrgent
                            ? 'bg-red-600 text-white animate-pulse'
                            : isImportant
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isUrgent && <AlertTriangle className="w-3 h-3" />}
                        {notice.priority || 'Normal'}
                      </span>

                      {/* Category Tag */}
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {notice.tag || 'General'}
                      </span>

                      {/* Target Audience Pill */}
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        {notice.targetAudience === 'teachers' ? (
                          <>
                            <Users className="w-3 h-3 text-teal-700" />
                            <span>Faculty Directives</span>
                          </>
                        ) : notice.targetAudience === 'students' ? (
                          <>
                            <GraduationCap className="w-3 h-3 text-emerald-700" />
                            <span>Students & Parents</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3 h-3 text-slate-600" />
                            <span>Entire School</span>
                          </>
                        )}
                        {notice.targetClass && notice.targetClass !== 'All Classes' && (
                          <span className="font-bold">({notice.targetClass})</span>
                        )}
                      </span>

                      {/* Pinned Indicator */}
                      {notice.pinned && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-300">
                          <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    {/* Date of Notice */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{notice.date || 'Recent'}</span>
                    </div>
                  </div>

                  {/* Notice Title & Issuing Authority */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {notice.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>Issued by: <strong>{notice.issuedBy || 'Office of the Headmaster, GBHS Mehrand'}</strong></span>
                    </p>
                  </div>

                  {/* Body Text */}
                  {notice.message && (
                    <div className="mt-3 text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                      <p className={isExpanded ? '' : 'line-clamp-3'}>
                        {notice.message}
                      </p>
                      {notice.message.length > 200 && (
                        <button
                          type="button"
                          onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                          className="mt-2 text-emerald-800 hover:text-emerald-700 font-bold flex items-center gap-1 text-[11px]"
                        >
                          <span>{isExpanded ? 'Show Less' : 'Read Full Instructions'}</span>
                          <ChevronDown className={`w-3 h-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Read Full Official Circular */}
                      <button
                        type="button"
                        onClick={() => setSelectedNoticeForCircular(notice)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>Official Circular View</span>
                      </button>

                      {/* Print Circular */}
                      <button
                        type="button"
                        onClick={() => handlePrintCircular(notice)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 border border-slate-200 transition"
                        title="Print official paper notification with school stamp & signature"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>Print</span>
                      </button>

                      {/* Voice Announcement / TTS */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeech(notice)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition ${
                          isSpeaking
                            ? 'bg-amber-400 text-slate-950 border-amber-500 animate-pulse'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                        title="Listen to this announcement read out loud"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Audio Read</span>
                          </>
                        )}
                      </button>

                      {/* Copy Notice */}
                      <button
                        type="button"
                        onClick={() => handleCopyNotice(notice)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 border border-slate-200 transition"
                        title="Copy text of notice to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-extrabold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      ID: NOTIF-{notice.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: OFFICIAL CIRCULAR FULL-SCREEN MODAL */}
      {selectedNoticeForCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-800 space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedNoticeForCircular(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Letterhead Header */}
            <div className="text-center border-b-2 border-emerald-800/40 pb-4 space-y-1">
              <div className="flex justify-center mb-2">
                <SchoolLogo logoUrl={settings.logoUrl} size="md" />
              </div>
              <span className="text-xs font-black text-emerald-900 tracking-wider uppercase block">
                Government of Sindh • School Education & Literacy Department
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {settings.schoolName}
              </h3>
              <p className="text-xs font-mono text-amber-700 font-bold">
                SEMIS CODE: {settings.semisCode} • TALUKA KALOI • DISTRICT THARPARKAR
              </p>
            </div>

            {/* Notification Meta */}
            <div className="flex justify-between items-center text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>
                <strong>Circular Ref:</strong> GBHS-MHR/NOTIF/{selectedNoticeForCircular.date?.replace(/-/g, '') || '2026'}/{selectedNoticeForCircular.id.slice(0, 4).toUpperCase()}
              </div>
              <div>
                <strong>Issue Date:</strong> {selectedNoticeForCircular.date || 'Recent'}
              </div>
            </div>

            {/* Title & Subject */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase ${
                    selectedNoticeForCircular.priority === 'urgent'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-400 text-slate-950 font-bold'
                  }`}
                >
                  {selectedNoticeForCircular.priority?.toUpperCase() || 'OFFICIAL'}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Target: {selectedNoticeForCircular.targetAudience === 'teachers' ? 'Faculty Staff' : selectedNoticeForCircular.targetAudience === 'students' ? 'Students & Parents' : 'Entire Institution'}
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {selectedNoticeForCircular.title}
              </h4>
            </div>

            {/* Circular Detailed Text */}
            <div className="text-sm text-slate-800 leading-relaxed space-y-3 font-serif whitespace-pre-line p-4 rounded-xl bg-slate-50 border border-slate-200">
              {selectedNoticeForCircular.message || 'No additional circular text provided.'}
            </div>

            {/* Authority Signoff */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Issuing Authority:</span>
                <p className="font-extrabold text-slate-800">{selectedNoticeForCircular.issuedBy || 'Office of the Headmaster'}</p>
                <p className="text-[11px] text-emerald-800">Govt. Boys High School Mehrand</p>
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-900 text-xs">Headmaster Official Seal</div>
                <div className="text-[10px] text-slate-400">Authenticated via Portal</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handlePrintCircular(selectedNoticeForCircular)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Print Official Circular</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedNoticeForCircular(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIN QUICK POST ANNOUNCEMENT MODAL */}
      {showAdminPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-500 space-y-5 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowAdminPostModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Post Announcement to Digital Notice Board
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcasts instantly to student and teacher dashboard homepages
                </p>
              </div>
            </div>

            {/* Quick Template Fill Buttons */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Quick Urgent Templates (Click to Auto-Fill):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {adminTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-semibold border border-slate-200 transition"
                  >
                    {tpl.tag}: {tpl.title.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAdminPostSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Announcement Headline / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Monsoon Heavy Rainfall Emergency: Adjusted Timings"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold text-slate-900 text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Instructions / Circular Body *
                </label>
                <textarea
                  rows={4}
                  required
                  value={postMessage}
                  onChange={(e) => setPostMessage(e.target.value)}
                  placeholder="Enter full guidelines, affected dates, procedures, or instructions for students, teachers, and parents..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs leading-relaxed text-slate-800"
                />
              </div>

              {/* Priority, Audience & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alert Priority *
                  </label>
                  <select
                    value={postPriority}
                    onChange={(e) => setPostPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                  >
                    <option value="urgent">🚨 Urgent (Flashing Emergency)</option>
                    <option value="important">⚠️ Important (Amber Highlight)</option>
                    <option value="normal">📢 Normal (Routine Circular)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Audience *
                  </label>
                  <select
                    value={postAudience}
                    onChange={(e) => setPostAudience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold"
                  >
                    <option value="all">👥 All (Whole School)</option>
                    <option value="students">🎓 Students & Parents</option>
                    <option value="teachers">👨‍🏫 Teaching Faculty</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTag}
                    onChange={(e) => setPostTag(e.target.value)}
                    placeholder="e.g. Urgent, Exam, Weather"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Class & Authority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Specific Class (Optional)
                  </label>
                  <select
                    value={postTargetClass}
                    onChange={(e) => setPostTargetClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="All Classes">All Classes (Entire School)</option>
                    <option value="Class 6th">Class 6th</option>
                    <option value="Class 7th">Class 7th</option>
                    <option value="Class 8th">Class 8th</option>
                    <option value="Class 9th">Class 9th</option>
                    <option value="Class 10th">Class 10th</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={postIssuedBy}
                    onChange={(e) => setPostIssuedBy(e.target.value)}
                    placeholder="e.g. Office of the Headmaster"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Pin Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="post-pinned-check"
                  checked={postPinned}
                  onChange={(e) => setPostPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300"
                />
                <label htmlFor="post-pinned-check" className="font-bold text-slate-700 cursor-pointer">
                  Pin to top of the Digital Notice Board
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPostModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postSubmitting || isSyncing}
                  className={`px-5 py-2.5 rounded-xl font-black text-white shadow-md transition flex items-center gap-2 disabled:opacity-50 ${
                    postPriority === 'urgent'
                      ? 'bg-red-600 hover:bg-red-500'
                      : 'bg-emerald-800 hover:bg-emerald-700'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {postSubmitting
                      ? 'Publishing...'
                      : postPriority === 'urgent'
                      ? 'Broadcast Urgent Notice Now'
                      : 'Post to Notice Board'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
