import { Pill, Download, Video, ChevronRight, PhoneCall, X, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Prescription } from '../types';

interface QuickActionsProps {
  prescriptions: Prescription[];
  onScreenChange: (screen: string) => void;
}

export default function QuickActions({ prescriptions, onScreenChange }: QuickActionsProps) {
  const [showRxModal, setShowRxModal] = useState(false);
  const [showTeleConsultModal, setShowTeleConsultModal] = useState(false);
  const [teleConsultState, setTeleConsultState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callTimer, setCallTimer] = useState(0);

  // Timer for active call
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (teleConsultState === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [teleConsultState]);

  const startTeleCall = () => {
    setTeleConsultState('calling');
    setTimeout(() => {
      setTeleConsultState('connected');
    }, 2500);
  };

  const endTeleCall = () => {
    setTeleConsultState('ended');
    setTimeout(() => {
      setTeleConsultState('idle');
      setShowTeleConsultModal(false);
    }, 1200);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Actions 1: View Prescriptions */}
        <button
          onClick={() => setShowRxModal(true)}
          className="group flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container rounded-xl border border-outline-variant/30 hover:border-primary/45 transition-all duration-300 shadow-sm cursor-pointer text-left active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Pill size={22} className="text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">View Prescriptions</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Last updated 2 days ago</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>

        {/* Actions 2: Download Reports */}
        <button
          onClick={() => onScreenChange('reports')}
          className="group flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container rounded-xl border border-outline-variant/30 hover:border-primary/45 transition-all duration-300 shadow-sm cursor-pointer text-left active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Download size={22} className="text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">Download Reports</p>
              <p className="text-xs text-on-surface-variant mt-0.5">3 new files available</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>

        {/* Actions 3: Tele-Consult */}
        <button
          onClick={() => {
            setShowTeleConsultModal(true);
            startTeleCall();
          }}
          className="group flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container rounded-xl border border-outline-variant/30 hover:border-primary/45 transition-all duration-300 shadow-sm cursor-pointer text-left active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Video size={22} className="text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">Tele-Consult</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Connect with on-duty GP</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Interactive Prescriptions Modal */}
      <AnimatePresence>
        {showRxModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-all duration-300">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowRxModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-6">
                <Pill size={24} className="text-primary" />
                <h3 className="text-xl font-bold">Active Prescriptions</h3>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-auto mb-6 pr-2">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 relative hover:border-primary/40 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-base text-primary">{rx.name}</h4>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 rounded text-primary uppercase">Active</span>
                    </div>
                    <p className="text-sm text-on-surface-variant"><strong>Directions:</strong> {rx.dosage}</p>
                    <p className="text-xs text-outline mt-3">Expires: {rx.expires}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-outline-variant/30">
                <button
                  onClick={() => setShowRxModal(false)}
                  className="px-6 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-105 transition-all cursor-pointer active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Tele-Consult Call Simulation Modal */}
      <AnimatePresence>
        {showTeleConsultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all duration-300">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary text-on-primary rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center justify-between min-h-[420px] relative border border-primary/30"
            >
              <div className="absolute top-4 right-4 text-on-primary/60">
                <X size={20} className="cursor-pointer hover:text-on-primary" onClick={endTeleCall} />
              </div>

              {/* Call states display */}
              <div className="flex flex-col items-center text-center mt-6 flex-grow justify-center">
                {teleConsultState === 'calling' && (
                  <>
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                      <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center relative z-10 border-4 border-primary">
                        <Video size={40} className="text-on-primary-container" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Connecting...</h3>
                    <p className="text-sm text-on-primary/70 mt-2">Paging on-duty General Physician</p>
                  </>
                )}

                {teleConsultState === 'connected' && (
                  <>
                    <div className="relative mb-6">
                      <img 
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop" 
                        alt="On-duty GP" 
                        className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-2 w-4 h-4 bg-primary-container rounded-full border-2 border-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck size={18} className="text-primary" />
                      <h3 className="text-xl font-bold">Dr. Amanda Vance</h3>
                    </div>
                    <p className="text-xs text-on-primary/70 font-semibold uppercase tracking-wider">Online General Practitioner</p>
                    
                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="mt-6 bg-primary-container/20 hover:bg-primary-container/25 border border-primary-container/30 px-5 py-2.5 rounded-full text-sm font-bold tracking-wider text-primary-container flex items-center gap-2.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                      <span>In Consultation • {formatTime(callTimer)}</span>
                    </motion.div>
                  </>
                )}

                {teleConsultState === 'ended' && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/50 border border-primary/30 flex items-center justify-center mb-6">
                      <PhoneCall size={24} className="text-error" />
                    </div>
                    <h3 className="text-xl font-bold">Call Ended</h3>
                    <p className="text-sm text-on-primary/70 mt-2">Consultation report will be sent to your files.</p>
                  </>
                )}
              </div>

              {/* End parameters action */}
              <div className="w-full mt-6">
                {teleConsultState !== 'ended' && (
                  <button
                    onClick={endTeleCall}
                    className="w-full py-3 bg-error hover:bg-error/90 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <X size={18} />
                    <span>End Consult Call</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
