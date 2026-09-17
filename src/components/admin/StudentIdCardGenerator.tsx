import React, { useState, useMemo } from 'react';
import {
  Shield,
  Printer,
  Download,
  Search,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Sliders,
  GraduationCap,
  QrCode,
  CheckCircle2,
  Eye,
  FileText,
  UserCheck,
  Check,
  Layers,
  Palette,
  Calendar,
} from 'lucide-react';
import { Student, SchoolSettings } from '../../types';
import {
  IdCardOptions,
  downloadStudentIdCardPDF,
  downloadBatchStudentIdCardsPDF,
} from '../../utils/pdfGenerator';
import { printIsolatedElement } from '../../utils/printUtils';
import { SchoolLogo } from '../common/SchoolLogo';
import { SafeMediaImage } from '../common/SafeMediaImage';
import { HeadmasterSignatureDisplay } from '../common/HeadmasterSignatureDisplay';

interface StudentIdCardGeneratorProps {
  students: Student[];
  settings: SchoolSettings;
  onClose?: () => void;
}

export const StudentIdCardGenerator: React.FC<StudentIdCardGeneratorProps> = ({
  students,
  settings,
  onClose,
}) => {
  // Filter state
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'approved' | 'all'>('approved');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected students for batch auto-generation
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() =>
    students.filter((s) => s.status === 'approved').map((s) => s.id)
  );

  // Active student highlighted for live preview
  const [highlightedStudentId, setHighlightedStudentId] = useState<string>(() => {
    const firstApproved = students.find((s) => s.status === 'approved');
    return firstApproved ? firstApproved.id : students[0]?.id || '';
  });

  // Card Options Customization
  const [colorScheme, setColorScheme] = useState<'emerald' | 'navy' | 'maroon' | 'slate'>('emerald');
  const [showBloodGroup, setShowBloodGroup] = useState(true);
  const [showEmergencyContact, setShowEmergencyContact] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [academicSession, setAcademicSession] = useState('2026-2027');
  const [validTill, setValidTill] = useState(settings.enrollmentCardValidTill || '31st May 2027');

  // UI states
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'sheet_preview'>('list');

  // Distinct classes available
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>();
    students.forEach((s) => {
      if (s.appliedClass) classSet.add(s.appliedClass);
    });
    return Array.from(classSet).sort();
  }, [students]);

  // Filtered students list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (statusFilter === 'approved' && s.status !== 'approved') return false;
      if (selectedClass !== 'all' && s.appliedClass !== selectedClass) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesFather = s.fatherName.toLowerCase().includes(q);
        const matchesGr = (s.grNumber || '').toLowerCase().includes(q);
        const matchesCnic = s.cnicBForm.toLowerCase().includes(q);
        if (!matchesName && !matchesFather && !matchesGr && !matchesCnic) return false;
      }
      return true;
    });
  }, [students, selectedClass, statusFilter, searchQuery]);

  // Students currently selected for generation
  const selectedStudents = useMemo(() => {
    const idSet = new Set(selectedStudentIds);
    return filteredStudents.filter((s) => idSet.has(s.id));
  }, [filteredStudents, selectedStudentIds]);

  // Current preview student
  const previewStudent = useMemo(() => {
    return (
      students.find((s) => s.id === highlightedStudentId) ||
      selectedStudents[0] ||
      filteredStudents[0] ||
      students[0]
    );
  }, [students, highlightedStudentId, selectedStudents, filteredStudents]);

  // Select all filtered students
  const handleSelectAllFiltered = () => {
    const currentFilteredIds = filteredStudents.map((s) => s.id);
    const combined = new Set([...selectedStudentIds, ...currentFilteredIds]);
    setSelectedStudentIds(Array.from(combined));
  };

  // Deselect all filtered students
  const handleDeselectAllFiltered = () => {
    const filteredIdSet = new Set(filteredStudents.map((s) => s.id));
    setSelectedStudentIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
  };

  // Toggle single student checkbox
  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Trigger batch PDF auto-generation
  const handleGenerateBatchPDF = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student to auto-generate ID cards.');
      return;
    }

    setIsGenerating(true);
    setSuccessMessage(null);
    try {
      const options: IdCardOptions = {
        colorScheme,
        showBloodGroup,
        showEmergencyContact,
        showAddress,
        showQrCode,
        showSignature,
        academicSession,
        validTill,
      };

      await downloadBatchStudentIdCardsPDF(selectedStudents, settings, options);
      setSuccessMessage(
        `Successfully generated and downloaded batch printable PDF for ${selectedStudents.length} student ID cards!`
      );
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err) {
      console.error('Failed to generate batch PDF:', err);
      alert('An error occurred while generating the ID cards PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger single student PDF download
  const handleGenerateSinglePDF = (student: Student) => {
    const options: IdCardOptions = {
      colorScheme,
      showBloodGroup,
      showEmergencyContact,
      showAddress,
      showQrCode,
      showSignature,
      academicSession,
      validTill,
    };
    downloadStudentIdCardPDF(student, settings, options);
  };

  // Direct print via browser (isolated document mode)
  const handleDirectPrint = () => {
    printIsolatedElement('a4-batch-id-cards-sheet', 'GBHS_Student_ID_Cards_Batch');
  };

  // Theme styling helpers
  const getThemeClasses = () => {
    switch (colorScheme) {
      case 'navy':
        return {
          headerBg: 'from-blue-950 via-blue-900 to-blue-800',
          borderColor: 'border-blue-800',
          badgeText: 'text-blue-200',
          accentBorder: 'border-amber-400',
          accentPill: 'bg-amber-400 text-slate-950',
          accentText: 'text-amber-300',
          footerBg: 'bg-blue-950',
        };
      case 'maroon':
        return {
          headerBg: 'from-rose-950 via-rose-900 to-rose-800',
          borderColor: 'border-rose-900',
          badgeText: 'text-rose-200',
          accentBorder: 'border-amber-400',
          accentPill: 'bg-amber-400 text-slate-950',
          accentText: 'text-amber-300',
          footerBg: 'bg-rose-950',
        };
      case 'slate':
        return {
          headerBg: 'from-slate-950 via-slate-900 to-slate-800',
          borderColor: 'border-slate-800',
          badgeText: 'text-slate-300',
          accentBorder: 'border-amber-400',
          accentPill: 'bg-amber-400 text-slate-950',
          accentText: 'text-amber-300',
          footerBg: 'bg-slate-950',
        };
      case 'emerald':
      default:
        return {
          headerBg: 'from-emerald-950 via-emerald-900 to-emerald-800',
          borderColor: 'border-emerald-800',
          badgeText: 'text-emerald-200',
          accentBorder: 'border-amber-400',
          accentPill: 'bg-amber-400 text-slate-950',
          accentText: 'text-amber-300',
          footerBg: 'bg-emerald-950',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 border-b border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-800/80 rounded-xl border border-emerald-600/60 shadow-inner">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Printable Student ID Card Auto-Generator
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    PDF Engine
                  </span>
                </h3>
                <p className="text-xs text-emerald-200">
                  Auto-generate official Sindh Education Department formatted student ID cards with QR verification, student photo, and Headmaster seal.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Badges / Summary */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-emerald-900/80 border border-emerald-700/80 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-emerald-300 block font-medium">Enrolled Students</span>
              <span className="text-sm font-extrabold text-white font-mono">
                {students.filter((s) => s.status === 'approved').length}
              </span>
            </div>
            <div className="bg-emerald-900/80 border border-emerald-700/80 px-3 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-emerald-300 block font-medium">Selected For Print</span>
              <span className="text-sm font-extrabold text-amber-300 font-mono">
                {selectedStudents.length}
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 hover:text-white font-bold transition text-xs border border-emerald-700/60"
              >
                Close ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 flex items-center justify-between gap-3 text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-xs">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-xs"
          >
            Dismiss ✕
          </button>
        </div>
      )}

      {/* Controls Bar: Filters, Search, and Action Buttons */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Class Filter */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent font-extrabold text-slate-800 focus:outline-none text-xs cursor-pointer"
              >
                <option value="all">All Classes ({students.length})</option>
                {availableClasses.map((cls) => {
                  const count = students.filter((s) => s.appliedClass === cls).length;
                  return (
                    <option key={cls} value={cls}>
                      {cls} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'approved' | 'all')}
                className="bg-transparent font-bold text-slate-800 focus:outline-none text-xs cursor-pointer"
              >
                <option value="approved">Approved with GR No only</option>
                <option value="all">All Students (incl. Pending)</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, father, GR #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-700 text-xs shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Card Options Drawer Toggle */}
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition shadow-xs ${
                showSettingsDrawer
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Customize Card Themes and Fields"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              <span>Card Styling</span>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-xl border border-slate-300">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3 h-3" /> List & Preview
              </button>
              <button
                onClick={() => setViewMode('sheet_preview')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition ${
                  viewMode === 'sheet_preview'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3 h-3 text-emerald-700" /> A4 Sheet Preview
              </button>
            </div>

            {/* Direct Print Button */}
            <button
              onClick={handleDirectPrint}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition"
              title="Open browser print dialog for current sheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Sheet</span>
            </button>

            {/* Batch PDF Auto-Generate Button */}
            <button
              onClick={handleGenerateBatchPDF}
              disabled={isGenerating || selectedStudents.length === 0}
              className={`px-4 py-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl flex items-center gap-2 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed ${
                isGenerating ? 'animate-pulse' : ''
              }`}
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>
                {isGenerating
                  ? 'Compiling PDF Sheet...'
                  : `Auto-Generate Batch PDF (${selectedStudents.length})`}
              </span>
            </button>
          </div>
        </div>

        {/* Customization Drawer (Collapsible) */}
        {showSettingsDrawer && (
          <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-xs mt-3 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                <Palette className="w-4 h-4 text-emerald-700" />
                ID Card Visual Theme & Field Customization
              </h4>
              <span className="text-[10px] text-slate-400">
                Changes apply instantly to both live preview and generated PDF
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Color Scheme Picker */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block text-[11px]">Card Theme Accent</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'emerald', label: 'Sindh Emerald', color: 'bg-emerald-800' },
                    { id: 'navy', label: 'Sapphire Navy', color: 'bg-blue-800' },
                    { id: 'maroon', label: 'Prestige Maroon', color: 'bg-rose-900' },
                    { id: 'slate', label: 'Obsidian Slate', color: 'bg-slate-800' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setColorScheme(thm.id as any)}
                      className={`px-2 py-1 rounded-lg border text-left font-bold text-[10px] flex items-center gap-1.5 transition ${
                        colorScheme === thm.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${thm.color} shrink-0`} />
                      <span className="truncate">{thm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Toggles */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block text-[11px]">Card Field Inclusions</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showBloodGroup}
                      onChange={(e) => setShowBloodGroup(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Blood Group Tag</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showEmergencyContact}
                      onChange={(e) => setShowEmergencyContact(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Emergency Mobile #</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showAddress}
                      onChange={(e) => setShowAddress(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Residential Address</span>
                  </label>
                </div>
              </div>

              {/* Official Stamp & QR Toggles */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block text-[11px]">Authority & Security</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showQrCode}
                      onChange={(e) => setShowQrCode(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>QR Verification Code</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showSignature}
                      onChange={(e) => setShowSignature(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-700"
                    />
                    <span>Headmaster Authority Seal</span>
                  </label>
                </div>
              </div>

              {/* Academic Session & Validity */}
              <div className="space-y-2">
                <div>
                  <label className="font-bold text-slate-700 block text-[11px]">Academic Session</label>
                  <input
                    type="text"
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    placeholder="e.g. 2026-2027"
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block text-[11px]">Card Validity Date</label>
                  <input
                    type="text"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    placeholder="e.g. 31st May 2027"
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      {viewMode === 'list' ? (
        /* View 1: Split Screen - Student Selection Table (Left) & Live ID Card Preview (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Panel: Filterable Student Selection Table (7 cols) */}
          <div className="lg:col-span-7 p-4 space-y-3">
            {/* Selection Controls Toolbar */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllFiltered}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                  Select All Filtered ({filteredStudents.length})
                </button>
                <button
                  onClick={handleDeselectAllFiltered}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] flex items-center gap-1 transition"
                >
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  Clear Selection
                </button>
              </div>

              <span className="text-[11px] font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {selectedStudents.length} of {filteredStudents.length} selected
              </span>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto max-h-[560px] overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] sticky top-0 z-10 shadow-xs">
                  <tr>
                    <th className="py-2.5 px-3 w-8">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="py-2.5 px-3">Student & Father</th>
                    <th className="py-2.5 px-3">GR Number</th>
                    <th className="py-2.5 px-3">Class & Section</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No students match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const isSelected = selectedStudentIds.includes(st.id);
                      const isHighlighted = previewStudent?.id === st.id;

                      return (
                        <tr
                          key={st.id}
                          className={`transition cursor-pointer ${
                            isHighlighted
                              ? 'bg-emerald-50/80 font-semibold'
                              : isSelected
                              ? 'bg-emerald-50/20 hover:bg-slate-50'
                              : 'hover:bg-slate-50'
                          }`}
                          onClick={() => setHighlightedStudentId(st.id)}
                        >
                          {/* Checkbox */}
                          <td
                            className="py-2.5 px-3 text-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStudent(st.id);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleStudent(st.id)}
                              className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                            />
                          </td>

                          {/* Student Info */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-9 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                <SafeMediaImage
                                  src={st.studentPictureUrl}
                                  alt={st.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-extrabold text-slate-900 truncate">
                                  {st.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  S/O {st.fatherName}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* GR Number */}
                          <td className="py-2.5 px-3 font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                st.grNumber
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {st.grNumber || 'Pending'}
                            </span>
                          </td>

                          {/* Class & Section */}
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-800">{st.appliedClass}</span>
                            <span className="text-slate-500 text-[10px] block">
                              Roll: {st.rollNo || '01'} (Sec: {st.section || 'A'})
                            </span>
                          </td>

                          {/* Row Actions */}
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHighlightedStudentId(st.id);
                                }}
                                className={`p-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                                  isHighlighted
                                    ? 'bg-emerald-800 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title="View in live preview"
                              >
                                <Eye className="w-3 h-3" />
                                <span className="hidden sm:inline">Preview</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenerateSinglePDF(st);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition flex items-center gap-1"
                                title="Download single student ID card PDF"
                              >
                                <Download className="w-3 h-3 text-emerald-700" />
                                <span className="hidden sm:inline">PDF</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Live Card Preview (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-slate-50/60 flex flex-col items-center justify-between space-y-4">
            <div className="w-full flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  Live ID Card Preview
                </span>
                <p className="text-[10px] text-slate-400">
                  Previewing: <strong className="text-slate-700">{previewStudent?.name}</strong>
                </p>
              </div>

              {previewStudent && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => printIsolatedElement('preview-single-id-card', `Student_ID_${previewStudent.grNumber || previewStudent.id}`)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                    title="Print single ID Card"
                  >
                    <Printer className="w-3 h-3 text-slate-600" />
                    <span>Print Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateSinglePDF(previewStudent)}
                    className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs transition"
                  >
                    <Download className="w-3 h-3 text-amber-300" />
                    <span>Download PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* The Rendered ID Card Box (Exact physical aspect ratio for plastic badge / card) */}
            {previewStudent ? (
              <div className="w-full flex justify-center py-2">
                <div
                  id="preview-single-id-card"
                  className={`w-[320px] bg-white rounded-2xl border-2 ${themeClasses.borderColor} shadow-xl overflow-hidden font-sans text-slate-900 printable-card`}
                >
                  {/* Card Header */}
                  <div
                    className={`bg-gradient-to-r ${themeClasses.headerBg} text-white p-3 text-center border-b-2 ${themeClasses.accentBorder} relative`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <SchoolLogo logoUrl={settings.logoUrl} size="sm" showBorder={false} />
                      <span className={`text-[8.5px] font-black uppercase tracking-widest ${themeClasses.badgeText}`}>
                        GOVERNMENT OF SINDH
                      </span>
                    </div>
                    <h5 className="font-black text-xs sm:text-sm tracking-tight leading-tight uppercase">
                      {settings.schoolName}
                    </h5>
                    <p className={`text-[9px] ${themeClasses.accentText} font-mono font-bold`}>
                      SEMIS CODE: {settings.semisCode} • TALUKA KALOI
                    </p>
                    <div
                      className={`mt-1 ${themeClasses.accentPill} text-[8.5px] font-extrabold uppercase py-0.5 px-2.5 rounded-full inline-block shadow-xs`}
                    >
                      STUDENT IDENTITY CARD
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 space-y-2.5">
                    {/* Photo & Badges */}
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-emerald-800 shadow-sm shrink-0 bg-slate-100 flex items-center justify-center">
                        {previewStudent.studentPictureUrl && previewStudent.studentPictureUrl.trim() !== '' ? (
                          <SafeMediaImage
                            src={previewStudent.studentPictureUrl}
                            alt={previewStudent.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-1 text-[8px] text-slate-400 font-bold leading-tight flex flex-col items-center justify-center h-full border border-dashed border-slate-300 w-full">
                            <span>AFFIX</span>
                            <span>PASSPORT</span>
                            <span>PHOTO</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded text-center">
                          <span className="text-[8.5px] uppercase font-bold block">G.R. Number</span>
                          <span className="text-xs font-mono font-extrabold">
                            {previewStudent.grNumber || 'PENDING ALLOTMENT'}
                          </span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-center">
                          <span className="text-[8.5px] font-bold">Class: </span>
                          <span className="text-xs font-extrabold">{previewStudent.appliedClass}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] px-1 font-bold text-slate-600">
                          <span>Sec: {previewStudent.section || 'A'}</span>
                          <span>Roll: {previewStudent.rollNo || '01'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Student Name Banner */}
                    <div className="text-center border-y border-slate-200 py-1.5 bg-slate-50/50 rounded-lg">
                      <h6 className="font-extrabold text-sm text-slate-950 tracking-tight">
                        {previewStudent.name.toUpperCase()}
                      </h6>
                      <p className="text-[10.5px] text-slate-600 font-medium">
                        S/O {previewStudent.fatherName.toUpperCase()}
                      </p>
                    </div>

                    {/* Student Field Details */}
                    <div className="space-y-1 text-[10.5px]">
                      <div className="flex justify-between py-0.5 border-b border-slate-100">
                        <span className="text-slate-500 font-semibold">B-Form / CNIC:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {previewStudent.cnicBForm}
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-100">
                        <span className="text-slate-500 font-semibold">Date of Birth:</span>
                        <span className="font-medium text-slate-800">{previewStudent.dob}</span>
                      </div>
                      {showBloodGroup && (
                        <div className="flex justify-between py-0.5 border-b border-slate-100">
                          <span className="text-slate-500 font-semibold">Blood Group:</span>
                          <span className="font-bold text-red-600">
                            {previewStudent.bloodGroup || 'B+'}
                          </span>
                        </div>
                      )}
                      {showEmergencyContact && (
                        <div className="flex justify-between py-0.5 border-b border-slate-100">
                          <span className="text-slate-500 font-semibold">Emergency Cell:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {previewStudent.fatherMobile}
                          </span>
                        </div>
                      )}
                      {showAddress && (
                        <div className="pt-0.5 text-[9.5px] text-slate-600 leading-tight">
                          <span className="text-slate-400 font-semibold">Address: </span>
                          {previewStudent.address.mohVillage}, {previewStudent.address.townCity}
                        </div>
                      )}
                      <div className="pt-0.5 text-[9.5px] text-slate-500">
                        <span className="font-bold text-slate-700">Valid Till: </span>
                        {validTill}
                      </div>
                    </div>

                    {/* Signatures & QR Code */}
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-3 items-end gap-1 text-[8.5px] text-slate-500">
                      <div className="text-center">
                        <div className="h-5 border-b border-dashed border-slate-400 w-14 mx-auto mb-0.5"></div>
                        <span>Student Sign</span>
                      </div>
                      <div className="flex justify-center items-center pb-0.5">
                        {showQrCode && (
                          <div className="w-8 h-8 text-slate-700">
                            <QrCode className="w-full h-full text-emerald-800" />
                          </div>
                        )}
                      </div>
                      {showSignature ? (
                        <HeadmasterSignatureDisplay
                          signatureUrl={settings.headmasterSignatureUrl}
                          headmasterName={settings.headmasterName}
                          label="Headmaster Seal"
                          subLabel="Authority Sign"
                          size="sm"
                        />
                      ) : (
                        <div className="text-center text-[8px] text-slate-400">Official Stamp</div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Stripe */}
                  <div className={`${themeClasses.footerBg} text-white text-[7.5px] py-1 text-center font-mono`}>
                    GBHS MEHRAND • IF FOUND RETURN TO SCHOOL OFFICE (TALUKA KALOI)
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Select a student to view the live ID card preview.
              </div>
            )}

            {/* Bottom quick tips */}
            <div className="text-center text-[10px] text-slate-400 max-w-xs">
              Cards are formatted according to Sindh School Education Department standards. Click "Auto-Generate Batch PDF" to download the print-ready A4 sheet.
            </div>
          </div>
        </div>
      ) : (
        /* View 2: Printable A4 Multi-Card Sheet Preview */
        <div className="p-6 bg-slate-100 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                A4 Multi-Card Printable Layout Preview
              </h4>
              <p className="text-xs text-slate-500">
                Showing {selectedStudents.length} selected cards formatted in standard 2x2 A4 sheet grid with scissor cutting guidelines.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDirectPrint}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Document</span>
              </button>
              <button
                onClick={handleGenerateBatchPDF}
                disabled={isGenerating || selectedStudents.length === 0}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Download Printable Batch PDF</span>
              </button>
            </div>
          </div>

          {/* Multi-Page A4 Containers */}
          {selectedStudents.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
              No students are currently selected for ID card generation.
            </div>
          ) : (
            <div id="a4-batch-id-cards-sheet" className="space-y-6">
              {Array.from({ length: Math.ceil(selectedStudents.length / 4) }).map((_, pageIdx) => {
                const pageStudents = selectedStudents.slice(pageIdx * 4, (pageIdx + 1) * 4);

                return (
                  <div
                    key={pageIdx}
                    className="max-w-[780px] mx-auto bg-white p-6 rounded-2xl border border-slate-300 shadow-lg space-y-4 printable-page"
                  >
                    {/* Sheet Header */}
                    <div className="border-b-2 border-emerald-800 pb-2 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                      <span className="font-extrabold text-emerald-950">
                        GOVERNMENT BOYS HIGH SCHOOL MEHRAND • OFFICIAL STUDENT ID CARDS SHEET
                      </span>
                      <span className="text-slate-400 font-bold">
                        Page {pageIdx + 1} of {Math.ceil(selectedStudents.length / 4)}
                      </span>
                    </div>

                    {/* 2x2 Grid of ID Cards on this A4 Page */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                      {pageStudents.map((st) => (
                        <div
                          key={st.id}
                          className="relative p-2 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50"
                        >
                          <span className="absolute -top-2 left-4 bg-white px-1 text-[9px] text-slate-400 font-mono">
                            ✂ Cut line
                          </span>

                          {/* ID Card Instance */}
                          <div
                            className={`w-full bg-white rounded-xl border ${themeClasses.borderColor} shadow-xs overflow-hidden`}
                          >
                            {/* Card Header */}
                            <div
                              className={`bg-gradient-to-r ${themeClasses.headerBg} text-white p-2 text-center border-b ${themeClasses.accentBorder}`}
                            >
                              <h6 className="font-black text-[10px] tracking-tight uppercase">
                                {settings.schoolName}
                              </h6>
                              <p className={`text-[8px] ${themeClasses.accentText} font-mono font-bold`}>
                                SEMIS: {settings.semisCode} • TALUKA KALOI
                              </p>
                              <div
                                className={`mt-0.5 ${themeClasses.accentPill} text-[7.5px] font-extrabold uppercase py-0.2 px-2 rounded-full inline-block`}
                              >
                                STUDENT IDENTITY CARD
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-2.5 space-y-2 text-[9.5px]">
                              <div className="flex items-center gap-2">
                                <div className="w-14 h-16 rounded bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                                  {st.studentPictureUrl && st.studentPictureUrl.trim() !== '' ? (
                                    <SafeMediaImage
                                      src={st.studentPictureUrl}
                                      alt={st.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="text-center p-0.5 text-[6.5px] text-slate-400 font-bold leading-tight flex flex-col items-center justify-center h-full border border-dashed border-slate-300 w-full">
                                      <span>AFFIX</span>
                                      <span>PHOTO</span>
                                    </div>
                                  )}
                                </div>
                              <div className="space-y-0.5 flex-1 min-w-0">
                                <div className="bg-red-50 border border-red-200 text-red-700 px-1 py-0.5 rounded text-center">
                                  <span className="text-[7.5px] uppercase font-bold block">G.R. Number</span>
                                  <span className="text-[10px] font-mono font-extrabold">
                                    {st.grNumber || 'PENDING'}
                                  </span>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-1 py-0.2 rounded text-center font-bold text-[9px]">
                                  {st.appliedClass} (Sec: {st.section || 'A'})
                                </div>
                              </div>
                            </div>

                            <div className="text-center border-y border-slate-200 py-1">
                              <div className="font-extrabold text-xs text-slate-900">
                                {st.name.toUpperCase()}
                              </div>
                              <div className="text-[9px] text-slate-500">S/O {st.fatherName}</div>
                            </div>

                            <div className="space-y-0.5 text-[8.5px]">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Roll No:</span>
                                <span className="font-bold">{st.rollNo || '01'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">B-Form:</span>
                                <span className="font-mono font-bold">{st.cnicBForm}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">D.O.B:</span>
                                <span>{st.dob}</span>
                              </div>
                              {showBloodGroup && (
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Blood Gp:</span>
                                  <span className="font-bold text-red-600">{st.bloodGroup || 'B+'}</span>
                                </div>
                              )}
                            </div>

                            <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[7.5px] text-slate-400">
                              <span>Student Sign</span>
                              <span className="font-bold text-emerald-800">HM Official Seal</span>
                            </div>
                          </div>

                          <div className={`${themeClasses.footerBg} text-white text-[6.5px] py-0.5 text-center font-mono`}>
                            GBHS MEHRAND • SINDH EDUCATION DEPT
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sheet Footer */}
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span>Generated by GBHS Mehrand Automated Management Portal</span>
                    <span>Ready for printing on standard A4 cardstock paper</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}
  </div>
);
};
