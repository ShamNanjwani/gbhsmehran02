import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { X, Save, Users, BookOpen, Award, Phone, Mail, FileBadge } from 'lucide-react';
import { FileUploadZone } from '../common/FileUploadZone';

interface EditTeacherModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onSave: (teacherId: string, updatedData: Partial<Teacher>) => void;
}

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    pid: '',
    cnic: '',
    email: '',
    mobileNo: '',
    qualification: '',
    subjectSpecialist: '',
    designation: 'JEST',
    status: 'approved' as 'approved' | 'pending' | 'rejected',
    pictureUrl: '',
    isAvailableToday: true,
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        fatherName: teacher.fatherName || '',
        pid: teacher.pid || '',
        cnic: teacher.cnic || '',
        email: teacher.email || '',
        mobileNo: teacher.mobileNo || '',
        qualification: teacher.qualification || '',
        subjectSpecialist: teacher.subjectSpecialist || '',
        designation: teacher.designation || 'JEST',
        status: teacher.status || 'approved',
        pictureUrl: teacher.pictureUrl || '',
        isAvailableToday: teacher.isAvailableToday !== false,
      });
    }
  }, [teacher]);

  if (!isOpen || !teacher) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(teacher.id, {
      name: formData.name,
      fatherName: formData.fatherName,
      pid: formData.pid,
      cnic: formData.cnic,
      email: formData.email,
      mobileNo: formData.mobileNo,
      qualification: formData.qualification,
      subjectSpecialist: formData.subjectSpecialist,
      designation: formData.designation,
      status: formData.status,
      pictureUrl: formData.pictureUrl,
      isAvailableToday: formData.isAvailableToday,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Edit Teacher Record & Faculty Profile
              </h3>
              <p className="text-slate-500 text-[11px]">
                Updating official government teaching record for <strong className="text-slate-800">{teacher.name}</strong>
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
              <label className="block font-bold text-slate-700 mb-1">Teacher Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Father's Name *</label>
              <input
                type="text"
                required
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Row 2: Designation & Subject Specialist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation / Cadre</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Headmaster, Senior Science Teacher, JEST, PST"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject Specialist *</label>
              <input
                type="text"
                required
                value={formData.subjectSpecialist}
                onChange={(e) => setFormData({ ...formData, subjectSpecialist: e.target.value })}
                placeholder="e.g. English, Mathematics, Sindhi, Computer Science"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-bold text-emerald-800"
              />
            </div>
          </div>

          {/* Row 3: PID & CNIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Personal Identification (PID Number) *
              </label>
              <input
                type="text"
                required
                value={formData.pid}
                onChange={(e) => setFormData({ ...formData, pid: e.target.value })}
                placeholder="e.g. 10849201"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NADRA CNIC Number</label>
              <input
                type="text"
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                placeholder="44301-XXXXXXX-X"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-mono"
              />
            </div>
          </div>

          {/* Row 4: Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cell / WhatsApp Number</label>
              <input
                type="text"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                placeholder="0346-XXXXXXX"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-mono"
              />
            </div>
          </div>

          {/* Row 5: Qualification & Approval Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Educational Qualifications</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. M.Sc (Physics), B.Ed (Sindh University)"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Account & Faculty Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'approved' | 'pending' | 'rejected' })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 font-bold bg-white"
              >
                <option value="approved">Approved & Active on Faculty Page</option>
                <option value="pending">Pending Admin Review</option>
                <option value="rejected">Rejected / Revoked</option>
              </select>
            </div>
          </div>

          {/* Teacher Picture Upload */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <FileUploadZone
              id="admin-edit-teacher-photo"
              label="Teacher Profile Photograph"
              value={formData.pictureUrl}
              onChange={(val) => setFormData({ ...formData, pictureUrl: val })}
              previewShape="avatar"
              helperText="Upload official faculty photograph in PDF or Image format"
              badgeText="Displayed on Public Faculty Page & Portal"
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
              className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-black shadow transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Faculty Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
