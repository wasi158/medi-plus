import { Doctor, MedicalReport, Activity, Prescription, QueueToken, Appointment } from './types';
import { formatDisplayDate } from './utils/dates';

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return formatDisplayDate(d);
};
const daysAhead = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return formatDisplayDate(d);
};

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. James Wilson',
    specialty: 'Senior Cardiologist',
    rating: 4.9,
    experienceYears: 12,
    location: 'Main Wing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf8QdwNV7-Aaxdk6X259C7hkeJ-TdUH0abJ1YgOuOS1seTlpBqCCLXrrb7MFJJAqNtEAoae1iaE-PleY93DEPCvKQMAH4Ah-RF3xlML8TKm_f4llrbjUuoK6Q0Ag-ezO4__y5MfTbbgPhvva0mH2SQfhFHtRzpXX1cUZeVq2vjzsBUHdFa2nAKZFU1HYQ9gTcAjykqw8Q0m7WFSxhjnzyqwTM_Mw4l2oQq_rnfVh6t_JYDx8JUyUOu1ZOx-R2TblRTJ0ppWuO6f10b',
    nextAvailable: 'Today, 04:30 PM',
    department: 'Cardiology',
    availability: 'today',
    isVerified: true
  },
  {
    id: 'doc-2',
    name: 'Dr. Sarah Chen',
    specialty: 'Neurology Specialist',
    rating: 4.8,
    experienceYears: 8,
    location: 'North Wing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIjHw4PBHFVHrE3uGnKxVA-uwO_Y8PFA_CUayj4GCNLLHtTvdihL_G9C-ULNLZGJkDWJZZVWIDbuiN8Ix_OSHtTJVL981ROT8YPoEoMfoqlN6c6bm3iu7HlDNT138xVm3EBz3Ei9LYDqikZN-976lfDGhoKCsiWGSVQWL1H0EAgalV2bJfoitVJrXHPr4Hv7UdgRJH3OE0ShwHvXSBLAPbAo8bYIVvbadYR8rL3l5QT7ZhQBE5Ep8EzCnMyMj87On1jT-kUhgOyQbh',
    nextAvailable: 'Tomorrow, 09:00 AM',
    department: 'Neurology',
    availability: 'next3days'
  },
  {
    id: 'doc-3',
    name: 'Dr. Michael Ross',
    specialty: 'Head of Pediatrics',
    rating: 5.0,
    experienceYears: 20,
    location: 'Kids Center',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1DJo6gTQbJeWngmUqkDyOp4B0S3fgHc9HoLK_kHkK5VjrQs7eDnHDgCSURcRN0CkLvgnW3JjggYioMunIDby08g1FaDsZEkCFDoyb6W4R5lmF4I9dbPR-S_QXxq17VgNJh7saF8jglwTfraStc4LQzLgm23llD_6vQBNKk7uq589RGBoJknC-n1TgQCR-N7uCHfp1GUUoCPB7kUjx3JmzVi0dKHbdroMwQgyo6HH82jGvOkGwVujoCGJOeukMbKNvwMZLwTFedGqt',
    nextAvailable: 'Wed, 11:30 AM',
    department: 'Pediatrics',
    availability: 'thisweek'
  },
  {
    id: 'doc-4',
    name: 'Dr. Elena Garcia',
    specialty: 'Dermatologist',
    rating: 4.7,
    experienceYears: 6,
    location: 'Skin Clinic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXu1q8mHFTsBbaI3oo4xxSURIDVLzi99fNQxa0O6USEpjzDsVRFEQv0yiPjF6X11ECUz-u9xi-ai2Ad5EsO53GP4WteK3ylqvTlDnchsGFHuyVPf-_QzB7e7NyYe52lGgXnKOtKyaVHTdb6oFKIhEiMb0T4h6pCfICfZhCxHyWe948OGzjWOkrwzWFSccZwfCpI-MpMi9O179YEiQWSCdQ6jv8fxUcP7pJ_EDiDnRGgm75MCeRgomBHYCWdu8xtZ0i9nT0YmI_VoSqXR',
    nextAvailable: 'Tomorrow, 02:00 PM',
    department: 'Dermatology',
    availability: 'next3days'
  }
];

