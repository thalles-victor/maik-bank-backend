import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  // Jwt
  JWT_SECRET: z.string().min(100),

  // Postgres
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  // POSTGRES_SSL: z
  //   .string()
  //   .refine(
  //     (val) => val.toLowerCase() === 'true' || val.toLowerCase() === 'false',
  //     {
  //       message: "POSTGRES_SSL must be 'true' or 'false'",
  //     },
  //   )
  //   .transform((val) => val.toLowerCase() === 'true'),

  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string(),

  // Admin
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,100}$/, {
      message:
        'A senha deve ter 8 carecteres, um especial um maúsculo e um número no mínimo',
    }),

  // Self backend
  BACKEND_BASE_URL: z.string().url(),
  BACKEND_PORT: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'POSTGRES_PORT must be a valid number',
    })
    .transform((val) => parseInt(val, 10)),
  ALLOW_CORS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
