// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import cookieParser from 'cookie-parser';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   // const app = await NestFactory.create(AppModule);
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       transformOptions: { enableImplicitConversion: true },
//     }),
//   );

//   app.use(cookieParser());

//   app.enableCors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   });

//   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//     prefix: '/uploads/',
//   });

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(cookieParser());

  // Update CORS to allow both localhost and Netlify domain
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://leave-and-salary-managment.netlify.app'
    ],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();