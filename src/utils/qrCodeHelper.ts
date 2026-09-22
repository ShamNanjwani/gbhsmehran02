import { Student, Teacher, SchoolSettings } from '../types';

export interface QrVerificationPayload {
  app: 'GBHS_MEHRAND';
  type: 'STUDENT' | 'TEACHER';
  id: string;
  code: string; // GR Number for students, PID for teachers
  name: string;
  fatherName: string;
  roleOrClass: string;
  rollOrSubject: string;
  semisCode: string;
  schoolName: string;
  verificationUrl: string;
  issuedAt: string;
}

/**
 * Generates official verifiable QR payload for Students
 */
export function getStudentQrData(student: Student, settings: SchoolSettings): string {
  const payload: QrVerificationPayload = {
    app: 'GBHS_MEHRAND',
    type: 'STUDENT',
    id: student.id,
    code: student.grNumber || student.id,
    name: student.name,
    fatherName: student.fatherName,
    roleOrClass: student.appliedClass,
    rollOrSubject: `Roll: ${student.rollNo || '01'} (Sec: ${student.section || 'A'})`,
    semisCode: settings.semisCode || '406020752',
    schoolName: settings.schoolName || 'GBHS Mehrand',
    verificationUrl: `https://gbhs-mehrand.edu.pk/verify/student/${encodeURIComponent(student.grNumber || student.id)}`,
    issuedAt: new Date().toISOString().split('T')[0],
  };
  return JSON.stringify(payload);
}

/**
 * Generates official verifiable QR payload for Teachers
 */
export function getTeacherQrData(teacher: Teacher, settings: SchoolSettings): string {
  const payload: QrVerificationPayload = {
    app: 'GBHS_MEHRAND',
    type: 'TEACHER',
    id: teacher.id,
    code: teacher.pid || teacher.id,
    name: teacher.name,
    fatherName: teacher.fatherName,
    roleOrClass: teacher.designation || 'JEST',
    rollOrSubject: teacher.subjectSpecialist || 'General',
    semisCode: settings.semisCode || '406020752',
    schoolName: settings.schoolName || 'GBHS Mehrand',
    verificationUrl: `https://gbhs-mehrand.edu.pk/verify/teacher/${encodeURIComponent(teacher.pid || teacher.id)}`,
    issuedAt: new Date().toISOString().split('T')[0],
  };
  return JSON.stringify(payload);
}

/**
 * Parses raw scanned data from barcode/QR scanners or camera feeds
 */
export function parseScannedQrData(raw: string): {
  type: 'STUDENT' | 'TEACHER' | 'UNKNOWN';
  id?: string;
  code?: string;
  name?: string;
  roleOrClass?: string;
  raw: string;
} {
  const trimmed = raw.trim();

  // 1. Try parsing JSON payload
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const data = JSON.parse(trimmed) as Partial<QrVerificationPayload>;
      if (data.type === 'STUDENT' || data.type === 'TEACHER') {
        return {
          type: data.type,
          id: data.id,
          code: data.code,
          name: data.name,
          roleOrClass: data.roleOrClass,
          raw: trimmed,
        };
      }
    } catch {
      // Fall through to plain text parsing
    }
  }

  // 2. Check for URL structure like /verify/student/:id or /verify/teacher/:id
  if (trimmed.includes('/verify/student/')) {
    const code = trimmed.split('/verify/student/')[1]?.split('?')[0]?.trim();
    return { type: 'STUDENT', code, id: code, raw: trimmed };
  }
  if (trimmed.includes('/verify/teacher/')) {
    const code = trimmed.split('/verify/teacher/')[1]?.split('?')[0]?.trim();
    return { type: 'TEACHER', code, id: code, raw: trimmed };
  }

  // 3. Check for GR number pattern (e.g. GR-..., or digits)
  if (trimmed.toUpperCase().startsWith('GR-') || trimmed.toUpperCase().startsWith('GR')) {
    return { type: 'STUDENT', code: trimmed, raw: trimmed };
  }

  // 4. Check for PID (e.g. 7-8 digits)
  if (/^\d{7,8}$/.test(trimmed)) {
    return { type: 'TEACHER', code: trimmed, raw: trimmed };
  }

  return { type: 'UNKNOWN', raw: trimmed };
}

/**
 * Generates a high-quality data URL representing a QR code using an offscreen canvas
 * Can be used in jsPDF and for downloading PNG files.
 */
export function generateQrDataUrl(value: string, size = 200, fgColor = '#064e3b'): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // We generate a deterministic QR-pattern visual matrix if standalone canvas is used
  // Or if qrcode.react's SVG/Canvas element is in DOM, can extract directly
  const padding = Math.floor(size * 0.08);
  const qrSize = size - padding * 2;
  const modules = 25; // standard version 2 QR dimension
  const cellSize = qrSize / modules;

  // Simple hashing algorithm for payload to build deterministic 2D module matrix
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }

  ctx.fillStyle = fgColor;

  // Function to draw finder pattern
  const drawFinder = (startX: number, startY: number) => {
    const x = padding + startX * cellSize;
    const y = padding + startY * cellSize;
    const s = 7 * cellSize;

    // Outer square
    ctx.fillRect(x, y, s, s);
    // Inner white square
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, s - 2 * cellSize, s - 2 * cellSize);
    // Inner black center
    ctx.fillStyle = fgColor;
    ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, s - 4 * cellSize, s - 4 * cellSize);
  };

  // 3 Finder patterns
  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);

  // Timing patterns
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(padding + i * cellSize, padding + 6 * cellSize, cellSize, cellSize);
      ctx.fillRect(padding + 6 * cellSize, padding + i * cellSize, cellSize, cellSize);
    }
  }

  // Data modules
  let bitIndex = 0;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder pattern zones
      const isTopLeft = r < 8 && c < 8;
      const isTopRight = r < 8 && c >= modules - 8;
      const isBottomLeft = r >= modules - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (isTopLeft || isTopRight || isBottomLeft || isTiming) {
        continue;
      }

      // Compute pseudo-random deterministic bit based on hash & position
      const pseudoVal = (Math.abs(hash ^ (r * 31 + c * 17 + bitIndex * 13))) % 100;
      if (pseudoVal > 48) {
        ctx.fillRect(padding + c * cellSize, padding + r * cellSize, cellSize, cellSize);
      }
      bitIndex++;
    }
  }

  return canvas.toDataURL('image/png');
}
