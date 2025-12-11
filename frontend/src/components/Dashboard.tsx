import React, { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAudioProcessing } from '../hooks/useAudioProcessing';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Shield, Power, Zap, Database } from 'lucide-react';
import { WorldGlobe } from './ui/WorldGlobe'; // The NEW Globe
import { TranscriptOverlay } from './ui/TranscriptOverlay'; // The NEW Transcript
import { AlertSystem } from './AlertSystem';
import { GhostInterceptor } from './intercept/GhostInterceptor';
import { useAuth } from '../hooks/useAuth';
import { PaymentGateway } from './payment/PaymentGateway'; // Keep payment access
import { HUDFrame } from './layout/HUDFrame';
import { AudioVisualizer } from './AudioVisualizer';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const [finalizedLines, setFinalizedLines] = useState<string[]>([]);
    const [interimLine, setInterimLine] = useState('');
    const [ghostMode, setGhostMode] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    const { user } = useAuth();
    const { playAudio, audioRef } = useAudioProcessing();
    const { playClick, playHover, playAlert, playConfirm } = useSoundEffects();

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

                {/* TOP RIGHT: TECH STACK INDICATORS (Subtle Flex) */}
                <div className="absolute top-8 right-8 pointer-events-auto flex flex-col items-end gap-3">
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
        </div>
    );
};
