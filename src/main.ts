import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RateLimiterGuard } from 'nestjs-rate-limiter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.useGlobalGuards(new RateLimiterGuard());
  // ... existing code ...
  app.useGlobalGuards(
    new RateLimiterGuard(
      {
        for: 'Express',
        type: 'Memory',
        points: 10,
        duration: 5,
        errorMessage: 'Too many requests',
        customResponseSchema: (rateLimiterResponse) => ({
          statusCode: 429,
          message:
            'Too many requests, You have exceeded the allowed number of requests. Please try again in shortly',
          retryAfter: `${Math.round(rateLimiterResponse.msBeforeNext / 1000)}s`, // الوقت المتبقي بالثواني
          limit: 2, // الحد الأقصى للطلبات
          remaining: rateLimiterResponse.remainingPoints, // العدد المتبقي من الطلبات
        }),
      },
      new Reflector(),
    ),
  );
  // ... existing code ...

  // app.useGlobalFilters(new HttpExceptionFilter());
  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    credentials: true,
  });

const port = process.env.PORT || 3000;
await app.listen(port, '0.0.0.0');

}
bootstrap();
