import React from 'react';

interface Props {
    icon: React.ReactNode;
    text: string;
}

export const EmptyState = ({ icon, text }: Props) => (
    <div className="empty-state rounded-2xl p-10 border-0" style={{ border: 'none' }}>
        <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary">
            {icon}
        </div>
        <p className="text-text-secondary text-sm">{text}</p>
    </div>
);