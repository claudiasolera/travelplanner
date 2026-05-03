import { SavedTransport } from '../../types/transport';

interface Props {
    transports: SavedTransport[];
    onDelete: (id: string) => void;
}

export const SavedTransports = ({ transports, onDelete }: Props) => (
    <div className="space-y-4">
        {transports.length === 0 ? (
            <div className="empty-state rounded-2xl">
                <p className="text-text-soft text-sm">No tienes transportes guardados. Busca y compara opciones para guardarlas aquí.</p>
            </div>
        ) : (
            transports.map(t => (
                <div key={t.id} className="card-lg rounded-2xl p-4 flex items-start gap-4 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        t.mode === 'publico' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                        {t.mode === 'publico' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 17h14M5 17a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2M5 17l-1 3h16l-1-3" />
                                <circle cx="7.5" cy="10.5" r="1.5" /><circle cx="16.5" cy="10.5" r="1.5" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 17H3v-5l2.5-6h13l2.5 6v5h-2" />
                                <circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" />
                                <path d="M5 11h14" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                t.mode === 'publico' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                {t.mode === 'publico' ? 'Transporte público' : 'Taxi / VTC'}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-text">{t.origin} → {t.destination}</p>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-text-secondary">
                            {t.tipoTransporte && <span>{t.tipoTransporte}</span>}
                            {t.lineaRecomendada && <span>Línea {t.lineaRecomendada}</span>}
                            {t.duration && <span>{t.duration} min</span>}
                            {t.price && <span className="font-medium text-text">{t.price}€</span>}
                        </div>
                        {t.notas && <p className="text-xs text-text-soft mt-1.5">{t.notas}</p>}
                    </div>
                    <button
                        aria-label="Eliminar transporte guardado"
                        onClick={() => onDelete(t.id)}
                        className="text-text-soft hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            ))
        )}
    </div>
);