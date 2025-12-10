import React from 'react';
import { HoloCard } from '../ui/HoloCard';
import { FileText, AlertTriangle, AlertOctagon, ShieldCheck } from 'lucide-react';

interface EvidenceReport {
    filename: string;
    timestamp: string;
    type: 'high' | 'medium' | 'safe';
    title: string;
}

interface ForensicsGridProps {
    reports: EvidenceReport[];
    onSelect: (filename: string) => void;
}

export const ForensicsGrid: React.FC<ForensicsGridProps> = ({ reports, onSelect }) => {

    const getIcon = (type: string) => {
        switch (type) {
            case 'high': return <AlertOctagon size={24} className="text-sentinel-red drop-shadow-neon-red" />;
            case 'medium': return <AlertTriangle size={24} className="text-yellow-500" />;
            case 'safe': return <ShieldCheck size={24} className="text-sentinel-green drop-shadow-neon-green" />;
            default: return <FileText size={24} className="text-sentinel-green/50" />;
        }
    };

    const getBorderColor = (type: string) => {
        switch (type) {
            case 'high': return 'border-sentinel-red/50 bg-sentinel-red/5 hover:bg-sentinel-red/10';
            case 'medium': return 'border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10';
            case 'safe': return 'border-sentinel-green/30 bg-sentinel-green/5 hover:bg-sentinel-green/10';
            default: return 'border-white/10 bg-white/5';
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
            {reports.map((report, idx) => (
                <HoloCard
                    key={idx}
                    onClick={() => onSelect(report.filename)}
                    className={`
                        aspect-[4/3] rounded-xl border p-4 flex flex-col justify-between 
                        ${getBorderColor(report.type)}
                        backdrop-blur-md group
                    `}
                >
                    <div className="flex justify-between items-start">
                        {/* Holographic "Folder" Tab look */}
                        <div className="text-[10px] font-mono tracking-widest opacity-60 uppercase">
                            EVIDENCE_#{idx + 1000}
                        </div>
                        {getIcon(report.type)}
                    </div>

                    <div>
                        <div className="text-sm font-bold font-display tracking-wide mb-1 line-clamp-2 text-white group-hover:text-glow transition-all">
                            {report.title}
                        </div>
                        <div className="text-[10px] font-mono opacity-50">
                            {new Date(report.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                </HoloCard>
            ))}
        </div>
    );
};
