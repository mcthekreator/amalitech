import type { RetryConfig } from 'rxjs';

export const ICALC_CONNECTION = 'ICALC_CONNECTION';
export const DATABASE_CHUNK_SIZE = 500;

export const RETRY_CONFIG: RetryConfig = {
  count: 3,
  delay: 10000,
};

export const RESPONSE_TIMEOUT = 120000;
