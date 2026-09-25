// Standard Subject Curriculum Configuration for Classes 1 to 10
// Government Boys High School Mehrand (Kaloi, SEMIS: 406020752)

export interface ClassSubjectConfig {
  className: string;
  level: 'Primary' | 'Elementary' | 'High School';
  room: string;
  subjects: string[];
}

export const SCHOOL_CLASSES: ClassSubjectConfig[] = [
  {
    className: 'Class 1st',
    level: 'Primary',
    room: 'Room 01 (Primary Wing)',
    subjects: ['Sindhi', 'Urdu', 'Basic Mathematics', 'General Knowledge / Islamiat', 'English Reading', 'Drawing & Activities'],
  },
  {
    className: 'Class 2nd',
    level: 'Primary',
    room: 'Room 02 (Primary Wing)',
    subjects: ['Sindhi', 'Urdu', 'Basic Mathematics', 'General Knowledge / Islamiat', 'English Reading', 'Drawing & Activities'],
  },
  {
    className: 'Class 3rd',
    level: 'Primary',
    room: 'Room 03 (Primary Wing)',
    subjects: ['Sindhi', 'English', 'Mathematics', 'General Science', 'Social Studies', 'Islamiat / Ethics'],
  },
  {
    className: 'Class 4th',
    level: 'Primary',
    room: 'Room 04 (Primary Wing)',
    subjects: ['Sindhi', 'English', 'Mathematics', 'General Science', 'Social Studies', 'Islamiat / Ethics'],
  },
  {
    className: 'Class 5th',
    level: 'Primary',
    room: 'Room 05 (Primary Wing)',
    subjects: ['Sindhi', 'English', 'Mathematics', 'General Science', 'Social Studies', 'Islamiat / Ethics'],
  },
  {
    className: 'Class 6th',
    level: 'Elementary',
    room: 'Room 06 (Middle Wing)',
    subjects: ['Mathematics', 'General Science', 'English', 'Sindhi', 'Social Studies', 'Computer Education', 'Islamiat / Ethics'],
  },
  {
    className: 'Class 7th',
    level: 'Elementary',
    room: 'Room 07 (Middle Wing)',
    subjects: ['Mathematics', 'General Science', 'English', 'Sindhi', 'Social Studies', 'Computer Education', 'Islamiat / Ethics'],
  },
  {
    className: 'Class 8th',
    level: 'Elementary',
    room: 'Room 08 (Middle Wing)',
    subjects: ['Mathematics', 'General Science', 'English', 'Sindhi', 'Social Studies', 'Computer Education', 'Islamiat / Ethics'],
  },
  {
    className: 'Class 9th',
    level: 'High School',
    room: 'Room 09 (Secondary Wing)',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'English', 'Sindhi', 'Pakistan Studies', 'Biology'],
  },
  {
    className: 'Class 10th',
    level: 'High School',
    room: 'Room 10 (Secondary Wing)',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'English', 'Sindhi', 'Pakistan Studies', 'Biology'],
  },
];

export interface PeriodSlotDefinition {
  period: number;
  time: string;
  isAssembly?: boolean;
  isBreak?: boolean;
}

// Monday to Thursday Schedule (08:00 AM - 01:30 PM)
// 08:00 - 08:20 AM: Assembly (Locked slot)
// 08:20 - 11:00 AM: 4 Periods (40 minutes each)
// 11:00 - 11:30 AM: Break Time (Locked slot)
// 11:30 - 01:30 PM: 4 Periods (30 minutes each)
export const MON_THU_PERIODS: PeriodSlotDefinition[] = [
  { period: 0, time: '08:00 AM - 08:20 AM', isAssembly: true },
  { period: 1, time: '08:20 AM - 09:00 AM' }, // 40m
  { period: 2, time: '09:00 AM - 09:40 AM' }, // 40m
  { period: 3, time: '09:40 AM - 10:20 AM' }, // 40m
  { period: 4, time: '10:20 AM - 11:00 AM' }, // 40m
  { period: 99, time: '11:00 AM - 11:30 AM', isBreak: true }, // Break
  { period: 5, time: '11:30 AM - 12:00 PM' }, // 30m
  { period: 6, time: '12:00 PM - 12:30 PM' }, // 30m
  { period: 7, time: '12:30 PM - 01:00 PM' }, // 30m
  { period: 8, time: '01:00 PM - 01:30 PM' }, // 30m
];

// Friday Schedule (08:00 AM - 12:00 PM)
// 08:00 - 08:20 AM: Assembly (Locked slot)
// 08:20 - 12:00 PM: 4 Periods (55 minutes each, No Break)
export const FRIDAY_PERIODS: PeriodSlotDefinition[] = [
  { period: 0, time: '08:00 AM - 08:20 AM', isAssembly: true },
  { period: 1, time: '08:20 AM - 09:15 AM' }, // 55m
  { period: 2, time: '09:15 AM - 10:10 AM' }, // 55m
  { period: 3, time: '10:10 AM - 11:05 AM' }, // 55m
  { period: 4, time: '11:05 AM - 12:00 PM' }, // 55m
];

// Saturday Schedule (08:00 AM - 01:30 PM, standard secondary working day)
export const SATURDAY_PERIODS: PeriodSlotDefinition[] = [
  { period: 0, time: '08:00 AM - 08:20 AM', isAssembly: true },
  { period: 1, time: '08:20 AM - 09:00 AM' },
  { period: 2, time: '09:00 AM - 09:40 AM' },
  { period: 3, time: '09:40 AM - 10:20 AM' },
  { period: 4, time: '10:20 AM - 11:00 AM' },
  { period: 99, time: '11:00 AM - 11:30 AM', isBreak: true },
  { period: 5, time: '11:30 AM - 12:00 PM' },
  { period: 6, time: '12:00 PM - 12:30 PM' },
  { period: 7, time: '12:30 PM - 01:00 PM' },
  { period: 8, time: '01:00 PM - 01:30 PM' },
];

export const TIMETABLE_DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getPeriodsForDay(day: string): PeriodSlotDefinition[] {
  if (day === 'Friday') return FRIDAY_PERIODS;
  if (day === 'Saturday') return SATURDAY_PERIODS;
  return MON_THU_PERIODS;
}
