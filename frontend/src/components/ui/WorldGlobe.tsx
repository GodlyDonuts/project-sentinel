import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { useSpring } from 'react-spring'; // Optional, but cobe handles smooth movements well

export const WorldGlobe = ({ threatScore }: { threatScore: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 3,
            mapSamples: 12000,
            mapBrightness: 1.2,
            baseColor: [0.1, 0.1, 0.1],
            markerColor: threatScore > 0.5 ? [1, 0, 0] : [0, 1, 0.5], // Red if threat, Green/Teal if safe
            glowColor: [0.1, 0.1, 0.1],
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 }, // SF
                { location: [40.7128, -74.0060], size: 0.03 }, // NY
                { location: [51.5074, -0.1278], size: 0.03 }, // London
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi + r.get();
                phi += 0.005; // Auto rotation speed
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        setTimeout(() => (canvasRef.current!.style.opacity = '1'));
        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [threatScore]); // Re-init if threat score changes color logic significantly

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', placeItems: 'center', placeContent: 'center', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', maxWidth: '1000px', aspectRatio: '1', opacity: 0, transition: 'opacity 1s ease' }}
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
