import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { parseScannedQrData } from '../../utils/qrCodeHelper';
import { Student, Teacher } from '../../types';
import { SafeMediaImage } from '../common/SafeMediaImage';
import {
  QrCode,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  X,
  UserCheck,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Clock,
  Volume2,
  Calendar,
  Layers,
  GraduationCap,
  Users
} from 'lucide-react';

interface QrAttendanceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTarget?: 'students' | 'teachers';
}

export const QrAttendanceScannerModal: React.FC<QrAttendanceScannerModalProps> = ({
  isOpen,
  onClose,
  defaultTarget = 'students',
}) => {
  const {
    students,
    teachers,
    settings,
    attendance,
    markDailyAttendance,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'quick_select'>('camera');
  const [selectedTarget, setSelectedTarget] = useState<'students' | 'teachers'>(defaultTarget);
  const [attendanceDate, setAttendanceDate] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );
  const [attendancePeriod, setAttendancePeriod] = useState<number>(1);

  // Camera states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Manual input state (for USB barcode gun or typing)
  const [manualInput, setManualInput] = useState('');
  const manualInputRef = useRef<HTMLInputElement | null>(null);

  // Verified matched record state
  const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);
  const [verifiedTeacher, setVerifiedTeacher] = useState<Teacher | null>(null);
  const [lastScannedRaw, setLastScannedRaw] = useState<string>('');
  const [unrecognizedCode, setUnrecognizedCode] = useState<string | null>(null);

  // Feedback states
  const [markSuccess, setMarkSuccess] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<
    Array<{
      id: string;
      name: string;
      code: string;
      type: 'student' | 'teacher';
      status: 'Present' | 'Late' | 'Absent' | 'Leave';
      time: string;
    }>
  >([]);

  // Sound chime
  const playChime = (success = true) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (success) {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch {
      // Audio context not allowed or failed, benign
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);

      // Start BarcodeDetector loop if supported
      if ('BarcodeDetector' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'code_128', 'code_39', 'ean_13'],
        });

        scanIntervalRef.current = window.setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const detectedVal = barcodes[0].rawValue;
                handleCodeDetected(detectedVal);
              }
            } catch {
              // Benign frame detection miss
            }
          }
        }, 500);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable', err);
      setCameraError('Camera access not available in this browser view. Use USB Scanner / Quick Select mode.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  // Handle scanned code from camera, USB reader, or picker
  const handleCodeDetected = (rawCode: string) => {
    if (!rawCode || rawCode.trim() === '' || rawCode === lastScannedRaw) return;
    setLastScannedRaw(rawCode);
    setUnrecognizedCode(null);
    setMarkSuccess(null);

    const parsed = parseScannedQrData(rawCode);

    // Try finding matching student
    let matchedStudent: Student | undefined;
    let matchedTeacher: Teacher | undefined;

    if (parsed.type === 'STUDENT' || parsed.code || parsed.id) {
      const codeOrId = (parsed.code || parsed.id || '').toLowerCase();
      matchedStudent = students.find(
        (s) =>
          s.id.toLowerCase() === codeOrId ||
          (s.grNumber && s.grNumber.toLowerCase() === codeOrId) ||
          s.cnicBForm === codeOrId
      );
    }

    if (!matchedStudent && (parsed.type === 'TEACHER' || parsed.code || parsed.id)) {
      const codeOrId = (parsed.code || parsed.id || '').toLowerCase();
      matchedTeacher = teachers.find(
        (t) =>
          t.id.toLowerCase() === codeOrId ||
          (t.pid && t.pid.toLowerCase() === codeOrId) ||
          t.cnic === codeOrId
      );
    }

    if (matchedStudent) {
      setVerifiedStudent(matchedStudent);
      setVerifiedTeacher(null);
      setSelectedTarget('students');
      playChime(true);
    } else if (matchedTeacher) {
      setVerifiedTeacher(matchedTeacher);
      setVerifiedStudent(null);
      setSelectedTarget('teachers');
      playChime(true);
    } else {
      setVerifiedStudent(null);
      setVerifiedTeacher(null);
      setUnrecognizedCode(rawCode);
      playChime(false);
    }
  };

  // Submit manual input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleCodeDetected(manualInput.trim());
      setManualInput('');
    }
  };

  // Record Attendance for the verified individual
  const handleRecordAttendance = (status: 'Present' | 'Late' | 'Absent' | 'Leave') => {
    if (verifiedStudent) {
      markDailyAttendance({
        date: attendanceDate,
        targetType: 'student',
        targetId: verifiedStudent.id,
        targetName: verifiedStudent.name,
        targetClass: verifiedStudent.appliedClass,
        period: attendancePeriod,
        status,
        markedBy: 'Admin (QR Attendance Scanner)',
        notes: `Scanned via Official Student ID QR Code (GR #${verifiedStudent.grNumber || verifiedStudent.id})`,
      });

      setMarkSuccess(`Marked ${verifiedStudent.name} (${verifiedStudent.appliedClass}) as ${status}!`);
      playChime(true);

      setScanHistory((prev) => [
        {
          id: verifiedStudent.id,
          name: verifiedStudent.name,
          code: verifiedStudent.grNumber || verifiedStudent.id,
          type: 'student',
          status,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...prev.slice(0, 9),
      ]);
    } else if (verifiedTeacher) {
      markDailyAttendance({
        date: attendanceDate,
        targetType: 'teacher',
        targetId: verifiedTeacher.id,
        targetName: verifiedTeacher.name,
        targetClass: verifiedTeacher.designation || 'Faculty',
        period: attendancePeriod,
        status,
        markedBy: 'Admin (QR Attendance Scanner)',
        notes: `Scanned via Official Staff ID QR Code (PID #${verifiedTeacher.pid})`,
      });

      setMarkSuccess(`Marked Faculty Member ${verifiedTeacher.name} as ${status}!`);
      playChime(true);

      setScanHistory((prev) => [
        {
          id: verifiedTeacher.id,
          name: verifiedTeacher.name,
          code: verifiedTeacher.pid,
          type: 'teacher',
          status,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        ...prev.slice(0, 9),
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn no-print overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-4 sm:p-6 space-y-5 animate-scaleUp text-slate-900 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 text-amber-300 rounded-2xl shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-950 flex items-center gap-2">
                QR Attendance & Verification Scanner
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Live Scanner
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Instantly scan student or teacher ID card QR codes to verify identity and record live attendance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date & Period Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              Attendance Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-700"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              Class Period
            </label>
            <select
              value={attendancePeriod}
              onChange={(e) => setAttendancePeriod(Number(e.target.value))}
              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-700"
            >
              <option value={1}>Period 1 (Morning Roll Call)</option>
              <option value={2}>Period 2</option>
              <option value={3}>Period 3</option>
              <option value={4}>Period 4</option>
              <option value={5}>Period 5</option>
              <option value={6}>Period 6</option>
              <option value={7}>Period 7</option>
            </select>
          </div>
        </div>

        {/* Scanner Source Mode Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'camera'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Camera Scanner</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              setTimeout(() => manualInputRef.current?.focus(), 100);
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'manual'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-700" />
            <span>USB Barcode Gun / Manual Input</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quick_select')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'quick_select'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Quick Test Picker</span>
          </button>
        </div>

        {/* MODE 1: Camera Scanner View */}
        {activeTab === 'camera' && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-[260px] flex items-center justify-center border-2 border-slate-300">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Crosshair Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-emerald-400 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative animate-pulse">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                </div>
              </div>

              {!isCameraActive && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-white p-4 text-center">
                  <CameraOff className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-300 max-w-xs">
                    {cameraError || 'Camera paused or not initialized.'}
                  </p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-3 px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Hold the Student or Faculty ID card in front of the lens. The QR code will be read automatically.
            </p>
          </div>
        )}

        {/* MODE 2: USB Barcode Gun / Manual Input */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-bold text-xs text-slate-800">
                Scan with Handheld USB / Bluetooth Scanner or Type G.R. / PID
              </label>
              <div className="flex gap-2">
                <input
                  ref={manualInputRef}
                  type="text"
                  placeholder="Paste QR payload, scan barcode, or enter GR-406020752-0101 / PID..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-emerald-700"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
                >
                  Lookup
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Hardware barcode guns automatically submit on enter key.
              </p>
            </div>
          </form>
        )}

        {/* MODE 3: Quick Test Picker */}
        {activeTab === 'quick_select' && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block">
              Simulate ID Card Scan by Selecting an Enrolled Student or Faculty Member:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                  Select Student:
                </label>
                <select
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    if (st) {
                      setVerifiedStudent(st);
                      setVerifiedTeacher(null);
                      setUnrecognizedCode(null);
                      playChime(true);
                    }
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:outline-none focus:border-emerald-700"
                  defaultValue=""
                >
                  <option value="" disabled>-- Choose a Student --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.appliedClass} - GR: {st.grNumber || 'Pending'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-700" />
                  Select Teacher:
                </label>
                <select
                  onChange={(e) => {
                    const tc = teachers.find((t) => t.id === e.target.value);
                    if (tc) {
                      setVerifiedTeacher(tc);
                      setVerifiedStudent(null);
                      setUnrecognizedCode(null);
                      playChime(true);
                    }
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-xs focus:outline-none focus:border-teal-700"
                  defaultValue=""
                >
                  <option value="" disabled>-- Choose a Teacher --</option>
                  {teachers.map((tc) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.name} ({tc.designation} - PID: {tc.pid})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* UNRECOGNIZED CODE ERROR BANNER */}
        {unrecognizedCode && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <strong className="block">Unrecognized ID Code</strong>
              <span className="font-mono text-[10.5px] truncate block">{unrecognizedCode}</span>
            </div>
          </div>
        )}

        {/* VERIFIED INDIVIDUAL BADGE & 1-CLICK ATTENDANCE RECORDING */}
        {(verifiedStudent || verifiedTeacher) && (
          <div className="p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Verified Identity Match
              </div>
              <span className="bg-emerald-800 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                {verifiedStudent ? 'Enrolled Student' : 'Approved Faculty'}
              </span>
            </div>

            {/* Individual Card Details */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-16 rounded-xl overflow-hidden border-2 border-emerald-700 shadow-sm shrink-0 bg-white">
                <SafeMediaImage
                  src={verifiedStudent ? verifiedStudent.studentPictureUrl : verifiedTeacher?.pictureUrl}
                  alt={verifiedStudent ? verifiedStudent.name : verifiedTeacher?.name || ''}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="font-black text-sm text-slate-950 truncate">
                  {verifiedStudent ? verifiedStudent.name : verifiedTeacher?.name}
                </div>
                <div className="text-xs text-slate-600">
                  S/O {verifiedStudent ? verifiedStudent.fatherName : verifiedTeacher?.fatherName}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-700 font-mono">
                  {verifiedStudent ? (
                    <>
                      <span className="font-bold text-emerald-900">{verifiedStudent.appliedClass}</span>
                      <span>•</span>
                      <span>GR: {verifiedStudent.grNumber || 'Pending'}</span>
                      <span>•</span>
                      <span>Roll: {verifiedStudent.rollNo || '01'}</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-teal-900">{verifiedTeacher?.designation}</span>
                      <span>•</span>
                      <span>PID: {verifiedTeacher?.pid}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* One-Click Attendance Action Buttons */}
            <div>
              <span className="block text-[11px] font-extrabold text-slate-700 mb-2">
                Mark Live Attendance for {attendanceDate} (Period {attendancePeriod}):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-black">
                <button
                  type="button"
                  onClick={() => handleRecordAttendance('Present')}
                  className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRecordAttendance('Late')}
                  className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-950" />
                  <span>Late</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRecordAttendance('Leave')}
                  className="py-2.5 px-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Leave</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRecordAttendance('Absent')}
                  className="py-2.5 px-3 bg-red-700 hover:bg-red-600 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Absent</span>
                </button>
              </div>
            </div>

            {/* Mark Success Message */}
            {markSuccess && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{markSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* RECENT SCAN SESSION LOG */}
        {scanHistory.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-extrabold text-slate-800 text-[11px] block">
              Session Scan History ({scanHistory.length}):
            </span>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {scanHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                        item.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Late'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Leave'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="font-bold text-slate-900 truncate">{item.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({item.code})</span>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0 font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
