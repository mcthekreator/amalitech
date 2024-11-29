import type { Env, LogLevel } from '@igus/kopla-data';
import type { NewUserDTO } from '@igus/icalc-domain';

/**
 * The environment configuration
 */
export interface Environment {
  appName: string;
  logger: { logLevel: LogLevel };
  service: {
    host: string;
    runPort: number;
    accessHost: string;
    accessPort: number;
    id: string;
  };
  docs: {
    user: string;
    password: string;
  };
  sentry: {
    dns: string;
    tracesSampleRate: number;
  };
  env: Env;
  icalcFrontend: string;
  postGres?: {
    postgresHost?: string;
    postgresPort?: number;
    postgresUser?: string;
    postgresPassword?: string;
    postgresDatabase?: string;
    postGresRegion?: string;
    ssl?: { ca: string };
    isLocal: boolean;
  };
  ierp?: {
    hostname: string;
    namespace: string;
    subscriptionKey: string;
  };
  akeneoData?: {
    userName: string;
    password: string;
    authenticationUrl: string;
    clientId: string;
    clientSecret: string;
    timeoutInMs: number;
    productsUrl: string;
  };
  smtpMailData?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    requireTLS: boolean;
    senderMail: string;
  };
  initialUser?: NewUserDTO[];
  auth: {
    atSecret: string;
    rtSecret: string;
    atTimeout: string;
    rtTimeout: string;
  };
  widen: {
    searchUrl: string;
    uploadUrl: string;
    deleteUrl: string;
    bearerToken: string;
    profile: string;
  };
}
