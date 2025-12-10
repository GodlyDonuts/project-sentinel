
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

    useFrame(() => {
        if (!mesh.current) return;

        // Global speed multiplier based on auth status
        const speedMult = accelerate ? 20 : 1;

        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;

            // Move particles towards camera (Z axis)
            particle.t += speed * speedMult;
            t = particle.t;

            // Circular motion + Forward motion
            const s = Math.cos(t);
            const posZ = (z + t * factor) % 100 - 50; // Loop z from -50 to 50

            dummy.position.set(
                x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                posZ
            );

            // Scale down as they get far away, scale up as they get close (warp effect)
            const scale = accelerate ? Math.max(0.1, (posZ + 50) / 10) : 1;
            dummy.scale.set(scale, scale, scale);

            dummy.rotation.set(s * 5, s * 5, s * 5);
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
