import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketProps {
    onAudioData: (blob: Blob) => void;
    onTranscriptUpdate?: (text: string, isFinal: boolean) => void;
}

export const useWebSocket = ({ onAudioData, onTranscriptUpdate }: WebSocketProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isThreat, setIsThreat] = useState(false);
    const [threatReason, setThreatReason] = useState('');
    const [threatScore, setThreatScore] = useState(0);
    const ws = useRef<WebSocket | null>(null);

    // Refs to keep callbacks stable without triggering re-connection
    const onAudioDataRef = useRef(onAudioData);
    const onTranscriptUpdateRef = useRef(onTranscriptUpdate);

    useEffect(() => {
        onAudioDataRef.current = onAudioData;
        onTranscriptUpdateRef.current = onTranscriptUpdate;
    }, [onAudioData, onTranscriptUpdate]);

    // Debug Triggers
    useEffect(() => {
        (window as any).triggerThreat = (score: number = 0.95) => {
            console.log("⚠️ MANUAL THREAT TRIGGERED");
            setThreatScore(score);
            setIsThreat(true);
            setThreatReason("Manual Console Trigger");
        };

        (window as any).clearThreat = () => {
            console.log("✅ THREAT CLEARED");
            setThreatScore(0);
            setIsThreat(false);
            setThreatReason("");
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let heartbeatInterval: ReturnType<typeof setInterval>;
        let socket: WebSocket | null = null;

        const connect = () => {
            if (!isMounted) return;
            if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
                return;
            }

            const apiUrl = import.meta.env.VITE_AI_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
            const wsUrl = `${wsProtocol}://${apiUrl.replace(/^https?:\/\//, '')}/ws/monitor`;

            console.log('Connecting to WebSocket:', wsUrl);
            socket = new WebSocket(wsUrl);
            ws.current = socket;

            socket.onopen = () => {
                if (!isMounted) return;
                console.log('Connected to Sentinel Backend');
                setIsConnected(true);

                heartbeatInterval = setInterval(() => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send("PING");
                    }
                }, 30000);
            };

            socket.onmessage = async (event) => {
                if (!isMounted) return;
                if (event.data === "PONG") return;

                if (event.data instanceof Blob) {
                    if (onAudioDataRef.current) {
                        onAudioDataRef.current(event.data);
                    }
                } else {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('WS Message Received:', data); // DEBUG LOG

                        // Handle Transcript Updates from Whisper
                        if (data.transcript_update && onTranscriptUpdateRef.current) {
                            onTranscriptUpdateRef.current(data.transcript_update, data.is_final || false);
                        }

                        // Handle Threat Analysis
                        if (data.analysis) {
                            console.log('Processing Threat Analysis:', data.analysis); // DEBUG LOG
                            if (typeof data.analysis.confidence === 'number') {
                                setThreatScore(data.analysis.confidence);
                                console.log('Threat Score Updated:', data.analysis.confidence);
                            }
                            if (data.analysis.is_threat) {
                                setIsThreat(true);
                                setThreatReason(data.analysis.reason);
                                console.log('Threat Detected:', data.analysis.reason);
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing WebSocket message:', e);
                    }
                }
            };

            socket.onclose = () => {
                console.log('Disconnected');
                if (isMounted) {
                    setIsConnected(false);
                    clearInterval(heartbeatInterval);
                    reconnectTimeout = setTimeout(() => {
                        if (isMounted) {
                            console.log('Attempting to reconnect...');
                            connect();
                        }
                    }, 3000);
                }
            };
        };

        connect();

        return () => {
            isMounted = false;
            if (socket) socket.close();
            clearTimeout(reconnectTimeout);
            clearInterval(heartbeatInterval);
        };
    }, []); // Empty dependency array = connect on mount only

    const sendMessage = useCallback((msg: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(msg);
        }
    }, []);

    const sendAudio = useCallback((audioBlob: Blob) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(audioBlob);
        }
    }, []);

    return {
        isConnected,
        isThreat,
        setIsThreat,
        threatReason,
        threatScore,
        setThreatScore, // Expose setter
        sendMessage,
        sendAudio,
        wsRef: ws
    };
};
