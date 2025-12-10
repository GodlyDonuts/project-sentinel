import React, { useState, useCallback } from 'react';
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
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const [transcript, setTranscript] = useState<string[]>([]);
    const [ghostMode, setGhostMode] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    const { user } = useAuth();
    const { playAudio, audioRef } = useAudioProcessing();
    const { playClick, playHover, playAlert, playConfirm } = useSoundEffects();

    const handleTranscriptUpdate = useCallback((text: string) => {
        setTranscript(prev => [...prev, text]);
    }, []);

    const { isConnected, isThreat, threatScore, sendAudio } = useWebSocket({
        onAudioData: playAudio,
        onTranscriptUpdate: handleTranscriptUpdate
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

    return (
        <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative selection:bg-sentinel-green selection:text-black font-sans">

            {/* 1. LAYER: THE UNIVERSE (Globe) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isThreat ? 'opacity-30' : 'opacity-100'}`}>
                {/* The Globe is now the HERO. It sits center stage. */}
                <WorldGlobe threatScore={threatScore} />

                {/* Vignette to focus center */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_100%)] pointer-events-none" />
            </div>

            {/* 2. LAYER: CRITICAL ALERTS */}
            <AlertSystem threatScore={threatScore} onEngageGhost={() => { playConfirm(); setGhostMode(true); }} />
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* 3. LAYER: HUD INTERFACE (Minimalist) */}
            <div className="relative z-10 h-full w-full flex flex-col p-8 pointer-events-none">

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

                {/* CENTER: THE ACTIVATOR (The "Iron Man" Arc Reactor) */}
                <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto">
                    {/* The Button */}
                    <button
                        onClick={handleToggle}
                        onMouseEnter={playHover}
                        className={`
                            relative group w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700
                            ${isListening
                                ? 'bg-red-500/10 shadow-[0_0_100px_rgba(255,0,0,0.4)] scale-110'
                                : 'bg-white/5 hover:bg-white/10 shadow-[0_0_60px_rgba(0,255,65,0.1)] hover:scale-105'
                            }
                        `}
                    >
                        {/* Ring Animations */}
                        <div className={`absolute inset-0 rounded-full border border-white/20 ${isListening ? 'animate-ping opacity-20' : 'opacity-100'}`} />
                        <div className={`absolute -inset-4 rounded-full border border-dashed border-white/10 animate-spin-slow`} />

                        <Power size={32} className={`transition-colors duration-300 ${isListening ? 'text-red-500' : 'text-white'}`} />
                    </button>

                    {/* Status Text under button */}
                    <div className="mt-8 text-center">
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
                    <TranscriptOverlay transcript={transcript} isListening={isListening} />
                )}
            </div>

            {/* PAYWALL MODAL */}
            {showPaywall && user && clientSecret && (
                <PaymentGateway clientSecret={clientSecret} onClose={() => setShowPaywall(false)} userId={user.id} />
            )}
        </div>
    );
};
