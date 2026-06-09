import { Star, Briefcase, MapPin, Check } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onBookClick }: DoctorCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/40 transition-all duration-300 shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] hover:-translate-y-0.5 group">
      <div className="flex gap-4 items-start">
        <div className="relative shrink-0">
          <img
            className="w-20 h-20 rounded-xl object-cover border border-outline-variant/30 shadow-inner"
            src={doctor.image}
            alt={doctor.name}
            referrerPolicy="no-referrer"
          />
          {doctor.isVerified && (
            <div className="absolute -bottom-1 right-[-4px] bg-white border border-outline-variant/40 rounded-full p-1 shadow flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[9px] font-black">
                <Check size={10} className="stroke-[3]" />
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1.5 flex-grow">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                {doctor.name}
              </h3>
              <p className="text-xs font-semibold text-primary mt-0.5">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg shrink-0">
              <Star size={14} className="fill-primary stroke-transparent" />
              <span className="text-xs font-black text-on-surface">{doctor.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
              <Briefcase size={14} className="text-outline" />
              <span>{doctor.experienceYears} yrs exp</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
              <MapPin size={14} className="text-outline" />
              <span>{doctor.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Next Available</p>
          <p className="text-sm font-bold text-on-surface mt-0.5">{doctor.nextAvailable}</p>
        </div>
        <button
          onClick={() => onBookClick(doctor)}
          className="bg-primary-container text-on-primary-container font-bold text-sm px-6 py-2.5 rounded-lg hover:brightness-105 transition-all duration-150 active:scale-95 cursor-pointer text-center"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
