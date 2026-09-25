import { Teacher, TimetableSlot } from '../types';
import {
  SCHOOL_CLASSES,
  TIMETABLE_DAYS,
  getPeriodsForDay,
  PeriodSlotDefinition,
  ClassSubjectConfig,
} from './timetableConfig';

export interface AutoScheduleOptions {
  includeSaturdays?: boolean;
}

export interface TeacherAssignmentCandidate {
  teacher: Teacher;
  matchesSubject: boolean;
  matchesClass: boolean;
  score: number;
}

/**
 * Normalizes subject string for semantic matching
 */
function normalize(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
}

/**
 * Checks whether teacher's profile/specialization matches the target subject
 */
export function isTeacherEligibleForSubject(teacher: Teacher, subject: string): boolean {
  // Check explicit assigned subjects
  if (teacher.assignedSubjects && teacher.assignedSubjects.length > 0) {
    const hasAssigned = teacher.assignedSubjects.some((s) =>
      normalize(s).includes(normalize(subject)) || normalize(subject).includes(normalize(s))
    );
    if (hasAssigned) return true;
  }

  // Check subjectSpecialist field
  const spec = normalize(teacher.subjectSpecialist);
  const subj = normalize(subject);

  if (!spec) return false;
  if (spec.includes(subj) || subj.includes(spec)) return true;

  // Domain groupings
  if (subj.includes('math') && (spec.includes('math') || spec.includes('science') || spec.includes('jest'))) return true;
  if (subj.includes('physic') && (spec.includes('physic') || spec.includes('science') || spec.includes('hst'))) return true;
  if (subj.includes('chem') && (spec.includes('chem') || spec.includes('science') || spec.includes('biology'))) return true;
  if (subj.includes('bio') && (spec.includes('bio') || spec.includes('chem') || spec.includes('science'))) return true;
  if (subj.includes('computer') && (spec.includes('computer') || spec.includes('it') || spec.includes('jest'))) return true;
  if (subj.includes('english') && (spec.includes('english') || spec.includes('language') || spec.includes('hst'))) return true;
  if (subj.includes('sindhi') && (spec.includes('sindhi') || spec.includes('pst') || spec.includes('language'))) return true;
  if (subj.includes('urdu') && (spec.includes('urdu') || spec.includes('language') || spec.includes('pst'))) return true;
  if (subj.includes('general knowledge') && (spec.includes('pst') || spec.includes('general') || spec.includes('social'))) return true;
  if (subj.includes('social') && (spec.includes('social') || spec.includes('pakistan') || spec.includes('history'))) return true;
  if (subj.includes('pakistan') && (spec.includes('pakistan') || spec.includes('social') || spec.includes('history'))) return true;
  if (subj.includes('islamiat') || subj.includes('ethics')) {
    if (spec.includes('islamiat') || spec.includes('ethics') || spec.includes('pst') || spec.includes('general')) return true;
  }

  return false;
}

/**
 * Checks whether teacher is assigned or eligible for target class
 */
export function isTeacherEligibleForClass(teacher: Teacher, targetClass: string): boolean {
  if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
    return teacher.assignedClasses.includes(targetClass);
  }

  const des = (teacher.designation || '').toUpperCase();
  const classNum = parseInt(targetClass.replace(/\D/g, ''), 10);

  // PST teachers usually teach Classes 1st to 5th
  if (des.includes('PST')) {
    return classNum >= 1 && classNum <= 5;
  }
  // JEST teachers usually teach Classes 6th to 8th and lower secondary (up to 9th/10th for IT/Math)
  if (des.includes('JEST')) {
    return classNum >= 6 && classNum <= 10;
  }
  // HST / Subject Specialists usually teach Classes 9th & 10th and 6th-8th
  if (des.includes('HST') || des.includes('SPECIALIST')) {
    return classNum >= 6 && classNum <= 10;
  }

  // Default eligible
  return true;
}

/**
 * Auto-Assigning School Timetable Engine (Classes 1-10)
 *
 * Constraint Rules:
 * 1. Default State: Keep all timetables unassigned ("Not Assigned") by default.
 *    No slots should populate until a teacher successfully registers and is assigned a subject/class.
 * 2. Trigger Event: Upon teacher registration and subject/class mapping, trigger
 *    auto-distribution engine to assign periods across the dashboard.
 * 3. Daily Schedule Structure:
 *    - Mon-Thu (8:00 AM - 1:30 PM): Assembly 8:00-8:20, 4 Periods (40m each), Break 11:00-11:30, 4 Periods (30m each)
 *    - Friday (8:00 AM - 12:00 PM): Assembly 8:00-8:20, 4 Periods (55m each, No Break)
 * 4. Algorithm Logic:
 *    - Evenly distribute subjects across the 10 classes without creating double-booking conflicts for any teacher.
 *    - If a class is missing a registered teacher for a required subject, flag that specific period slot as "Teacher Not Registered".
 */
