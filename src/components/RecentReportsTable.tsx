import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, HelpCircle, Calendar, Download, Search, Info, X, MapPin, TrendingUp
} from 'lucide-react';
import { MedicalReport, Prescription } from '../types';
import { parseReportDate } from '../utils/dates';

interface RecentReportsTableProps {
  initialReports: MedicalReport[];
  initialPrescriptions: Prescription[];
  onBookReviewCall: () => void;
}

export default function RecentReportsTable({ 
  initialReports, 
  initialPrescriptions,
  onBookReviewCall
}: RecentReportsTableProps) {
  const [reports] = useState<MedicalReport[]>(initialReports);
  const [prescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('6months');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [refillingId, setRefillingId] = useState<string | null>(null);
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);

  const matchesTimeframe = (reportDate: string): boolean => {
    const parsed = parseReportDate(reportDate);
    if (!parsed) return true;

    const now = new Date();
    const cutoff = new Date(now);

    if (timeframe === 'recent') {
      cutoff.setDate(cutoff.getDate() - 30);
    } else if (timeframe === '6months') {
      cutoff.setMonth(cutoff.getMonth() - 6);
    } else {
      return true;
    }

    return parsed >= cutoff;
  };

  const filteredReports = reports.filter(report => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = report.name.toLowerCase().includes(query) || 
                          report.orderedBy.toLowerCase().includes(query);
    return matchesSearch && matchesTimeframe(report.date);
  });

  const triggerDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Downloaded digital dossier: "${name}" as PDF successfully.`);
    }, 1000);
  };

  const triggerRefill = (id: string, name: string) => {
    setRefillingId(id);
    setTimeout(() => {
      setRefillingId(null);
      alert(`Refill request submitted into HealPortal Pharmacy for "${name}". They will notify you shortly.`);
    }, 1200);
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Reports &amp; History</h1>
          <p className="text-sm text-on-surface-variant mt-1.5">
            Access your lab results, imaging, and medication history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[280px] group">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports or doctors"
              className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-sm shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 bg-white border border-outline-variant rounded-lg px-4 py-2 shadow-sm">
            <Calendar size={16} className="text-outline shrink-0" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-on-surface-variant focus:outline-none cursor-pointer"
            >
              <option value="6months">Last 6 Months</option>
              <option value="recent">Last 30 Days</option>
              <option value="all">All-Time Records</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <section className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[var(--shadow-primary)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">Diagnostic Results</h2>
              <span className="text-xs text-outline font-bold bg-surface-container px-3 py-1 rounded-full">
                {filteredReports.length} results found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/40">
                    <th className="text-left py-3.5 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Test Name</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ordered By</th>
                    <th className="text-left py-3.5 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="text-right py-3.5 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                      const isPending = report.status === 'Pending';
                      return (
                        <tr key={report.id} className="hover:bg-surface-container-low/50 transition-colors duration-150">
                          <td className="py-4 px-4 text-xs text-on-surface-variant font-semibold">{report.date}</td>
                          <td className="py-4 px-4 text-sm font-bold text-on-surface">{report.name}</td>
                          <td className="py-4 px-4 text-xs text-on-surface-variant font-medium">{report.orderedBy}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              isPending
                                ? 'bg-warning text-on-warning'
                                : 'bg-success text-on-success'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {isPending ? (
                              <button disabled className="p-2 text-outline/40 cursor-not-allowed">
                                <Download size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => triggerDownload(report.id, report.name)}
                                disabled={downloadingId !== null}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer active:scale-90 inline-flex items-center justify-center"
                              >
                                {downloadingId === report.id ? (
                                  <span className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full block" />
                                ) : (
                                  <Download size={16} />
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm font-medium text-on-surface-variant italic">
                        No report records matching current parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[var(--shadow-primary)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">Active Medical Prescriptions</h2>
              <button
                onClick={() => setShowPharmacyModal(true)}
                className="text-xs text-primary font-bold cursor-pointer hover:underline"
              >
                Pharmacy Map Guidance
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((p) => (
                <div 
                  key={p.id} 
                  className="p-4 rounded-xl border border-outline-variant/50 hover:border-primary/40 transition-all bg-surface-container-low/20 group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{p.dosage}</p>
                    </div>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0">
                      Rx Card
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/30">
                    <span className="text-[10px] text-outline font-bold">Expires: {p.expires}</span>
                    <button
                      onClick={() => triggerRefill(p.id, p.name)}
                      disabled={refillingId !== null}
                      className="text-xs font-extrabold text-primary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {refillingId === p.id ? (
                        <span className="w-3 h-3 border border-primary border-t-transparent animate-spin rounded-full block" />
                      ) : (
                        <span>Request Refill</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <section className="bg-primary text-on-primary rounded-xl p-6 shadow-[var(--shadow-primary)] relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="text-lg font-bold">Health Score</h3>
              <div className="flex items-end gap-1 mt-1 mb-4">
                <span className="text-5xl font-black leading-none">84</span>
                <span className="text-xs font-semibold mb-1 opacity-80 uppercase tracking-widest">/ 100</span>
              </div>
              <p className="text-xs text-white/95 leading-normal opacity-90 font-medium">
                Your recovery is trending 12% higher than last month. Consistent cardiac workouts and medical adherence has completely optimized your diagnostic outputs!
              </p>
            </div>
            
            <button
              onClick={() => setShowTrendsModal(true)}
              className="w-full py-2.5 mt-8 bg-primary-container hover:brightness-105 text-on-primary-container text-xs font-bold rounded-lg transition-all active:scale-97 cursor-pointer block text-center shadow-sm"
            >
              View Analytical Trends
            </button>

            <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none">
              <span className="text-[120px] font-bold">📊</span>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[var(--shadow-primary)]">
            <h3 className="text-base font-bold text-on-surface mb-4">Imaging Samples</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-primary border border-outline-variant/30 rounded-lg overflow-hidden relative group">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxWZJMrEH7c58pNVL4YH4TzA4lVsRgw3bSDHwjRoTtG1U9_06YArUdyCOlhqKdFw0RGHyfA_9mebhLGxbvxJmJPM8yfmI3bbZClEPHN8XEwRJZgQ2iZp6ZPr2_VZxHbh846ucYaOvqSrW4uN3CKwxLXBGOztMRDYQ9nipQfMZzY48UHA51VwqKpaECDrWA9EiOg2VhICNOE9bOLQ4Kyeks0-b2AiwgsrQrFwa7ujLaGMcw87vnRTCduDV6bexPdhG7qL_2QeNiRnf" 
                  alt="Chest X-Ray" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="aspect-square bg-primary border border-outline-variant/30 rounded-lg overflow-hidden relative group">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp5wploB_sWSl1YBIqz0Own8G4vkEc5zs2uMM6SSV6SnF8VpakQkCDfS2--EXOu5UFfl7cOeMXXDuuVRQPhGZRVgZSK1yKqzR5W3U-EiCY9V3m5HLZ4KejWRW2O8vXHUT4QkWOqdWllBMUoFVGiCssRvFnGoHNUb16unkOpWDUJEPYCLGUhDXfp_0cxjfgV_c5KC_OgfLPRd5fyjxs_wqcxX2GpVTTu2Xuvye-XJCohtq6WXo4toDlPQbUqM-kFl8Har2QvMqhGK1L" 
                  alt="Brain MRI" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-on-surface-variant font-medium mt-4">
              <Info size={14} className="text-outline shrink-0 mt-0.5" />
              <span>Digital diagnostic records are preserved secure in HealPortal storage for 5 years.</span>
            </div>
          </section>

          <section className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/20 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <HelpCircle size={18} className="stroke-[2.5]" />
              </div>
              <h3 className="text-sm font-bold text-on-surface">Understanding Results</h3>
            </div>
            
            <p className="text-xs text-on-surface-variant leading-normal font-medium">
              Need professional advice interpreting dynamic blood boundaries or MRI imaging scans? Schedule an official diagnostics review call.
            </p>
            
            <button
              onClick={onBookReviewCall}
              className="w-full py-2 bg-transparent border border-primary text-primary hover:bg-primary/5 text-xs font-bold rounded-lg transition-all active:scale-97 cursor-pointer text-center"
            >
              Book Quick Review Call
            </button>
          </section>

        </div>

      </div>

      {/* Analytical Trends Modal */}
      <AnimatePresence>
        {showTrendsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowTrendsModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-container-high transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={24} className="text-primary" />
                <h3 className="text-xl font-bold">Health Trends</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-success rounded-lg">
                  <p className="text-xs font-bold text-on-success uppercase">Cardiovascular</p>
                  <p className="text-2xl font-black text-on-success mt-1">↑ 12%</p>
                  <p className="text-xs text-on-success/80 mt-1">Improved from last month</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-lg">
                  <p className="text-xs font-bold text-on-surface-variant uppercase">Blood Pressure</p>
                  <p className="text-2xl font-black text-primary mt-1">118/76</p>
                  <p className="text-xs text-on-surface-variant mt-1">Within normal range</p>
                </div>
                <div className="p-4 bg-warning rounded-lg">
                  <p className="text-xs font-bold text-on-warning uppercase">Cholesterol</p>
                  <p className="text-2xl font-black text-on-warning mt-1">↓ 3%</p>
                  <p className="text-xs text-on-warning/80 mt-1">Slight improvement needed</p>
                </div>
              </div>
              <button
                onClick={() => setShowTrendsModal(false)}
                className="w-full mt-6 py-2.5 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-105 cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pharmacy Map Modal */}
      <AnimatePresence>
        {showPharmacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowPharmacyModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-container-high transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={24} className="text-primary" />
                <h3 className="text-xl font-bold">Pharmacy Locations</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'HealPortal Main Pharmacy', address: 'Main Wing, Ground Floor', hours: 'Mon–Sat 8AM–8PM' },
                  { name: 'North Wing Pharmacy', address: 'North Wing, Level 1', hours: 'Mon–Fri 9AM–6PM' },
                  { name: 'Express Pickup Counter', address: 'East Entrance Lobby', hours: 'Daily 7AM–10PM' },
                ].map((pharmacy) => (
                  <div key={pharmacy.name} className="p-4 border border-outline-variant/40 rounded-lg hover:border-primary/40 transition-colors">
                    <p className="font-bold text-sm text-on-surface">{pharmacy.name}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{pharmacy.address}</p>
                    <p className="text-xs text-primary font-semibold mt-1">{pharmacy.hours}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowPharmacyModal(false)}
                className="w-full mt-6 py-2.5 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-105 cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
