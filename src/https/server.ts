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

const app = fastify().withTypeProvider<ZodTypeProvider>()

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

//  app.listen({ port: 3000, host: '0.0.0.0' }).then(function (): void {
//   console.log('HTTP server running 🚀');
// }).catch(function (err: Error): void {
//   app.log.error(err);
//   process.exit(1);
// });

app.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running 🚀')
})
