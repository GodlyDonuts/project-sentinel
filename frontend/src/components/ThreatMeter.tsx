import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface ThreatMeterProps {
    threatScore: number; // 0.0 to 1.0
}

export const ThreatMeter: React.FC<ThreatMeterProps> = ({ threatScore }) => {
    // Normalize score to 0-1 if it comes in as 0-100
    const normalizedScore = threatScore > 1 ? threatScore / 100 : threatScore;
    const isCritical = normalizedScore > 0.7;
    const isWarning = normalizedScore > 0.4;

    // Generate bars for the helix
    const bars = Array.from({ length: 20 });

    // Mock Latency Data for Sparkline (kept for density)
    const latencyData = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: 40 + Math.random() * 10,
    }));

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="text-[10px] font-mono text-sentinel-green/50 tracking-widest">
                    THREAT_DNA // MONITORING
                </div>
                <div className={`text-xl font-bold font-mono ${isCritical ? 'text-sentinel-red animate-pulse' : 'text-sentinel-green'}`}>
                    {Math.round(normalizedScore * 100)}%
                </div>
            </div>

            {/* Helix Visualization */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4">
                {bars.map((_, i) => (
                    <motion.div
                        key={i}
                        className={`h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${isCritical ? 'text-sentinel-red' : isWarning ? 'text-yellow-500' : 'text-sentinel-green'}`}
                        style={{ backgroundColor: 'currentColor' }}
                        animate={{
                            width: isCritical
                                ? [20, 100, 20] // Glitchy wide expansion
                                : [30 + Math.sin(i) * 10, 60 + Math.sin(i) * 10, 30 + Math.sin(i) * 10], // Gentle breathing
                            x: isCritical
                                ? [0, -5, 5, -2, 2, 0] // Shake/Glitch
                                : 0,
                            opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                            duration: isCritical ? 0.2 : 2,
                            repeat: Infinity,
                            delay: i * 0.05, // Stagger for wave effect
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Footer / Latency */}
            <div className="h-px bg-white/10 w-full mb-4"></div>

            <div className="flex items-end justify-between h-16">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={14} className="text-sentinel-green" />
                        <span className="text-[10px] font-mono text-sentinel-green/50 tracking-widest uppercase">LATENCY</span>
                    </div>
                    <span className="text-2xl font-bold text-sentinel-green font-mono leading-none">45<span className="text-sm text-sentinel-green/50 ml-1">ms</span></span>
                </div>

                <div className="w-24 h-full pb-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={latencyData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#00ff41" // sentinel-green
                                strokeWidth={1} // Thinner line
                                strokeOpacity={0.6} // More transparent
                                dot={false}
                                isAnimationActive={false}
                            />
                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
