import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { EvidenceDetailModal } from './EvidenceDetailModal';
import { ForensicsGrid } from './evidence/ForensicsGrid';

interface EvidenceReport {
    filename: string;
    timestamp: string;
    type: 'high' | 'medium' | 'safe';
    title: string;
}

interface EvidenceLockerProps {
    variant?: 'full' | 'sidebar';
}

export const EvidenceLocker: React.FC<EvidenceLockerProps> = ({ variant = 'full' }) => {
    const [reports, setReports] = useState<EvidenceReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    // Mock data for display purposes if fetch fails or for initial state
    const MOCK_DATA: EvidenceReport[] = [
        { filename: 'ev_001', timestamp: new Date().toISOString(), type: 'high', title: 'Grandparent Scam Attempt' },
        { filename: 'ev_002', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'safe', title: 'Bank Inquiry' },
        { filename: 'ev_003', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'medium', title: 'Unknown Caller' },
    ];

    const fetchReports = async () => {
        setLoading(true);
        try {
            // Uncomment when API is ready:
            // const res = await fetch(`${import.meta.env.VITE_API_URL}/evidence`);
            // const data = await res.json();
            // setReports(data);

            // For now, use mock to make UI look good immediately
            setTimeout(() => {
                setReports(MOCK_DATA);
                setLoading(false);
            }, 800);
        } catch (e) {
            console.error("Failed to fetch evidence:", e);
            setReports([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // --- RENDER SIDEBAR VARIANT (The Fix) ---
    if (variant === 'sidebar') {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">RECENT_LOGS</span>
                    <RefreshCw
                        size={12}
                        className={`text-zinc-600 cursor-pointer hover:text-sentinel-green ${loading ? 'animate-spin' : ''}`}
                        onClick={fetchReports}
                    />
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
                    {reports.map((report, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedReport(report)}
                            className="group flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors border-l-2 border-transparent hover:border-sentinel-green"
                        >
                            {/* Icon Indicator */}
                            {report.type === 'high' && <AlertTriangle size={14} className="text-red-500 shrink-0" />}
                            {report.type === 'medium' && <AlertTriangle size={14} className="text-yellow-500 shrink-0" />}
                            {report.type === 'safe' && <CheckCircle size={14} className="text-zinc-600 group-hover:text-sentinel-green shrink-0" />}

                            <div className="overflow-hidden">
                                <div className="text-xs text-zinc-400 group-hover:text-white truncate font-mono">
                                    {report.title}
                                </div>
                                <div className="text-[10px] text-zinc-600 font-mono">
                                    {new Date(report.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {reports.length === 0 && !loading && (
                        <div className="text-[10px] text-zinc-700 text-center py-4">NO LOGS FOUND</div>
                    )}
                </div>

                {selectedReport && (
                    <EvidenceDetailModal
                        report={{ ...selectedReport, id: selectedReport.filename, transcript: [], analysis_log: [], status: selectedReport.type === 'high' ? 'THREAT' : 'SAFE' }}
                        onClose={() => setSelectedReport(null)}
                    />
                )}
            </div>
        );
    }

    // --- RENDER FULL VARIANT (Keep existing grid) ---
    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-widest">EVIDENCE LOCKER</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sentinel-green animate-pulse"></div>
                            <span className="text-[10px] font-mono text-sentinel-green/70 tracking-widest uppercase">Source: Raindrop SmartBuckets</span>
                        </div>
                    </div>
                    <button
                        onClick={fetchReports}
                        className="p-2 rounded-lg bg-sentinel-green/10 hover:bg-sentinel-green/20 text-sentinel-green transition-all"
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <ForensicsGrid reports={reports} onSelect={(report: any) => setSelectedReport(report)} />
                </div>
            </div>

            {selectedReport && (
                <EvidenceDetailModal
                    report={{ ...selectedReport, id: selectedReport.filename, transcript: [], analysis_log: [], status: selectedReport.type === 'high' ? 'THREAT' : 'SAFE' }}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </>
    );
};
