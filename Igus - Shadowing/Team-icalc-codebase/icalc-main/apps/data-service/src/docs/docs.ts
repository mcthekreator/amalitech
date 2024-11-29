import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { RedocOptions } from '@juicyllama/nestjs-redoc';
import { RedocModule } from '@juicyllama/nestjs-redoc';
import { getEnvironment } from '@igus/icalc-auth-infrastructure';
import { DATA_SERVICE_VERSION } from '../version';

export const setupDocs = async (app: INestApplication): Promise<void> => {
  const title = 'iCalc Data Service';

  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription('This documents the icalc data service.')
    .setVersion(DATA_SERVICE_VERSION)
    .addSecurity('ServiceId', {
      type: 'apiKey',
      in: 'header',
      name: 'Kopla-Service-ID',
      description: 'A mandatory service ID used to authenticate with the service.',
    })
    .build();

  const { password, user } = getEnvironment().docs;
  const redocOptions: RedocOptions = {
    title,
    logo: {
      url: 'https://www.igus.de/images/logo/igus-logo.svg',
      altText: 'Igus company logo',
    },
    tagGroups: [],
    expandResponses: '200,201',
    noAutoAuth: false,
    auth: {
      enabled: true,
      user,
      password,
    },
  };

  const document = SwaggerModule.createDocument(app, options);

  return RedocModule.setup('/docs', app, document, redocOptions);
};
