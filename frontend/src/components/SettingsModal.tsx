import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Copy, RefreshCw, Eye, EyeOff, User, Terminal, Activity, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SettingsModalProps {
    onClose: () => void;
    onUpgrade: () => void;
    isLoading?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onUpgrade, isLoading = false }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'identity' | 'developer'>('identity');
    const [apiKey, setApiKey] = useState('sk_live_8f7a2d9c1e4b5a6d7e8f9a0b1c2d3e4f');
    const [isKeyVisible, setIsKeyVisible] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [regenStep, setRegenStep] = useState(0); // 0: Idle, 1: Encrypting, 2: Salting, 3: Generated
    const [copied, setCopied] = useState(false);

    // Roll New Key Logic (Security Handshake)
    const handleRollKey = () => {
        setIsRegenerating(true);
        setRegenStep(1);

        // Simulate security sequence
        setTimeout(() => setRegenStep(2), 800);
        setTimeout(() => {
            const newKey = 'sk_live_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            setApiKey(newKey);
            setRegenStep(3);
        }, 2000);
        setTimeout(() => {
            setIsRegenerating(false);
            setRegenStep(0);
        }, 3000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    className="relative w-full max-w-4xl h-[600px] bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex"
                >
                    {/* CRT Flicker Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_1px] z-50 opacity-20" />

                    {/* Sidebar */}
                    <div className="w-64 border-r border-white/10 bg-black/20 flex flex-col p-6 gap-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-sentinel-green" size={24} />
                            <h2 className="font-display font-bold text-xl tracking-wider text-white">SYSTEM</h2>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('identity')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-all ${activeTab === 'identity' ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <User size={16} />
                                IDENTITY
                            </button>
                            <button
                                onClick={() => setActiveTab('developer')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-all ${activeTab === 'developer' ? 'bg-white/10 text-white border border-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <Terminal size={16} />
                                DEVELOPER
                            </button>
                        </nav>

                        <div className="mt-auto pt-6 border-t border-white/10">
                            <div className="text-[10px] font-mono text-zinc-600">
                                SESSION ID: <br />
                                <span className="text-zinc-400">{user?.id || 'UNKNOWN'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto relative">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* TAB: IDENTITY */}
                        {activeTab === 'identity' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="font-display text-2xl font-bold mb-1">AGENT PROFILE</h3>
                                    <p className="font-mono text-xs text-zinc-500">CLASSIFIED PERSONNEL FILE</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 flex items-center gap-6 p-6 rounded-xl border border-white/5 bg-white/5">
                                        <div className="w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden relative group">
                                            {user?.profilePictureUrl ? (
                                                <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-black flex items-center justify-center">
                                                    <User className="text-zinc-400" size={32} />
                                                </div>
                                            )}
                                            {/* Holographic User Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-sentinel-green/20 to-transparent opacity-50" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sentinel-green/10 border border-sentinel-green/20 rounded text-[10px] font-mono text-sentinel-green">
                                                CLEARANCE LEVEL 5
                                            </div>
                                            <div className="font-display text-xl font-bold tracking-widest">
                                                {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
                                            </div>
                                            <div className="font-mono text-xs text-zinc-500">{user?.email}</div>
                                        </div>
                                    </div>

                                    {/* Editable Fields */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase">First Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.firstName}
                                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono focus:border-sentinel-green/50 focus:outline-none focus:ring-1 focus:ring-sentinel-green/50 transition-all text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Last Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.lastName}
                                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono focus:border-sentinel-green/50 focus:outline-none focus:ring-1 focus:ring-sentinel-green/50 transition-all text-white"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email}
                                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono focus:border-sentinel-green/50 focus:outline-none focus:ring-1 focus:ring-sentinel-green/50 transition-all text-white"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB: DEVELOPER CONSOLE */}
                        {activeTab === 'developer' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="font-display text-2xl font-bold mb-1">DEVELOPER CONSOLE</h3>
                                    <p className="font-mono text-xs text-zinc-500">API CONFIGURATION & SECURITY</p>
                                </div>

                                {user?.metadata?.premium === 'true' ? (
                                    <>
                                        {/* API Key Section */}
                                        <div className="p-6 rounded-xl border border-white/10 bg-black/40 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
                                                    <Key size={14} />
                                                    <span>SECRET KEY</span>
                                                </div>
                                                <div className="text-[10px] font-mono text-zinc-600">
                                                    LAST USED: JUST NOW
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-black rounded-lg border border-white/10 h-12 flex items-center px-4 font-mono text-sm relative overflow-hidden group">
                                                    {isRegenerating ? (
                                                        <span className="text-sentinel-green animate-pulse">
                                                            {regenStep === 1 && 'ENCRYPTING...'}
                                                            {regenStep === 2 && 'ALLOCATING SALT...'}
                                                            {regenStep === 3 && 'GENERATING...'}
                                                        </span>
                                                    ) : (
                                                        <span className={isKeyVisible ? 'text-white' : 'text-zinc-500 blur-sm group-hover:blur-none transition-all'}>
                                                            {isKeyVisible ? apiKey : apiKey.replace(/[a-zA-Z0-9]/g, '•')}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setIsKeyVisible(!isKeyVisible)}
                                                    className="p-3 rounded-lg border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    {isKeyVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={handleCopy}
                                                        className="p-3 rounded-lg border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                    {copied && (
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-sentinel-green text-black text-[10px] font-bold px-2 py-1 rounded">
                                                            COPIED
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <button
                                                    onClick={handleRollKey}
                                                    disabled={isRegenerating}
                                                    className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-sentinel-green transition-colors disabled:opacity-50"
                                                >
                                                    <RefreshCw size={12} className={isRegenerating ? 'animate-spin' : ''} />
                                                    ROLL NEW KEY
                                                </button>
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                                                    <Activity size={12} />
                                                    RATE LIMIT: 450/500 REQ/MIN
                                                </div>
                                            </div>
                                        </div>

                                        {/* Webhook Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
                                                <br />
                                                <span>WEBHOOK URL</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="https://api.yourdomain.com/callbacks"
                                                className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder-zinc-700"
                                            />
                                            <p className="text-[10px] font-mono text-zinc-600">
                                                We'll assume you're listening for 'fraud.detected' events at this endpoint.
                                            </p>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="mt-8 border border-red-900/30 bg-red-900/5 rounded-xl p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-red-500/10 rounded-lg">
                                                    <AlertTriangle className="text-red-500" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-display font-bold text-red-500 tracking-wider text-sm mb-1">DANGER ZONE</h4>
                                                    <p className="text-xs text-zinc-400 mb-4 font-mono">
                                                        Revoking keys will immediately invalidate all active API connections. This action cannot be undone.
                                                    </p>
                                                    <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 text-xs font-mono rounded transition-colors">
                                                        REVOKE ALL KEYS
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* Sentinel One Ad - Non-Premium View */
                                    <div className="flex flex-col items-center justify-center p-12 border border-white/10 bg-white/5 rounded-xl space-y-6 text-center relative overflow-hidden">
                                        {/* Background Glow */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sentinel-green/10 blur-[100px] pointer-events-none" />

                                        <Shield className="text-sentinel-green" size={64} />

                                        <div className="space-y-2 relative z-10">
                                            <h3 className="font-display text-2xl font-bold tracking-wider text-white">SENTINEL ONE</h3>
                                            <p className="font-mono text-sm text-zinc-400 max-w-md">
                                                Developer API access is restricted to Sentinel One subscribers.
                                                Unlock full programmatic control.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-left w-full max-w-sm relative z-10">
                                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                                                <div className="w-1.5 h-1.5 bg-sentinel-green rounded-full" />
                                                API Key Generation
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                                                <div className="w-1.5 h-1.5 bg-sentinel-green rounded-full" />
                                                Webhook Events
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                                                <div className="w-1.5 h-1.5 bg-sentinel-green rounded-full" />
                                                Unlimited Requests
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                                                <div className="w-1.5 h-1.5 bg-sentinel-green rounded-full" />
                                                Priority Support
                                            </div>
                                        </div>

                                        <button
                                            onClick={onUpgrade}
                                            disabled={isLoading}
                                            className="mt-4 px-8 py-3 bg-sentinel-green hover:bg-sentinel-green/90 disabled:bg-sentinel-green/50 disabled:cursor-wait text-black font-bold font-display tracking-wider rounded transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,255,65,0.3)] relative z-10 flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="animate-spin text-black/80">⟳</span>
                                                    <span>INITIALIZING...</span>
                                                </>
                                            ) : (
                                                'UPGRADE • $9.99/MO'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
