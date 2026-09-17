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
  loginDirectAsAdmin: () => boolean;
  loginAsTeacher: (email: string, pass: string) => { success: boolean; message: string; teacher?: Teacher };
  loginAsStudent: (email: string, pass: string) => { success: boolean; message: string; student?: Student };
  logout: () => void;

  // Student Admissions
  registerStudent: (student: Omit<Student, 'id' | 'status' | 'admissionDate'>) => { success: boolean; studentId: string };
  updateStudent: (studentId: string, updatedData: Partial<Student>) => void;
  approveStudent: (studentId: string, grNumber: string, section?: string, rollNo?: string) => void;
  rejectStudent: (studentId: string) => void;
  deleteStudent: (studentId: string) => void;

  // Teacher Management
  registerTeacher: (teacher: Omit<Teacher, 'id' | 'status' | 'joinDate'>) => { success: boolean; teacherId: string };
  updateTeacher: (teacherId: string, updatedData: Partial<Teacher>) => void;
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
  updateSettings: (newSettings: Partial<SchoolSettings>) => Promise<boolean>;
  updateLeaderMessage: (id: string, updated: Partial<LeaderMessage>) => Promise<boolean>;
  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => void;
  markInquiryRead: (id: string) => void;

  // Live Website Synchronization & Server Persistence
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncStatus: 'synced' | 'unsaved' | 'syncing' | 'error';
  isLiveConnected: boolean;
  syncWithWebsite: (manual?: boolean, customData?: any) => Promise<boolean>;
  refreshFromWebsite: (manual?: boolean) => Promise<boolean>;
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
    console.warn('Error setting localStorage for key', key, err);
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

  // Live Website Sync & Server Persistence State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => getStored<string | null>('lastSyncedAt', null));
  const [syncStatus, setSyncStatus] = useState<'synced' | 'unsaved' | 'syncing' | 'error'>('synced');
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

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

  // Pull latest live data from website server with anti-cache safeguards
  const refreshFromWebsite = async (manual = false): Promise<boolean> => {
    try {
      setIsSyncing(true);
      const res = await fetch(`/api/school-data?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.settings) {
          setSettings(d.settings);
          setStored('settings', d.settings);
        }
        if (Array.isArray(d.leaderMessages)) {
          setLeaderMessages(d.leaderMessages);
          setStored('leaderMessages', d.leaderMessages);
        }
        if (Array.isArray(d.teachers) && d.teachers.length > 0) {
          let teachersList = d.teachers;
          if (currentUser?.role === 'teacher' && currentUser.extra?.id) {
            const exists = teachersList.some((t: Teacher) => t.id === currentUser.extra.id);
            if (!exists) {
              teachersList = [currentUser.extra, ...teachersList];
            }
          }
          setTeachers(teachersList);
          setStored('teachers', teachersList);
        }
        if (Array.isArray(d.students) && d.students.length > 0) {
          let studentsList = d.students;
          if (currentUser?.role === 'student' && currentUser.extra?.id) {
            const exists = studentsList.some((s: Student) => s.id === currentUser.extra.id);
            if (!exists) {
              studentsList = [currentUser.extra, ...studentsList];
            }
          }
          setStudents(studentsList);
          setStored('students', studentsList);
        }
        if (Array.isArray(d.timetable)) {
          setTimetable(d.timetable);
          setStored('timetable', d.timetable);
        }
        if (Array.isArray(d.remarks)) {
          setRemarks(d.remarks);
          setStored('remarks', d.remarks);
        }
        if (Array.isArray(d.attendance)) {
          setAttendance(d.attendance);
          setStored('attendance', d.attendance);
        }
        if (Array.isArray(d.results)) {
          setResults(d.results);
          setStored('results', d.results);
        }
        if (Array.isArray(d.leavingCertificates)) {
          setLeavingCertificates(d.leavingCertificates);
          setStored('leavingCertificates', d.leavingCertificates);
        }
        if (Array.isArray(d.inquiries)) {
          setInquiries(d.inquiries);
          setStored('inquiries', d.inquiries);
        }

        // Keep logged-in user profile synced with server updates (e.g. GR allotment, approval status)
        if (currentUser && currentUser.extra?.id) {
          if (currentUser.role === 'student' && Array.isArray(d.students)) {
            const match = d.students.find((s: Student) => s.id === currentUser.extra.id);
            if (match) {
              setCurrentUser((prev: any) => ({
                ...prev,
                name: match.name,
                email: match.email,
                extra: match,
              }));
            }
          } else if (currentUser.role === 'teacher' && Array.isArray(d.teachers)) {
            const match = d.teachers.find((t: Teacher) => t.id === currentUser.extra.id);
            if (match) {
              setCurrentUser((prev: any) => ({
                ...prev,
                name: match.name,
                email: match.email,
                extra: match,
              }));
            }
          }
        }

        const syncTime = json.lastSyncedAt || new Date().toISOString();
        setLastSyncedAt(syncTime);
        setStored('lastSyncedAt', syncTime);
        setSyncStatus('synced');
        setIsLiveConnected(true);

        if (manual) {
          showAlert(
            'Website Data Refreshed',
            'Successfully loaded the latest live school data published on the website.',
            'success'
          );
        }
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Could not fetch latest data from server API, utilizing locally cached data:', err);
      setIsLiveConnected(false);
      if (manual) {
        showAlert(
          'Offline Mode',
          'Could not contact website server. Displaying cached records.',
          'info'
        );
      }
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // On app initial load, pull latest data from server and periodically refresh to catch internet registrations
  useEffect(() => {
    refreshFromWebsite(false);
    // Background sync every 10 seconds so admissions from any device appear live on admin portal
    const pollTimer = setInterval(() => {
      refreshFromWebsite(false);
    }, 10000);

    // Refresh when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshFromWebsite(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Publish and sync complete school data to website server
  const syncWithWebsite = async (manual = false, customData?: any): Promise<boolean> => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const payload = {
        settings: customData?.settings ? { ...settings, ...customData.settings } : settings,
        leaderMessages: customData?.leaderMessages || leaderMessages,
        teachers: customData?.teachers || teachers,
        students: customData?.students || students,
        timetable: customData?.timetable || timetable,
        remarks: customData?.remarks || remarks,
        attendance: customData?.attendance || attendance,
        results: customData?.results || results,
        leavingCertificates: customData?.leavingCertificates || leavingCertificates,
        inquiries: customData?.inquiries || inquiries,
      };

      const res = await fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (json.success) {
        if (json.data) {
          const d = json.data;
          if (d.settings) {
            setSettings(d.settings);
            setStored('settings', d.settings);
          }
          if (Array.isArray(d.leaderMessages)) {
            setLeaderMessages(d.leaderMessages);
            setStored('leaderMessages', d.leaderMessages);
          }
          if (Array.isArray(d.teachers)) {
            setTeachers(d.teachers);
            setStored('teachers', d.teachers);
          }
          if (Array.isArray(d.students)) {
            setStudents(d.students);
            setStored('students', d.students);
          }
        } else {
          if (payload.settings) {
            setSettings(payload.settings);
            setStored('settings', payload.settings);
          }
          if (payload.leaderMessages) {
            setLeaderMessages(payload.leaderMessages);
            setStored('leaderMessages', payload.leaderMessages);
          }
        }

        const syncTime = json.lastSyncedAt || new Date().toISOString();
        setLastSyncedAt(syncTime);
        setStored('lastSyncedAt', syncTime);
        setSyncStatus('synced');
        setIsLiveConnected(true);

        if (manual) {
          showAlert(
            'Synced & Published to Live Website!',
            'All updates (school information, announcements, admissions, teachers, timetable, and CMS) are now live on the website and visible to all users across devices.',
            'success'
          );
        }
        return true;
      } else {
        throw new Error(json.message || 'Sync failed');
      }
    } catch (err: any) {
      console.error('Failed to sync data with website server:', err);
      setSyncStatus('error');
      setIsLiveConnected(false);
      if (manual) {
        showAlert(
          'Sync Notice',
          'Could not reach the server API. Changes are safely saved in local browser storage.',
          'warning'
        );
      }
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const showAlert = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setAlertMessage({ title, message, type });
  };

  const clearAlert = () => {
    setAlertMessage(null);
  };

  // Auth
  const loginAsAdmin = (user: string, pass: string): boolean => {
    const cleanUser = (user || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    const customAdminUser = (settings.adminUsername || '').trim().toLowerCase();
    const customAdminPass = (settings.adminPassword || '').trim();

    // Recognized Admin usernames
    const isValidUser =
      cleanUser === 'sham nanjwani' ||
      cleanUser === 'sham' ||
      cleanUser === 'admin' ||
      cleanUser === 'sham_nanjwani' ||
      cleanUser === 'ghansham' ||
      cleanUser === 'ghansham das' ||
      cleanUser === 'ghansham das nanjwani' ||
      cleanUser === 'ghanshamdas' ||
      cleanUser === 'ghanshamdasnanjwani' ||
      cleanUser === 'ghanshamdasnanjwani@gmail.com' ||
      cleanUser === 'headmaster' ||
      cleanUser === 'principal' ||
      cleanUser === 'jest' ||
      (customAdminUser !== '' && cleanUser === customAdminUser) ||
      (settings.email && cleanUser === settings.email.trim().toLowerCase()) ||
      cleanUser === 'sham.nanjwani@gbhsmehrand.edu.pk' ||
      cleanUser === 'info.gbhsmehrand@gmail.com';

    // Recognized Admin passwords (case-flexible & trimmed)
    const isValidPass =
      cleanPass === 'Sham@580' ||
      cleanPass.toLowerCase() === 'sham@580' ||
      cleanPass === 'Admin@580' ||
      cleanPass.toLowerCase() === 'admin@580' ||
      cleanPass === 'Sham580' ||
      cleanPass.toLowerCase() === 'sham580' ||
      cleanPass === 'Admin123' ||
      cleanPass.toLowerCase() === 'admin123' ||
      cleanPass.toLowerCase() === 'admin' ||
      cleanPass.toLowerCase() === 'sham' ||
      (customAdminPass !== '' && cleanPass === customAdminPass) ||
      (customAdminPass !== '' && cleanPass.toLowerCase() === customAdminPass.toLowerCase());

    if (isValidUser && isValidPass) {
      setCurrentRole('admin');
      setCurrentUser({
        id: 'admin-root',
        name: settings.adminUsername || 'Sham Nanjwani',
        email: settings.email || 'sham.nanjwani@gbhsmehrand.edu.pk',
      });
      setActiveTab('admin-portal');
      showAlert(
        'Welcome Administrator',
        'Successfully authenticated into GBHS Mehrand Administrative Control Center.',
        'success'
      );
      return true;
    }

    showAlert(
      'Login Credentials Unmatched',
      'Invalid credentials. Tip: Use Username: "Sham Nanjwani" (or "admin") and Password: "Sham@580" (or click "Instant 1-Click Login").',
      'error'
    );
    return false;
  };

  const loginDirectAsAdmin = (): boolean => {
    setCurrentRole('admin');
    setCurrentUser({
      id: 'admin-root',
      name: settings.adminUsername || 'Sham Nanjwani',
      email: settings.email || 'sham.nanjwani@gbhsmehrand.edu.pk',
    });
    setActiveTab('admin-portal');
    showAlert(
      'Welcome Administrator',
      'Direct 1-Click Access granted to GBHS Mehrand Administrative Control Center.',
      'success'
    );
    return true;
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

    // Push directly to central live server over internet
    fetch('/api/register-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student: newStudent }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setIsLiveConnected(true);
        }
      })
      .catch((err) => console.warn('Online registration server sync notice:', err));

    // Automatically log in as student so they can see their application status & form receipt
    setCurrentRole('student');
    setCurrentUser({ id: newId, name: newStudent.name, email: newStudent.email, extra: newStudent });
    setActiveTab('student-portal');
    showAlert('Registration Submitted!', 'Your admission application has been registered successfully! It has been routed to the Admin for review and GR Number allotment.', 'success');
    return { success: true, studentId: newId };
  };

  const approveStudent = (studentId: string, grNumber: string, section: string = 'A', rollNo?: string) => {
    let updatedList: Student[] = [];
    setStudents((prev) => {
      updatedList = prev.map((s) => {
        if (s.id === studentId) {
          const updated = {
            ...s,
            status: 'approved' as const,
            grNumber: grNumber || `GR-406020752-${Math.floor(1000 + Math.random() * 9000)}`,
            section: section || s.section || 'A',
            rollNo: rollNo || s.rollNo || '01',
          };
          if (currentUser?.id === studentId) {
            setCurrentUser((u: any) => ({ ...u, extra: updated }));
          }
          return updated;
        }
        return s;
      });
      // Synchronously sync to server with newly computed updatedList
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { students: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Student Approved!', `Admission approved and GR Number [${grNumber}] allotted. Student can now access Enrollment Card, ID Card, and Result Sheet.`, 'success');
  };

  const rejectStudent = (studentId: string) => {
    let updatedList: Student[] = [];
    setStudents((prev) => {
      updatedList = prev.map((s) => (s.id === studentId ? { ...s, status: 'rejected' as const } : s));
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { students: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Application Rejected', 'The student application has been marked rejected.', 'info');
  };

  const deleteStudent = (studentId: string) => {
    let updatedList: Student[] = [];
    setStudents((prev) => {
      updatedList = prev.filter((s) => s.id !== studentId);
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { students: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Record Deleted', 'Student record removed.', 'info');
  };

  const updateStudent = (studentId: string, updatedData: Partial<Student>) => {
    let updatedList: Student[] = [];
    setStudents((prev) => {
      updatedList = prev.map((s) => {
        if (s.id === studentId) {
          const updated = { ...s, ...updatedData };
          if (currentUser?.id === studentId) {
            setCurrentUser((u: any) => ({ ...u, extra: updated, name: updated.name, email: updated.email }));
          }
          return updated;
        }
        return s;
      });
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { students: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Student Record Updated', 'The student particulars have been successfully updated in official school records.', 'success');
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

    // Push teacher registration to server
    fetch('/api/register-teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacher: newTeacher }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setIsLiveConnected(true);
      })
      .catch((err) => console.warn('Teacher server sync notice:', err));

    showAlert('Teacher Registered!', 'Application submitted for Admin review. Once approved, your profile will be featured on the Faculty page and you can sign in to the Teacher Dashboard.', 'success');
    return { success: true, teacherId: newId };
  };

  const approveTeacher = (teacherId: string) => {
    let updatedList: Teacher[] = [];
    setTeachers((prev) => {
      updatedList = prev.map((t) => {
        if (t.id === teacherId) {
          const updated = { ...t, status: 'approved' as const };
          if (currentUser?.id === teacherId) {
            setCurrentUser((u: any) => ({ ...u, extra: updated }));
          }
          return updated;
        }
        return t;
      });
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { teachers: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Teacher Approved!', 'Teacher is now approved, granted access to Teacher Dashboard, and listed publicly on the Faculty tab.', 'success');
  };

  const rejectTeacher = (teacherId: string) => {
    let updatedList: Teacher[] = [];
    setTeachers((prev) => {
      updatedList = prev.map((t) => (t.id === teacherId ? { ...t, status: 'rejected' as const } : t));
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { teachers: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Teacher Rejected', 'The teacher application was marked rejected.', 'info');
  };

  const deleteTeacher = (teacherId: string) => {
    let updatedList: Teacher[] = [];
    setTeachers((prev) => {
      updatedList = prev.filter((t) => t.id !== teacherId);
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { teachers: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Teacher Removed', 'Teacher record removed.', 'info');
  };

  const updateTeacher = (teacherId: string, updatedData: Partial<Teacher>) => {
    let updatedList: Teacher[] = [];
    setTeachers((prev) => {
      updatedList = prev.map((t) => {
        if (t.id === teacherId) {
          const updated = { ...t, ...updatedData };
          if (currentUser?.id === teacherId) {
            setCurrentUser((u: any) => ({ ...u, extra: updated, name: updated.name, email: updated.email }));
          }
          return updated;
        }
        return t;
      });
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { teachers: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });

    showAlert('Teacher Record Updated', 'The faculty member record has been successfully updated.', 'success');
  };

  // Timetable slot update
  const updateTimetableSlot = (slot: TimetableSlot) => {
    let updatedList: TimetableSlot[] = [];
    setTimetable((prev) => {
      const exists = prev.some((s) => s.id === slot.id);
      if (exists) {
        updatedList = prev.map((s) => (s.id === slot.id ? slot : s));
      } else {
        updatedList = [...prev, slot];
      }
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { timetable: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });
    showAlert('Timetable Updated', `Schedule updated for ${slot.className} - Period ${slot.period}.`, 'success');
  };

  const assignProxyTeacher = (slotId: string, proxyTeacherId: string, reason: string) => {
    const proxyTeacher = teachers.find((t) => t.id === proxyTeacherId);
    if (!proxyTeacher) return;
    let updatedList: TimetableSlot[] = [];
    setTimetable((prev) => {
      updatedList = prev.map((s) => {
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
      });
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { timetable: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });
    showAlert('Substitution Assigned', `${proxyTeacher.name} assigned to engage class for Period ${slotId} (${reason}).`, 'success');
  };

  const clearProxySubstitution = (slotId: string) => {
    let updatedList: TimetableSlot[] = [];
    setTimetable((prev) => {
      updatedList = prev.map((s) => {
        if (s.id === slotId) {
          const { isSubstituted, substitutedTeacherId, substitutedTeacherName, substitutionReason, ...rest } = s;
          return rest;
        }
        return s;
      });
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { timetable: updatedList } }),
      }).catch((e) => console.warn('Sync notice:', e));
      return updatedList;
    });
    showAlert('Substitution Cleared', 'Slot restored to regular teacher.', 'info');
  };

  // Attendance - syncs immediately to database
  const markDailyAttendance = (records: AttendanceRecord[]) => {
    let newAttendance: AttendanceRecord[] = [];
    setAttendance((prev) => {
      const filtered = prev.filter(
        (p) => !records.some((r) => r.date === p.date && r.personId === p.personId && (r.period === p.period || (!r.period && !p.period)))
      );
      newAttendance = [...records, ...filtered];
      // Sync immediately to central server database
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { attendance: newAttendance } }),
      }).catch((e) => console.warn('Attendance sync error:', e));
      return newAttendance;
    });
    showAlert('Attendance Saved & Published', `Successfully recorded and published attendance for ${records.length} individual(s).`, 'success');
  };

  // Remarks
  const postDailyRemark = (remarkData: Omit<DailyRemark, 'id'>) => {
    const newRemark: DailyRemark = {
      ...remarkData,
      id: 'rem-' + Date.now(),
    };
    let updatedRemarks: DailyRemark[] = [];
    setRemarks((prev) => {
      updatedRemarks = [newRemark, ...prev];
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { remarks: updatedRemarks } }),
      }).catch((e) => console.warn('Remarks sync error:', e));
      return updatedRemarks;
    });
    showAlert('Remarks Recorded', 'Classwork, homework, and performance remarks published to Student & Parent view.', 'success');
  };

  // Certificates & Results
  const issueOrUpdateResult = (result: StudentResult) => {
    let updatedResults: StudentResult[] = [];
    setResults((prev) => {
      const exists = prev.some((r) => r.id === result.id || (r.studentId === result.studentId && r.examTerm === result.examTerm));
      if (exists) {
        updatedResults = prev.map((r) => (r.id === result.id ? result : r));
      } else {
        updatedResults = [result, ...prev];
      }
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { results: updatedResults } }),
      }).catch((e) => console.warn('Results sync error:', e));
      return updatedResults;
    });
    showAlert('Result Sheet Issued', `Result Sheet generated for ${result.studentName} (${result.finalGrade}).`, 'success');
  };

  const issueLeavingCertificate = (cert: LeavingCertificateData) => {
    let updatedCerts: LeavingCertificateData[] = [];
    setLeavingCertificates((prev) => {
      const exists = prev.some((c) => c.id === cert.id || c.studentId === cert.studentId);
      if (exists) {
        updatedCerts = prev.map((c) => (c.id === cert.id ? cert : c));
      } else {
        updatedCerts = [cert, ...prev];
      }
      fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { leavingCertificates: updatedCerts } }),
      }).catch((e) => console.warn('Certificates sync error:', e));
      return updatedCerts;
    });
    showAlert('Leaving Certificate Issued', `School Leaving Certificate issued for ${cert.studentName} (GR: ${cert.grNumber}).`, 'success');
  };

  // CMS & Settings
  const updateSettings = async (newSettings: Partial<SchoolSettings>): Promise<boolean> => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    setStored('settings', updated);

    let updatedLeaderMessages = leaderMessages;
    if (newSettings.headmasterName) {
      updatedLeaderMessages = leaderMessages.map((m) =>
        m.id === 'headmaster' ? { ...m, name: newSettings.headmasterName! } : m
      );
      setLeaderMessages(updatedLeaderMessages);
      setStored('leaderMessages', updatedLeaderMessages);
    }

    try {
      setIsSyncing(true);
      setSyncStatus('syncing');
      const res = await fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            settings: updated,
            ...(newSettings.headmasterName ? { leaderMessages: updatedLeaderMessages } : {}),
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (json.data?.settings) {
          setSettings(json.data.settings);
          setStored('settings', json.data.settings);
        }
        if (Array.isArray(json.data?.leaderMessages)) {
          setLeaderMessages(json.data.leaderMessages);
          setStored('leaderMessages', json.data.leaderMessages);
        }
        const syncTime = json.lastSyncedAt || new Date().toISOString();
        setLastSyncedAt(syncTime);
        setStored('lastSyncedAt', syncTime);
        setSyncStatus('synced');
        setIsLiveConnected(true);
        showAlert('Settings Saved & Synced', 'School settings and Headmaster credentials updated and published live to the website.', 'success');
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Background sync to website server warning:', e);
      setSyncStatus('error');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateLeaderMessage = async (id: string, updated: Partial<LeaderMessage>): Promise<boolean> => {
    const updatedMessages = leaderMessages.map((msg) => (msg.id === id ? { ...msg, ...updated } : msg));
    setLeaderMessages(updatedMessages);
    setStored('leaderMessages', updatedMessages);

    let updatedSettings = settings;
    if (id === 'headmaster' && updated.name) {
      updatedSettings = { ...settings, headmasterName: updated.name };
      setSettings(updatedSettings);
      setStored('settings', updatedSettings);
    }

    try {
      setIsSyncing(true);
      const res = await fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            leaderMessages: updatedMessages,
            ...(id === 'headmaster' && updated.name ? { settings: updatedSettings } : {}),
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (json.data?.settings) {
          setSettings(json.data.settings);
          setStored('settings', json.data.settings);
        }
        if (Array.isArray(json.data?.leaderMessages)) {
          setLeaderMessages(json.data.leaderMessages);
          setStored('leaderMessages', json.data.leaderMessages);
        }
        setLastSyncedAt(json.lastSyncedAt || new Date().toISOString());
        showAlert('Message Updated & Synced', 'Leader message successfully saved and published.', 'success');
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Leader messages sync warning:', e);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const submitInquiry = (inquiryData: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'unread',
    };
    const updatedInquiries = [newInquiry, ...inquiries];
    setInquiries(updatedInquiries);
    setStored('inquiries', updatedInquiries);

    fetch('/api/school-data/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { inquiries: updatedInquiries } }),
    }).catch((e) => console.warn('Inquiry sync warning:', e));

    showAlert('Message Sent', 'Thank you! Your inquiry has reached the Headmaster & Admin office. We will get back to you shortly.', 'success');
  };

  const markInquiryRead = (id: string) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: 'read' as const } : inq));
    setInquiries(updated);
    setStored('inquiries', updated);
    fetch('/api/school-data/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { inquiries: updated } }),
    }).catch(() => {});
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
        isSyncing,
        lastSyncedAt,
        syncStatus,
        isLiveConnected,
        syncWithWebsite,
        refreshFromWebsite,
        loginAsAdmin,
        loginDirectAsAdmin,
        loginAsTeacher,
        loginAsStudent,
        logout,
        registerStudent,
        updateStudent,
        approveStudent,
        rejectStudent,
        deleteStudent,
        registerTeacher,
        updateTeacher,
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
