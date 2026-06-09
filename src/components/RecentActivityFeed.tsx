import { useState, useRef, useEffect } from 'react';
import { CheckCircle, Pill, CreditCard, MoreVertical, Calendar } from 'lucide-react';
import { Activity } from '../types';

interface RecentActivityFeedProps {
  activities: Activity[];
}

type SortOrder = 'newest' | 'oldest';

export default function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedActivities = sortOrder === 'newest' ? activities : [...activities].reverse();

  const getIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center ring-4 ring-white shrink-0">
            <CheckCircle size={18} className="text-on-primary" />
          </div>
        );
      case 'prescription':
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center ring-4 ring-white shrink-0">
            <Pill size={18} className="text-primary" />
          </div>
        );
      case 'invoice':
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center ring-4 ring-white shrink-0">
            <CreditCard size={18} className="text-primary" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center ring-4 ring-white shrink-0">
            <Calendar size={18} className="text-primary" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-primary)] border border-outline-variant/30 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-on-surface">Recent Activity</h3>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all cursor-pointer"
              aria-label="Activity options"
            >
              <MoreVertical size={16} className="text-on-surface-variant" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-outline-variant/30 shadow-[var(--shadow-primary)] overflow-hidden z-10">
                <button
                  onClick={() => { setSortOrder('newest'); setShowMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-surface-container-low cursor-pointer ${sortOrder === 'newest' ? 'text-primary' : 'text-on-surface-variant'}`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => { setSortOrder('oldest'); setShowMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-surface-container-low cursor-pointer ${sortOrder === 'oldest' ? 'text-primary' : 'text-on-surface-variant'}`}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative space-y-6 before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[0.5px] before:bg-outline-variant/50">
          {sortedActivities.map((activity) => (
            <div key={activity.id} className="relative flex gap-4 z-10">
              {getIcon(activity.type)}
              <div>
                <p className="text-sm font-bold text-on-surface">{activity.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{activity.desc}</p>
                <p className="text-[10px] text-outline mt-1 font-semibold">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
