import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, ChevronRight, AlertOctagon } from 'lucide-react';
import { SecurityField } from './login/SecurityField';
import { BiometricLoader } from './login/BiometricLoader';
import { useSoundEffects } from '../hooks/useSoundEffects';

const WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID;
const WORKOS_REDIRECT_URI = import.meta.env.VITE_WORKOS_REDIRECT_URI;
const API_URL = import.meta.env.VITE_API_URL || 'https://api.saicharanramineni.com';

export const Login: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'redirecting' | 'verifying'>('idle');
    const [error, setError] = useState('');
    const { playClick, playAlert, playHover, startHum } = useSoundEffects();

    const effectRan = useRef(false);

    // Start ambient hum on mount
    useEffect(() => {
        // Interaction usually required for audio, but we try anyway
        const handleInteraction = () => startHum();
        window.addEventListener('click', handleInteraction, { once: true });
        return () => window.removeEventListener('click', handleInteraction);
    }, [startHum]);

    // Auth Code Logic (Keep your existing robust logic)
    useEffect(() => {
        const code = searchParams.get('code');
        if (code && !effectRan.current) {
            effectRan.current = true;
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('code');
            setSearchParams(newParams, { replace: true });
            handleAuthCode(code);
        }
    }, [searchParams, setSearchParams]);

    const handleAuthCode = async (code: string) => {
        setStatus('verifying');
        try {
            const res = await fetch(`${API_URL}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();

            if (res.ok && data.user) {
                localStorage.setItem('sentinel_user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                throw new Error(data.error || 'Identity verification failed.');
            }
        } catch (e: any) {
            console.error("Auth error:", e);
            setStatus('idle');
            playAlert(); // Audio feedback for error
            if (e.message?.includes('invalid_grant')) {
                setError('SESSION_TOKEN_EXPIRED // RE-AUTHENTICATE');
            } else {
                setError('HANDSHAKE_FAILED // ACCESS_DENIED');
            }
        }
    };

    const handleLogin = () => {
        playClick();
        setError('');

        if (!WORKOS_CLIENT_ID || !WORKOS_REDIRECT_URI) {
            // Check for Dev Mode Exception
            if (import.meta.env.DEV) {
                console.log("DEV MODE: Skipping Auth Handshake");
                setStatus('verifying');
                setTimeout(() => navigate('/dashboard'), 1000);
                return;
            }

            setError('SYS_CONFIG_ERROR // MISSING_CREDENTIALS');
            playAlert();
            return;
        }

        // DEVELOPER MODE: BYPASS AUTH
        if (import.meta.env.DEV) {
            console.log("DEV MODE: Skipping Auth Handshake");
            setStatus('verifying'); // Show loader briefly
            setTimeout(() => navigate('/dashboard'), 1500); // Fake delay for effect
            return;
        }

        setStatus('redirecting');

        // Delay slighty for animation
        setTimeout(() => {
            const params = new URLSearchParams({
                response_type: 'code',
                client_id: WORKOS_CLIENT_ID,
                redirect_uri: WORKOS_REDIRECT_URI,
                provider: 'authkit'
            });
            window.location.href = `https://api.workos.com/user_management/authorize?${params.toString()}`;
        }, 800);
    };

    return (
        <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center font-mono text-sentinel-green selection:bg-sentinel-green selection:text-black">

            {/* 1. 3D Background */}
            <SecurityField accelerate={status !== 'idle'} />

            {/* 2. CRT Overlay (reused) */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat" />
            <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

            {/* 3. Corner HUD Elements */}
            <div className="absolute top-8 left-8 text-xs tracking-widest opacity-50 z-10 hidden md:block">
                <div>SYSTEM: SENTINEL_V2.4</div>
                <div>NODE: US-EAST-1</div>
            </div>
            <div className="absolute top-8 right-8 text-xs tracking-widest opacity-50 z-10 hidden md:block text-right">
                <div>ENCRYPTION: 256-BIT SSL</div>
                <div className="flex items-center gap-2 justify-end mt-1">
                    STATUS: <span className="w-2 h-2 bg-sentinel-green rounded-full animate-pulse"></span> ONLINE
                </div>
            </div>

            {/* 4. Login Terminal */}
            <div className="relative z-30 w-full max-w-md p-1">
                {/* Decorative border lines */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-sentinel-green/30" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-sentinel-green/30" />

                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-[0_0_50px_rgba(0,255,65,0.1)] relative overflow-hidden group">

                    {/* Top shine effect */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sentinel-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-sentinel-green/20 blur-xl rounded-full animate-pulse-slow"></div>
                            <Shield size={64} className="relative z-10 text-sentinel-green drop-shadow-neon-green" />
                        </div>

                        <h1 className="font-display text-4xl font-bold text-white mb-2 tracking-wider">
                            SENTINEL <span className="text-sentinel-green">AI</span>
                        </h1>
                        <p className="text-xs tracking-[0.3em] text-gray-500 mb-10 uppercase">
                            Secure Voice Anti-Fraud Terminal
                        </p>

                        {error ? (
                            <div className="w-full mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded flex items-start gap-3 text-left animate-shake">
                                <AlertOctagon className="text-red-500 shrink-0" size={20} />
                                <div>
                                    <div className="text-red-500 font-bold text-xs tracking-widest mb-1">ERROR DETECTED</div>
                                    <div className="text-red-400 text-xs font-mono">{error}</div>
                                </div>
                            </div>
                        ) : null}

                        {status === 'idle' ? (
                            <button
                                onClick={handleLogin}
                                onMouseEnter={playHover}
                                className="w-full group relative overflow-hidden bg-sentinel-green text-black font-bold py-4 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] hover:scale-[1.02]"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <div className="relative flex items-center justify-center gap-3 tracking-widest text-sm">
                                    <Lock size={16} />
                                    <span>INITIATE HANDSHAKE</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ) : (
                            <BiometricLoader status={status} />
                        )}

                        <div className="mt-8 text-[10px] text-gray-600 flex flex-col gap-1">
                            <div>RESTRICTED ACCESS // AUTHORIZED PERSONNEL ONLY</div>
                            <div>ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Warning */}
            <div className="absolute bottom-6 w-full text-center">
                <p className="text-[10px] text-sentinel-red/40 tracking-[0.5em] font-bold">
                    UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE
                </p>
            </div>
        </div>
    );
};