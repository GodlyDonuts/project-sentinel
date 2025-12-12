
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({ accelerate }: { accelerate: boolean }) => {
    const count = 2000;
    const mesh = useRef<THREE.InstancedMesh>(null);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = new THREE.Object3D();

    // Use a ref to store current speed factor for smooth interpolation
    const currentSpeedRef = useRef(1);

    useFrame((_, delta) => {
        if (!mesh.current) return;

        // Smoothly interpolate speed factor: Target 1.0 vs 8.0 (was 20)
        const targetSpeed = accelerate ? 8 : 1;
        currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, targetSpeed, delta * 2);

        const speedMult = currentSpeedRef.current;

        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;

            // Move particles towards camera (Z axis)
            particle.t += speed * speedMult;
            t = particle.t;

            // Reduce wobble when accelerating to create a "focused tunnel" effect
            const wobbleDampener = accelerate ? 0.2 : 1; // dampen noise by 80% when fast

            const posZ = (z + t * factor) % 100 - 50; // Loop z from -50 to 50

            dummy.position.set(
                x + (Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10) * wobbleDampener,
                y + (Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10) * wobbleDampener,
                posZ
            );

            // Subtle Scale: Don't grow huge, just slightly larger brightness feel
            const scale = 1 + (speedMult - 1) * 0.1;
            dummy.scale.set(scale, scale, scale);

            // Simple rotation based on t
            const r = t * 0.5;
            dummy.rotation.set(r, r, r);
            dummy.updateMatrix();

            if (mesh.current) {
                mesh.current.setMatrixAt(i, dummy.matrix);
            }
        });
        if (mesh.current) {
            mesh.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color="#00ff41" transparent opacity={0.4} />
        </instancedMesh>
    );
};

export const SecurityField = ({ accelerate }: { accelerate: boolean }) => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                <fog attach="fog" args={['#050505', 10, 50]} />
                <ParticleField accelerate={accelerate} />
            </Canvas>
        </div>
    );
};
