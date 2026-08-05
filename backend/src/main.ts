// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { NestExpressApplication } from "@nestjs/platform-express";
// import { join } from "path";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  

//  app.enableCors({
//   origin: [
//     'http://localhost:3000',
//     'https://wedding-planner-liart.vercel.app',
//   ],
//   credentials: true,
// });
// // app.enableCors({
// //   origin: [process.env.FRONTEND_URL],
// //   credentials: true,
// // });
//   app.setGlobalPrefix('api/v1');

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   const config = new DocumentBuilder()
//     .setTitle('Wedding Planner API')
//     .setDescription('API Documentation for Wedding Planner')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   await app.listen(process.env.PORT ?? 8000, '0.0.0.0');

// console.log(
//   `🚀 Server running on http://localhost:${process.env.PORT ?? 8000}/api/v1`,
// );

// console.log(
//   `📚 Swagger: http://localhost:${process.env.PORT ?? 8000}/api`,
// );
// }

// bootstrap();


import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import {
  NestExpressApplication,
} from '@nestjs/platform-express';

import { join } from 'path';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

app.enableCors({
  origin: true,
  credentials: true,
});

  // Static files (Invoices, uploads, etc.)
  app.useStaticAssets(
    join(
      process.cwd(),
      'uploads',
    ),
    {
      prefix: '/uploads',
    },
  );

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config =
    new DocumentBuilder()
      .setTitle(
        'Wedding Planner API',
      )
      .setDescription(
        'API Documentation for Wedding Planner',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  const port =
    process.env.PORT ?? 8000;

  await app.listen(
    port,
    '0.0.0.0',
  );

  console.log(
    `🚀 Server running on http://localhost:${port}/api/v1`,
  );

  console.log(
    `📚 Swagger: http://localhost:${port}/api`,
  );

  console.log(
    `📄 Uploads: http://localhost:${port}/uploads`,
  );
}

bootstrap();