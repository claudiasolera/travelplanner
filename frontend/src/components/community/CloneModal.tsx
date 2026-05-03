interface Props {
    cloneStart: string;
    cloneEnd: string;
    cloning: boolean;
    onStartChange: (v: string) => void;
    onEndChange: (v: string) => void;
    onClone: () => void;
    onClose: () => void;
}

export const CloneModal = ({
    cloneStart, cloneEnd, cloning,
    onStartChange, onEndChange, onClone, onClose
}: Props) => (
    <div
        className="modal-backdrop z-50"
        onClick={onClose}
    >
        <div
            className="modal rounded-3xl p-6 w-full max-w-md mx-4 space-y-5"
            onClick={e => e.stopPropagation()}
        >
            <div>
                <h2 className="text-xl font-semibold text-text">
                    Usar este viaje como base
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                    Elige tus fechas y te copiamos el itinerario completo para que lo ajustes a tu gusto.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="label">Fecha de inicio</label>
                    <input
                        aria-label="Fecha de inicio"
                        type="date"
                        className="input px-3 py-2.5 w-full"
                        value={cloneStart}
                        onChange={e => onStartChange(e.target.value)}
                    />
                </div>
                <div>
                    <label className="label">Fecha de fin</label>
                    <input
                        aria-label="Fecha de fin"
                        type="date"
                        className="input px-3 py-2.5 w-full"
                        value={cloneEnd}
                        onChange={e => onEndChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="bg-bg-section rounded-2xl p-3 text-xs text-text-secondary space-y-1">
                <p>Se copiará el itinerario ajustado a tus fechas</p>
                <p>Los hoteles y actividades se adaptarán automáticamente</p>
                <p>El viaje clonado será privado hasta que decidas compartirlo</p>
            </div>
            <div className="flex gap-3">
                <button
                    aria-label="Cancelar"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-full border border-border text-text-secondary text-sm hover:bg-bg-section transition"
                >
                    Cancelar
                </button>
                <button
                    aria-label="Usar este viaje"
                    onClick={onClone}
                    disabled={cloning || !cloneStart || !cloneEnd}
                    className="flex-1 btn justify-center disabled:opacity-50"
                >
                    {cloning ? 'Clonando...' : 'Usar este viaje →'}
                </button>
            </div>
        </div>
    </div>
);