import React from 'react';

type IconProps = { size?: number; className?: string; color?: string };

const base = (size = 18, color = 'currentColor') => ({
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth: 2,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const
});

export const IconBus = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M8 6v6M15 6v6M2 12h19.6M18 18h.01M6 18h.01M10 4h4" />
        <rect x="4" y="2" width="16" height="16" rx="2" />
        <path d="M5 18v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2M16 18v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2" />
    </svg>
);

export const IconTrain = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <rect x="4" y="3" width="16" height="16" rx="2" />
        <path d="M4 11h16M8 15h.01M16 15h.01M10 19l-2 3M14 19l2 3" />
    </svg>
);

export const IconCar = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 9l-2-5H8l-2 5-2.5 2.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
    </svg>
);

export const IconWalk = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <circle cx="13" cy="4" r="2" />
        <path d="M7 22l3-7 2-3-3-3-3 5M14 22l-1-8 3-3 2 4 3 1" />
    </svg>
);

export const IconClock = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

export const IconTicket = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
        <path d="M8 5v14" strokeDasharray="2 2" />
    </svg>
);

export const IconMapPin = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

export const IconExternalLink = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </svg>
);

export const IconCreditCard = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
    </svg>
);

export const IconInfo = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
    </svg>
);

export const IconWarning = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" />
    </svg>
);

export const IconMoon = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
);

export const IconSearch = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
    </svg>
);

export const IconBackpack = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <path d="M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a6 6 0 0 0-12 0z" />
        <path d="M8 10V6a4 4 0 1 1 8 0v4M8 18h8M6 14h12" />
    </svg>
);

export const IconSuitcase = ({ size, color, className }: IconProps) => (
    <svg {...base(size, color)} className={className}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M8 20v2M16 20v2" />
    </svg>
);

export const StepIcon = ({ tipo, size = 18, color = 'white' }: { tipo: string; size?: number; color?: string }) => {
    switch (tipo) {
        case 'caminar': return <IconWalk size={size} color={color} />;
        case 'comprar': return <IconTicket size={size} color={color} />;
        case 'vehiculo': return <IconBus size={size} color={color} />;
        case 'transbordo': return <IconTrain size={size} color={color} />;
        case 'solicitar': return <IconCar size={size} color={color} />;
        case 'esperar': return <IconClock size={size} color={color} />;
        default: return <IconMapPin size={size} color={color} />;
    }
};

export const MediumIcon = ({ medio, size = 20, color = 'white' }: { medio: string; size?: number; color?: string }) => {
    const m = (medio || '').toLowerCase();
    if (m.includes('tren') || m.includes('metro') || m.includes('rail')) return <IconTrain size={size} color={color} />;
    if (m.includes('bus') || m.includes('autob')) return <IconBus size={size} color={color} />;
    if (m.includes('taxi') || m.includes('uber') || m.includes('cabify')) return <IconCar size={size} color={color} />;
    return <IconMapPin size={size} color={color} />;
};