import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { Channels } from '@/types/Channel'

export async function getChannels() {
  const response = await orchestratorWithAuthClient.get<Channels>(
    '/api/types/channels'
  )

  return response.data
}
