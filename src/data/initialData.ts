import { Student, Teacher, TimetableSlot, DailyRemark, AttendanceRecord, StudentResult, LeavingCertificateData, LeaderMessage, SchoolSettings, ContactInquiry } from '../types';
import { officialSchoolLogo } from './schoolLogo';
import { buildDefaultUnassignedTimetable } from '../utils/defaultTimetable';

export const initialSchoolSettings: SchoolSettings = {
  schoolName: 'GOVERNMENT BOYS HIGH SCHOOL MEHRAND',
  semisCode: '406020752',
  establishedYear: '1995',
  address: 'Village Mehrand P.O Kaloi Taluka Kaloi District Tharparkar @ Mithi',
  phone: '+92-346-3847836',
  email: 'info.gbhsmehrand@gmail.com',
  officialHelpline: '+92-232-920045',
  officialMobile: '+92-346-3847836',
  schoolTiming: '08:00 AM - 01:30 PM (Mon - Sat, Friday: 08:00 AM - 12:00 PM)',
  logoUrl: officialSchoolLogo,
  heroBannerUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
  mission: 'To impart high-quality, inclusive, and modern secondary education to the youth of rural Tharparkar; fostering scientific curiosity, high ethical character, civic responsibility, and 21st-century technological literacy in an encouraging desert environment.',
  vision: 'To establish Government Boys High School Mehrand as a beacon of academic excellence, digital empowerment, and intellectual leadership across Kaloi and Tharparkar district, turning desert potential into national pride.',
  aboutHistory: 'Established in Village Mehrand, Taluka Kaloi, District Tharparkar, GBHS Mehrand (SEMIS Code 406020752) stands as a historic center for secondary education in rural Sindh. Serving surrounding villages across the Kaloi belt, the institution provides quality schooling from primary up to matriculation (Science and General groups). With committed faculty, science laboratories, modern IT classroom exposure, and sports facilities, the school has nurtured generations of doctors, engineers, educators, and civil servants.',
  designerName: 'Ghanshamdas JEST',
  designerTitle: 'Junior Elementary School Teacher (JEST) & Lead Tech Developer',
  designerPictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  enrollmentCardValidTill: '31st May 2027 (Annual Final Exams)',
  idCardTemplate: 'emerald',
  headmasterName: 'Master Tanu Mal',
  headmasterSignatureUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70" viewBox="0 0 220 70"><path d="M20 45 Q 45 10, 75 32 T 130 25 Q 155 12, 185 36 M 50 40 C 65 18, 95 15, 115 42 M 100 32 L 170 30 M 135 20 Q 155 52, 195 38" stroke="%23064e3b" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="60" font-family="sans-serif" font-size="9" font-weight="900" fill="%23064e3b" letter-spacing="1">HM / GBHS MEHRAND</text></svg>',
  adminUsername: 'Sham Nanjwani',
  adminPassword: 'Sham@580',
  announcements: [
    {
      id: 'ann-1',
      title: 'Monsoon Heavy Rainfall Alert & Safety Advisory for Kaloi Belt',
      date: 'Sept 19, 2026',
      tag: 'Urgent',
      message: 'In light of District Disaster Management Authority (DDMA) Tharparkar weather advisory regarding heavy rainfall, all students and teachers residing in far-flung villages are advised to take necessary precautions. Classes are adjusted with flexible morning timings.',
      priority: 'urgent',
      targetAudience: 'all',
      pinned: true,
      isActive: true,
      issuedBy: 'Office of the Headmaster / DDMA Kaloi',
    },
    {
      id: 'ann-2',
      title: 'Admissions Open for Academic Session 2026-2027 (Classes 1st to 10th)',
      date: 'Sept 10, 2026',
      tag: 'Admission',
      message: 'Official admissions are active for Classes 1st through 10th (Science & General Groups). Parents must submit B-Form or Father CNIC along with previous school leaving certificates for instant computerized enrollment.',
      priority: 'important',
      targetAudience: 'all',
      pinned: true,
      isActive: true,
      issuedBy: 'Admissions Committee, GBHS Mehrand',
    },
    {
      id: 'ann-3',
      title: 'Mid-Term Assessment Schedule & Syllabus Completion Review',
      date: 'Sept 12, 2026',
      tag: 'Academic',
      message: 'Mid-term examinations will commence from next month. All subject teachers (JEST/HST/PST) are instructed to complete designated term chapters and upload monthly assessment marks in the portal.',
      priority: 'important',
      targetAudience: 'all',
      pinned: false,
      isActive: true,
      issuedBy: 'Academic Council & Examination Branch',
    },
    {
      id: 'ann-4',
      title: 'Staff Academic Council Meeting on Friday at 01:00 PM',
      date: 'Sept 15, 2026',
      tag: 'Faculty',
      message: 'A mandatory staff meeting of all teaching faculty members will be convened in the Staff Room regarding SELD biometric compliance, student attendance tracking, and Science Exhibition preparations.',
      priority: 'normal',
      targetAudience: 'teachers',
      pinned: false,
      isActive: true,
      issuedBy: 'Headmaster Master Tanu Mal',
    },
    {
      id: 'ann-5',
      title: 'New Computer Lab & Solar Electrification Project Operational',
      date: 'Aug 25, 2026',
      tag: 'Infrastructure',
      message: 'The new computer lab equipped with high-speed digital literacy workstations and 24/7 solar power backup is now fully accessible for IT and Computer Science practicals for Classes 9th and 10th.',
      priority: 'normal',
      targetAudience: 'students',
      pinned: false,
      isActive: true,
      issuedBy: 'IT Lab Coordinator / Ghanshamdas JEST',
    },
  ],
};

