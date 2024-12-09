import fastifyJwt, { type FastifyJWTOptions } from '@fastify/jwt'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'

// Declare o módulo para que a função `authenticate` seja conhecida no app
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>
  }
}

function jwtPlugin(
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  next: (err?: Error) => void,
): void {
  // Converta para o tipo esperado
  const jwtOptions = opts as FastifyJWTOptions

  app.register(fastifyJwt, {
    secret: jwtOptions.secret || process.env.JWT_SECRET || 'default_secret',
  })

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  next()
}

export default fp(jwtPlugin, {
  name: 'jwtPlugin',
})
