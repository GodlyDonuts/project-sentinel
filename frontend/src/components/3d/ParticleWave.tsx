import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleWaveProps {
    analyser: AnalyserNode | null;
}

export const ParticleWave: React.FC<ParticleWaveProps> = ({ analyser }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 2000; // Number of particles
    const sep = 3; // Separation

    // Initial Positions
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Grid layout or Line layout
            // Let's do a wave field (grid)
            const x = (i % 50) * sep - (50 * sep) / 2;
            const z = Math.floor(i / 50) * sep - (40 * sep) / 2 - 50;
            const y = 0;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, [count]);

    const dataArray = useMemo(() => new Uint8Array(analyser ? analyser.frequencyBinCount : 0), [analyser]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        if (analyser) {
            analyser.getByteFrequencyData(dataArray);
        }

        const time = state.clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            // Map Particle Index to Frequency Bin
            // We have ~1000 particles, freq bins ~256 or 512.
            // Simple mapping:
            let freqVal = 0;
            if (analyser) {
                const bin = i % dataArray.length;
                freqVal = dataArray[bin] / 255.0; // 0 to 1
            }

            // Base Wave
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];

            // New Y
            // Sine wave moving in Z + Audio reaction
            const waveY = Math.sin(x * 0.1 + time) * Math.cos(z * 0.1 + time) * 2;
            const audioY = freqVal * 10;

            positions[i * 3 + 1] = waveY + audioY;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#00ff41"
                size={0.8}
                sizeAttenuation
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};
