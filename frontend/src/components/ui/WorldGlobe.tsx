import { useEffect, useRef, useMemo } from 'react';
import createGlobe from 'cobe';
import { useSpring } from 'react-spring';

interface WorldGlobeProps {
    threatScore: number;
    isActive?: boolean;
    isGhostMode?: boolean;
}

export const WorldGlobe = ({ threatScore, isActive = false, isGhostMode = false }: WorldGlobeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);

    const phiRef = useRef(0);

    // 1. SPRING PHYSICS
    // Standard physics, no chaotic jumping based on speed, but keep the subtle threat glitch if needed
    // User said "don't make it speed up", implying stability.
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 60,
            precision: 0.001,
        },
    }));

    // 2. DETERMINE VISUAL STATE
    // Priority: Ghost -> Threat -> Active -> Idle
    const visualState = useMemo(() => {
        if (isGhostMode) return 'GHOST';
        if (threatScore > 0.5) return 'THREAT';
        if (isActive) return 'ACTIVE';
        return 'IDLE';
    }, [isGhostMode, threatScore, isActive]);

    const glowColors = {
        IDLE: [0.1, 0.1, 0.1],      // Dim / No Glow
        ACTIVE: [0, 1, 0.41],       // Sentinel Green
        THREAT: [1, 0.2, 0.2],      // Red
        GHOST: [0.6, 0.2, 1]        // Purple
    };

    // CSS Gradients for the backdrop
    const backdropGradients = {
        IDLE: 'none',
        ACTIVE: 'radial-gradient(circle, rgba(0,255,65,0.15) 0%, transparent 60%)',
        THREAT: 'radial-gradient(circle, rgba(255,0,60,0.15) 0%, transparent 60%)',
        GHOST: 'radial-gradient(circle, rgba(160, 32, 240, 0.2) 0%, transparent 60%)'
    };

    const currentGlow = glowColors[visualState];
    const currentBackdrop = backdropGradients[visualState];

    useEffect(() => {
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: phiRef.current,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 20000,
            mapBrightness: 8,

            baseColor: [0.1, 0.11, 0.13],

            // Marker color - matches the glow
            markerColor: currentGlow as [number, number, number],

            // Atmosphere Glow
            glowColor: currentGlow as [number, number, number],

            // Markers: Empty array to remove "locational green dots"
            markers: [],

            onRender: (state) => {
                // Stabilized Rotation
                const baseSpeed = 0.003; // Constant majestic speed

                // Combine auto-rotation with user drag (r.get())
                state.phi = phiRef.current + r.get();
                phiRef.current += baseSpeed;

                state.width = width * 2;
                state.height = width * 2;
            },
        });

        setTimeout(() => (canvasRef.current!.style.opacity = '1'));
        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [visualState, r]); // Re-create globe if visual state changes colors

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            placeItems: 'center',
            placeContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* CINEMATIC BACKLIGHTING */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '140%',
                    height: '140%',
                    background: currentBackdrop,
                    zIndex: 0,
                    pointerEvents: 'none',
                    transition: 'background 1s ease'
                }}
            />

            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '1000px',
                    aspectRatio: '1',
                    opacity: 0,
                    transition: 'opacity 1s ease',
                    position: 'relative',
                    zIndex: 10,
                    // Keep the threat shake if needed, or remove if "janky" applied to everything. 
                    // User only complained about speed up. I'll keep the shake for Threat/Ghost for impact.
                    animation: 'none'
                }}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({ r: delta / 200 });
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({ r: delta / 100 });
                    }
                }}
            />
        </div>
    );
};