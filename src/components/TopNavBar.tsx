import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface TopNavBarProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
  patientName?: string;
}

const NOTIFICATIONS = [
  { id: 1, title: 'Lab Results Ready', message: 'Your CBC results are now available.', time: '2 hours ago' },
  { id: 2, title: 'Appointment Reminder', message: 'Upcoming visit on your scheduled date.', time: '1 day ago' },
  { id: 3, title: 'Prescription Refill', message: 'Lisinopril refill approved by pharmacy.', time: '3 days ago' },
];

export default function TopNavBar({ currentScreen, onScreenChange, patientName = "Mr. Henderson" }: TopNavBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'reports', label: 'Reports' },
    { id: 'history', label: 'History' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-outline-variant/30 shadow-[var(--shadow-primary)] transition-all">
      <nav className="flex justify-between items-center h-16 px-4 md:px-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <div 
            className="text-xl font-bold text-primary cursor-pointer hover:opacity-90 flex items-center gap-2"
            onClick={() => onScreenChange('home')}
          >
            <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-black">H</span>
            <span>HealPortal</span>
          </div>
          <div className="hidden md:flex gap-6">
            {tabs.map((tab) => {
              const isActive = currentScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onScreenChange(tab.id)}
                  className={`relative font-medium text-base transition-colors duration-200 py-1 cursor-pointer hover:text-primary ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary-container rounded" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative p-2 hover:bg-surface-container-low transition-all rounded-full active:scale-95 duration-200 text-primary cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-outline-variant/30 shadow-[var(--shadow-primary-lg)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30">
                  <span className="text-sm font-bold text-on-surface">Notifications</span>
                  <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-surface-container rounded-full cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {NOTIFICATIONS.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 hover:bg-surface-container-low border-b border-outline-variant/20 last:border-b-0 cursor-pointer">
                      <p className="text-sm font-bold text-on-surface">{notif.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-outline mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            onClick={() => onScreenChange('profile')}
          >
            <img 
              alt="Patient Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed hover:border-primary transition-all shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVwUr1IMotCE1Vp07i_X9lnBi0gLF2Q4q884jUsNxl5WMNV02uh5Z0rvgcIa4kJxAbwiG2QgwFKnGFPyrwGCLbLf0NxcomDYu3CTIbfTQsmtoNnVPMnElYJQhMChQJp2asolgyUNQ1MPzFHc0ufOSdbwyZO6f5NuHwhSNM-I0V5q2Z0g_nKw0Ky5CjYxczQyE_8bEM-HaGBslMlL9KqRFDKQ7-tz7wSyEvPq9MyB-CtviaLU0LbrzVzoJ9Myz-Aq0t69Eq4mRV9ffp"
              referrerPolicy="no-referrer"
            />
            <span className="hidden lg:inline text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
              {patientName}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
