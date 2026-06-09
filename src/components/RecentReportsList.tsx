import { FileText, Heart, Eye, Download, Info, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { MedicalReport } from '../types';

interface RecentReportsListProps {
  reports: MedicalReport[];
  onViewAllClick: () => void;
}

export default function RecentReportsList({ reports, onViewAllClick }: RecentReportsListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const triggerDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // Nice browser simulation notice
      alert(`Downloaded report: "${name}" successfully.`);
    }, 1200);
  };

  // Icon selector based on category
  const renderIcon = (category: string) => {
    switch (category) {
      case 'Blood Test':
        return (
          <div className="w-10 h-10 rounded bg-error-container/20 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-error" />
          </div>
        );
      case 'X-Ray':
      case 'MRI':
        return (
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <Heart size={18} className="text-primary" />
          </div>
        );
      case 'Ophthalmology':
        return (
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <Eye size={18} className="text-primary" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-gray-500" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-primary)] border border-outline-variant/30 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-on-surface">Recent Reports</h3>
          <button
            onClick={onViewAllClick}
            className="text-sm font-semibold text-primary hover:underline cursor-pointer"
          >
            With History
          </button>
        </div>

        <div className="space-y-2">
          {reports.slice(0, 3).map((report) => {
            const isPending = report.status === 'Pending';
            return (
              <div
                key={report.id}
                className="p-3 bg-white hover:bg-surface-container rounded-lg border border-transparent hover:border-outline-variant/30 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {renderIcon(report.category)}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{report.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {report.orderedBy} • {report.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPending ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-warning text-on-warning rounded uppercase flex items-center gap-1">
                      <AlertCircle size={10} />
                      Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => triggerDownload(report.id, report.name)}
                      disabled={downloadingId !== null}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer active:scale-90"
                      title="Download PDF"
                    >
                      {downloadingId === report.id ? (
                        <span className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full block" />
                      ) : (
                        <Download size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
