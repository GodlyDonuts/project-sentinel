import { useState } from 'react';

export const useSubscription = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subscribe = async () => {
        setLoading(true);
        setError(null);

        // This price ID should ideally come from env or config. 
        // For now, we will expect it to be available in import.meta.env
        const priceId = import.meta.env.VITE_STRIPE_PRICE_ID;

        if (!priceId) {
            setError("Configuration Error: Missing Price ID");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to create checkout session');
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (err: any) {
            console.error("Subscription Error:", err);
            setError(err.message || "Failed to initiate subscription");
        } finally {
            setLoading(false);
        }
    };

    return { subscribe, loading, error };
};
