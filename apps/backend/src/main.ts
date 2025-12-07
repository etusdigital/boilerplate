import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import {
  getCorsOrigins,
  createCorsOriginCallback,
  corsOptions,
} from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const allowedOrigins = getCorsOrigins();

  app.enableCors({
    origin: createCorsOriginCallback(allowedOrigins),
    ...corsOptions,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
