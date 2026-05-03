import { useState } from 'react';

type EventType = 'activity' | 'food' | 'hotel' | 'transport';

interface RouteEvent {
    time: string;
    title: string;
    type: EventType;
    description?: string;
    image?: string;
}

interface RouteDay {
    dayNumber: number;
    title: string;
    image?: string;
    events: RouteEvent[];
}

const typeColors: Record<EventType, string> = {
    activity: 'bg-violet-50 text-violet-500',
    food:     'bg-orange-50 text-orange-400',
    hotel:    'bg-blue-50 text-blue-500',
    transport:'bg-gray-50 text-gray-400',
};

const TypeIcon = ({ type }: { type: EventType }) => {
    const cls = `w-3.5 h-3.5`;
    if (type === 'activity') return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
        </svg>
    );
    if (type === 'food') return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
            <path d="M7 2v20"/>
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
        </svg>
    );
    if (type === 'hotel') return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
    );
    return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l.01 0M7 17l.01 0M17 17l.01 0M21 17l.01 0"/>
            <path d="M5 17H3v-4l2-5h14l2 5v4h-2m-12 0h8"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
        </svg>
    );
};

interface DayCardProps {
    day: RouteDay;
    isSelected: boolean;
    onSelect: () => void;
}

export const DayCard = ({ day, isSelected, onSelect }: DayCardProps) => {
    return (
        <div
            onClick={onSelect}
            className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
            style={{
                border: isSelected ? '2px solid #3b82f6' : '1.5px solid white',
                boxShadow: isSelected
                    ? '0 8px 32px rgba(59,130,246,0.18)'
                    : '0 2px 12px rgba(0,0,0,0.4)',
                background: isSelected ? '#eff6ff' : 'var(--color-card, white)',
            }}
        >
            <div className="p-4 flex gap-3">
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <div>
                        <p className="text-[11px] text-text-secondary font-medium mb-0.5">Día {day.dayNumber}</p>
                        <p className="font-bold text-text text-base leading-snug">{day.title}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {day.events.slice(0, isSelected ? day.events.length : 3).map((event, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <span className={`flex items-center justify-center w-6 h-6 rounded-lg shrink-0 ${typeColors[event.type]}`}>
                                    <TypeIcon type={event.type} />
                                </span>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    {event.time && (
                                        <span className="text-text-secondary text-[10px] shrink-0 font-medium">{event.time}</span>
                                    )}
                                    <span className="text-text truncate">{event.title}</span>
                                </div>
                            </div>
                        ))}
                        {!isSelected && day.events.length > 3 && (
                            <p className="text-[10px] text-text-secondary pl-1">+{day.events.length - 3} más</p>
                        )}
                    </div>
                </div>
            </div>

            {isSelected && (
                <div className="border-t border-blue-100 px-4 pb-4 pt-3 flex flex-col gap-4">
                    {day.events.map((event, i) => (
                        (event.image || event.description) ? (
                            <div key={i} className="flex flex-col sm:flex-row gap-3 items-start">
                                {event.image && (
                                    <div className="w-full sm:w-64 h-40 sm:h-48 rounded-xl overflow-hidden shrink-0">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex flex-col gap-1 min-w-0 w-full">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-lg shrink-0 ${typeColors[event.type]}`}>
                                            <TypeIcon type={event.type} />
                                        </span>
                                        {event.time && (
                                            <span className="text-[10px] text-text-secondary font-medium">{event.time}</span>
                                        )}
                                        <span className="text-xs font-semibold text-text wrap-break-words">
                                            {event.title}
                                        </span>
                                    </div>
                                    {event.description && (
                                        <p className="text-xs text-text-secondary leading-relaxed sm:pl-8 wrap-break-words">
                                            {event.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : null
                    ))}
                </div>
            )}
        </div>
    );
};