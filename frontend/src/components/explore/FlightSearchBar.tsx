import { AirportInput } from './AirportInput';

interface Props {
    inputs: any;
    onInputsChange: (data: any) => void;
    onOriginIata: (v: string) => void;
    onDestIata: (v: string) => void;
    onSearch: () => void;
}

export const FlightSearchBar = ({
    inputs, onInputsChange, onOriginIata, onDestIata, onSearch
}: Props) => (
    <div
        className="rounded-3xl p-3 shadow-xl relative z-30"
        style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)'
        }}
    >
        <div className="flex gap-2 mb-2">
            {['oneway', 'roundtrip'].map(type => (
                <button
                    aria-label={type === 'oneway' ? 'Solo ida' : 'Ida y vuelta'}
                    key={type}
                    onClick={() => onInputsChange({
                        ...inputs,
                        tripType: type,
                        ...(type === 'oneway' ? { returnDate: '' } : {})
                    })}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        inputs.tripType === type
                            ? 'bg-white text-primary font-semibold'
                            : 'bg-white/30 text-white hover:bg-white/50'
                    }`}
                >
                    {type === 'oneway' ? 'Solo ida' : 'Ida y vuelta'}
                </button>
            ))}
        </div>

        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
            <div className="hidden xl:flex items-center gap-0">
                <div className="flex items-center gap-2 flex-1 px-3 py-1">
                    <AirportInput
                        value={inputs.origin}
                        placeholder="Origen"
                        onChange={(label, iata) => {
                            onInputsChange({ ...inputs, origin: iata });
                            onOriginIata(iata);
                        }}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="flex items-center gap-2 flex-1 px-3 py-1">
                    <AirportInput
                        value={inputs.destination}
                        placeholder="Destino"
                        onChange={(label, iata) => {
                            onInputsChange({ ...inputs, destination: iata });
                            onDestIata(iata);
                        }}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="px-3 py-1">
                    <input
                        aria-label="Fecha de salida"
                        type="date"
                        className="outline-none text-sm text-text bg-transparent"
                        value={inputs.departureDate}
                        onChange={e => onInputsChange({ ...inputs, departureDate: e.target.value })}
                    />
                </div>
                {inputs.tripType === 'roundtrip' && (
                    <>
                        <div className="w-px h-8 bg-border shrink-0" />
                        <div className="px-3 py-1">
                            <input
                                aria-label="Fecha de regreso"
                                type="date"
                                className="outline-none text-sm text-text bg-transparent"
                                value={inputs.returnDate || ''}
                                onChange={e => onInputsChange({ ...inputs, returnDate: e.target.value })}
                            />
                        </div>
                    </>
                )}
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="px-3 py-1" style={{ width: '70px' }}>
                    <input
                        aria-label="Pasajeros"
                        type="number"
                        min={1}
                        max={9}
                        className="outline-none text-sm text-text bg-transparent w-full"
                        value={inputs.adults}
                        onChange={e => onInputsChange({ ...inputs, adults: parseInt(e.target.value) || 1 })}
                    />
                </div>
                <div className="w-px h-8 bg-border shrink-0" />
                <select
                    aria-label="Clase"
                    className="outline-none text-sm text-text bg-transparent px-3 py-1 cursor-pointer"
                    value={inputs.travelClass}
                    onChange={e => onInputsChange({ ...inputs, travelClass: e.target.value })}
                >
                    <option value="ECONOMY">
                        Económica
                    </option>
                    <option value="PREMIUM_ECONOMY">
                        Premium
                    </option>
                    <option value="BUSINESS">
                        Business
                    </option>
                    <option value="FIRST">
                        Primera
                    </option>
                </select>
                <div className="w-px h-8 bg-border shrink-0" />
                <div className="pl-3">
                    <button
                        aria-label="Buscar vuelos"
                        onClick={onSearch}
                        className="btn px-6 shrink-0"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            <div className="xl:hidden space-y-3">
                <div className="relative z-20">
                    <label className="text-xs text-text-soft mb-1 block">Origen</label>
                    <div className="input px-3 py-2.5">
                        <AirportInput
                            value={inputs.origin}
                            placeholder="Ciudad o aeropuerto de origen"
                            onChange={(label, iata) => {
                                onInputsChange({ ...inputs, origin: iata });
                                onOriginIata(iata);
                            }}
                        />
                    </div>
                </div>
                <div className="relative z-10">
                    <label className="text-xs text-text-soft mb-1 block">Destino</label>
                    <div className="input px-3 py-2.5">
                        <AirportInput
                            value={inputs.destination}
                            placeholder="Ciudad o aeropuerto de destino"
                            onChange={(label, iata) => {
                                onInputsChange({ ...inputs, destination: iata });
                                onDestIata(iata);
                            }}
                        />
                    </div>
                </div>
                <div className={`grid gap-2 ${inputs.tripType === 'roundtrip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div>
                        <label className="text-xs text-text-soft mb-1 block">Salida</label>
                        <input
                            aria-label="Fecha de salida"
                            type="date"
                            className="input px-3 py-2.5 text-sm w-full"
                            value={inputs.departureDate}
                            onChange={e => onInputsChange({ ...inputs, departureDate: e.target.value })}
                        />
                    </div>
                    {inputs.tripType === 'roundtrip' && (
                        <div>
                            <label className="text-xs text-text-soft mb-1 block">Regreso</label>
                            <input
                                aria-label="Fecha de regreso"
                                type="date"
                                className="input px-3 py-2.5 text-sm w-full"
                                value={inputs.returnDate || ''}
                                onChange={e => onInputsChange({ ...inputs, returnDate: e.target.value })}
                            />
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-text-soft mb-1 block">Pasajeros</label>
                        <input
                            aria-label="Pasajeros"
                            type="number"
                            min={1}
                            max={9}
                            className="input px-3 py-2.5 text-sm w-full"
                            value={inputs.adults}
                            onChange={e => onInputsChange({ ...inputs, adults: parseInt(e.target.value) || 1 })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-soft mb-1 block">Clase</label>
                        <select
                            aria-label="Clase"
                            className="input px-3 py-2.5 text-sm w-full"
                            value={inputs.travelClass}
                            onChange={e => onInputsChange({ ...inputs, travelClass: e.target.value })}
                        >
                            <option value="ECONOMY">
                                Económica
                            </option>
                            <option value="PREMIUM_ECONOMY">
                                Premium
                            </option>
                            <option value="BUSINESS">
                                Business
                            </option>
                            <option value="FIRST">
                                Primera
                            </option>
                        </select>
                    </div>
                </div>
                <button
                    aria-label="Buscar vuelos"
                    onClick={onSearch}
                    className="btn w-full py-2.5 text-sm"
                >
                    Buscar vuelos
                </button>
            </div>
        </div>
    </div>
);