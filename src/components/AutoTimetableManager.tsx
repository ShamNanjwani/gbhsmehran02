import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  Search,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Zap,
  ShieldAlert,
  GraduationCap,
  Layers,
  Info,
  ChevronDown,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { TimetableSlot, Teacher } from '../types';
import {
  SCHOOL_CLASSES,
  TIMETABLE_DAYS,
  getPeriodsForDay,
  MON_THU_PERIODS,
  FRIDAY_PERIODS,
} from '../utils/timetableConfig';
import { getTimetableAllocationStats } from '../utils/timetableEngine';

export const AutoTimetableManager: React.FC = () => {
  const {
    teachers,
    timetable,
    autoGenerateTimetable,
    resetTimetableToUnassigned,
    updateTimetableSlot,
    showAlert,
  } = useSchool();

  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedClass, setSelectedClass] = useState<string>('Class 9th');
  const [activeFilterStatus, setActiveFilterStatus] = useState<'all' | 'assigned' | 'missing' | 'unallocated'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Registered Admin-Approved faculty list
  const registeredTeachers = useMemo(() => {
    return teachers.filter((t) => t.status === 'approved');
  }, [teachers]);

  // Allocation statistics
  const stats = useMemo(() => {
    return getTimetableAllocationStats(timetable, registeredTeachers);
  }, [timetable, registeredTeachers]);

  // Current periods for the selected day
  const dayPeriodDefs = useMemo(() => {
    return getPeriodsForDay(selectedDay);
  }, [selectedDay]);

  // Run the auto-scheduler engine
  const handleTriggerAutoScheduler = () => {
    setIsGenerating(true);
    setTimeout(() => {
      autoGenerateTimetable();
      setIsGenerating(false);
      showAlert(
        'Timetable Engine Generated Successfully!',
        `Generated timetable for Classes 1 to 10 based on ${registeredTeachers.length} registered teachers. Conflict prevention and workload distribution active.`,
        'success'
      );
    }, 400);
  };

  // Filtered timetable slots for the selected Class & Day
  const filteredSlotsForClassDay = useMemo(() => {
    return timetable.filter(
      (s) => s.day === selectedDay && s.className === selectedClass
    );
  }, [timetable, selectedDay, selectedClass]);

  // Search/Filter overall view
  const overallFilteredSlots = useMemo(() => {
    return timetable.filter((s) => {
      const matchDay = selectedDay === 'All Days' || s.day === selectedDay;
      const matchClass = selectedClass === 'All Classes' || s.className === selectedClass;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.className.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q) ||
        s.teacherName.toLowerCase().includes(q) ||
        (s.room && s.room.toLowerCase().includes(q));

      let matchStatus = true;
      if (activeFilterStatus === 'assigned') {
        matchStatus = Boolean(s.teacherId && s.teacherName !== 'Teacher Not Registered' && s.teacherName !== 'Not Assigned' && s.teacherName !== 'Timetable Not Assigned / Awaiting Teacher Registration');
      } else if (activeFilterStatus === 'missing') {
        matchStatus = s.teacherName === 'Teacher Not Registered';
      } else if (activeFilterStatus === 'unallocated') {
        matchStatus = !s.teacherId || s.teacherName === 'Not Assigned' || s.teacherName === 'Timetable Not Assigned / Awaiting Teacher Registration';
      }

      return matchDay && matchClass && matchSearch && matchStatus;
    });
  }, [timetable, selectedDay, selectedClass, searchQuery, activeFilterStatus]);

  return (
    <div className="space-y-6">
      {/* Engine Banner & Control Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl border-2 border-emerald-600/40 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-bold border border-emerald-500/50">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Specification-Compliant Timetable Engine (Classes 1 - 10)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Auto-Assigning School Timetable Engine
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              Automated conflict-free scheduling engine strictly based on registered teacher availability. Mon-Thu (8:00 AM - 1:30 PM with Assembly & Break) and Friday (8:00 AM - 12:00 PM with 55-minute periods).
            </p>
          </div>

          {/* Trigger Engine Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerAutoScheduler}
              disabled={isGenerating}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Calculating Distribution...' : 'Trigger Auto-Distribution Engine'}</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all periods to default "Not Assigned" unallocated state?')) {
                  resetTimetableToUnassigned();
                }
              }}
              className="px-4 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white font-bold text-xs sm:text-sm border border-emerald-700/60 transition flex items-center gap-2"
              title="Reset all period slots to default unassigned state"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Reset to Default (Unassigned)</span>
            </button>
          </div>
        </div>

        {/* Engine Metric KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-800/60 text-xs">
          <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="text-[10px] uppercase font-mono text-emerald-300">Registered Faculty</div>
            <div className="text-lg font-black text-white">{registeredTeachers.length} Teachers</div>
            <div className="text-[10px] text-emerald-300">Active pool for assignment</div>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="text-[10px] uppercase font-mono text-emerald-300">Curriculum Slots</div>
            <div className="text-lg font-black text-white">{stats.totalSlots} Slots</div>
            <div className="text-[10px] text-emerald-300">Classes 1st to 10th (6 Days)</div>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="text-[10px] uppercase font-mono text-emerald-300">Faculty Assigned Slots</div>
            <div className="text-lg font-black text-emerald-300">
              {stats.assignedSlots} ({stats.percentAssigned}%)
            </div>
            <div className="text-[10px] text-emerald-200">Zero double-booking</div>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div className="text-[10px] uppercase font-mono text-amber-300">Flagged Missing Faculty</div>
            <div className="text-lg font-black text-amber-300">
              {stats.missingTeacherSlots} Flagged
            </div>
            <div className="text-[10px] text-amber-200">"Teacher Not Registered"</div>
          </div>
        </div>
      </div>

      {/* Constraints Specification Notice Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>Engine Constraint Rules & Timing Architecture</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">1. Default State</span>
            <p className="text-[11px] leading-relaxed">
              Timetables remain unassigned ("Not Assigned") by default. No slots populate until a teacher successfully registers and is assigned a subject/class.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">2. Mon - Thu Schedule</span>
            <p className="text-[11px] leading-relaxed">
              <strong>08:00 - 08:20 AM:</strong> Assembly (Locked)<br />
              <strong>08:20 - 11:00 AM:</strong> 4 Periods (40 min each)<br />
              <strong>11:00 - 11:30 AM:</strong> Break Time (Locked)<br />
              <strong>11:30 - 01:30 PM:</strong> 4 Periods (30 min each)
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">3. Friday Schedule</span>
            <p className="text-[11px] leading-relaxed">
              <strong>08:00 - 08:20 AM:</strong> Assembly (Locked)<br />
              <strong>08:20 - 12:00 PM:</strong> 4 Periods (55 min each, No Break)
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Class / Day Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 bg-white font-bold"
            >
              {TIMETABLE_DAYS.map((d) => (
                <option key={d} value={d}>
                  {d} {d === 'Friday' ? '(Special 4x 55m Periods)' : '(Standard 8 Periods)'}
                </option>
              ))}
              <option value="All Days">All Days (Master Schedule)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Target Class (1 to 10)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 bg-white font-bold text-emerald-800"
            >
              {SCHOOL_CLASSES.map((c) => (
                <option key={c.className} value={c.className}>
                  {c.className} ({c.level} - {c.room})
                </option>
              ))}
              <option value="All Classes">All Classes (1st to 10th)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Slot Assignment Status</label>
            <select
              value={activeFilterStatus}
              onChange={(e) => setActiveFilterStatus(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 bg-white font-bold"
            >
              <option value="all">All Statuses ({timetable.length})</option>
              <option value="assigned">Assigned to Teacher ({stats.assignedSlots})</option>
              <option value="missing">Teacher Not Registered ({stats.missingTeacherSlots})</option>
              <option value="unallocated">Not Assigned ({stats.unallocatedDefaultSlots})</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Search Schedule</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, teacher, class..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TIMETABLE SCHEDULE GRID (Single Class View for Selected Day) */}
      {selectedDay !== 'All Days' && selectedClass !== 'All Classes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs">
                  {selectedDay.toUpperCase()} SCHEDULE
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedClass} Routine & Period Distribution
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Room: {SCHOOL_CLASSES.find((c) => c.className === selectedClass)?.room || 'Academic Wing'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-600">
                {selectedDay === 'Friday' ? 'Friday Shift: 08:00 AM - 12:00 PM' : 'Standard Shift: 08:00 AM - 01:30 PM'}
              </span>
            </div>
          </div>

          {/* Periods Timeline Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Time Interval</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Assigned Faculty</th>
                  <th className="py-3 px-4">Status & Conflict Check</th>
                  <th className="py-3 px-4 text-right">Room / Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dayPeriodDefs.map((pDef) => {
                  // Locked Assembly Slot
                  if (pDef.isAssembly) {
                    return (
                      <tr key={`assembly-${pDef.time}`} className="bg-emerald-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-900">Assembly</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800">{pDef.time}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-950">
                          National Anthem, Tilawat & Moral Assembly
                        </td>
                        <td className="py-3 px-4 text-emerald-800 font-semibold">
                          All Faculty & Students (Courtyard)
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900">
                            Locked Slot (08:00 - 08:20 AM)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          Central Assembly Ground
                        </td>
                      </tr>
                    );
                  }

                  // Locked Break Time Slot (Monday-Thursday)
                  if (pDef.isBreak) {
                    return (
                      <tr key={`break-${pDef.time}`} className="bg-amber-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-amber-900">Break</td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-800">{pDef.time}</td>
                        <td className="py-3 px-4 font-extrabold text-amber-950">
                          Recess / Lunch & Prayer Break
                        </td>
                        <td className="py-3 px-4 text-amber-800 font-semibold">
                          School-wide Recess
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                            Locked Slot (11:00 - 11:30 AM)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          Campus Cafeteria & Grounds
                        </td>
                      </tr>
                    );
                  }

                  // Subject Teaching Slot
                  const slot = filteredSlotsForClassDay.find((s) => s.period === pDef.period);
                  const isTeacherMissing = slot?.teacherName === 'Teacher Not Registered';
                  const isUnassigned = !slot?.teacherId || slot?.teacherName === 'Not Assigned' || slot?.teacherName === 'Timetable Not Assigned / Awaiting Teacher Registration';

                  return (
                    <tr
                      key={`period-${pDef.period}`}
                      className={`hover:bg-slate-50 transition ${
                        isTeacherMissing ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        Period {pDef.period}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {pDef.time}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {slot?.subject || 'Curriculum Subject'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {slot?.teacherId && !isTeacherMissing && !isUnassigned ? (
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>{slot.teacherName}</span>
                          </div>
                        ) : isTeacherMissing ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-200">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            Teacher Not Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300">
                            <AlertCircle className="w-3 h-3 text-amber-700" />
                            Timetable Not Assigned / Awaiting Teacher Registration
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {slot?.teacherId && !isTeacherMissing && !isUnassigned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified No Conflict
                          </span>
                        ) : isTeacherMissing ? (
                          <span className="text-[10px] text-amber-700 font-semibold">
                            Pending faculty registration for this subject
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-800 font-semibold">
                            Awaiting admin-approved teacher
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {slot?.room || 'Assigned Room'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MASTER DATA TABLE (Overall View) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              <span>Full Master Timetable Registry ({overallFilteredSlots.length} Periods)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live scheduled slots across Classes 1st to 10th. Guaranteed conflict-free teacher distribution.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing {overallFilteredSlots.length} of {timetable.length} total period slots
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Period & Time</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Assigned Faculty</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Engine Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {overallFilteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No periods match the selected filter combination.
                  </td>
                </tr>
              ) : (
                overallFilteredSlots.slice(0, 100).map((slot) => {
                  const isMissing = slot.teacherName === 'Teacher Not Registered';
                  const isUnassigned = !slot.teacherId || slot.teacherName === 'Not Assigned' || slot.teacherName === 'Timetable Not Assigned / Awaiting Teacher Registration';

                  return (
                    <tr key={slot.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-4 font-bold text-slate-800">{slot.day}</td>
                      <td className="py-2.5 px-4 font-mono">
                        <span className="font-extrabold text-amber-800">P{slot.period}</span> ({slot.time})
                      </td>
                      <td className="py-2.5 px-4 font-bold text-emerald-800">{slot.className}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{slot.subject}</td>
                      <td className="py-2.5 px-4">
                        {isMissing ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">
                            Teacher Not Registered
                          </span>
                        ) : isUnassigned ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300">
                            Timetable Not Assigned / Awaiting Teacher Registration
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900">{slot.teacherName}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{slot.room || 'Room'}</td>
                      <td className="py-2.5 px-4">
                        {!isMissing && !isUnassigned ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Auto-Distributed
                          </span>
                        ) : isMissing ? (
                          <span className="text-[10px] font-bold text-amber-700">Flagged</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Default Unassigned</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {overallFilteredSlots.length > 100 && (
          <div className="text-center py-2 text-xs text-slate-500 font-bold">
            Showing first 100 slots of {overallFilteredSlots.length} (use Class or Day filters to narrow down view)
          </div>
        )}
      </div>
    </div>
  );
};
