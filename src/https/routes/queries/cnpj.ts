import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  fetchCnpjFromReceitaWs,
  type ReceitaWsCnpjResponse,
} from '@/https/services/receita-ws-cnpj-api'

export async function queryCnpj(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/cnpj/:cnpj',
    {
      schema: {
        tags: ['CNPJ Queries'],
        summary: 'Consult a CNPJ',
        description: 'Retrieve CNPJ details from cache or external API.',
        params: z.object({
          cnpj: z.string().regex(/^\d{14}$/, 'Invalid CNPJ format'),
        }),
        response: {
          200: z.object({
            data: z.object({
              cnpj: z.string(),
              nome: z.string(),
              abertura: z.string(),
              natureza_juridica: z.string(),
              logradouro: z.string(),
              numero: z.string(),
              complemento: z.string(),
              bairro: z.string(),
              cep: z.string(),
              municipio: z.string(),
              uf: z.string(),
              telefone: z.string(),
              email: z.string(),
              situacao: z.string(),
              data_situacao: z.string(),
              capital_social: z.string(),
              atividade_principal: z.array(
                z.object({
                  code: z.string(),
                  text: z.string(),
                }),
              ),
              atividades_secundarias: z.array(
                z.object({
                  code: z.string(),
                  text: z.string(),
                }),
              ),
            }),
            cacheHit: z.boolean(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cnpj } = request.params

      console.log(`Querying CNPJ: ${cnpj}`)

      let cachedData = await prisma.cachedData.findUnique({
        where: {
          queryType_queryValue: {
            queryType: 'CNPJ',
            queryValue: cnpj,
          },
        },
      })

      if (cachedData) {
        return reply.status(200).send({
          data: {
            cnpj: cachedData.cnpj ?? '',
            nome: cachedData.name ?? '',
            abertura: cachedData.abertura ?? '',
            natureza_juridica: cachedData.natureza_juridica ?? '',
            logradouro: cachedData.logradouro ?? '',
            numero: cachedData.numero ?? '',
            complemento: cachedData.complemento ?? '',
            bairro: cachedData.bairro ?? '',
            cep: cachedData.cep ?? '',
            municipio: cachedData.municipio ?? '',
            uf: cachedData.uf ?? '',
            telefone: cachedData.telefone ?? '',
            email: cachedData.email ?? '',
            situacao: cachedData.situacao ?? '',
            data_situacao: cachedData.data_situacao ?? '',
            capital_social: cachedData.capital_social ?? '',
            atividade_principal: cachedData.atividade_principal as Array<{
              code: string
              text: string
            }>,
            atividades_secundarias: cachedData.atividades_secundarias as Array<{
              code: string
              text: string
            }>,
          },
          cacheHit: true,
        })
      }

      console.log(`Cache miss for CNPJ: ${cnpj}. Fetching from external API.`)

      const externalResponse: ReceitaWsCnpjResponse =
        await fetchCnpjFromReceitaWs(cnpj)

      // Process the data received from the API
      const processedData = {
        cnpj: externalResponse.cnpj,
        nome: externalResponse.nome,
        abertura: externalResponse.abertura,
        natureza_juridica: externalResponse.natureza_juridica,
        logradouro: externalResponse.logradouro,
        numero: externalResponse.numero,
        complemento: externalResponse.complemento,
        bairro: externalResponse.bairro,
        cep: externalResponse.cep,
        municipio: externalResponse.municipio,
        uf: externalResponse.uf,
        telefone: externalResponse.telefone,
        email: externalResponse.email,
        situacao: externalResponse.situacao,
        data_situacao: externalResponse.data_situacao,
        capital_social: externalResponse.capital_social,
        atividade_principal: externalResponse.atividade_principal.map(
          (activity) => ({
            code: activity.code,
            text: activity.text,
          }),
        ),
        atividades_secundarias: externalResponse.atividades_secundarias.map(
          (activity) => ({
            code: activity.code,
            text: activity.text,
          }),
        ),
      }

      // Save to cache
      cachedData = await prisma.cachedData.create({
        data: {
          queryType: 'CNPJ',
          queryValue: cnpj,
          ...processedData,
        },
      })

      return reply.status(200).send({
        data: processedData,
        cacheHit: false,
      })
    },
  )
}
