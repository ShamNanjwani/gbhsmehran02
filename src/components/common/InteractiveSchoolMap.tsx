import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Compass,
  Building,
  Laptop,
  FlaskConical,
  BookOpen,
  Users,
  ShieldCheck,
  Sun,
  Droplets,
  Trophy,
  Info,
  Navigation,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  FileText,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export interface CampusZone {
  id: string;
  name: string;
  code: string;
  category: 'classroom' | 'staff_admin' | 'lab' | 'library' | 'amenity' | 'sports';
  block: 'Block A (Secondary)' | 'Block B (Middle)' | 'Block C (Primary)' | 'Admin Wing' | 'Science & IT Wing' | 'Outdoor & Grounds';
  coordinates: { x: number; y: number; width: number; height: number };
  color: string;
  incharge: {
    name: string;
    designation: string;
    role: string;
  };
  capacity: string;
  timing: string;
  purpose: string;
  facilities: string[];
  directionsFromGate: string;
  visitorRules: string;
  iconType: 'admin' | 'staff' | 'computer' | 'science' | 'book' | 'class' | 'solar' | 'water' | 'sports' | 'gate';
}

export const CAMPUS_ZONES: CampusZone[] = [
  // Admin & Staff Block
  {
    id: 'zone-headmaster',
    name: 'Headmaster Executive Office',
    code: 'ADM-01',
    category: 'staff_admin',
    block: 'Admin Wing',
    coordinates: { x: 380, y: 110, width: 140, height: 90 },
    color: '#064e3b',
    incharge: {
      name: 'Master Tanu Mal',
      designation: 'Headmaster (BPS-17)',
      role: 'Institutional Head & Executive Officer',
    },
    capacity: '15 Visitors / Conference',
    timing: '08:00 AM - 01:30 PM (Visitor hours: 10:00 AM - 12:00 PM)',
    purpose: 'Official administrative center, disciplinary council, official dispatch, and parent consultation.',
    facilities: ['Executive Desk', 'Official Seal & Dispatch Register', 'Sindh Govt Circular Archive', 'Visitor Lounge'],
    directionsFromGate: 'From Main Gate, walk straight through the shaded portico into the Admin Wing on your right. Headmaster Office is at Room 1.',
    visitorRules: 'Parents and dignitaries must obtain a visitor slip from the Main Gate prior to entry.',
    iconType: 'admin',
  },
  {
    id: 'zone-staff-room',
    name: 'Faculty Staff Room & Biometric Center',
    code: 'ADM-02',
    category: 'staff_admin',
    block: 'Admin Wing',
    coordinates: { x: 530, y: 110, width: 150, height: 90 },
    color: '#047857',
    incharge: {
      name: 'Ghanshamdas JEST / Staff Secretary',
      designation: 'JEST (BPS-14)',
      role: 'Staff Academic Council Coordinator',
    },
    capacity: '20 Teaching Staff',
    timing: '07:30 AM - 02:00 PM',
    purpose: 'Faculty workstations, lesson planning, academic timetable coordination, and SE&LD biometric thumb scanning station.',
    facilities: ['SE&LD ETS Biometric Thumb Scanner Machine', 'Faculty Work Desks & Lockers', 'Lesson Plan Archive', 'Teacher Noticeboard'],
    directionsFromGate: 'Located adjacent to Headmaster Office in the Admin Wing. Enter through the main glass door.',
    visitorRules: 'Students permitted with permission slip during recess only. Visitors strictly by appointment.',
    iconType: 'staff',
  },
  {
    id: 'zone-exam-cell',
    name: 'Admission & Examination Branch',
    code: 'ADM-03',
    category: 'staff_admin',
    block: 'Admin Wing',
    coordinates: { x: 690, y: 110, width: 130, height: 90 },
    color: '#0d9488',
    incharge: {
      name: 'Hajan Khan Nohri',
      designation: 'Junior Clerk / Admission Incharge',
      role: 'Enrollment & G.R. Register Custodian',
    },
    capacity: '10 Persons',
    timing: '08:00 AM - 01:00 PM',
    purpose: 'Issuance of G.R. Numbers, student enrollment verification, School Leaving Certificates (SLC), and board examination forms.',
    facilities: ['General Register (G.R.) Archives', 'ID Card Issuance Terminal', 'Board Form Verification Counter', 'Document Scanner'],
    directionsFromGate: 'Follow the covered walkway past the Headmaster Office. Last room on the right in the Admin corridor.',
    visitorRules: 'Bring original B-Form and Father CNIC for admission inquiries.',
    iconType: 'admin',
  },

  // Science & IT Laboratories
  {
    id: 'zone-it-lab',
    name: 'Digital IT & Computer Laboratory',
    code: 'LAB-01',
    category: 'lab',
    block: 'Science & IT Wing',
    coordinates: { x: 100, y: 110, width: 140, height: 110 },
    color: '#0284c7',
    incharge: {
      name: 'Ghanshamdas JEST',
      designation: 'JEST Computer Science Specialist',
      role: 'IT Coordinator & Lab Administrator',
    },
    capacity: '32 Students (Dual Workstations)',
    timing: '08:00 AM - 01:30 PM (Scheduled Periods & Practical Sessions)',
    purpose: 'Computer programming, digital literacy, internet research, office automation, and matriculation IT practicals.',
    facilities: ['16 Core Computer Stations', '24/7 Solar Power Inverter', 'Multimedia Projector', 'High-Speed Broadband Internet', 'Programming IDEs'],
    directionsFromGate: 'Turn left at the Main Courtyard and enter the Science & IT Wing. Computer Lab is the first large glass-door room on the left.',
    visitorRules: 'Shoes must be placed in outer rack. No liquids or flash drives without scanning.',
    iconType: 'computer',
  },
  {
    id: 'zone-physics-lab',
    name: 'Science & Physics Laboratory',
    code: 'LAB-02',
    category: 'lab',
    block: 'Science & IT Wing',
    coordinates: { x: 250, y: 110, width: 120, height: 110 },
    color: '#6366f1',
    incharge: {
      name: 'Muhammad Ali Rahimoon',
      designation: 'HST (Physics & Science)',
      role: 'Senior Science Faculty',
    },
    capacity: '35 Students',
    timing: '08:45 AM - 01:00 PM (Practical schedule)',
    purpose: 'Hands-on experiments for Mechanics, Optics, Sound, Electromagnetism, and BISE Mirpurkhas board exam preparation.',
    facilities: ['Optical Benches & Prism Sets', 'Vernier Calipers & Micrometer Screws', 'Resistance & Galvano Kits', 'Demonstration Benches'],
    directionsFromGate: 'Located in the Science Wing right next to the Computer Lab. Enter through corridor doors.',
    visitorRules: 'Wear safety lab coat during experiments. Strict handling rules apply.',
    iconType: 'science',
  },
  {
    id: 'zone-chem-bio-lab',
    name: 'Chemistry & Biology Laboratory',
    code: 'LAB-03',
    category: 'lab',
    block: 'Science & IT Wing',
    coordinates: { x: 100, y: 230, width: 140, height: 100 },
    color: '#8b5cf6',
    incharge: {
      name: 'Abdul Kareem Sand',
      designation: 'JEST (General Science)',
      role: 'Chemical & Biology Lab Custodian',
    },
    capacity: '30 Students',
    timing: '09:00 AM - 01:00 PM',
    purpose: 'Chemical titration experiments, botanical and zoological specimen studies, microscope glass slide observations.',
    facilities: ['Digital Compound Microscopes', 'Chemical Reagents Fume Cabinet', 'Human Skeleton & Anatomy Models', 'Emergency Eye Wash Basin'],
    directionsFromGate: 'Walk into Science Wing; turn left past the physics lab. First door on inner lane.',
    visitorRules: 'Strictly prohibited to touch chemicals without faculty supervision.',
    iconType: 'science',
  },

  // Academic Classrooms - Secondary Block A
  {
    id: 'zone-room-10',
    name: 'Class 10th (Matric Science & General)',
    code: 'CLS-10',
    category: 'classroom',
    block: 'Block A (Secondary)',
    coordinates: { x: 100, y: 390, width: 130, height: 95 },
    color: '#0f766e',
    incharge: {
      name: 'Muhammad Ali Rahimoon / Ghanshamdas',
      designation: 'HST / JEST',
      role: 'Class Teacher & Matric Incharge',
    },
    capacity: '50 Students',
    timing: '08:00 AM - 01:30 PM',
    purpose: 'Senior Matriculation class preparing for BISE Mirpurkhas board exams in Science & Arts groups.',
    facilities: ['Dual Wooden Desks', 'Green Chalkboard & Whiteboard', 'Ceiling Fans & Solar Power Backup', 'Board Exam Past Papers Corner'],
    directionsFromGate: 'Enter central courtyard, proceed straight along the west wing. Room 10 is marked with a bold emerald plaque.',
    visitorRules: 'Quiet study zone during board preparation hours.',
    iconType: 'class',
  },
  {
    id: 'zone-room-09',
    name: 'Class 9th (SSC-I Science & General)',
    code: 'CLS-09',
    category: 'classroom',
    block: 'Block A (Secondary)',
    coordinates: { x: 240, y: 390, width: 130, height: 95 },
    color: '#0f766e',
    incharge: {
      name: 'Ghanshamdas JEST',
      designation: 'JEST Computer Science',
      role: 'Class Teacher 9th',
    },
    capacity: '50 Students',
    timing: '08:00 AM - 01:30 PM',
    purpose: 'Secondary class foundation in Mathematics, Physics, Chemistry, Computer Science, and Languages.',
    facilities: ['Spacious Student Benches', 'Subject Display Charts', 'Class Library Corner', 'Solar Powered Lighting'],
    directionsFromGate: 'Beside Room 10 along the west courtyard covered corridor.',
    visitorRules: 'Adhere to class timetable during visits.',
    iconType: 'class',
  },

  // Academic Classrooms - Middle Block B
  {
    id: 'zone-room-08',
    name: 'Class 8th (Middle Section)',
    code: 'CLS-08',
    category: 'classroom',
    block: 'Block B (Middle)',
    coordinates: { x: 380, y: 390, width: 120, height: 95 },
    color: '#0369a1',
    incharge: {
      name: 'Abdul Kareem Sand',
      designation: 'JEST',
      role: 'Class Teacher 8th',
    },
    capacity: '60 Students',
    timing: '08:00 AM - 01:30 PM',
    purpose: 'Middle school academic training preparing students for secondary board syllabus.',
    facilities: ['Standard Wooden Benches', 'Chalkboard', 'Cross Ventilation Windows', 'Sindhi/English Readers Shelf'],
    directionsFromGate: 'Middle wing of Academic Block, directly facing the assembly ground.',
    visitorRules: 'Classroom open during school hours.',
    iconType: 'class',
  },
  {
    id: 'zone-room-07',
    name: 'Class 7th (Middle Section)',
    code: 'CLS-07',
    category: 'classroom',
    block: 'Block B (Middle)',
    coordinates: { x: 510, y: 390, width: 120, height: 95 },
    color: '#0369a1',
    incharge: {
      name: 'Nabi Bux Lund',
      designation: 'Drawing / Senior Faculty',
      role: 'Class Teacher 7th',
    },
    capacity: '60 Students',
    timing: '08:00 AM - 01:30 PM',
    purpose: 'Upper middle grade curriculum, social studies, mathematics, and science experimentation.',
    facilities: ['Ventilated Class Hall', 'Art & Craft Project Wall', 'Solar Powered Fans'],
    directionsFromGate: 'Proceed to center corridor facing the flagpole.',
    visitorRules: 'Parent-teacher conferences scheduled on Saturdays.',
    iconType: 'class',
  },
  {
    id: 'zone-room-06',
    name: 'Class 6th (Middle Section)',
    code: 'CLS-06',
    category: 'classroom',
    block: 'Block B (Middle)',
    coordinates: { x: 640, y: 390, width: 120, height: 95 },
    color: '#0369a1',
    incharge: {
      name: 'Dileep Kumar Bheel',
      designation: 'PTI / Teacher',
      role: 'Class Teacher 6th',
    },
    capacity: '60 Students',
    timing: '08:00 AM - 01:30 PM',
    purpose: 'Transition year from primary to middle high school; focus on English, Science, and Mathematics.',
    facilities: ['Student Desks', 'Attendance Board', 'Spacious Seating'],
    directionsFromGate: 'Beside Room 07 in the middle block.',
    visitorRules: 'Visitors welcome during morning break.',
    iconType: 'class',
  },

  // Primary Wing - Block C
  {
    id: 'zone-primary-wing',
    name: 'Primary Wing & Early Learning Section',
    code: 'CLS-PRI',
    category: 'classroom',
    block: 'Block C (Primary)',
    coordinates: { x: 770, y: 390, width: 130, height: 95 },
    color: '#b45309',
    incharge: {
      name: 'Kewal Ram Suthar',
      designation: 'PST (BPS-14)',
      role: 'Primary Section Coordinator',
    },
    capacity: '140 Students (Classes 1 - 5)',
    timing: '08:00 AM - 12:30 PM',
    purpose: 'Early childhood and primary schooling: Sindhi, Urdu, basic numeracy, moral values, and cleanliness habits.',
    facilities: ['Story Book Corner', 'Alphabetic Visual Charts', 'Clean Mats & Benches', 'Activity Play Kits'],
    directionsFromGate: 'Located in the eastern wing, right adjacent to the primary entrance veranda.',
    visitorRules: 'Parents may accompany younger students up to veranda.',
    iconType: 'class',
  },

  // Library & Reading Resource Center
  {
    id: 'zone-library',
    name: 'Central Reading Library & Archive',
    code: 'LIB-01',
    category: 'library',
    block: 'Science & IT Wing',
    coordinates: { x: 250, y: 230, width: 120, height: 100 },
    color: '#b45309',
    incharge: {
      name: 'Ramesh Kumar Meghwar',
      designation: 'HST English',
      role: 'Library Custodian & Literary Society Patron',
    },
    capacity: '40 Readers',
    timing: '08:30 AM - 01:30 PM',
    purpose: 'Knowledge discovery, Sindhi literature, encyclopedias, Islamic history, science journals, and daily newspapers.',
    facilities: ['Over 3,000 Reference Books', 'Reading Tables with Solar Lamps', 'Sindh Textbook Board Archives', 'Quiet Study Zone'],
    directionsFromGate: 'Located between Physics Lab and Admin block in the shaded courtyard wing.',
    visitorRules: 'Maintain absolute silence. Books issued with school ID card.',
    iconType: 'book',
  },

  // Amenities & Campus Infrastructure
  {
    id: 'zone-solar-farm',
    name: '10kVA Solar Generation Station',
    code: 'INF-01',
    category: 'amenity',
    block: 'Outdoor & Grounds',
    coordinates: { x: 770, y: 230, width: 130, height: 75 },
    color: '#ca8a04',
    incharge: {
      name: 'Meva Ram Kolhi / Ghanshamdas',
      designation: 'Support Staff / Solar Incharge',
      role: 'Power Grid Supervisor',
    },
    capacity: 'High-voltage Power Distribution',
    timing: '24/7 Automatic Operation',
    purpose: 'Powers all computer labs, classrooms, staff room biometric systems, and RO water pump reliably without grid load shedding.',
    facilities: ['Monocrystalline Solar Arrays', 'Hybrid Inverters & Lithium Battery Bank', 'Surge Protectors & Lightning Arrestor'],
    directionsFromGate: 'Located in the fenced technical zone behind the Admin block.',
    visitorRules: 'Restricted area! Authorized personnel only.',
    iconType: 'solar',
  },
  {
    id: 'zone-water-ro',
    name: 'RO Clean Water Filtration Plant',
    code: 'INF-02',
    category: 'amenity',
    block: 'Outdoor & Grounds',
    coordinates: { x: 770, y: 315, width: 130, height: 65 },
    color: '#0284c7',
    incharge: {
      name: 'Meva Ram Kolhi',
      designation: 'Sanitation Incharge',
      role: 'Water Quality Monitor',
    },
    capacity: '1,000 Liters / Hour',
    timing: '07:30 AM - 02:00 PM',
    purpose: 'Provides safe, arsenic-free sweet drinking water for all students and faculty in the desert climate of Mehrand.',
    facilities: ['Multi-Stage Reverse Osmosis Filter', 'Chilled Water Dispensers', 'Stainless Steel Taps', 'TDS & Quality Testing Kit'],
    directionsFromGate: 'Situated in the central courtyard under shaded pavilion, accessible from all classroom wings.',
    visitorRules: 'Keep taps tightly closed after drinking. Use personal clean bottles.',
    iconType: 'water',
  },
  {
    id: 'zone-sports-ground',
    name: 'Main Sports Arena & Cricket Ground',
    code: 'SPT-01',
    category: 'sports',
    block: 'Outdoor & Grounds',
    coordinates: { x: 100, y: 500, width: 380, height: 95 },
    color: '#15803d',
    incharge: {
      name: 'Dileep Kumar Bheel',
      designation: 'PTI (Physical Training Instructor)',
      role: 'Sports & Athletics Director',
    },
    capacity: 'Entire School (450+ Students)',
    timing: 'Recess & After School (12:00 PM - 02:30 PM)',
    purpose: 'Cricket matches, volleyball tournament, athletics races, football, and annual district inter-school sports championships.',
    facilities: ['Leveled Cricket Pitch & Net', 'Volleyball Court', 'Long Jump Sandpit', 'Sports Equipment Locker'],
    directionsFromGate: 'South section of campus, directly ahead as you pass the classroom wings.',
    visitorRules: 'Visitors welcome as spectators during scheduled sports events.',
    iconType: 'sports',
  },
  {
    id: 'zone-assembly-flag',
    name: 'Assembly Courtyard & National Flagpole',
    code: 'SPT-02',
    category: 'sports',
    block: 'Outdoor & Grounds',
    coordinates: { x: 490, y: 500, width: 410, height: 95 },
    color: '#047857',
    incharge: {
      name: 'Master Tanu Mal / All Faculty',
      designation: 'Headmaster & Staff',
      role: 'Morning Assembly Conductors',
    },
    capacity: '500+ Students & Staff',
    timing: '08:00 AM - 08:30 AM Daily',
    purpose: 'Morning assembly, Holy Quran recitation, Hamd & Naat, National Anthem, ethical speeches, and daily uniform inspection.',
    facilities: ['30-Foot National Flagpole', 'Public Address (PA) Audio System', 'Shaded Tree Perimeter', 'Paved Assembly Lines'],
    directionsFromGate: 'Central heart of the campus. Enter through the main gate into the open assembly courtyard.',
    visitorRules: 'Strict silence and respect during National Anthem at 08:05 AM.',
    iconType: 'sports',
  },
  {
    id: 'zone-main-gate',
    name: 'Main Entrance & Security Reception',
    code: 'SEC-01',
    category: 'amenity',
    block: 'Outdoor & Grounds',
    coordinates: { x: 430, y: 20, width: 140, height: 75 },
    color: '#064e3b',
    incharge: {
      name: 'Qadir Bux Bajir',
      designation: 'Chowkidar / Security Incharge',
      role: 'Campus Gatekeeper',
    },
    capacity: 'Visitor Inflow & Security Check',
    timing: '07:00 AM - 02:30 PM',
    purpose: 'First point of contact for new students, parents, and official education department visitors. Entry register and ID check.',
    facilities: ['Visitor Entry Register Desk', 'Information Bulletin Board', 'Campus Directory Map Board', 'Security Waiting Booth'],
    directionsFromGate: 'Start here! Main entrance on Mehrand-Kaloi Link Road.',
    visitorRules: 'All visitors must present CNIC and register in the Visitor Log Book.',
    iconType: 'gate',
  },
];

