const AVATAR_OPTIONS = ['🧑‍🚀', '🧑‍✈️', '🧙', '🦸', '🧝', '🧜', '🤠', '👩‍🎤', '👨‍🎨', '🧑‍🍳', '🦊', '🐺'];

interface Props {
    editName: string;
    editAvatar: string;
    saving: boolean;
    onNameChange: (name: string) => void;
    onAvatarChange: (avatar: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export const EditProfileForm = ({ editName, editAvatar, saving, onNameChange, onAvatarChange, onSave, onCancel }: Props) => (
    <div className="card-lg rounded-3xl p-8 space-y-7">
        <h3 className="font-semibold text-text text-lg">Editar perfil</h3>

        <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid #dbeafe' }}>
                {editAvatar?.startsWith('http') || editAvatar?.startsWith('data:') ? (
                    <img src={editAvatar} alt="preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-3xl">
                        {editAvatar || editName?.charAt(0).toUpperCase() || '?'}
                    </div>
                )}
            </div>
            <div className="space-y-2 flex-1">
                <label className="label">Foto de perfil</label>
                <label className="cursor-pointer btn text-xs py-1.5 px-3 inline-flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17,8 12,3 7,8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Subir foto
                    <input 
                        aria-label="Subir foto de perfil"
                        type="file" accept="image/*" 
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 2 * 1024 * 1024) { alert('La imagen no puede superar 2MB'); return; }
                            const reader = new FileReader();
                            reader.onload = () => onAvatarChange(reader.result as string);
                            reader.readAsDataURL(file);
                        }} 
                    />
                </label>
                <p className="text-xs text-text-secondary">JPG, PNG o GIF · máx. 2MB</p>
                <div className="flex gap-1 flex-wrap mt-1">
                    {AVATAR_OPTIONS.map(emoji => (
                        <button 
                            aria-label={`Seleccionar avatar: ${emoji}`}
                            key={emoji} 
                            onClick={() => onAvatarChange(emoji)}
                            className={`text-lg p-1.5 rounded-xl border-2 transition ${editAvatar === emoji ? 'border-primary bg-primary-light' : 'border-border hover:bg-primary-light'}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div>
            <label className="label">Nombre</label>
            <input 
                aria-label="Nombre de usuario"
                className="input px-3 py-2" 
                value={editName} 
                onChange={e => onNameChange(e.target.value)} 
            />
        </div>

        <div className="flex gap-2">
            <button 
                aria-label="Guardar cambios"
                onClick={onSave} 
                disabled={saving} 
                className="btn text-sm py-2 px-5 disabled:opacity-50"
            >
                {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button 
                aria-label="Cancelar"
                onClick={onCancel} 
                className="text-sm text-text-secondary hover:text-text px-4 py-2 rounded-xl transition bg-primary-light"
            >
                Cancelar
            </button>
        </div>
    </div>
);