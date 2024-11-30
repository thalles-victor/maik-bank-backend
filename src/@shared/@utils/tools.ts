import { InternalServerErrorException } from '@nestjs/common';
import { env } from './env';
import { ClassConstructor, plainToInstance } from 'class-transformer';

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

export function getWhereConditions<T>(
  filters: Record<string, any>,
  sanitizeClass: ClassConstructor<T>,
) {
  let whereConditions: any = null;

  if (filters) {
    whereConditions = {};
    const transformedFilters = plainToInstance(sanitizeClass, filters, {
      excludeExtraneousValues: true,
    });

    Object.entries(transformedFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        whereConditions[key] = value;
      }
    });
  }

  return whereConditions;
}
