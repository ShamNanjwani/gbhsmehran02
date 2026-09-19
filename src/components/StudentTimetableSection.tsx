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
  Award,
  ChevronRight,
  Download,
  Info,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Student, TimetableSlot, Teacher } from '../types';
import { SchoolLogo } from './common/SchoolLogo';

interface StudentTimetableSectionProps {
  currentStudent: Student;
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
  { period: 1, time: '08:00 - 08:45 AM', label: 'Period 1' },
  { period: 2, time: '08:45 - 09:30 AM', label: 'Period 2' },
  { period: 3, time: '09:30 - 10:15 AM', label: 'Period 3' },
  { period: 0, time: '10:15 - 10:30 AM', label: 'Morning Recess / Break', isBreak: true },
  { period: 4, time: '10:30 - 11:15 AM', label: 'Period 4' },
  { period: 5, time: '11:15 - 12:00 PM', label: 'Period 5' },
  { period: 6, time: '12:00 - 12:45 PM', label: 'Period 6' },
];

export const StudentTimetableSection: React.FC<StudentTimetableSectionProps> = ({ currentStudent }) => {
  const { timetable, teachers, settings } = useSchool();

  // Get current real-world weekday
  const currentDayName = useMemo(() => {
    const dayIndex = new Date().getDay();
    const map = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = map[dayIndex];
    return d === 'Sunday' ? 'Monday' : (d as typeof DAYS_OF_WEEK[number]);
  }, []);

  // State
  const [selectedDay, setSelectedDay] = useState<string>('All'); // 'All' for matrix or specific day
  const [selectedClass, setSelectedClass] = useState<string>(currentStudent.appliedClass || 'Class 9th');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'allocations' | 'teachers'>('matrix');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Available classes in timetable
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    if (currentStudent.appliedClass) set.add(currentStudent.appliedClass);
    timetable.forEach((slot) => set.add(slot.className));
    ['Class 6th', 'Class 7th', 'Class 8th', 'Class 9th', 'Class 10th'].forEach((c) => set.add(c));
    return Array.from(set).sort();
  }, [timetable, currentStudent.appliedClass]);

  // Slots for the selected class
  const classSlots = useMemo(() => {
    return timetable.filter((slot) => {
      const matchClass = slot.className.toLowerCase().trim() === selectedClass.toLowerCase().trim();
      return matchClass;
    });
  }, [timetable, selectedClass]);

  // Filtered slots according to day & search
  const filteredSlots = useMemo(() => {
    return classSlots.filter((slot) => {
      const matchDay = selectedDay === 'All' ? true : slot.day === selectedDay;
      const matchSearch =
        searchQuery === '' ||
        slot.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (slot.room && slot.room.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDay && matchSearch;
    });
  }, [classSlots, selectedDay, searchQuery]);

  // Subject Allocations Calculation
  const subjectAllocations = useMemo(() => {
    const map = new Map<string, {
      subject: string;
      periodsPerWeek: number;
      teacherId: string;
      teacherName: string;
      teacher?: Teacher;
      rooms: Set<string>;
      days: Set<string>;
      isLabSubject: boolean;
    }>();

    classSlots.forEach((slot) => {
      const key = slot.subject;
      const existing = map.get(key);
      const isLab =
        slot.subject.toLowerCase().includes('lab') ||
        slot.subject.toLowerCase().includes('practical') ||
        (slot.room && slot.room.toLowerCase().includes('lab'));

      const matchedTeacher = teachers.find(
        (t) => t.id === slot.teacherId || t.name.toLowerCase() === slot.teacherName.toLowerCase()
      );

      if (existing) {
        existing.periodsPerWeek += 1;
        if (slot.room) existing.rooms.add(slot.room);
        existing.days.add(slot.day);
        if (isLab) existing.isLabSubject = true;
      } else {
        const roomsSet = new Set<string>();
        if (slot.room) roomsSet.add(slot.room);
        const daysSet = new Set<string>();
        daysSet.add(slot.day);

        map.set(key, {
          subject: slot.subject,
          periodsPerWeek: 1,
          teacherId: slot.teacherId,
          teacherName: slot.teacherName,
          teacher: matchedTeacher,
          rooms: roomsSet,
          days: daysSet,
          isLabSubject: isLab,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.periodsPerWeek - a.periodsPerWeek);
  }, [classSlots, teachers]);

  // Unique Teachers Assigned to this Class
  const assignedTeachers = useMemo(() => {
    const map = new Map<string, {
      teacherName: string;
      teacherId: string;
      subjects: Set<string>;
      totalPeriods: number;
      teacher?: Teacher;
    }>();

    classSlots.forEach((slot) => {
      const key = slot.teacherId || slot.teacherName;
      const existing = map.get(key);
      const matchedTeacher = teachers.find(
        (t) => t.id === slot.teacherId || t.name.toLowerCase() === slot.teacherName.toLowerCase()
      );

      if (existing) {
        existing.totalPeriods += 1;
        existing.subjects.add(slot.subject);
      } else {
        const subs = new Set<string>();
        subs.add(slot.subject);
        map.set(key, {
          teacherName: slot.teacherName,
          teacherId: slot.teacherId,
          subjects: subs,
          totalPeriods: 1,
          teacher: matchedTeacher,
        });
      }
    });

    return Array.from(map.values());
  }, [classSlots, teachers]);

  // Active substitutions in this class
  const activeSubstitutions = useMemo(() => {
    return classSlots.filter((slot) => slot.isSubstituted);
  }, [classSlots]);

  // Trigger print
  const handlePrintSlip = () => {
    setShowPrintModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Official Sindh Education Routine
              </span>
              <span className="text-xs text-emerald-200 font-mono">
                SEMIS: {settings.semisCode}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-300" />
              Dynamic Class Timetable & Teaching Schedule
            </h2>
            <p className="text-xs text-emerald-100 max-w-2xl">
              Real-time schedule for <strong>{selectedClass}</strong> with period timings, subject allocations, teacher specialists, and live substitution status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrintSlip}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Timetable Slip
            </button>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-emerald-800/60 text-xs">
          <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300 text-[10px] uppercase font-bold block">Enrolled Class</span>
            <span className="text-base font-black text-white">{selectedClass}</span>
          </div>
          <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300 text-[10px] uppercase font-bold block">Total Subjects</span>
            <span className="text-base font-black text-amber-300">{subjectAllocations.length} Subjects</span>
          </div>
          <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300 text-[10px] uppercase font-bold block">Faculty Assigned</span>
            <span className="text-base font-black text-white">{assignedTeachers.length} Teachers</span>
          </div>
          <div className="bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300 text-[10px] uppercase font-bold block">Today ({currentDayName})</span>
            <span className="text-base font-black text-emerald-200">
              {classSlots.filter((s) => s.day === currentDayName).length} Periods
            </span>
          </div>
        </div>
      </div>

      {/* Active Substitution Alert Banner */}
      {activeSubstitutions.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Active Proxy / Teacher Substitution Notice for {selectedClass}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activeSubstitutions.map((slot) => (
              <div key={slot.id} className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-start justify-between">
                <div>
                  <span className="font-extrabold text-slate-900">{slot.day} - Period {slot.period} ({slot.time})</span>
                  <p className="text-slate-600 font-medium">{slot.subject} • Regular: {slot.teacherName}</p>
                  <p className="text-amber-800 font-bold text-[11px] mt-0.5">
                    Proxy Teacher: {slot.substitutedTeacherName} ({slot.substitutionReason})
                  </p>
                </div>
                <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Proxy Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar: Class Selector, Search & View Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => { setViewMode('matrix'); setSelectedDay('All'); }}
              className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 transition shrink-0 ${
                viewMode === 'matrix'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Weekly Matrix (Grid)
            </button>

            <button
              onClick={() => { setViewMode('cards'); if (selectedDay === 'All') setSelectedDay(currentDayName); }}
              className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 transition shrink-0 ${
                viewMode === 'cards'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Daily Routine (Cards)
            </button>

            <button
              onClick={() => setViewMode('allocations')}
              className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 transition shrink-0 ${
                viewMode === 'allocations'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Subject Allocations ({subjectAllocations.length})
            </button>

            <button
              onClick={() => setViewMode('teachers')}
              className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 transition shrink-0 ${
                viewMode === 'teachers'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Teacher Assignments ({assignedTeachers.length})
            </button>
          </div>

          {/* Right Filters: Class & Search */}
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls} {cls === currentStudent.appliedClass ? '(My Class)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject/teacher..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Day Filter Pills (Only for Matrix & Cards) */}
        {(viewMode === 'matrix' || viewMode === 'cards') && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Day:
            </span>

            <button
              onClick={() => setSelectedDay('All')}
              className={`px-3 py-1.5 rounded-lg font-bold transition text-xs shrink-0 ${
                selectedDay === 'All'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Days (Weekly)
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
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: WEEKLY ROUTINE MATRIX (GRID) */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Weekly Period Timetable Matrix for {selectedClass}
              </h3>
              <p className="text-xs text-slate-500">
                Regular daily class routine from 08:00 AM to 12:45 PM (6 Periods daily + morning recess).
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              Showing {selectedDay === 'All' ? 'All 6 Days' : selectedDay}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden min-w-[760px]">
              <thead className="bg-slate-900 text-white uppercase text-[10px] font-black">
                <tr>
                  <th className="py-3 px-3 w-28 border border-slate-800">Day</th>
                  <th className="py-3 px-3 border border-slate-800 text-center">
                    Period 1<span className="block text-[9px] font-mono text-emerald-400 lowercase">08:00-08:45 AM</span>
                  </th>
                  <th className="py-3 px-3 border border-slate-800 text-center">
                    Period 2<span className="block text-[9px] font-mono text-emerald-400 lowercase">08:45-09:30 AM</span>
                  </th>
                  <th className="py-3 px-3 border border-slate-800 text-center">
                    Period 3<span className="block text-[9px] font-mono text-emerald-400 lowercase">09:30-10:15 AM</span>
                  </th>
                  <th className="py-3 px-2 border border-slate-800 text-center bg-amber-400 text-slate-950 w-20">
                    Recess<span className="block text-[9px] font-mono lowercase">10:15-10:30</span>
                  </th>
                  <th className="py-3 px-3 border border-slate-800 text-center">
                    Period 4<span className="block text-[9px] font-mono text-emerald-400 lowercase">10:30-11:15 AM</span>
                  </th>
                  <th className="py-3 px-3 border border-slate-800 text-center">
                    Period 5<span className="block text-[9px] font-mono text-emerald-400 lowercase">11:15-12:00 PM</span>
                  </th>
                  <th className="py-3 px-3 border border-slate-800 text-center">
                    Period 6<span className="block text-[9px] font-mono text-emerald-400 lowercase">12:00-12:45 PM</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(selectedDay === 'All' ? DAYS_OF_WEEK : [selectedDay as typeof DAYS_OF_WEEK[number]]).map((day) => {
                  const isCurrentDay = day === currentDayName;
                  const daySlots = classSlots.filter((s) => s.day === day);

                  return (
                    <tr key={day} className={`hover:bg-slate-50/80 transition ${isCurrentDay ? 'bg-emerald-50/40' : ''}`}>
                      {/* Day Label Cell */}
                      <td className="py-3 px-3 font-extrabold text-slate-900 border border-slate-200 bg-slate-50/60 align-top">
                        <div className="flex items-center gap-1.5">
                          <span>{day}</span>
                          {isCurrentDay && (
                            <span className="px-1.5 py-0.2 bg-emerald-700 text-white text-[9px] font-bold rounded">
                              Today
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block font-normal mt-0.5">
                          {daySlots.length} Periods
                        </span>
                      </td>

                      {/* Periods 1, 2, 3 */}
                      {[1, 2, 3].map((periodNum) => {
                        const slot = daySlots.find((s) => s.period === periodNum);
                        return (
                          <td key={periodNum} className="py-2.5 px-2.5 border border-slate-200 align-top text-center">
                            {slot ? (
                              <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-500 transition">
                                <span className="font-extrabold text-slate-900 block text-xs truncate">
                                  {slot.subject}
                                </span>
                                <span className="text-[11px] text-emerald-800 font-bold block truncate">
                                  {slot.teacherName}
                                </span>
                                {slot.room && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                    <MapPin className="w-2.5 h-2.5" />
                                    {slot.room}
                                  </span>
                                )}
                                {slot.isSubstituted && (
                                  <div className="text-[9px] font-black text-amber-900 bg-amber-100 px-1 py-0.5 rounded mt-0.5">
                                    Proxy: {slot.substitutedTeacherName}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 font-mono text-[11px] italic">Free / Study</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Morning Break Cell */}
                      <td className="py-2.5 px-1 border border-slate-200 text-center bg-amber-50/60 text-amber-800 text-[10px] font-bold writing-mode-vertical">
                        Break
                      </td>

                      {/* Periods 4, 5, 6 */}
                      {[4, 5, 6].map((periodNum) => {
                        const slot = daySlots.find((s) => s.period === periodNum);
                        return (
                          <td key={periodNum} className="py-2.5 px-2.5 border border-slate-200 align-top text-center">
                            {slot ? (
                              <div className="space-y-1 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-500 transition">
                                <span className="font-extrabold text-slate-900 block text-xs truncate">
                                  {slot.subject}
                                </span>
                                <span className="text-[11px] text-emerald-800 font-bold block truncate">
                                  {slot.teacherName}
                                </span>
                                {slot.room && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                    <MapPin className="w-2.5 h-2.5" />
                                    {slot.room}
                                  </span>
                                )}
                                {slot.isSubstituted && (
                                  <div className="text-[9px] font-black text-amber-900 bg-amber-100 px-1 py-0.5 rounded mt-0.5">
                                    Proxy: {slot.substitutedTeacherName}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 font-mono text-[11px] italic">Free / Study</span>
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
      )}

      {/* VIEW 2: DAILY ROUTINE (CHRONOLOGICAL CARDS) */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              Day-Wise Periods Schedule for {selectedDay === 'All' ? currentDayName : selectedDay}
            </h3>
            <span className="text-xs text-slate-500">{filteredSlots.length} Classes Scheduled</span>
          </div>

          {filteredSlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlots
                .sort((a, b) => a.period - b.period)
                .map((slot) => {
                  const teacher = teachers.find(
                    (t) => t.id === slot.teacherId || t.name.toLowerCase() === slot.teacherName.toLowerCase()
                  );

                  return (
                    <div
                      key={slot.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-500 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white font-black text-xs">
                          Period {slot.period}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {slot.time}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Subject</span>
                        <h4 className="text-base font-black text-slate-900">{slot.subject}</h4>
                      </div>

                      {/* Teacher info */}
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 overflow-hidden">
                          {teacher?.pictureUrl ? (
                            <img src={teacher.pictureUrl} alt={slot.teacherName} className="w-full h-full object-cover" />
                          ) : (
                            slot.teacherName.charAt(0)
                          )}
                        </div>
                        <div className="space-y-0.5 text-xs">
                          <span className="font-extrabold text-slate-800 block leading-tight">
                            {slot.teacherName}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {teacher?.designation || 'Teacher'} {teacher?.subjectSpecialist ? `• ${teacher.subjectSpecialist}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {slot.room || 'General Classroom'}
                        </span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {slot.day}
                        </span>
                      </div>

                      {slot.isSubstituted && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider block text-amber-800">
                            Substitution in effect:
                          </span>
                          <p>
                            Covered by <strong>{slot.substitutedTeacherName}</strong> ({slot.substitutionReason})
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No scheduled periods match the selected filter.</p>
              <p className="text-xs text-slate-400">Try switching to another day or clearing your search term.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: SUBJECT ALLOCATIONS BREAKDOWN */}
      {viewMode === 'allocations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                Curriculum Subject Allocations for {selectedClass}
              </h3>
              <p className="text-xs text-slate-500">
                Official weekly period quotas, textbook curriculum hours, and assigned teachers for this class.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Total: {subjectAllocations.length} Subjects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectAllocations.map((alloc) => (
              <div
                key={alloc.subject}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 hover:border-emerald-500 hover:bg-white transition shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{alloc.subject}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {alloc.periodsPerWeek} Periods / Week ({alloc.periodsPerWeek * 45} mins)
                    </span>
                  </div>
                  {alloc.isLabSubject && (
                    <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                      Practical / Lab
                    </span>
                  )}
                </div>

                {/* Progress quota bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Weekly Weightage</span>
                    <span>{Math.round((alloc.periodsPerWeek / 30) * 100)}% of timetable</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (alloc.periodsPerWeek / 6) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned Teacher:</span>
                    <strong className="text-slate-800">{alloc.teacherName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Specialization:</span>
                    <span className="text-emerald-800 font-bold">
                      {alloc.teacher?.subjectSpecialist || 'General Faculty'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Classrooms / Labs:</span>
                    <span className="font-mono text-slate-700">
                      {Array.from(alloc.rooms).join(', ') || 'General Room'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: TEACHER ASSIGNMENTS DIRECTORY */}
      {viewMode === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                Teaching Faculty Assigned to {selectedClass}
              </h3>
              <p className="text-xs text-slate-500">
                Meet the certified teachers assigned by Sindh Education Department for your grade.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              {assignedTeachers.length} Faculty Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedTeachers.map((item) => (
              <div
                key={item.teacherId || item.teacherName}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-600 bg-slate-900 shrink-0">
                    {item.teacher?.pictureUrl ? (
                      <img src={item.teacher.pictureUrl} alt={item.teacherName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-amber-300 text-xl">
                        {item.teacherName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.2 rounded">
                        {item.teacher?.pid || 'GOVT-TEACHER'}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded">
                        {item.teacher?.designation || 'Teacher'}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900">{item.teacherName}</h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Specialist: <strong>{item.teacher?.subjectSpecialist || 'General Subject'}</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Subjects Taught</span>
                    <span className="font-bold text-slate-800">{Array.from(item.subjects).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Weekly Periods</span>
                    <span className="font-bold text-emerald-800">{item.totalPeriods} Periods / Week</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Qualification:</span>
                    <span className="font-medium text-slate-800">{item.teacher?.qualification || 'Graduate'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRINTABLE TIMETABLE SLIP MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-800 space-y-6 animate-in fade-in zoom-in-95">
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-800" />
                <h3 className="text-lg font-black text-slate-900">Official Student Timetable Slip</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Now
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
              {/* Official Header */}
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
                <p className="text-xs font-bold text-emerald-800">
                  SEMIS CODE: {settings.semisCode} • DISTRICT THARPARKAR @ MITHI
                </p>
                <p className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 inline-block px-3 py-0.5 rounded-full border border-amber-300">
                  Official Student Class Routine Slip (Session 2026-2027)
                </p>
              </div>

              {/* Student Particulars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Student Name:</span>
                  <span className="font-extrabold text-slate-900">{currentStudent.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">G.R. Number:</span>
                  <span className="font-mono font-bold text-slate-900">{currentStudent.grNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Class & Section:</span>
                  <span className="font-bold text-slate-900">{selectedClass} (Section {currentStudent.section || 'A'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Roll Number:</span>
                  <span className="font-bold text-slate-900">{currentStudent.rollNo || '01'}</span>
                </div>
              </div>

              {/* Timetable Table */}
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
                      const daySlots = classSlots.filter((s) => s.day === day);
                      return (
                        <tr key={day} className="border-b border-slate-200">
                          <td className="p-2 font-bold border border-slate-300 bg-slate-50">{day}</td>
                          {[1, 2, 3, 4, 5, 6].map((p) => {
                            const slot = daySlots.find((s) => s.period === p);
                            return (
                              <td key={p} className="p-2 border border-slate-300 text-[10px]">
                                {slot ? (
                                  <div>
                                    <strong className="block text-slate-900">{slot.subject}</strong>
                                    <span className="text-slate-500">{slot.teacherName.split(' ')[0]}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">-</span>
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

              {/* Signature Footer */}
              <div className="pt-8 flex items-center justify-between text-xs border-t border-slate-200 mt-6">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1" />
                  <span className="font-bold text-slate-700">Class Incharge</span>
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
