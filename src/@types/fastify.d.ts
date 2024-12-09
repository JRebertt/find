import 'fastify'

import type {
  Member,
  Organization,
  User,
  SubscriptionType,
} from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    /**
     * Retorna o ID do usuário autenticado.
     * @returns ID do usuário (string).
     */
    getCurrentUserId(): Promise<string>

    /**
     * Retorna a associação do usuário em uma organização específica.
     * @param slug - Slug da organização.
     * @returns Organização e detalhes da associação.
     */
    getUserMembership(slug: string): Promise<{
      organization: Organization
      membership: Member
    }>
  }
}
