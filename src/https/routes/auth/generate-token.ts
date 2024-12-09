import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function generateToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/tokens/generate',
    {
      schema: {
        tags: ['Tokens'],
        summary: 'Generate a new access token for a user',
        description:
          'Creates a device-specific token for a user, useful for accessing the API.',
        body: z.object({
          userId: z.string(), // ID do usuário
          metadata: z
            .object({
              name: z.string().optional(),
              location: z.string().optional(),
            })
            .optional(),
        }),
        response: {
          201: z.object({
            token: z.string(),
            expiresAt: z.date().nullable(),
            metadata: z
              .object({
                name: z.string().optional(),
                location: z.string().optional(),
              })
              .optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId, metadata } = request.body

      // Verifica se o usuário já existe
      let user = await prisma.user.findUnique({
        where: { id: userId },
      })

      // Se o usuário não existir, cria automaticamente
      if (!user) {
        console.log(`User not found. Creating new user with ID: ${userId}`)
        user = await prisma.user.create({
          data: {
            id: userId,
            name: metadata?.name || 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      }

      console.log(
        `User found or created. Proceeding to generate token for userId: ${user.id}`,
      )

      // Gera um token único
      const tokenValue = crypto.randomUUID()

      // Registra o token no banco de dados
      const token = await prisma.deviceToken.create({
        data: {
          value: tokenValue,
          metadata: metadata || {},
          userId: user.id,
        },
      })

      console.log('Token successfully created in the database:', token)

      // Retorna o token gerado
      return reply.status(201).send({
        token: token.value,
        expiresAt: token.expiresAt ?? null,
        metadata: token.metadata as { name?: string; location?: string },
      })
    },
  )
}
