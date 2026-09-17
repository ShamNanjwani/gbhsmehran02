import jsPDF from 'jspdf';
import {
  Student,
  Teacher,
  StudentResult,
  LeavingCertificateData,
  SchoolSettings,
  TimetableSlot,
  AttendanceRecord,
  DailyRemark,
} from '../types';

export interface IdCardOptions {
  colorScheme?: 'emerald' | 'navy' | 'maroon' | 'slate';
  showBloodGroup?: boolean;
  showEmergencyContact?: boolean;
  showAddress?: boolean;
  showQrCode?: boolean;
  showSignature?: boolean;
  academicSession?: string;
  validTill?: string;
  cardSize?: 'standard' | 'wallet'; // standard = 85.6x120mm badge; wallet = 85.6x54mm CR80 pocket card
}

interface ColorPalette {
  primary: [number, number, number];
  primaryDark: [number, number, number];
  accent: [number, number, number];
  textLight: [number, number, number];
}

function getColorPalette(scheme?: string): ColorPalette {
  switch (scheme) {
    case 'navy':
      return {
        primary: [30, 58, 138],
        primaryDark: [23, 37, 84],
        accent: [245, 158, 11],
        textLight: [239, 246, 255],
      };
    case 'maroon':
      return {
        primary: [136, 19, 55],
        primaryDark: [76, 5, 25],
        accent: [251, 191, 36],
        textLight: [255, 241, 242],
      };
    case 'slate':
      return {
        primary: [30, 41, 59],
        primaryDark: [15, 23, 42],
        accent: [217, 119, 6],
        textLight: [248, 250, 252],
      };
    case 'emerald':
    default:
      return {
        primary: [6, 78, 59],
        primaryDark: [2, 44, 34],
        accent: [217, 119, 6],
        textLight: [236, 253, 245],
      };
  }
}

