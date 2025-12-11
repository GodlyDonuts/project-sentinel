import React from 'react';
import { Wifi, Battery, Activity } from 'lucide-react';

export const HUDFrame: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
            {/* 1. CORNER BRACKETS */}
            {/* Top Left */}
            <div className="absolute top-4 left-4 w-64 h-32 border-l-2 border-t-2 border-white/20 rounded-tl-3xl opacity-50" />
            <div className="absolute top-4 left-4 w-[200px] h-[2px] bg-gradient-to-r from-sentinel-green/50 to-transparent" />

            {/* Top Right */}
            <div className="absolute top-4 right-4 w-64 h-32 border-r-2 border-t-2 border-white/20 rounded-tr-3xl opacity-50 flex flex-col items-end pt-2 pr-4">
                <div className="flex gap-2 mb-1">
                    <span className="w-2 h-2 bg-white/20 rounded-full" />
                    <span className="w-2 h-2 bg-white/20 rounded-full" />
                    <span className="w-2 h-2 bg-white/20 rounded-full" />
                </div>
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-4 left-4 w-64 h-32 border-l-2 border-b-2 border-white/20 rounded-bl-3xl opacity-50 flex items-end pl-4 pb-2">
                <div className="font-mono text-[10px] text-sentinel-green/60 tracking-widest">
                    COORDS: 34.0522° N, 118.2437° W
                </div>
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-4 right-4 w-64 h-32 border-r-2 border-b-2 border-white/20 rounded-br-3xl opacity-50 flex flex-col justify-end items-end pr-4 pb-2">
                <div className="flex items-center gap-4 text-white/40">
                    <Wifi size={14} />
                    <Battery size={14} />
                    <Activity size={14} />
                </div>
            </div>

            {/* 2. DECORATIVE ELEMENTS */}

            {/* Scrolling Hex Data (Matrix feel) */}
            <div className="absolute top-32 right-8 w-24 h-64 overflow-hidden mask-gradient-b opacity-30">
                <div className="font-mono text-[10px] text-sentinel-green animate-scan-text">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i}>{Math.random().toString(16).substring(2, 10).toUpperCase()}</div>
                    ))}
                </div>
            </div>

        </div>

    );
};
