import { motion } from 'framer-motion';
import { Database, Brain, Wifi, ShieldCheck } from 'lucide-react';

const TechNode = ({ icon: Icon, title, desc, delay, color = "text-sentinel-green" }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative flex flex-col items-center text-center p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md w-64 hover:border-sentinel-green/50 transition-colors group"
    >
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-b from-transparent to-white/20 group-hover:to-sentinel-green/50`} />

        <div className={`w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center mb-4 shadow-2xl relative z-10 ${color}`}>
            <Icon size={32} />
        </div>
        <h3 className="font-display font-bold text-lg mb-2 text-white">{title}</h3>
        <p className="text-xs text-gray-400 font-mono leading-relaxed">{desc}</p>

        {/* Connector Line Down */}
        <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-px h-10 bg-gradient-to-b from-white/20 to-transparent group-hover:from-sentinel-green/50`} />
    </motion.div>
);

export const ArchitectureDiagram = () => {
    return (
        <section className="py-32 relative z-10 overflow-hidden">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">The Neural Lace</h2>
                <p className="text-gray-400">Powered by next-gen liquid infrastructure.</p>
            </div>

            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 relative">
                {/* Connecting Line (Horizontal on Desktop) */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-sentinel-green/30 to-transparent hidden md:block" />

                <TechNode
                    icon={Wifi}
                    title="Ingest"
                    desc="Websocket Stream via FastAPI"
                    delay={0.1}
                />

                <TechNode
                    icon={Database}
                    title="Raindrop"
                    desc="LiquidMetal Ephemeral Storage"
                    color="text-blue-400"
                    delay={0.3}
                />

                <TechNode
                    icon={Brain}
                    title="Cerebras"
                    desc="Llama 3.3 70b Inference"
                    color="text-purple-400"
                    delay={0.5}
                />

                <TechNode
                    icon={ShieldCheck}
                    title="Sentinel"
                    desc="Real-time Intervention"
                    color="text-red-400"
                    delay={0.7}
                />
            </div>
        </section>
    );
};
