import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleWave } from './3d/ParticleWave';

interface AudioVisualizerProps {
    isActive: boolean; // If true, bars move to real audio. If false, they idle.
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [, forceRender] = useState(0);
    // Audio Logic (Keep existing initialization)
    useEffect(() => {
        if (isActive) {
            const initAudio = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    streamRef.current = stream;

                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    audioContextRef.current = audioContext;

                    const analyser = audioContext.createAnalyser();
                    analyser.fftSize = 512;
                    analyserRef.current = analyser;

                    const source = audioContext.createMediaStreamSource(stream);
                    sourceRef.current = source;
                    source.connect(analyser);

                    // Force re-render to pass analyser to child
                    forceRender(n => n + 1);

                } catch (err) {
                    console.error("Error accessing microphone:", err);
                }
            };

            initAudio();
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (audioContextRef.current) {
                if (audioContextRef.current.state !== 'closed') audioContextRef.current.close();
                audioContextRef.current = null;
            }
            analyserRef.current = null;
            sourceRef.current = null;
        }

        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
        };
    }, [isActive]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black/20">
            {/* Tech Labels */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-sentinel-green/70 tracking-widest z-10 pointers-events-none">
                SPECTROGRAM // {isActive ? 'LIVE_FEED' : 'IDLE_MODE'}
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-sentinel-green/50 z-10 pointers-events-none">
                {isActive ? '16kHz • MONO' : '--'}
            </div>

            <Canvas camera={{ position: [0, 5, 20], fov: 45 }}>
                <ambientLight intensity={0.5} />
                {/* 3D Wave */}
                <ParticleWave analyser={analyserRef.current} />
            </Canvas>
        </div>
    );
};