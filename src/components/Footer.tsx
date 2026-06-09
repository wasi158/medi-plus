import { useState } from 'react';
import { X } from 'lucide-react';

interface FooterProps {
  onScreenChange: (screen: string) => void;
}

const LEGAL_CONTENT: Record<string, { title: string; body: string }> = {
  privacy: {
    title: 'Privacy Policy',
    body: 'HealPortal protects your medical data with end-to-end encryption. We never share personal health information with third parties without your explicit consent.',
  },
  terms: {
    title: 'Terms of Service',
    body: 'By using HealPortal, you agree to our platform guidelines for appointment booking, report access, and tele-consultation services.',
  },
  help: {
    title: 'Help Center',
    body: 'Browse FAQs, video guides, and step-by-step tutorials for booking appointments, downloading reports, and managing prescriptions.',
  },
  support: {
    title: 'Contact Support',
    body: 'Reach our support team at support@healportal.com or call +1 (800) 555-HEAL. Available Mon–Fri 8AM–6PM.',
  },
};

export default function Footer({ onScreenChange }: FooterProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleLinkClick = (key: string, e: { preventDefault: () => void }) => {
    e.preventDefault();
    setActiveModal(key);
  };

  return (
    <>
      <footer className="w-full py-6 mt-auto bg-white border-t border-outline-variant/30 text-on-surface-variant text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 max-w-7xl mx-auto gap-4 w-full">
          <div className="flex flex-col md:items-start items-center gap-1">
            <span 
              className="font-bold text-lg text-primary cursor-pointer hover:opacity-95"
              onClick={() => onScreenChange('home')}
            >
              HealPortal
            </span>
            <p>© 2026 HealPortal Medical Systems. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(LEGAL_CONTENT).map(([key, { title }]) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={(e) => handleLinkClick(key, e)}
                className="hover:text-primary transition-colors hover:underline cursor-pointer"
              >
                {title}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {activeModal && LEGAL_CONTENT[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-on-surface mb-4">{LEGAL_CONTENT[activeModal].title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{LEGAL_CONTENT[activeModal].body}</p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-2.5 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-105 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