export function generateAutoAssignedTimetable(
  registeredTeachers: Teacher[],
  options?: AutoScheduleOptions
): TimetableSlot[] {
  // PART 3 Pre-Condition Constraint:
  // By default, all class timetables (Classes 1 to 10) are empty and locked. No periods can be assigned automatically.
  // ONLY Admin-Approved registered teachers can be assigned to classes.
  const approvedTeachers = (registeredTeachers || []).filter((t) => t.status === 'approved');

  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> =
    options?.includeSaturdays !== false
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const slots: TimetableSlot[] = [];

  // Teacher period tracker to guarantee ZERO double-booking conflicts:
  // Key: `${day}_${period}_${teacherId}` -> boolean
  const teacherBookings = new Set<string>();

  // Teacher cumulative workload tracker to distribute subjects evenly across classes
  // Key: `${teacherId}` -> number of assigned periods
  const teacherWorkload: Record<string, number> = {};
  approvedTeachers.forEach((t) => {
    teacherWorkload[t.id] = 0;
  });

  days.forEach((day, dayIndex) => {
    const periods = getPeriodsForDay(day);

    periods.forEach((periodDef) => {
      // Skip assembly & lunch break periods from normal subject teaching slots
      // (They are locked systemic slots)
      if (periodDef.isAssembly || periodDef.isBreak) {
        return;
      }

      const periodNum = periodDef.period;
      const periodTime = periodDef.time;

      // Loop through each of the 10 Classes (Class 1st to Class 10th)
      SCHOOL_CLASSES.forEach((classConfig, classIndex) => {
        const slotId = `slot-${day.toLowerCase()}-p${periodNum}-${classConfig.className.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        // Determine which subject should ideally be taught in this period for this class
        // Rotate evenly across days and periods to ensure complete curricular coverage
        const subjectPool = classConfig.subjects;
        const subjectIndex = (dayIndex * 3 + (periodNum - 1) + classIndex) % subjectPool.length;
        const targetSubject = subjectPool[subjectIndex];

        // Find candidate Admin-Approved teachers who specialize in this subject and class
        const candidateTeachers = approvedTeachers.filter((t) => {
          // Check if teacher is already booked in this exact day & period (Conflict prevention)
          const bookingKey = `${day}_${periodNum}_${t.id}`;
          if (teacherBookings.has(bookingKey)) {
            return false;
          }

          // Check subject eligibility
          const matchSubj = isTeacherEligibleForSubject(t, targetSubject);
          // Check class eligibility
          const matchClass = isTeacherEligibleForClass(t, classConfig.className);

          return matchSubj && matchClass;
        });

        let assignedTeacher: Teacher | null = null;

        if (candidateTeachers.length > 0) {
          // Select the teacher with lowest current workload for even distribution
          candidateTeachers.sort((a, b) => {
            const loadA = teacherWorkload[a.id] || 0;
            const loadB = teacherWorkload[b.id] || 0;
            return loadA - loadB;
          });

          assignedTeacher = candidateTeachers[0];

          // Record booking to strictly prevent double-booking conflicts
          teacherBookings.add(`${day}_${periodNum}_${assignedTeacher.id}`);
          teacherWorkload[assignedTeacher.id] = (teacherWorkload[assignedTeacher.id] || 0) + 1;
        }

        if (assignedTeacher) {
          // Successfully assigned slot
          slots.push({
            id: slotId,
            day,
            period: periodNum,
            time: periodTime,
            className: classConfig.className,
            subject: targetSubject,
            teacherId: assignedTeacher.id,
            teacherName: assignedTeacher.name,
            room: classConfig.room,
            isLockedSlot: false,
            notes: `Auto-scheduled via Timetable Engine from Admin-Approved faculty (${assignedTeacher.name} - ${assignedTeacher.designation || 'Teacher'}).`,
          });
        } else {
          // PART 3 Pre-Condition Constraint:
          // If a subject or class does not have an Admin-Approved registered teacher,
          // the system must display "Timetable Not Assigned / Awaiting Teacher Registration".
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
        }
      });
    });
  });

  return slots;
}

/**
 * Returns summary statistics of the timetable engine allocation
 */
export function getTimetableAllocationStats(timetable: TimetableSlot[], teachers: Teacher[]) {
  const totalSlots = timetable.length;
  const assignedSlots = timetable.filter(
    (s) =>
      s.teacherId &&
      s.teacherName !== 'Timetable Not Assigned / Awaiting Teacher Registration' &&
      s.teacherName !== 'Teacher Not Registered' &&
      s.teacherName !== 'Not Assigned'
  ).length;
  const unassignedSlots = totalSlots - assignedSlots;
  const missingTeacherSlots = timetable.filter(
    (s) =>
      s.teacherName === 'Timetable Not Assigned / Awaiting Teacher Registration' ||
      s.teacherName === 'Teacher Not Registered'
  ).length;
  const unallocatedDefaultSlots = timetable.filter(
    (s) => s.teacherName === 'Timetable Not Assigned / Awaiting Teacher Registration'
  ).length;

  const teacherLoadMap: Record<string, number> = {};
  timetable.forEach((s) => {
    if (s.teacherId) {
      teacherLoadMap[s.teacherId] = (teacherLoadMap[s.teacherId] || 0) + 1;
    }
  });

  const percentAssigned = totalSlots > 0 ? Math.round((assignedSlots / totalSlots) * 100) : 0;

  return {
    totalSlots,
    assignedSlots,
    unassignedSlots,
    missingTeacherSlots,
    unallocatedDefaultSlots,
    percentAssigned,
    teacherLoadMap,
    registeredTeacherCount: teachers.length,
  };
}
