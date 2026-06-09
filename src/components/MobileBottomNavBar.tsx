import { Home, Stethoscope, Calendar, FileText } from 'lucide-react';

interface MobileBottomNavBarProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export default function MobileBottomNavBar({ currentScreen, onScreenChange }: MobileBottomNavBarProps) {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'Visits', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/40 px-6 py-2.5 flex justify-between items-center z-50 shadow-[var(--shadow-primary)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id || (item.id === 'reports' && currentScreen === 'history');
        return (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
            <span className={`text-[11px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
