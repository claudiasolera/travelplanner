import { homepage } from "../lib/cloudinary"

export const destinations = [
    { name: 'Tokyo',      img: homepage.destinations[0].src, alt: homepage.destinations[0].alt, hotels: 120, packages: 34 },
    { name: 'París',      img: homepage.destinations[1].src, alt: homepage.destinations[1].alt, hotels: 98,  packages: 27 },
    { name: 'Costa Rica', img: homepage.destinations[2].src, alt: homepage.destinations[2].alt, hotels: 75,  packages: 19 },
    { name: 'Venecia',    img: homepage.destinations[3].src, alt: homepage.destinations[3].alt, hotels: 88,  packages: 22 },
    { name: 'Vietnam',    img: homepage.destinations[4].src, alt: homepage.destinations[4].alt, hotels: 60,  packages: 15 },
]