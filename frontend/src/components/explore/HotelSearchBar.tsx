import { CityInput } from './CityInput';

interface Props {
    inputs: any;
    onInputsChange: (data: any) => void;
    onSearch: () => void;
}

export const HotelSearchBar = ({ inputs, onInputsChange, onSearch }: Props) => (
    <div
        className="rounded-3xl p-3 shadow-xl relative z-30"
        style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)'
        }}
    >
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
            <div className="hidden xl:flex items-center gap-0">
                <div className="flex items-center gap-2 flex-1 px-3 py-1">
                    <CityInput
                        value={inputs.city}
                        placeholder="¿A dónde vas?"
                        onChange={val => onInputsChange({ ...inputs, city: val })}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="px-3 py-1">
                    <input
                        aria-label="Check-in"
                        type="date"
                        className="outline-none text-sm text-text bg-transparent"
                        value={inputs.checkIn}
                        onChange={e => onInputsChange({ ...inputs, checkIn: e.target.value })}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="px-3 py-1">
                    <input
                        aria-label="Check-out"
                        type="date"
                        className="outline-none text-sm text-text bg-transparent"
                        value={inputs.checkOut}
                        onChange={e => onInputsChange({ ...inputs, checkOut: e.target.value })}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="px-3 py-1" style={{ width: '70px' }}>
                    <input
                        aria-label="Huéspedes"
                        type="number"
                        min={1}
                        max={9}
                        className="outline-none text-sm text-text bg-transparent w-full"
                        value={inputs.adults}
                        onChange={e => onInputsChange({ ...inputs, adults: parseInt(e.target.value) || 1 })}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="px-3 py-1" style={{ width: '80px' }}>
                    <input
                        aria-label="Habitaciones"
                        type="number"
                        min={1}
                        max={9}
                        className="outline-none text-sm text-text bg-transparent w-full"
                        value={inputs.rooms}
                        onChange={e => onInputsChange({ ...inputs, rooms: parseInt(e.target.value) || 1 })}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="pl-3">
                    <button
                        aria-label="Buscar hoteles"
                        onClick={onSearch}
                        className="btn px-6 shrink-0"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            <div className="xl:hidden space-y-3">
                <div className="relative z-20">
                    <label className="text-xs text-text-soft mb-1 block">Destino</label>
                    <div className="input px-3 py-2.5">
                        <CityInput
                            value={inputs.city}
                            placeholder="¿A dónde vas?"
                            onChange={val => onInputsChange({ ...inputs, city: val })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-text-soft mb-1 block">Check-in</label>
                        <input
                            aria-label="Check-in"
                            type="date"
                            className="input px-3 py-2.5 text-sm w-full"
                            value={inputs.checkIn}
                            onChange={e => onInputsChange({ ...inputs, checkIn: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-soft mb-1 block">Check-out</label>
                        <input
                            aria-label="Check-out"
                            type="date"
                            className="input px-3 py-2.5 text-sm w-full"
                            value={inputs.checkOut}
                            onChange={e => onInputsChange({ ...inputs, checkOut: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-text-soft mb-1 block">Huéspedes</label>
                        <input
                            aria-label="Huéspedes"
                            type="number"
                            min={1}
                            max={9}
                            className="input px-3 py-2.5 text-sm w-full"
                            value={inputs.adults}
                            onChange={e => onInputsChange({ ...inputs, adults: parseInt(e.target.value) || 1 })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-soft mb-1 block">Habitaciones</label>
                        <input
                            aria-label="Habitaciones"
                            type="number"
                            min={1}
                            max={9}
                            className="input px-3 py-2.5 text-sm w-full"
                            value={inputs.rooms}
                            onChange={e => onInputsChange({ ...inputs, rooms: parseInt(e.target.value) || 1 })}
                        />
                    </div>
                </div>
                <button
                    aria-label="Buscar hoteles"
                    onClick={onSearch}
                    className="btn w-full py-2.5 text-sm"
                >
                    Buscar hoteles
                </button>
            </div>
        </div>
    </div>
);