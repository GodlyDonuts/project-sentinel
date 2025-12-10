import React, { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Lock, Zap, ChevronRight, Activity } from 'lucide-react';
import { ThreatGlobe } from './3d/ThreatGlobe';
import { ParticleWave } from './3d/ParticleWave';
import { Canvas } from '@react-three/fiber';
import { TrustedTicker } from './landing/TrustedTicker';
import { ArchitectureDiagram } from './landing/ArchitectureDiagram';
import { ThreatLabDemo } from './landing/ThreatLabDemo';
import { PricingSection } from './landing/PricingSection';

// --- SUB-COMPONENTS (Internal for simplicity) ---

interface SpotlightProps {
    className?: string;
}

const Spotlight: React.FC<SpotlightProps> = ({ className = "" }) => (
    <div className={`pointer-events-none absolute z-0 h-[169%] w-[138%] lg:w-[84%] opacity-0 motion-safe:animate-spotlight ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-sentinel-green/20 to-transparent blur-3xl" />
    </div>
);

// Generic Bento Item Wrapper
const BentoItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        {children}
    </div>
);

// --- MAIN COMPONENT ---

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Add this
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });

    // Auto-forward to Login if auth code is present
    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            navigate(`/login?code=${code}`);
        }
    }, [searchParams, navigate]);

    // Parallax effects
    const yHero = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <div ref={targetRef} className="min-h-screen bg-[#050505] text-white selection:bg-sentinel-green selection:text-black font-sans overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
                <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    className="relative z-10 text-center max-w-5xl px-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sentinel-green/20 bg-sentinel-green/5 text-sentinel-green text-xs font-mono mb-8 backdrop-blur-xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-green"></span>
                        </span>
                        SENTINEL DEFENSE GRID // ONLINE
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 font-display">
                        Silence the <br />
                        <span className="text-sentinel-green/90 text-glow">Deception.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The world's first AI-native voice guardian.
                        We detect social engineering attacks in <span className="text-white font-bold">real-time</span> before you speak a word.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-sentinel-green focus:ring-offset-2 focus:ring-offset-slate-50"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00ff41_0%,#393BB2_50%,#00ff41_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900">
                                Launch Console <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button className="text-sm font-mono text-gray-500 hover:text-white transition-colors">
                            VIEW LIVE DEMO
                        </button>
                    </div>
                </motion.div>

                {/* 3D Visual in Hero Bottom */}
                <div className="absolute bottom-0 w-full h-[40vh] opacity-40 pointer-events-none mask-gradient-b">
                    <Canvas camera={{ position: [0, 5, 20], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <ParticleWave analyser={null} />
                    </Canvas>
                </div>
            </section>

            {/* 2. TRUSTED TICKER */}
            <TrustedTicker />

            {/* 3. ARCHITECTURE DIAGRAM */}
            <ArchitectureDiagram />

            {/* 4. BENTO GRID SHOWCASE */}
            <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <div className="mb-20">
                    <h2 className="text-4xl font-display font-bold mb-6">Defense-Grade Intelligence</h2>
                    <p className="text-gray-400 max-w-2xl text-lg">Powered by LiquidMetal Raindrop and Cerebras 70b inference.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                    {/* Large Card: Threat Globe */}
                    <BentoItem className="md:col-span-2 relative group cursor-crosshair">
                        <div className="absolute inset-0 z-0">
                            {/* Pass a fixed low threat level for the demo visualization */}
                            <ThreatGlobe threatLevel={0.3} />
                        </div>
                        <div className="absolute bottom-0 left-0 p-8 z-10 w-full bg-gradient-to-t from-black via-black/50 to-transparent">
                            <h3 className="text-2xl font-bold font-display text-white mb-2">Global Threat Vectoring</h3>
                            <p className="text-gray-400">Real-time geospatial visualization of active vishing campaigns.</p>
                        </div>
                    </BentoItem>

                    {/* Tall Card: Live Analysis */}
                    <BentoItem className="md:row-span-2 flex flex-col p-8">
                        <div className="w-10 h-10 rounded-full bg-sentinel-green/10 flex items-center justify-center text-sentinel-green mb-6">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-2xl font-bold font-display text-white mb-4">Semantic Analysis</h3>
                        <p className="text-gray-400 mb-8">
                            Our LLM analyzes tone, urgency, and context to flag 99.8% of fraud attempts.
                        </p>

                        {/* Mock Chat UI */}
                        <div className="flex-1 space-y-3 font-mono text-xs opacity-70 mask-gradient-b overflow-hidden">
                            <div className="bg-white/5 p-3 rounded-lg rounded-tl-none border-l-2 border-red-500">
                                <span className="text-red-400 block mb-1">SUSPICIOUS CALLER</span>
                                "I need you to transfer the funds to the secure account now."
                            </div>
                            <div className="bg-sentinel-green/10 p-3 rounded-lg rounded-tr-none ml-auto max-w-[80%] border-r-2 border-sentinel-green">
                                <span className="text-sentinel-green block mb-1">SENTINEL AI</span>
                                "Financial urgency detected. Advisory: Hang up."
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg rounded-tl-none border-l-2 border-red-500">
                                <span className="text-red-400 block mb-1">SUSPICIOUS CALLER</span>
                                "Don't tell anyone, it's confidential."
                            </div>
                        </div>
                    </BentoItem>

                    {/* Small Card: Latency */}
                    <BentoItem className="p-8 flex flex-col justify-between group hover:border-sentinel-green/30 transition-colors">
                        <div>
                            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                            <h3 className="text-xl font-bold text-white">Sub-50ms Latency</h3>
                        </div>
                        <div className="text-4xl font-mono font-bold text-white group-hover:text-sentinel-green transition-colors">
                            45<span className="text-sm text-gray-500">ms</span>
                        </div>
                    </BentoItem>

                    {/* Small Card: Encryption */}
                    <BentoItem className="p-8 flex flex-col justify-between group hover:border-sentinel-green/30 transition-colors">
                        <div>
                            <Lock className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold text-white">Military Encrypted</h3>
                        </div>
                        <div className="text-sm text-gray-400">
                            Voice data is processed in ephemeral enclaves and never stored without consent.
                        </div>
                    </BentoItem>
                </div>
            </section>

            {/* 5. PRICING */}
            <PricingSection />

            {/* 6. INTERACTIVE THREAT LAB */}
            <ThreatLabDemo />

            {/* 7. FOOTER */}
            <footer className="border-t border-white/10 bg-black py-12 text-center relative z-10">
                <div className="text-gray-500 font-mono text-sm">
                    PROJECT SENTINEL © 2025 // SECURING THE HUMAN LAYER
                </div>
            </footer>
        </div>
    );
};