export const initialLeaderMessages: LeaderMessage[] = [
  {
    id: 'minister',
    title: 'Minister Message',
    name: 'Syed Sardar Ali Shah',
    designation: 'Minister for Education & Literacy Sindh',
    pictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    message: 'It is our firm commitment through the School Education & Literacy Department Sindh to bring modern digital education, STEM literacy, and well-equipped schools to every corner of Tharparkar and rural Sindh. Government Boys High School Mehrand (SEMIS 406020752) exemplifies how community spirit and dedicated teachers can transform lives through education. We will continue providing scholarships, digital labs, and teacher trainings to nurture the brilliant youth of Kaloi and Tharparkar.',
  },
  {
    id: 'secretary',
    title: 'Secretary Message',
    name: 'Dr. Zahid Ali Abbasi (PAS)',
    designation: 'Secretary, School Education & Literacy Department, Govt of Sindh',
    pictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    message: 'The Sindh Government prioritizes accountability, student enrollment, merit-based teacher recruitments (JEST/PST/HST), and transparent computerized school management portals. The establishment of digital student dashboards, real-time timetable tracking, and automated ID & Enrollment issuance at GBHS Mehrand sets a prime benchmark for other government institutions across the province.',
  },
  {
    id: 'headmaster',
    title: 'Headmaster Message',
    name: 'Master Tanu Mal',
    designation: 'Headmaster, Govt Boys High School Mehrand (Taluka Kaloi)',
    pictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80',
    message: 'Warm welcome to Government Boys High School Mehrand. As Headmaster, it brings me immense joy to see our students excel in academic exams, district science exhibitions, and athletic championships. We ensure every boy receives moral values, rigorous science and mathematics foundation, and technical competence. I express gratitude to our hardworking faculty, especially Mr. Ghanshamdas JEST, for spearheading this portal to keep parents, teachers, and students connected seamlessly.',
  },
];

export const initialTeachers: Teacher[] = [];

export const initialStudents: Student[] = [];

// Default State: Keep all timetables unassigned ("Not Assigned") by default.
// No slots populate until a teacher successfully registers and is assigned a subject/class.
export const initialTimetableSlots: TimetableSlot[] = buildDefaultUnassignedTimetable();

export const initialRemarks: DailyRemark[] = [];

export const initialAttendance: AttendanceRecord[] = [];

