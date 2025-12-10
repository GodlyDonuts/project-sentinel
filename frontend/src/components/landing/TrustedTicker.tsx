import { motion } from 'framer-motion';

const PARTNERS = [
    "CYBER_ALLIANCE", "NOVA_FINANCIAL", "ELDER_GUARD_SYSTEMS", "SECURE_VOICE_ALLIANCE", "GLOBAL_FRAUD_TASKFORCE", "NET_WATCH_PRO"
];

export const TrustedTicker = () => {
    return (
        <div className="w-full border-y border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden py-4 relative z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

            <div className="flex select-none">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex gap-12 whitespace-nowrap"
                >
                    {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
                        <div key={i} className="flex items-center gap-4 text-gray-500 font-mono text-sm tracking-widest opacity-70">
                            <span className="w-2 h-2 bg-sentinel-green/50 rounded-full animate-pulse" />
                            {partner}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
