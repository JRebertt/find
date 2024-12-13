import axios from 'axios'
import { env } from '@/env'

const API_URL = 'https://receitaws.com.br/v1/cnpj'

export interface ReceitaWsCnpjResponse {
  abertura: string
  atividade_principal: { code: string; text: string }[]
  atividades_secundarias: { code: string; text: string }[]
  bairro: string
  billing: { database: boolean; free: boolean }
  capital_social: string
  cep: string
  cnpj: string
  complemento: string
  data_situacao: string
  data_situacao_especial: string
  efr: string
  email: string
  extra: Record<string, unknown>
  fantasia: string
  logradouro: string
  motivo_situacao: string
  municipio: string
  natureza_juridica: string
  nome: string
  numero: string
  porte: string
  qsa: Array<Record<string, unknown>>
  simei: {
    data_exclusao: string | null
    data_opcao: string
    optante: boolean
    ultima_atualizacao: string
  }
  simples: {
    data_exclusao: string | null
    data_opcao: string
    optante: boolean
    ultima_atualizacao: string
  }
  situacao: string
  situacao_especial: string
  status: string
  telefone: string
  tipo: string
  uf: string
  ultima_atualizacao: string
}

/**
 * Consulta um CNPJ na API externa ReceitaWS.
 * @param cnpj - CNPJ a ser consultado.
 * @returns Dados do CNPJ.
 */
export async function fetchCnpjFromReceitaWs(
  cnpj: string,
): Promise<ReceitaWsCnpjResponse> {
  try {
    const response = await axios.get(`${API_URL}/${cnpj}`)

    if (response.status !== 200) {
      throw new Error(`ReceitaWS API error: ${response.statusText}`)
    }

    const data = response.data as ReceitaWsCnpjResponse
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch CNPJ data: ${error.message}`)
    } else {
      console.error('An unknown error occurred while fetching CNPJ data.')
    }
    throw new Error('Failed to fetch CNPJ data from ReceitaWS.')
  }
}
