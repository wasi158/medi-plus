import { motion } from 'motion/react';
import { Hourglass, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { QueueToken } from '../types';

interface QueueWidgetProps {
  initialToken: QueueToken;
}

export default function QueueWidget({ initialToken }: QueueWidgetProps) {
  const [token, setToken] = useState<QueueToken>(initialToken);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simple simulator: randomly updates are simulated on click
  const simulateUpdate = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setToken(prev => {
        const nextMin = Math.max(2, prev.estimatedWaitMinutes - 1);
        const nextProgress = Math.min(100, prev.progressPercentage + 5);
        return {
          ...prev,
          estimatedWaitMinutes: nextMin,
          progressPercentage: nextProgress
        };
      });
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-primary)] border border-outline-variant/30 flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Live Status</span>
          <h3 className="text-lg font-bold text-on-surface mt-0.5">Current Token</h3>
        </div>
        <button
          onClick={simulateUpdate}
          disabled={isRefreshing}
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer active:scale-95 text-primary"
          title="Simulate live updates"
        >
          <Hourglass size={18} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="text-center py-4">
        <motion.div 
          key={token.estimatedWaitMinutes}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-extrabold text-primary leading-none"
        >
          {token.tokenNumber}
        </motion.div>
        <p className="text-sm text-on-surface-variant mt-3 font-medium">
          Estimated wait: <span className="font-bold text-on-surface text-base">{token.estimatedWaitMinutes} mins</span>
        </p>
      </div>

      <div className="mt-4">
        <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: `${token.progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-primary h-full rounded-full" 
          />
        </div>
        <div className="flex justify-between items-center mt-2.5">
          <p className="text-[12px] font-semibold text-on-surface-variant text-center w-full">
            {token.activeDoctor} ({token.department})
          </p>
        </div>
      </div>
    </div>
  );
}
