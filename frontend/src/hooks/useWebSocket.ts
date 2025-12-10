import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketProps {
    onAudioData: (blob: Blob) => void;
    onTranscriptUpdate?: (text: string) => void;
}

export const useWebSocket = ({ onAudioData, onTranscriptUpdate }: WebSocketProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isThreat, setIsThreat] = useState(false);
    const [threatReason, setThreatReason] = useState('');
    const [threatScore, setThreatScore] = useState(0);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let heartbeatInterval: ReturnType<typeof setInterval>;
        let socket: WebSocket | null = null;

        const connect = () => {
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
                console.log('Connected to Sentinel Backend');
                setIsConnected(true);

                heartbeatInterval = setInterval(() => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send("PING");
                    }
                }, 30000);
            };

            socket.onmessage = async (event) => {
                if (event.data === "PONG") return;

                if (event.data instanceof Blob) {
                    onAudioData(event.data);
                } else {
                    try {
                        const data = JSON.parse(event.data);

                        // Handle Transcript Updates from Whisper
                        if (data.transcript_update && onTranscriptUpdate) {
                            onTranscriptUpdate(data.transcript_update);
                        }

                        // Handle Threat Analysis
                        if (data.analysis) {
                            if (typeof data.analysis.confidence === 'number') {
                                setThreatScore(data.analysis.confidence);
                            }
                            if (data.analysis.is_threat) {
                                setIsThreat(true);
                                setThreatReason(data.analysis.reason);
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing WebSocket message:', e);
                    }
                }
            };

            socket.onclose = () => {
                console.log('Disconnected');
                setIsConnected(false);
                clearInterval(heartbeatInterval);
                reconnectTimeout = setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connect();
                }, 3000);
            };
        };

        connect();

        return () => {
            if (socket) socket.close();
            clearTimeout(reconnectTimeout);
            clearInterval(heartbeatInterval);
        };
    }, [onAudioData, onTranscriptUpdate]);

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
        sendMessage,
        sendAudio,
        wsRef: ws
    };
};
