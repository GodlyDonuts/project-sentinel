import React from 'react';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    variant?: 'default' | 'alert' | 'ghost';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', title, variant = 'default' }) => {
    // VARIANT STYLES
    const styles = {
        default: 'border-white/10 bg-black/20 hover:border-white/20',
        alert: 'border-red-500/50 bg-red-900/10 shadow-[0_0_30px_rgba(255,0,0,0.1)]',
        ghost: 'border-purple-500/30 bg-purple-900/10 shadow-[0_0_30px_rgba(168,85,247,0.1)]',
    };

    const titleColors = {
        default: 'text-sentinel-green',
        alert: 'text-red-500',
        ghost: 'text-purple-400',
    };

    return (
        <div className={`relative backdrop-blur-xl border-t border-b ${styles[variant]} transition-all duration-300 group ${className}`}>

            {/* OPTICAL CORNERS (The "Iron Man" Look) */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t ${variant === 'default' ? 'border-sentinel-green' : 'border-current'} opacity-50`} />
            <div className={`absolute top-0 right-0 w-2 h-2 border-r border-t ${variant === 'default' ? 'border-sentinel-green' : 'border-current'} opacity-50`} />
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-l border-b ${variant === 'default' ? 'border-sentinel-green' : 'border-current'} opacity-50`} />
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b ${variant === 'default' ? 'border-sentinel-green' : 'border-current'} opacity-50`} />

            {/* HEADER */}
            {title && (
                <div className="absolute -top-3 left-4 px-2 bg-[#050505] z-10 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${variant === 'alert' ? 'bg-red-500 animate-ping' : 'bg-sentinel-green'}`} />
                    <span className={`text-[9px] font-mono tracking-[0.3em] font-bold uppercase ${titleColors[variant]}`}>
                        {title}
                    </span>
                </div>
            )}

            {/* CONTENT */}
            <div className="h-full w-full p-4 relative z-0">
                {children}
            </div>

            {/* SCANLINE OVERLAY (Subtle texture on just the panel) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-20" />
        </div>
    );
};
