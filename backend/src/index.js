import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './config/db.js';
import redisClient from './config/redis.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import tripsRoutes from './routes/trips.routes.js';
import searchRoutes from './routes/search.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import transportRoutes from './routes/transport.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import checklistRoutes from './routes/checklist.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

// Rutas principales
app.get('/', (req, res) => {
  res.json({ 
    message: '🛩️ API de Plataforma de Viajes',
    status: 'OK',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      trips: '/api/trips',
      search: '/api/search',
      favorites: '/api/favorites',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: 'OK',
      database: 'connected',
      redis: redisClient.isOpen ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      database: 'disconnected',
      redis: redisClient.isOpen ? 'connected' : 'disconnected'
    });
  }
});

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/ai', aiRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

//Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await redisClient.connect();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✅ Base de datos conectada`);
      console.log(`✅ Redis conectado`);
      console.log(`Documentación: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await prisma.$disconnect();
  await redisClient.quit();
  process.exit(0);
});
