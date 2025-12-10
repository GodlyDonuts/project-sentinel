import { useRef, useCallback } from 'react';

export const useAudioProcessing = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudio = useCallback(async (blob: Blob) => {
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 3.0; // Boost volume

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.start(0);
        } catch (e) {
            console.error("Audio playback error:", e);
            const audioUrl = URL.createObjectURL(blob);
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }
        }
    }, []);

    return { playAudio, audioRef };
};
