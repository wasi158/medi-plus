import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2 } from 'lucide-react';

// Types & Data
import { Doctor, Appointment, Activity, MedicalReport, Prescription } from './types';
import { 
  INITIAL_DOCTORS, 
  OTHER_DOCTORS, 
  RECENT_REPORTS, 
  PRESCRIPTION_HISTORY, 
  RECENT_ACTIVITIES, 
  INITIAL_QUEUE_STATUS, 
  DEFAULT_APPOINTMENT 
} from './data';

// Components (Atomic Design Organisms & Templates)
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import MobileBottomNavBar from './components/MobileBottomNavBar';
import QueueWidget from './components/QueueWidget';
import UpcomingAppointmentCard from './components/UpcomingAppointmentCard';
import QuickActions from './components/QuickActions';
import RecentReportsList from './components/RecentReportsList';
import RecentActivityFeed from './components/RecentActivityFeed';
import SidebarFilters from './components/SidebarFilters';
import DoctorCard from './components/DoctorCard';
import BookingWizard from './components/BookingWizard';
import RecentReportsTable from './components/RecentReportsTable';
import ProfileScreen from './components/ProfileScreen';
import AppointmentHistory from './components/AppointmentHistory';
import { formatDisplayDate } from './utils/dates';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Core application database states
  const [appointments, setAppointments] = useState<Appointment[]>([DEFAULT_APPOINTMENT]);
  const [activities, setActivities] = useState<Activity[]>(RECENT_ACTIVITIES);
  const [reports, setReports] = useState<MedicalReport[]>(RECENT_REPORTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(PRESCRIPTION_HISTORY);

  // Booking Wizard flow communication states
  const [preselectedDoctorForBooking, setPreselectedDoctorForBooking] = useState<Doctor | null>(null);

  // Doctors page filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(1.0);

  const nextUpcomingAppointment = appointments.find(appt => appt.status === 'Confirmed' || appt.status === 'Pending') || null;

  // Handles updating doctors database when click "Load More Doctors"
  const handleLoadMoreDoctors = () => {
    setLoadingDoctors(true);
    setTimeout(() => {
      setDoctors(prev => [...prev, ...OTHER_DOCTORS]);
      setHasLoadedMore(true);
      setLoadingDoctors(false);
    }, 800);
  };

  // Doctors page filter logic
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(doc.department);
    const matchesAvailability = selectedAvailability === 'all' || doc.availability === selectedAvailability;
    const matchesRating = doc.rating >= minRating;

    return matchesSearch && matchesDept && matchesAvailability && matchesRating;
  });

  // Department checkbox toggle handler
  const handleDeptToggle = (dept: string) => {
    setSelectedDepts(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  // Resets filters back to clean slate matching mockup "Clear All" click
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedDepts([]);
    setSelectedAvailability('all');
    setMinRating(1.0);
  };

  // Click on "Book Now" for a specific doctor
  const handleDoctorPreselectAndBook = (doctor: Doctor) => {
    setPreselectedDoctorForBooking(doctor);
    setCurrentScreen('appointments');
  };

  // Callback when booking is compiled successfully in BookingWizard
  const handleBookingComplete = (newAppt: Appointment) => {
    // 1. Save new appointment
    setAppointments(prev => [newAppt, ...prev]);

    // 2. Clear preselected doctor parameter
    setPreselectedDoctorForBooking(null);

    // 3. Log a new Recent Activity event
    const newActivity: Activity = {
      id: 'act-' + Math.floor(Math.random() * 100000),
      type: 'scheduled',
      title: 'Appointment Booked',
      desc: `${newAppt.serviceType} with ${newAppt.doctorName} for ${newAppt.date}`,
      date: 'Just Now'
    };
    setActivities(prev => [newActivity, ...prev]);

    // 4. Send screen back to Home/Dashboard
    setCurrentScreen('home');
  };

  // Fast redirect to Book an Appointment wizard for reviews or generic consults
  const handleBookReviewCall = () => {
    setPreselectedDoctorForBooking(null);
    setCurrentScreen('appointments');
  };

  return (
    <div className="flex flex-col min-h-screen text-on-surface bg-background">
      {/* Persistent App Header */}
      <TopNavBar 
        currentScreen={currentScreen} 
        onScreenChange={(screen) => {
          setCurrentScreen(screen);
          setPreselectedDoctorForBooking(null); // Clear preselect parameters if navigate away
        }} 
      />

      {/* Main Content Arena */}
      <main className="flex-grow pt-24 pb-20 md:pb-12 w-full max-w-7xl mx-auto px-4 md:px-10">
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD (HOME) SCREEN */}
          {currentScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Welcome Banner */}
              <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
                    Welcome back, Mr. Henderson
                  </h1>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">
                    Your health overview for today, {formatDisplayDate(new Date())}.
                  </p>
                </div>
                <button
                  onClick={() => handleDoctorPreselectAndBook(INITIAL_DOCTORS[1])}
                  className="px-6 py-2.5 bg-primary-container text-on-primary-container text-sm font-bold rounded-lg hover:brightness-105 transition-all shadow-sm active:scale-95 duration-150 cursor-pointer flex items-center gap-2"
                >
                  Book Appointment
                </button>
              </section>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Live queue status card (span 4/12) */}
                <div className="md:col-span-4">
                  <QueueWidget initialToken={INITIAL_QUEUE_STATUS} />
                </div>

                {/* Upcoming Appointment card (span 8/12) */}
                <div className="md:col-span-8">
                  {nextUpcomingAppointment ? (
                    <UpcomingAppointmentCard 
                      appointment={nextUpcomingAppointment} 
                      onRescheduleClick={handleBookReviewCall}
                    />
                  ) : (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
                      <p className="font-bold text-on-surface text-base">No scheduled appointments active.</p>
                      <button 
                        onClick={handleBookReviewCall}
                        className="mt-4 px-6 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg hover:brightness-105"
                      >
                        Book Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick actions row (span 12/12) */}
                <div className="md:col-span-12">
                  <QuickActions 
                    prescriptions={prescriptions} 
                    onScreenChange={(screen) => {
                      setCurrentScreen(screen);
                      setPreselectedDoctorForBooking(null);
                    }} 
                  />
                </div>

                {/* Recent diagnostic reports card list (span 7/12) */}
                <div className="md:col-span-7">
                  <RecentReportsList 
                    reports={reports} 
                    onViewAllClick={() => setCurrentScreen('reports')} 
                  />
                </div>

                {/* Recent Activities feed (span 5/12) */}
                <div className="md:col-span-5">
                  <RecentActivityFeed activities={activities} />
                </div>

              </div>
            </motion.div>
          )}

          {/* DOCTORS DIRECTORY SCREEN */}
          {currentScreen === 'doctors' && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Find Your Specialist</h1>
                  <p className="text-sm text-on-surface-variant mt-1.5">
                    Access top-rated medical experts and book immediate consultations.
                  </p>
                </div>
                
                {/* Dynamic doctor search bar */}
                <div className="relative w-full md:w-96 group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or specialty..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all shadow-sm"
                  />
                </div>
              </section>

              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Reactive Filters Sidebar */}
                <SidebarFilters
                  selectedDepts={selectedDepts}
                  onDeptToggle={handleDeptToggle}
                  selectedAvailability={selectedAvailability}
                  onAvailabilityChange={setSelectedAvailability}
                  minRating={minRating}
                  onMinRatingChange={setMinRating}
                  onClearAll={handleClearAllFilters}
                  onUrgentCallClick={handleBookReviewCall}
                />

                {/* Dynamic Doctors Grid list */}
                <div className="flex-grow flex flex-col gap-6">
                  
                  {/* Action Chips displaying filters */}
                  <div className="flex flex-wrap gap-2">
                    {selectedDepts.map(dept => (
                      <span 
                        key={dept}
                        className="bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-outline-variant/30 text-primary uppercase tracking-wide select-none"
                      >
                        {dept}
                        <button 
                          onClick={() => handleDeptToggle(dept)} 
                          className="hover:text-error text-sm font-black focus:outline-none cursor-pointer p-0.5"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    
                    {minRating > 1.0 && (
                      <span className="bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-outline-variant/30 text-primary uppercase tracking-wide select-none">
                        {minRating.toFixed(1)}+ Stars
                        <button 
                          onClick={() => setMinRating(1.0)} 
                          className="hover:text-error text-sm font-black focus:outline-none cursor-pointer p-0.5"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Doctor cards renderer */}
                  {filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredDoctors.map(doctor => (
                        <div key={doctor.id}>
                          <DoctorCard 
                            doctor={doctor} 
                            onBookClick={handleDoctorPreselectAndBook} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-outline-variant/30 shadow-xs">
                      <p className="text-lg font-bold text-on-surface">No specialist matching parameters.</p>
                      <button
                        onClick={handleClearAllFilters}
                        className="mt-4 px-6 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg hover:brightness-105 transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}

                  {/* Dynamic load pagination button */}
                  {!hasLoadedMore && filteredDoctors.length > 0 && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleLoadMoreDoctors}
                        disabled={loadingDoctors}
                        className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-primary font-bold text-sm px-8 py-3 rounded-full transition-all cursor-pointer active:scale-95 duration-100 disabled:opacity-50"
                      >
                        {loadingDoctors ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Staff Paging In Progress...</span>
                          </>
                        ) : (
                          <>
                            <span>Load More Doctors</span>
                            <span className="text-lg">▾</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {/* APPOINTMENTS (BOOKING) SCREEN */}
          {currentScreen === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <BookingWizard 
                preselectedDoctor={preselectedDoctorForBooking} 
                onBookingComplete={handleBookingComplete} 
                onBackToDashboard={() => setCurrentScreen('home')}
              />
            </motion.div>
          )}

          {/* DIAGNOSTIC REPORTS & HISTORIES SCREEN */}
          {currentScreen === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <RecentReportsTable 
                initialReports={reports} 
                initialPrescriptions={prescriptions} 
                onBookReviewCall={handleBookReviewCall}
              />
            </motion.div>
          )}

          {currentScreen === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <AppointmentHistory
                appointments={appointments}
                onBookNew={handleBookReviewCall}
              />
            </motion.div>
          )}

          {currentScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ProfileScreen onScreenChange={setCurrentScreen} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Persistent App Footer */}
      <Footer onScreenChange={setCurrentScreen} />

      {/* Persistent App Mobile Navbar */}
      <MobileBottomNavBar 
        currentScreen={currentScreen} 
        onScreenChange={(screen) => {
          setCurrentScreen(screen);
          setPreselectedDoctorForBooking(null);
        }} 
      />
    </div>
  );
}
