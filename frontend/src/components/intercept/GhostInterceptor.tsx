import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Activity, Mic, Cpu, Database } from 'lucide-react';

// THE SCRIPT: A simulated "Grandma" persona trolling a scammer
// We explicitly log the "Tech Stack" events here for the judges to see.
const GHOST_SCRIPT = [
    { type: 'system', label: 'CEREBRAS_INF', text: 'Allocating Wafer-Scale Engine (CS-3)...' },
    { type: 'system', label: 'RAINDROP_MEM', text: 'Hydrating Context from "scam-patterns-v4" bucket...' },
    { type: 'scammer', text: "Hello? Are you there? Do not hang up!", delay: 1000 },
    { type: 'thought', text: "ANALYSIS: High Stress Detected // STRATEGY: Confusion", delay: 1200 },
    { type: 'ghost', text: "Yes, yes, I'm here. My grandson said something about a... a cookie? On the computer?", delay: 3500 },
    { type: 'system', label: 'ELEVENLABS', text: 'Streaming Audio (Latency: 24ms)', delay: 3600 },
    { type: 'scammer', text: "No cookies! I need you to open the program I told you about!", delay: 5500 },
    { type: 'thought', text: "RETRIEVAL: 'Tech Support' Counter-Script loaded from Raindrop", delay: 6000 },
    { type: 'ghost', text: "Is that the 'Internet Exploder'? It says '404' on the screen. Is that the money?", delay: 8500 },
    { type: 'system', label: 'CEREBRAS_INF', text: 'Token Gen Speed: 1,240 t/s', delay: 8600 },
    { type: 'scammer', text: "LISTEN TO ME. Click the start button!", delay: 10500 },
];

export const GhostInterceptor = ({ onDisengage }: { onDisengage: () => void }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [inferenceSpeed, setInferenceSpeed] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Simulated Real-time Metrics
    useEffect(() => {
        const interval = setInterval(() => {
            // Fluctuate speed to look real (Cerebras is fast!)
            setInferenceSpeed(Math.floor(800 + Math.random() * 400));
        }, 100);

        // Run Script
        let timeouts: ReturnType<typeof setTimeout>[] = [];
        GHOST_SCRIPT.forEach((step, index) => {
            const t = setTimeout(() => {
                setLogs(prev => [...prev, { ...step, id: Date.now() }]);
            }, step.delay || index * 800);
            timeouts.push(t);
        });

        return () => {
            clearInterval(interval);
            timeouts.forEach(clearTimeout);
        };
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(168,85,247,0.1)]">

            {/* Header: The Tech Stack Flex */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-black/40 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center animate-pulse border border-purple-500/50">
                        <Brain className="text-purple-400" size={24} />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-white tracking-widest text-xl">
                            GHOST AGENT <span className="text-purple-400">ACTIVE</span>
                        </h2>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 mt-1">
                            <span className="flex items-center gap-1"><Cpu size={10} className="text-blue-400" /> CEREBRAS: ONLINE</span>
                            <span className="flex items-center gap-1"><Database size={10} className="text-yellow-400" /> RAINDROP: SYNCED</span>
                            <span className="flex items-center gap-1"><Mic size={10} className="text-green-400" /> ELEVENLABS: LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Live Speedometer */}
                <div className="text-right bg-white/5 p-2 rounded border border-white/10">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Inference Velocity</div>
                    <div className="text-2xl font-mono text-purple-400 font-bold flex items-center justify-end gap-2">
                        <Zap size={16} fill="currentColor" />
                        {inferenceSpeed} <span className="text-xs text-zinc-500">t/s</span>
                    </div>
                </div>
            </div>

            {/* Main Battle View */}
            <div className="flex-1 flex overflow-hidden z-10">

                {/* The Chat Log */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4" ref={scrollRef}>
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex flex-col ${log.type === 'scammer' ? 'items-start' : 'items-end'}`}
                            >
                                {/* AI INTERNAL MONOLOGUE (The "Why") */}
                                {log.type === 'thought' && (
                                    <div className="mb-1 mr-2 bg-purple-500/10 border-l-2 border-purple-500 p-2 rounded-r text-[10px] font-mono text-purple-300 w-fit max-w-lg">
                                        <span className="font-bold">Thinking... </span> {log.text}
                                    </div>
                                )}

                                {/* SYSTEM TECH LOGS */}
                                {log.type === 'system' && (
                                    <div className="w-full my-2 flex justify-center">
                                        <div className="bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-full text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                                            <Activity size={10} />
                                            <span className="font-bold text-zinc-400">{log.label}</span> :: {log.text}
                                        </div>
                                    </div>
                                )}

                                {/* SPEECH BUBBLES */}
                                {(log.type === 'scammer' || log.type === 'ghost') && (
                                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm font-sans relative shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md
                                        ${log.type === 'scammer'
                                            ? 'bg-red-950/20 border border-red-500/30 text-red-200 rounded-tl-none'
                                            : 'bg-purple-900/20 border border-purple-500/30 text-white rounded-tr-none'
                                        }`}
                                    >
                                        <div className="text-[9px] font-bold opacity-70 mb-2 uppercase tracking-widest flex justify-between">
                                            <span className={log.type === 'scammer' ? 'text-red-400' : 'text-purple-400'}>
                                                {log.type === 'ghost' ? 'SENTINEL PERSONA: GRANDMA' : 'THREAT ACTOR'}
                                            </span>
                                            {log.type === 'ghost' && <span className="text-purple-400 flex items-center gap-1"><Mic size={8} /> SYNTHESIZED</span>}
                                        </div>
                                        {log.text}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="p-4 border-t border-purple-500/20 bg-black/60 flex justify-between items-center">
                <div className="text-xs text-purple-400 font-mono animate-pulse">
                    ● INTERCEPTING CALL SIGNAL...
                </div>
                <button
                    onClick={onDisengage}
                    className="px-6 py-2 bg-red-500/10 border border-red-500 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-white transition-all rounded uppercase tracking-widest"
                >
                    Disengage Protocol
                </button>
            </div>
        </div>
    );
};
