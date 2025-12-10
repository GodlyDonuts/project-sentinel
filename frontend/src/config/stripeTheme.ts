export const sentinelStripeTheme = {
    theme: 'night' as const,
    variables: {
        colorPrimary: '#00ff41', // Sentinel Green
        colorBackground: '#001510', // Deep Jungle (slightly lighter than Void for contrast)
        colorText: '#e5e7eb',
        colorDanger: '#ff003c',
        fontFamily: 'Rajdhani, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
        // Custom variables for inputs
        colorInputBackground: '#050505',
        colorInputBorder: '#333333',
    },
    rules: {
        '.Input': {
            border: '1px solid #333',
            boxShadow: 'none',
            backgroundColor: '#050505', // The Void
            transition: 'border 0.3s ease',
        },
        '.Input:focus': {
            border: '1px solid #00ff41', // Green glow on focus
            boxShadow: '0 0 10px rgba(0, 255, 65, 0.2)',
        },
        '.Label': {
            color: '#00ff41',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: '8px',
            fontFamily: 'Orbitron, sans-serif', // Header font for labels
        },
        '.Tab': {
            border: '1px solid #333',
            backgroundColor: '#000000',
        },
        '.Tab:hover': {
            borderColor: '#00ff41',
        },
        '.Tab--selected': {
            borderColor: '#00ff41',
            backgroundColor: 'rgba(0, 255, 65, 0.1)',
            color: '#00ff41',
        }
    }
};
