import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, ShieldAlert } from 'lucide-react';
import './AlertSystem.css';

interface AlertSystemProps {
    threatScore: number;
    isPremium: boolean;
    onEngageGhost: () => void;
    onUpgrade: () => void;
    onDismiss: () => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({
    threatScore,
    isPremium,
    onEngageGhost,
    onUpgrade,
    onDismiss
}) => {
    // Force true for demo purposes if score is high
    const isThreat = threatScore > 0.7;

    return (
        <AnimatePresence>
            {isThreat && (
                <motion.div
                    className="alert-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Intense Red Vignette Pulse */}
                    <motion.div
                        className="vignette"
                        animate={{ boxShadow: ["inset 0 0 50px red", "inset 0 0 150px red", "inset 0 0 50px red"] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />

                    <div className="alert-content">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="alert-box relative overflow-hidden"
                        >
                            {/* Background Warning Stripes */}
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,0,0.05)_10px,rgba(255,0,0,0.05)_20px)] pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center">
                                <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />

                                <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-widest">THREAT DETECTED</h1>
                                <p className="text-red-400 font-mono text-sm mb-8 tracking-widest uppercase">
                                    High Confidence Vishing Pattern // Financial Coercion
                                </p>

                                <div className="grid gap-4 w-full max-w-sm">
                                    {/* The Hero Button - Context Aware */}
                                    {isPremium ? (
                                        <button
                                            onClick={onEngageGhost}
                                            className="group relative w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-lg shadow-[0_0_30px_rgba(147,51,234,0.4)] border border-purple-400 transition-all overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            <div className="relative flex items-center justify-center gap-3">
                                                <Ghost size={24} />
                                                <span className="tracking-widest">ENGAGE GHOST AGENT</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onUpgrade}
                                            className="group relative w-full bg-sentinel-green/20 hover:bg-sentinel-green/30 text-sentinel-green font-bold py-4 rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.2)] border border-sentinel-green/50 transition-all overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-sentinel-green/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            <div className="relative flex items-center justify-center gap-3">
                                                <span className="tracking-widest">UPGRADE TO DEFEND</span>
                                            </div>
                                        </button>
                                    )}

                                    <button
                                        onClick={onDismiss}
                                        className="text-zinc-500 text-xs hover:text-white transition-colors uppercase tracking-widest mt-2"
                                    >
                                        Dismiss & Archive Report
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
