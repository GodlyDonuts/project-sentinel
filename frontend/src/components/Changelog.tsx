import React, { useEffect, useState } from 'react';
import { Shield, GitCommit } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

interface ChangeLogItem {
    id: string;
    version: string;
    date: string;
    title: string;
    changes: string[];
    type: 'major' | 'minor' | 'patch';
}

const mockChangelog: ChangeLogItem[] = [
    {
        id: '1',
        version: 'v1.2.0',
        date: '2025-12-11',
        title: 'Operation: Cinematic OS',
        type: 'major',
        changes: [
            'Implemented "Ghost Mode" for stealth agent operations.',
            'Overhauled the World Globe with real-time threat visualization.',
            'Implemented "Cinematic OS" HUD with noise grain and scanlines.',
            'Added persistent threat memory module using Raindrop SmartBuckets.',
            'Integrated Vultr WebSocket Edge for sub-50ms latency.'
        ]
    },
    {
        id: '2',
        version: 'v1.1.5',
        date: '2025-12-10',
        title: 'Visual Clarity Update',
        type: 'minor',
        changes: [
            'Removed HUD scan-line artifact for cleaner visuals.',
            'Stabilized Globe rotation during threat events.',
            'Added user profile integration in HUD.',
            'Enhanced premium user detection logic.'
        ]
    },
    {
        id: '3',
        version: 'v1.0.0',
        date: '2025-12-08',
        title: 'Project Sentinel Initial Launch',
        type: 'major',
        changes: [
            'Initial release of Sentinel Audio Guardian.',
            'Real-time speech-to-text pipeline enabled.',
            'Basic threat detection patterns active.',
            'Deepgram & Cerebras integration online.'
        ]
    }
];

export const Changelog: React.FC = () => {
    // const navigate = useNavigate();
    const [visibleItems, setVisibleItems] = useState<string[]>([]);

    useEffect(() => {
        // Staggered animation for list items
        mockChangelog.forEach((item, index) => {
            setTimeout(() => {
                setVisibleItems(prev => [...prev, item.id]);
            }, index * 200 + 300);
        });
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-sentinel-green selection:text-black overflow-x-hidden relative">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 z-0" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">

                {/* Header */}
                <div className="flex items-center justify-between mb-16 animate-fade-in-up">
                    <div className="flex items-center gap-4">
                        <Shield className="text-sentinel-green" size={32} />
                        <div>
                            <h1 className="font-display font-bold text-3xl tracking-[0.2em] text-white">
                                SYSTEM LOGS
                            </h1>
                            <p className="text-xs font-mono text-sentinel-green/60 tracking-widest mt-1">
                                DEVELOPMENT HISTORY // CLASSIFIED
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-12 relative border-l border-white/10 ml-4 md:ml-0 pl-8 md:pl-0">

                    {mockChangelog.map((item) => (
                        <div
                            key={item.id}
                            className={`relative md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-start transition-all duration-700 ${visibleItems.includes(item.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                        >

                            {/* Left Side (Date & Version) - Desktop */}
                            <div className="hidden md:flex flex-col items-end pt-1">
                                <span className="font-mono text-sentinel-green text-sm tracking-wider">{item.date}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded mt-2 border ${item.type === 'major' ? 'border-sentinel-green text-sentinel-green bg-sentinel-green/10' :
                                    item.type === 'minor' ? 'border-blue-500 text-blue-400 bg-blue-500/10' :
                                        'border-white/30 text-white/50'
                                    }`}>
                                    {item.version}
                                </span>
                            </div>

                            {/* Timeline Node */}
                            <div className="absolute left-[-37px] md:relative md:left-auto flex justify-center pt-2">
                                <div className={`w-4 h-4 rounded-full border-2 bg-[#050505] z-10 ${item.type === 'major' ? 'border-sentinel-green shadow-[0_0_10px_rgba(0,255,65,0.5)]' : 'border-white/20'
                                    }`} />
                            </div>

                            {/* Content Card */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:border-white/20 transition-colors group">
                                <div className="md:hidden flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                    <span className="font-mono text-sentinel-green text-xs">{item.date}</span>
                                    <span className="text-xs font-mono text-white/40">{item.version}</span>
                                </div>

                                <h3 className="font-bold text-xl text-white mb-1 group-hover:text-sentinel-green transition-colors">
                                    {item.title}
                                </h3>
                                <ul className="space-y-3 mt-4">
                                    {item.changes.map((change, i) => (
                                        <li key={i} className="text-white/70 text-sm flex items-start gap-3">
                                            <GitCommit size={14} className="mt-1 text-white/30 flex-shrink-0" />
                                            <span className="leading-relaxed">{change}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};
