import React from 'react';

interface InfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

export const InfoCard = ({ icon, label, value }: InfoCardProps) => (
    <div className="bg-primary-light rounded-2xl p-4 flex items-start gap-3 min-w-0"
        style={{ border: '1.5px solid rgba(201,176,160,0.4)' }}
    >
        <div className="w-8 h-8 bg-card rounded-xl flex items-center justify-center shrink-0 text-accent"
            style={{ border: '1.5px solid rgba(201,176,160,0.5)' }}
        >
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-text-secondary mb-0.5">
                {label}
            </p>
            <p className="font-semibold text-text text-sm wrap-break-word">
                {value}
            </p>
        </div>
    </div>
);