import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import initializeDB from '../config/dbConfig';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Rutas
import userRouter from './routes/user.routes';
import categoryRouter from './routes/category.routes';
import technologyRouter from './routes/technology.routes';
import projectRouter from './routes/project.routes';
import studyRouter from './routes/study.routes';
import BadgeRouter from './routes/badge.routes';
import { setupSwagger } from './config/swagger';
import { sanitizeRequest } from './middleware/sanitizeRequest';
import studyTypeRouter from './routes/study-type.router';
import studyStateRouter from './routes/study_state.router';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Configuración de orígenes permitidos
const whiteList = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    process.env.ORIGIN1,
    process.env.ORIGIN2
].filter((origin): origin is string => Boolean(origin));

console.log('Orígenes permitidos:', whiteList);

// Configuración de seguridad
// 1. Helmet para cabeceras de seguridad
app.use(helmet());

// 2. Configuración de CORS mejorada
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, origin?: string | boolean) => void) {
        // En desarrollo, permitir todos los orígenes
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        // En producción, verificar contra la lista blanca
        if (whiteList.length === 0) {
            console.warn('⚠️  Advertencia: No se han configurado orígenes permitidos en la lista blanca');
            return callback(null, true);
        }

        // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
        if (!origin) {
            return callback(null, true);
        }

        if (whiteList.includes(origin)) {
            console.log('✅ Origen permitido:', origin);
            return callback(null, true);
        }

        console.log('❌ Origen no permitido:', origin);
        return callback(new Error('No permitido por CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    credentials: true,
    maxAge: 86400, // 24 horas
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Aplicar configuración CORS
app.use(cors(corsOptions));

// Manejar solicitudes OPTIONS (preflight)
app.options(/.*/, cors(corsOptions));

// 3. Middleware para parsear JSON (debe ir antes de cualquier ruta)
app.use(express.json({
    limit: '10kb',
    strict: true
}));

// 4. Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos'
});

// Aplicar rate limiting a todas las rutas de API
app.use('/api', limiter);

// 5. Sanitización contra inyección NoSQL
app.use(sanitizeRequest);

// 6. Prevenir parámetros de consulta maliciosos
app.use((req, res, next) => {
    // Eliminar parámetros de consulta que comiencen con $
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (key.startsWith('$')) {
                delete req.query[key];
            }
        });
    }
    next();
});

// 7. Headers de seguridad adicionales
app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// 8. Configuración del parser de cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Rutas de la API
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/technologies', technologyRouter);
app.use('/api/projects', projectRouter);
app.use('/api/studies', studyRouter);
app.use('/api/badges', BadgeRouter);
app.use('/api/study-types', studyTypeRouter);
app.use('/api/study-states', studyStateRouter);

// Configurar Swagger Documentation
setupSwagger(app);

// Ruta de verificación de estado
app.get('/', (req, res) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.send('API corriendo - Documentación en /api-docs');
});

// Manejador de errores global
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Algo salió mal!',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

const main = async () => {
    try {
        await initializeDB();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor corriendo en:
     - Local: http://localhost:${PORT}
     - Red:   http://${getLocalIP()}:${PORT}`);
        });

        function getLocalIP() {
            const os = require('os');
            const nets = os.networkInterfaces();
            let ip = 'localhost'; // valor por defecto

            for (const name of Object.keys(nets)) {
                for (const net of nets[name]) {
                    if (net.family === 'IPv4' && !net.internal) {
                        console.log(`🌐 IP detectada (${name}): ${net.address}`);
                        ip = net.address; // guarda la IP
                    }
                }
            }

            return ip; // <--- devuelve la IP detectada
        }



    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

main();