export const OTHER_DOCTORS: Doctor[] = [
  {
    id: 'doc-5',
    name: 'Dr. Aaron Patel',
    specialty: 'Clinical Cardiologist',
    rating: 4.6,
    experienceYears: 10,
    location: 'West Wing',
    image: 'https://picsum.photos/seed/doctor5/300/300',
    nextAvailable: 'Thursday, 10:00 AM',
    department: 'Cardiology',
    availability: 'next3days'
  },
  {
    id: 'doc-6',
    name: 'Dr. Linda K. Smith',
    specialty: 'Neurology Specialist',
    rating: 4.9,
    experienceYears: 15,
    location: 'North Wing',
    image: 'https://picsum.photos/seed/doctor6/300/300',
    nextAvailable: 'Friday, 01:00 PM',
    department: 'Neurology',
    availability: 'thisweek'
  },
  {
    id: 'doc-7',
    name: 'Dr. Robert Carter',
    specialty: 'Pediatrics Associate',
    rating: 4.8,
    experienceYears: 11,
    location: 'Kids Center',
    image: 'https://picsum.photos/seed/doctor7/300/300',
    nextAvailable: 'Today, 05:00 PM',
    department: 'Pediatrics',
    availability: 'today'
  }
];

export const RECENT_REPORTS: MedicalReport[] = [
  {
    id: 'rep-1',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Test',
    date: daysAgo(3),
    orderedBy: 'Dr. Aris Thorne',
    status: 'Ready'
  },
  {
    id: 'rep-2',
    name: 'Chest X-Ray PA View',
    category: 'X-Ray',
    date: daysAgo(18),
    orderedBy: 'Dr. Sarah Miller',
    status: 'Ready'
  },
  {
    id: 'rep-3',
    name: 'Lumbar Spine MRI',
    category: 'MRI',
    date: daysAgo(12),
    orderedBy: 'Dr. James Wilson',
    status: 'Pending'
  },
  {
    id: 'rep-4',
    name: 'Lipid Profile',
    category: 'Blood Test',
    date: daysAgo(45),
    orderedBy: 'Dr. Aris Thorne',
    status: 'Ready'
  },
  {
    id: 'rep-5',
    name: 'Thyroid Function Panel',
    category: 'Blood Test',
    date: daysAgo(120),
    orderedBy: 'Dr. Sarah Chen',
    status: 'Ready'
  }
];

export const PRESCRIPTION_HISTORY: Prescription[] = [
  {
    id: 'rx-1',
    name: 'Amoxicillin 500mg',
    dosage: '1 capsule, 3 times daily',
    expires: daysAhead(180),
    type: 'pill'
  },
  {
    id: 'rx-2',
    name: 'Lisinopril 10mg',
    dosage: '1 tablet daily in the morning',
    expires: daysAhead(90),
    type: 'bottle'
  }
];

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'completed',
    title: 'Appointment Completed',
    desc: 'Consultation with Dr. Sarah Miller',
    date: 'Yesterday, 10:45 AM'
  },
  {
    id: 'act-2',
    type: 'prescription',
    title: 'Prescription Updated',
    desc: 'New meds added for Blood Pressure',
    date: daysAgo(5)
  },
  {
    id: 'act-3',
    type: 'invoice',
    title: 'Invoice Paid',
    desc: 'Transaction ID: #MED-90210',
    date: daysAgo(7)
  }
];

export const INITIAL_QUEUE_STATUS: QueueToken = {
  tokenNumber: '#24',
  estimatedWaitMinutes: 12,
  activeDoctor: 'Dr. Aris Thorne',
  department: 'Cardiology',
  progressPercentage: 65
};

export const DEFAULT_APPOINTMENT: Appointment = {
  id: 'appt-1',
  doctorName: 'Dr. Sarah Miller',
  specialty: 'General Checkup',
  date: daysAhead(3),
  time: '09:30 AM',
  status: 'Confirmed',
  serviceType: 'OPD',
  cost: 75
};
