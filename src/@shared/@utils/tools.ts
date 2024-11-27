import { InternalServerErrorException } from '@nestjs/common';
import { env } from './env';

export function splitKeyAndValue(param: object) {
  const [key, value] = Object.entries(param)[0];

  if (!key || !value) {
    console.error('require key and value');
    throw new InternalServerErrorException();
  }

  return [key, value];
}

export function checkAdminCredentials(email: string, password: string) {
  return env.ADMIN_EMAIL === email && password === env.ADMIN_PASSWORD;
}

export function isAdmin(email: string) {
  return env.ADMIN_EMAIL === email;
}
