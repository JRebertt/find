import axios from 'axios'

const API_KEY = 'sk_01je1kxxankvry5ab2c195k10n01je1kxxanceg78ssd884j6wde'
const API_URL = 'https://api.wiseapi.io/v1/cpf'

export interface WiseApiCpfResponse {
  data: {
    DADOS_PESSOAIS: {
      NOME: string
      CPF: string
      DATA_NASCIMENTO: string
      NOME_MAE: string
      NOME_PAI?: string
      RENDA: string
    }
    TELEFONES: {
      TELEFONE: string
    }[]
    PARENTES?: {
      CPF: string
      NOME: string
      VINCULO: string
    }[]
  }
}

/**
 * Consulta um CPF na API externa WiseAPI.
 * @param cpf - CPF a ser consultado.
 * @returns Dados do CPF.
 */
export async function fetchCpfFromWiseApi(
  cpf: string,
): Promise<WiseApiCpfResponse> {
  try {
    const response = await axios.get(`${API_URL}/${cpf}`, {
      headers: {
        'x-wise-key': API_KEY,
      },
    })

    if (response.status !== 200) {
      throw new Error(`WiseAPI error: ${response.statusText}`)
    }

    const data = response.data as WiseApiCpfResponse
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch CPF data: ${error.message}`)
    } else {
      console.error('An unknown error occurred while fetching CPF data.')
    }
    throw new Error('Failed to fetch CPF data from WiseAPI.')
  }
}
