import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './interceptors/response.transform.interceptor';
import * as bodyParser from 'body-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.enableCors();

  // Set payload size limits
  app.use(bodyParser.json({ limit: '20mb' }));

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { docExpansion: 'none', persistAuthorization: true },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: process.env.API_TITLE,
  };

  // swagger documentation config
  // const options = new DocumentBuilder()
  //   .setTitle(process.env.API_TITLE || 'API')
  //   .setDescription(process.env.API_DESCRIPTION || 'API Description')
  //   .setVersion(process.env.API_VERSION || '1.0')
  //   .setBasePath(process.env.API_PREFIX || '/api')
  //   .addBearerAuth()
  //   .addServer(`${process.env.HOST}:${process.env.PORT}`)
  //   .build();

  const options = new DocumentBuilder()
    .setTitle(process.env.API_TITLE || 'API')
    .setDescription(process.env.API_DESCRIPTION || 'API Description')
    .setVersion(process.env.API_VERSION || '1.0')
    .addBearerAuth()
    .addServer(
      process.env.API_BASE_URL ||
      `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document, customOptions);

  if (module.ho) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
