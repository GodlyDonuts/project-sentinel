import React, { useState } from 'react';
import { Shield, Book, Code, Terminal, Server, Key, AlertCircle, Copy, Check } from 'lucide-react';

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative mt-4 mb-8 rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0a]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs font-mono text-zinc-500 uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                    {copied ? <Check size={12} className="text-sentinel-green" /> : <Copy size={12} />}
                    {copied ? 'COPIED' : 'COPY'}
                </button>
            </div>
            {/* Code */}
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-xs md:text-sm text-zinc-300 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export const Docs: React.FC = () => {
    const [activeSection, setActiveSection] = useState('intro');

    const scrollTo = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-sentinel-green selection:text-black relative overflow-hidden">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 z-0" />

            {/* Navigation Sidebar */}
            <div className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/10 bg-[#050505]/95 backdrop-blur-xl z-50 hidden md:flex flex-col">
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Shield className="text-sentinel-green" size={24} />
                        <span className="font-display font-bold text-lg tracking-wider">GUIDE</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div>
                        <h4 className="text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest pl-2">Getting Started</h4>
                        <ul className="space-y-1">
                            <li>
                                <button onClick={() => scrollTo('intro')} className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${activeSection === 'intro' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
                                    Introduction
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo('auth')} className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${activeSection === 'auth' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
                                    Authentication
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo('rate-limits')} className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${activeSection === 'rate-limits' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
                                    Rate Limits & Quotas
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest pl-2">Core Resources</h4>
                        <ul className="space-y-1">
                            <li>
                                <button onClick={() => scrollTo('analyze')} className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${activeSection === 'analyze' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
                                    /v1/audio/analyze
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo('stream')} className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${activeSection === 'stream' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
                                    /v1/stream
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollTo('webhooks')} className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${activeSection === 'webhooks' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
                                    Webhooks
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest pl-2">Support</h4>
                        <ul className="space-y-1">
                            <li>
                                <button onClick={() => scrollTo('errors')} className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${activeSection === 'errors' ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-white'}`}>
                                    Error Codes
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <div className="w-2 h-2 rounded-full bg-sentinel-green animate-pulse" />
                        API STATUS: OPERATIONAL
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="md:pl-64 relative z-10">
                <div className="max-w-4xl mx-auto px-8 py-20 pb-40">

                    {/* Header */}
                    <div className="mb-20">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-2 py-1 border border-sentinel-green/30 bg-sentinel-green/10 text-sentinel-green text-[10px] font-mono rounded tracking-wider">
                                V1.2.0 DOCUMENTATION
                            </span>
                        </div>
                        <h1 className="font-display font-bold text-5xl md:text-6xl tracking-tight text-white mb-6">
                            Sentinel API
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed font-light max-w-2xl">
                            Integrate military-grade audio threat detection directly into your applications.
                            Detect fraud, social engineering, and deepfakes in real-time with sub-50ms latency.
                        </p>
                    </div>

                    {/* SECTIONS */}

                    {/* 1. Intro */}
                    <section id="intro" className="mb-24 pt-20 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <Book className="text-sentinel-green" />
                            <h2 className="text-2xl font-bold font-display tracking-wider">Introduction</h2>
                        </div>
                        <p className="text-zinc-400 mb-6 leading-relaxed">
                            The Sentinel API provides programmatic access to our acoustic analysis engine.
                            It is designed for high-throughput environments—call centers, financial transaction verifications, and secure communication channels.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="flex items-center gap-2 font-mono text-white mb-2">
                                    <Server size={16} className="text-blue-400" /> Real-time WebSocket
                                </h3>
                                <p className="text-sm text-zinc-500">Full-duplex streaming for live call interception and analysis.</p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                                <h3 className="flex items-center gap-2 font-mono text-white mb-2">
                                    <Code size={16} className="text-purple-400" /> REST Analysis
                                </h3>
                                <p className="text-sm text-zinc-500">Async processing for recorded audio files and evidence review.</p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Authentication */}
                    <section id="auth" className="mb-24 pt-20 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <Key className="text-sentinel-green" />
                            <h2 className="text-2xl font-bold font-display tracking-wider">Authentication</h2>
                        </div>
                        <p className="text-zinc-400 mb-6 leading-relaxed">
                            Authenticate your requests using the <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-xs">Authorization</code> header
                            with your project's secret key. Never share your secret keys in client-side code.
                        </p>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 mb-8">
                            <AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-yellow-500 text-sm font-bold mb-1">Security Warning</h4>
                                <p className="text-yellow-500/80 text-xs">Your API keys carry full administrative privileges. Rotate them immediately via the Developer Console if you suspect a leak.</p>
                            </div>
                        </div>

                        <CodeBlock language="BASH" code={`curl https://api.project-sentinel.ai/v1/audio/analyze \\
  -H "Authorization: Bearer sk_live_8f7a2..." \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@recording.wav"`} />
                    </section>

                    {/* 3. Endpoint: /analyze */}
                    <section id="analyze" className="mb-24 pt-20 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-xs font-bold">POST</div>
                            <h2 className="text-2xl font-bold font-display tracking-wider">/v1/audio/analyze</h2>
                        </div>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Uploads an audio file for asynchronous threat analysis. Supports WAV, MP3, FLAC, and OGG formats up to 25MB.
                        </p>

                        <h3 className="text-lg font-bold text-white mb-4">Request Body</h3>
                        <div className="overflow-hidden rounded-lg border border-white/10 mb-8">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="bg-white/5 text-zinc-200 font-mono text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-white/10">Param</th>
                                        <th className="px-6 py-3 border-b border-white/10">Type</th>
                                        <th className="px-6 py-3 border-b border-white/10">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr>
                                        <td className="px-6 py-4 font-mono text-white">file</td>
                                        <td className="px-6 py-4 font-mono">binary</td>
                                        <td className="px-6 py-4">The audio file to be analyzed.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-mono text-white">context</td>
                                        <td className="px-6 py-4 font-mono">json</td>
                                        <td className="px-6 py-4">Optional metadata about the call (e.g. caller_id).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-4">Example Request</h3>
                        <CodeBlock language="PYTHON" code={`import requests

url = "https://api.project-sentinel.ai/v1/audio/analyze"
headers = {"Authorization": "Bearer sk_live_..."}
files = {"file": open("threat_sample.wav", "rb")}

response = requests.post(url, headers=headers, files=files)
print(response.json())`} />

                        <h3 className="text-lg font-bold text-white mb-4">Response Object</h3>
                        <CodeBlock language="JSON" code={`{
  "id": "evt_9a8b7c6d",
  "threat_score": 0.94,
  "verdict": "CRITICAL",
  "detected_patterns": [
    "URGENCY_CREATION",
    "FINANCIAL_COERCION"
  ],
  "confidence": 0.98,
  "processing_time_ms": 142
}`} />
                    </section>

                    {/* 4. Endpoint: /stream */}
                    <section id="stream" className="mb-24 pt-20 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-xs font-bold">WSS</div>
                            <h2 className="text-2xl font-bold font-display tracking-wider">/v1/stream</h2>
                        </div>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Establish a persistent WebSocket connection for real-time audio streaming. Send binary audio chunks (PCM 16-bit, 16kHz recommended)
                            and receive JSON threat updates instantly.
                        </p>

                        <CodeBlock language="JAVASCRIPT" code={`const ws = new WebSocket('wss://api.project-sentinel.ai/v1/stream');

ws.onopen = () => {
    // Authenticate immediately upon connection
    ws.send(JSON.stringify({ type: 'auth', token: 'sk_live_...' }));
};

// Stream audio chunks from microphone
mediaRecorder.ondataavailable = (e) => {
    ws.send(e.data);
};

ws.onmessage = (e) => {
    const analysis = JSON.parse(e.data);
    if (analysis.is_threat) {
        console.warn("THREAT DETECTED:", analysis.score);
    }
};`} />
                    </section>

                    {/* 5. Webhooks */}
                    <section id="webhooks" className="mb-24 pt-20 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <Terminal className="text-sentinel-green" />
                            <h2 className="text-2xl font-bold font-display tracking-wider">Webhooks</h2>
                        </div>
                        <p className="text-zinc-400 mb-6 font-light">
                            Receive HTTP POST callbacks whenever a significant threat event occurs in your monitored channels.
                            Configure your destination URL in the Developer Console.
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs font-mono px-2 py-1 bg-white/10 rounded text-white">fraud.detected</span>
                            </div>
                            <p className="text-sm text-zinc-400">Triggered when threat confidence exceeds 85%.</p>
                        </div>
                    </section>

                    {/* 6. Errors */}
                    <section id="errors" className="mb-24 pt-20 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <AlertCircle className="text-red-500" />
                            <h2 className="text-2xl font-bold font-display tracking-wider">Error Codes</h2>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-white/10">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <tbody className="divide-y divide-white/5">
                                    <tr className="bg-red-500/5">
                                        <td className="px-6 py-4 font-mono text-red-400">401 Unauthorized</td>
                                        <td className="px-6 py-4">Invalid or missing API key.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-mono text-white">402 Payment Required</td>
                                        <td className="px-6 py-4">API quota exceeded or subscription lapsed.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-mono text-white">429 Too Many Requests</td>
                                        <td className="px-6 py-4">Rate limit exceeded (Default: 500 req/min).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
