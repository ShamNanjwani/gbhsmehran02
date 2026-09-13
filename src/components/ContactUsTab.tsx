import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  School,
  Sparkles,
} from 'lucide-react';

export const ContactUsTab: React.FC = () => {
  const { settings, submitInquiry } = useSchool();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Admission Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert('Please fill out your name, contact phone, and message.');
      return;
    }

    submitInquiry({
      name,
      email: email || 'visitor@example.com',
      phone,
      subject,
      message,
    });

    setIsSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 6000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Government Boys High School Mehrand
        </h1>
        <p className="text-sm text-slate-600">
          Have queries regarding admission, student certificates, or official correspondence? Reach out to the school administration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-extrabold text-slate-900 text-sm">School Campus Address</h4>
                <p className="text-slate-700 mt-1 font-medium leading-relaxed">
                  {settings.address || 'Village Mehrand, Post Office Kaloi, Taluka Kaloi, District Tharparkar @ Mithi, Sindh, Pakistan'}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                  <span>SEMIS Code:</span>
                  <span className="font-mono">{settings.semisCode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Official Helpline & Mobile</h4>
                {settings.officialHelpline && (
                  <p className="text-slate-700 font-mono flex items-center gap-1">
                    <span className="font-bold text-slate-500">Helpline:</span>
                    <a href={`tel:${settings.officialHelpline}`} className="hover:text-emerald-700 font-semibold underline">
                      {settings.officialHelpline}
                    </a>
                  </p>
                )}
                <p className="text-slate-700 font-mono flex items-center gap-1">
                  <span className="font-bold text-slate-500">Mobile / Office:</span>
                  <a href={`tel:${settings.officialMobile || settings.phone}`} className="hover:text-emerald-700 font-semibold underline">
                    {settings.officialMobile || settings.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Official Email</h4>
                <p className="text-slate-700 font-mono">
                  <a href={`mailto:${settings.email}`} className="hover:text-blue-700 font-semibold underline">
                    {settings.email}
                  </a>
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  headmaster.mehrand@sindheducation.gov.pk
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-extrabold text-slate-900 text-sm">Official School Timings</h4>
                <p className="text-slate-700 mt-1 font-medium">
                  {settings.schoolTiming || '08:00 AM - 01:30 PM (Mon - Sat, Friday: 08:00 AM - 12:00 PM)'}
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">Sunday & Official Public Holidays Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form & Visual Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                Send an Online Message to the Headmaster Office
              </h3>
              <p className="text-xs text-slate-500">
                Your message will be delivered straight to the Admin Control Panel.
              </p>
            </div>

            {isSubmitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <strong>Inquiry Submitted Successfully!</strong>
                  <p className="text-emerald-800">The school administration has received your message and will respond shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92-3XX-XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="visitor@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Admission Inquiry">Admission Inquiry</option>
                    <option value="Leaving Certificate Request">Leaving Certificate Request</option>
                    <option value="Duplicate ID Card">Duplicate ID Card</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message or inquiry here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                Send Inquiry to Admin
              </button>
            </form>
          </div>

          {/* Regional Location Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-700" />
                School Location & Geo-Coordinates (Tharparkar)
              </h4>
              <span className="text-[11px] font-mono text-slate-500">Taluka Kaloi, Sindh</span>
            </div>

            <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-xl border border-slate-300 relative overflow-hidden flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-amber-400 flex items-center justify-center shadow-lg mb-2">
                <MapPin className="w-6 h-6 animate-pulse" />
              </div>
              <h5 className="font-black text-slate-900 text-sm">
                GOVERNMENT BOYS HIGH SCHOOL MEHRAND
              </h5>
              <p className="text-xs text-slate-600 max-w-sm mt-1">
                SEMIS: 406020752 • Village Mehrand, Deh Mehrand, Taluka Kaloi, District Tharparkar @ Mithi
              </p>
              <span className="text-[10px] text-emerald-800 font-mono mt-2 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                Coordinates: 24.8471° N, 69.3142° E
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
