import { TimetableSlot } from '../types';
import { SCHOOL_CLASSES, TIMETABLE_DAYS, getPeriodsForDay } from './timetableConfig';

/**
 * Creates the default unassigned grid of timetable slots for Classes 1 to 10
 * Constraint Rule 1: Default State: Keep all timetables unassigned ("Not Assigned") by default.
 * No slots should populate until a teacher successfully registers and is assigned a subject/class.
 */
export function buildDefaultUnassignedTimetable(): TimetableSlot[] {
  const slots: TimetableSlot[] = [];

  TIMETABLE_DAYS.forEach((day, dayIndex) => {
    const periods = getPeriodsForDay(day);

    periods.forEach((periodDef) => {
      // Skip assembly and break from subject assignment grid
      if (periodDef.isAssembly || periodDef.isBreak) return;

      const periodNum = periodDef.period;
      const periodTime = periodDef.time;

      SCHOOL_CLASSES.forEach((classConfig, classIndex) => {
        const slotId = `slot-${day.toLowerCase()}-p${periodNum}-${classConfig.className.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const subjectPool = classConfig.subjects;
        const subjectIndex = (dayIndex * 3 + (periodNum - 1) + classIndex) % subjectPool.length;
        const targetSubject = subjectPool[subjectIndex];

        slots.push({
          id: slotId,
          day,
          period: periodNum,
          time: periodTime,
          className: classConfig.className,
          subject: targetSubject,
          teacherId: '',
          teacherName: 'Timetable Not Assigned / Awaiting Teacher Registration',
          room: classConfig.room,
          isLockedSlot: true,
          notes: 'Timetable Not Assigned / Awaiting Teacher Registration',
        });
      });
    });
  });

  return slots;
}
