import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

import { BadRequestError } from './routes/_error/bad-request-error'
import { UnauthorizedError } from './routes/_error/unauthorized-error'

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  // Zod validation errors
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
    return
  }

  // Custom bad request error
  if (error instanceof BadRequestError) {
    reply.status(400).send({
      message: error.message,
    })
    return
  }

  // Custom unauthorized error
  if (error instanceof UnauthorizedError) {
    reply.status(401).send({
      message: error.message,
    })
    return
  }

  // Log internal errors for debugging or observability
  console.error({
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  })

  // Send a generic response for unexpected errors
  reply.status(500).send({ message: 'Internal server error' })
}
