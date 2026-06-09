import { User, Mail, Phone, MapPin, Shield, Bell, ChevronRight } from 'lucide-react';

interface ProfileScreenProps {
  patientName?: string;
  onScreenChange: (screen: string) => void;
}

export default function ProfileScreen({ patientName = 'Mr. Henderson', onScreenChange }: ProfileScreenProps) {
  const settings = [
    { icon: Bell, label: 'Notification Preferences', action: () => alert('Notification settings saved to your account.') },
    { icon: Shield, label: 'Privacy & Security', action: () => alert('Your medical records are encrypted and HIPAA-compliant.') },
    { icon: MapPin, label: 'Preferred Clinic Location', action: () => alert('Main Wing — HealPortal Medical Center') },
  ];

  return (
    <div className="space-y-8 py-4 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">My Profile</h1>
        <p className="text-sm text-on-surface-variant mt-1.5">Manage your account and health preferences.</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[var(--shadow-primary)] flex flex-col sm:flex-row items-center gap-6">
        <img
          alt="Patient Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-primary-fixed"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVwUr1IMotCE1Vp07i_X9lnBi0gLF2Q4q884jUsNxl5WMNV02uh5Z0rvgcIa4kJxAbwiG2QgwFKnGFPyrwGCLbLf0NxcomDYu3CTIbfTQsmtoNnVPMnElYJQhMChQJp2asolgyUNQ1MPzFHc0ufOSdbwyZO6f5NuHwhSNM-I0V5q2Z0g_nKw0Ky5CjYxczQyE_8bEM-HaGBslMlL9KqRFDKQ7-tz7wSyEvPq9MyB-CtviaLU0LbrzVzoJ9Myz-Aq0t69Eq4mRV9ffp"
          referrerPolicy="no-referrer"
        />
        <div className="text-center sm:text-left flex-grow">
          <h2 className="text-xl font-bold text-on-surface">{patientName}</h2>
          <p className="text-sm text-on-surface-variant mt-1">Patient ID: HP-2024-88421</p>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5"><Mail size={14} className="text-primary" /> henderson@email.com</span>
            <span className="flex items-center gap-1.5"><Phone size={14} className="text-primary" /> +1 (555) 234-8901</span>
          </div>
        </div>
        <button
          onClick={() => onScreenChange('appointments')}
          className="px-5 py-2.5 bg-primary-container text-on-primary-container text-sm font-bold rounded-lg hover:brightness-105 transition-all cursor-pointer shrink-0"
        >
          Book Visit
        </button>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-[var(--shadow-primary)] overflow-hidden">
        <h3 className="text-base font-bold text-on-surface px-6 py-4 border-b border-outline-variant/30 flex items-center gap-2">
          <User size={18} className="text-primary" /> Account Settings
        </h3>
        {settings.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/20 last:border-b-0"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-on-surface">
              <item.icon size={18} className="text-primary" />
              {item.label}
            </span>
            <ChevronRight size={16} className="text-outline" />
          </button>
        ))}
      </div>
    </div>
  );
}
