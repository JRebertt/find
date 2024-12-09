import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

function healthRoutes(
  app: FastifyInstance,
  _opts: Record<string, unknown>,
  next: (err?: Error) => void,
): void {
  app.get('/', (_request: FastifyRequest, reply: FastifyReply): void => {
    reply.send({ status: 'ok' })
  })

  next()
}

export default healthRoutes
