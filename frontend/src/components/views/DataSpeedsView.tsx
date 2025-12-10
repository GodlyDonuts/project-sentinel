import { useEffect, useState } from 'react';
import { Activity, Zap, Server } from 'lucide-react';

export const DataSpeedsView = () => {
    const [stats, setStats] = useState({ latency: 45, throughput: 1.2, errors: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats({
                latency: 40 + Math.random() * 10,
                throughput: 1.0 + Math.random() * 0.5,
                errors: Math.floor(Math.random() * 1.05) // Mostly 0
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const Metric = ({ label, value, unit, icon: Icon, color }: any) => (
        <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded bg-${color}-500/10 text-${color}-500`}>
                    <Icon size={16} />
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
            </div>
            <div className="font-mono font-bold text-white">
                {value} <span className="text-gray-600 text-[10px]">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-2 h-full justify-center">
            <Metric label="Latency" value={stats.latency.toFixed(1)} unit="ms" icon={Zap} color="yellow" />
            <Metric label="Throughput" value={stats.throughput.toFixed(2)} unit="GB/s" icon={Activity} color="green" />
            <Metric label="Mem. Usage" value="24" unit="%" icon={Server} color="blue" />
        </div>
    );
};
