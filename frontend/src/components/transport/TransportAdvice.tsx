import React from 'react';
import { IconInfo, IconWarning } from './TransportIcons';

interface Props {
    recomendacion?: string;
    avisoContextual?: string | null;
    consejosLlegada?: string[];
}

export const TransportAdvice = ({ recomendacion, avisoContextual, consejosLlegada }: Props) => (
    <>
        {avisoContextual && (
            <div className="alert-warning">
                <IconWarning size={20} color="#d97706" className="shrink-0 mt-0.5" />
                <div>
                    <p className="alert-title">Aviso</p>
                    <p className="alert-description">{avisoContextual}</p>
                </div>
            </div>
        )}

        {recomendacion && (
            <div className="alert-info">
                <IconInfo size={16} color="currentColor" className="shrink-0" />
                <p>{recomendacion}</p>
            </div>
        )}

        {consejosLlegada && consejosLlegada.length > 0 && (
            <div className="card-lg rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <IconInfo size={18} color="#2563EB" />
                    <h3 className="font-semibold text-text">Consejos de llegada</h3>
                </div>
                <ul className="space-y-2">
                    {consejosLlegada.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="text-primary font-bold mt-0.5">•</span>
                            <span>{c}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </>
);