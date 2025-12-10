import React, { useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAudioProcessing } from '../hooks/useAudioProcessing';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Shield, Activity, Wifi, Settings, Power, Globe, LogOut, User as UserIcon, Mic, Radio, Zap, LayoutGrid } from 'lucide-react';
import { EvidenceLocker } from './EvidenceLocker';
import { AudioVisualizer } from './AudioVisualizer';
import { ThreatMeter } from './ThreatMeter';
import { ThreatGlobe } from './3d/ThreatGlobe';
import { LiveTranscript } from './LiveTranscript';
import { AlertSystem } from './AlertSystem';
import { GhostInterceptor } from './intercept/GhostInterceptor';
import { GlassPanel } from './ui/GlassPanel';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

// Views
import { ThreatLevelView } from './views/ThreatLevelView';
import { ThreatThemesView } from './views/ThreatThemesView';
import { DataSpeedsView } from './views/DataSpeedsView';
import { SettingsView } from './views/SettingsView';

type ViewType = 'DASHBOARD' | 'THREAT_LEVEL' | 'THREAT_THEMES' | 'DATA_SPEEDS' | 'SETTINGS';

export const Dashboard: React.FC = () => {
    const [transcript, setTranscript] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState<ViewType>('DASHBOARD');
    const [ghostMode, setGhostMode] = useState(false);
    const { user, logout } = useAuth();

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

    return (
        <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative selection:bg-sentinel-green selection:text-black font-sans">

            {/* 1. BACKGROUND LAYER: THE UNIVERSE */}
            <div className="absolute inset-0 z-0">
                {/* The Globe IS the background now. Scale it up massively. */}
                <div className="absolute inset-0 opacity-40 scale-[1.5] transition-transform duration-1000 ease-out"
                    style={{ transform: isThreat ? 'scale(1.8)' : 'scale(1.5)' }}>
                    <ThreatGlobe threatLevel={threatScore / 100} />
                </div>
                {/* Grid Floor overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-0"></div>
            </div>

            <AlertSystem threatScore={threatScore} onEngageGhost={() => { playConfirm(); setGhostMode(true); }} />
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* 2. HUD INTERFACE LAYER */}
            <div className="relative z-10 h-full w-full flex flex-col p-6 pointer-events-none">

                {/* TOP BAR */}
                <header className="flex justify-between items-start mb-4 pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <Shield className="text-sentinel-green drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]" size={32} />
                        <div>
                            <h1 className="font-display font-bold text-2xl tracking-[0.2em] leading-none">SENTINEL <span className="text-white/30">OS</span></h1>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-sentinel-green/60">
                                <span className="w-1.5 h-1.5 bg-sentinel-green rounded-full animate-pulse"></span>
                                SYSTEM ONLINE // NODE_US_EAST
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setCurrentView('DASHBOARD')} className={`p-3 rounded border border-white/10 hover:bg-white/5 transition-all ${currentView === 'DASHBOARD' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setCurrentView('SETTINGS')} className="p-3 rounded border border-white/10 hover:bg-white/5 text-white/50 transition-all">
                            <Settings size={18} />
                        </button>
                        <button onClick={logout} className="p-3 rounded border border-white/10 hover:bg-red-500/10 text-white/50 hover:text-red-500 transition-all">
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* MAIN CONTENT GRID */}
                <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 pointer-events-auto">

                    {/* LEFT COLUMN: TELEMETRY (Collapsed width) */}
                    <div className="col-span-3 flex flex-col gap-4">
                        <GlassPanel title="THREAT DNA" className="h-64 flex-shrink-0" variant={isThreat ? 'alert' : 'default'}>
                            <ThreatMeter threatScore={threatScore} />
                        </GlassPanel>

                        <GlassPanel title="SPECTRAL ANALYSIS" className="h-48 flex-shrink-0">
                            <AudioVisualizer isActive={isListening} />
                        </GlassPanel>

                        <GlassPanel title="NETWORK LATENCY" className="flex-1">
                            <DataSpeedsView />
                        </GlassPanel>
                    </div>

                    {/* CENTER COLUMN: THE STAGE */}
                    <div className="col-span-6 flex flex-col justify-end relative">
                        {/* Huge Activate Button floating in the middle of the screen */}
                        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center">
                            <button
                                onClick={handleToggle}
                                onMouseEnter={playHover}
                                className={`
                                    group relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700
                                    ${isListening
                                        ? 'bg-red-500/5 shadow-[0_0_100px_rgba(255,0,0,0.3)]'
                                        : 'bg-sentinel-green/5 shadow-[0_0_100px_rgba(0,255,65,0.2)]'
                                    }
                                `}
                            >
                                <div className={`absolute inset-0 rounded-full border border-dashed opacity-30 animate-spin-slow ${isListening ? 'border-red-500' : 'border-sentinel-green'}`}></div>
                                <div className={`absolute inset-4 rounded-full border border-double opacity-60 ${isListening ? 'border-red-500 animate-ping' : 'border-sentinel-green'}`}></div>

                                <Power size={48} className={`transition-colors duration-300 ${isListening ? 'text-red-500 drop-shadow-[0_0_15px_red]' : 'text-sentinel-green drop-shadow-[0_0_15px_#00ff41]'}`} />
                            </button>
                            <div className="mt-6 text-center">
                                <p className="font-display font-bold text-xl tracking-widest text-white">{isListening ? 'SYSTEM ARMED' : 'STANDBY'}</p>
                                <p className="text-[10px] font-mono text-white/40 tracking-[0.5em] mt-1">AWAITING INPUT</p>
                            </div>
                        </div>

                        {/* Transcript Terminal at Bottom */}
                        <div className="h-64 z-40 mb-0">
                            {ghostMode ? (
                                <GlassPanel className="h-full" variant="ghost">
                                    <GhostInterceptor onDisengage={() => setGhostMode(false)} />
                                </GlassPanel>
                            ) : (
                                <GlassPanel title="LIVE TRANSCRIPT FEED" className="h-full bg-black/60">
                                    <LiveTranscript transcript={transcript} />
                                </GlassPanel>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: EVIDENCE & LOGS */}
                    <div className="col-span-3 flex flex-col gap-4">
                        <GlassPanel title="EVIDENCE LOCKER" className="flex-1">
                            <div className="h-full overflow-y-auto custom-scrollbar p-2">
                                <EvidenceLocker variant="sidebar" />
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};
