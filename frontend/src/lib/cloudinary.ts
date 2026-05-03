const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`

const t = {
    icon: 'f_auto,q_auto,w_80,h_80',
    iconLg: 'f_auto,q_auto,w_900,h_900,c_pad',
    iconSquare: 'f_auto,q_auto,w_400,h_400,c_pad',
    card: 'f_auto,q_auto,w_800,h_1100,c_fill,g_auto',
    hero: 'f_auto,q_auto,w_1920,h_1080,c_fill,g_auto',
    heroBanner: 'f_auto,q_auto,w_1920,h_1080,c_fill,g_center',
    heroBannerSouth: 'f_auto,q_auto,w_1920,c_fit',
    itinerary: 'f_auto,q_auto,w_1200,h_750,c_fill,g_auto',
}

const url = (transform: string, path: string) => `${BASE}/${transform}/${path}`

export const icons = {
    planeIsland:     url(t.icon, 'plane-island'),
    magnifyingGlass: url(t.icon, 'magnifyingGlass'),
    community:         url(t.icon, 'community'),
    backpack:        url(t.icon, 'backpack'),
    profile:         url(t.icon, 'profile'),

    hotel:           url(t.icon, 'bus'),
    map:             url(t.icon, 'map'),
    summary:         url(t.icon, 'summary'),
    calendar:        url(t.icon, 'calendar'),
    moneyBag:        url(t.icon, 'moneyBag'),
    journal:         url(t.icon, 'journal'),
    suitcase:        url(t.icon, 'suitcase'),
    earth:           url(t.icon, 'earth'),
    padlock:         url(t.icon, 'padlock'),
    handShake:       url(t.icon, 'handShake'),
    hotAirBalloon: url(t.iconLg, 'hotAirBalloon'),
    mail:            url(t.icon, 'mail'),
    plane:           url(t.icon, 'plane'),
    choose:           url(t.iconLg, 'choose'),
    personalize:           url(t.iconLg, 'personalize'),
    travel:           url(t.iconLg, 'travel'),
    organize:           url(t.iconLg, 'organize'),
}

export const badges = {
    firstTrip:  url(t.iconSquare, 'first-trip'),
    explorer:   url(t.iconSquare, 'explorer'),
    nomad:      url(t.iconSquare, 'nomad'),
    social:      url(t.iconSquare, 'social'),
    adventurer: url(t.iconSquare, 'adventurer'),
    budgetMaster: url(t.iconSquare, 'budget-master'),
}

export const styles = {
    relax:  url(t.icon, 'relax'),
    aventura:  url(t.icon, 'aventura'),
    fiesta:  url(t.icon, 'fiesta'),
    cultura:  url(t.icon, 'cultura'),
}

export const homepage = {
    heroBg: [
        { src: url(t.hero, 'hero-bg-main-1'), alt: 'Playa tropical' },
        { src: url(t.hero, 'hero-bg-main-2'), alt: 'Ciudad europea con arquitectura histórica' },
        { src: url(t.hero, 'hero-bg-main-3'), alt: 'Montañas nevadas con cielo despejado' },
        { src: url(t.hero, 'hero-bg-main-4'), alt: 'Paisaje playero' },
        { src: url(t.hero, 'hero-bg-main-5'), alt: 'Paisaje japones en Fujiyoshida' },
    ],
    heroBanners: {
        vuelos: { src: url(t.heroBanner, 'vuelos'), alt: 'Vista aérea de playa tropical con arena blanca' },
        hoteles: { src: url(t.heroBannerSouth, 'hotel'), alt: 'Habitación de hotel acogedora' },
        comunidad: { src: url(t.heroBanner, 'comunidad'), alt: 'Grupo de viajeros charlando' },
    },
    destinations: [
        { src: url(t.card, 'destination-tokyo-1'), alt: 'Vista de la torre de Tokio' },
        { src: url(t.card, 'destination-paris-1'), alt: 'Torre Eiffel en París' },
        { src: url(t.card, 'destination-costaR-1'), alt: 'Selva tropical y volcán en Costa Rica' },
        { src: url(t.card, 'destination-venice-1'), alt: 'Canales en Venecia' },
        { src: url(t.card, 'destination-vietnam-1'), alt: 'Tren de Hanói, Vietnam' },
    ],
}

export const routes = {
    japan: {
        hero: url(t.hero, 'japan-hero'),
        itinerary: {
            shinjuku:    url(t.itinerary, 'japan-itinerary-shinjuku'),
            shinjukuNight:    url(t.itinerary, 'japan-itinerary-shinjukuNight'),
            sensoji:     url(t.itinerary, 'japan-itinerary-sensoji'),
            akihabara:     url(t.itinerary, 'japan-itinerary-akihabara'),
            shibuya:     url(t.itinerary, 'japan-itinerary-shibuya'),
            harajuku:     url(t.itinerary, 'japan-itinerary-harajuku'),
            roppongi:     url(t.itinerary, 'japan-itinerary-roppongi'),
            shinkansen: url(t.itinerary, 'japan-itinerary-shinkansen'),
            ryokan:   url(t.itinerary, 'japan-itinerary-ryokan'),
            gion:  url(t.itinerary, 'japan-itinerary-gion'),
            fushimiInari:   url(t.itinerary, 'japan-itinerary-fushimi-inari'),
            kinkakuji: url(t.itinerary, 'japan-itinerary-kinkakuji'),
            nara: url(t.itinerary, 'japan-itinerary-nara'),
            todaiji: url(t.itinerary, 'japan-itinerary-todaiji'),
            dotonbori: url(t.itinerary, 'japan-itinerary-dotonbori'),
            osakaCastle: url(t.itinerary, 'japan-itinerary-osaka-castle'),
            umeda: url(t.itinerary, 'japan-itinerary-umeda'),
            shinsaibashi: url(t.itinerary, 'japan-itinerary-shinsaibashi'),
            kuromon: url(t.itinerary, 'japan-itinerary-kuromon'),
        },
        restaurants: {
            ramenStreet:  url(t.itinerary, 'japan-restaurant-ramen-street'),
            ueno:     url(t.itinerary, 'japan-restaurant-ueno'),
            kaiseki:      url(t.itinerary, 'japan-restaurant-kaiseki'),
            takoyaki:     url(t.itinerary, 'japan-restaurant-takoyaki'),
            teppanyaki:     url(t.itinerary, 'japan-restaurant-teppanyaki'),
        },
    },
    france: {
        hero: url(t.hero, 'franceHero'),
        itinerary: {
            paris: url(t.itinerary, 'france-itinerary-paris'),
            lemarais: url(t.itinerary, 'france-itinerary-lemarais'),
            chateau: url(t.itinerary, 'france-itinerary-chateau'),
            amboise: url(t.itinerary, 'france-itinerary-amboise'),
            chambord: url(t.itinerary, 'france-itinerary-chambord'),
            chambordGrounds: url(t.itinerary, 'france-itinerary-chambord-grounds'),
            cheverny: url(t.itinerary, 'france-itinerary-cheverny'),
            chenonceau: url(t.itinerary, 'france-itinerary-chenonceau'),
            villandry: url(t.itinerary, 'france-itinerary-villandry'),
            loira: url(t.itinerary, 'france-itinerary-loira'),
            blois: url(t.itinerary, 'france-itinerary-blois'),
            chaumont: url(t.itinerary, 'france-itinerary-chaumont'),
            eiffel: url(t.itinerary, 'france-itinerary-eiffel'),
        },
        restaurants: {
            brasserie: url(t.itinerary, 'france-restaurant-brasserie'),
        },
    },
    italy: {
        hero: url(t.hero, 'italy-hero'),
        itinerary: {
            coliseumDinner: url(t.itinerary, 'italy-itinerary-coliseumDinner'),
            trastivere: url(t.itinerary, 'italy-itinerary-trastivere'),
            coliseum: url(t.itinerary, 'italy-itinerary-coliseum'),
            carbonara: url(t.itinerary, 'italy-itinerary-carbonara'),
            fontana: url(t.itinerary, 'italy-itinerary-fontana'),
            chapel: url(t.itinerary, 'italy-itinerary-chapel'),
            saintpeter: url(t.itinerary, 'italy-itinerary-saintpeter'),
            prati: url(t.itinerary, 'italy-itinerary-prati'),
            uffiziGallery: url(t.itinerary, 'italy-itinerary-uffiziGallery'),
            vecchio: url(t.itinerary, 'italy-itinerary-vecchio'),
            uffizi: url(t.itinerary, 'italy-itinerary-uffizi'),
            david: url(t.itinerary, 'italy-itinerary-david'),
            duomo: url(t.itinerary, 'italy-itinerary-duomo'),
            gondola: url(t.itinerary, 'italy-itinerary-gondola'),
            rialto: url(t.itinerary, 'italy-itinerary-rialto'),
            cannergio: url(t.itinerary, 'italy-itinerary-cannergio'),
            marcos: url(t.itinerary, 'italy-itinerary-marcos'),
            murano: url(t.itinerary, 'italy-itinerary-murano'),
        },
        restaurants: {},
    },
}