import React, { useEffect, useRef, memo } from 'react';
import './LiveTranscript.css';

interface LiveTranscriptProps {
    transcript: string[];
}

const KEYWORDS = [
    { word: 'Money', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
    { word: 'Bank', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
    { word: 'Police', color: 'text-sentinel-red border-sentinel-red/30 bg-sentinel-red/10' },
    { word: 'Arrest', color: 'text-sentinel-red border-sentinel-red/30 bg-sentinel-red/10' },
    { word: 'Card', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
    { word: 'Social Security', color: 'text-sentinel-red border-sentinel-red/30 bg-sentinel-red/10' },
    { word: 'Gift Card', color: 'text-sentinel-red border-sentinel-red/30 bg-sentinel-red/10' },
];

// Memoized Line Component to prevent re-rendering history
const TranscriptLine = memo(({ text }: { text: string }) => {
    const highlightText = (text: string) => {
        const parts = text.split(new RegExp(`(${KEYWORDS.map(k => k.word).join('|')})`, 'gi'));
        return parts.map((part, i) => {
            const keyword = KEYWORDS.find(k => k.word.toLowerCase() === part.toLowerCase());
            if (keyword) {
                return (
                    <span
                        key={i}
                        className={`mx-1 px-1.5 py-0.5 rounded border text-xs font-bold uppercase tracking-wider ${keyword.color}`}
                    >
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="flex gap-3 text-sm font-mono border-l-2 border-sentinel-green/20 pl-3 py-1 hover:bg-sentinel-green/5 transition-colors animate-in fade-in duration-300">
            <span className="text-sentinel-green/40 min-w-[85px] text-[10px] pt-1">
                [{new Date().toLocaleTimeString([], { hour12: false })}]
            </span>
            <span className="text-sentinel-green/90 leading-relaxed break-words flex-1">
                <span className="text-sentinel-green/50 mr-2">$</span>
                {highlightText(text)}
            </span>
        </div>
    );
});

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ transcript }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [transcript.length]); // Only scroll on new line count

    return (
        <div className="transcript-container flex flex-col gap-2 p-2" ref={containerRef}>
            {transcript.map((line, index) => (
                <TranscriptLine key={index} text={line} />
            ))}

            {/* Blinking Cursor at bottom */}
            <div className="flex gap-3 pl-3 py-1">
                <span className="text-sentinel-green/40 min-w-[85px] text-[10px]">
                    [{new Date().toLocaleTimeString([], { hour12: false })}]
                </span>
                <span className="text-sentinel-green/50 w-2 h-4 bg-sentinel-green/50 animate-pulse"></span>
            </div>

            {transcript.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sentinel-green/20 font-bold tracking-[0.2em] pointer-events-none">
                    NO SIGNAL DETECTED
                </div>
            )}
        </div>
    );
};
