import React, { useState } from 'react';
import {
  Megaphone,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  Edit2,
  Pin,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Calendar,
  Building2,
  Users,
  GraduationCap,
  Bell,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { AnnouncementItem } from '../types';
import { AnnouncementBanner } from './common/AnnouncementBanner';

export const AdminAnnouncementManager: React.FC = () => {
  const {
    settings,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementPin,
    toggleAnnouncementActive,
    broadcastUrgentAlert,
    isSyncing,
  } = useSchool();

  const announcements = settings.announcements || [];

  // Compose State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [tag, setTag] = useState('Urgent');
  const [priority, setPriority] = useState<'urgent' | 'important' | 'normal'>('urgent');
  const [targetAudience, setTargetAudience] = useState<'all' | 'students' | 'teachers'>('all');
  const [targetClass, setTargetClass] = useState('All Classes');
  const [pinned, setPinned] = useState(true);
  const [issuedBy, setIssuedBy] = useState('Office of the Headmaster, GBHS Mehrand');

  // Edit State
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);

  // Live Preview Mode
  const [previewRole, setPreviewRole] = useState<'student' | 'teacher'>('student');
  const [showPreview, setShowPreview] = useState(true);

  // Quick Templates
  const templates = [
    {
      title: 'Monsoon Heavy Rain Alert: Modified School Timings',
      tag: 'Urgent',
      priority: 'urgent' as const,
      targetAudience: 'all' as const,
      targetClass: 'All Classes',
      message: 'In compliance with District Disaster Management Authority (DDMA) Tharparkar weather warnings, school timings are flexible. Students and teachers facing travel difficulty in rural routes should exercise safety first.',
    },
    {
      title: 'Admissions Open 2026-2027: Submit B-Form & Leaving Certificate',
      tag: 'Admission',
      priority: 'important' as const,
      targetAudience: 'students' as const,
      targetClass: 'All Classes',
      message: 'Fresh enrollment applications for Classes 1st to 10th are active in the portal. Parents are requested to upload verified documents for instant computerized enrollment and ID cards.',
    },
    {
      title: 'Mandatory Faculty Meeting on Academic Progress & Biometrics',
      tag: 'Faculty',
      priority: 'important' as const,
      targetAudience: 'teachers' as const,
      targetClass: 'All Classes',
      message: 'All teaching faculty members (JEST, PST, HST) must attend the staff meeting in the Headmaster Office on Friday at 01:00 PM regarding syllabus review and daily attendance portal entries.',
    },
    {
      title: 'Annual Science Fair & IT Exhibition Registrations',
      tag: 'Academic',
      priority: 'normal' as const,
      targetAudience: 'all' as const,
      targetClass: 'All Classes',
      message: 'Students of Classes 8th, 9th, and 10th are encouraged to register their scientific projects, physics working models, and software prototypes with Ghanshamdas JEST in the Computer Lab.',
    },
  ];

  const applyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setMessage(tpl.message);
    setTag(tpl.tag);
    setPriority(tpl.priority);
    setTargetAudience(tpl.targetAudience);
    setTargetClass(tpl.targetClass);
    setPinned(tpl.priority === 'urgent');
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide an announcement title.');
      return;
    }

    if (editingItem) {
      await updateAnnouncement(editingItem.id, {
        title,
        message,
        tag,
        priority,
        targetAudience,
        targetClass,
        pinned,
        issuedBy,
      });
      setEditingItem(null);
    } else {
      await addAnnouncement({
        title,
        message,
        tag,
        priority,
        targetAudience,
        targetClass,
        pinned,
        isActive: true,
        issuedBy,
      });
    }

    // Reset Form
    setTitle('');
    setMessage('');
    setTag('Urgent');
    setPriority('urgent');
    setTargetAudience('all');
    setPinned(true);
  };

  const startEdit = (item: AnnouncementItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setMessage(item.message || '');
    setTag(item.tag || 'Urgent');
    setPriority(item.priority || 'urgent');
    setTargetAudience(item.targetAudience || 'all');
    setTargetClass(item.targetClass || 'All Classes');
    setPinned(item.pinned || false);
    setIssuedBy(item.issuedBy || 'Office of the Headmaster, GBHS Mehrand');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setTitle('');
    setMessage('');
    setTag('Urgent');
    setPriority('urgent');
    setTargetAudience('all');
    setPinned(true);
  };

  const urgentCount = announcements.filter((a) => a.priority === 'urgent' && a.isActive !== false).length;
  const activeCount = announcements.filter((a) => a.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Top Title & Quick Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                School-Wide Announcements & Urgent Broadcasts
              </h3>
              <p className="text-xs text-slate-500">
                Publish instant circulars and emergency flash updates to all Student and Teacher dashboards.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{urgentCount} Flash Urgent</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{activeCount} Active Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Switcher & Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Live Banner Preview (Interactive)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Preview as:</span>
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setPreviewRole('student')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  previewRole === 'student'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student View
              </button>
              <button
                type="button"
                onClick={() => setPreviewRole('teacher')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  previewRole === 'teacher'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Teacher View
              </button>
            </div>
          </div>
        </div>

        {/* The Live Banner Component in Preview */}
        <div className="pt-1">
          <AnnouncementBanner role={previewRole} targetClass="Class 9th" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Compose / Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              {editingItem ? (
                <>
                  <Edit2 className="w-5 h-5 text-amber-600" />
                  <h4 className="text-base font-extrabold text-slate-900">
                    Edit Announcement / Circular
                  </h4>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-extrabold text-slate-900">
                    Create & Broadcast Announcement
                  </h4>
                </>
              )}
            </div>

            {editingItem && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* Preset Templates Shortcut */}
          {!editingItem && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Quick Preset Templates (Click to fill)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {templates.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-semibold border border-slate-200 transition"
                  >
                    {tpl.tag}: {tpl.title.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Announcement Headline / Subject *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Monsoon Heavy Rainfall Alert: Adjusted School Timings"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900 text-sm"
              />
            </div>

            {/* Detailed Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Circular Body / Instructions *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide complete official instructions, emergency guidelines, dates, or action points for students and faculty..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs leading-relaxed text-slate-800"
              />
            </div>

            {/* Grid Configuration Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alert Priority *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-xs"
                >
                  <option value="urgent">🚨 Urgent (Flashing Red Banner)</option>
                  <option value="important">⚠️ Important (Warm Amber Notice)</option>
                  <option value="normal">📢 Normal (Emerald Routine News)</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Audience *
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-xs"
                >
                  <option value="all">👥 All (Students & Teachers)</option>
                  <option value="students">🎓 Students & Parents Only</option>
                  <option value="teachers">👨‍🏫 Teaching Faculty Only</option>
                </select>
              </div>

              {/* Category Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Tag *
                </label>
                <input
                  type="text"
                  required
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Urgent, Exam, Holiday, Weather"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Target Class & Issuing Authority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class Filter (Optional)
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                >
                  <option value="All Classes">All Classes (Whole School)</option>
                  <option value="Class 6th">Class 6th</option>
                  <option value="Class 7th">Class 7th</option>
                  <option value="Class 8th">Class 8th</option>
                  <option value="Class 9th">Class 9th</option>
                  <option value="Class 10th">Class 10th</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issuing Office / Authority
                </label>
                <input
                  type="text"
                  value={issuedBy}
                  onChange={(e) => setIssuedBy(e.target.value)}
                  placeholder="e.g. Office of the Headmaster, GBHS Mehrand"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Pinned Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinned-announcement"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <label htmlFor="pinned-announcement" className="text-xs font-bold text-slate-700 cursor-pointer">
                Pin to top of banner rotation (featured priority)
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSyncing}
                className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition flex items-center justify-center gap-2 ${
                  priority === 'urgent'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {editingItem
                    ? 'Save & Update Announcement Across Dashboards'
                    : priority === 'urgent'
                    ? 'Broadcast Urgent Flash Alert to All Dashboards Now'
                    : 'Publish Announcement to School Portals'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (1 Col): Operational Guidelines & Quick Tips */}
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Official Protocol Instructions</span>
            </div>

            <ul className="text-xs text-amber-950/80 space-y-2 list-disc pl-4 leading-relaxed font-medium">
              <li>
                <strong>Urgent Priority:</strong> Triggers emergency pulsing banners in crimson red across all active teacher and student views.
              </li>
              <li>
                <strong>Immediate Sync:</strong> Any posted announcement automatically synchronizes to the website server and appears live for students and teachers.
              </li>
              <li>
                <strong>Official Format:</strong> Students and teachers can print the circular directly with Government of Sindh header, SEMIS 406020752, and Headmaster signature.
              </li>
              <li>
                <strong>Role Filtering:</strong> Announcements tagged for <em>Teachers Only</em> will never clutter the student interface.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h5 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Target Audience Breakdown
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">All (Whole School)</span>
                <span className="font-mono font-bold text-slate-900">
                  {announcements.filter((a) => !a.targetAudience || a.targetAudience === 'all').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Students Only</span>
                <span className="font-mono font-bold text-slate-900">
                  {announcements.filter((a) => a.targetAudience === 'students').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Faculty Only</span>
                <span className="font-mono font-bold text-slate-900">
                  {announcements.filter((a) => a.targetAudience === 'teachers').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Roster / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base font-extrabold text-slate-900">
              Manage Active & Archived Notices ({announcements.length})
            </h4>
            <p className="text-xs text-slate-500">
              Toggle visibility, pin notices to top, edit contents, or remove expired circulars.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                ann.isActive === false ? 'opacity-60 bg-slate-50/50 -mx-4 px-4 rounded-xl' : ''
              }`}
            >
              {/* Left Details */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      ann.priority === 'urgent'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : ann.priority === 'important'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {ann.priority || 'Normal'}
                  </span>

                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {ann.tag}
                  </span>

                  {ann.pinned && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                      <Pin className="w-2.5 h-2.5 fill-amber-700" />
                      Pinned
                    </span>
                  )}

                  <span className="text-[10px] text-slate-500 font-mono">
                    Target: {ann.targetAudience?.toUpperCase() || 'ALL'}
                  </span>

                  <span className="text-xs text-slate-400">• {ann.date}</span>
                </div>

                <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {ann.title}
                </h5>

                {ann.message && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed max-w-3xl">
                    {ann.message}
                  </p>
                )}

                <div className="text-[11px] text-slate-400">
                  Authority: {ann.issuedBy || 'Office of the Headmaster'}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Active Toggle */}
                <button
                  type="button"
                  onClick={() => toggleAnnouncementActive(ann.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                    ann.isActive !== false
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                  title={ann.isActive !== false ? 'Notice is visible' : 'Notice is hidden'}
                >
                  {ann.isActive !== false ? 'Active' : 'Hidden'}
                </button>

                {/* Pin Toggle */}
                <button
                  type="button"
                  onClick={() => toggleAnnouncementPin(ann.id)}
                  className={`p-2 rounded-lg border transition ${
                    ann.pinned
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title={ann.pinned ? 'Unpin Notice' : 'Pin Notice to Top'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => startEdit(ann)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-300 transition"
                  title="Edit Notice"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${ann.title}"?`)) {
                      deleteAnnouncement(ann.id);
                    }
                  }}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                  title="Delete Notice"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No announcements published yet. Use the form above to compose school circulars.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
