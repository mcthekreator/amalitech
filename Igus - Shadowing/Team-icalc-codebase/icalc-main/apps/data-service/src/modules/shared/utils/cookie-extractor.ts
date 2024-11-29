import type { Request as Req } from 'express';

export const cookieExtractor = (request: Req, cookieName: string): string => {
  let result = '';
  const cookieString = request?.headers.cookie;

  if (!cookieString || typeof cookieString !== 'string') {
    return '';
  }
  try {
    result = cookieString
      .split(';')
      .map((value) => value.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {})?.[cookieName];
  } catch (error) {
    result = '';
  }
  return result;
};