interface InteractiveSchoolMapProps {
  initialZoneId?: string;
  isCompact?: boolean;
  onSelectZone?: (zone: CampusZone) => void;
}

export const InteractiveSchoolMap: React.FC<InteractiveSchoolMapProps> = ({
  initialZoneId,
  isCompact = false,
  onSelectZone,
}) => {
  const { settings } = useSchool();
  const [selectedZone, setSelectedZone] = useState<CampusZone | null>(() => {
    if (initialZoneId) {
      return CAMPUS_ZONES.find((z) => z.id === initialZoneId) || CAMPUS_ZONES[0];
    }
    return CAMPUS_ZONES[0]; // Default to Headmaster Office
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'directory'>('map');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copiedDirection, setCopiedDirection] = useState(false);

  // Filtered zones based on category & search query
  const filteredZones = useMemo(() => {
    return CAMPUS_ZONES.filter((zone) => {
      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'classroom' && zone.category === 'classroom') ||
        (activeCategory === 'staff_admin' && zone.category === 'staff_admin') ||
        (activeCategory === 'lab' && zone.category === 'lab') ||
        (activeCategory === 'amenity' && (zone.category === 'amenity' || zone.category === 'sports' || zone.category === 'library'));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        zone.name.toLowerCase().includes(q) ||
        zone.code.toLowerCase().includes(q) ||
        zone.block.toLowerCase().includes(q) ||
        zone.incharge.name.toLowerCase().includes(q) ||
        zone.facilities.some((f) => f.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleZoneClick = (zone: CampusZone) => {
    setSelectedZone(zone);
    if (onSelectZone) {
      onSelectZone(zone);
    }
  };

  const handleCopyDirections = (directions: string) => {
    navigator.clipboard.writeText(directions);
    setCopiedDirection(true);
    setTimeout(() => setCopiedDirection(false), 2000);
  };

  const handlePrintMap = () => {
    window.print();
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col ${
        isFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 border-b border-emerald-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-300/30">
                  Interactive Campus Navigator
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-200">
                  SEMIS: {settings.semisCode}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                GBHS Mehrand Campus Blueprint & Floor Plan
              </h2>
              <p className="text-xs text-emerald-200/90 hidden sm:block">
                Explore building layouts, faculty staff rooms, digital labs, classrooms, and student amenities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* View Switcher */}
            <div className="bg-emerald-900/80 p-1 rounded-xl border border-emerald-700/60 flex items-center text-xs">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'map' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-100 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">2D Visual Map</span>
                <span className="sm:hidden">Map</span>
              </button>
              <button
                onClick={() => setViewMode('directory')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'directory' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-emerald-100 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Directory List</span>
                <span className="sm:hidden">List</span>
              </button>
            </div>

            <button
              onClick={handlePrintMap}
              title="Print Campus Guide"
              className="p-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-700/60 transition"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
              className="p-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-700/60 transition"
            >
              {isFullScreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filter and Search Controls Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-800/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {[
              { id: 'all', label: 'All Campus Facilities' },
              { id: 'staff_admin', label: 'Staff & Admin Rooms' },
              { id: 'lab', label: 'Laboratories & IT' },
              { id: 'classroom', label: 'Classrooms (6th-10th)' },
              { id: 'amenity', label: 'Amenities & Grounds' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-emerald-950 shadow-sm font-black'
                    : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room, lab, staff..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-white placeholder-emerald-300/50 text-xs focus:outline-hidden focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Map View or Directory View */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-[540px]">
        {/* Left Side: Visual Interactive SVG Map Canvas */}
        {viewMode === 'map' ? (
          <div className="flex-1 p-4 sm:p-6 bg-slate-900/5 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Map Legend Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-2 text-[11px] font-bold text-slate-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-800 inline-block"></span> Admin & Staff
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-sky-600 inline-block"></span> Labs & IT
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-teal-700 inline-block"></span> Classrooms
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-600 inline-block"></span> Library / Power
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-green-700 inline-block"></span> Grounds
                </span>
              </div>
              <span className="text-[10px] text-slate-500 italic hidden sm:inline">
                Click any room box to inspect details & directions
              </span>
            </div>

            {/* Interactive SVG Campus Map */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-inner border-2 border-slate-300/80 p-3 relative overflow-x-auto">
              <svg
                viewBox="0 0 1000 620"
                className="w-full h-auto min-w-[650px] select-none"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }}
              >
                {/* Background Campus Perimeter */}
                <rect x="50" y="10" width="900" height="600" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />

                {/* Campus Boundary Wall & Road */}
                <rect x="60" y="15" width="880" height="15" fill="#e2e8f0" stroke="#94a3b8" strokeDasharray="4 4" />
                <text x="500" y="27" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  MEHRAND - KALOI MAIN DISTRICT ROAD (NORTH BOUNDARY)
                </text>

                {/* Central Assembly Grounds & Tree Shaded Courtyard */}
                <rect x="250" y="210" width="500" height="160" rx="12" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="6 3" />
                <text x="500" y="280" fill="#065f46" fontSize="13" fontWeight="900" textAnchor="middle">
                  CENTRAL SHADED ASSEMBLY COURTYARD
                </text>
                <text x="500" y="300" fill="#047857" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  Morning Prayer, Assembly Parade & School Events
                </text>

                {/* Decorative Trees / Greenery */}
                {[
                  { cx: 280, cy: 240 },
                  { cx: 330, cy: 340 },
                  { cx: 480, cy: 345 },
                  { cx: 680, cy: 240 },
                  { cx: 720, cy: 340 },
                  { cx: 80, cy: 360 },
                  { cx: 910, cy: 360 },
                ].map((tree, idx) => (
                  <g key={`tree-${idx}`}>
                    <circle cx={tree.cx} cy={tree.cy} r="14" fill="#86efac" opacity="0.7" />
                    <circle cx={tree.cx} cy={tree.cy} r="9" fill="#22c55e" opacity="0.9" />
                    <circle cx={tree.cx} cy={tree.cy} r="4" fill="#15803d" />
                  </g>
                ))}

                {/* Main Gate Entry Arrow */}
                <line x1="500" y1="4" x2="500" y2="18" stroke="#047857" strokeWidth="4" markerEnd="url(#arrow)" />
                <text x="500" y="14" fill="#064e3b" fontSize="9" fontWeight="900" textAnchor="middle">
                  ▼ MAIN ENTRANCE
                </text>

                {/* Walking Pathways (Dashed Corridor Lines) */}
                <path
                  d="M 500 95 L 500 210 M 250 220 L 250 370 M 750 220 L 750 370 M 100 370 L 900 370"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />

                {/* Render All Campus Zones as Clickable Rectangles */}
                {CAMPUS_ZONES.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  const isMatched = filteredZones.some((fz) => fz.id === zone.id);
                  const { x, y, width, height } = zone.coordinates;

                  return (
                    <g
                      key={zone.id}
                      onClick={() => handleZoneClick(zone)}
                      className="cursor-pointer transition-all duration-200"
                      opacity={isMatched ? 1 : 0.25}
                    >
                      {/* Selection Glow / Pulse */}
                      {isSelected && (
                        <rect
                          x={x - 4}
                          y={y - 4}
                          width={width + 8}
                          height={height + 8}
                          rx="14"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Room Box */}
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        rx="10"
                        fill={isSelected ? zone.color : isMatched ? '#ffffff' : '#f1f5f9'}
                        stroke={zone.color}
                        strokeWidth={isSelected ? '3' : '2'}
                        style={{
                          filter: isSelected
                            ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))'
                            : 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))',
                        }}
                      />

                      {/* Top Code Badge */}
                      <rect
                        x={x + 6}
                        y={y + 6}
                        width="46"
                        height="18"
                        rx="4"
                        fill={isSelected ? '#fef08a' : zone.color}
                      />
                      <text
                        x={x + 29}
                        y={y + 19}
                        fill={isSelected ? '#713f12' : '#ffffff'}
                        fontSize="9"
                        fontWeight="900"
                        textAnchor="middle"
                        letterSpacing="0.5"
                      >
                        {zone.code}
                      </text>

                      {/* Room Name Text */}
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + (height > 80 ? 4 : 2)}
                        fill={isSelected ? '#ffffff' : '#0f172a'}
                        fontSize={width > 130 ? '10.5' : '9.5'}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {zone.name.length > 20 ? `${zone.name.substring(0, 18)}...` : zone.name}
                      </text>

                      {/* Incharge / Sub-Label */}
                      {height >= 85 && (
                        <text
                          x={x + width / 2}
                          y={y + height - 12}
                          fill={isSelected ? '#e2e8f0' : '#64748b'}
                          fontSize="8"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          {zone.incharge.name}
                        </text>
                      )}

                      {/* Indicator Pin */}
                      {isSelected && (
                        <circle cx={x + width - 12} cy={y + 14} r="5" fill="#f59e0b" />
                      )}
                    </g>
                  );
                })}

                {/* Compass Rose in Corner */}
                <g transform="translate(900, 70)">
                  <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#064e3b" strokeWidth="2" />
                  <polygon points="0,-18 5,0 0,5 -5,0" fill="#064e3b" />
                  <polygon points="0,18 5,0 0,5 -5,0" fill="#94a3b8" />
                  <text x="0" y="-8" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
                  <text x="0" y="32" fill="#064e3b" fontSize="9" fontWeight="900" textAnchor="middle">GBHS</text>
                </g>
              </svg>
            </div>

            {/* Quick Map Guide Footer */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 w-full max-w-4xl px-2">
              <div className="flex items-center gap-1.5 font-medium">
                <Info className="w-4 h-4 text-emerald-700" />
                <span>Need quick directions? Click any room or select from the directory index.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleZoneClick(CAMPUS_ZONES.find((z) => z.id === 'zone-it-lab')!)}
                  className="px-2.5 py-1 rounded bg-sky-100 text-sky-800 text-[11px] font-bold hover:bg-sky-200 transition"
                >
                  Find IT Lab
                </button>
                <button
                  onClick={() => handleZoneClick(CAMPUS_ZONES.find((z) => z.id === 'zone-staff-room')!)}
                  className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold hover:bg-emerald-200 transition"
                >
                  Find Staff Room
                </button>
                <button
                  onClick={() => handleZoneClick(CAMPUS_ZONES.find((z) => z.id === 'zone-headmaster')!)}
                  className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-[11px] font-bold hover:bg-amber-200 transition"
                >
                  Find Headmaster
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Directory List View */
          <div className="flex-1 p-5 sm:p-6 bg-slate-50 overflow-y-auto max-h-[620px] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Campus Directory ({filteredZones.length} Locations)
              </h3>
              <span className="text-xs text-slate-500">Sorted by building wing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredZones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => handleZoneClick(zone)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-white" style={{ backgroundColor: zone.color }}>
                          {zone.code}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{zone.block}</span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm">{zone.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{zone.purpose}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-500 font-medium">
                        Incharge: <strong className="text-slate-800">{zone.incharge.name}</strong>
                      </div>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Side: Selected Zone Inspector Drawer / Details Card */}
        {selectedZone && (
          <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header Badge & Name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-black text-white shadow-xs"
                    style={{ backgroundColor: selectedZone.color }}
                  >
                    {selectedZone.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    {selectedZone.block}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedZone.purpose}
                </p>
              </div>

              {/* Faculty In-Charge Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Faculty / Staff In-Charge
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                    {selectedZone.incharge.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {selectedZone.incharge.name}
                    </h4>
                    <p className="text-xs text-emerald-800 font-semibold">
                      {selectedZone.incharge.designation}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {selectedZone.incharge.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Specs (Capacity, Timing) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Capacity</span>
                  <strong className="text-slate-800 font-extrabold">{selectedZone.capacity}</strong>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Access Timing</span>
                  <strong className="text-slate-800 font-extrabold">{selectedZone.timing}</strong>
                </div>
              </div>

              {/* Key Facilities & Equipment List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Available Facilities & Equipment:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Directions from Main Gate */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-amber-700" />
                    How to Reach from Main Entrance:
                  </span>
                  <button
                    onClick={() => handleCopyDirections(selectedZone.directionsFromGate)}
                    className="text-[10px] font-bold text-amber-800 hover:text-amber-950 underline"
                  >
                    {copiedDirection ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {selectedZone.directionsFromGate}
                </p>
              </div>

              {/* Visitor & Student Rules */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span><strong>Visitor Note:</strong> {selectedZone.visitorRules}</span>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => handleCopyDirections(`${selectedZone.name} (${selectedZone.code}) - ${selectedZone.directionsFromGate}`)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-300" />
                <span>{copiedDirection ? 'Directions Copied!' : 'Copy Step-by-Step Directions'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
