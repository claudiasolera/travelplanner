# ✈️ Travel Planner

Plataforma web inteligente de planificación de viajes que permite organizar todos los aspectos de un viaje desde un único lugar: vuelos, hoteles, itinerario, presupuesto, transporte y recomendaciones con IA.

## 📋 Descripción

Travel Planner centraliza la planificación de viajes en una única interfaz. En lugar de consultar múltiples plataformas (buscadores de vuelos, portales de hoteles, guías turísticas, mapas…), el usuario puede gestionar todo desde la aplicación:

- **Búsqueda de vuelos** con comparación de precios, horarios y escalas.
- **Búsqueda de hoteles** con fotos, valoraciones y precios.
- **Itinerario interactivo** con calendario día a día y actividades.
- **Mapa interactivo** con puntos de interés, restaurantes y alojamiento.
- **Comparador de transporte** al aeropuerto (público vs taxi/VTC) generado con IA.
- **Guía de destino con IA** — historia, costumbres, moneda, seguridad y más.
- **Control de gastos** por categorías con resumen visual.
- **Comunidad** de viajeros — publica tu viaje, comenta, guarda y clona viajes de otros.
- **Exportación a PDF** del itinerario completo.

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript, Tailwind CSS v4, Vite, React Router v6 |
| Backend | Node.js v20 + Express, Prisma ORM v5 |
| Base de datos | PostgreSQL 16 |
| Caché | Redis 7 |
| IA | Gemma 4 (Ollama) |
| Mapas | Leaflet + OpenStreetMap |
| APIs externas | Duffel (vuelos), LiteAPI (hoteles), OpenWeather, TransitLand, OSRM, Geoapify, Nominatim |
| Almacenamiento | Cloudinary (imágenes) |
| Despliegue | Docker + Docker Compose, Nginx, Certbot (SSL) |

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/) v20+
- [PostgreSQL](https://www.postgresql.org/) 16+
- [Redis](https://redis.io/) 7+
- npm o yarn
- (Opcional) [Docker](https://www.docker.com/) y Docker Compose

## 🚀 Instalación

### Opción 1 — Manual

```bash
# 1. Clonar el repositorio
git clone https://github.com/claudiasolera/proyectofinal.git
cd travel-planner

# 2. Backend
cd backend
npm install
cp .env.example .env        # Configurar variables de entorno
npx prisma migrate dev
npm run dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

### Opción 2 — Docker

```bash
docker-compose up -d
```

Esto construye y levanta todos los servicios automáticamente (frontend, backend, PostgreSQL, Redis y Nginx).

## 🔑 Variables de entorno

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/travelplanner
REDIS_URL=redis://localhost:6379
JWT_SECRET=tu_secreto_jwt
DUFFEL_API_KEY=tu_api_key
OPENWEATHER_API_KEY=tu_api_key
TRANSITLAND_API_KEY=tu_api_key
CLOUDINARY_URL=cloudinary://...
OLLAMA_BASE_URL=https://jarvis.ieshlanz.es
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Estructura del proyecto

```
plataforma-viajes/
├── backend/                   # API REST (Node.js + Express)
│   ├── prisma/                # Schema y migraciones de Prisma
│   ├── src/
│   │   ├── assets/            # Recursos estáticos del backend
│   │   ├── config/            # Configuración (DB, Redis, etc.)
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── middleware/        # Auth, validación, etc.
│   │   ├── models/            # Modelos de datos
│   │   ├── routes/            # Definición de rutas API
│   │   ├── services/          # Lógica de negocio y APIs externas
│   │   ├── types/             # Tipos TypeScript
│   │   └── utils/             # Funciones auxiliares
│   └── uploads/               # Archivos subidos temporalmente
├── frontend/                  # SPA (React + TypeScript + Vite)
│   ├── public/                # Recursos estáticos públicos
│   └── src/
│       ├── api/               # Cliente API
│       ├── assets/            # Imágenes y recursos
│       ├── components/        # Componentes React
│       │   ├── budget/        #   └─ Gastos y presupuesto
│       │   ├── calendar/      #   └─ Calendario interactivo
│       │   ├── community/     #   └─ Comunidad de viajeros
│       │   ├── explore/       #   └─ Explorar destinos
│       │   ├── itinerary/     #   └─ Itinerario día a día
│       │   ├── layout/        #   └─ Layout general (navbar, footer)
│       │   ├── profile/       #   └─ Perfil de usuario
│       │   ├── reviews/       #   └─ Reseñas de lugares
│       │   ├── transport/     #   └─ Comparador de transporte
│       │   ├── trips/         #   └─ Tarjetas y vistas de viajes
│       │   └── ui/            #   └─ Componentes UI reutilizables
│       ├── context/           # Contextos React (Auth, etc.)
│       ├── data/              # Datos estáticos / constantes
│       ├── hooks/             # Custom hooks
│       ├── lib/               # Utilidades compartidas
│       ├── pages/             # Páginas / vistas principales
│       ├── services/          # Servicios API del frontend
│       └── types/             # Tipos TypeScript
├── .gitignore
├── docker-compose.yml         # Orquestación de contenedores
├── Makefile                   # Atajos de comandos
└── README.md
```

## 👩‍💻 Autora

**Claudia Solera Solana**
Proyecto Fin de Ciclo — DAW
IES Hermenegildo Lanz · Curso 2025–2026