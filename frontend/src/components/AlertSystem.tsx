import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, ShieldAlert, Lock, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import './AlertSystem.css';

interface AlertSystemProps {
    threatScore: number;
    isPremium: boolean;
    onEngageGhost: () => void;
    onUpgrade: () => void;
    onDismiss: () => void;
    isLoading?: boolean;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({
    threatScore,
    isPremium,
    onEngageGhost,
    onUpgrade,
    onDismiss,
    isLoading = false
}) => {
    // Force true for demo purposes if score is high
    const isThreat = threatScore > 0.7;

    return (
        <AnimatePresence>
            {isThreat && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 1. Global Alarm Vignette (Pulsing Red) */}
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay animate-pulse-fast pointer-events-none" />
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ boxShadow: ["inset 0 0 50px rgba(255,0,0,0.2)", "inset 0 0 300px rgba(255,0,0,0.6)", "inset 0 0 50px rgba(255,0,0,0.2)"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* 2. Scanline Texture Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_2px] pointer-events-none z-0" />

                    {/* 3. The Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, border: '1px solid rgba(255,0,0,0)' }}
                        animate={{ scale: 1, opacity: 1, border: '1px solid rgba(255,0,0,0.5)' }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-black/90 backdrop-blur-3xl shadow-[0_0_100px_rgba(255,0,0,0.5)] rounded-2xl overflow-hidden pointer-events-auto"
                    >
                        {/* Header Stripe */}
                        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-slide-gradient" />

                        <div className="p-8 relative">
                            {/* Decorative Corner Brackets */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500/50" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500/50" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500/50" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500/50" />

                            <div className="flex flex-col items-center text-center">

                                {/* Iconography */}
                                {isPremium ? (
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                                        <ShieldAlert size={64} className="text-purple-400 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                    </div>
                                ) : (
                                    <div className="relative mb-6 group cursor-pointer" onClick={onUpgrade}>
                                        <motion.div
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                                        >
                                            <ShieldAlert size={64} className="text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
                                        </motion.div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 p-2 rounded-full border border-red-500/50 backdrop-blur-sm">
                                            <Lock size={24} className="text-white" />
                                        </div>
                                    </div>
                                )}

                                {/* Main Title */}
                                <h2 className="font-display font-bold text-3xl tracking-[0.15em] text-white mb-2 uppercase drop-shadow-md">
                                    {isPremium ? 'THREAT DETECTED' : 'UNAUTHORIZED INTRUSION'}
                                </h2>

                                <div className="flex items-center gap-2 mb-8 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded text-xs font-mono text-red-400 uppercase tracking-widest">
                                    <AlertTriangle size={12} />
                                    <span>Confidence Level: {(threatScore * 100).toFixed(0)}%</span>
                                </div>

                                {/* Body Content */}
                                <div className="w-full text-left space-y-4 mb-8 bg-white/5 rounded-lg p-5 border border-white/5 relative overflow-hidden">
                                    {!isPremium && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-black/80 border border-white/10 rounded-full text-[10px] font-bold text-white tracking-widest shadow-xl">
                                                <Lock size={10} className="text-sentinel-green" />
                                                INTELLIGENCE LOCKED
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-b border-white/10 pb-2">
                                        <span>ANALYSIS ID</span>
                                        <span className="text-white">ERR_7X9_BREACH</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-zinc-500">VECTOR</span>
                                            <span className="text-red-400 font-bold">SOCIAL ENGINEERING</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-zinc-500">SIGNATURE</span>
                                            <span className="text-zinc-300">PATTERN_MATCH_FINANCIAL</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-zinc-500">SEVERITY</span>
                                            <span className="text-red-500 font-bold animate-pulse">CRITICAL</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Area */}
                                {isPremium ? (
                                    <button
                                        onClick={onEngageGhost}
                                        className="w-full relative group overflow-hidden bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_40px_rgba(147,51,234,0.4)] transition-all transform hover:scale-[1.02] border border-purple-400/50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                        <div className="flex items-center justify-center gap-3">
                                            <Ghost size={20} />
                                            <span className="tracking-[0.2em]">ENGAGE GHOST AGENT</span>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="w-full space-y-3">
                                        <button
                                            onClick={onUpgrade}
                                            disabled={isLoading}
                                            className="w-full relative group overflow-hidden bg-sentinel-green hover:bg-[#00ff41] disabled:bg-sentinel-green/50 disabled:cursor-wait text-black font-bold py-4 rounded-xl shadow-[0_0_40px_rgba(0,255,65,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            <div className="relative flex items-center justify-center gap-2">
                                                {isLoading ? (
                                                    <>
                                                        <Activity size={20} className="animate-spin" />
                                                        <span className="tracking-[0.15em]">INITIALIZING DEFENSES...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Activity size={20} className="animate-pulse" />
                                                        <span className="tracking-[0.15em]">ACTIVATE DEFENSE SYSTEM</span>
                                                        <ChevronRight size={16} className="absolute right-4 opacity-50 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                        <p className="text-[10px] font-mono text-zinc-500">
                                            Sentinel Core required for automated threat neutralization.
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={onDismiss}
                                    className="mt-6 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-wider"
                                >
                                    Dismiss Warning
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
