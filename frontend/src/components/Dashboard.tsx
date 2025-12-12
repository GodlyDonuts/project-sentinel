import React, { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAudioProcessing } from '../hooks/useAudioProcessing';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Shield, Power, Zap, Database, User as UserIcon } from 'lucide-react';
import { WorldGlobe } from './ui/WorldGlobe'; // The NEW Globe
import { TranscriptOverlay } from './ui/TranscriptOverlay'; // The NEW Transcript
import { AlertSystem } from './AlertSystem';
import { GhostInterceptor } from './intercept/GhostInterceptor';
import { useAuth } from '../hooks/useAuth';
import { PaymentGateway } from './payment/PaymentGateway'; // Keep payment access
import { HUDFrame } from './layout/HUDFrame';
import { AudioVisualizer } from './AudioVisualizer';
import { SettingsModal } from './SettingsModal';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const [finalizedLines, setFinalizedLines] = useState<string[]>([]);
    const [interimLine, setInterimLine] = useState('');
    const [ghostMode, setGhostMode] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const { user, logout } = useAuth();
    const { playAudio, audioRef } = useAudioProcessing();
    const { playClick, playHover, playAlert, playConfirm } = useSoundEffects();

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showResourceMenu, setShowResourceMenu] = useState(false);

    const {
        isConnected,
        isThreat,
        setIsThreat,
        threatScore,
        setThreatScore,
        sendAudio
    } = useWebSocket({
        onAudioData: (blob) => {
            playAudio(blob);
        },
        onTranscriptUpdate: (text: string, isFinal: boolean) => {
            if (isFinal) {
                setFinalizedLines(prev => [...prev, text]);
                setInterimLine('');
            } else {
                setInterimLine(text);
            }
        }
    });

    React.useEffect(() => { if (isThreat) playAlert(); }, [isThreat, playAlert]);

    const { isRecording: isListening, startRecording: startListening, stopRecording: stopListening } = useAudioRecorder({
        onAudioData: sendAudio,
        timeslice: 500
    });

    const handleToggle = () => {
        playClick();
        isListening ? stopListening() : startListening();
    };

    const handleUpgrade = async () => {
        playClick();
        stopListening(); // Stop listening immediately
        setIsThreat(false); // Clear threat state so the red background fades
        setIsLoadingPayment(true);
        try {
            // Fetch client secret from backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/payment/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId: 'price_1SbpqdLApgLOZOmthqRzzc3u' }), // Use real price ID
            });

            if (!response.ok) throw new Error("Failed to init payment");

            const data = await response.json();
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                setShowPaywall(true);
            }
        } catch (e) {
            console.error(e);
            playAlert();
        } finally {
            setIsLoadingPayment(false);
        }
    };

    const fullTranscriptForOverlay = [...finalizedLines, interimLine].filter(Boolean);

    // Custom Docs Icon SVG
    const DocsIcon = () => (
        <svg className="!text-gray-1000 text-white" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentColor' }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M0 1H0.75H5C6.2267 1 7.31583 1.58901 8 2.49963C8.68417 1.58901 9.7733 1 11 1H15.25H16V1.75V13V13.75H15.25H10.7426C10.1459 13.75 9.57361 13.9871 9.15165 14.409L8.53033 15.0303H7.46967L6.84835 14.409C6.42639 13.9871 5.8541 13.75 5.25736 13.75H0.75H0V13V1.75V1ZM7.25 4.75C7.25 3.50736 6.24264 2.5 5 2.5H1.5V12.25H5.25736C5.96786 12.25 6.65758 12.4516 7.25 12.8232V4.75ZM8.75 12.8232V4.75C8.75 3.50736 9.75736 2.5 11 2.5H14.5V12.25H10.7426C10.0321 12.25 9.34242 12.4516 8.75 12.8232Z" fill="currentColor"></path>
        </svg>
    );

    return (
        <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative selection:bg-sentinel-green selection:text-black font-sans">

            {/* 0. LAYER: CRT & HUD FRAME (The Lens) */}
            <HUDFrame />

            {/* 1. LAYER: THE UNIVERSE (Globe + Audio Terrain) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isThreat ? 'opacity-30' : 'opacity-100'}`}>

                {/* A. The Globe (Center) */}
                <div className="absolute inset-0 z-10 scale-75 md:scale-100 transition-transform duration-1000">
                    <WorldGlobe threatScore={threatScore} isActive={isListening} isGhostMode={ghostMode} />
                </div>

                {/* B. The Audio Horizon (Bottom Floor) */}
                <div className="absolute bottom-0 left-0 right-0 h-[40vh] z-0 opacity-50 mask-gradient-t">
                    <AudioVisualizer isActive={isListening} />
                </div>

                {/* Vignette to focus center */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_120%)] pointer-events-none z-20" />
            </div>

            {/* 2. LAYER: CRITICAL ALERTS */}
            <AlertSystem
                threatScore={threatScore}
                isPremium={user?.metadata?.premium === 'true'}
                onEngageGhost={() => {
                    playConfirm();
                    setGhostMode(true);
                }}
                onUpgrade={handleUpgrade}
                onDismiss={() => {
                    setThreatScore(0);
                    setIsThreat(false);
                    stopListening(); // Stop listening explicitly
                }}
                isLoading={isLoadingPayment}
            />
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* 3. LAYER: HUD INTERFACE (Minimalist) */}
            <div className="relative z-30 h-full w-full flex flex-col p-8 pointer-events-none">

                {/* TOP LEFT: BRANDING */}
                <div className="absolute top-8 left-8 pointer-events-auto flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Shield className="text-sentinel-green drop-shadow-[0_0_15px_rgba(0,255,65,0.6)]" size={28} />
                        <h1 className="font-display font-bold text-2xl tracking-[0.2em]">SENTINEL</h1>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 ml-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-sentinel-green animate-pulse' : 'bg-red-500'}`} />
                        SYSTEM STATUS: {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </div>
                </div>

                {/* TOP RIGHT: NAV & PROFILE */}
                <div className="absolute top-8 right-8 pointer-events-auto flex flex-col items-end gap-3">

                    <div className="flex items-start gap-4 mr-1">

                        {/* 1. RESOURCE MENU */}
                        <div className="relative">
                            <button
                                onClick={() => setShowResourceMenu(!showResourceMenu)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <DocsIcon />
                            </button>

                            {showResourceMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 flex flex-col gap-1 z-50">
                                    {['Changelog', 'Help', 'Docs'].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                if (item === 'Changelog') {
                                                    window.open('/changelog', '_blank');
                                                } else if (item === 'Help') {
                                                    window.open('/help', '_blank');
                                                } else if (item === 'Docs') {
                                                    window.open('/docs', '_blank');
                                                }
                                            }}
                                            className="px-4 py-2 text-left text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-mono tracking-wider"
                                        >
                                            {item.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. PROFILE MENU */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="relative w-10 h-10 rounded-lg border border-white/20 overflow-hidden bg-black/50 shadow-[0_0_15px_rgba(0,255,65,0.1)] hover:border-sentinel-green/50 transition-colors"
                            >
                                {user?.profilePictureUrl ? (
                                    <img
                                        src={user.profilePictureUrl}
                                        alt="Agent"
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40 bg-white/5">
                                        <UserIcon size={16} />
                                    </div>
                                )}
                                {/* Scan Line Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
                            </button>

                            {showProfileMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 flex flex-col gap-1 z-50">
                                    <div className="px-4 py-2 text-[10px] font-mono text-zinc-500 border-b border-white/5 mb-1">
                                        AGENT: {user?.firstName?.toUpperCase() || 'UNKNOWN'}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            setIsSettingsOpen(true);
                                        }}
                                        className="px-4 py-2 text-left text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-mono tracking-wider"
                                    >
                                        SETTINGS
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-mono tracking-wider"
                                    >
                                        SIGN OUT
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-mono text-gray-400">
                        <Zap size={10} className="text-yellow-400" />
                        <span>VULTR EDGE: 45ms</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-mono text-gray-400">
                        <Database size={10} className="text-blue-400" />
                        <span>RAINDROP: ACTIVE</span>
                    </div>

                    {/* UPGRADE BUTTON - Only show if NOT Premium */}
                    {user?.metadata?.premium !== 'true' && (
                        <button
                            onClick={handleUpgrade}
                            disabled={isLoadingPayment}
                            className="text-[10px] font-mono text-sentinel-green hover:underline mt-2 flex items-center gap-2"
                        >
                            {isLoadingPayment ? 'INITIALIZING...' : 'UPGRADE PLAN'}
                        </button>
                    )}
                </div>

                {/* CENTER: THE ACTIVATOR (Enhanced) */}
                <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto mt-20"> {/* pushed down slightly */}

                    {/* The Button Container */}
                    <div className="relative group">
                        {/* Outer Rotating Ring 1 */}
                        <div className={`absolute -inset-8 rounded-full border border-white/5 border-dashed animate-spin-slow ${isListening ? 'opacity-100 duration-[10s]' : 'opacity-20'}`} />

                        {/* Outer Rotating Ring 2 (Counter) */}
                        <div className={`absolute -inset-16 rounded-full border border-sentinel-green/10 border-dotted animate-reverse-spin ${isListening ? 'opacity-100' : 'opacity-0'}`} />

                        {/* The Button */}
                        <button
                            onClick={handleToggle}
                            onMouseEnter={playHover}
                            className={`
                                relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700
                                backdrop-blur-md border border-white/10
                                ${isListening
                                    ? 'bg-red-500/10 shadow-[0_0_100px_rgba(255,0,0,0.6)] scale-110 border-red-500/50'
                                    : 'bg-white/5 hover:bg-white/10 shadow-[0_0_60px_rgba(0,255,65,0.2)] hover:scale-105 hover:border-sentinel-green/50'
                                }
                            `}
                        >
                            <Power size={32} className={`transition-colors duration-300 ${isListening ? 'text-red-500 drop-shadow-neon-red' : 'text-white'}`} />
                        </button>
                    </div>

                    {/* Status Text under button */}
                    <div className="mt-20 text-center">
                        <p className="font-display font-bold text-lg tracking-[0.2em] text-white/90">
                            {isListening ? 'SYSTEM ARMED' : 'STANDBY'}
                        </p>
                        <p className="text-[10px] font-mono text-white/40 tracking-widest mt-1">
                            {isListening ? 'LISTENING FOR THREAT VECTORS...' : 'CLICK TO INITIALIZE'}
                        </p>
                    </div>
                </div>

                {/* BOTTOM: TRANSCRIPT & GHOST INTERFACE */}
                {ghostMode ? (
                    <div className="absolute inset-x-0 bottom-0 top-24 z-50 p-4 pointer-events-auto">
                        <GhostInterceptor onDisengage={() => setGhostMode(false)} />
                    </div>
                ) : (
                    <TranscriptOverlay transcript={fullTranscriptForOverlay} isListening={isListening} />
                )}
            </div>

            {/* PAYWALL MODAL */}
            {showPaywall && user && clientSecret && (
                <PaymentGateway clientSecret={clientSecret} onClose={() => setShowPaywall(false)} userId={user.id} />
            )}

            {/* SETTINGS MODAL */}
            {isSettingsOpen && (
                <SettingsModal onClose={() => setIsSettingsOpen(false)} onUpgrade={handleUpgrade} isLoading={isLoadingPayment} />
            )}
        </div>
    );
};

