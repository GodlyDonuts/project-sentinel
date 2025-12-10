import React, { useState } from 'react';
import { Settings, Shield, Key, Crown, Check, CreditCard, Bell, Monitor, ChevronRight } from 'lucide-react';
// Retrigger import resolution
import { useAuth } from '../../hooks/useAuth';
import { PaymentGateway } from '../payment/PaymentGateway';
import { HoloCard } from '../ui/HoloCard';

export const SettingsView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handleUpgrade = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/payment/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: 'price_1SbpqdLApgLOZOmthqRzzc3u'
                }),
            });

            if (!response.ok) throw new Error('Payment initialization failed');

            const data = await response.json();
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            }
        } catch (error) {
            console.error('Upgrade failed:', error);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Settings className="text-sentinel-green" size={24} />
                    <h1 className="text-3xl font-display font-bold text-white tracking-wider text-glow">SYSTEM CONFIGURATION</h1>
                </div>
                <p className="text-gray-400 font-mono text-sm max-w-2xl">
                    Manage your Sentinel account, security preferences, and subscription status.
                </p>
            </header>

            {/* Render PaymentGateway Modal */}
            {clientSecret && (
                <PaymentGateway
                    clientSecret={clientSecret}
                    onClose={() => setClientSecret(null)}
                    userId={user?.id || ''}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'account', icon: Shield, label: 'Account' },
                        { id: 'billing', icon: CreditCard, label: 'Billing' },
                        { id: 'security', icon: Key, label: 'Security' },
                        { id: 'notifications', icon: Bell, label: 'Notifications' },
                        { id: 'devices', icon: Monitor, label: 'Devices' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 font-mono text-sm ${activeTab === tab.id
                                ? 'bg-sentinel-green/10 text-sentinel-green border border-sentinel-green/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <ChevronRight size={14} className="ml-auto opacity-50" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <HoloCard className="p-6 border-white/10 bg-black/40">
                                <h3 className="text-lg font-display text-white mb-6 flex items-center gap-2">
                                    <Shield size={20} className="text-sentinel-green" />
                                    PROFILE IDENTITY
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.firstName ? `${user.firstName} ${user.lastName}` : 'Agent 007'}
                                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:border-sentinel-green focus:outline-none transition-colors font-mono text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email || 'agent@sentinel.ai'}
                                            disabled
                                            className="w-full bg-white/5 border border-white/5 rounded px-4 py-2 text-gray-400 cursor-not-allowed font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </HoloCard>

                            <HoloCard className="p-6 border-white/10 bg-black/40">
                                <h3 className="text-lg font-display text-white mb-6 flex items-center gap-2">
                                    <CreditCard size={20} className="text-sentinel-green" />
                                    SUBSCRIPTION TIER
                                </h3>

                                {/* Define isPro check */}
                                {(() => {
                                    const isPro = user?.metadata?.premium === 'true';
                                    return (
                                        <div className={`flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-4 bg-gradient-to-r ${isPro ? 'from-sentinel-green/20' : 'from-sentinel-green/5'} to-transparent rounded border ${isPro ? 'border-sentinel-green/50' : 'border-sentinel-green/20'}`}>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`font-bold tracking-wide ${isPro ? 'text-sentinel-green' : 'text-white'}`}>
                                                        {isPro ? 'SENTINEL ONE' : 'FREE TIER'}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] font-mono rounded uppercase">Current</span>
                                                </div>
                                                <p className="text-sm text-gray-400 max-w-md">
                                                    {isPro
                                                        ? 'You have full access to real-time threat detection, advanced audio analysis, and priority support.'
                                                        : 'Basic protection. Upgrade to remove limits and unlock real-time voice analysis.'
                                                    }
                                                </p>
                                            </div>

                                            {isPro ? (
                                                <div className="flex items-center gap-2 px-6 py-2 bg-sentinel-green/10 text-sentinel-green font-bold text-sm tracking-wider rounded border border-sentinel-green/30 shadow-[0_0_15px_rgba(0,255,65,0.1)] font-mono uppercase">
                                                    <Check size={14} />
                                                    PREMIUM PLAN ACTIVE
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleUpgrade}
                                                    className="px-6 py-2 bg-sentinel-green text-black font-bold text-sm tracking-wider hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all duration-300 rounded uppercase font-mono flex items-center gap-2"
                                                >
                                                    <Crown size={14} />
                                                    Upgrade to PRO
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </HoloCard>
                        </div>
                    )}

                    {/* Audio Settings (Mocked for now in other tabs) */}
                    {activeTab === 'notifications' && (
                        <HoloCard className="p-6 border-white/10 bg-black/40">
                            <h3 className="text-lg font-display text-white mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-sentinel-green" />
                                NOTIFICATION CENTER
                            </h3>
                            <p className="text-gray-400 font-mono text-sm">Notification settings coming soon.</p>
                        </HoloCard>
                    )}
                </div>
            </div>
        </div>
    );
};
