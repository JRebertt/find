import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import fastifyRawBody, { type RawBodyPluginOptions } from 'fastify-raw-body'

function rawBodyPlugin(
  app: FastifyInstance,
  _opts: RawBodyPluginOptions,
  next: (err?: Error) => void,
): void {
  app.register(fastifyRawBody, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true,
  })

  next()
}

export default fp(rawBodyPlugin)
