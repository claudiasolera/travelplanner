import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const makeIcon = (bg: string, svg: string) => new L.DivIcon({
    html: `<div style="width:36px;height:36px;background:${bg};border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px ${bg}66;">${svg}</div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -40], className: ''
});

export const ICONS: Record<string, L.DivIcon> = {
    restaurant: makeIcon('#f59e0b', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6h3.5M19.5 13V22"/></svg>'),
    museum: makeIcon('#8b5cf6', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M2 11l10-7 10 7"/></svg>'),
    attraction: makeIcon('#2563EB', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>'),
    park: makeIcon('#10b981', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M17 14h3l-5-9-3 5-3-5-5 9h3l-1 6h12z"/></svg>'),
    hotel: makeIcon('#10b981', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 22V8l9-6 9 6v14"/><rect x="9" y="14" width="6" height="8"/></svg>'),
};

export const getIconForType = (type: string, isFood: boolean) => {
    if (isFood) return ICONS.restaurant;
    const t = type?.toLowerCase() || '';
    if (t.includes('museum')) return ICONS.museum;
    if (t.includes('park') || t.includes('garden')) return ICONS.park;
    return ICONS.attraction;
};

const RecenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
    const map = useMap();
    useEffect(() => { map.setView([lat, lon], 14); }, [lat, lon]);
    return null;
};

const MapInvalidator = () => {
    const map = useMap();
    useEffect(() => { setTimeout(() => map.invalidateSize(), 100); }, []);
    return null;
};

interface Props {
    coords: { lat: number; lon: number } | null;
    places: any[];
    restaurants: any[];
    hotelCoords: any;
    city: string;
    onAddToCalendar: (item: any, isRestaurant: boolean) => void;
}

export const DiscoverMap = ({ coords, places, restaurants, hotelCoords, city, onAddToCalendar }: Props) => (
    <div className="card rounded-2xl overflow-hidden" style={{ height: '420px' }}>
        {coords ? (
            <MapContainer center={[coords.lat, coords.lon]} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                <RecenterMap lat={coords.lat} lon={coords.lon} />
                <MapInvalidator />
                {places.map((place: any) => (
                    <Marker key={`p-${place.id}`} position={[place.location.lat, place.location.lon]}
                        icon={getIconForType(place.type, false)}>
                        <Popup maxWidth={240}>
                            <div className="space-y-1.5 p-1">
                                <p className="font-semibold text-sm text-text">
                                    {place.name}
                                </p>
                                <p className="text-xs text-text-soft capitalize">
                                    {place.type}
                                </p>
                                {place.opening_hours !== 'No disponible' && (
                                    <p className="text-xs text-text-secondary">
                                        {place.opening_hours}
                                    </p>
                                )}
                                <button 
                                    aria-label={`Añadir ${place.name} al calendario`}
                                    onClick={() => onAddToCalendar(place, false)}
                                    className="btn text-xs py-1.5 w-full mt-1"
                                >
                                    + Añadir al calendario
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {restaurants.map((rest: any) => (
                    <Marker key={`r-${rest.id}`} position={[rest.location.lat, rest.location.lon]}
                        icon={ICONS.restaurant}>
                        <Popup maxWidth={240}>
                            <div className="space-y-1.5 p-1">
                                <p className="font-semibold text-sm text-text">
                                    {rest.name}
                                </p>
                                <p className="text-xs text-text-soft">
                                    {rest.cuisine?.join(', ')}
                                </p>
                                <p className="text-xs text-text-secondary">
                                    {rest.price}
                                </p>
                                <button 
                                    aria-label={`Añadir ${rest.name} al calendario`}
                                    onClick={() => onAddToCalendar(rest, true)}
                                    className="btn text-xs py-1.5 w-full mt-1"
                                >
                                    + Añadir al calendario
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {hotelCoords && (
                    <Marker position={[hotelCoords.lat, hotelCoords.lon]} icon={ICONS.hotel}>
                        <Popup><p className="font-semibold text-sm">Tu alojamiento: {hotelCoords.name}</p></Popup>
                    </Marker>
                )}
            </MapContainer>
        ) : (
            <div className="h-full flex items-center justify-center bg-card">
                <p className="text-sm text-text-secondary">
                    No se pudo cargar el mapa
                </p>
            </div>
        )}
    </div>
);