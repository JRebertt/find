import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from '../routes/_error/unauthorized-error'

export const authMiddleware = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    // Extrai o token do cabeçalho
    const token = request.headers['x-wise-key']
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedError('Missing or invalid authentication token.')
    }

    // Verifica se o token é válido no banco
    const deviceToken = await prisma.deviceToken.findUnique({
      where: { value: token },
      include: { user: true },
    })

    if (!deviceToken || !deviceToken.isActive) {
      throw new UnauthorizedError('Invalid or expired token.')
    }

    // Disponibiliza o ID do usuário e permissões no request
    request.getCurrentUserId = async () => deviceToken.userId
  })
})
