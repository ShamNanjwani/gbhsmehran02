import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { X, Save, User, GraduationCap, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { FileUploadZone } from '../common/FileUploadZone';

interface EditStudentModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onSave: (studentId: string, updatedData: Partial<Student>) => void;
}

const CLASS_OPTIONS = [
  'Class ECCE',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    appliedClass: 'Class 9',
    section: 'A',
    rollNo: '01',
    grNumber: '',
    status: 'approved' as 'approved' | 'pending' | 'rejected',
    cnicBForm: '',
    mobileNo: '',
    email: '',
    mohVillage: '',
    townCity: '',
    emergencyContact: '',
    studentPictureUrl: '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        fatherName: student.fatherName || '',
        appliedClass: student.appliedClass || 'Class 9',
        section: student.section || 'A',
        rollNo: student.rollNo || '01',
        grNumber: student.grNumber || '',
        status: student.status || 'approved',
        cnicBForm: student.cnicBForm || '',
        mobileNo: student.mobileNo || '',
        email: student.email || '',
        mohVillage: student.address?.mohVillage || '',
        townCity: student.address?.townCity || '',
        emergencyContact: student.emergencyContact || '',
        studentPictureUrl: student.studentPictureUrl || '',
      });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(student.id, {
      name: formData.name,
      fatherName: formData.fatherName,
      appliedClass: formData.appliedClass,
      section: formData.section,
      rollNo: formData.rollNo,
      grNumber: formData.grNumber,
      status: formData.status,
      cnicBForm: formData.cnicBForm,
      mobileNo: formData.mobileNo,
      email: formData.email,
      emergencyContact: formData.emergencyContact,
      studentPictureUrl: formData.studentPictureUrl,
      address: {
        ...student.address,
        mohVillage: formData.mohVillage,
        townCity: formData.townCity,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Edit Student Particulars & Record
              </h3>
              <p className="text-slate-500 text-[11px]">
                Modifying official record for <strong className="text-slate-800">{student.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name & Father Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Father's Name *</label>
              <input
                type="text"
                required
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 2: Class, Section, Roll No */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Enrolled / Applied Class *</label>
              <select
                value={formData.appliedClass}
                onChange={(e) => setFormData({ ...formData, appliedClass: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-semibold bg-white"
              >
                {CLASS_OPTIONS.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g. A"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="e.g. 01"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Row 3: GR Number & Admission Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Official General Register (GR) Number
              </label>
              <input
                type="text"
                value={formData.grNumber}
                onChange={(e) => setFormData({ ...formData, grNumber: e.target.value })}
                placeholder="e.g. GR-406020752-0081"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admission Record Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'approved' | 'pending' | 'rejected' })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-bold bg-white"
              >
                <option value="approved">Approved & Enrolled</option>
                <option value="pending">Pending Admin Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Row 4: B-Form, Mobile, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">NADRA B-Form / CNIC</label>
              <input
                type="text"
                value={formData.cnicBForm}
                onChange={(e) => setFormData({ ...formData, cnicBForm: e.target.value })}
                placeholder="44301-XXXXXXX-X"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp</label>
              <input
                type="text"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                placeholder="0346-XXXXXXX"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Portal Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Row 5: Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Village / Mohallah</label>
              <input
                type="text"
                value={formData.mohVillage}
                onChange={(e) => setFormData({ ...formData, mohVillage: e.target.value })}
                placeholder="Village Mehrand"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Town / City / District</label>
              <input
                type="text"
                value={formData.townCity}
                onChange={(e) => setFormData({ ...formData, townCity: e.target.value })}
                placeholder="Taluka Kaloi, Tharparkar"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Row 6: Student Picture Upload */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <FileUploadZone
              id="admin-edit-student-photo"
              label="Student Passport Size Photograph"
              value={formData.studentPictureUrl}
              onChange={(val) => setFormData({ ...formData, studentPictureUrl: val })}
              previewShape="avatar"
              helperText="Upload updated student portrait in PDF or Image format"
              badgeText="Used on ID Card & Enrollment Card"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Student Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
