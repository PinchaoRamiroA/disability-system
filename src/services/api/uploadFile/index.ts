import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'

export async function uploadFile(
  file: string | ArrayBuffer,
  contentType: string
) {
  const response = await orchestratorWithAuthClient.post<{
    url: string
    contentType: string
  }>('/api/multimedia/subir', {
    data: file,
    format_type: 'base64',
    content_type: contentType,
  })

  return response.data
}

export async function getFile(reference: string) {
  const response = await orchestratorWithAuthClient.get<string>(
    `/api/multimedia/descargar/${reference}`,
    {
      responseType: 'arraybuffer',
    }
  )

  return response.data
}
