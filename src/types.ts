/**
 * HealPortal Types and Interfaces
 */

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experienceYears: number;
  location: string;
  image: string;
  nextAvailable: string;
  department: 'Cardiology' | 'Dermatology' | 'Neurology' | 'Pediatrics';
  availability: 'today' | 'next3days' | 'thisweek';
  isVerified?: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  serviceType: 'OPD' | 'Lab Test' | 'Radiology';
  testName?: string;
  cost: number;
}

export interface MedicalReport {
  id: string;
  name: string;
  category: 'Blood Test' | 'X-Ray' | 'MRI' | 'Urine Test' | 'Ophthalmology';
  date: string;
  orderedBy: string;
  status: 'Ready' | 'Pending';
  downloadUrl?: string;
}

export interface Activity {
  id: string;
  type: 'completed' | 'prescription' | 'invoice' | 'scheduled';
  title: string;
  desc: string;
  date: string;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  expires: string;
  type: 'pill' | 'bottle' | 'syringe';
}

export interface QueueToken {
  tokenNumber: string;
  estimatedWaitMinutes: number;
  activeDoctor: string;
  department: string;
  progressPercentage: number;
}
