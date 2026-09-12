import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  Student,
  Teacher,
  TimetableSlot,
  DailyRemark,
  AttendanceRecord,
  StudentResult,
  LeavingCertificateData,
  LeaderMessage,
  SchoolSettings,
  ContactInquiry,
} from '../types';
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
} from '../data/initialData';

interface SchoolContextType {
  // Current session
  currentRole: Role;
  currentUser: { id: string; name: string; email: string; extra?: any } | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deviceMode: 'web' | 'android' | 'ios';
  setDeviceMode: (mode: 'web' | 'android' | 'ios') => void;

  // Data
  settings: SchoolSettings;
  leaderMessages: LeaderMessage[];
  teachers: Teacher[];
  students: Student[];
  timetable: TimetableSlot[];
  remarks: DailyRemark[];
  attendance: AttendanceRecord[];
  results: StudentResult[];
  leavingCertificates: LeavingCertificateData[];
  inquiries: ContactInquiry[];

  // Notification / confirmation alert
  alertMessage: { type: 'success' | 'info' | 'warning' | 'error'; title: string; message: string } | null;
  clearAlert: () => void;
  showAlert: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Auth Methods
  loginAsAdmin: (user: string, pass: string) => boolean;
  loginAsTeacher: (email: string, pass: string) => { success: boolean; message: string; teacher?: Teacher };
  loginAsStudent: (email: string, pass: string) => { success: boolean; message: string; student?: Student };
  logout: () => void;

  // Student Admissions
  registerStudent: (student: Omit<Student, 'id' | 'status' | 'admissionDate'>) => { success: boolean; studentId: string };
  approveStudent: (studentId: string, grNumber: string, section?: string, rollNo?: string) => void;
  rejectStudent: (studentId: string) => void;
  deleteStudent: (studentId: string) => void;

