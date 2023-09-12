import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
// import * as functions from 'firebase-functions';
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from 'src/common/configs/config.interface';

import * as admin from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASEADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASEADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASEADMIN_PRIVATE_KEY,
  client_email: process.env.FIREBASEADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASEADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASEADMIN_AUTH_URI,
  token_uri: process.env.FIREBASEADMIN_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASEADMIN_AUTH_PROVIDER_X509_CERT_URL ||
    'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASEADMIN_CLIENT_X509_CERT_URL,
  universe_domain:
    process.env.FIREBASEADMIN_UNIVERSE_DOMAIN || 'googleapis.com',
} as admin.ServiceAccount;
Logger.debug(serviceAccount);
// Init Firebase Admin
admin.initializeApp({
  // credential: admin.credential.applicationDefault(),
  credential: admin.credential.cert(serviceAccount),
});

// Using express webserver
const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }
  await app.listen(process.env.PORT || nestConfig.port || 3000);
}
bootstrap();

// exports.apis = functions.region('asia-southeast2').https.onRequest(server);
