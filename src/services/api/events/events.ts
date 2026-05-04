import { humanlAgentWithAuthClient } from '@/services/api/utilities/instances'
import { Events } from '@/types/Events'

export async function getEvents() {
  const response = await humanlAgentWithAuthClient.get<Events[]>(
    '/api/notAttendedEvents'
  )

  return response.data
}
