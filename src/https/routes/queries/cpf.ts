import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  fetchCpfFromWiseApi,
  type WiseApiCpfResponse,
} from '@/https/services/wiseApi'

export async function queryCpf(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/cpf/:cpf',
    {
      schema: {
        tags: ['CPF Queries'],
        summary: 'Consult a CPF',
        description: 'Retrieve CPF details from cache or external API.',
        params: z.object({
          cpf: z.string().regex(/^\d{11}$/, 'Invalid CPF format'),
        }),
        response: {
          200: z.object({
            data: z.object({
              cpf: z.string(),
              nome: z.string(),
              dataNascimento: z.date().nullable(),
              nomeMae: z.string(),
              nomePai: z.string().nullable(),
              renda: z.string(),
              telefones: z.array(z.string()),
            }),
            cacheHit: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cpf } = request.params

      console.log(`Querying CPF: ${cpf}`)

      let cachedData = await prisma.cachedData.findUnique({
        where: {
          queryType_queryValue: {
            queryType: 'CPF',
            queryValue: cpf,
          },
        },
      })

      if (cachedData) {
        console.log(`Cache hit for CPF: ${cpf}`)
        return reply.status(200).send({
          data: {
            cpf: cachedData.cpf ?? '',
            nome: cachedData.name ?? '',
            dataNascimento: cachedData.birthdate ?? null,
            nomeMae: cachedData.nomeMae ?? '',
            nomePai: cachedData.nomePai ?? null,
            renda: cachedData.renda?.toString() ?? '',
            telefones: cachedData.telefones ?? [],
          },
          cacheHit: true,
        })
      }

      console.log(`Cache miss for CPF: ${cpf}. Fetching from external API.`)

      const externalResponse: WiseApiCpfResponse =
        await fetchCpfFromWiseApi(cpf)

      // Process the data received from the API
      const rawBirthdate = externalResponse.data.DADOS_PESSOAIS.DATA_NASCIMENTO
      const validBirthdate =
        rawBirthdate && /^\d{2}\/\d{2}\/\d{4}$/.test(rawBirthdate)
          ? new Date(rawBirthdate.split('/').reverse().join('-'))
          : null

      const processedData = {
        cpf: externalResponse.data.DADOS_PESSOAIS.CPF,
        nome: externalResponse.data.DADOS_PESSOAIS.NOME,
        dataNascimento: validBirthdate,
        nomeMae: externalResponse.data.DADOS_PESSOAIS.NOME_MAE,
        nomePai:
          externalResponse.data.DADOS_PESSOAIS.NOME_PAI || 'Não informado',
        renda: externalResponse.data.DADOS_PESSOAIS.RENDA.replace(',', '.'),
        telefones: externalResponse.data.TELEFONES.map(
          (tel: { TELEFONE: string }) => tel.TELEFONE,
        ),
        atividade_principal: [], // Empty array for CPF query
        atividades_secundarias: [], // Empty array for CPF query
      }

      // Save to cache
      cachedData = await prisma.cachedData.create({
        data: {
          queryType: 'CPF',
          queryValue: cpf,
          name: processedData.nome,
          cpf: processedData.cpf,
          birthdate: processedData.dataNascimento,
          nomeMae: processedData.nomeMae,
          nomePai: processedData.nomePai,
          renda: processedData.renda,
          telefones: processedData.telefones,
          atividade_principal: processedData.atividade_principal,
          atividades_secundarias: processedData.atividades_secundarias,
        },
      })

      return reply.status(200).send({
        data: {
          cpf: processedData.cpf,
          nome: processedData.nome,
          dataNascimento: validBirthdate,
          nomeMae: processedData.nomeMae,
          nomePai: processedData.nomePai,
          renda: processedData.renda,
          telefones: processedData.telefones,
        },
        cacheHit: false,
      })
    },
  )
}
