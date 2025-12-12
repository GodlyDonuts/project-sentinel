import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, CheckCircle, X } from 'lucide-react';
import { HoloCard } from '../ui/HoloCard';
import { sentinelStripeTheme } from '../../config/stripeTheme';
import { useSoundEffects } from '../../hooks/useSoundEffects';

// Initialize Stripe (Move key to env)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
    console.error("Stripe Publishable Key is missing! Check your .env file.");
}
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckoutForm = ({ onSuccess, onCancel, userId }: { onSuccess: () => void, onCancel: () => void, userId: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { playClick, playConfirm, playAlert } = useSoundEffects();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        playClick();

        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return to dashboard after success
                return_url: `${window.location.origin}/dashboard?payment_success=true`,
            },
            redirect: "if_required", // Try to avoid redirect if possible
        });

        if (submitError) {
            playAlert();
            setError(submitError.message || "Payment Failed");
            setLoading(false);
        } else {
            // Payment confirmed! Now update WorkOS metadata
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/success`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (response.ok) {
                    playConfirm();
                    onSuccess();
                } else {
                    console.error("Failed to update user status");
                    // Still show success for payment, but maybe log error
                    onSuccess();
                }
            } catch (e) {
                console.error("Network error updating status", e);
                onSuccess();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement options={{ layout: 'tabs' }} />

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-mono rounded flex items-center gap-2">
                    <Shield size={14} /> {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-32 py-3 border border-white/10 rounded text-zinc-500 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-xs tracking-widest uppercase font-mono"
                >
                    Abort
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="flex-1 bg-sentinel-green text-black font-bold py-3 rounded hover:bg-white hover:shadow-neon-green transition-all uppercase tracking-wide text-xs flex items-center justify-center gap-1.5"
                >
                    {loading ? <span className="animate-spin">⟳</span> : <div className="flex items-center gap-1.5"><Lock size={12} strokeWidth={3} /> <span>AUTHORIZE TRANSACTION</span></div>}
                </button>
            </div>
        </form>
    );
};

interface PaymentGatewayProps {
    clientSecret: string;
    onClose: () => void;
    userId: string;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ clientSecret, onClose, userId }) => {
    const [success, setSuccess] = useState(false);

    // Close on backdrop click (but not content click)
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Success State UI
    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={handleBackdropClick}>
                <HoloCard className="max-w-md w-full p-8 border-sentinel-green/50 bg-black/80 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-20 h-20 bg-sentinel-green/20 rounded-full flex items-center justify-center mb-6 text-sentinel-green"
                    >
                        <CheckCircle size={40} />
                    </motion.div>
                    <h2 className="text-2xl font-display text-white mb-2">ACCESS GRANTED</h2>
                    <p className="text-gray-400 font-mono text-sm mb-6">Sentinel One clearance level verified.</p>
                    <button onClick={onClose} className="bg-sentinel-green text-black px-8 py-2 rounded font-bold uppercase tracking-widest text-xs">
                        Enter Console
                    </button>
                </HoloCard>
            </div>
        );
    }

    // Payment Form UI
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={handleBackdropClick}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg relative"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute -top-10 right-0 p-2 text-white/50 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <HoloCard className="p-1 border-white/10 bg-black max-h-[85vh] flex flex-col">
                    {/* Header Bar */}
                    <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2 text-sentinel-green">
                            <CreditCard size={18} />
                            <span className="font-display font-bold tracking-widest text-sm">SECURE GATEWAY</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="p-8 bg-black/50 overflow-y-auto no-scrollbar">
                        <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-sentinel-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="text-white font-display font-bold text-2xl tracking-[0.1em] uppercase mb-1 drop-shadow-md">Sentinel One</h3>
                                    <div className="flex items-center gap-2 text-xs text-sentinel-green/80 font-mono tracking-wider uppercase mb-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-sentinel-green animate-pulse" />
                                        Monthly Subscription
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-[10px] text-zinc-500 bg-black/50 px-2 py-1 rounded border border-white/5">AES-256</span>
                                        <span className="text-[10px] text-zinc-500 bg-black/50 px-2 py-1 rounded border border-white/5">NO_LOGS</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-mono text-sentinel-green font-bold drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]">$9.99</div>
                                    <div className="text-[10px] text-zinc-500 font-mono mt-1">/ MONTH</div>
                                </div>
                            </div>
                        </div>

                        {clientSecret && stripePromise && (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: sentinelStripeTheme }}>
                                <CheckoutForm onSuccess={() => setSuccess(true)} onCancel={onClose} userId={userId} />
                            </Elements>
                        )}
                        {(!stripePromise) && (
                            <div className="text-red-500 font-mono text-xs p-4 border border-red-500/20 rounded">
                                SYSTEM ERROR: PAYMENT_PROVIDER_OFFLINE (Missing API Key)
                            </div>
                        )}
                    </div>
                </HoloCard>
            </motion.div>
        </div>
    );
};
