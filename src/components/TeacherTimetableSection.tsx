import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  Users,
  Search,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Filter,
  MapPin,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Plus,
  Edit,
  RotateCcw,
  Info
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Teacher, TimetableSlot } from '../types';
import { SchoolLogo } from './common/SchoolLogo';

interface TeacherTimetableSectionProps {
  currentTeacher: Teacher;
}

const DAYS_OF_WEEK: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const PERIOD_TIMES = [
  { period: 1, time: '08:00 - 08:45 AM' },
  { period: 2, time: '08:45 - 09:30 AM' },
  { period: 3, time: '09:30 - 10:15 AM' },
  { period: 0, time: '10:15 - 10:30 AM', isBreak: true },
  { period: 4, time: '10:30 - 11:15 AM' },
  { period: 5, time: '11:15 - 12:00 PM' },
  { period: 6, time: '12:00 - 12:45 PM' },
];

export const TeacherTimetableSection: React.FC<TeacherTimetableSectionProps> = ({ currentTeacher }) => {
  const { timetable, teachers, settings, updateTimetableSlot, assignProxyTeacher, clearProxySubstitution } = useSchool();

  // Active sub-tab inside timetable section
  const [activeView, setActiveView] = useState<'my-routine' | 'class-wise' | 'faculty-matrix' | 'proxy-manager'>('my-routine');

  // Real-world weekday
  const currentDayName = useMemo(() => {
    const dayIndex = new Date().getDay();
    const map = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = map[dayIndex];
    return d === 'Sunday' ? 'Monday' : (d as typeof DAYS_OF_WEEK[number]);
  }, []);

  // Filter states
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedClassForMaster, setSelectedClassForMaster] = useState<string>('Class 9th');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Modal / form states for slot update & proxy assignment
  const [proxySlotId, setProxySlotId] = useState<string>('');
  const [proxyColleagueId, setProxyColleagueId] = useState<string>('');
  const [proxyReason, setProxyReason] = useState<string>('Attending official SELD training session');
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [editRoom, setEditRoom] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Slots assigned to this logged-in teacher
  const mySlots = useMemo(() => {
    return timetable.filter(
      (slot) =>
        slot.teacherId === currentTeacher.id ||
        slot.teacherName.toLowerCase().trim() === currentTeacher.name.toLowerCase().trim()
    );
  }, [timetable, currentTeacher]);

  // Slots where this teacher is assigned as a proxy / substitute
  const myProxyCoverages = useMemo(() => {
    return timetable.filter(
      (slot) => slot.isSubstituted && slot.substitutedTeacherId === currentTeacher.id
    );
  }, [timetable, currentTeacher]);

  // Slots where this teacher has substituted someone else
  const mySlotsSubstitutedOut = useMemo(() => {
    return mySlots.filter((slot) => slot.isSubstituted);
  }, [mySlots]);

  // Unique classes taught by this teacher
  const myClassesTaught = useMemo(() => {
    const set = new Set<string>();
    mySlots.forEach((s) => set.add(s.className));
    return Array.from(set);
  }, [mySlots]);

  // Unique subjects taught by this teacher
  const mySubjectsTaught = useMemo(() => {
    const set = new Set<string>();
    mySlots.forEach((s) => set.add(s.subject));
    return Array.from(set);
  }, [mySlots]);

  // Available classes in the school
  const allClassNames = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach((s) => set.add(s.className));
    ['Class 6th', 'Class 7th', 'Class 8th', 'Class 9th', 'Class 10th'].forEach((c) => set.add(c));
    return Array.from(set).sort();
  }, [timetable]);

  // Class-wise master slots for selected class
  const classMasterSlots = useMemo(() => {
    return timetable.filter(
      (s) => s.className.toLowerCase().trim() === selectedClassForMaster.toLowerCase().trim()
    );
  }, [timetable, selectedClassForMaster]);

  // Subject allocations for selected class in class-wise view
  const classSubjectAllocations = useMemo(() => {
    const map = new Map<string, {
      subject: string;
      periodsPerWeek: number;
      teacherName: string;
      room?: string;
    }>();

    classMasterSlots.forEach((slot) => {
      const existing = map.get(slot.subject);
      if (existing) {
        existing.periodsPerWeek += 1;
        if (!existing.room && slot.room) existing.room = slot.room;
      } else {
        map.set(slot.subject, {
          subject: slot.subject,
          periodsPerWeek: 1,
          teacherName: slot.teacherName,
          room: slot.room,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.periodsPerWeek - a.periodsPerWeek);
  }, [classMasterSlots]);

  // Faculty workload distribution for all teachers
  const facultyWorkload = useMemo(() => {
    return teachers
      .filter((t) => t.status === 'approved')
      .map((t) => {
        const slots = timetable.filter(
          (s) => s.teacherId === t.id || s.teacherName.toLowerCase() === t.name.toLowerCase()
        );
        const classes = new Set<string>();
        const subjects = new Set<string>();
        slots.forEach((s) => {
          classes.add(s.className);
          subjects.add(s.subject);
        });

        return {
          teacher: t,
          totalPeriods: slots.length,
          classes: Array.from(classes),
          subjects: Array.from(subjects),
          slots,
        };
      })
      .sort((a, b) => b.totalPeriods - a.totalPeriods);
  }, [teachers, timetable]);

  // Handle Assign Proxy Submit
  const handleAssignProxySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proxySlotId || !proxyColleagueId) {
      alert('Please select both a timetable slot and a colleague teacher.');
      return;
    }
    assignProxyTeacher(proxySlotId, proxyColleagueId, proxyReason);
    setProxySlotId('');
    setProxyColleagueId('');
  };

  // Handle Save Slot Edit
  const handleSaveSlotEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    updateTimetableSlot({
      ...editingSlot,
      room: editRoom,
      notes: editNotes,
    });
    setEditingSlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Faculty Teaching Timetable
              </span>
              <span className="text-xs text-teal-200 font-mono">
                PID: {currentTeacher.pid}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-300" />
              Dynamic Teaching Schedule & Workload Management
            </h2>
            <p className="text-xs text-teal-100 max-w-2xl">
              Manage your assigned periods, monitor class schedules across grades 6th to 10th, coordinate proxy substitutions, and export official teaching routine slips.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Routine Slip
            </button>
          </div>
        </div>

        {/* Workload KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-teal-800/60 text-xs">
          <div className="bg-teal-900/50 p-2.5 rounded-xl border border-teal-700/40">
            <span className="text-teal-300 text-[10px] uppercase font-bold block">Assigned Workload</span>
            <span className="text-base font-black text-white">{mySlots.length} Periods / Week</span>
          </div>
          <div className="bg-teal-900/50 p-2.5 rounded-xl border border-teal-700/40">
            <span className="text-teal-300 text-[10px] uppercase font-bold block">Teaching Hours</span>
            <span className="text-base font-black text-amber-300">
              {((mySlots.length * 45) / 60).toFixed(1)} Hours / Week
            </span>
          </div>
          <div className="bg-teal-900/50 p-2.5 rounded-xl border border-teal-700/40">
            <span className="text-teal-300 text-[10px] uppercase font-bold block">Classes Handled</span>
            <span className="text-base font-black text-white">{myClassesTaught.join(', ') || 'None'}</span>
          </div>
          <div className="bg-teal-900/50 p-2.5 rounded-xl border border-teal-700/40">
            <span className="text-teal-300 text-[10px] uppercase font-bold block">Today ({currentDayName})</span>
            <span className="text-base font-black text-teal-200">
              {mySlots.filter((s) => s.day === currentDayName).length} Periods Today
            </span>
          </div>
        </div>
      </div>

      {/* Proxy / Substitution Alert Banner */}
      {(myProxyCoverages.length > 0 || mySlotsSubstitutedOut.length > 0) && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Class Proxy / Substitution Activity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {myProxyCoverages.map((slot) => (
              <div key={slot.id} className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-start justify-between">
                <div>
                  <span className="font-extrabold text-slate-900">
                    Covering {slot.className} - {slot.subject}
                  </span>
                  <p className="text-slate-600">
                    {slot.day} • Period {slot.period} ({slot.time})
                  </p>
                  <p className="text-amber-800 font-bold text-[11px]">
                    Covering for {slot.teacherName} ({slot.substitutionReason})
                  </p>
                </div>
                <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  You are Proxy
                </span>
              </div>
            ))}

            {mySlotsSubstitutedOut.map((slot) => (
              <div key={slot.id} className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-start justify-between">
                <div>
                  <span className="font-extrabold text-slate-900">
                    Your Class Handled by Colleague
                  </span>
                  <p className="text-slate-600">
                    {slot.className} ({slot.day} - Period {slot.period})
                  </p>
                  <p className="text-emerald-800 font-bold text-[11px]">
                    Covered by {slot.substitutedTeacherName}
                  </p>
                </div>
                <button
                  onClick={() => clearProxySubstitution(slot.id)}
                  className="text-[10px] font-black text-rose-700 hover:underline shrink-0"
                >
                  Clear Proxy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveView('my-routine')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'my-routine'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          My Teaching Routine ({mySlots.length} Periods)
        </button>

        <button
          onClick={() => setActiveView('class-wise')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'class-wise'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Class-Wise Master Schedules & Allocations
        </button>

        <button
          onClick={() => setActiveView('faculty-matrix')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'faculty-matrix'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Faculty Workload & Assignments Matrix
        </button>

        <button
          onClick={() => setActiveView('proxy-manager')}
          className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'proxy-manager'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          Proxy & Class Exchange Manager
        </button>
      </div>

      {/* VIEW 1: MY TEACHING ROUTINE (WEEKLY MATRIX & CARDS) */}
      {activeView === 'my-routine' && (
        <div className="space-y-6">
          {/* Day Filter Chips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter Day:
              </span>

              <button
                onClick={() => setSelectedDay('All')}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs shrink-0 ${
                  selectedDay === 'All'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All 6 Days (Matrix)
              </button>

              <button
                onClick={() => setSelectedDay(currentDayName)}
                className={`px-3 py-1.5 rounded-lg font-black transition text-xs shrink-0 flex items-center gap-1 ${
                  selectedDay === currentDayName
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-700" />
                Today ({currentDayName})
              </button>

              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition text-xs shrink-0 ${
                    selectedDay === day
                      ? 'bg-teal-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="relative shrink-0 hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject or class..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-600 w-44"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Weekly Teaching Schedule Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  Weekly Teaching Routine Matrix for {currentTeacher.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Assigned class periods, rooms, and laboratory sessions across the 6-day academic week.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                {mySlots.length} Active Slots
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden min-w-[760px]">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-black">
                  <tr>
                    <th className="py-3 px-3 w-28 border border-slate-800">Day</th>
                    <th className="py-3 px-3 border border-slate-800 text-center">
                      Period 1<span className="block text-[9px] font-mono text-amber-300 lowercase">08:00-08:45 AM</span>
                    </th>
                    <th className="py-3 px-3 border border-slate-800 text-center">
                      Period 2<span className="block text-[9px] font-mono text-amber-300 lowercase">08:45-09:30 AM</span>
                    </th>
                    <th className="py-3 px-3 border border-slate-800 text-center">
                      Period 3<span className="block text-[9px] font-mono text-amber-300 lowercase">09:30-10:15 AM</span>
                    </th>
                    <th className="py-3 px-2 border border-slate-800 text-center bg-amber-400 text-slate-950 w-20">
                      Recess<span className="block text-[9px] font-mono lowercase">10:15-10:30</span>
                    </th>
                    <th className="py-3 px-3 border border-slate-800 text-center">
                      Period 4<span className="block text-[9px] font-mono text-amber-300 lowercase">10:30-11:15 AM</span>
                    </th>
                    <th className="py-3 px-3 border border-slate-800 text-center">
                      Period 5<span className="block text-[9px] font-mono text-amber-300 lowercase">11:15-12:00 PM</span>
                    </th>
                    <th className="py-3 px-3 border border-slate-800 text-center">
                      Period 6<span className="block text-[9px] font-mono text-amber-300 lowercase">12:00-12:45 PM</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(selectedDay === 'All' ? DAYS_OF_WEEK : [selectedDay as typeof DAYS_OF_WEEK[number]]).map((day) => {
                    const isCurrentDay = day === currentDayName;
                    const daySlots = mySlots.filter((s) => s.day === day);

                    return (
                      <tr key={day} className={`hover:bg-slate-50/80 transition ${isCurrentDay ? 'bg-teal-50/30' : ''}`}>
                        {/* Day Cell */}
                        <td className="py-3 px-3 font-extrabold text-slate-900 border border-slate-200 bg-slate-50/60 align-top">
                          <div className="flex items-center gap-1">
                            <span>{day}</span>
                            {isCurrentDay && (
                              <span className="px-1.5 py-0.2 bg-teal-700 text-white text-[9px] font-bold rounded">
                                Today
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                            {daySlots.length} Classes
                          </span>
                        </td>

                        {/* Periods 1, 2, 3 */}
                        {[1, 2, 3].map((pNum) => {
                          const slot = daySlots.find((s) => s.period === pNum);
                          return (
                            <td key={pNum} className="py-2.5 px-2.5 border border-slate-200 align-top text-center">
                              {slot ? (
                                <div className="space-y-1 bg-white p-2 rounded-lg border border-teal-200 shadow-2xs hover:border-teal-600 transition group relative">
                                  <span className="font-extrabold text-teal-900 block text-xs truncate">
                                    {slot.className}
                                  </span>
                                  <span className="text-[11px] text-slate-800 font-bold block truncate">
                                    {slot.subject}
                                  </span>
                                  {slot.room && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                      <MapPin className="w-2.5 h-2.5" />
                                      {slot.room}
                                    </span>
                                  )}
                                  {slot.isSubstituted && (
                                    <div className="text-[9px] font-black text-amber-900 bg-amber-100 px-1 py-0.5 rounded">
                                      Proxy: {slot.substitutedTeacherName}
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingSlot(slot);
                                      setEditRoom(slot.room || '');
                                      setEditNotes(slot.notes || '');
                                    }}
                                    className="text-[9px] text-teal-700 font-bold opacity-0 group-hover:opacity-100 transition underline block mx-auto mt-0.5"
                                  >
                                    Edit Details
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-300 font-mono text-[11px] italic">Free Period</span>
                              )}
                            </td>
                          );
                        })}

                        {/* Recess Break */}
                        <td className="py-2.5 px-1 border border-slate-200 text-center bg-amber-50/60 text-amber-800 text-[10px] font-bold writing-mode-vertical">
                          Break
                        </td>

                        {/* Periods 4, 5, 6 */}
                        {[4, 5, 6].map((pNum) => {
                          const slot = daySlots.find((s) => s.period === pNum);
                          return (
                            <td key={pNum} className="py-2.5 px-2.5 border border-slate-200 align-top text-center">
                              {slot ? (
                                <div className="space-y-1 bg-white p-2 rounded-lg border border-teal-200 shadow-2xs hover:border-teal-600 transition group relative">
                                  <span className="font-extrabold text-teal-900 block text-xs truncate">
                                    {slot.className}
                                  </span>
                                  <span className="text-[11px] text-slate-800 font-bold block truncate">
                                    {slot.subject}
                                  </span>
                                  {slot.room && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                      <MapPin className="w-2.5 h-2.5" />
                                      {slot.room}
                                    </span>
                                  )}
                                  {slot.isSubstituted && (
                                    <div className="text-[9px] font-black text-amber-900 bg-amber-100 px-1 py-0.5 rounded">
                                      Proxy: {slot.substitutedTeacherName}
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingSlot(slot);
                                      setEditRoom(slot.room || '');
                                      setEditNotes(slot.notes || '');
                                    }}
                                    className="text-[9px] text-teal-700 font-bold opacity-0 group-hover:opacity-100 transition underline block mx-auto mt-0.5"
                                  >
                                    Edit Details
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-300 font-mono text-[11px] italic">Free Period</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CLASS-WISE MASTER SCHEDULES & ALLOCATIONS */}
      {activeView === 'class-wise' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  Class Schedule & Subject Allocations Viewer
                </h3>
                <p className="text-xs text-slate-500">
                  Select any grade to view who is teaching what subject and room distribution.
                </p>
              </div>

              {/* Class selector pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {allClassNames.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClassForMaster(cls)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold transition shrink-0 ${
                      selectedClassForMaster === cls
                        ? 'bg-teal-800 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Allocation Cards for this class */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                Curriculum Subject Allocations ({selectedClassForMaster})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {classSubjectAllocations.map((alloc) => (
                  <div key={alloc.subject} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-start justify-between">
                      <strong className="text-slate-900 font-extrabold text-sm">{alloc.subject}</strong>
                      <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
                        {alloc.periodsPerWeek} P/wk
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">Teacher: {alloc.teacherName}</p>
                    {alloc.room && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Room: {alloc.room}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timetable Table for selected class */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                Weekly Class Routine for {selectedClassForMaster}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden min-w-[700px]">
                  <thead className="bg-slate-800 text-white uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 border border-slate-700 w-24">Day</th>
                      <th className="p-2.5 border border-slate-700 text-center">P1 (08:00)</th>
                      <th className="p-2.5 border border-slate-700 text-center">P2 (08:45)</th>
                      <th className="p-2.5 border border-slate-700 text-center">P3 (09:30)</th>
                      <th className="p-2.5 border border-slate-700 text-center">P4 (10:30)</th>
                      <th className="p-2.5 border border-slate-700 text-center">P5 (11:15)</th>
                      <th className="p-2.5 border border-slate-700 text-center">P6 (12:00)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {DAYS_OF_WEEK.map((day) => {
                      const daySlots = classMasterSlots.filter((s) => s.day === day);
                      return (
                        <tr key={day} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold border border-slate-200 bg-slate-50">{day}</td>
                          {[1, 2, 3, 4, 5, 6].map((p) => {
                            const slot = daySlots.find((s) => s.period === p);
                            const isMine =
                              slot &&
                              (slot.teacherId === currentTeacher.id ||
                                slot.teacherName.toLowerCase() === currentTeacher.name.toLowerCase());

                            return (
                              <td
                                key={p}
                                className={`p-2 border border-slate-200 text-center text-[11px] ${
                                  isMine ? 'bg-amber-50/80 font-bold border-amber-300' : ''
                                }`}
                              >
                                {slot ? (
                                  <div>
                                    <strong className="block text-slate-900">{slot.subject}</strong>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      {slot.teacherName} {isMine ? '(You)' : ''}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-300 italic">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FACULTY WORKLOAD & ASSIGNMENTS MATRIX */}
      {activeView === 'faculty-matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700" />
                Faculty Teaching Workload & Assignments Directory
              </h3>
              <p className="text-xs text-slate-500">
                Institutional distribution of periods, subjects, and grade assignments among GBHS Mehrand faculty.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              {facultyWorkload.length} Faculty Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-3">Faculty Name & PID</th>
                  <th className="py-3 px-3">Designation & Specialty</th>
                  <th className="py-3 px-3">Weekly Periods</th>
                  <th className="py-3 px-3">Assigned Classes</th>
                  <th className="py-3 px-3">Subjects Taught</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {facultyWorkload.map(({ teacher, totalPeriods, classes, subjects }) => {
                  const isSelf = teacher.id === currentTeacher.id;
                  return (
                    <tr key={teacher.id} className={`hover:bg-slate-50 ${isSelf ? 'bg-amber-50/50' : ''}`}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                            {teacher.pictureUrl ? (
                              <img src={teacher.pictureUrl} alt={teacher.name} className="w-full h-full object-cover" />
                            ) : (
                              teacher.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {teacher.name} {isSelf ? '★ (You)' : ''}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{teacher.pid}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-teal-900 block">{teacher.designation}</span>
                        <span className="text-[10px] text-slate-500">{teacher.subjectSpecialist}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                        {totalPeriods} Periods / Wk
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {classes.map((c) => (
                            <span key={c} className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded text-[10px] font-bold">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {subjects.join(', ') || 'N/A'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active on Duty
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: PROXY & CLASS EXCHANGE MANAGER */}
      {activeView === 'proxy-manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form to Request / Assign Proxy */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                Arrange Class Proxy / Substitution
              </h3>
              <p className="text-xs text-slate-500">
                Assign an available faculty colleague to engage your class if you have official duty, leave, or training.
              </p>
            </div>

            <form onSubmit={handleAssignProxySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Select Your Teaching Slot to Cover *
                </label>
                <select
                  required
                  value={proxySlotId}
                  onChange={(e) => setProxySlotId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 bg-white"
                >
                  <option value="">-- Choose period to substitute --</option>
                  {mySlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.day} - P{slot.period} ({slot.time}) [{slot.className} - {slot.subject}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. Select Available Colleague *
                </label>
                <select
                  required
                  value={proxyColleagueId}
                  onChange={(e) => setProxyColleagueId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 bg-white"
                >
                  <option value="">-- Choose substitute teacher --</option>
                  {teachers
                    .filter((t) => t.id !== currentTeacher.id && t.status === 'approved')
                    .map((tch) => (
                      <option key={tch.id} value={tch.id}>
                        {tch.name} ({tch.designation} - {tch.subjectSpecialist})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. Reason for Substitution / Leave
                </label>
                <input
                  type="text"
                  required
                  value={proxyReason}
                  onChange={(e) => setProxyReason(e.target.value)}
                  placeholder="e.g. SELD Training Workshop at Mithi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                Confirm & Record Proxy Substitution
              </button>
            </form>
          </div>

          {/* List of Active Substitutions */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Current Substitution & Coverage Log
                </h3>
                <p className="text-xs text-slate-500">
                  Classes engaged by substitute teachers across the school today.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {timetable.filter((s) => s.isSubstituted).length > 0 ? (
                timetable
                  .filter((s) => s.isSubstituted)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">{slot.className}</span>
                          <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded text-[11px]">
                            {slot.subject}
                          </span>
                          <span className="font-mono text-slate-500">
                            {slot.day} • Period {slot.period} ({slot.time})
                          </span>
                        </div>
                        <div className="text-slate-700">
                          Regular Teacher: <strong>{slot.teacherName}</strong> → Substitute:{' '}
                          <strong className="text-amber-900">{slot.substitutedTeacherName}</strong>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">Reason: {slot.substitutionReason}</p>
                      </div>

                      <button
                        onClick={() => clearProxySubstitution(slot.id)}
                        className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-black rounded-lg border border-rose-200 shadow-2xs transition shrink-0 self-start sm:self-center"
                      >
                        Reset to Regular
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No active substitutions at present.</p>
                  <p className="text-xs text-slate-400">All faculty members are taking their regular scheduled classes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT SLOT DETAILS MODAL */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Update Period Details</h3>
              <p className="text-xs text-slate-500">
                {editingSlot.day} • Period {editingSlot.period} ({editingSlot.className} - {editingSlot.subject})
              </p>
            </div>

            <form onSubmit={handleSaveSlotEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Room / Lab Location</label>
                <input
                  type="text"
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  placeholder="e.g. Computer Lab, Science Lab, Room 09"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lesson Topic / Subject Note</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Practical examination preparation, Chapter 3 revision"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black shadow transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE TEACHER ROUTINE SLIP MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-4 border-teal-800 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-teal-800" />
                <h3 className="text-lg font-black text-slate-900">Official Teacher Timetable Routine Slip</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Routine Slip
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Content Block */}
            <div className="border-2 border-slate-300 p-6 rounded-2xl space-y-4 bg-white print:border-none print:p-0">
              <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                <div className="flex justify-center mb-1">
                  <SchoolLogo logoUrl={settings.logoUrl} size="sm" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                  Government of Sindh • School Education & Literacy Department
                </h2>
                <h1 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                  {settings.schoolName}
                </h1>
                <p className="text-xs font-bold text-teal-800">
                  SEMIS CODE: {settings.semisCode} • DISTRICT THARPARKAR @ MITHI
                </p>
                <p className="text-[11px] font-black uppercase tracking-wider text-teal-950 bg-teal-50 inline-block px-3 py-0.5 rounded-full border border-teal-300">
                  Official Teacher Weekly Teaching Routine Sheet (Session 2026-2027)
                </p>
              </div>

              {/* Teacher Particulars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Teacher Name:</span>
                  <span className="font-extrabold text-slate-900">{currentTeacher.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Personal ID (PID):</span>
                  <span className="font-mono font-bold text-slate-900">{currentTeacher.pid}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Designation:</span>
                  <span className="font-bold text-slate-900">{currentTeacher.designation || 'Teacher'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Subject Specialist:</span>
                  <span className="font-bold text-slate-900">{currentTeacher.subjectSpecialist}</span>
                </div>
              </div>

              {/* Weekly Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border border-slate-300">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border border-slate-300">Day</th>
                      <th className="p-2 border border-slate-300">P1 (08:00)</th>
                      <th className="p-2 border border-slate-300">P2 (08:45)</th>
                      <th className="p-2 border border-slate-300">P3 (09:30)</th>
                      <th className="p-2 border border-slate-300">P4 (10:30)</th>
                      <th className="p-2 border border-slate-300">P5 (11:15)</th>
                      <th className="p-2 border border-slate-300">P6 (12:00)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_OF_WEEK.map((day) => {
                      const daySlots = mySlots.filter((s) => s.day === day);
                      return (
                        <tr key={day} className="border-b border-slate-200">
                          <td className="p-2 font-bold border border-slate-300 bg-slate-50">{day}</td>
                          {[1, 2, 3, 4, 5, 6].map((p) => {
                            const slot = daySlots.find((s) => s.period === p);
                            return (
                              <td key={p} className="p-2 border border-slate-300 text-[10px]">
                                {slot ? (
                                  <div>
                                    <strong className="block text-slate-900">{slot.className}</strong>
                                    <span className="text-slate-600">{slot.subject}</span>
                                    {slot.room && <span className="block text-[9px] text-slate-400">({slot.room})</span>}
                                  </div>
                                ) : (
                                  <span className="text-slate-300 italic">Free</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Stamp & Signatures */}
              <div className="pt-8 flex items-center justify-between text-xs border-t border-slate-200 mt-6">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1" />
                  <span className="font-bold text-slate-700">Teacher Signature</span>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-slate-400 mb-1" />
                  <span className="font-bold text-slate-900 uppercase">Headmaster Signature & Stamp</span>
                  <p className="text-[10px] text-slate-500">{settings.headmasterName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
