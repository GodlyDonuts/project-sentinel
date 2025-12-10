import React from 'react';
import { Activity } from 'lucide-react';
import { ThreatMeter } from '../ThreatMeter';

interface ThreatLevelViewProps {
    score: number;
}

export const ThreatLevelView: React.FC<ThreatLevelViewProps> = ({ score }) => {
    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-4">
                <Activity className="text-sentinel-green" size={24} />
                <h2 className="text-2xl font-display font-bold text-white text-glow">THREAT LEVEL ANALYSIS</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Main Gauge */}
                <div className="bg-sentinel-card backdrop-blur-md border border-white/5 rounded-xl p-8 flex items-center justify-center hover:border-sentinel-green/30 transition-all duration-300">
                    <div className="w-full h-full max-h-[300px]">
                        <ThreatMeter threatScore={score} />
                    </div>
                </div>

                {/* Statistics / History (Mock for now) */}
                <div className="bg-sentinel-card backdrop-blur-md border border-white/5 rounded-xl p-8 flex flex-col gap-4 hover:border-sentinel-green/30 transition-all duration-300">
                    <h3 className="text-lg font-mono text-sentinel-green/80">SESSION STATISTICS</h3>

                    <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-sm text-gray-400">Peak Threat Score</span>
                            <span className="font-mono text-sentinel-red font-bold">{(score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-sm text-gray-400">Scams Detected</span>
                            <span className="font-mono text-white font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-sm text-gray-400">Safe Interactions</span>
                            <span className="font-mono text-sentinel-green font-bold">12</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-sm text-gray-400">Average Latency</span>
                            <span className="font-mono text-sentinel-green font-bold">45ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
