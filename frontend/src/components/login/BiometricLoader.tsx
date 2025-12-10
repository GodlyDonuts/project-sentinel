import { useState, useEffect } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";

export const BiometricLoader = ({ status }: { status: string }) => {
    const [text, setText] = useState("");

    useEffect(() => {
        let iteration = 0;
        const targetText = status === 'redirecting' ? "ESTABLISHING UPLINK" : "VERIFYING BIOMETRICS";

        // Clear previous interval if any (though useEffect cleanup handles it)
        let interval: ReturnType<typeof setInterval>;

        interval = setInterval(() => {
            setText(targetText
                .split("")
                .map((_, index) => {
                    if (index < iteration) {
                        return targetText[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("")
            );

            if (iteration >= targetText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [status]);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Scanner Visual */}
            <div className="relative w-16 h-16 border border-sentinel-green/30 rounded-lg overflow-hidden bg-black/50">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_40%,rgba(0,255,65,0.5)_50%,transparent_60%)] animate-scan" style={{ backgroundSize: '100% 200%' }}></div>
                <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2 opacity-50">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="bg-sentinel-green/20 rounded-sm"></div>
                    ))}
                </div>
            </div>

            <div className="font-mono text-sentinel-green text-sm tracking-[0.2em] animate-pulse">
                {text}
            </div>
        </div>
    );
};
