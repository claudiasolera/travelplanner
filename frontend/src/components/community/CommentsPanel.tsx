interface Props {
    comments: any[];
    user: any;
    newComment: string;
    loading: boolean;
    onNewCommentChange: (v: string) => void;
    onSubmit: () => void;
    onClose: () => void;
}

export const CommentsPanel = ({
    comments, user, newComment, loading,
    onNewCommentChange, onSubmit, onClose
}: Props) => (
    <div
        className="fixed inset-0 z-50 flex"
        onClick={onClose}
    >
        <div className="flex-1" />
        <div
            className="w-full max-w-sm bg-card h-full flex flex-col shadow-2xl"
            style={{ borderLeft: '2px solid white' }}
            onClick={e => e.stopPropagation()}
        >
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-text">
                    Comentarios ({comments?.length || 0})
                </h3>
                <button
                    aria-label="Cerrar comentarios"
                    onClick={onClose}
                    className="text-text-soft hover:text-text"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments?.length === 0 ? (
                    <p className="text-text-soft text-sm text-center mt-10">
                        Sé el primero en comentar.
                    </p>
                ) : comments?.map((c: any) => (
                    <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0">
                            {c.user?.avatar ? (
                                <img
                                    src={c.user.avatar}
                                    alt={c.user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs font-bold text-white leading-none">
                                    {c.user?.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 bg-bg-section rounded-2xl px-3 py-2">
                            <p className="text-xs font-semibold text-text">{c.user?.name}</p>
                            <p className="text-sm text-text-secondary mt-0.5">{c.content}</p>
                            <p className="text-xs text-text-soft mt-1">
                                {new Date(c.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {user && (
                <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                        <input
                            aria-label="Añadir comentario al viaje"
                            className="flex-1 min-w-0 bg-bg border border-border rounded-full px-4 py-2 text-sm outline-none text-text placeholder:text-text-soft"
                            placeholder="Añade un comentario..."
                            value={newComment}
                            onChange={e => onNewCommentChange(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && onSubmit()}
                        />
                        <button
                            aria-label="Enviar comentario"
                            onClick={onSubmit}
                            disabled={loading}
                            className="btn px-4 py-2 text-sm shrink-0"
                        >
                            {loading ? '...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);