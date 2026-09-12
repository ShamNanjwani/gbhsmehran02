import jsPDF from 'jspdf';
import { Student, StudentResult, LeavingCertificateData, SchoolSettings } from '../types';

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
