import fastifySwagger, { type FastifySwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

function swaggerPlugin(
  app: FastifyInstance,
  _opts: FastifySwaggerOptions,
  next: (err?: Error) => void,
): void {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API Documentation',
        description: 'Generated API documentation.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform, // Passando a transformação aqui
  })

  app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
    },
  })

  next()
}

export default fp(swaggerPlugin)
