import React, { useRef, useState } from 'react';

interface HoloCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    title?: string;
}

export const HoloCard: React.FC<HoloCardProps> = ({ children, className = '', onClick, title }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            className={`relative transition-all duration-200 ease-out cursor-pointer hover:border-sentinel-green/50 border border-transparent ${className}`}
        >
            {/* Simple Hover Glow */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 z-10"
                style={{
                    opacity: hover ? 1 : 0,
                    background: 'radial-gradient(circle at center, rgba(0, 255, 65, 0.1), transparent 70%)'
                }}
            />
            {title && (
                <div className="absolute top-4 left-4 z-20 text-xs font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};
