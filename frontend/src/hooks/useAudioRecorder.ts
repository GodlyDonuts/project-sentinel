import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderProps {
    onAudioData: (blob: Blob) => void;
    timeslice?: number; // Duration of each audio chunk in ms
}

export const useAudioRecorder = ({ onAudioData, timeslice = 2000 }: UseAudioRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    onAudioData(event.data);
                }
            };

            mediaRecorder.start(timeslice);
            setIsRecording(true);
            console.log('Microphone started');

        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    }, [onAudioData, timeslice]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current = null;
            setIsRecording(false);
            console.log('Microphone stopped');
        }
    }, []);

    return { isRecording, startRecording, stopRecording };
};
