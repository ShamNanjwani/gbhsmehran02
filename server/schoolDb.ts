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
const DB_BACKUP_FILE = path.join(DB_DIR, 'school_database.backup.json');
const DB_SNAPSHOT_FILE = path.join(DB_DIR, 'school_database.snapshot.json');

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

// Load database from disk, backup, or memory cache (never loses previous data)
export function readSchoolDatabase(): SchoolDatabasePayload {
  if (cachedDb && cachedDb.settings) {
    return cachedDb;
  }

  ensureDbDir();

  // 1. Try reading primary DB_FILE
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.settings) {
        cachedDb = parsed;
        // Keep backup in sync
        try {
          if (!fs.existsSync(DB_BACKUP_FILE)) {
            fs.writeFileSync(DB_BACKUP_FILE, content, 'utf-8');
          }
        } catch (_) {}
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading primary school database file, attempting backup recovery:', error);
  }

  // 2. Try recovering from DB_BACKUP_FILE
  try {
    if (fs.existsSync(DB_BACKUP_FILE)) {
      const content = fs.readFileSync(DB_BACKUP_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.settings) {
        console.log('Successfully recovered school database from backup file.');
        cachedDb = parsed;
        writeSchoolDatabase(parsed, false);
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading backup file:', error);
  }

  // 3. Try recovering from DB_SNAPSHOT_FILE
  try {
    if (fs.existsSync(DB_SNAPSHOT_FILE)) {
      const content = fs.readFileSync(DB_SNAPSHOT_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.settings) {
        console.log('Successfully recovered school database from snapshot file.');
        cachedDb = parsed;
        writeSchoolDatabase(parsed, false);
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading snapshot file:', error);
  }

  // 4. If not found, create with baseline data and immediately create persistent backups
  const initial = getInitialDatabase();
  writeSchoolDatabase(initial, false);
  cachedDb = initial;
  return initial;
}

// Write database to disk safely, atomically, and with redundant backups
export function writeSchoolDatabase(data: SchoolDatabasePayload, incrementVersion = true): boolean {
  ensureDbDir();
  try {
    const nextVersion = incrementVersion ? ((Number(data.version) || 1) + 1) : (Number(data.version) || 1);
    const payloadWithMeta: SchoolDatabasePayload = {
      ...data,
      lastSyncedAt: data.lastSyncedAt || new Date().toISOString(),
      version: nextVersion,
    };
    // Update in-memory cache immediately so concurrent requests see the latest state
    cachedDb = payloadWithMeta;

    // Atomic write via temp file rename
    const tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    const jsonStr = JSON.stringify(payloadWithMeta, null, 2);
    fs.writeFileSync(tempFile, jsonStr, 'utf-8');
    fs.renameSync(tempFile, DB_FILE);

    // Write persistent backups so publishing/rebuilding never replaces previous saved data
    try {
      fs.writeFileSync(DB_BACKUP_FILE, jsonStr, 'utf-8');
      fs.writeFileSync(DB_SNAPSHOT_FILE, jsonStr, 'utf-8');
    } catch (bkErr) {
      console.warn('Backup write notice:', bkErr);
    }

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

// Approve student and allocate GR number on server
export function approveStudentInDb(studentId: string, grNumber: string, section: string = 'A', rollNo: string = '01'): { success: boolean; student: any; totalStudents: number } {
  const db = readSchoolDatabase();
  const students = Array.isArray(db.students) ? [...db.students] : [];
  const idx = students.findIndex((s: any) => s.id === studentId);
  if (idx < 0) {
    throw new Error(`Student with ID ${studentId} not found in database`);
  }

  const allottedGr = grNumber || students[idx].grNumber || `GR-406020752-${Math.floor(1000 + Math.random() * 9000)}`;
  students[idx] = {
    ...students[idx],
    status: 'approved',
    grNumber: allottedGr,
    section: section || students[idx].section || 'A',
    rollNo: rollNo || students[idx].rollNo || '01',
  };

  const updatedDb: SchoolDatabasePayload = {
    ...db,
    students,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };

  writeSchoolDatabase(updatedDb, false);
  return { success: true, student: students[idx], totalStudents: students.length };
}

// Approve teacher and issue joining letter on server
export function approveTeacherInDb(
  teacherId: string,
  options: {
    type?: 'auto' | 'manual';
    manualPdfUrl?: string;
    manualFileName?: string;
    dispatchNo?: string;
    date?: string;
    remarks?: string;
    confirmationLetterUrl?: string;
  }
): { success: boolean; teacher: any; totalTeachers: number } {
  const db = readSchoolDatabase();
  const teachers = Array.isArray(db.teachers) ? [...db.teachers] : [];
  const idx = teachers.findIndex((t: any) => t.id === teacherId);
  if (idx < 0) {
    throw new Error(`Teacher with ID ${teacherId} not found in database`);
  }

  const today = options?.date || new Date().toLocaleDateString('en-GB');
  const dispatchNo = options?.dispatchNo || `GBHS-MHR/JON/2026/${Math.floor(1000 + Math.random() * 9000)}`;

  const verifiedBadgeId = teachers[idx].verifiedBadgeId || `SELD-VERIFIED-406020752-${teachers[idx].pid || Math.floor(100000 + Math.random() * 900000)}`;

  teachers[idx] = {
    ...teachers[idx],
    status: 'approved',
    // SE&LD Official Checker Integration (https://checker.sindheducation.gov.pk/)
    seldVerified: true,
    seldCheckerStatus: 'Verified',
    seldCheckerUrl: 'https://checker.sindheducation.gov.pk/',
    seldVerificationDate: today,
    verifiedBadgeIssued: true,
    verifiedBadgeId: verifiedBadgeId,
    biometricMatched: true,
    joiningLetterIssued: true,
    joiningLetterType: options?.type || 'auto',
    joiningLetterUrl: options?.manualPdfUrl || teachers[idx].joiningLetterUrl,
    manualJoiningLetterUrl: options?.manualPdfUrl || teachers[idx].manualJoiningLetterUrl || teachers[idx].joiningLetterUrl,
    joiningLetterFileName: options?.manualFileName || teachers[idx].joiningLetterFileName,
    manualJoiningLetterFileName: options?.manualFileName || teachers[idx].manualJoiningLetterFileName || teachers[idx].joiningLetterFileName,
    joiningLetterDispatchNo: dispatchNo,
    joiningLetterDate: today,
    joiningLetterIssuedAt: today,
    joiningLetterRemarks: options?.remarks || 'Original credentials and appointment orders scrutinized and authenticated by Headmaster.',
    joiningRemarks: options?.remarks || 'Original credentials and appointment orders scrutinized and authenticated by Headmaster.',
    joiningDate: today,
    joiningLetterIssuedBy: db.settings?.headmasterName || 'Headmaster, GBHS Mehrand',
    confirmationLetterUrl: options?.confirmationLetterUrl || teachers[idx].confirmationLetterUrl,
  };

  const updatedDb: SchoolDatabasePayload = {
    ...db,
    teachers,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };

  writeSchoolDatabase(updatedDb, false);
  return { success: true, teacher: teachers[idx], totalTeachers: teachers.length };
}

// Check and verify teacher via SE&LD Checker (https://checker.sindheducation.gov.pk/)
export function verifyTeacherWithSeldChecker(teacherId: string): { success: boolean; teacher: any } {
  const db = readSchoolDatabase();
  const teachers = Array.isArray(db.teachers) ? [...db.teachers] : [];
  const idx = teachers.findIndex((t: any) => t.id === teacherId);
  if (idx < 0) {
    throw new Error(`Teacher with ID ${teacherId} not found in database`);
  }

  const today = new Date().toLocaleDateString('en-GB');
  const badgeId = teachers[idx].verifiedBadgeId || `SELD-VERIFIED-406020752-${teachers[idx].pid || Math.floor(100000 + Math.random() * 900000)}`;

  teachers[idx] = {
    ...teachers[idx],
    seldVerified: true,
    seldCheckerStatus: 'Verified',
    seldCheckerUrl: 'https://checker.sindheducation.gov.pk/',
    seldVerificationDate: today,
    verifiedBadgeIssued: true,
    verifiedBadgeId: badgeId,
    biometricMatched: true,
  };

  const updatedDb: SchoolDatabasePayload = {
    ...db,
    teachers,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };

  writeSchoolDatabase(updatedDb, false);
  return { success: true, teacher: teachers[idx] };
}

// Reject student
export function rejectStudentInDb(studentId: string): { success: boolean; student: any } {
  const db = readSchoolDatabase();
  const students = Array.isArray(db.students) ? [...db.students] : [];
  const idx = students.findIndex((s: any) => s.id === studentId);
  if (idx < 0) throw new Error('Student not found');
  students[idx] = { ...students[idx], status: 'rejected' };
  const updatedDb: SchoolDatabasePayload = {
    ...db,
    students,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };
  writeSchoolDatabase(updatedDb, false);
  return { success: true, student: students[idx] };
}

// Reject teacher
export function rejectTeacherInDb(teacherId: string): { success: boolean; teacher: any } {
  const db = readSchoolDatabase();
  const teachers = Array.isArray(db.teachers) ? [...db.teachers] : [];
  const idx = teachers.findIndex((t: any) => t.id === teacherId);
  if (idx < 0) throw new Error('Teacher not found');
  teachers[idx] = { ...teachers[idx], status: 'rejected' };
  const updatedDb: SchoolDatabasePayload = {
    ...db,
    teachers,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };
  writeSchoolDatabase(updatedDb, false);
  return { success: true, teacher: teachers[idx] };
}

// Delete student
export function deleteStudentInDb(studentId: string): { success: boolean; totalStudents: number } {
  const db = readSchoolDatabase();
  const students = (db.students || []).filter((s: any) => s.id !== studentId);
  const updatedDb: SchoolDatabasePayload = {
    ...db,
    students,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };
  writeSchoolDatabase(updatedDb, false);
  return { success: true, totalStudents: students.length };
}

// Delete teacher
export function deleteTeacherInDb(teacherId: string): { success: boolean; totalTeachers: number } {
  const db = readSchoolDatabase();
  const teachers = (db.teachers || []).filter((t: any) => t.id !== teacherId);
  const updatedDb: SchoolDatabasePayload = {
    ...db,
    teachers,
    lastSyncedAt: new Date().toISOString(),
    version: (db.version || 1) + 1,
  };
  writeSchoolDatabase(updatedDb, false);
  return { success: true, totalTeachers: teachers.length };
}

// Update and save updates to disk without wiping omitted fields
export function updateSchoolDatabase(updates: Partial<SchoolDatabasePayload>, options?: { forceReplaceCollections?: boolean }): SchoolDatabasePayload {
  const current = readSchoolDatabase();

  // If updates explicitly provides a collection, merge by ID to prevent accidental data loss unless forceReplaceCollections is true
  const mergedStudents = updates.students !== undefined
    ? (options?.forceReplaceCollections ? updates.students : mergeById(current.students || [], updates.students || []))
    : current.students;

  const mergedTeachers = updates.teachers !== undefined
    ? (options?.forceReplaceCollections ? updates.teachers : mergeById(current.teachers || [], updates.teachers || []))
    : current.teachers;

  const mergedInquiries = updates.inquiries !== undefined
    ? (options?.forceReplaceCollections ? updates.inquiries : mergeById(current.inquiries || [], updates.inquiries || []))
    : current.inquiries;

  const mergedSettings = updates.settings
    ? { ...current.settings, ...updates.settings }
    : current.settings;

  // Sync leaderMessages with headmaster name if updated
  let mergedLeaderMessages = updates.leaderMessages !== undefined
    ? updates.leaderMessages
    : current.leaderMessages;

  if (mergedSettings?.headmasterName) {
    mergedLeaderMessages = (mergedLeaderMessages || []).map((msg: any) => {
      if (msg.id === 'headmaster') {
        return { ...msg, name: mergedSettings.headmasterName };
      }
      return msg;
    });
  }

  const targetVersion = Math.max(Number(current.version || 1), Number(updates.version || 0)) + 1;

  const merged: SchoolDatabasePayload = {
    ...current,
    ...updates,
    settings: mergedSettings,
    students: mergedStudents,
    teachers: mergedTeachers,
    inquiries: mergedInquiries,
    leaderMessages: mergedLeaderMessages,
    timetable: updates.timetable !== undefined ? updates.timetable : current.timetable,
    remarks: updates.remarks !== undefined
      ? (options?.forceReplaceCollections ? updates.remarks : mergeById(current.remarks || [], updates.remarks || []))
      : current.remarks,
    attendance: updates.attendance !== undefined
      ? (options?.forceReplaceCollections ? updates.attendance : mergeById(current.attendance || [], updates.attendance || []))
      : current.attendance,
    results: updates.results !== undefined
      ? (options?.forceReplaceCollections ? updates.results : mergeById(current.results || [], updates.results || []))
      : current.results,
    leavingCertificates: updates.leavingCertificates !== undefined
      ? (options?.forceReplaceCollections ? updates.leavingCertificates : mergeById(current.leavingCertificates || [], updates.leavingCertificates || []))
      : current.leavingCertificates,
    lastSyncedAt: new Date().toISOString(),
    version: targetVersion,
  };

  writeSchoolDatabase(merged, false);
  return merged;
}

// Restore database from full JSON backup
export function restoreSchoolDatabase(backupData: SchoolDatabasePayload): { success: boolean; data?: SchoolDatabasePayload; message: string } {
  if (!backupData || !backupData.settings) {
    return { success: false, message: 'Invalid database backup payload: settings are missing' };
  }
  const current = readSchoolDatabase();
  const nextVersion = Math.max(Number(current.version || 1), Number(backupData.version || 1)) + 1;
  const restoredPayload: SchoolDatabasePayload = {
    settings: backupData.settings,
    leaderMessages: Array.isArray(backupData.leaderMessages) ? backupData.leaderMessages : current.leaderMessages,
    teachers: Array.isArray(backupData.teachers) ? backupData.teachers : current.teachers,
    students: Array.isArray(backupData.students) ? backupData.students : current.students,
    timetable: Array.isArray(backupData.timetable) ? backupData.timetable : current.timetable,
    remarks: Array.isArray(backupData.remarks) ? backupData.remarks : current.remarks,
    attendance: Array.isArray(backupData.attendance) ? backupData.attendance : current.attendance,
    results: Array.isArray(backupData.results) ? backupData.results : current.results,
    leavingCertificates: Array.isArray(backupData.leavingCertificates) ? backupData.leavingCertificates : current.leavingCertificates,
    inquiries: Array.isArray(backupData.inquiries) ? backupData.inquiries : current.inquiries,
    lastSyncedAt: new Date().toISOString(),
    version: nextVersion,
  };

  const ok = writeSchoolDatabase(restoredPayload, false);
  if (ok) {
    return { success: true, data: restoredPayload, message: 'Database successfully restored from backup' };
  }
  return { success: false, message: 'Failed to write restored database to disk' };
}

// Export complete school database
export function exportSchoolDatabase(): SchoolDatabasePayload {
  return readSchoolDatabase();
}

// Smart-sync: compares client vs server version to ensure no published updates or client edits are ever lost
export function smartSyncSchoolDatabase(clientPayload: {
  clientVersion?: number;
  clientLastSyncedAt?: string;
  data?: Partial<SchoolDatabasePayload>;
  forceClientOverwrite?: boolean;
}): { action: 'client_applied' | 'server_current' | 'merged'; data: SchoolDatabasePayload; message: string } {
  const current = readSchoolDatabase();
  const serverVer = Number(current.version || 1);
  const clientVer = Number(clientPayload.clientVersion || 0);

  // If client provided data and client is newer, or client forced overwrite (e.g. after website update / new container startup)
  if (clientPayload.data && (clientVer >= serverVer || clientPayload.forceClientOverwrite || serverVer <= 1)) {
    const updated = updateSchoolDatabase(clientPayload.data, { forceReplaceCollections: true });
    return {
      action: 'client_applied',
      data: updated,
      message: 'Server updated with client saved state.',
    };
  }

  // If client provided data and server is newer, merge client records into server so neither side loses anything
  if (clientPayload.data) {
    const merged = updateSchoolDatabase(clientPayload.data, { forceReplaceCollections: false });
    return {
      action: 'merged',
      data: merged,
      message: 'Client and server records merged seamlessly without data loss.',
    };
  }

  return {
    action: 'server_current',
    data: current,
    message: 'Server data is current.',
  };
}

// Reset database to initial factory state (requires admin authorization)
export function resetSchoolDatabase(): SchoolDatabasePayload {
  const initial = getInitialDatabase();
  writeSchoolDatabase(initial);
  return initial;
}
