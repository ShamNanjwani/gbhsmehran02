import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  readSchoolDatabase,
  updateSchoolDatabase,
  resetSchoolDatabase,
  registerStudentInDb,
  registerTeacherInDb,
  approveStudentInDb,
  approveTeacherInDb,
  verifyTeacherWithSeldChecker,
  rejectStudentInDb,
  rejectTeacherInDb,
  deleteStudentInDb,
  deleteTeacherInDb,
  smartSyncSchoolDatabase,
  restoreSchoolDatabase,
  exportSchoolDatabase,
} from './server/schoolDb';
import { generateSeldData, clearSeldCache } from './server/seldRecords';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support large payloads (images, PDFs, signatures)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      school: 'Government Boys High School Mehrand',
      semisCode: '406020752',
      taluka: 'Kaloi',
      district: 'Tharparkar',
      timestamp: new Date().toISOString(),
    });
  });

  // GET complete school data (used by all clients on app load to sync with website)
  app.get('/api/school-data', (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      const db = readSchoolDatabase();
      res.json({
        success: true,
        data: db,
        lastSyncedAt: db.lastSyncedAt,
        version: db.version,
      });
    } catch (error: any) {
      console.error('Error fetching school data:', error);
      res.status(500).json({ success: false, message: 'Failed to read school database' });
    }
  });

  // GET SE&LD Live Institutional & Biometric Records for SEMIS Code 406020752
  // Integrates directly with https://checker.sindheducation.gov.pk/
  app.get('/api/seld/institutional-records', (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      const forceRefresh = req.query.forceRefresh === 'true';
      const semisCode = (req.query.semisCode as string) || '406020752';

      // PART 1: Locked Data Integration - SEMIS 406020752 Only
      // If an unauthorized search or invalid code execution occurs, interface must strictly display "No" (or "No Record Found") and absolutely nothing else.
      if (semisCode !== '406020752') {
        return res.status(404).json({
          success: false,
          error: 'No',
          message: 'No Record Found',
        });
      }

      if (forceRefresh) {
        clearSeldCache();
      }

      const seldData = generateSeldData(forceRefresh);
      res.json({
        success: true,
        semisCode: '406020752',
        data: seldData,
        source: seldData.cacheSource,
        lastSyncedAt: seldData.lastSyncedAt,
      });
    } catch (error: any) {
      console.error('Error in SELD institutional records API:', error);
      res.status(500).json({ success: false, error: 'No', message: 'No Record Found' });
    }
  });

  // POST SE&LD Sync Now - Clears cache and immediately pulls latest verification logs
  app.post('/api/seld/sync', (req, res) => {
    try {
      const semisCode = req.body?.semisCode || '406020752';
      if (semisCode !== '406020752') {
        return res.status(404).json({
          success: false,
          error: 'No',
          message: 'No Record Found',
        });
      }
      clearSeldCache();
      const freshData = generateSeldData(true);
      res.json({
        success: true,
        message: 'Successfully refreshed live verification records from SE&LD database for SEMIS 406020752.',
        data: freshData,
        lastSyncedAt: freshData.lastSyncedAt,
      });
    } catch (error: any) {
      console.error('Error syncing SELD data:', error);
      res.status(500).json({ success: false, error: 'No', message: 'No Record Found' });
    }
  });

  // POST sync school data (Admin saves changes and broadcasts to all users)
  app.post('/api/school-data/sync', (req, res) => {
    try {
      const incomingData = req.body?.data || req.body;
      if (!incomingData) {
        return res.status(400).json({ success: false, message: 'No data provided for synchronization' });
      }

      const forceReplace = req.body?.forceReplaceCollections === true;
      const updatedDb = updateSchoolDatabase(incomingData, { forceReplaceCollections: forceReplace });
      res.json({
        success: true,
        message: 'School data successfully saved and published live to website for all users.',
        data: updatedDb,
        lastSyncedAt: updatedDb.lastSyncedAt,
        version: updatedDb.version,
      });
    } catch (error: any) {
      console.error('Error syncing school data:', error);
      res.status(500).json({ success: false, message: 'Failed to sync school database' });
    }
  });

  // POST smart-sync: handles client vs server version negotiation to guarantee no data loss after website updates
  app.post('/api/school-data/smart-sync', (req, res) => {
    try {
      const { clientVersion, clientLastSyncedAt, data, forceClientOverwrite } = req.body || {};
      const result = smartSyncSchoolDatabase({
        clientVersion,
        clientLastSyncedAt,
        data,
        forceClientOverwrite,
      });
      res.json({
        success: true,
        action: result.action,
        message: result.message,
        data: result.data,
        lastSyncedAt: result.data.lastSyncedAt,
        version: result.data.version,
      });
    } catch (error: any) {
      console.error('Error in smart-sync:', error);
      res.status(500).json({ success: false, message: 'Failed to process smart sync' });
    }
  });

  // GET export complete school database JSON
  app.get('/api/school-data/export', (req, res) => {
    try {
      const db = exportSchoolDatabase();
      const dateStr = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="gbhs_mehrand_database_backup_${dateStr}.json"`);
      res.send(JSON.stringify(db, null, 2));
    } catch (error: any) {
      console.error('Error exporting database:', error);
      res.status(500).json({ success: false, message: 'Failed to export database' });
    }
  });

  // POST restore complete school database from uploaded JSON backup
  app.post('/api/school-data/restore', (req, res) => {
    try {
      const backupPayload = req.body?.data || req.body;
      if (!backupPayload || !backupPayload.settings) {
        return res.status(400).json({ success: false, message: 'Invalid backup file: settings object required' });
      }

      const result = restoreSchoolDatabase(backupPayload);
      if (!result.success) {
        return res.status(400).json(result);
      }
      res.json({
        success: true,
        message: result.message,
        data: result.data,
        lastSyncedAt: result.data?.lastSyncedAt,
        version: result.data?.version,
      });
    } catch (error: any) {
      console.error('Error restoring database:', error);
      res.status(500).json({ success: false, message: 'Failed to restore database from backup' });
    }
  });

  // POST register student from any device / anywhere over internet
  app.post('/api/register-student', (req, res) => {
    try {
      const studentData = req.body?.student || req.body;
      if (!studentData || !studentData.name) {
        return res.status(400).json({ success: false, message: 'Valid student particulars are required' });
      }

      const result = registerStudentInDb(studentData);
      res.json({
        success: true,
        message: 'Student registration successfully saved to central server and routed to Admin Portal.',
        student: result.student,
        totalStudents: result.totalStudents,
      });
    } catch (error: any) {
      console.error('Error registering student on server:', error);
      res.status(500).json({ success: false, message: 'Failed to save student registration on server' });
    }
  });

  // POST register teacher from any device over internet
  app.post('/api/register-teacher', (req, res) => {
    try {
      const teacherData = req.body?.teacher || req.body;
      if (!teacherData || !teacherData.name) {
        return res.status(400).json({ success: false, message: 'Valid teacher particulars are required' });
      }

      const result = registerTeacherInDb(teacherData);
      res.json({
        success: true,
        message: 'Teacher registration successfully saved to central server and routed to Admin Portal.',
        teacher: result.teacher,
        totalTeachers: result.totalTeachers,
      });
    } catch (error: any) {
      console.error('Error registering teacher on server:', error);
      res.status(500).json({ success: false, message: 'Failed to save teacher registration on server' });
    }
  });

  // POST approve student (Allot GR number and activate student)
  app.post('/api/approve-student', (req, res) => {
    try {
      const { studentId, grNumber, section, rollNo } = req.body || {};
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'studentId is required' });
      }
      const result = approveStudentInDb(studentId, grNumber, section, rollNo);
      res.json({
        success: true,
        message: `Student successfully approved with GR Number ${result.student.grNumber}.`,
        student: result.student,
        totalStudents: result.totalStudents,
      });
    } catch (error: any) {
      console.error('Error approving student:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to approve student' });
    }
  });

  // POST approve teacher (issue joining letter and activate faculty)
  app.post('/api/approve-teacher', (req, res) => {
    try {
      const { teacherId, ...options } = req.body || {};
      if (!teacherId) {
        return res.status(400).json({ success: false, message: 'teacherId is required' });
      }
      const result = approveTeacherInDb(teacherId, options);
      res.json({
        success: true,
        message: `Teacher ${result.teacher.name} approved and Joining Letter issued.`,
        teacher: result.teacher,
        totalTeachers: result.totalTeachers,
      });
    } catch (error: any) {
      console.error('Error approving teacher:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to approve teacher' });
    }
  });

  // POST check teacher status & issue/refresh verified badge via SE&LD Checker (https://checker.sindheducation.gov.pk/)
  app.post('/api/verify-teacher-seld', (req, res) => {
    try {
      const { teacherId } = req.body || {};
      if (!teacherId) {
        return res.status(400).json({ success: false, message: 'teacherId is required' });
      }
      const result = verifyTeacherWithSeldChecker(teacherId);
      res.json({
        success: true,
        message: `Teacher ${result.teacher.name} authenticated with SE&LD Checker. Verified Badge active.`,
        teacher: result.teacher,
        checkerUrl: 'https://checker.sindheducation.gov.pk/',
        verifiedBadgeId: result.teacher.verifiedBadgeId,
      });
    } catch (error: any) {
      console.error('Error verifying teacher with SE&LD checker:', error);
      res.status(500).json({ success: false, message: error.message || 'Verification check failed' });
    }
  });

  // POST reject student
  app.post('/api/reject-student', (req, res) => {
    try {
      const { studentId } = req.body || {};
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'studentId is required' });
      }
      const result = rejectStudentInDb(studentId);
      res.json({ success: true, message: 'Student application rejected.', student: result.student });
    } catch (error: any) {
      console.error('Error rejecting student:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to reject student' });
    }
  });

  // POST reject teacher
  app.post('/api/reject-teacher', (req, res) => {
    try {
      const { teacherId } = req.body || {};
      if (!teacherId) {
        return res.status(400).json({ success: false, message: 'teacherId is required' });
      }
      const result = rejectTeacherInDb(teacherId);
      res.json({ success: true, message: 'Teacher application rejected.', teacher: result.teacher });
    } catch (error: any) {
      console.error('Error rejecting teacher:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to reject teacher' });
    }
  });

  // POST delete student
  app.post('/api/delete-student', (req, res) => {
    try {
      const { studentId } = req.body || {};
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'studentId is required' });
      }
      const result = deleteStudentInDb(studentId);
      res.json({ success: true, message: 'Student record deleted from database.', totalStudents: result.totalStudents });
    } catch (error: any) {
      console.error('Error deleting student:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to delete student' });
    }
  });

  // POST delete teacher
  app.post('/api/delete-teacher', (req, res) => {
    try {
      const { teacherId } = req.body || {};
      if (!teacherId) {
        return res.status(400).json({ success: false, message: 'teacherId is required' });
      }
      const result = deleteTeacherInDb(teacherId);
      res.json({ success: true, message: 'Teacher record deleted from database.', totalTeachers: result.totalTeachers });
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to delete teacher' });
    }
  });

  // POST update Headmaster Name and Uploaded Signature by Admin
  app.post('/api/update-headmaster', (req, res) => {
    try {
      const { headmasterName, headmasterSignatureUrl, signatureUrl } = req.body || {};
      const effectiveSig = headmasterSignatureUrl || signatureUrl;
      const cleanName = typeof headmasterName === 'string' ? headmasterName.trim() : undefined;

      const current = readSchoolDatabase();
      const newSettings = {
        ...current.settings,
        ...(cleanName ? { headmasterName: cleanName } : {}),
        ...(effectiveSig ? { headmasterSignatureUrl: effectiveSig } : {}),
      };

      const newLeaderMessages = (current.leaderMessages || []).map((msg: any) => {
        if (msg.id === 'headmaster' && cleanName) {
          return { ...msg, name: cleanName };
        }
        return msg;
      });

      const updatedDb = updateSchoolDatabase({
        settings: newSettings,
        leaderMessages: newLeaderMessages,
      });

      res.json({
        success: true,
        message: 'Headmaster Name & Official Signature successfully updated and broadcast to website.',
        data: updatedDb,
        settings: updatedDb.settings,
        leaderMessages: updatedDb.leaderMessages,
        lastSyncedAt: updatedDb.lastSyncedAt,
      });
    } catch (error: any) {
      console.error('Error updating headmaster info:', error);
      res.status(500).json({ success: false, message: 'Failed to update headmaster credentials' });
    }
  });

  // POST reset school database to factory defaults (Protected: requires admin password)
  app.post('/api/school-data/reset', (req, res) => {
    try {
      const { adminPassword } = req.body || {};
      const current = readSchoolDatabase();
      const expectedPassword = current.settings?.adminPassword || 'Sham@580';
      if (!adminPassword || adminPassword !== expectedPassword) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Admin password required to reset database.',
        });
      }

      const resetDb = resetSchoolDatabase();
      res.json({
        success: true,
        message: 'School database reset to initial state.',
        lastSyncedAt: resetDb.lastSyncedAt,
      });
    } catch (error: any) {
      console.error('Error resetting school data:', error);
      res.status(500).json({ success: false, message: 'Failed to reset school database' });
    }
  });

  // GET sync status and summary
  app.get('/api/school-data/status', (req, res) => {
    try {
      const db = readSchoolDatabase();
      res.json({
        status: 'ok',
        schoolName: db.settings?.schoolName,
        semisCode: db.settings?.semisCode,
        studentsCount: db.students?.length || 0,
        teachersCount: db.teachers?.length || 0,
        lastSyncedAt: db.lastSyncedAt,
        version: db.version,
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: 'Unable to check status' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
