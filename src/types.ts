export type Role = 'guest' | 'student' | 'teacher' | 'admin';

export interface SchoolAddress {
  houseNo: string;
  streetNo: string;
  mohVillage: string;
  townCity: string;
  district: string;
}

export interface Student {
  id: string;
  name: string;
  fatherName: string;
  cnicBForm: string;
  isBFormAvailable?: boolean; // If false, Father CNIC Both Sides is uploaded
  fatherCnic?: string;
  fatherCnicFrontUrl?: string; // Father CNIC Front in PDF or Image
  fatherCnicBackUrl?: string;  // Father CNIC Back in PDF or Image
  dob: string;
  fatherMobile: string;
  email: string;
  password?: string;
  address: SchoolAddress;
  appliedClass: string; // e.g. "Class ECCE", "Class 1", "Class 2", ..., "Class 9"
  studentPictureUrl: string;
  bFormPictureUrl?: string;
  leavingCertificateUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  grNumber?: string; // e.g. "GR-406020752-0142"
  section?: string;
  rollNo?: string;
  admissionDate: string;
  bloodGroup?: string;
  remarks?: string;
}

export interface Teacher {
  id: string;
  name: string;
  fatherName: string;
  pid: string; // Personal Identification Number
  cnic: string;
  email: string;
  password?: string;
  mobileNo: string;
  qualification: string;
  subjectSpecialist: string;
  pictureUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  joinDate: string;
  joiningDate?: string;
  designation?: string; // e.g., "JEST", "PST", "HST", "Headmaster"
  isAvailableToday?: boolean;
  // Verification documents uploaded during teacher registration
  cnicFileUrl?: string; // Both sides image or PDF file
  cnicFileName?: string;
  appointmentOrderUrl?: string; // Transfer / Appointment order PDF or image file
  appointmentOrderFileName?: string;
  // Headmaster Joining Letter & Confirmation Letter
  joiningLetterIssued?: boolean;
  joiningLetterType?: 'auto' | 'manual';
  joiningLetterUrl?: string; // If manual PDF/Image uploaded by Admin/HM
  manualJoiningLetterUrl?: string;
  joiningLetterFileName?: string;
  manualJoiningLetterFileName?: string;
  joiningLetterDispatchNo?: string;
  joiningLetterDate?: string;
  joiningLetterIssuedAt?: string;
  joiningLetterRemarks?: string;
  joiningRemarks?: string;
  joiningLetterIssuedBy?: string;
  confirmationLetterUrl?: string; // If uploaded or customized
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number; // 1 to 6
  time: string; // e.g. "08:00 - 08:45 AM"
  className: string; // e.g. "Class 9th", "Class 10th"
  subject: string;
  teacherId: string;
  teacherName: string;
  room?: string;
  notes?: string;
  isSubstituted?: boolean;
  substitutedTeacherId?: string;
  substitutedTeacherName?: string;
  substitutionReason?: string;
}

export interface DailyRemark {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  className: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  classWork: string;
  homeworkTask: string;
  performanceRemark: string; // "Excellent", "Good", "Needs Improvement", etc.
  rating: number; // 1-5
}

export interface AttendanceRecord {
  id: string;
  date: string;
  personId: string; // studentId or teacherId
  personName: string;
  type: 'student' | 'teacher';
  className?: string;
  period?: number;
  status: 'Present' | 'Absent' | 'Leave' | 'Late';
  markedBy: string;
}

export interface ResultSubject {
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  grNumber: string;
  studentName: string;
  fatherName: string;
  className: string;
  examTerm: string; // "Annual Examination 2026"
  year: string;
  subjects: ResultSubject[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  finalGrade: string;
  position: string;
  remarks: string;
  issueDate: string;
}

export interface LeavingCertificateData {
  id: string;
  studentId: string;
  grNumber: string;
  studentName: string;
  fatherName: string;
  caste: string;
  residentOf: string;
  dob: string;
  dobWords: string;
  lastClassAttended: string;
  dateOfAdmission: string;
  dateOfLeaving: string;
  reasonForLeaving: string;
  conduct: string;
  progress: string;
  remarks: string;
  issueDate: string;
}

export interface LeaderMessage {
  id: string;
  title: string; // e.g. "Minister Message"
  name: string; // e.g. "Syed Sardar Ali Shah"
  designation: string; // e.g. "Minister for Education & Literacy Sindh"
  pictureUrl: string;
  message: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  message?: string;
  priority?: 'urgent' | 'important' | 'normal';
  targetAudience?: 'all' | 'students' | 'teachers';
  targetClass?: string; // e.g. "All Classes" or "Class 9th", "Class 10th"
  pinned?: boolean;
  isActive?: boolean;
  issuedBy?: string; // e.g. "Office of the Headmaster", "DEO Tharparkar"
  expiresAt?: string;
  linkUrl?: string;
  linkText?: string;
}

export interface SchoolSettings {
  schoolName: string;
  semisCode: string;
  establishedYear: string;
  address: string;
  phone: string;
  email: string;
  officialHelpline?: string;
  officialMobile?: string;
  schoolTiming?: string;
  logoUrl: string;
  heroBannerUrl: string;
  mission: string;
  vision: string;
  aboutHistory: string;
  designerName: string;
  designerTitle: string;
  designerPictureUrl: string;
  enrollmentCardValidTill: string;
  idCardTemplate: 'classic' | 'modern' | 'emerald';
  headmasterName?: string;
  headmasterSignatureUrl?: string;
  adminUsername?: string;
  adminPassword?: string;
  announcements: AnnouncementItem[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}
