import '../../styles/crt-effects.css';

export const CRTOverlay = () => {
    return (
        <div className="crt-overlay pointer-events-none fixed inset-0 z-[9999]">
            {/* Reduce opacity to 5% for subtle texture, not interference */}
            <div className="scanlines opacity-[0.05]"></div>
            <div className="vignette opacity-40"></div>
        </div>
    );
};
