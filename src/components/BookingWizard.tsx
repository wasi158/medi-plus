import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Stethoscope, Microscope, Sparkles, ChevronLeft, ChevronRight, 
  Check, Info, Sparkle
} from 'lucide-react';
import { Doctor, Appointment } from '../types';
import {
  generateCalendarDays,
  formatMonthYear,
  getDefaultBookingDate,
  formatDisplayDate,
} from '../utils/dates';

interface BookingWizardProps {
  preselectedDoctor: Doctor | null;
  onBookingComplete: (newAppt: Appointment) => void;
  onBackToDashboard: () => void;
}

export default function BookingWizard({ 
  preselectedDoctor, 
  onBookingComplete, 
  onBackToDashboard 
}: BookingWizardProps) {
  const today = useMemo(() => new Date(), []);
  const defaultDate = getDefaultBookingDate(today);

  const [currentStep, setCurrentStep] = useState(1);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [bookingData, setBookingData] = useState({
    service: '',
    detail: '',
    date: defaultDate,
    time: '09:30 AM',
    cost: 75
  });

  const calendarDays = useMemo(
    () => generateCalendarDays(calendarYear, calendarMonth, today),
    [calendarYear, calendarMonth, today]
  );

  useEffect(() => {
    if (preselectedDoctor) {
      setBookingData({
        service: 'OPD_CONSULTATION',
        detail: `${preselectedDoctor.name} (${preselectedDoctor.specialty})`,
        date: defaultDate,
        time: '04:30 PM',
        cost: 110
      });
      setCurrentStep(3);
    }
  }, [preselectedDoctor, defaultDate]);

  const selectService = (type: string, cost: number) => {
    if (type === 'RADIOLOGY') {
      setBookingData(prev => ({
        ...prev,
        service: 'RADIOLOGY',
        detail: '',
        cost: 120
      }));
      setCurrentStep(2);
    } else {
      setBookingData(prev => ({
        ...prev,
        service: type.toUpperCase(),
        detail: type === 'OPD' ? 'General Consultation / OPD' : 'Comprehensive Blood Test Panel',
        cost: cost
      }));
      setCurrentStep(3);
    }
  };

  const selectRadiology = (testName: string, cost: number) => {
    setBookingData(prev => ({
      ...prev,
      detail: testName,
      cost: cost
    }));
    setCurrentStep(3);
  };

  const selectDate = (label: string) => {
    setBookingData(prev => ({ ...prev, date: label }));
  };

  const selectTime = (time: string) => {
    setBookingData(prev => ({ ...prev, time: time }));
  };

  const navigateMonth = (direction: -1 | 1) => {
    setCalendarMonth(prev => {
      let newMonth = prev + direction;
      let newYear = calendarYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      setCalendarYear(newYear);
      return newMonth;
    });
  };

  const canContinue = (): boolean => {
    switch (currentStep) {
      case 1:
        return bookingData.service !== '';
      case 2:
        return bookingData.detail !== '';
      case 3:
        return bookingData.date !== '' && bookingData.time !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleConfirm = () => {
    const randomizedId = 'appt-' + Math.floor(Math.random() * 100000);
    const resolvedType = (bookingData.service === 'OPD' || bookingData.service === 'OPD_CONSULTATION') 
      ? 'OPD' 
      : bookingData.service === 'LAB' 
        ? 'Lab Test' 
        : 'Radiology';

    const completedAppt: Appointment = {
      id: randomizedId,
      doctorName: preselectedDoctor ? preselectedDoctor.name : 'Dr. HealPortal Specialist',
      specialty: bookingData.detail,
      date: bookingData.date,
      time: bookingData.time,
      status: 'Confirmed',
      serviceType: resolvedType,
      cost: bookingData.cost
    };

    onBookingComplete(completedAppt);
    alert('Booking Confirmed! An SMS with details has been sent.');
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBackToDashboard();
    } else if (currentStep === 3 && preselectedDoctor) {
      onBackToDashboard();
    } else if (currentStep === 3 && bookingData.service === 'RADIOLOGY') {
      setCurrentStep(2);
    } else if (currentStep === 3) {
      setCurrentStep(1);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleContinue = () => {
    if (!canContinue()) return;
    if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handleConfirm();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const getStepCircleStyles = (stepNum: number) => {
    if (currentStep > stepNum) {
      return 'bg-primary text-on-primary border-primary';
    }
    if (currentStep === stepNum) {
      return 'bg-primary text-on-primary border-primary ring-4 ring-primary/20';
    }
    return 'bg-surface-container text-on-surface-variant border-transparent';
  };

  const getStepTextStyles = (stepNum: number) => {
    if (currentStep >= stepNum) {
      return 'text-primary font-semibold';
    }
    return 'text-on-surface-variant';
  };

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '11:15 AM',
    '02:00 PM',
    '03:45 PM',
    '04:30 PM'
  ];

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant mb-6">
        <Home size={14} className="text-outline cursor-pointer hover:text-primary" onClick={onBackToDashboard} />
        <span>Home</span>
        <ChevronRight size={12} className="text-outline" />
        <span className="text-primary font-bold">New Visit Booking</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Book an Appointment</h1>
        <p className="text-sm text-on-surface-variant mt-1.5">
          Complete the following steps to secure your medical consultation or diagnostic test.
        </p>
      </div>

      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-outline-variant/40 -z-10 -translate-y-1/2" />
        <div className="flex justify-between w-full">
          {[
            { step: 1, label: 'Service' },
            { step: 2, label: 'Details' },
            { step: 3, label: 'Schedule' },
            { step: 4, label: 'Review' }
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-1.5 select-none">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${getStepCircleStyles(item.step)}`}>
                {currentStep > item.step ? <Check size={16} className="stroke-[3]" /> : item.step}
              </div>
              <span className={`text-[11px] uppercase tracking-wider font-bold ${getStepTextStyles(item.step)}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-[var(--shadow-primary)] p-6 md:p-8 min-h-[420px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="flex-grow"
            >
              <h2 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
                Select Service Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => selectService('OPD', 80)}
                  className="group flex flex-col items-center p-6 border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all text-center cursor-pointer active:scale-98 duration-150"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <Stethoscope size={30} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">OPD Consultation</h3>
                  <p className="text-xs text-on-surface-variant max-w-[85%] leading-normal">
                    General or specialist medical practitioner advice.
                  </p>
                </button>

                <button
                  onClick={() => selectService('LAB', 65)}
                  className="group flex flex-col items-center p-6 border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all text-center cursor-pointer active:scale-98 duration-150"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <Microscope size={30} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Lab Test</h3>
                  <p className="text-xs text-on-surface-variant max-w-[85%] leading-normal">
                    Blood work, urine profile, diagnostics panels.
                  </p>
                </button>

                <button
                  onClick={() => selectService('RADIOLOGY', 120)}
                  className="group flex flex-col items-center p-6 border border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container-low transition-all text-center cursor-pointer active:scale-98 duration-150"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <Sparkles size={30} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Radiology</h3>
                  <p className="text-xs text-on-surface-variant max-w-[85%] leading-normal">
                    Imaging diagnostics like MRI, CT, and X-Ray scan.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="flex-grow"
            >
              <h2 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
                Select Diagnostic Imaging
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'MRI Scan', cost: 120, info: 'Magnetic Resonance Imaging - Outpatient and joints' },
                  { name: 'CT Scan', cost: 95, info: 'Computed Tomography - Comprehensive structural analysis' },
                  { name: 'X-Ray PA View', cost: 45, info: 'Standard Chest / skeletal radiograph PA perspective' },
                  { name: 'Ultrasound Scan', cost: 60, info: 'Ultrasonic visceral scan and imaging diagnostics' }
                ].map((rad) => (
                  <div
                    key={rad.name}
                    onClick={() => selectRadiology(rad.name, rad.cost)}
                    className="p-4 border border-outline-variant hover:border-primary rounded-xl cursor-pointer hover:bg-surface-container-low flex justify-between items-center transition-all duration-150 active:scale-98 font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkle size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{rad.name}</p>
                        <p className="text-[11px] text-on-surface-variant font-normal">{rad.info}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-on-primary-container bg-primary-container hover:brightness-105 px-2.5 py-1 rounded-full shrink-0">
                      ${rad.cost}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="flex-grow"
            >
              <h2 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">
                Choose Date &amp; Time
              </h2>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-on-surface tracking-wide">
                      {formatMonthYear(new Date(calendarYear, calendarMonth))}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border border-transparent"
                        aria-label="Previous month"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border border-transparent"
                        aria-label="Next month"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((m, i) => (
                      <div key={`${m}-${i}`} className="text-[10px] text-outline font-bold uppercase">{m}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cal, idx) => {
                      const label = cal.label || '';
                      const isSelected = cal.isCurrentMonth && bookingData.date === label;
                      const isDisabled = !cal.isCurrentMonth || cal.isPast;
                      
                      return (
                        <button
                          key={idx}
                          disabled={isDisabled}
                          onClick={() => label && selectDate(label)}
                          className={`h-9 w-9 flex items-center justify-center rounded-full text-xs transition-colors cursor-pointer select-none font-bold ${
                            isDisabled
                              ? 'text-outline-variant border-transparent pointer-events-none opacity-30' 
                              : isSelected
                                ? 'bg-primary text-on-primary shadow-sm font-black scale-102'
                                : 'hover:bg-primary-fixed text-on-surface'
                          }`}
                        >
                          {cal.day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">Available Slots</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {timeSlots.map((time) => {
                      const isSelected = bookingData.time === time;
                      return (
                        <button
                          key={time}
                          onClick={() => selectTime(time)}
                          className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer text-center ${
                            isSelected
                              ? 'bg-primary-container text-on-primary-container border-primary-container shadow-sm scale-102'
                              : 'border-outline-variant/60 hover:border-primary text-on-surface'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              className="flex-grow"
            >
              <h2 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3 text-center">
                Booking Summary &amp; Review
              </h2>
              
              <div className="bg-surface-container-low rounded-xl p-6 space-y-4 mb-6 border border-outline-variant/20 max-w-xl mx-auto">
                <div className="flex justify-between items-center pb-2.5 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Service Type</span>
                  <span className="font-bold text-base text-primary uppercase">{bookingData.service.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Specific Consultation</span>
                  <span className="font-bold text-sm text-on-surface">{bookingData.detail}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Appointment Date</span>
                  <span className="font-extrabold text-sm text-on-surface">{bookingData.date}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Scheduled Time</span>
                  <span className="font-extrabold text-sm text-on-surface">{bookingData.time}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Estimated Fee</span>
                  <span className="text-2xl font-black text-on-surface">${bookingData.cost}.00</span>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg flex gap-3 max-w-xl mx-auto border border-primary/10">
                <Info size={18} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs leading-normal text-on-surface-variant">
                  <strong>Punctuality Protocol:</strong> Please arrive 15 minutes prior to scheduled medical slots for document verification and initial diagnostic triage. Thank you!
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-outline-variant/30 flex justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-2.5 border border-primary text-primary font-bold rounded-lg hover:bg-primary-fixed/30 transition-all cursor-pointer text-sm"
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="px-6 py-2.5 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-105 shadow-sm active:scale-95 transition-all cursor-pointer text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {currentStep === 4 ? 'Confirm Booking' : 'Continue'}
          </button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <div className="relative overflow-hidden h-40 rounded-xl p-5 bg-primary group cursor-pointer border border-outline-variant/20 shadow-sm">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              alt="Clinic Interior" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8aExPLl-AA6h6TmtBb0wnwEeJSqFA_ysZKClsayxB68ZV0s4cQVuKzAL_xpaGR91coE9I_IABDHf6A2cUqeuPjrAmB6-xkyRNelbChWM6lcNcHnB7cs6UEzmfy0_ihxhO3a70A3OWQEsOkKcDRd23VSRDPlCZiLe99fZJjRlhFoWvNL_DfXrYxvMV-0gMpVr7vI1nfZJ6OjwNdIPpDU73bpkhiv4YnH9xeMAvTiroD_TovFc5ezywvVgAHzsNdPJONyB3EEcNpr0N"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-primary-container text-on-primary-container px-2.5 py-0.5 rounded-full w-fit mb-2">
              Premium Care
            </span>
            <h4 className="text-lg font-bold text-on-primary tracking-wide">Executive Health Screenings</h4>
          </div>
        </div>

        <div className="relative overflow-hidden h-40 rounded-xl p-5 bg-surface-container-high group cursor-pointer border border-outline-variant/35 shadow-sm">
          <div className="absolute right-0 bottom-0 w-1/2 h-full z-0">
            <img 
              alt="Lab Equipment" 
              className="w-full h-full object-cover opacity-80" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLLtNEBPDSrcp4Hq7SBKz-aPi6OjiKirVMRDhUuc-Wu801XvDxJeJ08Lya_ljK9Z5NFjDWpg8yHFWqs_QGnaLMzFDbgrHnvYXDSjwZF3OpRgo0uxbzgUETjKmDSGJ1dXOteiWX_J9HAF-s-KtvK6LNtFuEyVB4M6hGoJHxKXTYEy7PnGXnBHzv7FxvzVyfnRNARM8SeGBlDPpEm4dLwmfMjylVMz4VvY7Qgjmpvh2Mk3T49W0wuswl3NiUjWrEXJIl41A_hCNt9wHN"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center max-w-[55%]">
            <h4 className="text-lg font-bold text-on-surface tracking-wide">Home Sample Collection</h4>
            <p className="text-xs text-on-surface-variant leading-normal mt-1.5 font-medium">
              Get lab tests done from your home. Free collection within 5 miles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
