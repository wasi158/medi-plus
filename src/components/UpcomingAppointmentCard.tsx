import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Stethoscope, ChevronDown, ChevronUp, MapPin, Phone, Info } from 'lucide-react';
import { Appointment } from '../types';

interface UpcomingAppointmentCardProps {
  appointment: Appointment;
  onRescheduleClick: () => void;
}

export default function UpcomingAppointmentCard({ appointment, onRescheduleClick }: UpcomingAppointmentCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-primary text-on-primary rounded-xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between h-full group">
      {/* Background gradients/blobs */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-all duration-500" />
      <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Next Visit</span>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{appointment.specialty}</h3>
          </div>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="px-3.5 py-1 bg-white/20 hover:bg-white/25 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm cursor-default"
          >
            {appointment.status}
          </motion.span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Calendar size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] text-white/75 font-semibold uppercase tracking-wider">Date</p>
              <p className="text-base font-bold leading-tight">{appointment.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Clock size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] text-white/75 font-semibold uppercase tracking-wider">Time</p>
              <p className="text-base font-bold leading-tight">{appointment.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-lg border border-white/5">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Stethoscope size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] text-white/75 font-semibold uppercase tracking-wider">Physician</p>
              <p className="text-base font-bold leading-tight">{appointment.doctorName}</p>
            </div>
          </div>
        </div>

        {/* Detailed Dropdown Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-white/10 mt-4 pt-4 text-white/90 text-sm space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 text-white/70 shrink-0" />
                <p><strong>Location:</strong> Outpatient Dept (OPD), Main Block, 2nd Floor, Room 204.</p>
              </div>
              
              <div className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 text-white/70 shrink-0" />
                <p><strong>Emergency Contact:</strong> +1 (555) 472-7800</p>
              </div>

              <div className="flex items-start gap-2.5 bg-white/10 p-3 rounded-lg border border-white/10">
                <Info size={18} className="text-white/85 mt-0.5 shrink-0" />
                <p className="text-xs leading-normal">
                  <strong>Patient Instructions:</strong> Please refrain from eating solid foods solid 3 hours before checkup. Bring your current medication files and insurance card ID.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex gap-3 mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/95 transition-all text-center flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 duration-100"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button
          onClick={onRescheduleClick}
          className="bg-transparent border border-white/35 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer active:scale-95 duration-100"
        >
          Reschedule
        </button>
      </div>
    </div>
  );
}
