import React from 'react';
import { X, ShieldAlert, ShieldCheck, FileText } from 'lucide-react';

interface AnalysisEntry {
    is_threat: boolean;
    reason: string;
    confidence: number;
}

interface EvidenceReportDetail {
    id: string;
    timestamp: string;
    transcript: string[];
    analysis_log: AnalysisEntry[];
    status: 'SAFE' | 'THREAT';
}

interface EvidenceDetailModalProps {
    report: EvidenceReportDetail;
    onClose: () => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({ report, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-green-500/30 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[0_0_30px_rgba(0,255,0,0.1)]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-green-500/20 bg-black/40 relative overflow-hidden">
                    {/* Classified Stamp */}
                    <div className="absolute top-2 right-16 rotate-[-15deg] border-4 border-red-500/50 text-red-500/50 font-black text-4xl p-2 opacity-0 animate-stamp pointer-events-none z-0">
                        CLASSIFIED
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 rounded-full bg-green-500/10">
                            <FileText size={20} className="text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-mono font-bold text-green-400">EVIDENCE LOG #{report.id.slice(0, 8)}</h3>
                            <p className="text-xs text-green-500/60 font-mono">{new Date(report.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white relative z-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Status Banner */}
                    <div className={`flex items-center gap-3 p-4 rounded-lg border ${report.status === 'THREAT'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-green-500/10 border-green-500/30 text-green-400'
                        }`}>
                        {report.status === 'THREAT' ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                        <div>
                            <div className="font-bold tracking-wider">STATUS: {report.status}</div>
                            <div className="text-sm opacity-80">
                                {report.status === 'THREAT'
                                    ? 'Fraudulent activity patterns were detected during this session.'
                                    : 'No significant threats were detected during this session.'}
                            </div>
                        </div>
                    </div>

                    {/* Transcript & Analysis */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Transcript Analysis</h4>

                        {report.transcript.map((text, index) => {
                            const analysis = report.analysis_log[index];
                            const isThreat = analysis?.is_threat;

                            return (
                                <div key={index} className="group relative pl-4 border-l-2 border-gray-800 hover:border-green-500/50 transition-colors">
                                    {/* Timeline dot */}
                                    <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${isThreat ? 'bg-red-500' : 'bg-gray-600'}`} />

                                    <div className="mb-1 text-gray-300 font-mono text-sm bg-white/5 p-3 rounded-r-lg rounded-bl-lg">
                                        "{text}"
                                    </div>

                                    {analysis && (
                                        <div className={`text-xs font-mono mt-1 ${isThreat ? 'text-red-400' : 'text-green-500/50'}`}>
                                            {isThreat ? `⚠️ THREAT DETECTED: ${analysis.reason}` : `✓ Analyzed: Safe`}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-green-500/20 bg-black/40 text-center">
                    <p className="text-[10px] text-gray-600 font-mono">
                        CONFIDENTIAL // SENTINEL AI AUTOMATED REPORT
                    </p>
                </div>
            </div>
        </div>
    );
};
