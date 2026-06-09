import { Check, Star } from 'lucide-react';

interface SidebarFiltersProps {
  selectedDepts: string[];
  onDeptToggle: (dept: string) => void;
  selectedAvailability: string;
  onAvailabilityChange: (avail: string) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  onClearAll: () => void;
  onUrgentCallClick: () => void;
}

export default function SidebarFilters({
  selectedDepts,
  onDeptToggle,
  selectedAvailability,
  onAvailabilityChange,
  minRating,
  onMinRatingChange,
  onClearAll,
  onUrgentCallClick
}: SidebarFiltersProps) {
  const depts: ('Cardiology' | 'Dermatology' | 'Neurology' | 'Pediatrics')[] = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics'
  ];

  const availabilities = [
    { id: 'all', label: 'Any Time' },
    { id: 'today', label: 'Today' },
    { id: 'next3days', label: 'Next 3 Days' },
    { id: 'thisweek', label: 'This Week' }
  ];

  return (
    <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
      <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-[var(--shadow-primary)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-on-surface">Filters</h2>
          <button
            onClick={onClearAll}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Department */}
          <div>
            <h3 className="text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Department</h3>
            <div className="flex flex-col gap-2.5">
              {depts.map(dept => {
                const checked = selectedDepts.includes(dept);
                return (
                  <label key={dept} className="flex items-center gap-3 group cursor-pointer select-none">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onDeptToggle(dept)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                        checked 
                          ? 'border-primary bg-primary text-white scale-102' 
                          : 'border-outline-variant group-hover:border-primary'
                      }`}>
                        {checked && <Check size={14} className="stroke-[3]" />}
                      </div>
                    </div>
                    <span className={`text-sm transition-colors ${
                      checked 
                        ? 'text-primary font-bold' 
                        : 'text-on-surface group-hover:text-primary'
                    }`}>
                      {dept}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Availability</h3>
            <div className="flex flex-col gap-2.5">
              {availabilities.map(avail => {
                const checked = selectedAvailability === avail.id;
                return (
                  <label key={avail.id} className="flex items-center gap-3 group cursor-pointer select-none">
                    <div className="relative flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={checked}
                        onChange={() => onAvailabilityChange(avail.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                        checked 
                          ? 'border-primary bg-primary scale-102' 
                          : 'border-outline-variant group-hover:border-outline'
                      }`}>
                        {checked && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className={`text-sm transition-colors ${
                      checked 
                        ? 'text-primary font-bold' 
                        : 'text-on-surface group-hover:text-primary'
                    }`}>
                      {avail.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Slider Rating */}
          <div>
            <h3 className="text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Min. Rating</h3>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={minRating}
              onChange={(e) => onMinRatingChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <div className="flex justify-between items-center mt-2 px-1 text-xs text-outline font-semibold">
              <span className="flex items-center gap-0.5">1.0 <Star size={10} className="fill-orange-400 stroke-transparent" /></span>
              <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">≥ {minRating.toFixed(1)}</span>
              <span className="flex items-center gap-0.5">5.0 <Star size={10} className="fill-orange-400 stroke-transparent" /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Care widget (Bento Style) */}
      <div 
        onClick={onUrgentCallClick}
        className="bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden group cursor-pointer shadow-[var(--shadow-primary)] select-none border border-white/10"
      >
        <div className="relative z-10 flex flex-col gap-2">
          <h3 className="text-xl font-bold tracking-tight">Urgent Care?</h3>
          <p className="text-xs text-on-primary/90 leading-normal max-w-[85%]">
            Get connected with a General Physician in less than 15 minutes.
          </p>
          <button 
            type="button"
            className="mt-4 bg-primary-container text-on-primary-container hover:brightness-105 text-xs font-bold px-4 py-2 rounded-full w-fit transition-all shadow-sm active:scale-95 duration-100 cursor-pointer"
          >
            Start Call Now
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
          <span className="text-[120px] font-thin leading-none">+</span>
        </div>
      </div>
    </aside>
  );
}
