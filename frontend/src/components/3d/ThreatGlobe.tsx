import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ThreatGlobeProps {
    threatLevel: number; // 0 to 1
}

const AnimatedSphere: React.FC<{ threatLevel: number }> = ({ threatLevel }) => {
    const sphereRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (sphereRef.current) {
            // Base rotation
            sphereRef.current.rotation.y += 0.005;

            // React to threat: faster rotation or shake could go here
            if (threatLevel > 0.5) {
                sphereRef.current.rotation.y += 0.01;
            }
        }
    });

    // Interpolate color based on threat level
    // Simple logic: Green if low, Red if high
    const color = threatLevel > 0.5 ? '#ff003c' : '#00ff41';

    return (
        <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.2}>
            <MeshDistortMaterial
                color={color}
                wireframe
                distort={0.3 + (threatLevel * 0.5)} // More distortion with higher threat
                speed={1.5 + (threatLevel * 2)} // Faster movement with higher threat
                roughness={0}
                metalness={0.8}
            />
        </Sphere>
    );
};

export const ThreatGlobe: React.FC<ThreatGlobeProps> = ({ threatLevel }) => {
    return (
        <div className="w-full h-full min-h-[300px] relative">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
                {/* Much stronger lighting */}
                <ambientLight intensity={2.0} />
                <pointLight position={[10, 10, 10]} intensity={2.5} color="#00ff41" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#0044ff" />

                <AnimatedSphere threatLevel={threatLevel} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};
