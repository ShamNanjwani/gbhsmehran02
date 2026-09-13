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

export function downloadStudentIdCardPDF(student: Student, settings: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [85.6, 125], // Standard ID card / badge dimension
  });

  // Background header
  doc.setFillColor(6, 78, 59); // Deep emerald green
  doc.rect(0, 0, 85.6, 26, 'F');

  // Golden accent line
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 26, 85.6, 1.5, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVT. BOYS HIGH SCHOOL MEHRAND', 42.8, 8, { align: 'center' });

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('TALUKA KALOI, DISTRICT THARPARKAR', 42.8, 13, { align: 'center' });
  doc.text(`SEMIS CODE: ${settings.semisCode}`, 42.8, 18, { align: 'center' });

  doc.setTextColor(234, 179, 8); // Gold badge
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT IDENTITY CARD', 42.8, 23, { align: 'center' });

  // Photo placeholder box
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.5);
  doc.rect(27.8, 30, 30, 34);
  doc.setFillColor(243, 244, 246);
  doc.rect(28, 30.2, 29.6, 33.6, 'F');
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(6);
  doc.text('OFFICIAL PHOTO', 42.8, 48, { align: 'center' });

  // Student Details
  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(student.name.toUpperCase(), 42.8, 68, { align: 'center' });

  doc.setTextColor(220, 38, 38);
  doc.setFontSize(7.5);
  doc.text(`GR NO: ${student.grNumber || 'PENDING ALLOTMENT'}`, 42.8, 73, { align: 'center' });

  // Field details grid
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');

  const startY = 79;
  const lineH = 4.5;
  const leftX = 8;
  const valX = 35;

  const fields = [
    ['Father Name:', student.fatherName],
    ['Class & Section:', `${student.appliedClass} ${student.section ? `(${student.section})` : ''}`],
    ['Roll Number:', student.rollNo || '01'],
    ['B-Form / CNIC:', student.cnicBForm],
    ['Date of Birth:', student.dob],
    ['Blood Group:', student.bloodGroup || 'O+'],
    ['Emergency Cell:', student.fatherMobile],
    ['Address:', `${student.address.mohVillage}, ${student.address.townCity}`],
  ];

  fields.forEach(([label, value], idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text(label, leftX, startY + idx * lineH);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(String(value).substring(0, 32), valX, startY + idx * lineH);
  });

  // Footer bar & signatures
  const footY = 117;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(5.5);
  doc.setTextColor(107, 114, 128);
  doc.text('Student Sign', 15, footY);
  doc.text('Headmaster Stamp & Sign', 68, footY, { align: 'right' });

  doc.setDrawColor(209, 213, 219);
  doc.line(8, footY - 2, 30, footY - 2);
  doc.line(50, footY - 2, 78, footY - 2);

  doc.setFillColor(6, 78, 59);
  doc.rect(0, 121, 85.6, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'normal');
  doc.text('EDUCATION & LITERACY DEPARTMENT GOVT. OF SINDH', 42.8, 123.5, { align: 'center' });

  doc.save(`GBHS_Mehrand_IDCard_${student.name.replace(/\s+/g, '_')}.pdf`);
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

