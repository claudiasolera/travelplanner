import React from 'react';

interface Props {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const ConfirmModal = ({
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
    loading = false
}: Props) => (
    <div className="modal-backdrop" onClick={onCancel}>
        <div className="modal max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-text">{title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">Esta acción no se puede deshacer</p>
                </div>
            </div>

            <p className="text-sm text-text-secondary">{description}</p>

            <div className="flex gap-2 pt-1">
                <button
                    aria-label='Cancelar'
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-text hover:bg-bg-section transition disabled:opacity-50"
                >
                    {cancelLabel}
                </button>
                <button
                    aria-label='Confirmar'
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                        </svg>
                    )}
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
);