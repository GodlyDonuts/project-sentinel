import { useEffect, useRef } from 'react';

type TranscriptUpdate = (text: string, isFinal: boolean) => void;
type ThreatTrigger = (score: number) => void;

interface SimulationConfig {
    onTranscriptUpdate: TranscriptUpdate;
    onTriggerThreat: ThreatTrigger;
    onStart: () => void;
}

const SCAM_SCRIPT = [
    { speaker: 'Scammer', text: "Hello? Is this Mrs. Margaret Dawson?", delay: 2000 },
    { speaker: 'Victim', text: "Yes, this is she. Who is calling, please?", delay: 3500 },
    { speaker: 'Scammer', text: "Ma'am, this is Officer James Wilson from the Social Security Administration.", delay: 3000 },
    { speaker: 'Scammer', text: "I'm calling because we've detected some very suspicious activity on your account.", delay: 4000 },
    { speaker: 'Victim', text: "Oh my heavens! Suspicious activity? I just went to the grocery store yesterday...", delay: 4500 },
    { speaker: 'Scammer', text: "It's much more serious than that, ma'am. We believe your identity has been stolen.", delay: 4000 },
    { speaker: 'Scammer', text: "There is an active warrant out for your arrest due to money laundering connected to your SSN.", delay: 5000 },
    { speaker: 'Victim', text: "Arrest?! Money laundering? Officer, I'm 82 years old! I don't even know how to use the internet!", delay: 5000 },
    { speaker: 'Victim', text: "Please, I can't go to jail. My cat needs me. What can I do?", delay: 4000 },
    { speaker: 'Scammer', text: "We can resolve this right now, but you need to cooperate fully. Do not tell anyone.", delay: 4500 },
    { speaker: 'Scammer', text: "To clear the warrant, we need to secure your remaining assets into a government safe locker.", delay: 5000 },
    { speaker: 'Scammer', text: "I need you to go to the store and purchase $2000 worth of Target Gift Cards.", delay: 4500 },
    // THREAT TRIGGER HAPPENS HERE
];

export const useScamSimulation = ({ onTranscriptUpdate, onTriggerThreat, onStart }: SimulationConfig) => {
    const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    const runSimulation = () => {
        console.log("⚠️ SIMULATION SEQUENCE INITIATED: T-MINUS 5 SECONDS");
        onStart();

        // Clear any existing timeouts
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];

        // Initial 5s countdown
        const startDelay = 5000;
        let cumulativeDelay = startDelay;

        SCAM_SCRIPT.forEach((line, index) => {
            // Typing/Speaking simulation (Interim results)
            const typingDuration = line.text.length * 30; // roughly 30ms per char

            // Start "speaking"
            const startTyping = setTimeout(() => {
                onTranscriptUpdate(line.text + "...", false);
            }, cumulativeDelay);

            // Finish "speaking" (Final result)
            const finishTyping = setTimeout(() => {
                // Changed here: removed `${line.speaker}: ` prefix
                onTranscriptUpdate(line.text, true);

                // Trigger threat on the last line
                if (index === SCAM_SCRIPT.length - 1) {
                    console.log("🚨 SIMULATION THREAT TRIGGERED");
                    onTriggerThreat(0.99);
                }
            }, cumulativeDelay + typingDuration);

            timeoutRefs.current.push(startTyping, finishTyping);

            // Add pause between lines
            cumulativeDelay += typingDuration + line.delay;
        });
    };

    useEffect(() => {
        // Expose to window
        (window as any).startScamDemo = runSimulation;
        console.log("👻 GHOST PROTOCOL LOADED: Run window.startScamDemo() to execute.");

        return () => {
            timeoutRefs.current.forEach(clearTimeout);
            delete (window as any).startScamDemo;
        };
    }, []);

    return { runSimulation };
};