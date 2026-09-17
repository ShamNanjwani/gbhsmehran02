import fs from 'fs';
import path from 'path';
import {
  initialSchoolSettings,
  initialLeaderMessages,
  initialTeachers,
  initialStudents,
  initialTimetableSlots,
  initialRemarks,
  initialAttendance,
  initialStudentResults,
  initialLeavingCertificates,
  initialInquiries,
} from '../src/data/initialData';

export interface SchoolDatabasePayload {
  settings: any;
  leaderMessages: any[];
  teachers: any[];
  students: any[];
  timetable: any[];
  remarks: any[];
  attendance: any[];
  results: any[];
  leavingCertificates: any[];
  inquiries: any[];
  lastSyncedAt?: string;
  version?: number;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'school_database.json');

function getInitialDatabase(): SchoolDatabasePayload {
  return {
    settings: initialSchoolSettings,
    leaderMessages: initialLeaderMessages,
    teachers: initialTeachers,
    students: initialStudents,
    timetable: initialTimetableSlots,
    remarks: initialRemarks,
    attendance: initialAttendance,
    results: initialStudentResults,
    leavingCertificates: initialLeavingCertificates,
    inquiries: initialInquiries,
    lastSyncedAt: new Date().toISOString(),
    version: 1,
  };
}

// Ensure database directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// In-memory cache for ultra-fast, zero-race server reads
let cachedDb: SchoolDatabasePayload | null = null;

// Load database from disk or memory cache
export function readSchoolDatabase(): SchoolDatabasePayload {
  if (cachedDb && cachedDb.settings) {
    return cachedDb;
  }

  ensureDbDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.settings) {
        cachedDb = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading school database file:', error);
  }

  // If not found or invalid, create with initial data
  const initial = getInitialDatabase();
  writeSchoolDatabase(initial);
  cachedDb = initial;
  return initial;
}

// Write database to disk safely and atomically
export function writeSchoolDatabase(data: SchoolDatabasePayload): boolean {
  ensureDbDir();
  try {
    const payloadWithMeta: SchoolDatabasePayload = {
      ...data,
      lastSyncedAt: new Date().toISOString(),
      version: (data.version || 1) + 1,
    };
    // Update in-memory cache immediately so concurrent requests see the latest state
    cachedDb = payloadWithMeta;

    // Atomic write via temp file rename
    const tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(payloadWithMeta, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (error) {
    console.error('Error writing school database file:', error);
    return false;
  }
}

// Merge collections by id preserving existing records and users
export function mergeById<T extends { id: string }>(currentList: T[] = [], incomingList: T[] = []): T[] {
  const map = new Map<string, T>();
  // 1. Load current items
  for (const item of currentList) {
    if (item && item.id) {
      map.set(item.id, item);
    }
  }
  // 2. Merge incoming items
  for (const item of incomingList) {
    if (item && item.id) {
      const existing = map.get(item.id);
      map.set(item.id, existing ? { ...existing, ...item } : item);
    }
  }
  return Array.from(map.values());
}

// Register a new student or update an existing registration from any device over internet
export function registerStudentInDb(student: any): { success: boolean; student: any; totalStudents: number } {
  const db = readSchoolDatabase();
  const students = Array.isArray(db.students) ? [...db.students] : [];

  const existingIdx = students.findIndex((s: any) => s.id === student.id || (s.email && s.email.toLowerCase() === (student.email || '').toLowerCase()));
  let savedStudent: any;

  if (existingIdx >= 0) {
    // Update existing student registration without removing previous details
    savedStudent = { ...students[existingIdx], ...student };
    students[existingIdx] = savedStudent;
  } else {
    // Add new student registration at top
    savedStudent = {
      ...student,
      id: student.id || `s-${Date.now()}`,
      status: student.status || 'pending',
      admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
    };
    students.unshift(savedStudent);
  }

  const updatedDb: SchoolDatabasePayload = {
    ...db,
    students,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };

  writeSchoolDatabase(updatedDb);
  return { success: true, student: savedStudent, totalStudents: students.length };
}

// Register a new teacher or update teacher from any device
export function registerTeacherInDb(teacher: any): { success: boolean; teacher: any; totalTeachers: number } {
  const db = readSchoolDatabase();
  const teachers = Array.isArray(db.teachers) ? [...db.teachers] : [];

  const existingIdx = teachers.findIndex((t: any) => t.id === teacher.id || (t.email && t.email.toLowerCase() === (teacher.email || '').toLowerCase()) || (t.pid && t.pid === teacher.pid));
  let savedTeacher: any;

  if (existingIdx >= 0) {
    savedTeacher = { ...teachers[existingIdx], ...teacher };
    teachers[existingIdx] = savedTeacher;
  } else {
    savedTeacher = {
      ...teacher,
      id: teacher.id || `t-${Date.now()}`,
      status: teacher.status || 'pending',
      joinDate: teacher.joinDate || new Date().toISOString().split('T')[0],
    };
    teachers.unshift(savedTeacher);
  }

  const updatedDb: SchoolDatabasePayload = {
    ...db,
    teachers,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };

  writeSchoolDatabase(updatedDb);
  return { success: true, teacher: savedTeacher, totalTeachers: teachers.length };
}

// Update and save updates to disk without wiping omitted fields
export function updateSchoolDatabase(updates: Partial<SchoolDatabasePayload>): SchoolDatabasePayload {
  const current = readSchoolDatabase();

  // If updates explicitly provides a collection, use it directly (preserving admin deletes/re-orders)
  // If not provided in updates, safely retain the current database records
  const mergedStudents = updates.students !== undefined
    ? updates.students
    : current.students;

  const mergedTeachers = updates.teachers !== undefined
    ? updates.teachers
    : current.teachers;

  const mergedInquiries = updates.inquiries !== undefined
    ? updates.inquiries
    : current.inquiries;

  const mergedSettings = updates.settings
    ? { ...current.settings, ...updates.settings }
    : current.settings;

  // Sync leaderMessages with headmaster name if updated
  let mergedLeaderMessages = updates.leaderMessages !== undefined
    ? updates.leaderMessages
    : current.leaderMessages;

  if (mergedSettings?.headmasterName) {
    mergedLeaderMessages = mergedLeaderMessages.map((msg: any) => {
      if (msg.id === 'headmaster') {
        return { ...msg, name: mergedSettings.headmasterName };
      }
      return msg;
    });
  }

  const merged: SchoolDatabasePayload = {
    ...current,
    ...updates,
    settings: mergedSettings,
    students: mergedStudents,
    teachers: mergedTeachers,
    inquiries: mergedInquiries,
    leaderMessages: mergedLeaderMessages,
    timetable: updates.timetable !== undefined ? updates.timetable : current.timetable,
    remarks: updates.remarks !== undefined ? updates.remarks : current.remarks,
    attendance: updates.attendance !== undefined ? updates.attendance : current.attendance,
    results: updates.results !== undefined ? updates.results : current.results,
    leavingCertificates: updates.leavingCertificates !== undefined ? updates.leavingCertificates : current.leavingCertificates,
    lastSyncedAt: new Date().toISOString(),
    version: (current.version || 1) + 1,
  };

  writeSchoolDatabase(merged);
  return merged;
}

// Reset database to initial factory state
export function resetSchoolDatabase(): SchoolDatabasePayload {
  const initial = getInitialDatabase();
  writeSchoolDatabase(initial);
  return initial;
}
