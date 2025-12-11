import React, { useState, useRef, useEffect } from 'react';
import { Shield, Send, Terminal, Cpu } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
}

export const HelpAgent: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'agent',
            content: 'Sentinel System Core initialized. I am your operational guide for Project Sentinel. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/help/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content }),
            });

            if (!response.ok) throw new Error('System communication failure');

            const data = await response.json();

            const agentMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, agentMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: 'ERROR: Connection to System Core severed. Please verify network or API configuration.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#050505] text-white font-sans selection:bg-sentinel-green selection:text-black overflow-hidden flex flex-col relative">

            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 z-0" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md p-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="text-sentinel-green" size={24} />
                    <div>
                        <h1 className="font-display font-bold text-lg tracking-[0.2em] text-white">
                            SENTINEL AID
                        </h1>
                        <p className="text-[10px] font-mono text-sentinel-green/60 tracking-widest leading-none">
                            SYSTEM CORE AI // GEMINI-1.5-FLASH
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono">
                    <div className="w-1.5 h-1.5 rounded-full bg-sentinel-green animate-pulse" />
                    ONLINE
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 relative z-10 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'agent' && (
                                <div className="w-8 h-8 rounded bg-sentinel-green/10 border border-sentinel-green/30 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Cpu size={16} className="text-sentinel-green" />
                                </div>
                            )}

                            <div className={`max-w-[80%] rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${msg.role === 'user'
                                    ? 'bg-white/10 border border-white/20 text-white rounded-tr-none'
                                    : 'bg-[#0a0a0a] border border-sentinel-green/20 text-gray-300 rounded-tl-none shadow-[0_0_15px_rgba(0,255,65,0.05)]'
                                }`}>
                                {msg.content}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Terminal size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 justify-start">
                            <div className="w-8 h-8 rounded bg-sentinel-green/10 border border-sentinel-green/30 flex items-center justify-center flex-shrink-0 mt-1">
                                <Cpu size={16} className="text-sentinel-green" />
                            </div>
                            <div className="flex items-center gap-2 p-4 bg-[#0a0a0a] border border-sentinel-green/20 rounded-lg rounded-tl-none">
                                <span className="w-1.5 h-1.5 bg-sentinel-green rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-sentinel-green rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-sentinel-green rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <footer className="relative z-10 p-4 md:p-6 bg-[#050505] border-t border-white/10">
                <div className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Query System Core..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 pr-12 text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-sentinel-green/50 focus:bg-white/10 transition-all shadow-inner"
                        autoFocus
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded bg-sentinel-green/10 text-sentinel-green hover:bg-sentinel-green hover:text-black transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-sentinel-green"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </footer>
        </div>
    );
};
