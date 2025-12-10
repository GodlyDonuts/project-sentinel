import { useState } from 'react';
import { Play, Pause, AlertTriangle, CheckCircle } from 'lucide-react';

const SAMPLES = [
    { id: 1, label: "Bank Security (Safe)", type: "safe", duration: "0:12" },
    { id: 2, label: "IRS Urgent (Threat)", type: "threat", duration: "0:08" },
];

export const ThreatLabDemo = () => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<'safe' | 'threat' | null>(null);

    const handlePlay = (id: number, type: string) => {
        setActiveId(id);
        setScanning(true);
        setResult(null);

        // Simulate Analysis
        setTimeout(() => {
            setScanning(false);
            setResult(type as any);
        }, 2000);
    };

    return (
        <section className="py-24 px-6 max-w-5xl mx-auto">
            <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 text-white/10 pointer-events-none">
                    <AlertTriangle size={200} />
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-display font-bold mb-6 text-white">Threat Lab <span className="text-sentinel-green text-sm align-middle ml-2 px-2 py-1 border border-sentinel-green/30 rounded font-mono">LIVE DEMO</span></h2>
                        <p className="text-gray-400 mb-8">Test the Sentinel engine against real-world audio samples directly in your browser.</p>

                        <div className="space-y-4">
                            {SAMPLES.map((sample) => (
                                <div key={sample.id}
                                    onClick={() => handlePlay(sample.id, sample.type)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                                        ${activeId === sample.id ? 'border-sentinel-green bg-sentinel-green/5' : 'border-white/10 hover:border-white/30 bg-white/5'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeId === sample.id ? 'bg-sentinel-green text-black' : 'bg-black border border-white/20'}`}>
                                            {activeId === sample.id ? <Pause size={16} /> : <Play size={16} className="text-white" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{sample.label}</div>
                                            <div className="text-xs text-gray-500 font-mono">wav • 44.1kHz • {sample.duration}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/80 rounded-xl border border-white/10 p-6 font-mono text-sm relative min-h-[300px] flex flex-col">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                            <span className="text-gray-500">TERMINAL_OUTPUT</span>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 font-mono">
                            <div className="text-gray-500">{'>'} System Initialized...</div>
                            {activeId && <div className="text-blue-400">{'>'} Receiving Audio Stream...</div>}
                            {scanning && (
                                <>
                                    <div className="text-yellow-400">{'>'} Analyzing Patterns (Cerebras)...</div>
                                    <div className="text-gray-500">{'>'} Context: Financial Request</div>
                                    <div className="text-gray-500 animate-pulse">{'>'} Calculating Risk Score...</div>
                                </>
                            )}
                            {result === 'threat' && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-500">
                                    <div className="font-bold flex items-center gap-2"><AlertTriangle size={16} /> THREAT DETECTED</div>
                                    <div className="text-xs mt-1">Confidence: 98.4% // Reason: Urgent Funds Transfer</div>
                                </div>
                            )}
                            {result === 'safe' && (
                                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded text-sentinel-green">
                                    <div className="font-bold flex items-center gap-2"><CheckCircle size={16} /> VERIFIED SAFE</div>
                                    <div className="text-xs mt-1">Confidence: 99.1% // Context: Routine Inquiry</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
