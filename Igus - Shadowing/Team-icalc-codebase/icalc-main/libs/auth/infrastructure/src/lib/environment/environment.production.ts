import { postgresEnvironment } from '@igus/icalc-postgres';
import { Env, LogLevel } from '@igus/kopla-data';
import type { Environment } from './environment.interface';

export const getEnv: () => Environment = () => {
  return {
    appName: 'icalc',
    logger: {
      logLevel: LogLevel.info,
    },
    service: {
      host: '0.0.0.0',
      accessHost: 'data-icalc.igus.tools',
      runPort: 3000,
      accessPort: 443,
      id: '1565173c-ec19-459a-8e32-f3d5f760217f',
    },
    docs: {
      user: 'kopla',
      password: process.env.SWAGGER_PASSWORD,
    },
    sentry: {
      dns: 'https://0fe2d11bd08f425e8cf3f0f225bb4689@o263529.ingest.sentry.io/6258369',
      tracesSampleRate: 0.01,
    },
    env: Env.production,
    icalcFrontend: 'https://icalc.igus.tools',
    postGres: postgresEnvironment.production,
    ierp: {
      hostname: 'https://api.igus.io',
      namespace: 'mdp',
      subscriptionKey: process.env.IERP_SUBSCRIPTION_KEY,
    },
    akeneoData: {
      userName: process.env.AKENEO_USERNAME,
      password: process.env.AKENEO_PASSWORD,
      authenticationUrl: `${process.env.AKENEO_URL}/api/oauth/v1/token`,
      timeoutInMs: 10000,
      productsUrl: `${process.env.AKENEO_URL}/api/rest/v1/products`,
      clientId: process.env.AKENEO_CLIENT_ID,
      clientSecret: process.env.AKENEO_SECRET,
    },
    smtpMailData: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'de-icalc-support@igusgmbh.onmicrosoft.com',
        pass: process.env.SMTP_PASSWORD,
      },
      requireTLS: true,
      senderMail: '"iCalc Support" <de-icalc-support@igusgmbh.onmicrosoft.com>',
    },
    initialUser: [
      { firstName: 'Konstantin', lastName: 'Kluev', email: 'kkluev@igus.net', role: '' },
      { firstName: 'Stefan', lastName: 'Niesen', email: 'sniesen@igus.net', role: '' },
      { firstName: 'Bente', lastName: 'Schwarz', email: 'BSchwarz@igus.net', role: '' },
      { firstName: 'Thomas', lastName: 'Seel', email: 'tseel@igus.net', role: '' },
      { firstName: 'Sebastiaan', lastName: 'Koelewijn', email: 'skoelewijn@igus.net', role: '' },
      { firstName: 'Raphael', lastName: 'Friedli', email: 'rfriedli@igus.net', role: '' },
      { firstName: 'Dimitrios', lastName: 'Tsekmetzis', email: 'dtsekmetzis@igus.net', role: '' },
      { firstName: 'Emile', lastName: 'Scott', email: 'escott@igus.net', role: '' },
      { firstName: 'Dennis', lastName: 'Eichhorst', email: 'deichhorst@igus.net', role: '' },
      { firstName: 'Dirk', lastName: 'Heidgen', email: 'dheidgen@igus.net', role: '' },
      { firstName: 'Wolfgang', lastName: 'Kahl', email: 'wkahl@igus.net', role: '' },
      { firstName: 'Nico', lastName: 'Tiegs', email: 'ntiegs@igus.net', role: '' },
      { firstName: 'Lars', lastName: 'Ruhnau', email: 'lars.ruhnau@aleri.de', role: '' },
    ],
    auth: {
      atSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
      rtSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
      atTimeout: process.env.JWT_ACCESS_TOKEN_TIMEOUT || '15m',
      rtTimeout: process.env.JWT_REFRESH_TOKEN_TIMEOUT || '3d',
    },
    widen: {
      searchUrl: 'https://api.widencollective.com/v2/assets/search',
      uploadUrl: 'https://api.widencollective.com/v2/uploads/',
      deleteUrl: 'https://api.widencollective.com/v2/assets/',
      bearerToken: 'Bearer ' + process.env.WIDEN_BEARER_TOKEN,
      profile: 'iCalc Uploads',
    },
  };
};
