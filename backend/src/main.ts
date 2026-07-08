import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://wedding-planner-liart.vercel.app',
  ],
  credentials: true,
});
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Wedding Planner API')
    .setDescription('API Documentation for Wedding Planner')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 8000, '0.0.0.0');

console.log(
  `🚀 Server running on http://localhost:${process.env.PORT ?? 8000}/api/v1`,
);

console.log(
  `📚 Swagger: http://localhost:${process.env.PORT ?? 8000}/api`,
);
}

bootstrap();