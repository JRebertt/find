import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'
import jwtPlugin from './plugins/jwt'
import rawBodyPlugin from './plugins/raw-body'
import swaggerPlugin from './plugins/swagger'

import healthRoutes from './routes/health'
import { queryCpf } from './routes/queries/cpf'
import { generateToken } from './routes/auth/generate-token'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

// Configurações adicionais
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

// Plugins
app.register(fastifyCors)
app.register(rawBodyPlugin)
app.register(swaggerPlugin)
app.register(jwtPlugin)

// Rotas
app.register(healthRoutes, { prefix: '/health' })
app.register(generateToken)
app.register(queryCpf)
// app.register(authRoutes, { prefix: '/auth' })
