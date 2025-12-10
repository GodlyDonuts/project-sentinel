import React from 'react';

interface ThemeItem {
    name: string;
    value: number;
}

interface ThreatThemesViewProps {
    data: ThemeItem[];
}

export const ThreatThemesView: React.FC<ThreatThemesViewProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-xs text-gray-600 font-mono tracking-widest uppercase">
                No Active Threats Detected
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full justify-center p-2">
            {data.map((item) => (
                <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs uppercase tracking-wider">
                        <span className="text-gray-300">{item.name}</span>
                        <span className="font-mono text-sentinel-red">{item.value.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-sentinel-red transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                        />
                    </div>
                </div>
            ))}
            <div className="mt-2 text-[10px] text-gray-500 font-mono text-right">
                ANALYSIS CONFIDENCE: 98.4%
            </div>
        </div>
    );
};