export const initialStudentResults: StudentResult[] = [
  {
    id: 'res-1',
    studentId: 's-1',
    grNumber: 'GR-406020752-0142',
    studentName: 'Dileep Kumar',
    fatherName: 'Lachhman Das',
    className: 'Class 9th (Science)',
    examTerm: 'Annual Mid-Term Assessment 2026',
    year: '2026',
    totalMaxMarks: 550,
    totalObtainedMarks: 498,
    percentage: 90.54,
    finalGrade: 'A-1 (Outstanding)',
    position: '1st in Class',
    remarks: 'Remarkable aptitude in Mathematics, Physics, and Computer Science. Exemplary discipline and conduct.',
    issueDate: '25-08-2026',
    subjects: [
      { subject: 'Computer Science', totalMarks: 100, obtainedMarks: 96, grade: 'A-1' },
      { subject: 'Mathematics', totalMarks: 100, obtainedMarks: 94, grade: 'A-1' },
      { subject: 'Physics', totalMarks: 100, obtainedMarks: 90, grade: 'A-1' },
      { subject: 'English', totalMarks: 100, obtainedMarks: 85, grade: 'A' },
      { subject: 'Sindhi Literature', totalMarks: 75, obtainedMarks: 68, grade: 'A-1' },
      { subject: 'Pakistan Studies', totalMarks: 75, obtainedMarks: 65, grade: 'A' },
    ],
  },
  {
    id: 'res-2',
    studentId: 's-2',
    grNumber: 'GR-406020752-0098',
    studentName: 'Kamran Ali',
    fatherName: 'Muhammad Hashim',
    className: 'Class 10th (Science)',
    examTerm: 'Pre-Matric Examination 2026',
    year: '2026',
    totalMaxMarks: 600,
    totalObtainedMarks: 532,
    percentage: 88.66,
    finalGrade: 'A-1',
    position: '2nd in Class',
    remarks: 'Consistent high achiever with notable analytical skills in sciences.',
    issueDate: '20-08-2026',
    subjects: [
      { subject: 'Physics', totalMarks: 100, obtainedMarks: 92, grade: 'A-1' },
      { subject: 'Chemistry', totalMarks: 100, obtainedMarks: 88, grade: 'A-1' },
      { subject: 'Mathematics', totalMarks: 100, obtainedMarks: 90, grade: 'A-1' },
      { subject: 'English', totalMarks: 100, obtainedMarks: 84, grade: 'A' },
      { subject: 'Sindhi', totalMarks: 100, obtainedMarks: 89, grade: 'A-1' },
      { subject: 'Islamiat', totalMarks: 100, obtainedMarks: 89, grade: 'A-1' },
    ],
  }
];

export const initialLeavingCertificates: LeavingCertificateData[] = [
  {
    id: 'slc-1',
    studentId: 's-2',
    grNumber: 'GR-406020752-0098',
    studentName: 'Kamran Ali',
    fatherName: 'Muhammad Hashim',
    caste: 'Rahimoon',
    residentOf: 'Village Mehrand, Taluka Kaloi, District Tharparkar',
    dob: '20-11-2008',
    dobWords: 'Twentieth November Two Thousand Eight',
    lastClassAttended: 'Class 10th (Matriculation Passed)',
    dateOfAdmission: '15-08-2022',
    dateOfLeaving: '31-05-2026',
    reasonForLeaving: 'Passed Secondary School Certificate (SSC Part-II) Examination',
    conduct: 'Excellent and Respectful',
    progress: 'Very Satisfactory and Hardworking',
    remarks: 'Paid all government dues. He bears an unblemished character during his stay in this school.',
    issueDate: '10-06-2026',
  }
];

export const initialInquiries: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Dr. Ashok Kumar',
    email: 'ashok.tharparkar@gmail.com',
    phone: '+92-345-1122334',
    subject: 'Donation of Solar Panels and Science Lab Equipment',
    message: 'Respected Headmaster, alumni community would like to present 10 new computers and solar inverters to GBHS Mehrand. Please advise convenient day for meeting.',
    createdAt: '2026-09-08',
    status: 'read',
  },
  {
    id: 'inq-2',
    name: 'Wali Muhammad',
    email: 'wali.mehrand@yahoo.com',
    phone: '+92-333-8899001',
    subject: 'Inquiry regarding B-Form registration verification',
    message: 'Assalam o Alaikum, my son is applying for Class 6th admission. We have submitted the online admission form with B-form copy. Kindly confirm approval.',
    createdAt: '2026-09-11',
    status: 'unread',
  }
];
