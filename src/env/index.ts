import 'dotenv/config'
import { z } from 'zod'

const envSchemas = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  WISEAPI_SK: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchemas.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
