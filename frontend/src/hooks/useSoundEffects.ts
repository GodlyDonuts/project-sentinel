import { useCallback } from 'react';
import { Howl } from 'howler';

// In a real app, these would point to actual files in /src/assets/sounds/
// For now, we'll placeholder them or rely on them being added later.
const SOUNDS = {
    click: new Howl({ src: ['/sounds/ui_click.mp3'], volume: 0.5 }),
    alert: new Howl({ src: ['/sounds/alert.wav'], volume: 0.8 }),
    hum: new Howl({ src: ['/sounds/hum_loop.mp3'], loop: true, volume: 0.1 }),
    hover: new Howl({ src: ['/sounds/hover.mp3'], volume: 0.2 }),
};

export const useSoundEffects = () => {
    const playSound = useCallback((soundName: keyof typeof SOUNDS) => {
        try {
            SOUNDS[soundName].play();
        } catch (e) {
            console.warn(`Failed to play sound: ${soundName}`, e);
        }
    }, []);

    const playClick = () => playSound('click');
    const playAlert = () => playSound('alert');
    const playHover = () => playSound('hover');
    const startHum = () => SOUNDS.hum.play();
    const stopHum = () => SOUNDS.hum.stop();

    const playConfirm = () => playSound('click'); // Re-use click for now

    return {
        playClick,
        playAlert,
        playHover,
        playConfirm,
        startHum,
        stopHum
    };
};