function safeAddImage(
  doc: jsPDF,
  imageData: string | undefined,
  x: number,
  y: number,
  w: number,
  h: number
): boolean {
  if (!imageData) return false;
  try {
    if (imageData.startsWith('data:image/')) {
      const isPng = imageData.includes('image/png');
      doc.addImage(imageData, isPng ? 'PNG' : 'JPEG', x, y, w, h, undefined, 'FAST');
      return true;
    }
    if (imageData.startsWith('http')) {
      doc.addImage(imageData, 'JPEG', x, y, w, h, undefined, 'FAST');
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function drawQrVerificationBox(doc: jsPDF, x: number, y: number, size: number) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.rect(x, y, size, size, 'FD');

  const p = size / 7;
  const drawMarker = (mx: number, my: number) => {
    doc.setFillColor(15, 23, 42);
    doc.rect(mx, my, p * 2.2, p * 2.2, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(mx + p * 0.4, my + p * 0.4, p * 1.4, p * 1.4, 'F');
    doc.setFillColor(15, 23, 42);
    doc.rect(mx + p * 0.7, my + p * 0.7, p * 0.8, p * 0.8, 'F');
  };

  drawMarker(x + 0.5, y + 0.5);
  drawMarker(x + size - p * 2.2 - 0.5, y + 0.5);
  drawMarker(x + 0.5, y + size - p * 2.2 - 0.5);

  doc.setFillColor(15, 23, 42);
  doc.rect(x + size / 2 - 0.6, y + size / 2 - 0.6, 1.2, 1.2, 'F');
  doc.rect(x + size / 2 + 1.2, y + size / 2 - 1.2, 0.9, 0.9, 'F');
  doc.rect(x + size / 2 - 1.8, y + size / 2 + 1, 0.9, 0.9, 'F');
  doc.rect(x + size - 2, y + size - 2, 1, 1, 'F');
}

export function renderStudentIdCardOnDoc(
  doc: jsPDF,
  student: Student,
  settings: SchoolSettings,
  x: number,
  y: number,
  options?: IdCardOptions
) {
  const palette = getColorPalette(options?.colorScheme);
  const cardW = 85.6;
  const cardH = 120;

  // 1. Card Background & Outer Frame
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, cardW, cardH, 'F');
  doc.setDrawColor(palette.primary[0], palette.primary[1], palette.primary[2]);
  doc.setLineWidth(0.5);
  doc.rect(x, y, cardW, cardH, 'S');

  // 2. Header Banner
  const headerH = 25;
  doc.setFillColor(palette.primary[0], palette.primary[1], palette.primary[2]);
  doc.rect(x, y, cardW, headerH, 'F');

  // Golden accent stripe
  doc.setFillColor(palette.accent[0], palette.accent[1], palette.accent[2]);
  doc.rect(x, y + headerH, cardW, 1.4, 'F');

  // School Logo in Header (or vector crest placeholder)
  const logoX = x + 3.5;
  const logoY = y + 2.5;
  const logoSize = 9;
  const hasLogo = safeAddImage(doc, settings.logoUrl, logoX, logoY, logoSize, logoSize);
  if (!hasLogo) {
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX + 4.5, logoY + 4.5, 4.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(palette.primary[0], palette.primary[1], palette.primary[2]);
    doc.text('GBHS', logoX + 4.5, logoY + 5.5, { align: 'center' });
  }

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.text('GOVT. OF SINDH • SCHOOL EDUCATION & LITERACY DEPT', x + 44, y + 4.5, { align: 'center' });

  doc.setFontSize(7);
  doc.text((settings.schoolName || 'GOVT. BOYS HIGH SCHOOL MEHRAND').toUpperCase(), x + 44, y + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.text(`TALUKA KALOI, THARPARKAR • SEMIS: ${settings.semisCode || '406020752'}`, x + 44, y + 14.5, { align: 'center' });

  // Gold badge: STUDENT IDENTITY CARD
  doc.setFillColor(palette.accent[0], palette.accent[1], palette.accent[2]);
  doc.rect(x + 19, y + 17.5, 48, 5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('OFFICIAL STUDENT IDENTITY CARD', x + 43, y + 21, { align: 'center' });

  // 3. Photo Box & Badges Row
  const photoX = x + 5;
  const photoY = y + 29;
  const photoW = 24;
  const photoH = 29;

  doc.setDrawColor(palette.primary[0], palette.primary[1], palette.primary[2]);
  doc.setLineWidth(0.4);
  doc.rect(photoX, photoY, photoW, photoH, 'S');

  const hasPhoto = safeAddImage(doc, student.studentPictureUrl, photoX + 0.3, photoY + 0.3, photoW - 0.6, photoH - 0.6);
  if (!hasPhoto) {
    doc.setFillColor(241, 245, 249);
    doc.rect(photoX + 0.3, photoY + 0.3, photoW - 0.6, photoH - 0.6, 'F');
    // Initials Avatar
    doc.setFillColor(palette.primary[0], palette.primary[1], palette.primary[2]);
    doc.circle(photoX + photoW / 2, photoY + 11, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const initials = student.name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'ST';
    doc.text(initials, photoX + photoW / 2, photoY + 13.5, { align: 'center' });

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(5);
    doc.text('OFFICIAL PHOTO', photoX + photoW / 2, photoY + 23, { align: 'center' });
  }

  // Badges Next to Photo (X = x + 31.5)
  const badgeX = x + 31.5;
  const badgeW = 49;

  // GR Number Banner (Red / Crimson)
  doc.setFillColor(254, 242, 242);
  doc.rect(badgeX, photoY, badgeW, 7.5, 'F');
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.3);
  doc.rect(badgeX, photoY, badgeW, 7.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(185, 28, 28);
  doc.text('GENERAL REGISTER (G.R.) NO', badgeX + 2, photoY + 3.2);
  doc.setFontSize(7.5);
  doc.text(student.grNumber || 'PENDING ALLOTMENT', badgeX + 2, photoY + 6.3);

  // Class & Section Box
  doc.setFillColor(palette.textLight[0], palette.textLight[1], palette.textLight[2]);
  doc.rect(badgeX, photoY + 8.5, badgeW, 6.5, 'F');
  doc.setDrawColor(palette.primary[0], palette.primary[1], palette.primary[2]);
  doc.setLineWidth(0.25);
  doc.rect(badgeX, photoY + 8.5, badgeW, 6.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(palette.primary[0], palette.primary[1], palette.primary[2]);
  doc.text(`CLASS: ${student.appliedClass.toUpperCase()}`, badgeX + 2, photoY + 13);
  doc.text(`SEC: ${student.section || 'A'}`, badgeX + 36, photoY + 13);

  // Roll Number & Blood Group Box
  doc.setFillColor(248, 250, 252);
  doc.rect(badgeX, photoY + 16, badgeW, 6.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.25);
  doc.rect(badgeX, photoY + 16, badgeW, 6.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`ROLL NO: ${student.rollNo || '01'}`, badgeX + 2, photoY + 20.5);
  if (options?.showBloodGroup !== false) {
    doc.setTextColor(220, 38, 38);
    doc.text(`BLOOD: ${student.bloodGroup || 'B+'}`, badgeX + 32, photoY + 20.5);
  }

  // Academic Session Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(100, 116, 139);
  doc.text(`SESSION: ${options?.academicSession || '2026-2027'} • ADM: ${student.admissionDate || '2026'}`, badgeX + 2, photoY + 26);

  // 4. Student Full Name & Parentage Bar
  const nameY = y + 61.5;
  doc.setFillColor(248, 250, 252);
  doc.rect(x + 5, nameY, cardW - 10, 8, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.25);
  doc.rect(x + 5, nameY, cardW - 10, 8, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(student.name.toUpperCase(), x + cardW / 2, nameY + 4, { align: 'center' });

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text(`S/O ${student.fatherName.toUpperCase()}`, x + cardW / 2, nameY + 7, { align: 'center' });

  // 5. Details Table (Two Columns)
  const infoStartY = y + 72.5;
  const lineGap = 4.2;

  const infoRows: [string, string][] = [
    ['B-Form / CNIC:', student.cnicBForm],
    ['Date of Birth:', student.dob],
  ];

  if (options?.showEmergencyContact !== false) {
    infoRows.push(['Emergency Cell:', student.fatherMobile]);
  }

  if (options?.showAddress !== false) {
    const addr = `${student.address.mohVillage || ''}, ${student.address.townCity || ''}`.trim();
    infoRows.push(['Address:', addr.length > 28 ? addr.substring(0, 26) + '...' : addr]);
  }

  const validText = options?.validTill || settings.enrollmentCardValidTill || '31st May 2027';
  infoRows.push(['Valid Till:', validText.length > 28 ? validText.substring(0, 26) + '...' : validText]);

  infoRows.forEach(([lbl, val], idx) => {
    const rowY = infoStartY + idx * lineGap;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text(lbl, x + 6, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(15, 23, 42);
    doc.text(String(val), x + 30, rowY);

    // Subtle dotted divider
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.15);
    doc.line(x + 6, rowY + 1, x + cardW - 6, rowY + 1);
  });

  // 6. Verification & Signatures Row
  const sigY = y + 96;

  // Student Sign
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(5);
  doc.setTextColor(100, 116, 139);
  doc.text('Student Sign', x + 12, sigY + 9);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(x + 6, sigY + 7, x + 24, sigY + 7);

  // QR Code Verification Box
  if (options?.showQrCode !== false) {
    drawQrVerificationBox(doc, x + 37, sigY, 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(3.8);
    doc.setTextColor(100, 116, 139);
    doc.text('VERIFY', x + 42.5, sigY + 13, { align: 'center' });
  }

  // Headmaster Signature & Seal
  if (options?.showSignature !== false) {
    const hmSignX = x + 58;
    const hasHmSign = safeAddImage(doc, settings.headmasterSignatureUrl, hmSignX, sigY - 1, 20, 8);
    if (!hasHmSign) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5);
      doc.setTextColor(palette.primary[0], palette.primary[1], palette.primary[2]);
      doc.text(settings.headmasterName || 'HEADMASTER', hmSignX + 11, sigY + 4, { align: 'center' });
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.8);
    doc.setTextColor(palette.primary[0], palette.primary[1], palette.primary[2]);
    doc.text('HM Official Seal', hmSignX + 11, sigY + 9, { align: 'center' });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(hmSignX, sigY + 7, hmSignX + 22, sigY + 7);
  }

  // 7. Bottom Sindh Education Dept Stripe
  const footY = y + 116;
  doc.setFillColor(palette.primary[0], palette.primary[1], palette.primary[2]);
  doc.rect(x, footY, cardW, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.text('GBHS MEHRAND • IF FOUND RETURN TO SCHOOL OFFICE (TALUKA KALOI)', x + cardW / 2, footY + 2.6, { align: 'center' });
}

export function downloadStudentIdCardPDF(student: Student, settings: SchoolSettings, options?: IdCardOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [85.6, 125], // Standard ID card / badge dimension
  });

  renderStudentIdCardOnDoc(doc, student, settings, 0, 2.5, options);

  const cleanName = student.name.replace(/\s+/g, '_');
  doc.save(`GBHS_Mehrand_IDCard_${cleanName}.pdf`);
}

/**
 * Auto-generates a high-quality multi-card printable A4 PDF sheet for batch printing.
 * Prints 4 standard cards per A4 page (2x2 grid) with scissor cutting guides.
 */
export async function downloadBatchStudentIdCardsPDF(
  students: Student[],
  settings: SchoolSettings,
  options?: IdCardOptions
): Promise<void> {
  if (!students || students.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210mm x 297mm
  });

  const cardsPerPage = 4; // 2x2 grid
  const colPositions = [14, 110.4]; // Left coordinates for Column 1 and Column 2 (cardW = 85.6mm)
  const rowPositions = [18, 150]; // Top coordinates for Row 1 and Row 2 (cardH = 120mm)

  const totalPages = Math.ceil(students.length / cardsPerPage);

  students.forEach((student, index) => {
    const pageIndex = Math.floor(index / cardsPerPage);
    const slotOnPage = index % cardsPerPage;

    if (slotOnPage === 0 && pageIndex > 0) {
      doc.addPage('a4', 'portrait');
    }

    const col = slotOnPage % 2;
    const row = Math.floor(slotOnPage / 2);
    const cardX = colPositions[col];
    const cardY = rowPositions[row];

    // Draw light dashed cutting guide lines around card with scissor indicator
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(cardX - 1.5, cardY - 1.5, 85.6 + 3, 120 + 3, 'S');
    doc.setLineDashPattern([], 0); // reset line dash

    // Scissor cut guide label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4);
    doc.setTextColor(148, 163, 184);
    doc.text('✂ Cut along border', cardX + 1, cardY - 2);

    // Render the complete ID card
    renderStudentIdCardOnDoc(doc, student, settings, cardX, cardY, options);

    // On the first slot of each page, add the official page header & footer
    if (slotOnPage === 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(6, 78, 59);
      doc.text(
        `GOVERNMENT BOYS HIGH SCHOOL MEHRAND • OFFICIAL PRINTABLE STUDENT ID CARDS SHEET`,
        105,
        10,
        { align: 'center' }
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `SEMIS CODE: ${settings.semisCode} • TALUKA KALOI • PAGE ${pageIndex + 1} OF ${totalPages} • TOTAL CARDS: ${students.length}`,
        105,
        13.5,
        { align: 'center' }
      );

      // Bottom margin footer
      doc.text(
        `Certified System Output • Generated on ${new Date().toLocaleDateString('en-GB')} • Valid for Plastic Lamination & Badging`,
        105,
        290,
        { align: 'center' }
      );
    }
  });

  const timeStamp = new Date().toISOString().slice(0, 10);
  doc.save(`GBHS_Mehrand_StudentIDCards_Batch_${students.length}Cards_${timeStamp}.pdf`);
}

export function downloadEnrollmentCardPDF(student: Student, settings: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5',
  });

  // Outer ornate border
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(1.2);
  doc.rect(8, 8, 194, 132);
  doc.setLineWidth(0.4);
  doc.rect(10, 10, 190, 128);

  // Top header banner
  doc.setFillColor(6, 78, 59);
  doc.rect(10, 10, 190, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT BOYS HIGH SCHOOL MEHRAND', 105, 18, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('TALUKA KALOI, DISTRICT THARPARKAR @ MITHI (SINDH)', 105, 24, { align: 'center' });
  doc.text(`SEMIS CODE: ${settings.semisCode}  |  OFFICIAL ENROLLMENT CERTIFICATE`, 105, 30, { align: 'center' });

  // Certificate Title
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('ANNUAL ENROLLMENT & EXAMINATION ADMISSION SLIP', 105, 42, { align: 'center' });

  // Photo box
  doc.setDrawColor(6, 78, 59);
  doc.rect(160, 48, 30, 36);
  doc.setFillColor(243, 244, 246);
  doc.rect(160.5, 48.5, 29, 35, 'F');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text('Affix Passport Photo', 175, 66, { align: 'center' });

  // Student Details
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(9);

  const startY = 52;
  const step = 8;
  const labelX = 18;
  const valueX = 65;

  const details = [
    ['General Register (GR) Number:', student.grNumber || 'GR-406020752-PENDING'],
    ['Student Full Name:', student.name],
    ['Father\'s Name:', student.fatherName],
    ['Class Enrolled:', `${student.appliedClass}  - Section: ${student.section || 'A'}`],
    ['Roll Number:', student.rollNo || '01'],
    ['CNIC / B-Form Number:', student.cnicBForm],
    ['Date of Birth:', student.dob],
    ['Residential Address:', `${student.address.houseNo}, ${student.address.mohVillage}, ${student.address.townCity}, ${student.address.district}`],
    ['Enrollment Validity:', settings.enrollmentCardValidTill],
  ];

  details.forEach(([label, val], idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(label, labelX, startY + idx * step);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(idx === 0 ? 185 : 17, idx === 0 ? 28 : 24, idx === 0 ? 28 : 39);
    doc.text(String(val), valueX, startY + idx * step);
  });

  // Footer & signatures
  const footY = 126;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('Class Incharge Signature', 30, footY);
  doc.text('Student Thumb / Signature', 95, footY);
  doc.text('Headmaster Seal & Signature', 165, footY);

  doc.setDrawColor(156, 163, 175);
  doc.line(20, footY - 2, 60, footY - 2);
  doc.line(80, footY - 2, 130, footY - 2);
  doc.line(150, footY - 2, 195, footY - 2);

  doc.save(`GBHS_Mehrand_Enrollment_${student.name.replace(/\s+/g, '_')}.pdf`);
}

export function downloadResultSheetPDF(result: StudentResult, settings: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Border
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);

  // School Header
  doc.setFillColor(6, 78, 59);
  doc.rect(10, 10, 190, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT BOYS HIGH SCHOOL MEHRAND', 105, 20, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('TALUKA KALOI, DISTRICT THARPARKAR @ MITHI (SINDH)', 105, 26, { align: 'center' });
  doc.text(`SEMIS CODE: ${settings.semisCode}  |  OFFICIAL MARKS CERTIFICATE`, 105, 32, { align: 'center' });

  // Exam Title
  doc.setTextColor(180, 83, 9);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(result.examTerm.toUpperCase(), 105, 48, { align: 'center' });

  // Student Info Box
  doc.setDrawColor(209, 213, 219);
  doc.setFillColor(249, 250, 251);
  doc.rect(15, 54, 180, 24, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  doc.text(`Student Name: ${result.studentName}`, 20, 62);
  doc.text(`Father Name: ${result.fatherName}`, 110, 62);
  doc.text(`G.R. Number: ${result.grNumber}`, 20, 70);
  doc.text(`Class & Group: ${result.className}`, 110, 70);

  // Table Header
  const tableY = 86;
  doc.setFillColor(6, 78, 59);
  doc.rect(15, tableY, 180, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('S.No', 20, tableY + 5.5);
  doc.text('Subject Name', 35, tableY + 5.5);
  doc.text('Total Marks', 95, tableY + 5.5);
  doc.text('Obtained Marks', 130, tableY + 5.5);
  doc.text('Grade', 170, tableY + 5.5);

  // Table Rows
  let currentY = tableY + 8;
  result.subjects.forEach((sub, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 251);
    doc.rect(15, currentY, 180, 8, 'F');

    doc.setDrawColor(229, 231, 235);
    doc.line(15, currentY + 8, 195, currentY + 8);

    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`${i + 1}`, 22, currentY + 5.5);
    doc.text(sub.subject, 35, currentY + 5.5);
    doc.text(`${sub.totalMarks}`, 100, currentY + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sub.obtainedMarks}`, 135, currentY + 5.5);
    doc.text(sub.grade, 172, currentY + 5.5);

    currentY += 8;
  });

  // Total summary
  doc.setFillColor(243, 244, 246);
  doc.rect(15, currentY, 180, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('GRAND TOTAL', 35, currentY + 6.5);
  doc.text(`${result.totalMaxMarks}`, 100, currentY + 6.5);
  doc.text(`${result.totalObtainedMarks}`, 135, currentY + 6.5);
  doc.text(result.finalGrade, 172, currentY + 6.5);

  currentY += 16;

  // Analysis Cards
  doc.setFillColor(236, 253, 245);
  doc.rect(15, currentY, 55, 18, 'F');
  doc.rect(77, currentY, 55, 18, 'F');
  doc.rect(140, currentY, 55, 18, 'F');

  doc.setTextColor(6, 78, 59);
  doc.setFontSize(8);
  doc.text('PERCENTAGE', 42.5, currentY + 6, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`${result.percentage}%`, 42.5, currentY + 14, { align: 'center' });

  doc.setFontSize(8);
  doc.text('FINAL GRADE', 104.5, currentY + 6, { align: 'center' });
  doc.setFontSize(11);
  doc.text(result.finalGrade, 104.5, currentY + 14, { align: 'center' });

  doc.setFontSize(8);
  doc.text('CLASS POSITION', 167.5, currentY + 6, { align: 'center' });
  doc.setFontSize(11);
  doc.text(result.position, 167.5, currentY + 14, { align: 'center' });

  // Remarks
  currentY += 28;
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text('Headmaster / Incharge Remarks:', 15, currentY);
  doc.setFont('helvetica', 'italic');
  doc.text(`"${result.remarks}"`, 15, currentY + 6);

  // Signatures
  currentY += 36;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Class Teacher Signature', 25, currentY);
  doc.text('Controller of Examination', 90, currentY);
  doc.text('Headmaster Stamp & Signature', 150, currentY);

  doc.setDrawColor(156, 163, 175);
  doc.line(18, currentY - 2, 65, currentY - 2);
  doc.line(82, currentY - 2, 130, currentY - 2);
  doc.line(145, currentY - 2, 195, currentY - 2);

  doc.save(`GBHS_Mehrand_Result_${result.studentName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadLeavingCertificatePDF(cert: LeavingCertificateData, settings: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Double Ornate Border
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, 190, 277);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, 186, 273);

  // Header
  doc.setTextColor(6, 78, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('EDUCATION & LITERACY DEPARTMENT, GOVERNMENT OF SINDH', 105, 22, { align: 'center' });

  doc.setFontSize(18);
  doc.text('GOVERNMENT BOYS HIGH SCHOOL MEHRAND', 105, 32, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('TALUKA KALOI, DISTRICT THARPARKAR @ MITHI', 105, 38, { align: 'center' });
  doc.text(`SEMIS CODE: ${settings.semisCode}`, 105, 43, { align: 'center' });

  // Ribbon Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(40, 48, 130, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SCHOOL LEAVING CERTIFICATE (S.L.C)', 105, 54, { align: 'center' });

  // Serial & G.R
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(9);
  doc.text(`Book / Serial No: SLC-${cert.id}`, 20, 68);
  doc.setTextColor(220, 38, 38);
  doc.text(`General Register (G.R) No: ${cert.grNumber}`, 130, 68);

  // Certificate body lines
  const startY = 82;
  const lineSpacing = 12;

  const rows = [
    ['1. Name of Student (in full):', cert.studentName],
    ['2. Father\'s Name:', cert.fatherName],
    ['3. Caste / Religion:', cert.caste || 'Sindhi'],
    ['4. Place of Residence:', cert.residentOf],
    ['5. Date of Birth (in figures):', cert.dob],
    ['   Date of Birth (in words):', cert.dobWords || cert.dob],
    ['6. Class in which admitted:', 'Class 6th'],
    ['7. Date of Admission:', cert.dateOfAdmission],
    ['8. Last Class Attended:', cert.lastClassAttended],
    ['9. Date of Leaving School:', cert.dateOfLeaving],
    ['10. Reason for Leaving School:', cert.reasonForLeaving],
    ['11. Conduct & Character:', cert.conduct],
    ['12. Academic Progress:', cert.progress],
    ['13. Remarks / Clearance:', cert.remarks],
  ];

  rows.forEach(([label, value], i) => {
    const y = startY + i * lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(8.5);
    doc.text(label, 20, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(String(value), 80, y);

    // Dotted bottom line
    doc.setDrawColor(209, 213, 219);
    doc.line(80, y + 1.5, 185, y + 1.5);
  });

  // Footer / Clearance verification
  const footY = 258;
  doc.setFontSize(8.5);
  doc.setTextColor(17, 24, 39);
  doc.text(`Issue Date: ${cert.issueDate}`, 20, footY);

  doc.text('Prepared by (Junior Clerk)', 25, footY + 14);
  doc.text('Verified by (JEST / Class Teacher)', 85, footY + 14);
  doc.text('Headmaster Stamp & Signature', 145, footY + 14);

  doc.setDrawColor(156, 163, 175);
  doc.line(20, footY + 11, 70, footY + 11);
  doc.line(80, footY + 11, 135, footY + 11);
  doc.line(140, footY + 11, 190, footY + 11);

  doc.save(`GBHS_Mehrand_LeavingCertificate_${cert.studentName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadTeacherIdCardPDF(teacher: Teacher, settings: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [85.6, 125], // Standard ID card / badge dimension
  });

  // Background header
  doc.setFillColor(15, 118, 110); // Deep Teal
  doc.rect(0, 0, 85.6, 26, 'F');

  // Golden accent line
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 26, 85.6, 1.5, 'F');

  // Header texts
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVT. BOYS HIGH SCHOOL MEHRAND', 42.8, 8, { align: 'center' });

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('SCHOOL EDUCATION & LITERACY DEPT. SINDH', 42.8, 13, { align: 'center' });
  doc.text(`SEMIS CODE: ${settings.semisCode} • TALUKA KALOI`, 42.8, 18, { align: 'center' });

  doc.setTextColor(234, 179, 8); // Gold badge
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('FACULTY & STAFF IDENTITY CARD', 42.8, 23, { align: 'center' });

  // Photo box
  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(0.5);
  doc.rect(27.8, 30, 30, 34);
  doc.setFillColor(243, 244, 246);
  doc.rect(28, 30.2, 29.6, 33.6, 'F');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(6);
  doc.text('OFFICIAL PHOTO', 42.8, 48, { align: 'center' });

  // Teacher Name & Designation
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(teacher.name.toUpperCase(), 42.8, 68, { align: 'center' });

  doc.setTextColor(15, 118, 110);
  doc.setFontSize(7.5);
  doc.text(`${teacher.designation.toUpperCase()} • PID: ${teacher.pid}`, 42.8, 73, { align: 'center' });

  // Details
  const startY = 79;
  const lineH = 4.5;
  const leftX = 8;
  const valX = 36;

  const fields = [
    ['Father Name:', teacher.fatherName],
    ['CNIC Number:', teacher.cnic],
    ['Specialization:', teacher.subjectSpecialist],
    ['Qualification:', teacher.qualification],
    ['Mobile Number:', teacher.mobileNo],
    ['Official Email:', teacher.email],
    ['Cadre Status:', 'Verified Faculty Member'],
    ['Institution:', 'GBHS Mehrand (Kaloi)'],
  ];

  fields.forEach(([label, value], idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(6.5);
    doc.text(label, leftX, startY + idx * lineH);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(String(value).substring(0, 30), valX, startY + idx * lineH);
  });

  // Footer signatures
  const footY = 117;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(5.5);
  doc.setTextColor(107, 114, 128);
  doc.text('Teacher Sign', 15, footY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('HM Authority Sign & Seal', 68, footY, { align: 'right' });

  doc.setDrawColor(209, 213, 219);
  doc.line(8, footY - 2, 28, footY - 2);
  doc.line(48, footY - 2, 78, footY - 2);

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 121, 85.6, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL PROPERTY OF SINDH EDUCATION & LITERACY DEPARTMENT', 42.8, 123.5, { align: 'center' });

  doc.save(`GBHS_Mehrand_TeacherID_${teacher.name.replace(/\s+/g, '_')}.pdf`);
}

export function downloadStudentReportPDF(
  student: Student,
  settings: SchoolSettings,
  attendance: AttendanceRecord[],
  results: StudentResult[],
  remarks: DailyRemark[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Outer Border
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, 190, 277);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, 186, 273);

  // Top Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(12, 12, 186, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT BOYS HIGH SCHOOL MEHRAND', 105, 21, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('TALUKA KALOI, DISTRICT THARPARKAR @ MITHI (SINDH)', 105, 27, { align: 'center' });
  doc.text(`SEMIS CODE: ${settings.semisCode}  •  OFFICIAL STUDENT COMPREHENSIVE REPORT`, 105, 33, { align: 'center' });

  // Ribbon Title
  doc.setFillColor(217, 119, 6);
  doc.rect(45, 42, 120, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ANNUAL ACADEMIC, ATTENDANCE & CONDUCT REPORT', 105, 47.5, { align: 'center' });

  // Student Particulars Box
  doc.setFillColor(248, 250, 252);
  doc.rect(18, 54, 174, 38, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(18, 54, 174, 38);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(8.5);

  const studentFields = [
    ['Student Name:', student.name, 'G.R. Number:', student.grNumber || 'GR-406020752-PENDING'],
    ['Father\'s Name:', student.fatherName, 'Class & Section:', `${student.appliedClass} (${student.section || 'A'})`],
    ['Roll Number:', student.rollNo || '01', 'CNIC / B-Form:', student.cnicBForm],
    ['Date of Birth:', student.dob, 'Emergency Mobile:', student.fatherMobile],
    ['Residential Address:', `${student.address.mohVillage}, ${student.address.townCity}`, 'Blood Group:', student.bloodGroup || 'B+'],
  ];

  studentFields.forEach(([l1, v1, l2, v2], idx) => {
    const y = 60 + idx * 6.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text(l1, 22, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(String(v1), 54, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text(l2, 110, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(idx === 0 ? 185 : 17, idx === 0 ? 28 : 24, idx === 0 ? 28 : 39);
    doc.text(String(v2), 140, y);
  });

  // Section 1: Attendance Summary
  const studentAttendance = attendance.filter((a) => a.personId === student.id);
  const totalDays = studentAttendance.length || 1;
  const presentDays = studentAttendance.filter((a) => a.status === 'Present').length;
  const absentDays = studentAttendance.filter((a) => a.status === 'Absent').length;
  const leaveDays = studentAttendance.filter((a) => a.status === 'Leave').length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  doc.setFillColor(6, 78, 59);
  doc.rect(18, 97, 174, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('1. ATTENDANCE & DISCIPLINE SUMMARY', 22, 101.5);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(8);
  doc.text(`Overall Attendance Rate: ${attendanceRate}%`, 22, 109);
  doc.text(`Total Sessions Logged: ${totalDays}`, 75, 109);
  doc.text(`Present: ${presentDays} Days`, 125, 109);
  doc.text(`Absent: ${absentDays} | Leave: ${leaveDays}`, 155, 109);

  // Section 2: Examination Results
  const studentResult = results.find((r) => r.studentId === student.id || r.grNumber === student.grNumber);

  doc.setFillColor(6, 78, 59);
  doc.rect(18, 116, 174, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2. ACADEMIC EXAMINATION SCORES & GRADES', 22, 120.5);

  if (studentResult) {
    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(18, 124, 174, 6, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Subject Title', 24, 128.5);
    doc.text('Max Marks', 100, 128.5, { align: 'center' });
    doc.text('Obtained Marks', 140, 128.5, { align: 'center' });
    doc.text('Grade', 175, 128.5, { align: 'center' });

    let currentY = 135;
    studentResult.subjects.forEach((subj) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 24, 39);
      doc.text(subj.subject, 24, currentY);
      doc.text(String(subj.totalMarks), 100, currentY, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.text(String(subj.obtainedMarks), 140, currentY, { align: 'center' });
      doc.text(subj.grade, 175, currentY, { align: 'center' });
      doc.setDrawColor(226, 232, 240);
      doc.line(18, currentY + 2, 192, currentY + 2);
      currentY += 6;
    });

    // Total Row
    doc.setFillColor(236, 253, 245);
    doc.rect(18, currentY, 174, 7, 'F');
    doc.setTextColor(6, 78, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Grand Total / Overall Standing:', 24, currentY + 5);
    doc.text(`${studentResult.totalObtainedMarks} / ${studentResult.totalMaxMarks}  (${studentResult.percentage}%)`, 125, currentY + 5);
    doc.text(`Grade: ${studentResult.finalGrade}  |  Position: ${studentResult.position}`, 188, currentY + 5, { align: 'right' });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8.5);
    doc.text('Official Examination compilation in progress under school academic calendar.', 24, 130);
  }

  // Section 3: Teacher Observations
  const studentRemarks = remarks.filter((r) => r.studentId === student.id);
  const remY = 195;
  doc.setFillColor(6, 78, 59);
  doc.rect(18, remY, 174, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('3. TEACHER FEEDBACK & CLASSROOM CONDUCT', 22, remY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  if (studentRemarks.length > 0) {
    studentRemarks.slice(0, 3).forEach((rm, i) => {
      doc.text(`• [${rm.subject} - ${rm.teacherName}]: "${rm.performanceRemark}"`, 22, remY + 11 + i * 5);
    });
  } else {
    doc.text('• Student demonstrates commendable academic dedication, regular attendance, and disciplined conduct.', 22, remY + 11);
  }

  // Signatures
  const footY = 250;
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('Class Incharge Signature', 30, footY);
  doc.text('Examination Incharge', 95, footY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('Headmaster Authority Seal & Sign', 158, footY);

  doc.setDrawColor(156, 163, 175);
  doc.line(20, footY - 2, 65, footY - 2);
  doc.line(85, footY - 2, 130, footY - 2);
  doc.line(145, footY - 2, 190, footY - 2);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date of Report Issuance: ${new Date().toLocaleDateString('en-GB')}`, 20, 266);
  doc.text('Certified by GBHS Mehrand Automated Management Portal', 105, 266, { align: 'center' });

  doc.save(`GBHS_Mehrand_StudentReport_${student.name.replace(/\s+/g, '_')}.pdf`);
}

export function downloadTeacherReportPDF(
  teacher: Teacher,
  settings: SchoolSettings,
  timetable: TimetableSlot[],
  attendance: AttendanceRecord[],
  remarks: DailyRemark[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Outer Border
  doc.setDrawColor(15, 118, 110);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, 190, 277);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, 186, 273);

  // Top Banner
  doc.setFillColor(15, 118, 110);
  doc.rect(12, 12, 186, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT BOYS HIGH SCHOOL MEHRAND', 105, 21, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('SCHOOL EDUCATION & LITERACY DEPARTMENT, GOVERNMENT OF SINDH', 105, 27, { align: 'center' });
  doc.text(`SEMIS CODE: ${settings.semisCode}  •  FACULTY SERVICE & WORKLOAD REPORT`, 105, 33, { align: 'center' });

  // Ribbon Title
  doc.setFillColor(217, 119, 6);
  doc.rect(45, 42, 120, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL FACULTY SERVICE PROFILE & TEACHING RECORD', 105, 47.5, { align: 'center' });

  // Teacher Profile Particulars Box
  doc.setFillColor(240, 253, 250);
  doc.rect(18, 54, 174, 38, 'F');
  doc.setDrawColor(153, 246, 228);
  doc.rect(18, 54, 174, 38);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(8.5);

  const teacherFields = [
    ['Faculty Name:', teacher.name, 'Personal ID (PID):', teacher.pid],
    ['Father\'s Name:', teacher.fatherName, 'Cadre / Post:', `${teacher.designation} (Govt School)`],
    ['CNIC Number:', teacher.cnic, 'Specialization:', teacher.subjectSpecialist],
    ['Qualification:', teacher.qualification, 'Mobile Number:', teacher.mobileNo],
    ['Official Email:', teacher.email, 'Service Status:', 'Active & Verified Faculty'],
  ];

  teacherFields.forEach(([l1, v1, l2, v2], idx) => {
    const y = 60 + idx * 6.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text(l1, 22, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(String(v1), 52, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text(l2, 110, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(idx === 0 ? 180 : 17, idx === 0 ? 83 : 24, idx === 0 ? 9 : 39);
    doc.text(String(v2), 140, y);
  });

  // Section 1: Assigned Timetable
  const assignedSlots = timetable.filter(
    (s) => s.teacherId === teacher.id || s.teacherName?.toLowerCase() === teacher.name?.toLowerCase()
  );

  doc.setFillColor(15, 118, 110);
  doc.rect(18, 97, 174, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`1. WEEKLY TEACHING TIMETABLE ALLOCATION (TOTAL: ${assignedSlots.length} PERIODS)`, 22, 101.5);

  if (assignedSlots.length > 0) {
    doc.setFillColor(241, 245, 249);
    doc.rect(18, 105, 174, 6, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Day of Week', 24, 109.5);
    doc.text('Period', 65, 109.5);
    doc.text('Timings', 95, 109.5);
    doc.text('Class Assigned', 135, 109.5);
    doc.text('Subject', 170, 109.5);

    let currentY = 117;
    assignedSlots.forEach((slot) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 118, 110);
      doc.text(slot.day, 24, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 24, 39);
      doc.text(`Period ${slot.period}`, 65, currentY);
      doc.text(slot.time, 95, currentY);
      doc.setFont('helvetica', 'bold');
      doc.text(slot.className, 135, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(slot.subject, 170, currentY);
      doc.setDrawColor(226, 232, 240);
      doc.line(18, currentY + 2, 192, currentY + 2);
      currentY += 6;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8.5);
    doc.text('General teaching duties assigned across designated secondary classes.', 24, 110);
  }

  // Section 2: Classroom Monitoring & Feedback Logged
  const teacherRemarks = remarks.filter(
    (r) => r.teacherId === teacher.id || r.teacherName?.toLowerCase() === teacher.name?.toLowerCase()
  );

  const actY = 185;
  doc.setFillColor(15, 118, 110);
  doc.rect(18, actY, 174, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2. ACADEMIC EVALUATION & CLASSROOM ENGAGEMENT', 22, actY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  doc.text(`• Total Classroom Remarks & Daily Logs recorded: ${teacherRemarks.length}`, 24, actY + 11);
  doc.text(`• Total Active Working Days & Teaching Sessions monitored: Active Schedule`, 24, actY + 17);
  doc.text('• Evaluated as highly dependable faculty member upholding Sindh Education Department instructional standards.', 24, actY + 23);

  // Official Signatures
  const footY = 250;
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('Faculty Member Signature', 35, footY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('Headmaster Authority Seal & Sign', 145, footY);

  doc.setDrawColor(156, 163, 175);
  doc.line(25, footY - 2, 75, footY - 2);
  doc.line(135, footY - 2, 190, footY - 2);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Service Verification Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 266);
  doc.text('Official Document • Government Boys High School Mehrand', 105, 266, { align: 'center' });

  doc.save(`GBHS_Mehrand_TeacherServiceReport_${teacher.name.replace(/\s+/g, '_')}.pdf`);
}

export function downloadConfirmationLetterPDF(student: Student, settings: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Outer Ornate Border
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(1.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Top Header Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(14, 14, pageWidth - 28, 28, 'F');

  // School Logo / Seal Placeholder
  if (settings.logoUrl) {
    safeAddImage(doc, settings.logoUrl, 18, 17, 22, 22);
  }

  // Header Typography
  doc.setTextColor(236, 253, 245);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF SINDH • SCHOOL EDUCATION & LITERACY DEPARTMENT', 112, 21, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text((settings.schoolName || 'GOVERNMENT BOYS HIGH SCHOOL MEHRAND').toUpperCase(), 112, 28, { align: 'center' });

  doc.setTextColor(251, 191, 36);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`TALUKA KALOI, DISTRICT THARPARKAR @ MITHI • SEMIS CODE: ${settings.semisCode || '406020752'}`, 112, 35, { align: 'center' });

  // Title Pill
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.roundedRect(45, 46, 120, 9, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL ADMISSION CONFIRMATION LETTER', 105, 52, { align: 'center' });

  // Reference & Date Grid
  const metaY = 62;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(16, metaY, pageWidth - 16, metaY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Letter Ref: GBHS/ADM/2026-${student.id.substring(0, 8)}`, 18, metaY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text(`ALLOTTED G.R. NO: ${student.grNumber || 'GR-406020752-PROVISIONAL'}`, 105, metaY + 6, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Issue Date: ${student.admissionDate || new Date().toLocaleDateString('en-GB')}`, pageWidth - 18, metaY + 6, { align: 'right' });

  doc.line(16, metaY + 9, pageWidth - 16, metaY + 9);

  // Student Particulars Box
  const boxY = metaY + 14;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(18, boxY, pageWidth - 36, 46, 2, 2, 'FD');

  // Photo Box (if photo exists, render; otherwise blank affix photo box)
  const photoW = 28;
  const photoH = 34;
  const photoX = pageWidth - 18 - photoW - 4;
  const photoY = boxY + 6;

  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.3);
  doc.rect(photoX, photoY, photoW, photoH);

  let hasPhoto = false;
  if (student.studentPictureUrl && student.studentPictureUrl.trim() !== '') {
    hasPhoto = safeAddImage(doc, student.studentPictureUrl, photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1);
  }

  if (!hasPhoto) {
    doc.setFillColor(241, 245, 249);
    doc.rect(photoX + 0.5, photoY + 0.5, photoW - 1, photoH - 1, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Affix Passport', photoX + photoW / 2, photoY + 15, { align: 'center' });
    doc.text('Photo Here', photoX + photoW / 2, photoY + 19, { align: 'center' });
  }

  // Particulars Table Text
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);

  const leftMargin = 22;
  let textY = boxY + 8;
  const lineSpacing = 7.5;

  const renderField = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, leftMargin, textY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(value, leftMargin + 42, textY);
    textY += lineSpacing;
  };

  renderField('Student Name:', student.name.toUpperCase());
  renderField('Father Name:', student.fatherName.toUpperCase());
  renderField('NADRA B-Form / CNIC:', student.cnicBForm || 'N/A');
  renderField('Confirmed Class:', `${student.appliedClass}  (Section: ${student.section || 'A'}, Roll No: ${student.rollNo || '01'})`);
  renderField('Address / Village:', `${student.address?.mohVillage || student.address?.townCity || 'Village Mehrand'}, Taluka Kaloi, District Tharparkar`);

  // Subject Line
  const subY = boxY + 54;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text(`SUBJECT: OFFICIAL CONFIRMATION OF REGISTRATION & ADMISSION IN ${student.appliedClass.toUpperCase()}`, 18, subY);

  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.4);
  doc.line(18, subY + 2, pageWidth - 18, subY + 2);

  // Body Text
  const bodyY = subY + 10;
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');

  const p1 = `Respected Parent & Dear Student,`;
  doc.text(p1, 18, bodyY);

  const p2 = `We are pleased to inform you that following rigorous verification of NADRA B-Form documentation, previous educational credentials, and compliance with the admission policy of the School Education & Literacy Department, Government of Sindh, admission has been formally APPROVED in ${settings.schoolName || 'Government Boys High School Mehrand'} for Academic Session 2026-2027.`;
  const splitP2 = doc.splitTextToSize(p2, pageWidth - 36);
  doc.text(splitP2, 18, bodyY + 7);

  const p3Y = bodyY + 7 + splitP2.length * 5.2;
  const p3 = `The candidate has been officially entered into the permanent General Register (G.R.) of the institution under Registration Number ${student.grNumber || 'GR-406020752-0142'} and allotted Section ${student.section || 'A'} with Roll Number ${student.rollNo || '01'}.`;
  const splitP3 = doc.splitTextToSize(p3, pageWidth - 36);
  doc.text(splitP3, 18, p3Y);

  const p4Y = p3Y + splitP3.length * 5.2;
  const p4 = `By virtue of this admission, the student is entitled to all institutional rights including free textbook distribution under Sindh Government policy, science & computer laboratory access, library resources, and participation in annual board examinations.`;
  const splitP4 = doc.splitTextToSize(p4, pageWidth - 36);
  doc.text(splitP4, 18, p4Y);

  // Institutional Rules Box
  const rulesY = p4Y + splitP4.length * 5.2 + 4;
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.setLineWidth(0.3);
  doc.roundedRect(18, rulesY, pageWidth - 36, 28, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('MANDATORY INSTRUCTIONS & STUDENT OBLIGATIONS:', 22, rulesY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  doc.text('1. Adherence to the prescribed school uniform and daily punctuality is strictly enforced.', 22, rulesY + 12);
  doc.text('2. A minimum of 75% attendance is required to appear in final and board examinations.', 22, rulesY + 17);
  doc.text('3. Retain this confirmation letter and G.R. number safely for Student ID, Enrollment, and Leaving Certificate.', 22, rulesY + 22);

  // Official Stamp and Signatures
  const signY = 248;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(22, signY, 75, signY);
  doc.line(pageWidth - 75, signY, pageWidth - 22, signY);

  // Admission Committee Seal
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Admission Scrutiny Committee', 48, signY + 5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('GBHS Mehrand, Taluka Kaloi', 48, signY + 9, { align: 'center' });

  // QR Code Verification Box
  drawQrVerificationBox(doc, 95, signY - 14, 20);
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Official Digital Seal', 105, signY + 9, { align: 'center' });

  // Headmaster Signature
  if (settings.headmasterSignatureUrl) {
    safeAddImage(doc, settings.headmasterSignatureUrl, pageWidth - 65, signY - 16, 40, 14);
  }

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text(settings.headmasterName || 'Headmaster', pageWidth - 48, signY + 5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Headmaster / Principal Authority', pageWidth - 48, signY + 9, { align: 'center' });

  // Bottom Notice
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official Document Generated by GBHS Mehrand Institutional Portal • Date: ${new Date().toLocaleDateString('en-GB')}`, 105, pageHeight - 16, { align: 'center' });

  const safeName = student.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`GBHS_Mehrand_Admission_Confirmation_Letter_${safeName}.pdf`);
}

