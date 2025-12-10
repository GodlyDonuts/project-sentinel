import { useEffect, useRef } from 'react';

export const TranscriptOverlay = ({ transcript, isListening }: { transcript: string[], isListening: boolean }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    if (!isListening && transcript.length === 0) return null;

    return (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl text-center pointer-events-none z-20 mask-gradient-t">
            <div className="flex flex-col gap-2 p-4">
                {transcript.slice(-3).map((line, i) => ( // Only show last 3 lines
                    <div key={i} className="text-lg md:text-2xl font-medium text-white/80 animate-in fade-in slide-in-from-bottom-2 drop-shadow-md">
                        "{line}"
                    </div>
                ))}
                {isListening && (
                    <div className="flex justify-center mt-2">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
