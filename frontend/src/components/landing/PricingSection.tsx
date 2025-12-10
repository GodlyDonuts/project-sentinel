import React from 'react';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Feature = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3 text-zinc-300 text-sm font-mono">
        <Check size={16} className="text-sentinel-green shrink-0 mt-0.5" />
        <span>{children}</span>
    </li>
);

interface PriceCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    isPro: boolean;
    onAction: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, price, description, features, isPro, onAction }) => (
    <motion.div
        className={`flex flex-col p-8 rounded-xl backdrop-blur-sm transition-all duration-500
            ${isPro
                ? 'bg-black/60 border-2 border-sentinel-green/50 shadow-neon-green/30'
                : 'bg-black/40 border border-white/10'
            }
        `}
        whileHover={{ scale: 1.03, zIndex: 10 }}
    >
        <h3 className="font-display text-2xl font-bold tracking-wider mb-2 text-white">{title}</h3>
        <p className="text-zinc-500 text-sm mb-6">{description}</p>

        <div className="text-4xl font-mono font-bold mb-8">
            {price}
            {!isPro && <span className="text-lg text-zinc-600">/mo</span>}
            {isPro && <span className="text-lg text-sentinel-green">/mo</span>}
        </div>

        <ul className="space-y-4 flex-1 mb-8">
            {features.map((f, i) => <Feature key={i}>{f}</Feature>)}
        </ul>

        <button
            onClick={onAction}
            className={`w-full text-center py-3 rounded-md font-bold transition-colors duration-300 flex items-center justify-center gap-2
                ${isPro
                    ? 'bg-sentinel-green text-black hover:bg-white hover:shadow-neon-green'
                    : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
                }
            `}
        >
            {isPro ? <>ACCESS LEVEL ONE <Lock size={16} /></> : <>INITIATE STANDARD <ChevronRight size={16} /></>}
        </button>
    </motion.div>
);


export const PricingSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-black/50 relative z-10 border-t border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-sm font-mono text-sentinel-green mb-3 tracking-[0.3em]">CLEARANCE LEVELS</h2>
                <h1 className="text-5xl font-display font-bold text-white mb-16">
                    Activate Your Sentinel Protocol
                </h1>

                <div className="grid md:grid-cols-3 gap-10 text-left">
                    {/* Standard Tier */}
                    <PriceCard
                        title="Standard Protocol"
                        price="$0"
                        description="Core protection for basic defense."
                        features={[
                            "Up to 3 sessions per month",
                            "Base AI threat model",
                            "Basic transcript logging",
                            "1-hour evidence retention",
                        ]}
                        isPro={false}
                        onAction={() => navigate('/login')}
                    />

                    {/* Professional Tier (Highlighted) */}
                    <PriceCard
                        title="Sentinel One"
                        price="$9.99"
                        description="Enterprise-grade, real-time threat neutralization."
                        features={[
                            "Unlimited sessions & usage",
                            "Advanced zero-day threat detection",
                            "Secure Raindrop SmartBucket storage",
                            "Full forensic evidence locker",
                            "Priority system access",
                        ]}
                        isPro={true}
                        onAction={() => navigate('/login?upgrade=true')} // Pass intent to upgrade
                    />

                    {/* Enterprise Tier (Placeholder for future scale) */}
                    <PriceCard
                        title="Blacksite (SSO)"
                        price="Custom"
                        description="Dedicated compliance and security team access."
                        features={[
                            "SSO/SAML integration (WorkOS)",
                            "Dedicated network instance",
                            "Custom LLM fine-tuning",
                            "24/7 Threat Analyst Support",
                        ]}
                        isPro={false}
                        onAction={() => window.location.href = 'mailto:sales@sentinel.ai'}
                    />
                </div>
            </div>
        </section>
    );
};
