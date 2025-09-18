import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middlewares (OWASP compliance)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(compression());

  // CORS configuration - Enhanced with better error handling
  const allowedOrigins = [
    'http://localhost:3000', // Local development
    'http://localhost:3001', // Alternative local port
    'https://talksyapp.vercel.app', // Your old Vercel deployment
    'https://talksyv1.vercel.app', // Your current Vercel deployment
    'https://talksy-ujgy.onrender.com', // Your backend URL (for self-referencing)
    configService.get('FRONTEND_URL'), // Environment variable fallback
  ].filter(Boolean); // Remove any undefined values

  console.log('Allowed CORS origins:', allowedOrigins);
  console.log('Environment:', process.env.NODE_ENV);

  app.enableCors({
    origin: (origin, callback) => {
      console.log('CORS request from origin:', origin);

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        console.log('No origin - allowing request');
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        return callback(null, true);
      }

      // For development, be more permissive
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - allowing all origins');
        return callback(null, true);
      }

      // Check for localhost variations
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.log('Localhost origin - allowing:', origin);
        return callback(null, true);
      }

      // Log rejected origin for debugging
      console.error('CORS blocked origin:', origin);
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200, // Changed from 204 to 200 for better compatibility
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(
    `Backend server running on port ${port} | Allowed origins: ${allowedOrigins.join(', ')}`,
  );
}

bootstrap();