  // Teacher Management
  registerTeacher: (teacher: Omit<Teacher, 'id' | 'status' | 'joinDate'>) => { success: boolean; teacherId: string };
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string) => void;
  deleteTeacher: (teacherId: string) => void;

  // Timetable & Substitution
  updateTimetableSlot: (slot: TimetableSlot) => void;
  assignProxyTeacher: (slotId: string, proxyTeacherId: string, reason: string) => void;
  clearProxySubstitution: (slotId: string) => void;

  // Attendance
  markDailyAttendance: (records: AttendanceRecord[]) => void;

  // Remarks & Classwork
  postDailyRemark: (remark: Omit<DailyRemark, 'id'>) => void;

  // Certificates & Results
  issueOrUpdateResult: (result: StudentResult) => void;
  issueLeavingCertificate: (certificate: LeavingCertificateData) => void;

  // CMS & Settings
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  updateLeaderMessage: (id: string, updated: Partial<LeaderMessage>) => void;
  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => void;
  markInquiryRead: (id: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'gbhs_mehrand_';

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (err) {
    console.error('Error reading localStorage for key', key, err);
    return defaultVal;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Error setting localStorage for key', key, err);
  }
}

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>(() => getStored<Role>('currentRole', 'guest'));
  const [currentUser, setCurrentUser] = useState<any>(() => getStored<any>('currentUser', null));
  const [activeTab, setActiveTab] = useState<string>(() => getStored<string>('activeTab', 'home'));
  const [deviceMode, setDeviceMode] = useState<'web' | 'android' | 'ios'>('web');

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const s = getStored<SchoolSettings>('settings', initialSchoolSettings);
    if (s && s.establishedYear === '1985') {
      return { ...s, establishedYear: '1995' };
    }
    return s;
  });
  const [leaderMessages, setLeaderMessages] = useState<LeaderMessage[]>(() => getStored<LeaderMessage[]>('leaderMessages', initialLeaderMessages));
  const [teachers, setTeachers] = useState<Teacher[]>(() => getStored<Teacher[]>('teachers', initialTeachers));
  const [students, setStudents] = useState<Student[]>(() => getStored<Student[]>('students', initialStudents));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => getStored<TimetableSlot[]>('timetable', initialTimetableSlots));
  const [remarks, setRemarks] = useState<DailyRemark[]>(() => getStored<DailyRemark[]>('remarks', initialRemarks));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStored<AttendanceRecord[]>('attendance', initialAttendance));
  const [results, setResults] = useState<StudentResult[]>(() => getStored<StudentResult[]>('results', initialStudentResults));
  const [leavingCertificates, setLeavingCertificates] = useState<LeavingCertificateData[]>(() => getStored<LeavingCertificateData[]>('leavingCertificates', initialLeavingCertificates));
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => getStored<ContactInquiry[]>('inquiries', initialInquiries));

  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'info' | 'warning' | 'error'; title: string; message: string } | null>(null);

  // Sync to localStorage
  useEffect(() => { setStored('currentRole', currentRole); }, [currentRole]);
  useEffect(() => { setStored('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { setStored('activeTab', activeTab); }, [activeTab]);
  useEffect(() => { setStored('settings', settings); }, [settings]);
  useEffect(() => { setStored('leaderMessages', leaderMessages); }, [leaderMessages]);
  useEffect(() => { setStored('teachers', teachers); }, [teachers]);
  useEffect(() => { setStored('students', students); }, [students]);
  useEffect(() => { setStored('timetable', timetable); }, [timetable]);
  useEffect(() => { setStored('remarks', remarks); }, [remarks]);
  useEffect(() => { setStored('attendance', attendance); }, [attendance]);
  useEffect(() => { setStored('results', results); }, [results]);
  useEffect(() => { setStored('leavingCertificates', leavingCertificates); }, [leavingCertificates]);
  useEffect(() => { setStored('inquiries', inquiries); }, [inquiries]);

  const showAlert = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setAlertMessage({ title, message, type });
  };

  const clearAlert = () => {
    setAlertMessage(null);
  };

  // Auth
  const loginAsAdmin = (user: string, pass: string): boolean => {
    if (user.trim().toLowerCase() === 'admin' && pass === 'Admin@580') {
      setCurrentRole('admin');
      setCurrentUser({ id: 'admin-root', name: 'Master Administrator', email: 'admin@gbhsmehrand.edu.pk' });
      setActiveTab('admin-portal');
      showAlert('Welcome Admin', 'Successfully authenticated into GBHS Mehrand Control Center.', 'success');
      return true;
    }
    showAlert('Login Failed', 'Invalid administrative credentials. Access is restricted to authorized school administrators.', 'error');
    return false;
  };

  const loginAsTeacher = (identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const teacher = teachers.find((t) => {
      const matchesEmail = t.email.toLowerCase() === cleanId;
      const matchesPid = t.pid && t.pid.toLowerCase() === cleanId;
      const matchesCnic = t.cnic && t.cnic.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '') && cleanId.length >= 5;
      return matchesEmail || matchesPid || matchesCnic;
    });

    if (!teacher) {
      return { success: false, message: 'No registered teacher account found. Please register first.' };
    }
    if (teacher.password && teacher.password !== pass) {
      return { success: false, message: 'Incorrect password. Please verify your credentials.' };
    }
    if (teacher.status === 'pending') {
      return { success: false, message: 'Your teacher registration is currently under review by the Headmaster/Admin. Once approved, you will be able to access the Teacher Portal.' };
    }
    if (teacher.status === 'rejected') {
      return { success: false, message: 'Your teacher registration was not approved. Contact the Headmaster office.' };
    }

    setCurrentRole('teacher');
    setCurrentUser({ id: teacher.id, name: teacher.name, email: teacher.email, extra: teacher });
    setActiveTab('teacher-portal');
    showAlert('Welcome Teacher', `Logged in as ${teacher.name} (${teacher.designation || 'Teacher'}).`, 'success');
    return { success: true, message: 'Login successful', teacher };
  };

  const loginAsStudent = (identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const student = students.find((s) => {
      const matchesEmail = s.email.toLowerCase() === cleanId;
      const matchesGr = s.grNumber && s.grNumber.toLowerCase() === cleanId;
      const matchesBform = s.cnicBForm && s.cnicBForm.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '') && cleanId.length >= 5;
      return matchesEmail || matchesGr || matchesBform;
    });

    if (!student) {
      return { success: false, message: 'No student admission account found with this Email, GR Number, or B-Form. Please register first via Online Admission.' };
    }
    if (student.password && student.password !== pass) {
      return { success: false, message: 'Incorrect password. Please verify your student credentials.' };
    }
    setCurrentRole('student');
    setCurrentUser({ id: student.id, name: student.name, email: student.email, extra: student });
    setActiveTab('student-portal');
    if (student.status === 'pending') {
      showAlert('Admission Pending', 'Your admission form has been submitted and is awaiting Admin review & GR Number allotment.', 'info');
    } else {
      showAlert('Welcome Student', `Logged in as ${student.name} (${student.grNumber || 'Enrolled'}).`, 'success');
    }
    return { success: true, message: 'Login successful', student };
  };

  const logout = () => {
    setCurrentRole('guest');
    setCurrentUser(null);
    setActiveTab('home');
    showAlert('Logged Out', 'You have been safely signed out.', 'info');
  };

  // Student registration & approval
  const registerStudent = (studentData: Omit<Student, 'id' | 'status' | 'admissionDate'>) => {
    const newId = 's-' + Date.now();
    const today = new Date().toISOString().split('T')[0];
    const newStudent: Student = {
      ...studentData,
      id: newId,
      status: 'pending',
      admissionDate: today,
    };

    setStudents((prev) => [newStudent, ...prev]);
    // Automatically log in as student so they can see their application status & form receipt
    setCurrentRole('student');
    setCurrentUser({ id: newId, name: newStudent.name, email: newStudent.email, extra: newStudent });
    setActiveTab('student-portal');
    showAlert('Registration Submitted!', 'Your admission application has been registered successfully! It has been routed to the Admin for review and GR Number allotment.', 'success');
    return { success: true, studentId: newId };
  };

  const approveStudent = (studentId: string, grNumber: string, section: string = 'A', rollNo?: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            status: 'approved' as const,
            grNumber: grNumber || `GR-406020752-${Math.floor(1000 + Math.random() * 9000)}`,
            section: section || s.section || 'A',
            rollNo: rollNo || s.rollNo || '01',
          };
          // If current student is logged in, update extra
          if (currentUser?.id === studentId) {
            setCurrentUser((u: any) => ({ ...u, extra: updated }));
          }
          return updated;
        }
        return s;
      })
    );
    showAlert('Student Approved!', `Admission approved and GR Number [${grNumber}] allotted. Student can now access Enrollment Card, ID Card, and Result Sheet.`, 'success');
  };

  const rejectStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'rejected' as const } : s))
    );
    showAlert('Application Rejected', 'The student application has been marked rejected.', 'info');
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    showAlert('Record Deleted', 'Student record removed.', 'info');
  };

  // Teacher registration & approval
  const registerTeacher = (teacherData: Omit<Teacher, 'id' | 'status' | 'joinDate'>) => {
    const newId = 't-' + Date.now();
    const today = new Date().toISOString().split('T')[0];
    const newTeacher: Teacher = {
      ...teacherData,
      id: newId,
      status: 'pending',
      joinDate: today,
      isAvailableToday: true,
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    showAlert('Teacher Registered!', 'Application submitted for Admin review. Once approved, your profile will be featured on the Faculty page and you can sign in to the Teacher Dashboard.', 'success');
    return { success: true, teacherId: newId };
  };

  const approveTeacher = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          const updated = { ...t, status: 'approved' as const };
          if (currentUser?.id === teacherId) {
            setCurrentUser((u: any) => ({ ...u, extra: updated }));
          }
          return updated;
        }
        return t;
      })
    );
    showAlert('Teacher Approved!', 'Teacher is now approved, granted access to Teacher Dashboard, and listed publicly on the Faculty tab.', 'success');
  };

  const rejectTeacher = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, status: 'rejected' as const } : t))
    );
    showAlert('Teacher Rejected', 'The teacher application was marked rejected.', 'info');
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    showAlert('Teacher Removed', 'Teacher record removed.', 'info');
  };

  // Timetable slot update
  const updateTimetableSlot = (slot: TimetableSlot) => {
    setTimetable((prev) => {
      const exists = prev.some((s) => s.id === slot.id);
      if (exists) {
        return prev.map((s) => (s.id === slot.id ? slot : s));
      }
      return [...prev, slot];
    });
    showAlert('Timetable Updated', `Schedule updated for ${slot.className} - Period ${slot.period}.`, 'success');
  };

  const assignProxyTeacher = (slotId: string, proxyTeacherId: string, reason: string) => {
    const proxyTeacher = teachers.find((t) => t.id === proxyTeacherId);
    if (!proxyTeacher) return;
    setTimetable((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            isSubstituted: true,
            substitutedTeacherId: proxyTeacher.id,
            substitutedTeacherName: proxyTeacher.name,
            substitutionReason: reason,
          };
        }
        return s;
      })
    );
    showAlert('Substitution Assigned', `${proxyTeacher.name} assigned to engage class for Period ${slotId} (${reason}).`, 'success');
  };

  const clearProxySubstitution = (slotId: string) => {
    setTimetable((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          const { isSubstituted, substitutedTeacherId, substitutedTeacherName, substitutionReason, ...rest } = s;
          return rest;
        }
        return s;
      })
    );
    showAlert('Substitution Cleared', 'Slot restored to regular teacher.', 'info');
  };

  // Attendance
  const markDailyAttendance = (records: AttendanceRecord[]) => {
    setAttendance((prev) => {
      const filtered = prev.filter(
        (p) => !records.some((r) => r.date === p.date && r.personId === p.personId && r.period === p.period)
      );
      return [...records, ...filtered];
    });
    showAlert('Attendance Saved', `Successfully recorded attendance for ${records.length} individual(s).`, 'success');
  };

  // Remarks
  const postDailyRemark = (remarkData: Omit<DailyRemark, 'id'>) => {
    const newRemark: DailyRemark = {
      ...remarkData,
      id: 'rem-' + Date.now(),
    };
    setRemarks((prev) => [newRemark, ...prev]);
    showAlert('Remarks Recorded', 'Classwork, homework, and performance remarks published to Student & Parent view.', 'success');
  };

  // Certificates & Results
  const issueOrUpdateResult = (result: StudentResult) => {
    setResults((prev) => {
      const exists = prev.some((r) => r.id === result.id || (r.studentId === result.studentId && r.examTerm === result.examTerm));
      if (exists) {
        return prev.map((r) => (r.id === result.id ? result : r));
      }
      return [result, ...prev];
    });
    showAlert('Result Sheet Issued', `Result Sheet generated for ${result.studentName} (${result.finalGrade}).`, 'success');
  };

  const issueLeavingCertificate = (cert: LeavingCertificateData) => {
    setLeavingCertificates((prev) => {
      const exists = prev.some((c) => c.id === cert.id || c.studentId === cert.studentId);
      if (exists) {
        return prev.map((c) => (c.id === cert.id ? cert : c));
      }
      return [cert, ...prev];
    });
    showAlert('Leaving Certificate Issued', `School Leaving Certificate issued for ${cert.studentName} (GR: ${cert.grNumber}).`, 'success');
  };

  // CMS
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showAlert('Settings Saved', 'School information and content updated successfully.', 'success');
  };

  const updateLeaderMessage = (id: string, updated: Partial<LeaderMessage>) => {
    setLeaderMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...updated } : msg))
    );
    showAlert('Message Updated', 'Leader message and photo successfully saved.', 'success');
  };

  const submitInquiry = (inquiryData: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'unread',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    showAlert('Message Sent', 'Thank you! Your inquiry has reached the Headmaster & Admin office. We will get back to you shortly.', 'success');
  };

  const markInquiryRead = (id: string) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: 'read' as const } : inq)));
  };

  return (
    <SchoolContext.Provider
      value={{
        currentRole,
        currentUser,
        activeTab,
        setActiveTab,
        deviceMode,
        setDeviceMode,
        settings,
        leaderMessages,
        teachers,
        students,
        timetable,
        remarks,
        attendance,
        results,
        leavingCertificates,
        inquiries,
        alertMessage,
        clearAlert,
        showAlert,
        loginAsAdmin,
        loginAsTeacher,
        loginAsStudent,
        logout,
        registerStudent,
        approveStudent,
        rejectStudent,
        deleteStudent,
        registerTeacher,
        approveTeacher,
        rejectTeacher,
        deleteTeacher,
        updateTimetableSlot,
        assignProxyTeacher,
        clearProxySubstitution,
        markDailyAttendance,
        postDailyRemark,
        issueOrUpdateResult,
        issueLeavingCertificate,
        updateSettings,
        updateLeaderMessage,
        submitInquiry,
        markInquiryRead,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
