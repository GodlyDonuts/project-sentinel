import { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    metadata?: {
        premium?: string;
    };
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // DEVELOPER MODE: BYPASS AUTH (Force Login)
        if (import.meta.env.DEV) {
            const persistedPremium = localStorage.getItem('sentinel_dev_premium') || 'false';
            console.log(`DEV MODE: Auto-logging in as Dev Agent (Premium: ${persistedPremium})`);

            setUser({
                id: 'dev-agent-001',
                email: 'dev@localhost',
                firstName: 'Dev',
                lastName: 'Agent',
                metadata: { premium: persistedPremium }
            });
            setLoading(false);
        }

        // Expose Debug Tools
        (window as any).setPremium = (isPremium: boolean) => {
            const status = isPremium ? 'true' : 'false';
            console.log(`✨ SETTING PREMIUM STATUS: ${status}`);
            localStorage.setItem('sentinel_dev_premium', status);

            // Dispatch event for real-time updates across components
            window.dispatchEvent(new CustomEvent('sentinel:premium-update', { detail: status }));
        };

        const handlePremiumUpdate = (e: CustomEvent) => {
            setUser(prev => {
                if (!prev) return null;
                return { ...prev, metadata: { ...prev.metadata, premium: e.detail } };
            });
        };

        window.addEventListener('sentinel:premium-update', handlePremiumUpdate as EventListener);

        if (import.meta.env.DEV) return () => window.removeEventListener('sentinel:premium-update', handlePremiumUpdate as EventListener);

        // Try to recover user from localStorage
        const storedUser = localStorage.getItem('sentinel_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // Fetch fresh metadata (e.g. Premium status)
                // Only if we have a real user ID (not the mock agent)
                if (parsedUser.id && !parsedUser.id.startsWith('agent-007')) {
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/me`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: parsedUser.id })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.user) {
                                // Merge remote data with local fallback, creating a hydrated user
                                const remoteUser = data.user;
                                const updatedUser = {
                                    ...parsedUser,
                                    firstName: remoteUser.firstName || remoteUser.first_name || 'Agent',
                                    lastName: remoteUser.lastName || remoteUser.last_name || '',
                                    email: remoteUser.email || parsedUser.email,
                                    profilePictureUrl: remoteUser.profilePictureUrl || remoteUser.profile_picture_url,
                                    metadata: remoteUser.metadata || {}
                                };
                                setUser(updatedUser);
                                localStorage.setItem('sentinel_user', JSON.stringify(updatedUser));
                            }
                        })
                        .catch(err => console.error("Failed to refresh profile:", err));
                }

            } catch (e) {
                console.error("Failed to parse user data", e);
                localStorage.removeItem('sentinel_user');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('sentinel_user');
        setUser(null);
        window.location.href = '/';
    };

    return { user, loading, logout };
};
