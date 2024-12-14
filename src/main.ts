import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  // app.enableCors({
  //   origin: /https?:\/\/(.+\.)?docquizz\.top$/, // Allow all subdomains of example.com
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true, // If you need to allow credentials (cookies, authorization headers)
  // });

  /**
   * Swagger configuration
   */
  const config = new DocumentBuilder()
    .setTitle('Tender API')
    .setDescription('The Tender API description')
    .setVersion('1.0')
    .addTag('tender')
    .build();


  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customCssUrl: "https://cdn.jsdelivr.net/gh/ajatkj/swagger-ui-improved-theme/css/swagger-ui-improved.css"
  });




  await app.listen(3000);
}
bootstrap();
