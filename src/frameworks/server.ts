
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { networkInterfaces } from 'os';
import { config, AppConfig } from '../config';
import '../config/firebase';
import { Logger } from '../shared/logger';
import { errorHandler, loggerMiddleware } from './middleware';
import registerRoutes from './routes';

const app = express();

let isAppReady = false;
let resolveAppReady: () => void;
const appReadyPromise = new Promise<void>((resolve) => {
  resolveAppReady = resolve;
});

// Health check — always available
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// Readiness probe — delays requests during cold start
app.use(async (req, res, next) => {
  if (req.path === '/health' || isAppReady) return next();
  try {
    await appReadyPromise;
    next();
  } catch (err) {
    next(err);
  }
});

// CORS
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = [
        config.frontendUrl,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ];
      callback(null, allowed.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(loggerMiddleware);

// Local IP helper
const getLocalIP = (): string => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const net = nets[name];
    if (!net) continue;
    for (const iface of net) {
      const familyV4 = typeof iface.family === 'string' ? 'IPv4' : 4;
      if (iface.family === familyV4 && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
};

const startServer = async (cfg: AppConfig) => {
  Logger.info('🚀 Starting College Helpdesk API server...');
  const PORT = cfg.port;
  const localIP = getLocalIP();

  const server = app.listen(PORT, '0.0.0.0', () => {
    Logger.info(`🚀 Server listening on http://0.0.0.0:${PORT}`);
    Logger.info(`📱 Local:   http://localhost:${PORT}`);
    Logger.info(`📱 Network: http://${localIP}:${PORT}`);
    Logger.info(`💚 Health:  http://localhost:${PORT}/health`);
  });

  server.on('error', (err: any) => {
    Logger.error(`❌ Server error: ${err}`);
    if (err.code === 'EADDRINUSE') Logger.error(`Port ${PORT} is already in use`);
    process.exit(1);
  });

  // Register routes
  try {
    registerRoutes(app);
    Logger.info('✅ Routes registered successfully');
  } catch (err) {
    Logger.error(`❌ Route registration failed: ${err}`);
  } finally {
    isAppReady = true;
    resolveAppReady!();
  }

  // Global error handler — must be last
  app.use(errorHandler);
};

process.on('uncaughtException', (err) => {
  Logger.error(`❌ Uncaught Exception: ${err.message}`);
  Logger.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

startServer(config).catch((err) => {
  Logger.error(`❌ Failed to start server: ${err}`);
  process.exit(1);
});
