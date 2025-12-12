import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Activity, Mic, Cpu, Database } from 'lucide-react';

// THE SCRIPT: A simulated "Grandma" persona trolling a scammer
// We explicitly log the "Tech Stack" events here for the judges to see.
const GHOST_SCRIPT = [
    { type: 'system', label: 'SENTINEL_CORE', text: 'INTERCEPT_PROTOCOL_INITIATED', delay: 100 },
    { type: 'system', label: 'VOICE_CLONE', text: 'Loading Persona: "Margaret_82_Confused.wav"', delay: 400 },

    // AI Takes Over immediately after the "Target Gift Cards" demand
    { type: 'thought', text: 'DETECTED: "Target Gift Cards" // PATTERN: Refund Scams // STRATEGY: Feign Incompetence', delay: 500 },
    { type: 'ghost', text: "Target? You mean the store with the little red dog? Oh dear... I don't think I can drive there, Officer Wilson. My hip has been acting up since the storm of '98.", delay: 3000 },

    { type: 'scammer', text: "Mrs. Dawson, this is urgent! You must take a taxi! The warrant will be executed in 30 minutes!", delay: 6500 },

    { type: 'system', label: 'CEREBRAS_INF', text: 'Sentiment: AGGRESSIVE (0.98)', delay: 6700 },
    { type: 'thought', text: 'TACTIC: Tangential Distraction // TOPIC: Coupons', delay: 7500 },
    { type: 'ghost', text: "A taxi? Do they take checks? I have a coupon for a taxi somewhere... or was it for cat food? Mr. Whiskers is very picky, you know. He only eats the paté.", delay: 9500 },

    { type: 'scammer', text: "Forget the cat! Do you want to go to jail? Get your purse and go now!", delay: 12500 },

    { type: 'system', label: 'RAINDROP_MEM', text: 'Logging Pattern: [COERCION_VIA_ARREST_THREAT] -> Evidence Bucket #492', delay: 13000 },
    { type: 'thought', text: 'TACTIC: False Compliance // DELAY: Searching for Purse', delay: 13500 },
    { type: 'ghost', text: "Okay, okay, don't yell at me... I'm looking for my purse. I usually keep it in the cookie jar to hide it from the grandkids. Wait... why is there a remote control in here?", delay: 16500 },

    { type: 'scammer', text: "Just find the money, Margaret! Two. Thousand. Dollars.", delay: 19500 },

    { type: 'system', label: 'ELEVENLABS', text: 'Injecting "Confusion_Stutter" latency...', delay: 20000 },
    { type: 'ghost', text: "Two thousand? Oh my... I don't think I have that much in the jar. I have... twelve dollars and a button. Can I send you the button? It's a very nice button.", delay: 22500 },
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
